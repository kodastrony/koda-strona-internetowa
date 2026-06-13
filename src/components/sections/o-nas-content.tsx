"use client";

import { FadeUp } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";

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
    desc: "Lekki kod i szybkie ładowanie to u nas standard, nie płatny dodatek.",
    color: "var(--color-accent)",
  },
  {
    n: "03",
    title: "Pod biznes, nie pod szablon",
    desc: "Budujemy od podstaw, pod konkretny cel. Twoja strona nie wygląda jak tysiąc innych.",
    color: "var(--color-pink-bright)",
  },
  {
    n: "04",
    title: "Zostajemy po starcie",
    desc: "Większość agencji znika po wdrożeniu. My zostajemy: szybka odpowiedź, aktualizacje i rozwój — gdy firma rośnie.",
    color: "var(--color-accent)",
  },
];

export function ONasContent() {
  return (
    <>
      {/* ── Manifest ── */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div
          className="container-koda grid grid-cols-1 gap-x-12 gap-y-9 md:grid-cols-12"
          style={{ paddingTop: "clamp(24px,3vw,52px)", paddingBottom: "clamp(60px,8vw,120px)" }}
        >
          {/* Statement — the focal point, alone in its column */}
          <div className="md:col-span-5">
            <FadeUp inView>
              <h2
                className="font-heading font-semibold md:sticky md:top-32"
                style={{
                  fontSize: "clamp(2rem,4.4vw,3.4rem)",
                  lineHeight: 1.06,
                  letterSpacing: "-0.03em",
                  color: "var(--color-ink)",
                  textWrap: "balance",
                }}
              >
                Traktujemy każdą stronę jak{" "}
                <span style={{ color: "var(--color-pink-bright)" }}>produkt, nie jak zlecenie</span>
                .
              </h2>
            </FadeUp>
          </div>

          {/* Supporting paragraphs — the read, set apart from the statement */}
          <div className="flex max-w-[58ch] flex-col gap-6 md:col-span-7">
            <FadeUp inView delay={0.08}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.08rem,1.35vw,1.28rem)",
                  lineHeight: 1.6,
                  color: "var(--color-ink)",
                }}
              >
                Większość stron dla polskich firm wygląda jak szablon, działa jak szablon i daje
                wyniki jak szablon. KODA powstała z prostego przekonania: da się inaczej — i
                pokazujemy to w każdym projekcie.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.12}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.05rem,1.3vw,1.22rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                }}
              >
                Nie korzystamy z gotowych szablonów i nie oddajemy Twojego projektu podwykonawcom.
                Każdy projekt prowadzimy sami — od pierwszej rozmowy, przez projekt i kod, po opiekę
                po starcie. Piszesz do KODA — rozmawiasz z KODA, nie z account managerem.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.16}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.05rem,1.3vw,1.22rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                }}
              >
                Mamy jasne zasady i pełną odpowiedzialność za każdy projekt, który podejmujemy.
                Jeśli szukasz strony, która ma realnie pracować na Twoją firmę — porozmawiajmy.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Principles ── */}
      <section data-header-theme="dark" data-canvas="tint" className="relative">
        {/* Tło = PageCanvas (fioletowy hold „tint"); światło wystaje ponad
            sekcję i świeci przez szew w górę manifestu. */}
        <GlowField
          hue={300}
          x={92}
          y={30}
          strength={0.8}
          drift
          driftDuration={27}
          className="inset-x-0 z-0"
          style={{ top: "-16%", height: "80%" }}
        />

        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
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
