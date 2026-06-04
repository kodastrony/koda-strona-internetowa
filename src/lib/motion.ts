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
  expo:     [0.19, 1, 0.22, 1]       as Bezier,
  /** smooth in-out — balanced, used for clip-path reveals. */
  smooth:   [0.63, 0.03, 0.21, 1]    as Bezier,
  /** slow & dramatic — overlay fades and big "moment" beats. */
  primary:  [0.475, 0.425, 0, 0.995] as Bezier,
  /** snappy start — quick UI feedback. */
  quick:    [0.835, -0.005, 0.06, 1] as Bezier,
  /** intro-only: tuned so f(0.5) ≈ 0.705 → the sweep crosses KODA's midpoint. */
  crossing: [0, 0, 0.67, 1]          as Bezier,
} as const;

/**
 * Durations in SECONDS (motion/react uses seconds; CSS uses ms).
 * Mirror of globals.css `--duration-*` (÷1000).
 */
export const DURATION = {
  fast:   0.15,
  base:   0.3,
  slow:   0.6,
  reveal: 0.85,
  fade:   0.9,
} as const;

/**
 * Length of the intro overlay (seconds). Hero + Header delay their entrance by
 * this value so content appears exactly as the overlay fades out.
 *
 * Breakdown: Phase 0-2 (1380ms) + Phase 3 sweeps (1000ms) + 100ms hold ≈ 2480ms.
 * See intro-animation.tsx for the full phase sequence.
 */
export const INTRO_DURATION = 2.5;

/** Format a Bezier tuple as a CSS `cubic-bezier(...)` string for inline styles. */
export const cssBezier = (b: Bezier): string => `cubic-bezier(${b.join(", ")})`;
