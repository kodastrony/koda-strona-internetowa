"use client";

import Link from "next/link";
import { FadeUp, Reveal, Parallax } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { SERVICES } from "@/lib/services-data";

/* ── "Co robimy" — interactive hover-wipe list ───────────────────────────
   NOT a generic icon-card grid (the slop the owner rejected). Big service
   names as full-width rows; on hover a pink gradient WIPES in left→right
   (clip-path, Emil's strong ease-out — the left→right reveal the owner liked),
   the label brightens, and the description + arrow slide in. Rows reveal with a
   stagger on scroll. Bold, alive, interactive. Data = @/lib/services-data
   (shared with the /uslugi page). The row links to that service's section. */

function ServiceRow({
  n,
  title,
  desc,
  href,
  delay,
}: {
  n: string;
  title: string;
  desc: string;
  href: string;
  delay: number;
}) {
  return (
    <FadeUp inView delay={delay} y={22}>
      <Link
        href={href}
        className="group relative block overflow-hidden"
        style={{ borderTop: "1px solid var(--color-line)" }}
      >
        {/* Pink wipe — fills the row left→right on hover (clip-path + Emil ease-out) */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 transition-[clip-path] duration-[620ms] ease-[cubic-bezier(0.23,1,0.32,1)] [clip-path:inset(0_100%_0_0)] group-hover:[clip-path:inset(0_0_0_0)]"
          style={{
            background: "linear-gradient(100deg, var(--color-accent), var(--color-pink-bright))",
          }}
        />
        <div className="relative py-[clamp(24px,3.4vw,44px)]">
          <div className="flex items-center gap-[clamp(18px,4vw,56px)]">
            <span className="w-8 shrink-0 font-heading text-sm font-bold text-[var(--color-ink-faint)] transition-colors duration-500 group-hover:text-white/75 md:w-10">
              {n}
            </span>
            <h3
              className="flex-1 font-heading font-semibold text-[var(--color-ink)] transition-colors duration-500 group-hover:text-white"
              style={{
                fontSize: "clamp(1.55rem,3.4vw,2.9rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.06,
              }}
            >
              {title}
            </h3>
            {/* Desktop (lg+): opis wjeżdża na hover (interaktywna lista). */}
            <p className="hidden max-w-[34ch] -translate-x-3 text-[0.98rem] leading-snug text-[var(--color-ink-muted)] opacity-0 transition-[transform,opacity,color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:text-white/90 group-hover:opacity-100 lg:block">
              {desc}
            </p>
            <span
              aria-hidden="true"
              className="shrink-0 -translate-x-1.5 font-heading text-2xl text-[var(--color-ink-faint)] transition-[transform,color] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0 group-hover:text-white"
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
    <section data-header-theme="dark" data-canvas="services" className="relative">
      {/* Tło sekcji = PageCanvas (hold „services" #15121b) — zero własnego bg,
          zero mostków. Atmosfera: fioletowe pole światła, które WYSTAJE ponad
          górę sekcji (top -22%) i świeci przez szew w głąb hero — światło
          zapowiada sekcję, zanim ta nadjedzie. Brak overflow-hidden (poziomy
          nadmiar tnie globalny body overflow-x: clip). */}
      <Parallax
        speed={65}
        className="pointer-events-none absolute inset-x-0 z-0"
        style={{ top: "-22%", height: "88%" }}
      >
        <GlowField hue={300} x={85} y={28} strength={0.9} drift driftDuration={33} className="inset-0" />
      </Parallax>

      <div className="container-koda section-y relative z-10">
        {/* ── Header ── */}
        <div className="mb-[clamp(28px,3.5vw,52px)] flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeUp inView>
              <span className="label-koda mb-5 block">Usługi</span>
            </FadeUp>
            <Reveal inView delay={0.06}>
              <h2 className="text-section-title">Co robimy</h2>
            </Reveal>
          </div>
          <FadeUp inView delay={0.14} className="md:max-w-[330px] md:pb-2 md:text-right">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(0.95rem,1.05vw,1.05rem)",
                color: "var(--color-ink-muted)",
                lineHeight: 1.6,
              }}
            >
              Bez podwykonawców. Piszesz do nas — odpowiadamy my, nie żaden account manager.
            </p>
          </FadeUp>
        </div>

        {/* ── Interactive list ── */}
        <div style={{ borderBottom: "1px solid var(--color-line)" }}>
          {SERVICES.map((s, i) => (
            <ServiceRow
              key={s.n}
              n={s.n}
              title={s.title}
              desc={s.short}
              href={`/uslugi#${s.id}`}
              delay={0.05 * i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
