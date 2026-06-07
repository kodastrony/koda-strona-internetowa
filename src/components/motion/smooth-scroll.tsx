"use client";

import { ReactLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";

/* ── Smooth scroll (Lenis) — the foundation of the "experience" feel ──────
   Lenis is the smooth-scroll engine top agencies use for buttery 60fps scroll.
   It turns plain scrolling into momentum-based, physics-y motion, and lets every
   scroll-linked reveal/parallax glide instead of stepping. `root` attaches it to
   the window (fixed header + custom scrollbar keep working; native `scroll`
   events still fire, so existing parallax listeners and motion's useScroll work).

   Reduced-motion: lerp 1 + smoothWheel off → effectively native/instant scroll
   (Emil/a11y: reduced motion means gentler, not broken). The wrapper always
   renders, so there is no hydration mismatch — only the options flip post-mount. */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <ReactLenis
      root
      options={{
        lerp: reduce ? 1 : 0.085,
        smoothWheel: !reduce,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
