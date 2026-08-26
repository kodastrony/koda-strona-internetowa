"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { FadeUp } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";
import { PhoneLink } from "@/components/ui/phone-link";
import { EASE } from "@/lib/motion";
import { CONTACT } from "@/lib/constants";
import { SERVICES } from "@/lib/services-data";

/* ════════════════════════════════════════════════════════════════════════════
   /uslugi — REDESIGN 2026-08-26 (życzenie Natana: strona ma PRZEKONYWAĆ
   kupującego, nie opisywać nas).

   Zamiast „01–04 + goła checklista w morzu pustki":
   1. PASEK ZAUFANIA pod hero — 4 sprawdzalne fakty (100/100 Lighthouse tej
      strony, żywe realizacje, umowa, odpowiedź w 24 h). Zero przymiotników.
   2. KARTY-DOWODY usług — każda z nagłówkiem WYNIKOWYM (co klient MA),
      korzyścią, listą „Co dostajesz", linijką „Efekt:" i weryfikowalnym
      dowodem (link do realizacji / pomiaru / umowy). Naprzemienny układ,
      poświata w hue usługi — rytm zamiast czterech identycznych slajdów.
   3. CTA W POŁOWIE strony (pill + telefon) — przekonany kupujący nie musi
      scrollować do stopki.
   Wycena i Proces: bez zmian (cennik robimy osobno).
   ══════════════════════════════════════════════════════════════════════════ */

const PINK = "var(--color-pink-bright)";

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
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
        transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE.out, delay }}
      />
    </svg>
  );
}

/* Pojedynczy sprawdzalny fakt w pasku zaufania. */
function TrustFact({ children }: { children: React.ReactNode }) {
  return (
    <li
      className="flex items-center gap-2.5"
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "0.92rem",
        lineHeight: 1.45,
        color: "var(--color-ink-muted)",
      }}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: "var(--color-accent)" }}
      />
      {children}
    </li>
  );
}

export function UslugiContent() {
  return (
    <>
      {/* ── Pasek zaufania: 4 fakty, każdy do sprawdzenia — zero przymiotników ── */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div className="container-koda">
          <FadeUp inView y={14} duration={0.55}>
            <ul
              role="list"
              className="flex flex-wrap items-center gap-x-9 gap-y-3"
              style={{
                borderTop: "1px solid var(--color-line)",
                borderBottom: "1px solid var(--color-line)",
                paddingTop: "18px",
                paddingBottom: "18px",
              }}
            >
              <TrustFact>
                <span>
                  <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    100/100 w Google Lighthouse
                  </strong>{" "}
                  (SEO i dostępność tej strony)
                </span>
              </TrustFact>
              <TrustFact>
                <Link
                  href="/realizacje"
                  className="underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                  style={{ color: "var(--color-ink)" }}
                >
                  Realizacje działają na żywo — kliknij i sprawdź
                </Link>
              </TrustFact>
              <TrustFact>
                <span>
                  <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    Zakres i termin w umowie
                  </strong>
                </span>
              </TrustFact>
              <TrustFact>
                <span>
                  Bezpłatna wycena,{" "}
                  <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>
                    odpowiedź w 24 h
                  </strong>
                </span>
              </TrustFact>
            </ul>
          </FadeUp>
        </div>
      </section>

      {/* ── Karty-dowody usług ── */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div
          className="container-koda flex flex-col"
          style={{
            gap: "clamp(18px, 2.5vw, 28px)",
            paddingTop: "clamp(36px, 5vw, 64px)",
            paddingBottom: "clamp(60px, 8vw, 110px)",
          }}
        >
          {SERVICES.map((s, i) => (
            <FadeUp inView key={s.id} y={34} duration={0.65}>
              <article
                id={s.id}
                className="relative overflow-hidden scroll-mt-28 rounded-[24px]"
                style={{
                  border: "1px solid var(--color-line)",
                  boxShadow: "var(--shadow-card)",
                  // Powierzchnia karty + delikatna poświata w hue usługi w rogu —
                  // każda karta ma własny nastrój, spójny z systemem hue strony.
                  background: `radial-gradient(640px 340px at ${i % 2 === 0 ? "88% -12%" : "12% -12%"}, oklch(0.62 0.16 ${s.hue} / 0.09), transparent 70%), var(--color-surface-1)`,
                  padding: "clamp(26px, 4vw, 48px)",
                }}
              >
                <div className="grid grid-cols-1 gap-y-8 md:grid-cols-12 md:gap-x-12">
                  {/* Kolumna wyniku: co klient z tego MA */}
                  <div className={i % 2 === 0 ? "md:col-span-6" : "md:order-2 md:col-span-6"}>
                    <span
                      className="inline-flex items-center gap-2 rounded-full font-heading font-bold uppercase"
                      style={{
                        border: "1px solid var(--color-line)",
                        padding: "6px 12px",
                        fontSize: "10.5px",
                        letterSpacing: "0.14em",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: `oklch(0.55 0.19 ${s.hue})` }}
                      />
                      {s.title}
                    </span>
                    <h2
                      className="mt-5 font-heading font-semibold"
                      style={{
                        fontSize: "clamp(1.65rem, 2.9vw, 2.4rem)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1.07,
                        color: "var(--color-ink)",
                        textWrap: "balance",
                      }}
                    >
                      {s.outcome}
                    </h2>
                    <p
                      className="mt-4"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(1rem, 1.2vw, 1.12rem)",
                        lineHeight: 1.62,
                        color: "var(--color-ink-muted)",
                        maxWidth: "50ch",
                      }}
                    >
                      {s.lead}
                    </p>
                    <p
                      className="mt-5 font-body"
                      style={{
                        fontSize: "clamp(1rem, 1.2vw, 1.1rem)",
                        lineHeight: 1.55,
                        fontWeight: 600,
                        color: "var(--color-ink)",
                        maxWidth: "48ch",
                      }}
                    >
                      {s.payoff}
                    </p>
                  </div>

                  {/* Kolumna konkretu: co dokładnie dostajesz */}
                  <div className={i % 2 === 0 ? "md:col-span-6" : "md:order-1 md:col-span-6"}>
                    <h3
                      className="font-heading font-bold"
                      style={{
                        fontSize: "0.85rem",
                        letterSpacing: "0.02em",
                        color: "var(--color-ink)",
                      }}
                    >
                      Co dostajesz
                    </h3>
                    <ul className="mt-4 flex flex-col gap-3.5" role="list">
                      {s.points.map((p, idx) => (
                        <li
                          key={p}
                          className="flex items-start gap-3"
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.98rem",
                            lineHeight: 1.55,
                            color: "var(--color-ink)",
                            maxWidth: "52ch",
                          }}
                        >
                          <AnimatedCheck delay={idx * 0.1} />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                    {s.id === "strony" && (
                      <Link
                        href="/uslugi/strony-3d"
                        className="mt-5 inline-flex font-heading text-[0.92rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                        style={{ color: "var(--color-ink)" }}
                      >
                        Zobacz: strony 3D i animowane →
                      </Link>
                    )}
                  </div>
                </div>

                {/* Dowód — sprawdzalny, nie deklarowany */}
                <div
                  className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2"
                  style={{ borderTop: "1px solid var(--color-line)", paddingTop: "18px" }}
                >
                  <span
                    className="font-heading font-bold uppercase"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: "0.14em",
                      color: "var(--color-ink-faint)",
                    }}
                  >
                    Dowód
                  </span>
                  {s.proof.href ? (
                    s.proof.external ? (
                      <a
                        href={s.proof.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${s.proof.label} (otwiera się w nowej karcie)`}
                        className="font-body text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {s.proof.label} ↗
                      </a>
                    ) : (
                      <Link
                        href={s.proof.href}
                        className="font-body text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {s.proof.label} →
                      </Link>
                    )
                  ) : (
                    <span
                      className="font-body text-[0.95rem]"
                      style={{ color: "var(--color-ink)" }}
                    >
                      {s.proof.label}
                    </span>
                  )}
                </div>
              </article>
            </FadeUp>
          ))}

          {/* ── CTA w połowie strony: przekonany nie scrolluje do stopki ── */}
          <FadeUp inView y={20} delay={0.05}>
            <div
              className="flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:justify-between"
              style={{ padding: "clamp(10px, 1.5vw, 18px) clamp(2px, 0.5vw, 10px)" }}
            >
              <p
                className="font-body"
                style={{
                  fontSize: "clamp(1.02rem, 1.3vw, 1.2rem)",
                  lineHeight: 1.55,
                  color: "var(--color-ink)",
                  maxWidth: "44ch",
                }}
              >
                Wystarczy kilka zdań o Twoim biznesie — wycenę i pomysł odsyłamy w 24 godziny.
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <Magnetic strength={0.35}>
                  <PillLink
                    href="/kontakt"
                    bg="#b32a9d"
                    border="#b32a9d"
                    className="text-white hover:text-white hover:shadow-[0_18px_44px_-12px_rgba(207,67,184,0.55)]"
                  >
                    Bezpłatna wycena
                  </PillLink>
                </Magnetic>
                <PhoneLink
                  className="inline-flex min-h-[44px] items-center font-heading text-[1.02rem] font-bold transition-colors duration-300 hover:text-pink"
                  style={{ color: "var(--color-ink)" }}
                  label={`lub zadzwoń: ${CONTACT.phone}`}
                />
              </div>
            </div>
          </FadeUp>
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
                Na polskim rynku strona dla firmy kosztuje najczęściej od 3 000 do 15 000 zł netto
                — dokładna kwota zależy od zakresu: liczby podstron, treści, integracji i terminu.
                Dlatego nie podajemy cen z sufitu — opisz nam krótko projekt, a wrócimy z konkretną
                kwotą. Bezpłatnie i bez zobowiązań.
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
