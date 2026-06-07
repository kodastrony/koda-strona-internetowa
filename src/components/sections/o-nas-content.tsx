"use client";

import { FadeUp } from "@/components/motion";

const PRINCIPLES = [
  {
    n: "01",
    title: "Cel, nie ozdoby",
    desc: "Każdy element strony ma zadanie. Jeśli nie pomaga klientowi podjąć decyzji — nie ma go.",
    color: "var(--color-pink-bright)",
  },
  {
    n: "02",
    title: "Szybkość to szacunek",
    desc: "Nie każemy nikomu czekać. Lekki kod i optymalizacja to u nas standard, nie płatny dodatek.",
    color: "var(--color-accent-3)",
  },
  {
    n: "03",
    title: "Pod biznes, nie pod szablon",
    desc: "Budujemy od podstaw, pod konkretny cel. Twoja strona nie wygląda jak tysiąc innych.",
    color: "var(--color-accent-2)",
  },
  {
    n: "04",
    title: "Zostajemy po starcie",
    desc: "Wdrożenie to początek współpracy. Rozwijamy stronę razem z Twoim biznesem.",
    color: "var(--color-accent-4)",
  },
];

export function ONasContent() {
  return (
    <>
      {/* ── Manifest ── */}
      <section
        data-header-theme="dark"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="container-koda"
          style={{ paddingTop: "clamp(20px,3vw,48px)", paddingBottom: "clamp(60px,8vw,120px)" }}
        >
          <div className="max-w-[20ch]">
            <FadeUp inView>
              <h2
                className="font-heading font-semibold"
                style={{
                  fontSize: "clamp(2rem,4.6vw,3.6rem)",
                  lineHeight: 1.05,
                  letterSpacing: "-0.03em",
                  color: "var(--color-ink)",
                  textWrap: "balance",
                }}
              >
                Jesteśmy studiem z jedną{" "}
                <span style={{ color: "var(--color-pink-bright)" }}>zasadą</span>: strona ma
                działać.
              </h2>
            </FadeUp>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-x-14 gap-y-6 md:grid-cols-2">
            <FadeUp inView delay={0.08}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.05rem,1.3vw,1.22rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                }}
              >
                KODA to niewielki zespół projektantów i programistów z Polski. Tworzymy strony i
                sklepy dla polskich firm — od lokalnych biznesów po rozwijające się marki. Bez
                korporacyjnego żargonu i bez gotowych szablonów.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.14}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.05rem,1.3vw,1.22rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                }}
              >
                Wierzymy, że dobra strona to nie ta najładniejsza, tylko ta, która realnie przynosi
                klientów. Dlatego każdy projekt zaczynamy od pytania o cel, a kończymy na stronie,
                która szybko się ładuje, dobrze wygląda na każdym ekranie i prowadzi odwiedzającego
                prosto do kontaktu.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section
        data-header-theme="dark"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-graphite)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40"
          style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 60% at 95% 30%, rgba(207,67,184,0.12) 0%, transparent 60%)",
          }}
        />

        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-5 block">W co wierzymy</span>
          </FadeUp>
          <FadeUp inView delay={0.06}>
            <h2 className="text-section-title max-w-[18ch]">
              Cztery zasady, które prowadzą każdy projekt
            </h2>
          </FadeUp>

          <div className="mt-[clamp(44px,5.5vw,80px)] grid grid-cols-1 gap-x-12 gap-y-12 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <FadeUp inView key={p.n} delay={0.07 * i} y={26}>
                <div className="flex gap-6">
                  <div
                    aria-hidden="true"
                    className="font-heading font-bold"
                    style={{
                      fontSize: "clamp(2rem,3vw,2.8rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: p.color,
                    }}
                  >
                    {p.n}
                  </div>
                  <div>
                    <h3
                      className="mb-2.5 font-heading font-semibold"
                      style={{
                        fontSize: "clamp(1.3rem,1.9vw,1.7rem)",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.12,
                        color: "var(--color-ink)",
                      }}
                    >
                      {p.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "1rem",
                        lineHeight: 1.6,
                        color: "var(--color-ink-muted)",
                        maxWidth: "38ch",
                      }}
                    >
                      {p.desc}
                    </p>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
