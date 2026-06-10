"use client";

import { FadeUp, Parallax } from "@/components/motion";

/* ── "Dlaczego KODA" — bold manifesto ─────────────────────────────────────
   Replaces the pale thin-rule columns. A confident headline + three value props
   led by LARGE solid-accent numbers (varied across the brand ramp). Bold, not
   washed out. Reveals with a stagger on scroll. A rich pink atmosphere keeps the
   section from feeling flat. */

const VALUES = [
  {
    n: "01",
    title: "Pod konkretny cel, nie pod szablon",
    desc: "Projektujemy i piszemy od zera, wokół jednego celu biznesowego. Twoja strona nie wygląda jak tysiąc innych.",
    color: "var(--color-pink-bright)",
  },
  {
    n: "02",
    title: "Projekt i kod w jednych rękach",
    desc: "Bez podwykonawców i przekazywania projektu dalej. Piszesz do KODA — rozmawiasz z KODA, nie z account managerem.",
    color: "var(--color-accent-3)",
  },
  {
    n: "03",
    title: "Wszystko ustalone w umowie",
    desc: "Zakres, termin i zasady masz na piśmie, zanim zaczniemy.",
    color: "var(--color-accent-2)",
  },
  {
    n: "04",
    title: "Zostajemy po starcie",
    desc: "Większość agencji znika po wdrożeniu. My zostajemy — aktualizacje, bezpieczeństwo i rozwój strony, gdy firma rośnie.",
    color: "var(--color-accent-4)",
  },
];

export function WhyKoda() {
  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-graphite)" }}
    >
      {/* Smooth fades into the black sections above/below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40"
        style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40"
        style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }}
      />
      {/* Rich pink atmosphere (right) — keeps it from feeling flat/pale; drifts
          gently on scroll (opposite direction to the Services glow → layered depth). */}
      <Parallax speed={-70} className="pointer-events-none absolute inset-0 z-0">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 62% at 96% 48%, rgba(207,67,184,0.13) 0%, transparent 60%)",
          }}
        />
      </Parallax>

      <div className="container-koda section-y relative z-10">
        <FadeUp inView>
          <span className="label-koda mb-6 block">Dlaczego my</span>
        </FadeUp>
        <FadeUp inView delay={0.06}>
          <h2
            className="max-w-[18ch] font-heading font-semibold"
            style={{
              fontSize: "clamp(2rem,4.6vw,3.6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              textWrap: "balance",
            }}
          >
            Jedno studio.{" "}
            <span style={{ color: "var(--color-pink-bright)" }}>Pełna odpowiedzialność.</span>
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.14}>
          <p
            className="mt-6 max-w-[56ch]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.02rem,1.3vw,1.2rem)",
              lineHeight: 1.6,
              color: "var(--color-ink-muted)",
            }}
          >
            Projekt, kod i wsparcie prowadzimy u siebie — od pierwszej rozmowy po start strony i
            przez całą jej pracę.
          </p>
        </FadeUp>

        <div className="mt-[clamp(50px,6vw,90px)] grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((v, i) => (
            <FadeUp inView key={v.n} delay={0.08 * i} y={28}>
              <div>
                <div
                  aria-hidden="true"
                  className="mb-5 font-heading font-bold"
                  style={{
                    fontSize: "clamp(2.6rem,4vw,3.6rem)",
                    lineHeight: 1,
                    letterSpacing: "-0.04em",
                    color: v.color,
                  }}
                >
                  {v.n}
                </div>
                <h3
                  className="mb-3 font-heading font-semibold"
                  style={{
                    fontSize: "clamp(1.3rem,1.8vw,1.6rem)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.12,
                    color: "var(--color-ink)",
                  }}
                >
                  {v.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    lineHeight: 1.65,
                    color: "var(--color-ink-muted)",
                    maxWidth: "34ch",
                  }}
                >
                  {v.desc}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
