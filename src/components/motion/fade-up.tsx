"use client";

import { motion, type Variants } from "motion/react";
import { EASE, DURATION, type Bezier } from "@/lib/motion";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before the animation starts. */
  delay?: number;
  /** Animation length in seconds. */
  duration?: number;
  /** Easing curve (cubic-bezier tuple). Default EASE.expo. */
  ease?: Bezier;
  /** Initial horizontal offset in px (slide distance). Default 0 (no slide). */
  x?: number;
  /** Initial vertical offset in px (slide distance). Default 28. */
  y?: number;
  /** Initial scale (e.g. 0.92 for a subtle pop). Default 1 (no scale). */
  scale?: number;
  /**
   * Trigger when the element scrolls into view instead of on mount.
   * Use for below-the-fold sections (Stage 4+); leave off for the hero,
   * which is intro-synced via `delay`.
   */
  inView?: boolean;
}

/**
 * Fade + slide entrance — the workhorse reveal for headings, copy and CTAs.
 * `x` / `y` / `scale` let callers vary the motion per element (orchestrated,
 * direction-varied reveals — e.g. a label sliding in from the left while the
 * heading rises from below).
 */
export function FadeUp({
  children,
  className,
  delay = 0,
  duration = DURATION.fade,
  ease = EASE.expo,
  x = 0,
  y = 28,
  scale = 1,
  inView = false,
}: FadeUpProps) {
  const variants: Variants = {
    hidden:  { opacity: 0, x, y, scale },
    visible: { opacity: 1, x: 0, y: 0, scale: 1 },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? { once: true, margin: "0px 0px -80px 0px" } : undefined}
      transition={{ duration, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
