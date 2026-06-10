"use client";

import { FadeUp } from "@/components/motion";
import { TESTIMONIALS } from "@/lib/testimonials";

/* ── Testimonials — social proof ──────────────────────────────────────────
   Renders ONLY when there is at least one real, consented quote in
   @/lib/testimonials. While the array is empty it returns null, so nothing fake
   ever shows — the moment a real quote is added, the section appears on the
   homepage (placed between Work and WhyKoda). */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 55% at 50% 0%, rgba(207,67,184,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="container-koda section-y relative z-10">
        <FadeUp inView>
          <span className="label-koda mb-5 block">Opinie</span>
        </FadeUp>
        <FadeUp inView delay={0.06}>
          <h2 className="text-section-title max-w-[16ch]">Co mówią klienci</h2>
        </FadeUp>

        <div className="mt-[clamp(40px,5vw,72px)] grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp inView key={`${t.name}-${i}`} delay={0.08 * i} y={26}>
              <figure
                className="flex h-full flex-col rounded-2xl p-[clamp(24px,3vw,40px)]"
                style={{
                  border: "1px solid var(--color-line)",
                  backgroundColor: "var(--color-surface-1)",
                }}
              >
                <blockquote
                  className="flex-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontWeight: 600,
                    fontSize: "clamp(1.15rem,1.7vw,1.5rem)",
                    lineHeight: 1.35,
                    letterSpacing: "-0.02em",
                    color: "var(--color-ink)",
                  }}
                >
                  „{t.quote}”
                </blockquote>
                <figcaption className="mt-6">
                  <span
                    className="font-heading font-semibold"
                    style={{ fontSize: "1rem", color: "var(--color-ink)" }}
                  >
                    {t.name}
                  </span>
                  <span
                    className="mt-0.5 block"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {t.company}
                  </span>
                  {t.link && (
                    <a
                      href={t.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-block font-heading text-[11px] font-bold tracking-[0.16em] text-[var(--color-ink-faint)] uppercase transition-colors duration-300 hover:text-pink"
                    >
                      Zobacz opinię →
                    </a>
                  )}
                </figcaption>
              </figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
