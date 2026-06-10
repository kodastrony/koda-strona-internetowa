"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { EASE, INTRO_DURATION } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { GlowField } from "@/components/fx/glow-field";
import { PillLink } from "@/components/ui/pill-link";
import { introHasPlayed } from "@/lib/intro-state";

/* ── Vertical "KODA" letter column ───────────────────────────────
   SHARED ELEMENT, nie crossfade. Ta KODA jest piksel-w-piksel pod
   napisem KODA z overlayu intro (ta sama pozycja/rozmiar/kolor/parallax),
   więc gdy overlay znika (Phase 4 fade + unmount), po prostu ją ODSŁANIA.
   ZERO własnego fade-in → brak migotania/podwójnego pojawienia się przy
   handoffie. Stąd opacity zostaje na 1 przez cały czas (i tak jest zakryta
   przez overlay z-[200] do końca intro). */
function KodaColumn() {
  // Parallax: scroll w dół → kolumna KODA jedzie w górę (litera A wysuwa się
  // bardziej do widoku). Ratio ~0.4, jak baunfire. y=0 przy scrollY=0, więc
  // handoff z intro (piksel-w-piksel) pozostaje nienaruszony.
  const { scrollY } = useScroll();
  const reduce = useReducedMotion();
  const y = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -240]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute top-0 hidden select-none lg:block"
      style={{
        right: "19%",
        width: "clamp(160px, 21vw, 340px)",
        height: "130%",
        y,
        // Litery wygasają przed dolną krawędzią hero — overflow-hidden nie
        // tnie glifu „żyletką" na szwie. Stopy w svh (nie %): identyczna
        // ABSOLUTNA geometria maski jak w intro-animation → handoff 1:1.
        maskImage: "linear-gradient(to bottom, black 78svh, transparent 96svh)",
        WebkitMaskImage: "linear-gradient(to bottom, black 78svh, transparent 96svh)",
      }}
    >
      {(["K", "O", "D", "A"] as const).map((letter) => (
        <div
          key={letter}
          style={{
            // The giant background "KODA" is the wordmark at scale → stays on
            // the logo font (Syne), matching the header logo, not the heading font.
            fontFamily: "var(--font-logo)",
            fontWeight: 800,
            fontSize: "clamp(160px, 21vw, 340px)",
            letterSpacing: "-0.04em",
            color: "#1c1c1c",
            lineHeight: 0.9,
          }}
        >
          {letter}
        </div>
      ))}
    </motion.div>
  );
}

/* ── Vertical SCROLL indicator — bottom-right ────────────────── */
function ScrollIndicator({ base }: { base: number }) {
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
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(255,255,255,0.07)" }} />
        {/* Połysk przesuwa się w pętli (repeat:Infinity) → przy „ogranicz ruch"
            NIE renderujemy go wcale (zero perpetualnej animacji dla tych userów). */}
        {!reduce && (
          <motion.div
            className="absolute inset-x-0 top-0 h-6"
            style={{
              background:
                "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
            }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "linear",
              repeatDelay: 0.6,
            }}
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
          color: "rgba(255,255,255,0.18)",
          writingMode: "vertical-rl" as const,
        }}
      >
        SCROLL
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export function Hero() {
  // Opóźnienie wejścia treści jest zsynchronizowane z intro TYLKO gdy intro
  // faktycznie gra (twarde wejście, bez reduced-motion). Przy nawigacji SPA /
  // reduced-motion treść pojawia się natychmiast (BASE = 0) — bez pustego kadru.
  const reduce = useReducedMotion();
  const BASE = reduce || introHasPlayed() ? 0 : INTRO_DURATION;

  // ── Mouse parallax — the aurora glows drift toward the cursor with spring
  //    momentum (decorative; Emil). Opposite directions + magnitudes give depth.
  //    Disabled for reduced-motion. ─────────────────────────────────────────
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const MSPRING = { stiffness: 55, damping: 18, mass: 0.6 };
  const px = useSpring(mvx, MSPRING);
  const py = useSpring(mvy, MSPRING);
  const vx = useTransform(px, (v) => v * -0.55);
  const vy = useTransform(py, (v) => v * -0.55);

  const onMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    mvx.set((e.clientX / window.innerWidth - 0.5) * 64);
    mvy.set((e.clientY / window.innerHeight - 0.5) * 64);
  };

  return (
    <section
      data-header-theme="dark"
      data-canvas="hero"
      onMouseMove={onMouseMove}
      className="relative flex min-h-svh flex-col overflow-hidden"
    >
      {/* ── Dot grid ─────────────────────────────────────────────
           Wszystkie warstwy dekoracyjne hero wygasają maską PRZED dolną
           krawędzią sekcji — overflow-hidden nigdy nie tnie ich „żyletką"
           na szwie z Services (to były te brzydkie linie). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(to bottom, black 62%, transparent 97%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 62%, transparent 97%)",
        }}
      />

      {/* ── Pink light field — bottom-left. Wrapper = spring za kursorem,
           dziecko (GlowField) = przepis core/halo/ambient + podprogowy dryf
           (transform na INNYM elemencie niż spring → nic się nie gryzie). ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          x: px,
          y: py,
          maskImage: "linear-gradient(to bottom, black 58%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 58%, transparent 96%)",
        }}
      >
        <GlowField hue={340} x={12} y={80} strength={1.15} drift driftDuration={26} className="inset-0" />
      </motion.div>

      {/* ── Violet counter-light — top-right, drifts the opposite way (depth) ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          x: vx,
          y: vy,
          maskImage: "linear-gradient(to bottom, black 58%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 58%, transparent 96%)",
        }}
      >
        <GlowField hue={300} x={92} y={8} strength={0.75} drift driftDuration={33} className="inset-0" />
      </motion.div>

      {/* ── Cinematic vignette — edges sink into the deeper dark for depth, so the
           content and header sit on a calmer field (premium, not flat).
           Maska: winieta wygasa przed dolną krawędzią (szew = czysty canvas). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(125% 95% at 50% 6%, transparent 52%, var(--color-bg-deep) 100%)",
          maskImage: "linear-gradient(to bottom, black 55%, transparent 94%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 55%, transparent 94%)",
        }}
      />

      {/* ── Large arc ornament — right side ──────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          width: "clamp(480px, 62vw, 940px)",
          height: "clamp(480px, 62vw, 940px)",
          right: "clamp(-280px, -14vw, -60px)",
          top: "50%",
          transform: "translateY(-50%)",
          border: "1px solid rgba(255,255,255,0.022)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          width: "clamp(280px, 36vw, 560px)",
          height: "clamp(280px, 36vw, 560px)",
          right: "clamp(-80px, -3vw, 20px)",
          top: "50%",
          transform: "translateY(-50%)",
          border: "1px solid rgba(255,255,255,0.03)",
        }}
      />

      {/* ── KODA letter column (crossfades with overlay KODA) ── */}
      <KodaColumn />

      {/* ── SCROLL indicator ─────────────────────────────────── */}
      <ScrollIndicator base={BASE} />

      {/* ══ Main content ══════════════════════════════════════
          z-[210] = NAD intro-overlayem (z-200). Tekst jest opacity 0 do
          swojego delay'a, więc podczas białej fazy intro jest niewidoczny;
          gdy zaczyna wjeżdżać (delay ~BASE-0.4), linia tła już zamalowała
          lewą stronę na ciemno → elementy pojawiają się NA ciemnym, JESZCZE
          w trakcie sweepu (overlap intro↔content, jak baunfire). Tło hero
          (z-0) zostaje POD overlayem i jest odsłaniane jego zanikiem. */}
      <div className="container-koda relative z-[var(--z-hero-content)] flex flex-1 flex-col pt-[84px] md:pt-[130px]">
        <div
          className="flex flex-1 flex-col justify-center"
          style={{ paddingBottom: "clamp(50px, 7vh, 90px)" }}
        >
          {/* ── Large heading + description + CTA ───────────────
              Full width on phones/tablets (decorative KODA is hidden there);
              constrained to ~54% on lg+ to leave room for the KODA column.
              data-logo-hide-anchor: gdy czoło treści hero dojedzie do logo na
              scrollu, header-owe KODA znika i zostaje schowane niżej. */}
          <div data-logo-hide-anchor className="w-full lg:w-[54%] lg:max-w-[620px]">
            {/* h1 — DWIE LINIE wyjeżdżają z MASKOWANYCH „kieszeni" (overflow
                hidden na wrapperze linii, wewnętrzny span y 112%→0). Litery
                rodzą się na linii bazowej zamiast lecieć przez ekran = czystszy,
                bardziej premium reveal niż fade+rise. Padding/ujemny margines
                na kieszeni chroni wywieszki (p, y, ą, przecinek) przed
                przycięciem przy lineHeight 1.03. */}
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
                  {/* akcent marki na biznesowym wyniku + kropka w kolorze tekstu */}
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
                    transition={{ duration: 0.9, ease: EASE.expo, delay: BASE - 0.28 + i * 0.1 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </h1>

            {/* Opis — łagodny rise + fade (mniejszy dystans, EASE.expo) */}
            <FadeUp delay={BASE - 0.06} duration={0.6} ease={EASE.expo} y={22} className="mt-8">
              <p
                className="leading-relaxed"
                style={{
                  fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)",
                  color: "var(--color-ink-muted)",
                  maxWidth: "46ch",
                }}
              >
                Projektujemy i kodujemy strony internetowe dla firm w Polsce. Od zera, pod
                konkretny cel.
              </p>
            </FadeUp>

            {/* CTA — POP: scale 0.9→1 + lekki rise, BACK (overshoot) = motoryka
                przycisku, wyraźnie inna niż wjazdy tekstu. Domyka kaskadę. */}
            <FadeUp
              delay={BASE + 0.08}
              duration={0.6}
              ease={EASE.back}
              y={16}
              scale={0.9}
              className="mt-10"
            >
              {/* Główne CTA — różowy pill „Darmowa wycena" (kolory jak na inspiracji).
                  hover: subtelny lift + różowa poświata + obrót „+". */}
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

            {/* Mikro-linia zdejmująca ryzyko — dokładnie pod CTA, gdzie pada decyzja. */}
            <FadeUp delay={BASE + 0.2} duration={0.6} ease={EASE.expo} y={10} className="mt-5">
              <p className="text-[13px]" style={{ color: "var(--color-ink-faint)" }}>
                Odpowiadamy w 24 h · Bez zobowiązań
              </p>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
