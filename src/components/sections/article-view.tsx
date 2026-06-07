"use client";

import Link from "next/link";
import { FadeUp, Reveal } from "@/components/motion";
import { EASE } from "@/lib/motion";
import { type Article, formatArticleDate } from "@/lib/articles";

export function ArticleView({ article }: { article: Article }) {
  return (
    <article>
      {/* ── Hero ── */}
      <section
        data-header-theme="dark"
        className="relative overflow-hidden"
        style={{
          backgroundColor: "var(--color-bg)",
          paddingTop: "clamp(128px, 16vw, 210px)",
          paddingBottom: "clamp(20px, 3vw, 40px)",
        }}
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
            background:
              "radial-gradient(ellipse 52% 60% at 88% 0%, rgba(207,67,184,0.12) 0%, transparent 60%)",
          }}
        />

        <div className="container-koda relative z-10 mx-auto max-w-[680px]">
          <FadeUp x={-20} y={0} duration={0.5} ease={EASE.out}>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 font-heading text-[12px] font-bold tracking-[0.16em] text-[var(--color-ink-muted)] uppercase transition-colors duration-300 hover:text-pink"
            >
              ← Blog
            </Link>
          </FadeUp>

          <FadeUp y={14} duration={0.6} ease={EASE.out} delay={0.08} className="mt-7">
            <div className="flex flex-wrap items-center gap-3 font-heading text-[12px] font-bold tracking-[0.14em] uppercase">
              <span style={{ color: "var(--color-accent)" }}>{article.category}</span>
              <span style={{ color: "var(--color-ink-faint)" }}>·</span>
              <span style={{ color: "var(--color-ink-muted)" }}>
                {formatArticleDate(article.date)}
              </span>
              <span style={{ color: "var(--color-ink-faint)" }}>·</span>
              <span style={{ color: "var(--color-ink-muted)" }}>
                {article.readMinutes} min czytania
              </span>
            </div>
          </FadeUp>

          <Reveal className="mt-5" duration={0.85} ease={EASE.out} delay={0.14}>
            <h1
              style={{
                fontFamily: "var(--font-heading)",
                fontWeight: 600,
                fontSize: "clamp(2.1rem, 5vw, 3.6rem)",
                lineHeight: 1.07,
                letterSpacing: "-0.03em",
                color: "var(--color-ink)",
                textWrap: "balance",
              }}
            >
              {article.title}
            </h1>
          </Reveal>
        </div>
      </section>

      {/* ── Body ── */}
      <section
        data-header-theme="dark"
        className="relative"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div
          className="container-koda"
          style={{ paddingTop: "clamp(20px,3vw,40px)", paddingBottom: "clamp(56px,7vw,110px)" }}
        >
          <div className="mx-auto max-w-[680px]">
            {article.body.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={i}
                    className="font-heading font-semibold"
                    style={{
                      fontSize: "clamp(1.4rem,2.4vw,2rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      color: "var(--color-ink)",
                      marginTop: "clamp(2.2rem,4vw,3.2rem)",
                      marginBottom: "0.9rem",
                    }}
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="my-5 flex flex-col gap-2.5 pl-1" role="list">
                    {block.items.map((it, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-3"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "clamp(1rem,1.15vw,1.1rem)",
                          lineHeight: 1.6,
                          color: "var(--color-ink-muted)",
                        }}
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full"
                          style={{ backgroundColor: "var(--color-accent)" }}
                        />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "clamp(1.02rem,1.2vw,1.15rem)",
                    lineHeight: 1.75,
                    color: "var(--color-ink-muted)",
                    marginBottom: "1.35rem",
                  }}
                >
                  {block.text}
                </p>
              );
            })}
          </div>
        </div>
      </section>
    </article>
  );
}
