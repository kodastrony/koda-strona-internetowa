"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionStyle,
} from "motion/react";

/* ── Parallax — scroll-linked drift for depth ─────────────────────────────
   As the element travels through the viewport, it translates on Y (and
   optionally scales / fades) in proportion to scroll progress. Built on
   motion's useScroll/useTransform, which read scroll once per frame and write
   only transform/opacity (GPU) — so it stays smooth and cheap even with several
   on a page. Lenis already smooths the scroll feed. Reduced-motion → static
   passthrough (no transform at all).

   `speed` = peak vertical travel in px. Positive = element drifts UP as you
   scroll down (reads as "further away / slower than the page" → depth).
   Negative = drifts down / faster. Keep values modest (20–120) so it reads as
   depth, not detachment. */
interface ParallaxProps {
  children: React.ReactNode;
  /** Peak Y travel in px (peak-to-peak ≈ 2×). Default 60. */
  speed?: number;
  /** If set (e.g. 1.06), the element scales from this → 1 → this across the pass. */
  scaleFrom?: number;
  /** Fade in/out at the edges of the pass (decorative elements). */
  fade?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Parallax({ children, speed = 60, scaleFrom, fade = false, className, style }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  // 0 = element's top hits viewport bottom (entering); 1 = element's bottom
  // leaves the viewport top (gone). The whole pass through the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleFrom ?? 1, 1, scaleFrom ?? 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.35]);

  if (reduce) {
    return (
      <div ref={ref} className={className} style={style}>
        {children}
      </div>
    );
  }

  const motionStyle: MotionStyle = {
    y,
    willChange: "transform",
    ...(scaleFrom ? { scale } : {}),
    ...(fade ? { opacity } : {}),
    ...style,
  };

  return (
    <motion.div ref={ref} className={className} style={motionStyle}>
      {children}
    </motion.div>
  );
}
