"use client";

import { FadeUp, Parallax } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { CONTACT } from "@/lib/constants";
import { PillLink } from "@/components/ui/pill-link";

/* ── CTABand — shared closing call-to-action ───────────────────────────────
   The conversion close for every sub-page. A calmer cousin of the homepage
   Statement: PageCanvas wchodzi w plum (hold „cta" #30132a), a różowy BLOOM
   wybija od dołu po ścieżce H335 i przelewa się przez szew do stopki —
   ten sam finałowy akord co na home, tylko ściszony. Reveals on scroll. */
export function CTABand({
  title = "Porozmawiajmy o Twoim projekcie",
  subtitle = "Wstępny pomysł i wycenę odsyłamy w ciągu 24 godzin. Bez zobowiązań.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section data-header-theme="dark" data-canvas="cta" className="relative">
      {/* Pink bloom — pełna ścieżka H335 (taper alfa w jednym hue, zero
          szarego dołka), wystaje pod sekcję w stronę stopki. */}
      <Parallax
        speed={52}
        className="pointer-events-none absolute inset-x-0 z-0"
        style={{ top: 0, height: "118%" }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 72% 78% at 50% 100%, oklch(0.62 0.215 335 / 0.30) 0%, oklch(0.52 0.18 335 / 0.12) 38%, oklch(0.42 0.14 335 / 0.045) 56%, oklch(0.42 0.14 335 / 0) 74%)",
          }}
        />
      </Parallax>

      <div
        className="container-koda relative z-10 flex flex-col items-center text-center"
        style={{
          paddingTop: "clamp(80px, 11vw, 150px)",
          paddingBottom: "clamp(80px, 11vw, 150px)",
        }}
      >
        <FadeUp inView>
          {/* Na plum (hold „cta") mały różowy tekst = pink-bright (AA). */}
          <span className="label-koda mb-6 block" style={{ color: "var(--color-pink-bright)" }}>
            Porozmawiajmy
          </span>
        </FadeUp>
        <FadeUp inView delay={0.06}>
          <h2
            className="max-w-[16ch] font-heading font-semibold"
            style={{
              fontSize: "clamp(2rem, 5vw, 3.6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
              textWrap: "balance",
            }}
          >
            {title}
            <span style={{ color: "var(--color-pink-bright)" }}>.</span>
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.13}>
          <p
            className="mt-6 max-w-[52ch]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.25vw, 1.15rem)",
              lineHeight: 1.6,
              color: "var(--color-ink-muted)",
            }}
          >
            {subtitle}
          </p>
        </FadeUp>
        <FadeUp
          inView
          delay={0.2}
          y={16}
          scale={0.96}
          className="mt-10 flex flex-col items-center gap-5"
        >
          <Magnetic strength={0.4}>
            <PillLink
              href="/kontakt"
              bg="#cf43b8"
              border="#cf43b8"
              className="px-9 py-4 text-white hover:text-white hover:shadow-[0_18px_44px_-12px_rgba(207,67,184,0.55)]"
            >
              Bezpłatna wycena
            </PillLink>
          </Magnetic>
          <a
            href={`mailto:${CONTACT.email}`}
            className="text-[14px] text-ink-muted underline-offset-4 transition-colors duration-300 hover:text-pink hover:underline"
          >
            lub napisz: {CONTACT.email}
          </a>
        </FadeUp>
      </div>
    </section>
  );
}
