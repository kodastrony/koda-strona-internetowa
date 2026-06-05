"use client";

import { motion, type Variants } from "motion/react";
import { EASE, DURATION, type Bezier } from "@/lib/motion";

const variants: Variants = {
  hidden:  { clipPath: "inset(0 100% 0 0)" },
  visible: { clipPath: "inset(0 0% 0 0)" },
};

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before the animation starts. */
  delay?: number;
  /** Animation length in seconds. */
  duration?: number;
  /** Easing curve (cubic-bezier tuple). Default EASE.smooth. */
  ease?: Bezier;
  /**
   * Trigger when the element scrolls into view instead of on mount.
   * Use for below-the-fold sections (Stage 4+); leave off for the hero,
   * which is intro-synced via `delay`.
   */
  inView?: boolean;
}

/**
 * Clip-path wipe-in (Baunfire-style reveal) — content is unveiled left → right.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  duration = DURATION.reveal,
  ease = EASE.smooth,
  inView = false,
}: RevealProps) {
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
