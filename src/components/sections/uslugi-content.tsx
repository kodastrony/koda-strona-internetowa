"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FadeUp } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { ProcessSteps } from "@/components/sections/process-steps";
import { EASE } from "@/lib/motion";
import { useThemeValue } from "@/lib/theme";
import { SERVICES } from "@/lib/services-data";

const PINK = "var(--color-pink-bright)";

/* Duża cyfra 01–04: stonowana, a gdy wjedzie na środek ekranu (czyli gdy
   odwiedzający ją czyta) — płynnie ZAPALA SIĘ na różowo. Theme-aware: w ciemnym
   biel→żywy róż, w jasnym atrament→głębszy róż (AA na porcelanie; biel→jasny
   róż byłby niewidoczny). Reduced-motion → od razu w kolorze docelowym. */
function StepNumber({ n }: { n: string }) {
  const reduce = useReducedMotion();
  const light = useThemeValue() === "light";
  const from = light ? "#cdbfd6" : "#f5f5f7";
  const to = light ? "#b32a9d" : "#ff5ec8";
  return (
    <motion.div
      aria-hidden="true"
      className="mb-4 font-heading font-bold"
      style={{ fontSize: "clamp(2.6rem,4.4vw,4rem)", lineHeight: 1, letterSpacing: "-0.04em" }}
      initial={reduce ? false : { color: from }}
      whileInView={{ color: to }}
      viewport={{ once: true, margin: "-35% 0px -35% 0px" }}
      transition={reduce ? { duration: 0 } : { duration: 0.55, ease: EASE.out }}
    >
      {n}
    </motion.div>
  );
}

/* Ptaszek, który RYSUJE SIĘ (pathLength) po wjeździe w widok — z opóźnieniem,
   więc w obrębie usługi zapalają się po kolei („beng, beng"). Różowy. */
function AnimatedCheck({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0"
    >
      <motion.path
        d="M3 8.5L6.5 12L13 4.5"
        stroke={PINK}
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE.out, delay }}
      />
    </svg>
  );
}

export function UslugiContent() {
  return (
    <>
      {/* ── Detailed services ── */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div className="container-koda" style={{ paddingBottom: "clamp(60px, 8vw, 120px)" }}>
          {SERVICES.map((s) => (
            <article
              key={s.id}
              id={s.id}
              className="grid scroll-mt-28 grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-12"
              style={{
                borderTop: "1px solid var(--color-line)",
                paddingTop: "clamp(48px,6vw,96px)",
                paddingBottom: "clamp(48px,6vw,96px)",
              }}
            >
              <div className="md:col-span-5">
                <FadeUp inView>
                  <StepNumber n={s.n} />
                </FadeUp>
                <FadeUp inView delay={0.06}>
                  <h2
                    className="font-heading font-semibold"
                    style={{
                      fontSize: "clamp(1.7rem,3vw,2.6rem)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1.08,
                      color: "var(--color-ink)",
                    }}
                  >
                    {s.title}
                  </h2>
                </FadeUp>
              </div>

              <div className="md:col-span-7">
                <FadeUp inView delay={0.1}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                      lineHeight: 1.6,
                      color: "var(--color-ink-muted)",
                      maxWidth: "52ch",
                    }}
                  >
                    {s.lead}
                  </p>
                </FadeUp>
                <FadeUp inView delay={0.16}>
                  <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2" role="list">
                    {s.points.map((p, idx) => (
                      <li
                        key={p}
                        className="flex items-start gap-3"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.97rem",
                          lineHeight: 1.5,
                          color: "var(--color-ink)",
                        }}
                      >
                        <AnimatedCheck delay={idx * 0.12} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </FadeUp>
                {s.id === "strony" && (
                  <FadeUp inView delay={0.22}>
                    <Link
                      href="/uslugi/strony-3d"
                      className="mt-7 inline-flex font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                      style={{ color: "var(--color-ink)" }}
                    >
                      Zobacz: strony 3D i animowane →
                    </Link>
                  </FadeUp>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Wycena — uczciwa rama ceny bez cennika ── */}
      <section data-header-theme="dark" className="relative">
        <div
          className="container-koda grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-12"
          style={{
            borderTop: "1px solid var(--color-line)",
            paddingTop: "clamp(48px,6vw,96px)",
            paddingBottom: "clamp(60px,8vw,120px)",
          }}
        >
          <div className="md:col-span-5">
            <FadeUp inView>
              <span className="label-koda mb-5 block">Wycena</span>
            </FadeUp>
            <FadeUp inView delay={0.06}>
              <h2
                className="font-heading font-semibold"
                style={{
                  fontSize: "clamp(1.7rem,3vw,2.6rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  color: "var(--color-ink)",
                }}
              >
                Ile kosztuje strona?
              </h2>
            </FadeUp>
          </div>
          <div className="md:col-span-7">
            <FadeUp inView delay={0.1}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                  maxWidth: "56ch",
                }}
              >
                To zależy od zakresu: liczby podstron, treści, integracji i terminu. Dlatego nie
                podajemy cen z sufitu — opisz nam krótko projekt, a wrócimy z konkretną kwotą.
                Bezpłatnie i bez zobowiązań.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.16}>
              <p
                className="mt-5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink)",
                  maxWidth: "56ch",
                }}
              >
                Kreator i gotowy szablon są tanie na start, ale wyglądają jak tysiąc innych stron i
                trudno je rozwijać. U nas dostajesz coś innego: kod pisany pod Twój konkretny
                biznes, bezpośredni kontakt z osobami, które go tworzą, i zakres ustalony w umowie.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.22}>
              <Link
                href="/cennik"
                className="mt-6 inline-flex font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                style={{ color: "var(--color-ink)" }}
              >
                Zobacz pełny cennik i co wpływa na cenę →
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Process — "Jak pracujemy" ── */}
      <section data-header-theme="dark" data-canvas="process" className="relative">
        {/* Tło = PageCanvas (indygowy hold „process", jak na home). Indygowe
            światło wystaje ponad sekcję — świeci przez szew w górę. */}
        <GlowField
          hue={273}
          x={10}
          y={26}
          strength={0.6}
          drift
          driftDuration={31}
          edgeFade="vertical"
          className="inset-x-0 z-0"
          style={{ top: "-18%", height: "80%" }}
        />

        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-5 block">Proces</span>
          </FadeUp>
          <FadeUp inView delay={0.06}>
            <h2 className="text-section-title max-w-[16ch]">Jak pracujemy</h2>
          </FadeUp>

          <ProcessSteps />
        </div>
      </section>
    </>
  );
}
