"use client";

import { FadeUp } from "@/components/motion";

/* ── "Dlaczego KODA" — bold manifesto ─────────────────────────────────────
   Replaces the pale thin-rule columns. A confident headline + three value props
   led by LARGE solid-accent numbers (varied across the brand ramp). Bold, not
   washed out. Reveals with a stagger on scroll. A rich pink atmosphere keeps the
   section from feeling flat. */

const VALUES = [
  {
    n: "01",
    title: "Budujemy zaufanie",
    desc: "Dopracowany wygląd i błyskawiczne ładowanie budują wiarygodność, zanim klient przeczyta pierwsze zdanie.",
    color: "var(--color-pink-bright)",
  },
  {
    n: "02",
    title: "Przyciągamy klientów",
    desc: "Projektujemy pod konkretną akcję, więc strona zamienia odwiedzających w realne zapytania.",
    color: "var(--color-accent-3)",
  },
  {
    n: "03",
    title: "Zwiększamy sprzedaż",
    desc: "Łączymy design z SEO i analityką, żeby strona pracowała na Twój wynik finansowy.",
    color: "var(--color-accent-2)",
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
      {/* Rich pink atmosphere (right) — keeps it from feeling flat/pale */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 62% at 96% 48%, rgba(207,67,184,0.13) 0%, transparent 60%)",
        }}
      />

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
            Nie robimy ładnych stron.{" "}
            <span style={{ color: "var(--color-pink-bright)" }}>Robimy skuteczne.</span>
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
            Każdy projekt zaczynamy od jednego pytania: co ta strona ma realnie osiągnąć dla Twojego
            biznesu.
          </p>
        </FadeUp>

        <div className="mt-[clamp(50px,6vw,90px)] grid grid-cols-1 gap-x-12 gap-y-14 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <FadeUp inView key={v.n} delay={0.1 * i} y={28}>
              <div>
                <div
                  aria-hidden="true"
                  className="mb-5 font-heading font-bold"
                  style={{
                    fontSize: "clamp(3rem,5vw,4.6rem)",
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
                    fontSize: "clamp(1.4rem,2.1vw,1.85rem)",
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
