"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

/**
 * Header wordmark visibility — "hide once it reaches the main heading, stay hidden".
 *
 * Behaviour the user asked for: the KODA mark is visible at the TOP of the page,
 * and the moment you've scrolled down far enough that it would start covering the
 * page's main heading, it eases away — and STAYS gone for the rest of the scroll
 * down (it never pops back in over lower content). Scroll back up to the top and
 * it eases back in.
 *
 * This is a single MONOTONIC threshold, not per-element collision: we hide once a
 * page's hide-anchor (`[data-logo-hide-anchor]`, placed on the very top of the
 * hero / contact content) has risen to the logo, and keep it hidden while the
 * anchor stays above. Because the anchor's viewport `top` only decreases as you
 * scroll down, there is exactly ONE hide transition going down and ONE show going
 * back up — no in-between gaps, no flicker islands, nothing to debounce.
 *
 * TECHNIQUE: passive scroll/resize listener + ResizeObserver reading
 * getBoundingClientRect (NOT rAF / IntersectionObserver — those stall in the
 * preview tooling; a direct listener is verifiable by dispatching a scroll). A
 * small hysteresis band keeps momentum scrolling from toggling at the exact line.
 *
 * @param logoRef ref to a STABLE (never-transformed) element whose box equals the
 *   logo's slot — measuring the element we fade/translate would feed its own
 *   offset back into the test.
 */
export function useLogoHidden<T extends HTMLElement>(logoRef: RefObject<T | null>): boolean {
  const [hidden, setHidden] = useState(false);
  // Synchronous mirror of the committed state for the listener (no stale closure).
  const hiddenRef = useRef(false);

  useEffect(() => {
    const logo = logoRef.current;
    if (!logo) return;

    // Hide a touch BEFORE the anchor's top actually reaches the logo; then require
    // it to drop back HYST px below that line before showing again. The dead-band
    // stops momentum scrolling from flickering right at the boundary.
    const PAD = 8;
    const HYST = 28;

    // The anchor set only changes on a layout shift (route change), so cache it and
    // refresh from the ResizeObserver — never query on every scroll frame.
    let anchors: HTMLElement[] = [];
    const refreshAnchors = () => {
      anchors = Array.from(document.querySelectorAll<HTMLElement>("[data-logo-hide-anchor]"));
    };

    const commit = (next: boolean) => {
      if (next === hiddenRef.current) return;
      hiddenRef.current = next;
      setHidden(next);
    };

    const check = () => {
      const l = logo.getBoundingClientRect();
      if (l.width === 0 && l.height === 0) return; // not laid out yet
      const hideLine = l.bottom + PAD; // anchor.top at/above this ⇒ would cover content

      // Top-most anchor currently nearest/above the logo (one per page in practice).
      let minTop = Infinity;
      for (const a of anchors) {
        const r = a.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.top < minTop) minTop = r.top;
      }
      if (minTop === Infinity) {
        commit(false); // no anchor on this page → never auto-hide
        return;
      }

      // Hysteresis: hide as the anchor reaches the line; only show once it has come
      // back down clearly past the line (+ dead-band). Monotonic in scroll → no flicker.
      const next = hiddenRef.current
        ? minTop < hideLine + HYST // stay hidden until well below again
        : minTop <= hideLine; //      hide as it reaches the line
      commit(next);
    };

    refreshAnchors();
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check);

    // Route change / fonts / images settling → re-read anchors AND re-test (fires
    // once on mount too). The callback never resizes the document, so it can't loop.
    const ro = new ResizeObserver(() => {
      refreshAnchors();
      check();
    });
    ro.observe(document.documentElement);

    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      ro.disconnect();
    };
  }, [logoRef]);

  return hidden;
}
