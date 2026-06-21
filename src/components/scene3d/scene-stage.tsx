"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { useReducedMotion } from "motion/react";
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

/* Bazowe propsy sceny canvasu (rozszerzane przez SectionSceneProps). */
export interface SceneProps {
  reduced: boolean;
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
          <DevFrameDriver />
          <DevFpsMeter />
        </Canvas>
      )}
    </div>
  );
}
