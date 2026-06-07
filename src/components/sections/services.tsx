"use client";

import Link from "next/link";
import { FadeUp } from "@/components/motion";

/* ── "Co robimy" — interactive hover-wipe list ───────────────────────────
   NOT a generic icon-card grid (the slop the owner rejected). Big service
   names as full-width rows; on hover a pink gradient WIPES in left→right
   (clip-path, Emil's strong ease-out — the left→right reveal the owner liked),
   the label brightens, and the description + arrow slide in. Rows reveal with a
   stagger on scroll. Bold, alive, interactive. */

const SERVICES = [
  { n: "01", title: "Projektowanie UX/UI", desc: "Interfejsy, które prowadzą użytkownika prosto do kontaktu i zakupu. Każdy ekran ma zadanie." },
  { n: "02", title: "Strony i sklepy",     desc: "Szybkie, nowoczesne strony i sklepy na solidnym kodzie. Pod Twój biznes, nie pod szablon." },
  { n: "03", title: "Optymalizacja i SEO", desc: "Szybkość, widoczność w Google i analityka, żeby strona realnie przyciągała klientów." },
  { n: "04", title: "Wsparcie i rozwój",   desc: "Po wdrożeniu zostajemy: aktualizacje, opieka techniczna i rozwój, gdy Twój biznes rośnie." },
];

function ServiceRow({ n, title, desc, delay }: { n: string; title: string; desc: string; delay: number }) {
  return (
    <FadeUp inView delay={delay} y={22}>
      <Link
        href="/uslugi"
        className="group relative block overflow-hidden"
        style={{ borderTop: "1px solid var(--color-line)" }}
      >
        {/* Pink wipe — fills the row left→right on hover (clip-path + Emil ease-out) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-[620ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:[clip-path:inset(0_0_0_0)]"
          style={{ background: "linear-gradient(100deg, var(--color-accent), var(--color-pink-bright))" }}
        />
        <div className="relative py-[clamp(24px,3.4vw,44px)]">
          <div className="flex items-center gap-[clamp(18px,4vw,56px)]">
            <span className="w-8 shrink-0 font-heading text-sm font-bold text-[var(--color-ink-faint)] transition-colors duration-500 group-hover:text-white/75 md:w-10">
              {n}
            </span>
            <h3
              className="flex-1 font-heading font-semibold text-[var(--color-ink)] transition-colors duration-500 group-hover:text-white"
              style={{ fontSize: "clamp(1.55rem,3.4vw,2.9rem)", letterSpacing: "-0.03em", lineHeight: 1.06 }}
            >
              {title}
            </h3>
            {/* Desktop (lg+): opis wjeżdża na hover (interaktywna lista). */}
            <p className="hidden max-w-[34ch] -translate-x-3 text-[0.98rem] leading-snug text-[var(--color-ink-muted)] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:text-white/90 group-hover:opacity-100 lg:block">
              {desc}
            </p>
            <span
              aria-hidden="true"
              className="shrink-0 -translate-x-1.5 font-heading text-2xl text-[var(--color-ink-faint)] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:text-white"
            >
              →
            </span>
          </div>
          {/* Mobile/tablet (<lg): brak hovera → opis widoczny statycznie pod tytułem,
              wyrównany pod tytuł. Inaczej cała oferta to tylko gołe nazwy usług. */}
          <p className="mt-3 pl-[calc(2rem+clamp(18px,4vw,56px))] text-[0.95rem] leading-snug text-[var(--color-ink-muted)] transition-colors duration-500 group-hover:text-white/90 md:pl-[calc(2.5rem+clamp(18px,4vw,56px))] lg:hidden">
            {desc}
          </p>
        </div>
      </Link>
    </FadeUp>
  );
}

export function Services() {
  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-graphite)" }}
    >
      {/* Smooth fades — graphite melts into the black sections above/below */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40" style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40" style={{ background: "linear-gradient(to top, var(--color-bg), transparent)" }} />
      {/* Section mood — soft violet atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: "radial-gradient(ellipse 55% 50% at 88% 2%, rgba(154,99,239,0.10) 0%, transparent 58%)" }} />

      <div className="container-koda section-y relative z-10">
        {/* ── Header ── */}
        <div className="mb-[clamp(28px,3.5vw,52px)] flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeUp inView>
              <span className="label-koda mb-5 block">Usługi</span>
            </FadeUp>
            <FadeUp inView delay={0.06}>
              <h2 className="text-section-title">Co robimy</h2>
            </FadeUp>
          </div>
          <FadeUp inView delay={0.14} className="md:max-w-[330px] md:pb-2 md:text-right">
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.95rem,1.05vw,1.05rem)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
              Od pierwszego pomysłu po działającą stronę, która zarabia. Wszystko w jednym miejscu.
            </p>
          </FadeUp>
        </div>

        {/* ── Interactive list ── */}
        <div style={{ borderBottom: "1px solid var(--color-line)" }}>
          {SERVICES.map((s, i) => (
            <ServiceRow key={s.n} n={s.n} title={s.title} desc={s.desc} delay={0.05 * i} />
          ))}
        </div>
      </div>
    </section>
  );
}
