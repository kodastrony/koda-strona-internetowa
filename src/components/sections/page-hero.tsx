"use client";

import { Parallax } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";

/* ── PageHero — shared sub-page header ─────────────────────────────────────
   One consistent, on-brand opening for every sub-page (/uslugi, /realizacje,
   /o-nas): eyebrow + big title (pink dot) + lead, on the shared PageCanvas
   with a soft dot-grid and a GlowField. Entrance plays on mount (these
   pages are reached via SPA navigation, not the intro), Emil-style: label
   slides in from the left, title wipes (clip-path), lead rises — fast, layered.
   Padding clears the fixed header at every breakpoint. */
export function PageHero({
  label,
  title,
  lead,
  /** Hue OKLCH światła sekcji (340 pink · 324 magenta · 300 violet) — mood per page. */
  hue = 340,
}: {
  label: string;
  title: string;
  lead?: string;
  hue?: number;
}) {
  return (
    <section
      data-header-theme="dark"
      data-canvas="hero"
      className="relative"
      style={{
        paddingTop: "clamp(132px, 17vw, 220px)",
        paddingBottom: "clamp(36px, 5vw, 72px)",
      }}
    >
      {/* Dot grid — matches the homepage hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Light field — top-right, drifts on scroll; bleeds below the section
          so the light carries into the content (no clipped edge). */}
      <Parallax
        speed={55}
        className="pointer-events-none absolute inset-x-0 z-0"
        style={{ top: 0, height: "130%" }}
      >
        <GlowField
          hue={hue}
          x={88}
          y={16}
          strength={0.9}
          drift
          driftDuration={29}
          edgeFade="vertical"
          className="inset-0"
        />
      </Parallax>

      {/* data-logo-hide-anchor: czoło treści hero — gdy zjedziesz tak, że
          nagłówek dochodzi do logo, „KODA" płynnie znika i ZOSTAJE schowane
          (na mobile inaczej wordmark zasłaniałby całą treść). Powrót na górę =
          logo wraca. Stabilny box (nie animowany) — patrz useLogoHidden. */}
      {/* Wejścia label/H1/lead w CZYSTYM CSS (.ph-*-in, globals.css) — ta sama
          choreografia co dawne FadeUp/Reveal, ale grana od pierwszego malowania,
          bez czekania na hydrację JS. Tekst hero to LCP każdej podstrony: audyt
          CWV 2026-08-26 mierzył przez to LCP 5–7 s (element render delay do
          2,3 s) — po zmianie tekst maluje się tuż po FCP. */}
      <div data-logo-hide-anchor className="container-koda relative z-10">
        <div className="ph-label-in">
          <span className="label-koda">{label}</span>
        </div>

        <div className="ph-title-in mt-5">
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
        </div>

        {lead && (
          <div className="ph-lead-in mt-7">
            <p className="text-lead">{lead}</p>
          </div>
        )}
      </div>
    </section>
  );
}
