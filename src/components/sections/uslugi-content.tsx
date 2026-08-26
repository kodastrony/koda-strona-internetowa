"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FadeUp } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";
import { PhoneLink } from "@/components/ui/phone-link";
import { EASE } from "@/lib/motion";
import { CONTACT } from "@/lib/constants";
import { SERVICES, type Service } from "@/lib/services-data";

/* ════════════════════════════════════════════════════════════════════════════
   /uslugi — „WIELKI INDEKS" (redesign 2026-08-26, po korekcie Natana).

   Zasada: ZERO kontenerów-kart i ścian tekstu. Usługi to cztery GIGANTYCZNE
   typograficzne wiersze leżące wprost na kanwie (DNA menu-overlay), dzielone
   hairline'ami. Interakcja:
   • hover / otwarcie → gigant ZALEWA SIĘ różem clip-wipe'em (globals: .svc-wipe,
     technika „tabs" — duplikat przycięty inset) + na kanwie rozkwita poświata
     w hue usługi;
   • klik → akordeon (mechanika 1:1 z FAQ: height auto/0, jeden otwarty,
     „+" → „×") odsłania JEDNĄ linijkę, chipy 2–4 słowa i link-dowód;
   • deep-link /uslugi#strony (home, stopka) otwiera właściwy wiersz.
   Budżet copy wiersza: gigant + ≤12 słów + chipy. Wycena/Proces bez zmian.
   ══════════════════════════════════════════════════════════════════════════ */

const GIANT: React.CSSProperties = {
  fontSize: "clamp(2.1rem, 5.4vw, 4.6rem)",
  lineHeight: 1.02,
  letterSpacing: "-0.035em",
};

function ServiceRow({
  s,
  open,
  onToggle,
}: {
  s: Service;
  open: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const btnId = `${uid}-btn`;
  const panelId = `${uid}-panel`;

  return (
    <div id={s.id} data-open={open} className="svc-row group relative scroll-mt-28">
      {/* Poświata usługi — rozkwita na hover/otwarciu (radial bez blura = tanio). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          inset: "-12% -6%",
          background: `radial-gradient(52% 78% at 22% 55%, oklch(0.62 0.17 ${s.hue} / 0.13) 0%, oklch(0.62 0.17 ${s.hue} / 0) 70%)`,
          ...(open ? { opacity: 1 } : {}),
        }}
      />

      <h2 className="relative m-0">
        <button
          id={btnId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="grid w-full grid-cols-[1fr_auto] items-center gap-5 text-left outline-offset-4 transition-transform duration-150 active:scale-[0.995]"
          style={{
            paddingTop: "clamp(26px, 4vw, 46px)",
            paddingBottom: "clamp(24px, 3.6vw, 40px)",
          }}
        >
          <span className="block">
            {/* Znacznik usługi — mikro (nazwa z oferty; spójna z JSON-LD i home) */}
            <span
              className="mb-3 flex items-center gap-2 font-heading font-bold uppercase"
              style={{
                fontSize: "10.5px",
                letterSpacing: "0.16em",
                color: "var(--color-ink-faint)",
              }}
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full transition-transform duration-300 group-hover:scale-150"
                style={{ backgroundColor: `oklch(0.55 0.19 ${s.hue})` }}
              />
              {s.title}
            </span>

            {/* GIGANT + różowy clip-wipe (duplikat aria-hidden, .svc-wipe w globals) */}
            <span className="relative inline-block" style={{ textWrap: "balance" }}>
              <span
                className="font-heading font-extrabold"
                style={{ ...GIANT, color: "var(--color-ink)" }}
              >
                {s.outcome}
              </span>
              <span
                aria-hidden="true"
                className="svc-wipe absolute inset-0 font-heading font-extrabold"
                style={{ ...GIANT, color: "var(--color-accent)" }}
              >
                {s.outcome}
              </span>
            </span>
          </span>

          {/* „+" → „×" (DNA FAQ) */}
          <motion.span
            aria-hidden="true"
            className="shrink-0 font-heading leading-none"
            style={{
              fontSize: "clamp(1.9rem, 2.8vw, 2.6rem)",
              fontWeight: 300,
              color: "var(--color-accent)",
            }}
            animate={{ rotate: open ? 45 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE.out }}
          >
            +
          </motion.span>
        </button>
      </h2>

      {/* Panel — mechanika FAQ (height auto/0, przerywalna) */}
      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.42, ease: EASE.out }}
        style={{ overflow: "hidden" }}
      >
        <div style={{ paddingBottom: "clamp(30px, 4vw, 50px)", maxWidth: "72ch" }}>
          <p
            className="font-body"
            style={{
              fontSize: "clamp(1.05rem, 1.35vw, 1.25rem)",
              lineHeight: 1.55,
              color: "var(--color-ink-muted)",
              maxWidth: "46ch",
            }}
          >
            {s.tagline}
          </p>

          {/* Chipy 2–4 słowa — stagger przy otwarciu */}
          <ul className="mt-5 flex flex-wrap gap-2.5" role="list">
            {s.points.map((p, idx) => (
              <motion.li
                key={p}
                initial={false}
                animate={open ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 8 }}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.3, ease: EASE.out, delay: open ? 0.08 + idx * 0.05 : 0 }
                }
                className="flex items-center gap-2 rounded-full font-body"
                style={{
                  border: "1px solid var(--color-line-strong)",
                  padding: "9px 15px",
                  fontSize: "0.92rem",
                  color: "var(--color-ink)",
                }}
              >
                <span
                  aria-hidden="true"
                  className="h-1 w-1 rounded-full"
                  style={{ backgroundColor: `oklch(0.55 0.19 ${s.hue})` }}
                />
                {p}
              </motion.li>
            ))}
          </ul>

          {/* Dowód + ewentualne pogłębienie */}
          <div className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-2">
            {s.proof.href ? (
              s.proof.external ? (
                <a
                  href={s.proof.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${s.proof.label} (otwiera się w nowej karcie)`}
                  className="font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                  style={{ color: "var(--color-ink)" }}
                >
                  {s.proof.label} ↗
                </a>
              ) : (
                <Link
                  href={s.proof.href}
                  className="font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                  style={{ color: "var(--color-ink)" }}
                >
                  {s.proof.label} →
                </Link>
              )
            ) : (
              <span
                className="font-heading text-[0.95rem] font-semibold"
                style={{ color: "var(--color-ink-muted)" }}
              >
                {s.proof.label}
              </span>
            )}
            {s.id === "strony" && (
              <Link
                href="/uslugi/strony-3d"
                className="font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                style={{ color: "var(--color-ink)" }}
              >
                Strony 3D i animowane →
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      <div aria-hidden="true" style={{ borderBottom: "1px solid var(--color-line)" }} />
    </div>
  );
}

export function UslugiContent() {
  // Jeden otwarty wiersz (DNA FAQ); pierwszy otwarty domyślnie — sekcja czyta
  // się jako treść, nie rząd zamkniętych przycisków.
  const [openIndex, setOpenIndex] = useState(0);

  // Deep-link: /uslugi#strony (home, stopka) otwiera właściwy wiersz.
  useEffect(() => {
    const openFromHash = () => {
      const idx = SERVICES.findIndex((s) => s.id === window.location.hash.slice(1));
      if (idx >= 0) setOpenIndex(idx);
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <>
      {/* ── WIELKI INDEKS usług — typografia wprost na kanwie ── */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div className="container-koda" style={{ paddingBottom: "clamp(56px, 7vw, 100px)" }}>
          <FadeUp inView y={20} duration={0.6}>
            <div style={{ borderTop: "1px solid var(--color-line)" }}>
              {SERVICES.map((s, i) => (
                <ServiceRow
                  key={s.id}
                  s={s}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
                />
              ))}
            </div>
          </FadeUp>

          {/* Jedna cicha linia akcji pod indeksem */}
          <FadeUp inView y={16} delay={0.05}>
            <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4">
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
