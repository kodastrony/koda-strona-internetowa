"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";

/* ── SuccessCheck — celebratory confirmation mark for /dziekujemy ───────────
   A post-submit confirmation is a RARE, first-time moment — exactly where a
   little delight earns its keep (Emil's animation framework). The sequence:
     1. a soft ring burst ripples outward once,
     2. the pink disc springs in (scale 0.4→1 with a gentle overshoot — never
        from scale(0): things don't appear from nothing),
     3. the checkmark DRAWS itself inside via an animated pathLength.
   Reduced motion → the final state, instantly (no movement, no ripple). */
export function SuccessCheck() {
  const reduce = useReducedMotion();

  return (
    <div className="relative mb-8 grid h-16 w-16 place-items-center">
      {/* One-time ring burst — two rings, slightly offset (skipped for reduced motion) */}
      {!reduce &&
        [0, 0.14].map((d, i) => (
          <motion.span
            key={i}
            aria-hidden="true"
            className="absolute rounded-full"
            style={{ width: 64, height: 64, border: "1.5px solid var(--color-accent)" }}
            initial={{ scale: 0.7, opacity: 0.55 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{ duration: 1.05, ease: "easeOut", delay: 0.28 + d }}
          />
        ))}

      {/* Pink disc — springs in (subtle overshoot) */}
      <motion.span
        className="relative grid h-16 w-16 place-items-center rounded-full bg-pink"
        style={{ boxShadow: "0 12px 34px -10px rgba(207,67,184,0.55)" }}
        initial={reduce ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 15, delay: 0.1 }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <motion.path
            d="M5 12.5L10 17.5L19 7"
            stroke="#0b0b0d"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={reduce ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={reduce ? { duration: 0 } : { duration: 0.45, ease: EASE.out, delay: 0.45 }}
          />
        </svg>
      </motion.span>
    </div>
  );
}
