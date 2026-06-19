"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp, Parallax } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { PillLink } from "@/components/ui/pill-link";
import { ProjectCard } from "@/components/ui/project-card";
import { getProject } from "@/lib/projects";

// ══════════════════════════════════════════════════════════════════════
// Homepage "Nasze realizacje" — a curated teaser (4 of the portfolio). Bento:
// RIKOSZET leads full-width (the most spectacular 3D piece), then a 3-up row —
// JR Modular (kontenery) left, DrBlocks centre (directly under the lead) and
// Grabowski right. Slice + Wycisk live on /realizacje. Cards are the shared
// <ProjectCard> (same component as /realizacje); the trio drifts gently on
// scroll (transform-only Parallax) for a living, layered grid.
const LEAD = getProject("rikoszet")!;
const TRIO = ["jr-modular", "drblocks", "grabowski"].map((id) => getProject(id)!);
// Centre card (DrBlocks) drifts the opposite way to the flanks → quiet depth.
const TRIO_DRIFT = [26, -18, 26];

export function Work() {
  const reduce = useReducedMotion();

  return (
    <section data-header-theme="dark" data-canvas="work" className="relative">
      {/* Magenta light, top-left — soft seam into the next section (canvas-owned). */}
      <Parallax
        speed={-55}
        className="pointer-events-none absolute inset-x-0 z-0"
        style={{ top: "-12%", height: "70%" }}
      >
        <GlowField
          hue={324}
          x={10}
          y={28}
          strength={0.8}
          drift
          driftDuration={19}
          className="inset-0"
        />
      </Parallax>

      <div className="container-koda section-y relative z-10">
        {/* ── Section header ── */}
        <div className="mb-[clamp(36px,4.5vw,64px)]">
          <FadeUp inView>
            <span className="label-koda mb-5 block">Realizacje</span>
          </FadeUp>
          <h2 className="text-section-title">
            {["Nasze realizacje", "stron internetowych."].map((line, i) => (
              <motion.span
                key={line}
                data-reveal
                className="block"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.85, ease: EASE.out, delay: 0.06 + i * 0.1 }
                }
              >
                {line}
              </motion.span>
            ))}
          </h2>
        </div>

        {/* ── Bento ── */}
        <div className="flex flex-col" style={{ gap: "clamp(20px,2.8vw,36px)" }}>
          {/* Lead — RIKOSZET, full-width. Responsive aspect: near-native 16:10 on
              phones (overlay breathes, no over-crop) → cinematic wide on lg. */}
          <ProjectCard
            project={LEAD}
            delay={0}
            priority
            aspectClassName="pb-[62%] sm:pb-[52%] lg:pb-[46%]"
            imageSrc={LEAD.showcase}
            imageSrcSet="/realizacje/rikoszet-showcase-640.webp 640w, /realizacje/rikoszet-showcase.webp 1680w"
            sizes="92vw"
          />

          {/* Trio — JR (left) · DrBlocks (centre, under the lead) · Grabowski (right).
              3-up only at lg (matches the site's 2-col-max rhythm; avoids cramped
              ~209px cards at md). md/tablet = full-width stacked. */}
          <div
            className="grid grid-cols-1 lg:grid-cols-3"
            style={{ gap: "clamp(20px,2.8vw,36px)" }}
          >
            {TRIO.map((p, i) => (
              <Parallax key={p.id} speed={TRIO_DRIFT[i]} style={{ willChange: "transform" }}>
                <ProjectCard
                  project={p}
                  delay={0.05 + i * 0.07}
                  sizes="(min-width: 768px) 31vw, 92vw"
                />
              </Parallax>
            ))}
          </div>
        </div>

        {/* ── View-all CTA ── */}
        <div style={{ marginTop: "clamp(48px,6vw,84px)" }}>
          <FadeUp inView delay={0.08} className="flex justify-center">
            <PillLink
              href="/realizacje"
              bg="var(--color-surface-1)"
              border="var(--color-line-strong)"
              className="px-9 py-4 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            >
              Zobacz wszystkie realizacje
            </PillLink>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
