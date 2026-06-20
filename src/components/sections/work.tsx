"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp, Parallax } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { PillLink } from "@/components/ui/pill-link";
import { ProjectCard } from "@/components/ui/project-card";
import { getProject } from "@/lib/projects";

// ══════════════════════════════════════════════════════════════════════
// Homepage "Nasze realizacje" — a curated teaser shown as a 2×2 grid of four
// equal square-ish cards (życzenie usera „4 kwadraty, jak wcześniej"):
//   ┌────────────┬────────────┐
//   │  RIKOSZET  │  GRABOWSKI │   (lewy-górny / prawy-górny)
//   ├────────────┼────────────┤
//   │ JR MODULAR │  DRBLOCKS  │   (lewy-dolny / prawy-dolny)
//   └────────────┴────────────┘
// Kolejność w DOM = kolejność czytania siatki, więc grid-cols-2 układa je
// dokładnie w te rogi. Karty to wspólny <ProjectCard> (ten sam komponent co na
// /realizacje). Slice + Wycisk żyją na /realizacje.
const GRID = ["rikoszet", "grabowski", "jr-modular", "drblocks"].map((id) => getProject(id)!);

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
          edgeFade="vertical"
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
                initial={{ clipPath: "inset(-40% 100% -40% 0)" }}
                whileInView={{ clipPath: "inset(-40% 0% -40% 0)" }}
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

        {/* ── 2×2 grid (4 kwadraty) ──
            Dwie kolumny NA KAŻDYM urządzeniu (siatka 2×2 = „cztery kwadraty”),
            stała proporcja 4:3 wspólna z resztą portfolio. Kolejność rikoszet →
            grabowski → jr-modular → drblocks daje rogi: TL, TR, BL, BR. */}
        <div className="grid grid-cols-2" style={{ gap: "clamp(12px,2.4vw,32px)" }}>
          {GRID.map((p, i) => (
            // Scroll-parallax jak na /realizacje (RealizacjeContent): kolumny
            // dryfują w PRZECIWNE strony ze scrollem (lewa do góry, prawa w dół),
            // więc siatka „scrolluje się nierównomiernie" i coś się dzieje — bez
            // żadnego ruchu w spoczynku (kafle stoją prosto). Transform-only;
            // reduced-motion = Parallax przepuszcza statycznie (zero ruchu). Te
            // same wartości prędkości co realizacje (spójny feel obu siatek).
            <Parallax key={p.id} speed={i % 2 === 0 ? -26 : 34}>
              <ProjectCard
                project={p}
                delay={i * 0.06}
                priority={i < 2}
                sizes="(min-width: 768px) 46vw, 47vw"
              />
            </Parallax>
          ))}
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
