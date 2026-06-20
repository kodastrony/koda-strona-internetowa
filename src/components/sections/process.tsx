"use client";

import { FadeUp, Parallax } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { GlowField } from "@/components/fx/glow-field";
import { PillLink } from "@/components/ui/pill-link";
import { ProcessSteps } from "@/components/sections/process-steps";

/* ── "Jak pracujemy" — process beat on the homepage ───────────────────────
   Placed before the final CTA. The four predictable steps remove the fear of
   the unknown ("co jeśli mi się nie spodoba / utknę") — the research's
   second-biggest missing beat. The timeline (shared with /uslugi) fills as you
   scroll and lights each numbered node in turn, so the process reads as a
   journey you move through. Closes on the two real promises we can keep:
   scope+deadline in a contract and per-stage acceptance. */
export function Process() {
  return (
    <section data-header-theme="dark" data-canvas="process" className="relative">
      {/* Tło = PageCanvas (hold „process" — indygo, najchłodniejszy punkt
          strony). Indygowe światło u góry-prawej wystaje ponad sekcję i
          przelewa się przez szew w dół Work (akcent szwu #3). */}
      <Parallax
        speed={-60}
        className="pointer-events-none absolute inset-x-0 z-0"
        style={{ top: "-20%", height: "85%" }}
      >
        <GlowField
          hue={273}
          x={90}
          y={26}
          strength={0.6}
          drift
          driftDuration={31}
          edgeFade="vertical"
          className="inset-0"
        />
      </Parallax>

      <div className="container-koda section-y relative z-10">
        <div className="mb-[clamp(20px,2.5vw,36px)] flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeUp inView>
              <span className="label-koda mb-5 block">Jak pracujemy</span>
            </FadeUp>
            <FadeUp inView delay={0.06}>
              <h2 className="text-section-title max-w-[16ch]">Cztery etapy. Zero niespodzianek.</h2>
            </FadeUp>
          </div>
          <FadeUp inView delay={0.14} className="md:max-w-[340px] md:pb-2 md:text-right">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.95rem,1.05vw,1.05rem)",
                color: "var(--color-ink-muted)",
                lineHeight: 1.6,
              }}
            >
              Zakres i termin zapisujemy w umowie, zanim zaczniemy.
            </p>
          </FadeUp>
        </div>

        <ProcessSteps />

        <FadeUp inView delay={0.1} className="mt-[clamp(48px,6vw,84px)] flex justify-center">
          <Magnetic strength={0.4}>
            <PillLink
              href="/kontakt"
              bg="var(--color-surface-1)"
              border="var(--color-line-strong)"
              className="px-9 py-4 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
            >
              Porozmawiajmy
            </PillLink>
          </Magnetic>
        </FadeUp>
      </div>
    </section>
  );
}
