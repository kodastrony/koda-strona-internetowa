"use client";

import Link from "next/link";
import { FadeUp } from "@/components/motion";
import { ARTICLES_BY_DATE, formatArticleDate } from "@/lib/articles";

export function BlogContent() {
  return (
    <section data-header-theme="dark" className="relative" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container-koda" style={{ paddingBottom: "clamp(50px,7vw,110px)" }}>
        <div className="mx-auto max-w-[900px]" style={{ borderBottom: "1px solid var(--color-line)" }}>
          {ARTICLES_BY_DATE.map((a, i) => (
            <FadeUp inView key={a.slug} delay={0.05 * i} y={22}>
              <Link
                href={`/blog/${a.slug}`}
                className="group block"
                style={{ borderTop: "1px solid var(--color-line)", paddingTop: "clamp(28px,3.4vw,44px)", paddingBottom: "clamp(28px,3.4vw,44px)" }}
              >
                <div className="flex flex-wrap items-center gap-3 font-heading text-[11px] font-bold uppercase tracking-[0.16em]">
                  <span style={{ color: "var(--color-accent)" }}>{a.category}</span>
                  <span style={{ color: "var(--color-ink-faint)" }}>·</span>
                  <span style={{ color: "var(--color-ink-muted)" }}>{formatArticleDate(a.date)}</span>
                  <span style={{ color: "var(--color-ink-faint)" }}>·</span>
                  <span style={{ color: "var(--color-ink-muted)" }}>{a.readMinutes} min</span>
                </div>

                <h2
                  className="mt-4 font-heading font-semibold text-[var(--color-ink)] transition-colors duration-300 group-hover:text-pink"
                  style={{ fontSize: "clamp(1.5rem,3vw,2.4rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
                >
                  {a.title}
                </h2>

                <p className="mt-3 max-w-[62ch]" style={{ fontFamily: "var(--font-body)", fontSize: "clamp(1rem,1.1vw,1.1rem)", lineHeight: 1.6, color: "var(--color-ink-muted)" }}>
                  {a.excerpt}
                </p>

                <span className="mt-5 inline-flex items-center gap-2 font-heading text-[12px] font-bold uppercase tracking-[0.16em] text-[var(--color-ink-faint)] transition-colors duration-300 group-hover:text-pink">
                  Czytaj artykuł
                  <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" style={{ transitionTimingFunction: "cubic-bezier(0.23,1,0.32,1)" }}>
                    →
                  </span>
                </span>
              </Link>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
