"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/* ── Magnetic ─────────────────────────────────────────────────────────────
   Emil Kowalski's decorative spring interaction: the element follows the cursor
   by a fraction of its distance, with spring momentum (useSpring) so it feels
   alive, not artificial. Wrap any CTA. Mouse-only (touch never fires mousemove);
   reduced-motion disables the pull. */
export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const x = useSpring(mvx, { stiffness: 180, damping: 14, mass: 0.4 });
  const y = useSpring(mvy, { stiffness: 180, damping: 14, mass: 0.4 });

  const onMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mvx.set((e.clientX - (r.left + r.width / 2)) * strength);
    mvy.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    mvx.set(0);
    mvy.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x, y, display: "inline-block" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
