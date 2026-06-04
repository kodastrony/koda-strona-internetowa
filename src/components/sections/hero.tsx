"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { EASE, INTRO_DURATION, cssBezier } from "@/lib/motion";
import { Reveal, FadeUp } from "@/components/motion";

// Synced to INTRO_DURATION — hero elements appear as the intro overlay fades.
// Reveal / FadeUp are shared primitives (@/components/motion); the hero drives
// them on mount, so each call passes an absolute `delay` of BASE_DELAY + offset.
const BASE_DELAY = INTRO_DURATION;

/* ── Decorative plus / cross cluster ────────────────────────── */
function PlusCluster({
  x,
  y,
  size = "sm",
  delay = 0,
}: {
  x: string;
  y: string;
  size?: "sm" | "md";
  delay?: number;
}) {
  const gap = size === "md" ? 14 : 9;
  const fs  = size === "md" ? 14 : 10;
  const pts: [number, number][] = [
    [0,           0],
    [gap,         0],
    [gap * 2,     0],
    [gap * 0.5,   gap],
    [gap * 1.5,   gap],
    [0,           gap * 2],
    [gap,         gap * 2],
  ];
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.8, ease: EASE.expo, delay: BASE_DELAY + delay }}
      className="absolute pointer-events-none select-none"
      style={{ left: x, top: y, zIndex: 1 }}
    >
      {pts.map(([ox, oy], i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left:       ox,
            top:        oy,
            fontSize:   fs,
            color:      "#242424",
            fontWeight: 300,
            lineHeight: 1,
            fontFamily: "monospace",
          }}
        >
          +
        </span>
      ))}
    </motion.div>
  );
}

/* ── Vertical "KODA" letter column ───────────────────────────────
   Crossfades with the intro overlay's KODA using matching
   duration + ease (easeInOut 0.35 s), creating a seamless handoff. */
function KodaColumn() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: "easeInOut", delay: BASE_DELAY }}
      className="absolute top-0 pointer-events-none select-none"
      style={{
        right:  "19%",
        width:  "clamp(160px, 21vw, 340px)",
        height: "130%",
      }}
    >
      {(["K", "O", "D", "A"] as const).map((letter) => (
        <div
          key={letter}
          style={{
            fontFamily:    "var(--font-heading)",
            fontWeight:    800,
            fontSize:      "clamp(160px, 21vw, 340px)",
            letterSpacing: "-0.04em",
            color:         "#1c1c1c",
            lineHeight:    0.9,
          }}
        >
          {letter}
        </div>
      ))}
    </motion.div>
  );
}

/* ── Vertical SCROLL indicator — bottom-right ────────────────── */
function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7, delay: BASE_DELAY + 0.7 }}
      aria-hidden="true"
      className="absolute bottom-10 right-[clamp(20px,3vw,44px)] hidden lg:flex flex-col items-center gap-3"
      style={{ zIndex: 10 }}
    >
      <div className="relative h-14 w-px overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
        />
        <motion.div
          className="absolute inset-x-0 top-0 h-6"
          style={{
            background:
              "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
          }}
          animate={{ y: ["-100%", "200%"] }}
          transition={{
            duration:    1.8,
            repeat:      Infinity,
            ease:        "linear",
            repeatDelay: 0.6,
          }}
        />
      </div>
      <span
        style={{
          fontFamily:    "var(--font-heading)",
          fontSize:      "8px",
          fontWeight:    700,
          letterSpacing: "0.35em",
          textTransform: "uppercase" as const,
          color:         "rgba(255,255,255,0.18)",
          writingMode:   "vertical-rl" as const,
        }}
      >
        SCROLL
      </span>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════ */
export function Hero() {
  return (
    <section
      data-header-theme="dark"
      className="relative min-h-svh flex flex-col overflow-hidden bg-dark"
    >
      {/* ── Dot grid ─────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Pink glow — bottom-left behind content ───────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 45% at 14% 78%, rgba(207,67,184,0.07) 0%, transparent 70%)",
        }}
      />

      {/* ── Large arc ornament — right side ──────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          width:     "clamp(480px, 62vw, 940px)",
          height:    "clamp(480px, 62vw, 940px)",
          right:     "clamp(-280px, -14vw, -60px)",
          top:       "50%",
          transform: "translateY(-50%)",
          border:    "1px solid rgba(255,255,255,0.022)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute z-0 rounded-full"
        style={{
          width:     "clamp(280px, 36vw, 560px)",
          height:    "clamp(280px, 36vw, 560px)",
          right:     "clamp(-80px, -3vw, 20px)",
          top:       "50%",
          transform: "translateY(-50%)",
          border:    "1px solid rgba(255,255,255,0.03)",
        }}
      />

      {/* ── Plus clusters ────────────────────────────────────── */}
      <PlusCluster x="62%" y="20%" size="md" delay={0.4} />
      <PlusCluster x="56%" y="60%" size="sm" delay={0.5} />
      <PlusCluster x="79%" y="74%" size="sm" delay={0.45} />

      {/* ── KODA letter column (crossfades with overlay KODA) ── */}
      <KodaColumn />

      {/* ── SCROLL indicator ─────────────────────────────────── */}
      <ScrollIndicator />

      {/* ══ Main content ══════════════════════════════════════ */}
      <div
        className="container-koda relative z-10 flex flex-col flex-1"
        style={{ paddingTop: "130px" }}
      >
        <div
          className="flex flex-col justify-center flex-1"
          style={{ paddingBottom: "clamp(50px, 7vh, 90px)" }}
        >
          {/* Label */}
          <Reveal delay={BASE_DELAY + 0.05}>
            <div className="flex items-center gap-5 mb-9">
              <span className="label-koda">K O D A &nbsp; S T U D I O</span>
              <div
                className="h-px"
                style={{
                  width:      "clamp(40px, 14vw, 160px)",
                  background: "rgba(255,255,255,0.08)",
                }}
              />
            </div>
          </Reveal>

          {/* ── Large heading + description + CTA ─────────────── */}
          <div style={{ maxWidth: "clamp(280px, 54%, 620px)" }}>

            <FadeUp delay={BASE_DELAY + 0.15}>
              <h1
                style={{
                  fontFamily:    "var(--font-heading)",
                  fontWeight:    800,
                  fontSize:      "clamp(2.4rem, 5.8vw, 5.2rem)",
                  lineHeight:    1.0,
                  letterSpacing: "-0.03em",
                  color:         "#ffffff",
                }}
              >
                Robimy strony,
                <br />
                <span style={{ color: "rgba(255,255,255,0.52)" }}>
                  które sprzedają.
                </span>
              </h1>
            </FadeUp>

            <FadeUp delay={BASE_DELAY + 0.28} className="mt-8">
              <p
                className="text-white/45 leading-relaxed"
                style={{ fontSize: "clamp(0.875rem, 1.1vw, 1rem)" }}
              >
                Projektujemy custom strony internetowe dla polskich firm —
                od identyfikacji wizualnej po wdrożenie i wsparcie.
              </p>
            </FadeUp>

            <FadeUp delay={BASE_DELAY + 0.42} className="mt-10">
              <Link
                href="/kontakt"
                className={cn(
                  "group inline-flex items-center gap-5 rounded-full px-8 py-4",
                  "text-[11px] font-heading font-bold tracking-[0.18em] uppercase",
                  "text-white/60 hover:text-white transition-all duration-500",
                )}
                style={{
                  backgroundColor:          "#1a1a1a",
                  border:                   "1px solid rgba(255,255,255,0.07)",
                  transitionTimingFunction:  cssBezier(EASE.expo),
                }}
              >
                Porozmawiajmy
                <span
                  className="text-xl font-light leading-none transition-transform duration-500 group-hover:rotate-45"
                  style={{ transitionTimingFunction: cssBezier(EASE.expo) }}
                >
                  +
                </span>
              </Link>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  );
}
