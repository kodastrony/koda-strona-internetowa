"use client";

import { useEffect, useRef } from "react";

/* ── Marquee ──────────────────────────────────────────────────────────────
   Infinite-scroll keyword strip. The BASE motion is a CSS keyframe (off the main
   thread → smooth under load, cheap on battery). On top of that we add life:
   • SCROLL-VELOCITY SKEW — the strip leans into the scroll direction and springs
     back when you stop, so it feels physical, not static. Driven by a passive
     scroll listener + a short rAF that parks itself once settled (zero idle cost).
   • PAUSE OFF-SCREEN / TAB HIDDEN — IntersectionObserver + visibilitychange flip
     animation-play-state, so the loop never burns frames when nobody's looking.
   Reduced-motion: global CSS freezes the keyframe AND we skip the skew listener →
   a calm, static keyword row. */

const ITEMS = [
  "Strony internetowe",
  "Sklepy online",
  "Projektowanie UX/UI",
  "Widoczność w Google",
  "Wsparcie po starcie",
];

function Seq() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <span key={i} className="flex items-center">
          <span
            className="font-heading font-semibold whitespace-nowrap text-[var(--color-ink)]"
            style={{
              fontSize: "clamp(1.1rem,2.3vw,1.95rem)",
              letterSpacing: "-0.02em",
              padding: "0 clamp(22px,3vw,44px)",
            }}
          >
            {it}
          </span>
          <span
            className="text-[var(--color-pink-bright)]"
            style={{ fontSize: "clamp(0.6rem,1vw,0.85rem)" }}
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  const outerRef = useRef<HTMLDivElement>(null); // visibility target + clip
  const skewRef = useRef<HTMLDivElement>(null); // gets the velocity skew (own layer)
  const trackRef = useRef<HTMLDivElement>(null); // CSS-keyframe translate (own layer)

  useEffect(() => {
    const outer = outerRef.current;
    const skewEl = skewRef.current;
    const track = trackRef.current;
    if (!outer || !skewEl || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // ── Pause the keyframe when off-screen or the tab is hidden ──────────────
    let onScreen = true;
    const sync = () => {
      track.style.animationPlayState = onScreen && !document.hidden ? "running" : "paused";
    };
    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        sync();
      },
      { rootMargin: "120px" }
    );
    io.observe(outer);
    document.addEventListener("visibilitychange", sync);

    // ── Scroll-velocity skew ────────────────────────────────────────────────
    const SKEW_MAX = 5; // deg — subtle lean, not a gimmick
    let skew = 0;
    let target = 0;
    let lastY = window.scrollY;
    let lastT = performance.now();
    let raf = 0;
    let running = false;

    const tick = () => {
      if (!running) return;
      skew += (target - skew) * 0.2; // ease toward target
      target *= 0.85; // target decays back to rest
      skewEl.style.transform = `skewX(${skew.toFixed(2)}deg)`;
      if (Math.abs(skew) < 0.03 && Math.abs(target) < 0.03) {
        skewEl.style.transform = "skewX(0deg)";
        running = false;
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => {
      if (running || document.hidden) return;
      running = true;
      lastT = performance.now();
      raf = requestAnimationFrame(tick);
    };

    let scheduled = false;
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        const now = performance.now();
        const dy = window.scrollY - lastY;
        const dt = Math.max(now - lastT, 1);
        lastY = window.scrollY;
        lastT = now;
        // px/ms → deg, clamped. Sign: scrolling down leans one way, up the other.
        const v = (dy / dt) * 9;
        target = Math.max(-SKEW_MAX, Math.min(SKEW_MAX, v));
        kick();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={outerRef}
      className="relative overflow-hidden border-y"
      aria-hidden="true"
      style={{
        borderColor: "var(--color-line)",
        backgroundColor: "var(--color-bg)",
        paddingTop: "clamp(18px,2.2vw,30px)",
        paddingBottom: "clamp(18px,2.2vw,30px)",
      }}
    >
      <div ref={skewRef} style={{ willChange: "transform" }}>
        <div
          ref={trackRef}
          className="flex w-max"
          style={{ animation: "marquee 34s linear infinite", willChange: "transform" }}
        >
          <Seq />
          <Seq />
        </div>
      </div>
      {/* edge fades so words dissolve at the margins */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32"
        style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32"
        style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
      />
    </div>
  );
}
