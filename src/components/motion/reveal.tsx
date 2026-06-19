"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { EASE, DURATION, type Bezier } from "@/lib/motion";

// Ujemne top/bottom (−40% wysokości pudełka) sprawiają, że clip NIE ucina
// descenderów (y, j, ę, ą) ani znaków diakrytycznych nad literami przy ciasnym
// line-height nagłówków. Poziomy wipe (right 100%→0%) działa bez zmian; %
// odnosi się do wysokości pudełka, więc skaluje się dla KAŻDEGO rozmiaru fontu.
const variants: Variants = {
  hidden: { clipPath: "inset(-40% 100% -40% 0)" },
  visible: { clipPath: "inset(-40% 0% -40% 0)" },
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
  // Reduced motion: reveal instantly (no clip-path wipe), since motion/react JS
  // animations bypass the global CSS reduced-motion rule.
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      variants={variants}
      initial="hidden"
      animate={inView ? undefined : "visible"}
      whileInView={inView ? "visible" : undefined}
      viewport={inView ? { once: true, margin: "0px 0px -80px 0px" } : undefined}
      transition={reduce ? { duration: 0 } : { duration, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
