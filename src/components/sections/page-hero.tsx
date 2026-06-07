"use client";

import { FadeUp, Reveal } from "@/components/motion";
import { EASE } from "@/lib/motion";

/* ── PageHero — shared sub-page header ─────────────────────────────────────
   One consistent, on-brand opening for every sub-page (/uslugi, /realizacje,
   /o-nas, /blog): eyebrow + big title (pink dot) + lead, on the dark canvas
   with a soft dot-grid and a coloured glow. Entrance plays on mount (these
   pages are reached via SPA navigation, not the intro), Emil-style: label
   slides in from the left, title wipes (clip-path), lead rises — fast, layered.
   Padding clears the fixed header at every breakpoint. */
export function PageHero({
  label,
  title,
  lead,
  /** Glow colour (rgba) — lets each page carry a slightly different mood. */
  glow = "rgba(207,67,184,0.13)",
}: {
  label: string;
  title: string;
  lead?: string;
  glow?: string;
}) {
  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden"
      style={{
        backgroundColor: "var(--color-bg)",
        paddingTop: "clamp(132px, 17vw, 220px)",
        paddingBottom: "clamp(36px, 5vw, 72px)",
      }}
    >
      {/* Dot grid — matches the homepage hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Coloured glow — top-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background: `radial-gradient(ellipse 52% 60% at 90% 0%, ${glow} 0%, transparent 60%)`,
        }}
      />
      {/* Bottom fade into the next (black) section — seamless world */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32"
        style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }}
      />

      <div className="container-koda relative z-10">
        <FadeUp x={-24} y={0} duration={0.6} ease={EASE.out} delay={0.05}>
          <span className="label-koda">{label}</span>
        </FadeUp>

        <Reveal className="mt-5" duration={0.85} ease={EASE.out} delay={0.12}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.035em",
              color: "var(--color-ink)",
            }}
          >
            {title}
            <span style={{ color: "var(--color-accent)" }}>.</span>
          </h1>
        </Reveal>

        {lead && (
          <FadeUp y={22} duration={0.6} ease={EASE.expo} delay={0.22} className="mt-7">
            <p className="text-lead">{lead}</p>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
