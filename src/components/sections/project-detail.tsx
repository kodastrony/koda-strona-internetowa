/* eslint-disable @next/next/no-img-element -- Static export (next.config images.unoptimized):
   next/image can't generate a srcset here, so we ship hand-optimized webp with a manual
   srcset/sizes + explicit width/height + fetchpriority. next/image adds no value in this build. */
"use client";

import Link from "next/link";
import { FadeUp, Reveal } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { GlowField } from "@/components/fx/glow-field";
import { EASE } from "@/lib/motion";
import { MockWebsite } from "@/components/ui/project-card";
import { BrowserFrame, PhoneFrame } from "@/components/ui/device-frames";
import { VideoShowcase } from "@/components/ui/video-showcase";
import type { Project } from "@/lib/projects";

function CheckIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="mt-1 shrink-0"
    >
      <path
        d="M3 8.5L6.5 12L13 4.5"
        stroke="var(--color-accent)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Outbound "visit the live demo" button — opens the working site in a new tab. */
function LiveLink({ project, big = false }: { project: Project; big?: boolean }) {
  return (
    <a
      href={project.liveUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Zobacz ${project.title} na żywo (otwiera się w nowej karcie)`}
      className="group inline-flex items-center gap-3 rounded-full font-heading font-bold tracking-[0.14em] text-white uppercase transition-[transform,box-shadow,filter] duration-300 hover:-translate-y-0.5 active:scale-[0.98]"
      style={{
        fontSize: big ? "13px" : "11px",
        padding: big ? "16px 30px" : "13px 24px",
        background: `rgb(${project.rgb})`,
        color: "#0b0b0d",
        boxShadow: `0 16px 40px -14px rgba(${project.rgb},0.6)`,
      }}
    >
      Zobacz na żywo
      <svg
        width={big ? 18 : 16}
        height={big ? 18 : 16}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      >
        <path
          d="M7 17 17 7M9 7h8v8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}

export function ProjectDetail({
  project,
  prev,
  next,
}: {
  project: Project;
  prev: Project;
  next: Project;
}) {
  void prev;
  return (
    <article>
      {/* ═══ Hero — name, tagline, metadata, live link, honesty line ═══ */}
      <section
        data-header-theme="dark"
        data-canvas="hero"
        className="relative"
        style={{ paddingTop: "clamp(124px, 15vw, 200px)", paddingBottom: "clamp(24px, 4vw, 48px)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background: `radial-gradient(ellipse 55% 60% at 88% 0%, rgba(${project.rgb},0.16) 0%, transparent 60%)`,
          }}
        />

        <div className="container-koda relative z-10">
          <FadeUp x={-20} y={0} duration={0.5} ease={EASE.out}>
            <Link
              href="/realizacje"
              className="inline-flex items-center gap-2 font-heading text-[12px] font-bold tracking-[0.16em] text-[var(--color-ink-muted)] uppercase transition-colors duration-300 hover:text-pink"
            >
              ← Realizacje
            </Link>
          </FadeUp>

          <FadeUp y={0} x={-10} duration={0.6} ease={EASE.out} delay={0.08} className="mt-7">
            <span
              className="font-heading text-[12px] font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-accent)" }}
            >
              {project.concept ? "Projekt koncepcyjny" : `${project.client} · ${project.year}`}
            </span>
          </FadeUp>

          <Reveal className="mt-4" duration={0.85} ease={EASE.out} delay={0.12}>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "clamp(2.6rem, 7vw, 5.5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                color: "var(--color-ink)",
              }}
            >
              {project.title}
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
          </Reveal>

          <FadeUp y={18} duration={0.6} ease={EASE.out} delay={0.18} className="mt-3">
            <p
              className="font-heading"
              style={{
                fontSize: "clamp(1.05rem,1.8vw,1.5rem)",
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "var(--color-ink-muted)",
              }}
            >
              {project.tagline}
            </p>
          </FadeUp>

          <FadeUp y={22} duration={0.6} ease={EASE.expo} delay={0.24} className="mt-7">
            <p className="text-lead">{project.intro}</p>
          </FadeUp>

          {/* Metadata row */}
          <FadeUp inView delay={0.06} className="mt-9">
            <div
              className="grid grid-cols-2 gap-x-6 gap-y-5 border-t pt-7 sm:grid-cols-4"
              style={{ borderColor: "var(--color-line)" }}
            >
              {[
                { k: "Branża", v: project.client },
                { k: "Typ projektu", v: project.type },
                { k: "Technologia", v: project.tech.slice(0, 2).join(" · ") },
                { k: "Rok", v: project.year },
              ].map((f) => (
                <div key={f.k}>
                  <p
                    className="font-heading text-[10px] font-bold tracking-[0.2em] uppercase"
                    style={{ color: "var(--color-ink-faint)" }}
                  >
                    {f.k}
                  </p>
                  <p
                    className="mt-1.5 font-heading font-semibold"
                    style={{
                      fontSize: "clamp(0.95rem,1.3vw,1.1rem)",
                      color: "var(--color-ink)",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {f.v}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Live link + honesty line */}
          <FadeUp
            inView
            delay={0.12}
            y={16}
            className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center"
          >
            <Magnetic strength={0.35}>
              <LiveLink project={project} />
            </Magnetic>
            {project.concept && (
              <p
                className="max-w-[44ch] text-[14px]"
                style={{ color: "var(--color-ink-muted)", lineHeight: 1.5 }}
              >
                <span style={{ color: "var(--color-accent)", fontWeight: 600 }}>
                  Fikcyjna marka, prawdziwy projekt i kod
                </span>{" "}
                — zbudowany w całości przez KODA jako pokaz tego, jak pracujemy.
              </p>
            )}
          </FadeUp>
        </div>
      </section>

      {/* ═══ Showcase — full-bleed signature visual ═══ */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div
          className="container-koda"
          style={{ paddingTop: "clamp(20px,3vw,40px)", paddingBottom: "clamp(40px,5vw,72px)" }}
        >
          <FadeUp inView y={40} duration={0.8} ease={EASE.expo}>
            <div
              className="relative overflow-hidden rounded-[24px]"
              style={{
                border: "1px solid rgba(255,255,255,0.09)",
                boxShadow: `0 50px 110px -40px rgba(0,0,0,0.7), 0 0 120px -40px rgba(${project.rgb},0.35)`,
              }}
            >
              <div className="relative" style={{ paddingBottom: "62.5%" }}>
                <div className="absolute inset-0" style={{ background: project.bg }} />
                {project.showcase ? (
                  <img
                    src={project.showcase}
                    alt={`${project.title} — strona główna`}
                    width={1680}
                    height={1050}
                    loading="eager"
                    decoding="async"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                ) : (
                  <MockWebsite accent={project.glow} />
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ Challenge — the business problem ═══ */}
      <section data-header-theme="dark" data-canvas="tint" className="relative">
        <GlowField
          hue={300}
          x={12}
          y={30}
          strength={0.45}
          drift
          driftDuration={31}
          className="inset-x-0 z-0"
          style={{ top: "-10%", height: "70%" }}
        />
        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-7 block">Wyzwanie</span>
          </FadeUp>
          <div className="grid grid-cols-1 gap-x-12 gap-y-6 md:grid-cols-[1.1fr_0.9fr]">
            <Reveal duration={0.85} ease={EASE.out}>
              <h2
                className="font-heading font-semibold"
                style={{
                  fontSize: "clamp(1.7rem,3.4vw,2.9rem)",
                  lineHeight: 1.1,
                  letterSpacing: "-0.025em",
                  color: "var(--color-ink)",
                  textWrap: "balance",
                }}
              >
                {project.challengeTitle}
              </h2>
            </Reveal>
            <FadeUp inView delay={0.1} y={20}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem,1.3vw,1.15rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                }}
              >
                {project.challenge}
              </p>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══ Video — the signature animation, in motion ═══ */}
      {project.video && (
        <section data-header-theme="dark" data-canvas="base" className="relative">
          <div
            className="container-koda"
            style={{ paddingTop: "clamp(8px,2vw,24px)", paddingBottom: "clamp(40px,5vw,80px)" }}
          >
            <FadeUp
              inView
              className="mb-[clamp(20px,2.6vw,34px)] flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
            >
              <div>
                <span className="label-koda mb-3 block">W ruchu</span>
                <h2
                  className="font-heading font-semibold"
                  style={{
                    fontSize: "clamp(1.6rem,3vw,2.6rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.025em",
                    color: "var(--color-ink)",
                  }}
                >
                  Bo statyczny obraz tego nie odda.
                </h2>
              </div>
              <p
                className="max-w-[40ch] text-[14px]"
                style={{ color: "var(--color-ink-muted)", lineHeight: 1.55 }}
              >
                Nagranie prosto z ekranu — dokładnie to zobaczysz, otwierając stronę na żywo.
              </p>
            </FadeUp>
            <FadeUp inView y={40} duration={0.8} ease={EASE.expo}>
              <VideoShowcase
                src={project.video}
                poster={project.poster}
                rgb={project.rgb}
                label={`${project.title} — animacja strony`}
              />
            </FadeUp>
          </div>
        </section>
      )}

      {/* ═══ Gallery shot 1 — captioned visual break ═══ */}
      {project.gallery[0] && (
        <section data-header-theme="dark" data-canvas="base" className="relative">
          <div className="container-koda" style={{ paddingBottom: "clamp(40px,5vw,80px)" }}>
            <FadeUp inView y={36} duration={0.8} ease={EASE.expo}>
              <figure>
                <div
                  className="overflow-hidden rounded-[20px]"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 40px 90px -44px rgba(0,0,0,0.6)",
                  }}
                >
                  <img
                    src={project.gallery[0].src}
                    alt={`${project.title} — ${project.gallery[0].caption}`}
                    width={1440}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
                <figcaption
                  className="mt-4 max-w-[60ch] text-[14px]"
                  style={{ color: "var(--color-ink-faint)", lineHeight: 1.5 }}
                >
                  {project.gallery[0].caption}
                </figcaption>
              </figure>
            </FadeUp>
          </div>
        </section>
      )}

      {/* ═══ Decision log — "Dlaczego tak" ═══ */}
      <section data-header-theme="dark" data-canvas="tint" className="relative">
        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-4 block">Podejście</span>
          </FadeUp>
          <FadeUp inView delay={0.05}>
            <h2
              className="mb-[clamp(28px,4vw,56px)] max-w-[20ch] font-heading font-semibold"
              style={{
                fontSize: "clamp(1.6rem,3vw,2.6rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.025em",
                color: "var(--color-ink)",
              }}
            >
              Dlaczego tak, a nie inaczej.
            </h2>
          </FadeUp>
          <div className="flex flex-col" style={{ gap: "clamp(20px,2.4vw,28px)" }}>
            {project.decisions.map((d, i) => (
              <FadeUp key={d.choice} inView delay={i * 0.06} y={26}>
                <div
                  className="grid grid-cols-1 gap-x-8 gap-y-4 rounded-2xl p-[clamp(20px,2.6vw,34px)] md:grid-cols-[auto_1fr]"
                  style={{
                    background: "var(--color-surface-1)",
                    border: "1px solid var(--color-line)",
                  }}
                >
                  <span
                    className="font-heading font-bold"
                    style={{
                      fontSize: "clamp(1.6rem,2.4vw,2.2rem)",
                      color: "var(--color-accent)",
                      lineHeight: 1,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-3">
                    {[
                      { k: "Wyzwanie", v: d.constraint },
                      { k: "Decyzja", v: d.choice },
                      { k: "Efekt", v: d.benefit },
                    ].map((col) => (
                      <div key={col.k}>
                        <p
                          className="mb-1.5 font-heading text-[10px] font-bold tracking-[0.18em] uppercase"
                          style={{ color: "var(--color-ink-faint)" }}
                        >
                          {col.k}
                        </p>
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize: "0.98rem",
                            lineHeight: 1.5,
                            color: "var(--color-ink)",
                          }}
                        >
                          {col.v}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Device duo — desktop (browser) + phone ═══ */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-3 block">Na każdym ekranie</span>
          </FadeUp>
          <FadeUp inView delay={0.05}>
            <p
              className="mb-[clamp(28px,3.6vw,48px)] max-w-[46ch]"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1rem,1.3vw,1.15rem)",
                lineHeight: 1.6,
                color: "var(--color-ink-muted)",
              }}
            >
              Strona dopracowana od telefonu po duży ekran — ten sam charakter, pełna płynność
              wszędzie.
            </p>
          </FadeUp>
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-[1.55fr_0.45fr] md:gap-6">
            <FadeUp inView y={36} duration={0.8} ease={EASE.expo}>
              <BrowserFrame
                src={project.gallery[1]?.src ?? project.showcase}
                alt={`${project.title} — widok na komputerze`}
                url={project.liveUrl
                  .replace(/^https?:\/\/kodastrony\.github\.io\//, "")
                  .replace(/\/$/, "")}
              />
            </FadeUp>
            <FadeUp
              inView
              y={36}
              delay={0.08}
              duration={0.8}
              ease={EASE.expo}
              className="mx-auto w-[min(230px,72vw)] md:w-full"
            >
              <PhoneFrame src={project.mobileImage} alt={`${project.title} — widok na telefonie`} />
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══ Scope + deliverables ═══ */}
      <section data-header-theme="dark" data-canvas="tint" className="relative">
        <GlowField
          hue={300}
          x={90}
          y={22}
          strength={0.5}
          drift
          driftDuration={33}
          className="inset-x-0 z-0"
          style={{ top: "-14%", height: "75%" }}
        />
        <div className="container-koda section-y relative z-10">
          <div className="grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
            <FadeUp inView>
              <h2
                className="mb-6 font-heading font-semibold"
                style={{
                  fontSize: "clamp(1.4rem,2.2vw,1.9rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                }}
              >
                Zakres prac
              </h2>
              <ul className="flex flex-col gap-3" role="list">
                {project.scope.map((s) => (
                  <li
                    key={s}
                    className="flex items-start gap-3"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1.02rem",
                      lineHeight: 1.5,
                      color: "var(--color-ink)",
                    }}
                  >
                    <CheckIcon />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>

            <FadeUp inView delay={0.08}>
              <h2
                className="mb-6 font-heading font-semibold"
                style={{
                  fontSize: "clamp(1.4rem,2.2vw,1.9rem)",
                  letterSpacing: "-0.02em",
                  color: "var(--color-ink)",
                }}
              >
                Co dostajesz
              </h2>
              <ul className="flex flex-col gap-3" role="list">
                {project.deliverables.map((d) => (
                  <li
                    key={d}
                    className="flex items-start gap-3"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1.02rem",
                      lineHeight: 1.5,
                      color: "var(--color-ink)",
                    }}
                  >
                    <CheckIcon />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>

          {/* Craft proof — verifiable, testable in-browser */}
          <FadeUp inView delay={0.06} className="mt-[clamp(40px,5vw,72px)]">
            <p
              className="mb-6 font-heading text-[11px] font-bold tracking-[0.2em] uppercase"
              style={{ color: "var(--color-ink-faint)" }}
            >
              Dowód rzemiosła — sprawdzisz to sam
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {project.metrics.map((m) => (
                <div
                  key={m.label}
                  className="rounded-2xl p-[clamp(18px,2.2vw,26px)]"
                  style={{
                    background: "var(--color-surface-1)",
                    border: "1px solid var(--color-line)",
                  }}
                >
                  <p
                    className="font-heading font-bold"
                    style={{
                      fontSize: "clamp(1.3rem,2vw,1.7rem)",
                      letterSpacing: "-0.02em",
                      color: "var(--color-accent)",
                    }}
                  >
                    {m.value}
                  </p>
                  <p
                    className="mt-1.5"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.92rem",
                      lineHeight: 1.45,
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {m.label}
                  </p>
                </div>
              ))}
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ Live CTA — visit the working demo ═══ */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div
          className="container-koda"
          style={{ paddingTop: "clamp(20px,3vw,40px)", paddingBottom: "clamp(56px,7vw,100px)" }}
        >
          <FadeUp inView y={24}>
            <div
              className="flex flex-col items-start gap-6 rounded-[24px] p-[clamp(28px,4vw,56px)] sm:flex-row sm:items-center sm:justify-between"
              style={{
                border: `1px solid rgba(${project.rgb},0.3)`,
                background: `linear-gradient(120deg, rgba(${project.rgb},0.10), rgba(${project.rgb},0.02))`,
              }}
            >
              <div>
                <h2
                  className="font-heading font-semibold"
                  style={{
                    fontSize: "clamp(1.5rem,2.6vw,2.2rem)",
                    letterSpacing: "-0.025em",
                    color: "var(--color-ink)",
                  }}
                >
                  Najlepiej zobaczyć to na żywo.
                </h2>
                <p
                  className="mt-2 max-w-[42ch]"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "1rem",
                    lineHeight: 1.55,
                    color: "var(--color-ink-muted)",
                  }}
                >
                  Otwórz stronę — najlepiej też na telefonie — i sprawdź szybkość, animacje i każdy
                  detal.
                </p>
              </div>
              <Magnetic strength={0.4}>
                <LiveLink project={project} big />
              </Magnetic>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══ Next project — full-bleed teaser ═══ */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div className="container-koda" style={{ paddingBottom: "clamp(48px,6vw,90px)" }}>
          <div className="mb-6 flex items-end justify-between gap-4">
            <span className="label-koda block">Następna realizacja</span>
            <Link
              href="/realizacje"
              className="font-heading text-[11px] font-bold tracking-[0.16em] text-[var(--color-ink-muted)] uppercase transition-colors duration-300 hover:text-pink"
            >
              Wszystkie →
            </Link>
          </div>
          <FadeUp inView y={32} duration={0.8} ease={EASE.expo}>
            <Link
              href={`/realizacje/${next.id}`}
              aria-label={`Następna realizacja: ${next.title}`}
              className="group block"
            >
              <div
                className="relative overflow-hidden rounded-[24px]"
                style={{
                  border: "1px solid rgba(255,255,255,0.09)",
                  boxShadow: "0 40px 90px -44px rgba(0,0,0,0.6)",
                }}
              >
                <div className="relative" style={{ paddingBottom: "42%" }}>
                  <div className="absolute inset-0" style={{ background: next.bg }} />
                  {next.image && (
                    <img
                      src={next.image}
                      alt={`${next.title} — ${next.type}`}
                      width={1200}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    />
                  )}
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.25) 45%, transparent 75%)",
                    }}
                  />
                  <div
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{ padding: "clamp(24px,5vw,64px)" }}
                  >
                    <p
                      className="font-heading text-[11px] font-bold tracking-[0.18em] uppercase"
                      style={{ color: `rgba(${next.rgb},0.95)` }}
                    >
                      {next.type}
                    </p>
                    <h3
                      className="mt-2 font-heading font-bold"
                      style={{
                        fontSize: "clamp(2rem,5vw,3.6rem)",
                        letterSpacing: "-0.03em",
                        lineHeight: 1,
                        color: "#fff",
                        textShadow: "0 2px 18px rgba(0,0,0,0.5)",
                      }}
                    >
                      {next.title}
                    </h3>
                    <span
                      className="mt-5 inline-flex w-fit items-center gap-2 font-heading text-[12px] font-bold tracking-[0.14em] uppercase"
                      style={{ color: "#fff" }}
                    >
                      Zobacz realizację
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </FadeUp>
        </div>
      </section>
    </article>
  );
}
