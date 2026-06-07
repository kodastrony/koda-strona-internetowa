/**
 * Motion system — single source of truth for animation timing.
 *
 * These are the JS / Framer-Motion mirrors of the CSS animation tokens in
 * globals.css (`--ease-*`, `--duration-*`). The two MUST stay in sync: if you
 * retune a curve here, mirror it in globals.css (and vice-versa). CSS keyframe
 * animations read the CSS vars; anything driven by `motion/react` reads these.
 *
 * Usage:
 *   import { EASE, DURATION, cssBezier } from "@/lib/motion";
 *   transition={{ ease: EASE.expo, duration: DURATION.reveal }}   // motion/react
 *   style={{ transition: `color 500ms ${cssBezier(EASE.expo)}` }} // inline CSS
 */

/** A cubic-bezier control-point tuple, as motion/react expects it. */
export type Bezier = [number, number, number, number];

/**
 * Easing curves (mirror of globals.css `--ease-*`).
 * Derived from the Baunfire analysis — `expo` is the KODA signature curve.
 */
export const EASE = {
  /** ease-out expo — fast, energetic start with a smooth settle. THE KODA curve. */
  expo: [0.19, 1, 0.22, 1] as Bezier,
  /** smooth in-out — balanced, used for clip-path reveals. */
  smooth: [0.63, 0.03, 0.21, 1] as Bezier,
  /** slow & dramatic — overlay fades and big "moment" beats. */
  primary: [0.475, 0.425, 0, 0.995] as Bezier,
  /** snappy start — quick UI feedback. */
  quick: [0.835, -0.005, 0.06, 1] as Bezier,
  /** intro-only: f(0.5) ≈ 0.7355 → the bg sweep reaches the KODA text's visual
   *  centre (ink centre ≈ 73.6% of the viewport for typical sizes) exactly when
   *  the text sweep does, so the two lines meet in the middle of the letters. */
  crossing: [0, 0, 0.47, 1] as Bezier,
  /** gentle overshoot ("back") — for playful pop-in of buttons / CTAs. */
  back: [0.34, 1.4, 0.64, 1] as Bezier,
  /** Emil Kowalski's strong ease-out — entrances/reveals (punchy, responsive). */
  out: [0.23, 1, 0.32, 1] as Bezier,
  /** Emil's strong ease-in-out — on-screen movement / morphing / wipes. */
  inOut: [0.77, 0, 0.175, 1] as Bezier,
  /** iOS-like "drawer" curve (Ionic) — buttery section/panel motion. */
  drawer: [0.32, 0.72, 0, 1] as Bezier,
} as const;

/**
 * Durations in SECONDS (motion/react uses seconds; CSS uses ms).
 * Mirror of globals.css `--duration-*` (÷1000).
 */
export const DURATION = {
  fast: 0.15,
  base: 0.3,
  slow: 0.6,
  reveal: 0.85,
  fade: 0.9,
} as const;

/**
 * Intro→content handoff anchor (seconds). Hero + Header delay their entrance by
 * this value, so content begins revealing exactly as the intro's two lines
 * FINISH painting the scene.
 *
 * This is intentionally the "lines done" moment, NOT the moment the overlay is
 * fully gone. The overlay then cross-fades over the next ~0.28s, but its final
 * frame (dark bg + KODA #1c1c1c) is pixel-identical to the hero beneath it — so
 * the fade is invisible and the content reveal shows THROUGH it. Anchoring here
 * (rather than at overlay-gone) makes the reveals overlap the settle and land
 * in the open, the way baunfire's content does, instead of finishing hidden.
 *
 * Real phase sum: Phase 0 (~0.13s) + Phase 1 letters (0.85 + 0.42 stagger) +
 * 0.10 hold + Phase 3 lines (0.85) ≈ 2.40s. See intro-animation.tsx.
 */
export const INTRO_DURATION = 2.4;

/** Format a Bezier tuple as a CSS `cubic-bezier(...)` string for inline styles. */
export const cssBezier = (b: Bezier): string => `cubic-bezier(${b.join(", ")})`;
