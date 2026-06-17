"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { P5_INTRO } from "@/components/scene3d/intro-timings";
import { useIntroOrchestra, SkipCatcher } from "@/components/scene3d/intro-orchestra";
import { HeroPoster } from "@/components/scene3d/scene-poster";
import { getTier, TIER_PROFILES } from "@/lib/device-tier";
import { useThemeValue } from "@/lib/theme";
import { EASE } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";

/* ══════════════════════════════════════════════════════════════════════════
   Hero3D — produkcyjny hero strony głównej (wariant C „Reflektor").

   Monolit KODA (bryły 3D) w kosmosie; scroll = dostojny pochył + przejazd
   klucza światła (światłocień). Intro „odsłonięcie reflektorem" gra w canvasie
   RAZ NA SESJĘ (potem scena startuje w spoczynku). Tło = PageCanvas (jeden
   świat) — scena maluje się NA pogodzie strony, w obu motywach.

   Treść hero (H1/opis/CTA) renderuje się ZAWSZE (w statycznym HTML — SEO),
   a intro tylko steruje czasem jej wejścia. data-header-theme="dark" jest
   stałe; w jasnym motywie provider mapuje je na „light" (zero mutacji DOM).
   ══════════════════════════════════════════════════════════════════════════ */

// Cała three-zależna część hero (SceneStage + scena) ZA dynamic(ssr:false) —
// tier „static" jej nie montuje, więc chunk three/fiber/drei NIE jest pobierany.
const Hero3DCanvas = dynamic(() => import("./hero-3d-canvas"), { ssr: false });

/* ── Treść hero (1:1 z dawnym sections/hero.tsx — tekst bez zmian) ────────── */
function HeroCopy({ base }: { base: number }) {
  return (
    <div data-logo-hide-anchor className="w-full lg:w-[54%] lg:max-w-[620px]">
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          fontSize: "clamp(2.5rem, 6vw, 5.25rem)",
          lineHeight: 1.03,
          letterSpacing: "-0.03em",
          color: "var(--color-ink)",
        }}
      >
        {[
          <>Strona internetowa, która</>,
          <>
            <span style={{ color: "var(--color-accent)" }}>przynosi klientów</span>
            <span style={{ color: "var(--color-ink)" }}>.</span>
          </>,
        ].map((line, i) => (
          <span
            key={i}
            style={{
              display: "block",
              overflow: "hidden",
              paddingBottom: "0.12em",
              marginBottom: "-0.12em",
            }}
          >
            <motion.span
              data-reveal
              style={{ display: "block", willChange: "transform" }}
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, ease: EASE.expo, delay: base - 0.28 + i * 0.1 }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      <FadeUp delay={base - 0.06} duration={0.6} ease={EASE.expo} y={22} className="mt-8">
        <p
          className="leading-relaxed"
          style={{
            fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)",
            color: "var(--color-ink-muted)",
            maxWidth: "46ch",
          }}
        >
          Projektujemy i kodujemy strony internetowe dla firm w Polsce. Od zera, pod konkretny cel.
        </p>
      </FadeUp>

      <FadeUp
        delay={base + 0.08}
        duration={0.6}
        ease={EASE.back}
        y={16}
        scale={0.9}
        className="mt-10"
      >
        <Magnetic strength={0.4}>
          <PillLink
            href="/kontakt"
            bg="#cf43b8"
            border="#cf43b8"
            className="text-white hover:text-white hover:shadow-[0_18px_44px_-12px_rgba(207,67,184,0.55)]"
          >
            Bezpłatna wycena
          </PillLink>
        </Magnetic>
      </FadeUp>

      <FadeUp delay={base + 0.2} duration={0.6} ease={EASE.expo} y={10} className="mt-5">
        <p className="text-[13px]" style={{ color: "var(--color-ink-faint)" }}>
          Odpowiadamy w 24 h · Bez zobowiązań
        </p>
      </FadeUp>
    </div>
  );
}

/* ── Wskaźnik SCROLL na tokenach (czytelny w obu motywach) ────────────────── */
function ThemedScrollHint({ base }: { base: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: base + 0.7 }}
      aria-hidden="true"
      className="absolute right-[clamp(20px,3vw,44px)] bottom-10 hidden flex-col items-center gap-3 lg:flex"
      style={{ zIndex: 10 }}
    >
      <div className="relative h-14 w-px overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "color-mix(in srgb, var(--color-ink) 10%, transparent)" }}
        />
        {!reduce && (
          <motion.div
            className="absolute inset-x-0 top-0 h-6"
            style={{
              background:
                "linear-gradient(to bottom, transparent, color-mix(in srgb, var(--color-ink) 32%, transparent), transparent)",
            }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
          />
        )}
      </div>
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "0.35em",
          textTransform: "uppercase" as const,
          color: "color-mix(in srgb, var(--color-ink) 24%, transparent)",
          writingMode: "vertical-rl" as const,
        }}
      >
        SCROLL
      </span>
    </motion.div>
  );
}

export function Hero3D() {
  // Tier „static" (brak/sw WebGL, save-data, bardzo słaby sprzęt) → intro INSTANT
  // (treść od razu, bez czekania na scenę). Zamrożone na czas życia komponentu.
  const [instant] = useState(
    () => typeof window !== "undefined" && !TIER_PROFILES[getTier()].webgl
  );

  // POSTER-FIRST + progresywny upgrade: start = dopracowany HeroPoster (H1 widoczne
  // natychmiast, zero blokowania 3D na pierwszej klatce). Sprzęt zdolny montuje
  // scenę 3D dopiero na IDLE (nie konkuruje z hydracją/LCP). „static" zostaje na
  // posterze NA ZAWSZE → chunk three.js NIGDY się nie pobiera (koniec ~20 s na
  // słabym sprzęcie/wolnym łączu).
  const [mount3d, setMount3d] = useState(false);
  useEffect(() => {
    if (!TIER_PROFILES[getTier()].webgl) return; // static → poster, bez 3D
    let cancelled = false;
    let idleId: number | undefined;
    let timeoutId: number | undefined;
    const start = () => {
      if (!cancelled) setMount3d(true);
    };
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (typeof w.requestIdleCallback === "function") {
      idleId = w.requestIdleCallback(start, { timeout: 1200 });
    } else {
      timeoutId = window.setTimeout(start, 200);
    }
    return () => {
      cancelled = true;
      if (idleId !== undefined && typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(idleId);
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    };
  }, []);

  // Treść hero (H1=LCP) wjeżdża wg copyBase (~0,5 s), NIE base (~1,8 s = osiadanie
  // światła sceny). Intro 3D gra dalej pełny czas — scena czyta P5_INTRO osobno.
  const o = useIntroOrchestra(P5_INTRO.copyBase, { oncePerSession: true, instant });
  const theme = useThemeValue();
  const light = theme === "light";
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const copyOpacity = useTransform(scrollY, [0, 260, 660], [1, 1, 0]);
  const copyY = useTransform(scrollY, [0, 660], [0, -84]);

  return (
    <section
      data-header-theme="dark"
      data-canvas="hero"
      className="relative flex min-h-svh flex-col"
    >
      {mount3d ? <Hero3DCanvas bus={o.bus} /> : <HeroPoster />}

      {/* Winieta: subtelne ściemnienie POD treścią (lewa-góra), gładko gasnące do
          zera w stronę galaktyki (prawo/dół). BEZ maski — poprzednia maska
          „black 55% → transparent 94%" robiła TWARDĄ poziomą krawędź („jaśniejszy
          kwadrat": ciemniona góra vs niedotknięty dół). Jeden gładki radial = zero
          szwu; gaśnie do 0 daleko od krawędzi, więc tło jest płynne. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-svh"
        style={{
          background: light
            ? "radial-gradient(125% 115% at 24% 30%, rgba(238,233,241,0.55) 0%, rgba(238,233,241,0.2) 38%, rgba(238,233,241,0) 70%)"
            : "radial-gradient(125% 115% at 24% 30%, rgba(7,7,9,0.6) 0%, rgba(7,7,9,0.24) 38%, rgba(7,7,9,0) 70%)",
        }}
      />

      <ThemedScrollHint base={o.base} />

      <motion.div
        className="container-koda relative z-10 flex flex-1 flex-col pt-[100px] md:pt-[130px]"
        style={reduce ? undefined : { opacity: copyOpacity, y: copyY }}
      >
        {/* Mobile: treść u GÓRY (kolumna brył KODA gra niżej, w dolnej połowie —
            zero kolizji na krótkich ekranach). lg+: treść wyśrodkowana w pionie. */}
        <div
          className="flex flex-1 flex-col justify-start lg:justify-center"
          style={{ paddingBottom: "clamp(50px, 7vh, 90px)" }}
        >
          {/* key=base: skip/ready zmienia kotwicę → remont = kaskada od nowa.
              Renderowane ZAWSZE (nie za bramką ready) → H1 jest w statycznym HTML. */}
          <HeroCopy key={o.base} base={o.base} />
        </div>
      </motion.div>

      {o.introOn && <SkipCatcher onSkip={o.skip} />}
    </section>
  );
}
