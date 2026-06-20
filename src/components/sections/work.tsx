"use client";

import { useEffect, useRef, useState } from "react";
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

// Per-kafel parametry „floatu" (patrz koda-card-float w globals.css). Sąsiednie
// kafle dryfują w PRZECIWNE strony po przekątnych (TL↑ TR↓ BL↓ BR↑) i są
// rozstrojone (różne czasy + ujemny delay = inna faza od startu), więc siatka
// 2×2 oddycha organicznie, a nie jedzie jak jeden blok. Amplituda < najmniejszy
// gap (12px) → kafle nigdy na siebie nie nachodzą.
const FLOAT = [
  {
    "--cf-y": "-9px",
    "--cf-x": "4px",
    "--cf-r": "-0.6deg",
    "--cf-dur": "8.5s",
    "--cf-delay": "-1.2s",
  },
  {
    "--cf-y": "8px",
    "--cf-x": "-5px",
    "--cf-r": "0.6deg",
    "--cf-dur": "10.2s",
    "--cf-delay": "-3.6s",
  },
  {
    "--cf-y": "7px",
    "--cf-x": "-4px",
    "--cf-r": "0.5deg",
    "--cf-dur": "9.4s",
    "--cf-delay": "-2.1s",
  },
  {
    "--cf-y": "-8px",
    "--cf-x": "5px",
    "--cf-r": "-0.55deg",
    "--cf-dur": "11.1s",
    "--cf-delay": "-5.2s",
  },
] as unknown as React.CSSProperties[];

export function Work() {
  const reduce = useReducedMotion();

  // Float kafli PAUZUJE poza ekranem (ten sam wzorzec co koda-blob): uśpiona
  // animacja nie tyka kompozytora. Duży rootMargin = budzi się przed wjazdem.
  const gridRef = useRef<HTMLDivElement>(null);
  const [floatOn, setFloatOn] = useState(true);
  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setFloatOn(entry.isIntersecting), {
      rootMargin: "40% 0px 40% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
        <div ref={gridRef} className="grid grid-cols-2" style={{ gap: "clamp(12px,2.4vw,32px)" }}>
          {GRID.map((p, i) => (
            // Wrapper „float" (ciągły, organiczny dryf) — OSOBNY element od
            // ProjectCard, więc hover-tilt karty działa niezależnie. Reduced-motion
            // gasi animację w CSS; off-screen pauzuje przez animationPlayState.
            <div
              key={p.id}
              className="koda-card-float"
              style={{ ...FLOAT[i], animationPlayState: floatOn ? "running" : "paused" }}
            >
              <ProjectCard
                project={p}
                delay={i * 0.06}
                priority={i < 2}
                sizes="(min-width: 768px) 46vw, 47vw"
              />
            </div>
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
