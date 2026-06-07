"use client";

import { FadeUp } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";
import { CONTACT } from "@/lib/constants";

/* ── CTABand — shared closing call-to-action ───────────────────────────────
   The conversion close for every sub-page. A calmer cousin of the homepage
   Statement: the brand pink BLOOMS out of the deepest dark (radial, not a
   slab), a confident line, and the signature pink "Darmowa wycena" pill
   (magnetic) + a quieter email link. Reveals on scroll. */
export function CTABand({
  title = "Zróbmy stronę, która naprawdę sprzedaje",
  subtitle = "Opowiedz nam o projekcie — wrócimy z propozycją i wyceną w ciągu 24 godzin.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-deep)" }}
    >
      {/* Pink bloom rising out of the dark (radial, soft — not a flashbang slab) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 70% 75% at 50% 112%, rgba(207,67,184,0.22) 0%, rgba(207,67,184,0.06) 38%, transparent 68%)" }}
      />
      {/* Top fade so it melts out of the section above */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-32"
        style={{ background: "linear-gradient(to bottom, var(--color-bg), transparent)" }}
      />

      <div
        className="container-koda relative z-10 flex flex-col items-center text-center"
        style={{ paddingTop: "clamp(80px, 11vw, 150px)", paddingBottom: "clamp(80px, 11vw, 150px)" }}
      >
        <FadeUp inView>
          <span className="label-koda mb-6 block">Porozmawiajmy</span>
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
        <FadeUp inView delay={0.2} y={16} scale={0.96} className="mt-10 flex flex-col items-center gap-5">
          <Magnetic strength={0.4}>
            <PillLink
              href="/kontakt"
              bg="#cf43b8"
              border="#cf43b8"
              className="px-9 py-4 text-white hover:text-white hover:shadow-[0_18px_44px_-12px_rgba(207,67,184,0.55)]"
            >
              Darmowa wycena
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
