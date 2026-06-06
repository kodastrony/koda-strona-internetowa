"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, type Bezier } from "@/lib/motion";

/* ── Pink statement block (Baunfire "we are a digital agency" — KODA-pink) ──
   Full-bleed manifesto panel. Mirrors baunfire's red statement section:
   wide-tracked eyebrow, one big bold sentence, halftone dot cluster top-right.
   Swaps baunfire's red (#E93428) for KODA's brand pink (#cf43b8) and adds a
   contact CTA (not in the original — a deliberate conversion touch).

   ENTRANCE (one coordinated moment, driven by a single `useInView`):
   • the pink panel WIPES in left→right via pure translateX (GPU transform —
     height-independent, no clip-path repaint, no layout gap). It paints over a
     #f7f7f7 backdrop that matches the Work section above, so the pre-reveal
     state is seamless (never a dark/empty seam) and the wipe reads as the pink
     "painting itself in" — a clean, solid edge (no glow/blur = no smeary seam).
   • the text cascades on top: eyebrow slides from the left, the sentence reveals
     line-by-line (clip wipe), the CTA pops (back-ease). Delays are staggered so
     each element lands just after the pink has covered its area. */

const PINK_GRADIENT =
  "linear-gradient(145deg, #c23ba9 0%, #cf43b8 50%, #d44ec1 100%)";

// The statement, split into reveal "beats" (each wraps naturally on mobile).
// A parallel triad — budują / przyciągają / zwiększają — mirrors baunfire's
// "drive traffic, engagement, and conversion" rhythm.
const STATEMENT = [
  "Tworzymy strony internetowe,",
  "które budują zaufanie, przyciągają klientów",
  "i realnie zwiększają sprzedaż polskich marek.",
] as const;

/** Decorative "+" glyph — echoes the hero's plus motif, very low contrast. */
function Plus({ size = "clamp(26px, 3vw, 48px)", opacity = 0.16 }: { size?: string; opacity?: number }) {
  return (
    <span
      className="block select-none leading-none"
      style={{
        fontFamily: "var(--font-heading)",
        fontWeight: 300,
        fontSize:   size,
        color:      `rgba(255,255,255,${opacity})`,
      }}
    >
      +
    </span>
  );
}

/** Smooth easing for the scroll-driven parallax drift (the soft "breathing" lag). */
const DRIFT_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/**
 * A decorative ornament with TWO independent motions on TWO elements, so their
 * transforms never collide:
 *  • OUTER wrapper → scroll PARALLAX. A passive scroll listener (in <Statement>)
 *    writes `translate3d(0,Y,0)` straight onto it; `data-parallax` is the px
 *    travel (± flips direction / depth). A CSS `transition: transform` gives the
 *    drift its soft lag. No rAF, no library — works in every browser.
 *  • INNER motion.div → the ENTRANCE: fade + scale (+ optional rotate) on
 *    `inView`, so each ornament pops in on its own beat just after the pink wipe.
 */
interface FloatDecorProps {
  inView:      boolean;
  /** Parallax travel in px (peak-to-peak ≈ this). Negative drifts the other way. */
  speed:       number;
  delay:       number;
  duration?:   number;
  scaleFrom?:  number;
  rotateFrom?: number;
  ease?:       Bezier;
  className?:  string;
  style?:      React.CSSProperties;
  children:    React.ReactNode;
}

function FloatDecor({
  inView,
  speed,
  delay,
  duration = 0.9,
  scaleFrom = 0.6,
  rotateFrom = 0,
  ease = EASE.expo,
  className,
  style,
  children,
}: FloatDecorProps) {
  return (
    <div
      data-parallax={speed}
      className={cn("absolute", className)}
      style={{ transition: `transform 0.35s ${DRIFT_EASE}`, willChange: "transform", ...style }}
    >
      <motion.div
        data-reveal
        initial={{ opacity: 0, scale: scaleFrom, rotate: rotateFrom }}
        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={{ duration, ease, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Expanding pink ripple from the click point — removes itself when done. */
function Ripple({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute z-[1] rounded-full"
      style={{
        left:       x,
        top:        y,
        width:      24,
        height:     24,
        marginLeft: -12,
        marginTop:  -12,
        background: "rgba(207,67,184,0.45)",
      }}
      initial={{ scale: 0, opacity: 0.55 }}
      animate={{ scale: 26, opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onAnimationComplete={onDone}
    />
  );
}

/* ── White "Darmowa wycena" CTA ───────────────────────────────────────────
   The section's hero CTA — deliberately distinct from the shared dark PillLink.
   • HOVER: the pill smoothly "fills up". A dark panel WITH a white copy of the
     label is unveiled bottom→top by an animating clip-path; the resting (dark)
     label sits exactly beneath it, so the colour flips precisely at the rising
     fill line — always legible, perfectly smooth, and NOT a sliding swap. Plus a
     spring lift + soft shadow.
   • TAP: a pink ripple bursts from the pointer and the whole pill springs down
     (0.96) for a tactile press. */
function QuoteButton({ href, label }: { href: string; label: string }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);

  const spawnRipple = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRipples((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), x: e.clientX - r.left, y: e.clientY - r.top },
    ]);
  };

  // Rendered twice (resting copy + fill copy) so the two overlap pixel-exact.
  const renderLabel = () => (
    <>
      {label}
      <span aria-hidden="true" className="text-[22px] font-light leading-none">
        +
      </span>
    </>
  );

  return (
    <Link href={href} className="inline-block rounded-full">
      <motion.div
        className="group relative inline-flex overflow-hidden rounded-full font-heading text-[12px] font-bold uppercase tracking-[0.2em]"
        onPointerDown={spawnRipple}
        whileHover={{ y: -3, boxShadow: "0 24px 52px -14px rgba(15,15,15,0.5)" }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        style={{
          backgroundColor: "#ffffff",
          boxShadow:       "0 10px 26px -16px rgba(15,15,15,0.35)",
          willChange:      "transform",
        }}
      >
        {/* Click ripples — on the white base, behind the labels */}
        {ripples.map((r) => (
          <Ripple
            key={r.id}
            x={r.x}
            y={r.y}
            onDone={() => setRipples((prev) => prev.filter((p) => p.id !== r.id))}
          />
        ))}

        {/* Resting label — dark ink on white (this copy sizes the pill) */}
        <span className="relative z-10 flex items-center gap-5 px-10 py-5 text-[#0f0f0f]">
          {renderLabel()}
        </span>

        {/* Fill — dark panel + white label, unveiled bottom→top by clip-path.
            No sliding: the colour simply flips at the rising fill line. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-20 flex items-center gap-5 px-10 text-white transition-[clip-path] duration-[620ms] ease-[cubic-bezier(0.63,0.03,0.21,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0%_0_0_0)]"
          style={{ backgroundColor: "#0f0f0f" }}
        >
          {renderLabel()}
        </span>
      </motion.div>
    </Link>
  );
}

export function Statement() {
  // Single trigger for the whole entrance — fires when the content is ~20% into
  // view, so the pink wipe and the text cascade read as ONE moment the user is
  // actually looking at (the section is tall; centring the trigger on the copy
  // keeps block + text in sync instead of the panel wiping while off-screen).
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20% 0px -20% 0px" });

  // Content lands just after the pink edge has swept past the left margin.
  const BASE = 0.32;

  // ── Decoration parallax ────────────────────────────────────────────────
  // A passive scroll listener drives every `[data-parallax]` ornament: as the
  // section travels through the viewport it writes `translate3d(0,Y,0)` directly
  // (the CSS `transition: transform` on each one smooths the drift). Direct DOM
  // writes + CSS transition are bulletproof across browsers (rAF/spring stall in
  // headless tools). Skipped entirely for reduced-motion users.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(section.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!els.length) return;

    const apply = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // c ∈ [-0.5, 0.5]: -0.5 = section entering from below, +0.5 = leaving the top.
      const c = Math.max(-0.5, Math.min(0.5, (vh - rect.top) / (vh + rect.height) - 0.5));
      // Gentler drift on phones (less room → keep ornaments well clear of copy).
      const factor = window.innerWidth < 768 ? 0.5 : 1;
      for (const el of els) {
        const speed = parseFloat(el.dataset.parallax ?? "0");
        el.style.transform = `translate3d(0, ${(-c * speed * factor).toFixed(1)}px, 0)`;
      }
    };

    apply();
    window.addEventListener("scroll", apply, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      window.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-theme="pink"
      className="relative isolate flex min-h-svh flex-col overflow-hidden"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      {/* ── Pink panel — wipes in left→right (pure transform, GPU) ───────── */}
      <motion.div
        aria-hidden="true"
        data-reveal
        className="absolute inset-0 z-0 will-change-transform"
        style={{ background: PINK_GRADIENT }}
        initial={{ x: "-100%" }}
        animate={{ x: inView ? "0%" : "-100%" }}
        transition={{ duration: 1.2, ease: EASE.smooth }}
      >
        {/* Faint full-bleed dot texture (revealed with the pink) */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "46px 46px",
          }}
        />

      </motion.div>

      {/* ── Decorations — each ornament gets its OWN pop-in entrance + a smooth
          scroll-parallax drift (varied speeds & directions = depth). Own layer,
          ABOVE the pink panel, BELOW the content. ─────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        {/* Halftone dot cluster — top-right (baunfire); fades + scales in, drifts up */}
        <FloatDecor
          inView={inView}
          speed={120}
          delay={0.5}
          duration={1.0}
          scaleFrom={0.86}
          className="hidden md:block"
          style={{ top: "clamp(96px, 13vh, 170px)", right: "clamp(28px, 5vw, 96px)" }}
        >
          <div
            style={{
              width:           280,
              height:          250,
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.34) 1.5px, transparent 1.8px)",
              backgroundSize:  "18px 18px",
              WebkitMaskImage: "radial-gradient(circle at 82% 16%, #000 0%, transparent 64%)",
              maskImage:       "radial-gradient(circle at 82% 16%, #000 0%, transparent 64%)",
            }}
          />
        </FloatDecor>

        {/* Plus marks — pop in with a little rotation (back-ease), drift at depth.
            The right/top two would cross the full-width mobile copy, so they hide
            below md; the lower band keeps two on every screen. */}
        <FloatDecor inView={inView} speed={-220} delay={0.60} scaleFrom={0.3} rotateFrom={-55} ease={EASE.back} className="hidden md:block" style={{ top: "31%", right: "27%" }}>
          <Plus size="clamp(30px, 3.4vw, 54px)" opacity={0.18} />
        </FloatDecor>
        <FloatDecor inView={inView} speed={250} delay={0.70} scaleFrom={0.3} rotateFrom={48} ease={EASE.back} style={{ bottom: "18%", right: "14%" }}>
          <Plus size="clamp(26px, 3vw, 46px)" opacity={0.16} />
        </FloatDecor>
        <FloatDecor inView={inView} speed={-170} delay={0.64} scaleFrom={0.3} rotateFrom={-40} ease={EASE.back} style={{ bottom: "25%", left: "46%" }}>
          <Plus size="clamp(20px, 2.2vw, 34px)" opacity={0.14} />
        </FloatDecor>

        {/* Faint ring — drifts down, adds depth on the right (md+ only) */}
        <FloatDecor inView={inView} speed={180} delay={0.82} duration={1.0} scaleFrom={0.5} className="hidden md:block" style={{ top: "54%", right: "19%" }}>
          <div
            style={{
              width:        "clamp(70px, 8vw, 120px)",
              height:       "clamp(70px, 8vw, 120px)",
              borderRadius: "50%",
              border:       "1px solid rgba(255,255,255,0.14)",
            }}
          />
        </FloatDecor>
      </div>

      {/* ── Content — upper portion (empty pink below, like baunfire) ────── */}
      <div
        ref={ref}
        className="container-koda relative z-10"
        style={{
          paddingTop:    "clamp(150px, 24vh, 280px)",
          paddingBottom: "clamp(96px, 16vh, 190px)",
        }}
      >
        <div className="max-w-[1000px]">
          {/* Eyebrow — slides in from the left, leads the cascade */}
          <motion.div
            data-reveal
            className="mb-8 flex items-center gap-5"
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.7, ease: EASE.expo, delay: BASE }}
          >
            <span
              style={{
                fontFamily:    "var(--font-heading)",
                fontSize:      12,
                fontWeight:    800,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color:         "#ffffff",
              }}
            >
              KODA
            </span>
            <span
              className="h-px"
              style={{
                width:      "clamp(36px, 9vw, 120px)",
                background: "rgba(255,255,255,0.4)",
              }}
            />
          </motion.div>

          {/* Statement — big bold Syne, revealed line-by-line (clip wipe) */}
          <p
            style={{
              fontFamily:    "var(--font-heading)",
              fontWeight:    700,
              fontSize:      "clamp(1.7rem, 3.7vw, 3.15rem)",
              lineHeight:    1.3,
              letterSpacing: "-0.02em",
              color:         "#ffffff",
            }}
          >
            {STATEMENT.map((line, i) => (
              <motion.span
                key={i}
                data-reveal
                className="block"
                initial={{ clipPath: "inset(0 100% 0 0)", opacity: 0 }}
                animate={
                  inView
                    ? { clipPath: "inset(0 0% 0 0)", opacity: 1 }
                    : undefined
                }
                transition={{
                  duration: 0.85,
                  ease:     EASE.smooth,
                  delay:    BASE + 0.12 + i * 0.12,
                }}
              >
                {line}
              </motion.span>
            ))}
          </p>

          {/* Contact CTA — pops in last (back-ease overshoot). A white pill that
              flips dark on hover, with a pink click-ripple (see QuoteButton). */}
          <motion.div
            data-reveal
            className="mt-12"
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{
              duration: 0.6,
              ease:     EASE.back,
              delay:    BASE + 0.12 + STATEMENT.length * 0.12 + 0.16,
            }}
          >
            <QuoteButton href="/kontakt" label="Darmowa wycena" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
