"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useInView } from "motion/react";
import { FadeUp } from "@/components/motion";
import { EASE } from "@/lib/motion";
import { PROCESS } from "@/lib/services-data";

/* ── Process timeline — shared by the homepage <Process> and /uslugi ─────────
   A connected timeline that, the moment it scrolls into view, ANIMATES ON ITS
   OWN: the line fills slowly (≈1.8s) and the four numbered nodes light up one
   after another as the fill reaches each — so you actually SEE the sequence
   (the old scroll-linked fill snapped full in a frame and nobody noticed it).

   • Desktop (lg+): horizontal — the fill grows left→right through the node centres.
   • Mobile/tablet: vertical — the spine fills top→bottom.

   Reduced motion → everything renders lit/filled instantly. */

// Node centre positions as a fraction of the timeline (4 evenly-spaced steps).
const POS = PROCESS.map((_, i) => (i + 0.5) / PROCESS.length);
const FILL_DURATION = 1.8; // s — slow, deliberately visible fill
// Each node lights exactly as the (linear) fill front reaches it.
const NODE_DELAY = POS.map((p) => +(p * FILL_DURATION).toFixed(2));

/* A numbered node that flips from outline → filled accent on a timed delay. */
function Node({
  n,
  inView,
  delay,
  size,
  reduce,
}: {
  n: string;
  inView: boolean;
  delay: number;
  size: number;
  reduce: boolean;
}) {
  const litTransition = reduce ? { duration: 0 } : { duration: 0.45, ease: EASE.out, delay };
  const lit = inView ? { opacity: 1 } : {};
  const numberSize = size * 0.34;

  return (
    <div className="relative shrink-0 rounded-full" style={{ width: size, height: size }}>
      {/* Halo — blooms when the node lights */}
      <motion.div
        aria-hidden="true"
        className="absolute -inset-3 rounded-full"
        initial={{ opacity: 0 }}
        animate={lit}
        transition={litTransition}
        style={{
          background: "radial-gradient(circle, rgba(207,67,184,0.45) 0%, transparent 70%)",
        }}
      />
      {/* Base ring (resting) — surface chip reads on both the black and graphite bg */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: "var(--color-surface-1)",
          border: "1.5px solid var(--color-line-strong)",
        }}
      />
      {/* Filled accent (lit) */}
      <motion.div
        className="absolute inset-0 rounded-full"
        initial={{ opacity: 0 }}
        animate={lit}
        transition={litTransition}
        style={{
          background: "linear-gradient(140deg, var(--color-accent), var(--color-pink-bright))",
          boxShadow: "0 0 0 4px rgba(207,67,184,0.12)",
        }}
      />
      {/* Number — resting (accent on dark) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center font-heading font-bold"
        style={{ fontSize: numberSize, color: "var(--color-accent)", letterSpacing: "-0.02em" }}
      >
        {n}
      </span>
      {/* Number — lit (dark on accent), cross-faded on top */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center font-heading font-bold"
        initial={{ opacity: 0 }}
        animate={lit}
        transition={litTransition}
        style={{ fontSize: numberSize, color: "#0b0b0d", letterSpacing: "-0.02em" }}
      >
        {n}
      </motion.span>
    </div>
  );
}

function StepBody({
  title,
  desc,
  align = "center",
}: {
  title: string;
  desc: string;
  align?: "center" | "left";
}) {
  return (
    <div className={align === "center" ? "flex flex-col items-center text-center" : ""}>
      <h3
        className="font-heading font-semibold"
        style={{
          fontSize: "clamp(1.2rem,1.7vw,1.5rem)",
          letterSpacing: "-0.02em",
          lineHeight: 1.15,
          color: "var(--color-ink)",
        }}
      >
        {title}
      </h3>
      <p
        className="mt-2.5"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.97rem",
          lineHeight: 1.6,
          color: "var(--color-ink-muted)",
          maxWidth: "30ch",
        }}
      >
        {desc}
      </p>
    </div>
  );
}

export function ProcessSteps() {
  const reduce = useReducedMotion();

  // Each layout (horizontal lg+, vertical below) tracks its own in-view trigger.
  // The hidden one (display:none) never intersects, so only the visible one fires.
  const hRef = useRef<HTMLDivElement>(null);
  const vRef = useRef<HTMLDivElement>(null);
  const hIn = useInView(hRef, { once: true, margin: "-12% 0px -12% 0px" });
  const vIn = useInView(vRef, { once: true, margin: "-8% 0px -8% 0px" });

  const fillTransition = reduce
    ? { duration: 0 }
    : { duration: FILL_DURATION, ease: "linear" as const };

  return (
    <>
      {/* ── Horizontal timeline (lg+) ── */}
      <div ref={hRef} className="relative mt-[clamp(40px,5vw,72px)] hidden lg:block">
        {/* Track + fill — runs through the node centres (first→last column centre) */}
        <div
          aria-hidden="true"
          className="absolute top-[27px] right-[12.5%] left-[12.5%] h-[2px] overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--color-line)" }}
        >
          <motion.div
            className="absolute inset-y-0 left-0 w-full origin-left rounded-full"
            initial={{ scaleX: 0 }}
            animate={hIn ? { scaleX: 1 } : {}}
            transition={fillTransition}
            style={{
              background: "linear-gradient(to right, var(--color-accent), var(--color-pink-bright))",
            }}
          />
        </div>

        <div className="grid grid-cols-4 gap-x-8">
          {PROCESS.map((step, i) => (
            <FadeUp inView key={step.n} delay={0.1 * i} y={26}>
              <div className="flex flex-col items-center">
                <Node n={step.n} inView={hIn} delay={NODE_DELAY[i]} size={56} reduce={!!reduce} />
                <div className="mt-7">
                  <StepBody title={step.title} desc={step.desc} align="center" />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── Vertical timeline (mobile / tablet) ── */}
      <div ref={vRef} className="relative mt-[clamp(36px,8vw,52px)] lg:hidden">
        {/* Spine + fill — through the node centres, left rail */}
        <div
          aria-hidden="true"
          className="absolute top-[24px] bottom-[24px] left-[23px] w-[2px] overflow-hidden rounded-full"
          style={{ backgroundColor: "var(--color-line)" }}
        >
          <motion.div
            className="absolute inset-x-0 top-0 h-full origin-top rounded-full"
            initial={{ scaleY: 0 }}
            animate={vIn ? { scaleY: 1 } : {}}
            transition={fillTransition}
            style={{
              background: "linear-gradient(to bottom, var(--color-accent), var(--color-pink-bright))",
            }}
          />
        </div>

        <div className="flex flex-col gap-[clamp(28px,6vw,44px)]">
          {PROCESS.map((step, i) => (
            <FadeUp inView key={step.n} delay={0.08 * i} y={22}>
              <div className="flex items-start gap-5">
                <Node n={step.n} inView={vIn} delay={NODE_DELAY[i]} size={48} reduce={!!reduce} />
                <div className="pt-1">
                  <StepBody title={step.title} desc={step.desc} align="left" />
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </>
  );
}
