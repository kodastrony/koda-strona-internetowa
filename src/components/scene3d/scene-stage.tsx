"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { useTier, downgradeTier, TIER_PROFILES } from "@/lib/device-tier";

/* Watchdog reaguje TYLKO gdy karta jest WIDOCZNA. W tle przeglądarka dławi rAF
   (klatki rzadkie) → PerformanceMonitor widziałby fałszywe „1 FPS" i zbiłby tier
   (mocny komputer spadłby z high po samym przełączeniu karty — a downgrade jest
   jednokierunkowy). Ten strażnik blokuje DPR↓/downgrade, gdy dokument ukryty. */
const isDocVisible = () => typeof document === "undefined" || !document.hidden;

/* ── Watchdog FPS ──────────────────────────────────────────────────────────
   onDecline → łagodne DPR↓ (drei stabilizuje płynność). Tier-downgrade (drastyczny:
   zdejmuje canvasy, finalnie bail na poster) NIE leci już z onFallback/flipflops —
   to liczyło WAHANIA fps wokół 60 (intro, generacja PMREM, GC) jako spadki i po
   ~10 s fałszywie zbijało low→static (litery „znikały" → poster). Teraz downgrade
   tylko gdy fps jest REALNIE niski (<30) i UTRZYMUJE się >5 s, i to dopiero gdy
   DPR jest już przy podłodze (najpierw tańsza adaptacja). isTierForced() + ukryta
   karta dodatkowo blokują (override testowy ma być stabilny). */
function useWatchdog(setDpr: (v: React.SetStateAction<number>) => void, currentDpr: number) {
  const lowSince = useRef<number | null>(null);
  const dprRef = useRef(currentDpr);
  useEffect(() => {
    dprRef.current = currentDpr;
  }, [currentDpr]);
  return useMemo(
    () => ({
      onDecline: () => {
        // Podłoga 0.85 (było 1.0): słaby iGPU dostaje dodatkowe ~28% zapasu fill-rate,
        // zanim watchdog w ogóle rozważy zejście tieru (treść/litery nadal czytelne).
        if (isDocVisible()) setDpr((d) => Math.max(0.85, +(d - 0.2).toFixed(2)));
      },
      onChange: ({ fps }: { fps: number }) => {
        if (!isDocVisible() || dprRef.current > 1.05) {
          lowSince.current = null;
          return;
        }
        if (fps > 0 && fps < 30) {
          const now = performance.now();
          if (lowSince.current === null) lowSince.current = now;
          else if (now - lowSince.current > 5000) {
            lowSince.current = null;
            downgradeTier();
          }
        } else {
          lowSince.current = null;
        }
      },
    }),
    [setDpr]
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SceneStage — wspólna „scena" canvasu 3D hero strony głównej.

   Jedno miejsce odpowiedzialne za WSZYSTKIE obowiązki around-the-canvas:
   - lazy chunk (Canvas montowany przez next/dynamic w hero-shell),
   - DPR clamp [1 .. 1.75] + degradacja przy spadkach fps (PerformanceMonitor),
   - pauza renderu poza viewportem (IntersectionObserver → frameloop),
   - prefers-reduced-motion → frameloop "demand": JEDNA ładna klatka, zero
     ruchu (sceny dostają reduced=true i mrożą uniformy czasu),
   - brak WebGL / utrata kontekstu → statyczny poster (CSS),
   - miękkie wejście (fade) zsynchronizowane z reveal'em treści hero.

   Sceny dostają { reduced, quality } i NIE dotykają niczego poza canvasem.
   ══════════════════════════════════════════════════════════════════════════ */

export interface SceneProps {
  reduced: boolean;
}

interface SceneStageProps {
  scene: React.ComponentType<SceneProps>;
  /** Kamera startowa (pozycja + fov) — dobierana per wariant. */
  camera?: { position: [number, number, number]; fov: number };
  /** Maska wygaszająca dół canvasu — spójna z dekoracjami hero (szew!). */
  maskStops?: string;
  /** Statyczny zamiennik (brak WebGL / context lost / bail watchdoga). */
  poster: React.ReactNode;
  /**
   * Ile svh pokrywa canvas licząc od GÓRY hero (default 100 = sam hero).
   * >100 = scena „przelewa się" pod kolejną sekcję — fundament mostka
   * hero→treść (animacja nie kończy się na krawędzi ekranu). Sekcja-rodzic
   * NIE może mieć overflow-hidden; treść sekcji niżej maluje się NAD canvasem
   * (kolejność DOM), więc tekst zostaje czytelny, a światło gra POD nim.
   */
  coverSvh?: number;
  /** z-index warstwy canvasu (intro 3D podnosi canvas NAD overlay na czas gry). */
  z?: number;
  /** Miękki fade wejścia (intro 3D animuje narodziny samo → wyłącza fade). */
  fadeIn?: boolean;
  /** Clipping planes (reveal P→L w intro strony 3). */
  localClipping?: boolean;
}

/* Reduced-motion: frameloop="demand" renderuje tylko na invalidate() — async
   zasoby (fonty/env mapy) dociągają się chwilę, więc kopiemy kilka klatek
   w pierwszych ~2 s i NIC więcej. */
function StaticKick() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    invalidate();
    const t1 = setTimeout(() => invalidate(), 350);
    const t2 = setTimeout(() => invalidate(), 1000);
    const t3 = setTimeout(() => invalidate(), 2000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [invalidate]);
  return null;
}

/* FrameCap — limit klatek RENDERU bez przełączania na frameloop="demand".
   renderPriority>0 WYŁĄCZA auto-render R3F → to MY wołamy gl.render() co `1/fps` s
   (równe ~33 ms na low). Kluczowe: pętla rAF i pozostałe useFrame wciąż tykają
   pełnym tempem, więc:
     • PerformanceMonitor mierzy realny rAF (~60 gdy zdrowo) i NIE myli capa ze
       spadkiem fps → zero fałszywego downgrade'u do static,
     • pauza poza ekranem działa nadal (frameloop="never" zatrzymuje też ten hook),
   a GPU rysuje o połowę rzadziej (płynne, równe tempo zamiast rozchwianego 60-celu,
   którego słaby iGPU nie dowozi). Montowany tylko gdy profil ma frameCap (low). */
function FrameCap({ fps }: { fps: number }) {
  const acc = useRef(0);
  useFrame((state, dt) => {
    acc.current += dt;
    const step = 1 / fps;
    if (acc.current >= step) {
      acc.current %= step; // reszta → równe tempo, bez dryfu
      state.gl.render(state.scene, state.camera);
    }
  }, 1);
  return null;
}

/* ResizeObserver z natychmiastowym „kopnięciem":
   R3F mierzy kontener przez react-use-measure, a RO dostarcza callbacki
   dopiero w fazie renderowania — karta w tle (preview/headless) NIGDY ich
   nie dostaje i canvas zostaje 300×150. Kompozycja: natywny RO (pełne
   zachowanie, gdy karta widoczna) + microtask-owy pierwszy pomiar (działa
   zawsze — timery/microtaski tykają też w ukrytych kartach). */
class KickedResizeObserver {
  private cb: ResizeObserverCallback;
  private native: ResizeObserver | null;
  constructor(cb: ResizeObserverCallback) {
    this.cb = cb;
    this.native = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(cb);
  }
  observe(el: Element, opts?: ResizeObserverOptions) {
    this.native?.observe(el, opts);
    queueMicrotask(() => this.cb([], this as unknown as ResizeObserver));
  }
  unobserve(el: Element) {
    this.native?.unobserve(el);
  }
  disconnect() {
    this.native?.disconnect();
  }
}

/* Dev-only: most do ręcznego pędzenia klatek z konsoli/evala
   (window.__kodaAdvance(ms)) — w karcie w tle rAF stoi, a advance()
   renderuje synchronicznie. Wzorzec frameloop="never"+advance z docs R3F.
   Strony podglądu mają WIELE canvasów → rejestr (Set) i jeden globalny
   dyspozytor pędzi wszystkie naraz. W produkcyjnym buildzie nic nie robi. */
declare global {
  interface Window {
    __kodaAdvance?: (ms: number) => void;
  }
}

const advanceRegistry = new Set<(sec: number) => void>();

function DevFrameDriver() {
  const advance = useThree((s) => s.advance);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // W frameloop="never" timestamp (w SEKUNDACH) steruje zegarem R3F —
    // delta = timestamp - elapsedTime → klatki w pełni deterministyczne.
    const fn = (sec: number) => advance(sec, true);
    advanceRegistry.add(fn);
    window.__kodaAdvance = (sec: number) => advanceRegistry.forEach((f) => f(sec));
    return () => {
      advanceRegistry.delete(fn);
      if (advanceRegistry.size === 0) delete window.__kodaAdvance;
    };
  }, [advance]);
  return null;
}

/* Dev-only: strona mierzy WŁASNE fps w tle (rolling, okno 1 s) i odkłada
   wyniki do window.__kodaFpsLog — weryfikator czyta JEDNYM wywołaniem na
   końcu, bez zakłócania pomiaru. W produkcji nie robi nic. */
declare global {
  interface Window {
    __kodaFpsLog?: number[];
  }
}

let fpsMeterMounted = false;

function DevFpsMeter() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    // Strona z wieloma canvasami: licznik fps montuje się tylko RAZ
    // (duplikaty dublowałyby wpisy w __kodaFpsLog).
    if (fpsMeterMounted) return;
    fpsMeterMounted = true;
    let n = 0;
    let t0 = performance.now();
    let raf = 0;
    const loop = () => {
      n++;
      const now = performance.now();
      if (now - t0 >= 1000) {
        const log = (window.__kodaFpsLog ??= []);
        log.push(Math.round((n * 1000) / (now - t0)));
        if (log.length > 30) log.shift();
        n = 0;
        t0 = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      fpsMeterMounted = false;
    };
  }, []);
  return null;
}

/* Dev-only: ?drive=1 wymusza frameloop="never" — wtedy jedynym źródłem
   klatek jest __kodaAdvance (deterministyczna weryfikacja w karcie w tle,
   gdzie rAF stoi). Bez query param zachowanie normalne. */
function useManualDrive(): boolean {
  const [manual] = useState(
    () =>
      typeof window !== "undefined" &&
      process.env.NODE_ENV !== "production" &&
      new URLSearchParams(window.location.search).has("drive")
  );
  return manual;
}

export function SceneStage({
  scene: Scene,
  camera = { position: [0, 0, 8], fov: 42 },
  maskStops = "black 62%, transparent 97%",
  poster,
  coverSvh = 100,
  z = 0,
  fadeIn = true,
  localClipping = false,
}: SceneStageProps) {
  const reduced = !!useReducedMotion();
  // Reaktywny tier — watchdog może go obniżyć w trakcie sesji (DPR ↓, a gdy
  // zejdzie do „static” → bail na poster). Boot-params sceny są zamrożone osobno.
  const liveTier = useTier();
  const profile = TIER_PROFILES[liveTier];
  const wrapRef = useRef<HTMLDivElement>(null);

  // Pauza poza ekranem: oficjalny wzorzec R3F (frameloop 'always' ↔ 'never').
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: "25% 0px 25% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // DPR: start = min(devicePixelRatio, limit tieru); spadki fps → schodzimy krokowo.
  // Leniwy initializer (SSR-safe) zamiast setState w efekcie.
  const [dpr, setDpr] = useState<number>(() =>
    typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, profile.dprCap)
  );
  // DPR efektywny = min(stan watchdoga, limit tieru) — liczony przy renderze
  // (bez setState-in-effect): gdy watchdog obniży tier, limit spada i DPR
  // automatycznie się zaciska na kolejnym renderze.
  const effectiveDpr = Math.min(dpr, profile.dprCap);
  const watchdog = useWatchdog(setDpr, effectiveDpr);

  const [lost, setLost] = useState(false);
  // Klucz remontu Canvasu — przy ODZYSKANIU kontekstu WebGL (np. po wyczerpaniu
  // limitu kontekstów przez wiele otwartych kart) montujemy ŚWIEŻY Canvas zamiast
  // zostać na posterze na zawsze.
  const [glKey, setGlKey] = useState(0);
  const recover = useRef(0);

  const manualDrive = useManualDrive();
  const frameloop = manualDrive ? "never" : reduced ? "demand" : onScreen ? "always" : "never";

  // Maska + fade wejścia liczone raz (obiekt stylu stabilny między renderami).
  const maskStyle = useMemo<React.CSSProperties>(
    () => ({
      height: `${coverSvh}svh`,
      zIndex: z,
      maskImage: `linear-gradient(to bottom, ${maskStops})`,
      WebkitMaskImage: `linear-gradient(to bottom, ${maskStops})`,
    }),
    [maskStops, coverSvh, z]
  );

  return (
    <motion.div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0"
      style={maskStyle}
      initial={{ opacity: fadeIn ? 0 : 1 }}
      animate={{ opacity: 1 }}
      transition={
        reduced || !fadeIn ? { duration: 0 } : { duration: 1.3, ease: EASE.primary, delay: 0.05 }
      }
    >
      {lost || !profile.webgl ? (
        poster
      ) : (
        <Canvas
          key={glKey}
          // alpha: PageCanvas (fixed -z-10) zostaje JEDYNYM tłem strony —
          // scena maluje się NA „pogodzie" kanwy, nie obok niej.
          gl={{
            antialias: profile.msaa,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
          }}
          dpr={effectiveDpr}
          frameloop={frameloop}
          camera={camera}
          fallback={poster}
          resize={{ polyfill: KickedResizeObserver as unknown as typeof ResizeObserver }}
          style={{ position: "absolute", inset: 0 }}
          onCreated={({ gl }) => {
            if (localClipping) gl.localClippingEnabled = true;
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setLost(true);
              // Odzyskanie: po krótkim posterze przemontuj canvas (świeży kontekst).
              if (recover.current < 5) {
                recover.current += 1;
                window.setTimeout(() => {
                  setLost(false);
                  setGlKey((k) => k + 1);
                }, 2200);
              }
            });
          }}
        >
          <PerformanceMonitor onDecline={watchdog.onDecline} onChange={watchdog.onChange}>
            <Scene reduced={reduced} />
          </PerformanceMonitor>
          {reduced && <StaticKick />}
          {!reduced && profile.frameCap ? <FrameCap fps={profile.frameCap} /> : null}
          <DevFrameDriver />
          <DevFpsMeter />
        </Canvas>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   SectionStage — canvas-tło SEKCJI w treści strony (nie hero).

   Te same obowiązki co SceneStage (IO-pauza, DPR clamp + degradacja,
   reduced→demand, context-lost→poster, drive-mode), inna geometria:
   wypełnia rodzica (absolute inset-0; sekcja musi być `relative`), maska
   wygasza canvas przy OBU krawędziach (góra i dół = czyste szwy między
   sekcjami), a scena dostaje getProgress() — postęp scrolla sekcji przez
   viewport (0 = top sekcji na dole ekranu, 1 = bottom nad górą), liczony
   z CACHE'owanych metryk (zero odczytów layoutu w pętli klatek).
   ══════════════════════════════════════════════════════════════════════════ */

export interface SectionSceneProps extends SceneProps {
  /** Postęp sekcji przez viewport [0..1] — czytać w useFrame. */
  getProgress: () => number;
}

interface SectionStageProps {
  scene: React.ComponentType<SectionSceneProps>;
  camera?: { position: [number, number, number]; fov: number };
  /** Maska pionowa canvasu (default: miękkie wygaszenie góry i dołu). */
  maskStops?: string;
  poster: React.ReactNode;
}

export function SectionStage({
  scene: Scene,
  camera = { position: [0, 0, 8], fov: 42 },
  maskStops = "transparent 0%, black 14%, black 84%, transparent 100%",
  poster,
}: SectionStageProps) {
  const reduced = !!useReducedMotion();
  const liveTier = useTier();
  const profile = TIER_PROFILES[liveTier];
  const wrapRef = useRef<HTMLDivElement>(null);

  const [onScreen, setOnScreen] = useState(false);
  const metrics = useRef({ top: 0, height: 1, vh: 800 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      metrics.current = {
        top: rect.top + window.scrollY,
        height: Math.max(rect.height, 1),
        vh: window.innerHeight,
      };
    };
    measure();
    // Po dociągnięciu fontów/treści layout się przesuwa — domierz później.
    const t1 = setTimeout(measure, 600);
    const t2 = setTimeout(measure, 2000);
    window.addEventListener("resize", measure);

    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), {
      rootMargin: "30% 0px 30% 0px",
    });
    io.observe(el);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", measure);
      io.disconnect();
    };
  }, []);

  // Stabilna tożsamość między renderami — sceny czytają w useFrame.
  const getProgress = useMemo(
    () => () => {
      const { top, height, vh } = metrics.current;
      const p = (window.scrollY + vh - top) / (height + vh);
      return p < 0 ? 0 : p > 1 ? 1 : p;
    },
    []
  );

  const [dpr, setDpr] = useState<number>(() =>
    typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, profile.dprCap)
  );
  const effectiveDpr = Math.min(dpr, profile.dprCap);
  const watchdog = useWatchdog(setDpr, effectiveDpr);
  const [lost, setLost] = useState(false);
  const [glKey, setGlKey] = useState(0);
  const recover = useRef(0);

  const manualDrive = useManualDrive();
  const frameloop = manualDrive ? "never" : reduced ? "demand" : onScreen ? "always" : "never";

  const maskStyle = useMemo<React.CSSProperties>(
    () => ({
      maskImage: `linear-gradient(to bottom, ${maskStops})`,
      WebkitMaskImage: `linear-gradient(to bottom, ${maskStops})`,
    }),
    [maskStops]
  );

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0"
      style={maskStyle}
    >
      {lost || !profile.webgl ? (
        poster
      ) : (
        <Canvas
          key={glKey}
          gl={{
            antialias: profile.msaa,
            alpha: true,
            powerPreference: "high-performance",
            stencil: false,
          }}
          dpr={effectiveDpr}
          frameloop={frameloop}
          camera={camera}
          fallback={poster}
          resize={{ polyfill: KickedResizeObserver as unknown as typeof ResizeObserver }}
          style={{ position: "absolute", inset: 0 }}
          onCreated={({ gl }) => {
            gl.domElement.addEventListener("webglcontextlost", (e) => {
              e.preventDefault();
              setLost(true);
              if (recover.current < 5) {
                recover.current += 1;
                window.setTimeout(() => {
                  setLost(false);
                  setGlKey((k) => k + 1);
                }, 2200);
              }
            });
          }}
        >
          <PerformanceMonitor onDecline={watchdog.onDecline} onChange={watchdog.onChange}>
            <Scene reduced={reduced} getProgress={getProgress} />
          </PerformanceMonitor>
          {reduced && <StaticKick />}
          {!reduced && profile.frameCap ? <FrameCap fps={profile.frameCap} /> : null}
          <DevFrameDriver />
          <DevFpsMeter />
        </Canvas>
      )}
    </div>
  );
}
