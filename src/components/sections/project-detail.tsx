"use client";

import Link from "next/link";
import Image from "next/image";
import { FadeUp, Reveal } from "@/components/motion";
import { EASE } from "@/lib/motion";
import { MockWebsite } from "@/components/ui/project-card";
import type { Project } from "@/lib/projects";

function CheckIcon({ rgb }: { rgb: string }) {
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="mt-1 shrink-0">
      <path d="M3 8.5L6.5 12L13 4.5" stroke={`rgb(${rgb})`} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ProjectDetail({ project, prev, next }: { project: Project; prev: Project; next: Project }) {
  return (
    <article>
      {/* ── Hero ── */}
      <section
        data-header-theme="dark"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-bg)", paddingTop: "clamp(128px, 16vw, 210px)", paddingBottom: "clamp(28px, 4vw, 56px)" }}
      >
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0" style={{ background: `radial-gradient(ellipse 55% 60% at 88% 0%, rgba(${project.rgb},0.16) 0%, transparent 60%)` }} />

        <div className="container-koda relative z-10">
          <FadeUp x={-20} y={0} duration={0.5} ease={EASE.out}>
            <Link
              href="/realizacje"
              className="inline-flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-muted)] transition-colors duration-300 hover:text-pink"
            >
              ← Realizacje
            </Link>
          </FadeUp>

          <FadeUp y={0} x={-10} duration={0.6} ease={EASE.out} delay={0.08} className="mt-7">
            <span className="font-heading text-[12px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-accent)" }}>
              {project.client} · {project.year}
            </span>
          </FadeUp>

          <Reveal className="mt-4" duration={0.85} ease={EASE.out} delay={0.12}>
            <h1 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, fontSize: "clamp(2.6rem, 7vw, 5.5rem)", lineHeight: 1.02, letterSpacing: "-0.035em", color: "var(--color-ink)" }}>
              {project.title}
              <span style={{ color: "var(--color-accent)" }}>.</span>
            </h1>
          </Reveal>

          <FadeUp y={22} duration={0.6} ease={EASE.expo} delay={0.22} className="mt-7">
            <p className="text-lead">{project.intro}</p>
          </FadeUp>
        </div>
      </section>

      {/* ── Showcase visual ── */}
      <section data-header-theme="dark" className="relative" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="container-koda" style={{ paddingTop: "clamp(24px,3vw,40px)", paddingBottom: "clamp(48px,6vw,96px)" }}>
          <FadeUp inView y={40} duration={0.8} ease={EASE.expo}>
            <div
              className="relative overflow-hidden rounded-[24px]"
              style={{ border: "1px solid rgba(255,255,255,0.09)", boxShadow: `0 50px 110px -40px rgba(0,0,0,0.7), 0 0 120px -40px rgba(${project.rgb},0.35)` }}
            >
              <div className="relative" style={{ paddingBottom: "58%" }}>
                <div className="absolute inset-0" style={{ background: project.bg }} />
                <div
                  className="pointer-events-none absolute"
                  aria-hidden={true}
                  style={{ width: "70%", height: "60%", top: "2%", left: "15%", borderRadius: "50%", background: `radial-gradient(ellipse at center, rgba(${project.rgb},0.24) 0%, rgba(${project.rgb},0.08) 40%, transparent 72%)` }}
                />
                {project.image ? (
                  <Image src={project.image} alt={`${project.title} — ${project.type}`} fill sizes="(min-width: 1024px) 1200px, 92vw" className="object-cover object-top" />
                ) : (
                  <MockWebsite accent={project.glow} />
                )}
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Facts + scope + deliverables ── */}
      <section data-header-theme="dark" className="relative overflow-hidden" style={{ backgroundColor: "var(--color-graphite)" }}>
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40" style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }} />

        <div className="container-koda section-y relative z-10">
          {/* Facts */}
          <FadeUp inView>
            <div className="grid grid-cols-1 gap-8 border-b pb-[clamp(32px,4vw,56px)] sm:grid-cols-3" style={{ borderColor: "var(--color-line)" }}>
              {[
                { k: "Branża", v: project.client },
                { k: "Typ projektu", v: project.type },
                { k: "Rok", v: project.year },
              ].map((f) => (
                <div key={f.k}>
                  <p className="font-heading text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: "var(--color-ink-faint)" }}>{f.k}</p>
                  <p className="mt-2 font-heading font-semibold" style={{ fontSize: "clamp(1.2rem,1.8vw,1.6rem)", color: "var(--color-ink)", letterSpacing: "-0.02em" }}>{f.v}</p>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Scope + deliverables */}
          <div className="mt-[clamp(40px,5vw,72px)] grid grid-cols-1 gap-x-12 gap-y-12 md:grid-cols-2">
            <FadeUp inView>
              <h2 className="mb-6 font-heading font-semibold" style={{ fontSize: "clamp(1.4rem,2.2vw,1.9rem)", letterSpacing: "-0.02em", color: "var(--color-ink)" }}>
                Zakres prac
              </h2>
              <ul className="flex flex-col gap-3" role="list">
                {project.scope.map((s) => (
                  <li key={s} className="flex items-start gap-3" style={{ fontFamily: "var(--font-body)", fontSize: "1.02rem", lineHeight: 1.5, color: "var(--color-ink)" }}>
                    <CheckIcon rgb={project.rgb} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>

            <FadeUp inView delay={0.08}>
              <h2 className="mb-6 font-heading font-semibold" style={{ fontSize: "clamp(1.4rem,2.2vw,1.9rem)", letterSpacing: "-0.02em", color: "var(--color-ink)" }}>
                Co dostarczyliśmy
              </h2>
              <ul className="flex flex-col gap-3" role="list">
                {project.deliverables.map((d) => (
                  <li key={d} className="flex items-start gap-3" style={{ fontFamily: "var(--font-body)", fontSize: "1.02rem", lineHeight: 1.5, color: "var(--color-ink)" }}>
                    <CheckIcon rgb={project.rgb} />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Prev / next ── */}
      <section data-header-theme="dark" className="relative" style={{ backgroundColor: "var(--color-bg)" }}>
        <div className="container-koda" style={{ paddingTop: "clamp(48px,6vw,90px)", paddingBottom: "clamp(48px,6vw,90px)" }}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link href={`/realizacje/${prev.id}`} className="group rounded-2xl p-6 transition-colors duration-300" style={{ border: "1px solid var(--color-line)", backgroundColor: "var(--color-surface-1)" }}>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--color-ink-faint)" }}>← Poprzednia</p>
              <p className="mt-2 font-heading font-semibold transition-colors duration-300 group-hover:text-pink" style={{ fontSize: "clamp(1.2rem,1.8vw,1.6rem)", color: "var(--color-ink)", letterSpacing: "-0.02em" }}>{prev.title}</p>
            </Link>
            <Link href={`/realizacje/${next.id}`} className="group rounded-2xl p-6 text-right transition-colors duration-300" style={{ border: "1px solid var(--color-line)", backgroundColor: "var(--color-surface-1)" }}>
              <p className="font-heading text-[11px] font-bold uppercase tracking-[0.18em]" style={{ color: "var(--color-ink-faint)" }}>Następna →</p>
              <p className="mt-2 font-heading font-semibold transition-colors duration-300 group-hover:text-pink" style={{ fontSize: "clamp(1.2rem,1.8vw,1.6rem)", color: "var(--color-ink)", letterSpacing: "-0.02em" }}>{next.title}</p>
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
