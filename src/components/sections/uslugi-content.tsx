"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp, Parallax } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";
import { PhoneLink } from "@/components/ui/phone-link";
import { VideoShowcase } from "@/components/ui/video-showcase";
import { CONTACT } from "@/lib/constants";
import { SERVICES, type Service } from "@/lib/services-data";

/* ════════════════════════════════════════════════════════════════════════════
   /uslugi v3 — „USŁUGI POKAZANE PRACĄ" (2026-08-26, po dwóch korektach Natana).

   Diagnozy poprzednich podejść: v1 = białe karty + ściany tekstu (slop);
   v2 = hasła-giganty w akordeonie (nie wiadomo, co jest czym; treść schowana).

   v3: cztery sekcje wprost na kanwie (zero pudełek), każda NAZWANA po ludzku
   (H2 = nazwa usługi → nawigowalność), z całą ofertą WIDOCZNĄ bez klikania
   (linia wyniku + chipy 2–4 słowa + dowód), a „wow" robi PRAWDZIWA praca:
   • Projektowanie → pływający stos zrzutów realnych projektów (parallax,
     hover prostuje) · • Strony 2D/3D → żywe wideo animacji (VideoShowcase)
   • SEO → odliczające się REALNE wyniki tej strony (100/100, CLS 0,00)
   • Opieka → realizacja + pulsujący badge „Odpowiadamy w 24 h".
   Naprzemienne strony, hue-poświata per usługa. Wycena/Proces bez zmian.
   ══════════════════════════════════════════════════════════════════════════ */

/* „Pełny" tick: rysujący się ptaszek w wypełnionym różowym kółku (wzór Natana
   2026-08-26). Kaskada zapala się po wejściu w widok. */
function CheckBadge({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span
      aria-hidden="true"
      className="mt-[1px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: "rgba(207, 67, 184, 0.11)" }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <motion.path
          d="M3 8.5L6.5 12L13 4.5"
          stroke="var(--color-accent)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE.out, delay }}
        />
      </svg>
    </span>
  );
}

/* Renderer pogrubień w tickach: „**fraza**" → <strong> (dane w services-data). */
function Emph({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold" style={{ color: "var(--color-ink)" }}>
            {p}
          </strong>
        ) : (
          p
        )
      )}
    </>
  );
}

/* Odliczanie do wartości przy wejściu w widok (SEO-wyniki). rAF + ease-out,
   reduced-motion → od razu wartość końcowa. */
function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return; // reduce: render niżej pokazuje od razu wartość końcową
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4); // quart-out
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  const shown = reduce ? to : val;
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown.toFixed(decimals).replace(".", ",")}
    </span>
  );
}

/* ── Wizual 1: pływający stos zrzutów realnych projektów (Projektowanie) ── */
function FloatStack() {
  const shot: React.CSSProperties = {
    border: "1px solid var(--color-line)",
    borderRadius: 14,
    boxShadow: "var(--shadow-card-hover)",
    display: "block",
  };
  return (
    <div className="group relative" style={{ aspectRatio: "4 / 3.1" }} aria-hidden="false">
      <Parallax speed={-20} className="absolute" style={{ inset: "0 18% 22% 0" }}>
        <img
          src="/realizacje/jr-g1.webp"
          alt="Projekt strony JR Modular Systems — sekcja konfiguratora 3D"
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:-rotate-1"
          style={{ ...shot, transform: "rotate(-2.2deg)" }}
        />
      </Parallax>
      <Parallax speed={26} className="absolute" style={{ inset: "26% 0 0 24%" }}>
        <img
          src="/realizacje/drblocks-g2.webp"
          alt="Projekt strony DrBlocks — kalkulator doboru bloczków"
          width={1200}
          height={800}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:rotate-1"
          style={{ ...shot, transform: "rotate(2.4deg)" }}
        />
      </Parallax>
    </div>
  );
}

/* ── Wizual 3: realne, mierzalne wyniki TEJ strony (SEO) ── */
function ScoreStrip() {
  const scores: { n: number; decimals: number; label: string }[] = [
    { n: 100, decimals: 0, label: "Lighthouse SEO" },
    { n: 100, decimals: 0, label: "Dostępność" },
    { n: 0, decimals: 2, label: "CLS (stabilność)" },
  ];
  return (
    <div>
      <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
        {scores.map((s) => (
          <div key={s.label}>
            <div
              className="font-heading font-extrabold"
              style={{
                fontSize: "clamp(3.4rem, 6.5vw, 5.5rem)",
                lineHeight: 0.95,
                letterSpacing: "-0.04em",
                color: "var(--color-accent)",
              }}
            >
              <CountUp to={s.n} decimals={s.decimals} />
            </div>
            <div
              className="mt-2 font-heading font-bold uppercase"
              style={{
                fontSize: "11px",
                letterSpacing: "0.14em",
                color: "var(--color-ink-muted)",
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>
      <p
        className="mt-5 font-body"
        style={{ fontSize: "0.9rem", color: "var(--color-ink-faint)" }}
      >
        Zmierzone na tej stronie — Google Lighthouse, sierpień 2026.
      </p>
    </div>
  );
}

/* ── Wizual 4: opieka — realizacja + żywy badge 24 h ── */
function CareVisual() {
  return (
    <div className="relative">
      <Parallax speed={18}>
        <img
          src="/realizacje/grabowski-showcase.webp"
          srcSet="/realizacje/grabowski-showcase-640.webp 640w, /realizacje/grabowski-showcase.webp 1680w"
          sizes="(max-width: 767px) 92vw, 44vw"
          alt="Strona pracowni Grabowski — jedna z realizacji pod stałą opieką KODA"
          width={1680}
          height={1050}
          loading="lazy"
          decoding="async"
          className="block h-auto w-full"
          style={{
            border: "1px solid var(--color-line)",
            borderRadius: 16,
            boxShadow: "var(--shadow-card-hover)",
          }}
        />
      </Parallax>
      {/* Badge jak „Nagranie na żywo" z VideoShowcase — spójny wzorzec */}
      <span
        className="absolute top-0 left-0 z-[2] m-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-heading text-[10px] font-bold tracking-[0.16em] uppercase"
        style={{ background: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(6px)" }}
      >
        <span className="koda-pulse inline-block h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
        Pod stałą opieką
      </span>
    </div>
  );
}

/* ── Sekcja usługi: tekst (nazwa → wynik → chipy → dowód) + wizual ── */
function ServiceSection({ s, index }: { s: Service; index: number }) {
  const reversed = index % 2 === 1;
  const visual =
    s.id === "projektowanie" ? (
      <FloatStack />
    ) : s.id === "strony" ? (
      <VideoShowcase
        src="/realizacje/rikoszet.mp4"
        poster="/realizacje/rikoszet-poster.webp"
        rgb="207,67,184"
        label="RIKOSZET — nagranie animacji strony 3D zbudowanej przez KODA"
      />
    ) : s.id === "optymalizacja" ? (
      <ScoreStrip />
    ) : (
      <CareVisual />
    );

  return (
    <section
      id={s.id}
      data-header-theme="dark"
      data-canvas="base"
      className="relative scroll-mt-24"
    >
      {/* Poświata sekcji w hue usługi — po stronie wizualu, wtapia się w kanwę */}
      <GlowField
        hue={s.hue}
        x={reversed ? 12 : 88}
        y={40}
        strength={0.55}
        drift
        driftDuration={29 + index * 3}
        edgeFade="vertical"
        className="inset-x-0 z-0"
        style={{ top: "-8%", height: "90%" }}
      />

      <div
        className="container-koda relative z-10 grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-14"
        style={{
          borderTop: "1px solid var(--color-line)",
          paddingTop: "clamp(52px, 6.5vw, 104px)",
          paddingBottom: "clamp(52px, 6.5vw, 104px)",
        }}
      >
        {/* Tekst — TYLKO numer, nazwa i 6 ticków (doszlif Natana: bez dodatkowych
            linii i przekierowań; konkret niosą ticki). */}
        <div className={reversed ? "md:order-2 md:col-span-5" : "md:col-span-5"}>
          <FadeUp inView>
            <span
              className="font-heading font-bold"
              style={{ fontSize: "0.95rem", letterSpacing: "0.02em", color: "var(--color-accent)" }}
            >
              {s.n}
            </span>
          </FadeUp>
          <FadeUp inView delay={0.05}>
            <h2
              className="mt-2 font-heading font-semibold"
              style={{
                fontSize: "clamp(1.9rem, 3.4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--color-ink)",
                textWrap: "balance",
              }}
            >
              {s.title}
            </h2>
          </FadeUp>
          <FadeUp inView delay={0.12}>
            <ul className="mt-8 flex flex-col gap-[18px]" role="list">
              {s.points.map((p, idx) => (
                <li
                  key={p}
                  className="flex items-start gap-3.5 font-body"
                  style={{ fontSize: "1.02rem", lineHeight: 1.5, color: "var(--color-ink-muted)" }}
                >
                  <CheckBadge delay={idx * 0.08} />
                  <span className="pt-[2px]">
                    <Emph text={p} />
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>

        {/* Wizual — prawdziwa praca zamiast opisu */}
        <div className={reversed ? "md:order-1 md:col-span-7" : "md:col-span-7"}>
          <FadeUp inView delay={0.1} y={36} duration={0.7}>
            {visual}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function UslugiContent() {
  return (
    <>
      {SERVICES.map((s, i) => (
        <ServiceSection key={s.id} s={s} index={i} />
      ))}

      {/* Jedna cicha linia akcji pod usługami */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div
          className="container-koda flex flex-wrap items-center gap-x-7 gap-y-4"
          style={{ paddingBottom: "clamp(56px, 7vw, 100px)" }}
        >
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
