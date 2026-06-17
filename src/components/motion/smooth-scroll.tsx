"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import { useReducedMotion } from "motion/react";
import { useTierProfile } from "@/lib/device-tier";

/* On route change Lenis OWNS the scroll position, so Next's built-in scroll
   reset desyncs (you land on the same offset = e.g. stuck on the "next project"
   section after navigating to it). Reset Lenis to the top on every real pathname
   change. Skips the initial mount (preserves back/forward restoration) and any
   in-page #anchor navigation. Rendered inside <ReactLenis> so useLenis() works. */
function ScrollReset() {
  const pathname = usePathname();
  const lenis = useLenis();
  const prev = useRef(pathname);
  useEffect(() => {
    if (prev.current === pathname) return;
    prev.current = pathname;
    if (typeof window !== "undefined" && window.location.hash) return; // let anchors scroll
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);
  return null;
}

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
  // Płynny scroll (Lenis = pętla rAF co klatkę) tylko medium/high. low/static →
  // natywny scroll (lerp 1, bez smoothWheel) = zero rAF na słabym CPU. Opcje
  // przełączają się po montażu (jak przy reduced-motion) — bez rozjazdu hydracji.
  const smooth = useTierProfile().smoothScroll && !reduce;
  return (
    <ReactLenis
      root
      options={{
        lerp: smooth ? 0.085 : 1,
        smoothWheel: smooth,
        wheelMultiplier: 1,
        touchMultiplier: 1.5,
        syncTouch: false,
      }}
    >
      {children}
      <ScrollReset />
    </ReactLenis>
  );
}
