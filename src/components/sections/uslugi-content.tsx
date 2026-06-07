"use client";

import { FadeUp } from "@/components/motion";
import { SERVICES, PROCESS } from "@/lib/services-data";

const NUM_COLORS = [
  "var(--color-pink-bright)",
  "var(--color-accent-3)",
  "var(--color-accent-2)",
  "var(--color-accent-4)",
];

function CheckIcon({ color }: { color: string }) {
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
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function UslugiContent() {
  return (
    <>
      {/* ── Detailed services ── */}
      <section
        data-header-theme="dark"
        className="relative"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <div className="container-koda" style={{ paddingBottom: "clamp(60px, 8vw, 120px)" }}>
          {SERVICES.map((s, i) => (
            <article
              key={s.id}
              id={s.id}
              className="grid scroll-mt-28 grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-12"
              style={{
                borderTop: "1px solid var(--color-line)",
                paddingTop: "clamp(36px,5vw,72px)",
                paddingBottom: "clamp(36px,5vw,72px)",
              }}
            >
              <div className="md:col-span-5">
                <FadeUp inView>
                  <div
                    aria-hidden="true"
                    className="mb-4 font-heading font-bold"
                    style={{
                      fontSize: "clamp(2.6rem,4.4vw,4rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: NUM_COLORS[i % NUM_COLORS.length],
                    }}
                  >
                    {s.n}
                  </div>
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
                    {s.title}
                  </h2>
                </FadeUp>
              </div>

              <div className="md:col-span-7">
                <FadeUp inView delay={0.1}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                      lineHeight: 1.6,
                      color: "var(--color-ink-muted)",
                      maxWidth: "52ch",
                    }}
                  >
                    {s.lead}
                  </p>
                </FadeUp>
                <FadeUp inView delay={0.16}>
                  <ul className="mt-7 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2" role="list">
                    {s.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-start gap-3"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.97rem",
                          lineHeight: 1.5,
                          color: "var(--color-ink)",
                        }}
                      >
                        <CheckIcon color={NUM_COLORS[i % NUM_COLORS.length]} />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </FadeUp>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── Process — "Jak pracujemy" ── */}
      <section
        data-header-theme="dark"
        className="relative overflow-hidden"
        style={{ backgroundColor: "var(--color-graphite)" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-0 h-40"
          style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(ellipse 55% 55% at 8% 12%, rgba(100,120,240,0.10) 0%, transparent 58%)",
          }}
        />

        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-5 block">Proces</span>
          </FadeUp>
          <FadeUp inView delay={0.06}>
            <h2 className="text-section-title max-w-[16ch]">Jak pracujemy</h2>
          </FadeUp>

          <div className="mt-[clamp(44px,5.5vw,80px)] grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS.map((step, i) => (
              <FadeUp inView key={step.n} delay={0.08 * i} y={26}>
                <div>
                  <div
                    aria-hidden="true"
                    className="mb-4 font-heading font-bold"
                    style={{
                      fontSize: "clamp(2.2rem,3vw,3rem)",
                      lineHeight: 1,
                      letterSpacing: "-0.04em",
                      color: "var(--color-accent)",
                    }}
                  >
                    {step.n}
                  </div>
                  <h3
                    className="mb-2.5 font-heading font-semibold"
                    style={{
                      fontSize: "clamp(1.2rem,1.7vw,1.5rem)",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.15,
                      color: "var(--color-ink)",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.97rem",
                      lineHeight: 1.6,
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
