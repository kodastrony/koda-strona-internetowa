"use client";

import { motion, type Variants } from "motion/react";
import { EASE, DURATION } from "@/lib/motion";

const variants: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before the animation starts. */
  delay?: number;
  /** Animation length in seconds. */
  duration?: number;
  /**
   * Trigger when the element scrolls into view instead of on mount.
   * Use for below-the-fold sections (Stage 4+); leave off for the hero,
   * which is intro-synced via `delay`.
   */
  inView?: boolean;
}

/**
 * Fade + slide-up entrance — the workhorse reveal for headings, copy and CTAs.
 */
export function FadeUp({
  children,
  className,
  delay = 0,
  duration = DURATION.fade,
  inView = false,
}: FadeUpProps) {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? { once: true, margin: "0px 0px -80px 0px" } : undefined}
      transition={{ duration, ease: EASE.expo, delay }}
    >
      {children}
    </motion.div>
  );
}
