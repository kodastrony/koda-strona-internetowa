"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useReducedMotion, type MotionStyle } from "motion/react";

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

export function Parallax({
  children,
  speed = 60,
  scaleFrom,
  fade = false,
  className,
  style,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // ★ HYDRACJA: useReducedMotion() zwraca false na SERWERZE i w PIERWSZYM renderze
  // klienta, a true (u usera z reduced-motion) dopiero po zamontowaniu. Gdybyśmy
  // rozgałęziali RENDER po `reduce` od razu (jak wcześniej: <div> vs <motion.div>),
  // SSR i pierwszy render klienta różniłyby się → mismatch hydracji (React #418/#425)
  // na KAŻDEJ stronie z Parallaxem. Dlatego honorujemy reduced-motion DOPIERO po
  // mount (`hydrated`), a pierwszy render zawsze = wariant ruchu (zgodny z SSR).
  // Ten sam idiom co <FadeUp>: jeden element + ten sam DOM, różni się tylko styl.
  const [hydrated, setHydrated] = useState(false);
  // Mount flag (post-hydracja) — standardowy wzorzec; setState w efekcie świadomy.
  /* eslint-disable-next-line react-hooks/set-state-in-effect */
  useEffect(() => setHydrated(true), []);

  // 0 = element's top hits viewport bottom (entering); 1 = element's bottom
  // leaves the viewport top (gone). The whole pass through the screen.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [scaleFrom ?? 1, 1, scaleFrom ?? 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.18, 0.82, 1], [0.35, 1, 1, 0.35]);

  // Reduced motion → bez parallaxu (statyczny styl), ale TYLKO po hydracji (patrz
  // wyżej). Zawsze renderujemy <motion.div ref={ref}> — zmienia się wyłącznie styl
  // (MotionValues vs statyczny), więc element się nie przemontowuje i nie ma mismatchu.
  const motionStyle: MotionStyle =
    hydrated && reduce
      ? { ...style }
      : {
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
