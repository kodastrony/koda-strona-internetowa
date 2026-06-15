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
      {/* Pink bloom — różowy „moment" sekcji. CAŁY zawarty w sekcji
          (height 100% + bottom-clip; było 118% → róż wyciekał ~18% POD szew
          i robił jasny plamiasty PAS na czole stopki = ten brzydki błąd ze
          screena). Peak przesunięty w GÓRĘ (za treść CTA, 50% 58%) i gaśnie
          DO ZERA na 60% promienia → róż świeci za nagłówkiem, a nie przy szwie.
          overflow-hidden ucina go nawet podczas parallax-driftu (nigdy poniżej
          dołu sekcji). To finał jak na home: glow w treści, ciemno przy stopce. */}
      <Parallax
        speed={38}
        className="pointer-events-none absolute inset-x-0 top-0 z-0 h-full overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 64% at 50% 58%, oklch(0.62 0.215 335 / 0.26) 0%, oklch(0.52 0.18 335 / 0.10) 38%, oklch(0.42 0.14 335 / 0) 60%)",
          }}
        />
      </Parallax>

      {/* Zejście do stopki — dolna krawędź sekcji ściemnia plumowe tło do
          ciepłej czerni stopki (#0a0609 = hold „footer"), DOKŁADNIE tym samym
          gradientem co finał Statement na home (#0a0609 0% → 0.6 @42% → 0). */}
      <div
        aria-hidden="true"
        className="cta-footer-wash pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(180px,26vh,400px)]"
        style={{
          background:
            "linear-gradient(to top, #0a0609 0%, rgba(10,6,9,0.6) 42%, rgba(10,6,9,0) 100%)",
        }}
      />

      {/* ŚWIATŁO ROZPIĘTE NA SZWIE — odpowiednik horyzontu z home. U dołu sekcji
          ten sam delikatny róż co poświata stopki (`at 50% 100%`), więc po OBU
          stronach szwu jest ciągły, miękki blask. Dzięki temu cienka różowa
          linia stopki (hairline 0.09) blenduje się jak na stronie głównej — to
          usuwa tę „kreskę". Faint (~0.08, == poświata stopki) → kontynuacja
          światła, NIE jasny pas (tamten błąd to był bloom 0.30 wyciekający pod
          sekcję). Nad washem (z-2), więc nie jest przez niego wygaszony.
          Też dark-only — wspólna klasa `cta-footer-wash` chowa go w jasnym. */}
      <div
        aria-hidden="true"
        className="cta-footer-wash pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[clamp(150px,20vh,300px)]"
        style={{
          background:
            "radial-gradient(ellipse 95% 120% at 50% 100%, oklch(0.62 0.215 335 / 0.08) 0%, oklch(0.56 0.18 335 / 0.03) 46%, oklch(0.5 0.16 335 / 0) 78%)",
        }}
      />

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
