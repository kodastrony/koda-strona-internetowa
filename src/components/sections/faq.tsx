"use client";

import { useId, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { FadeUp, Parallax } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { GlowField } from "@/components/fx/glow-field";
import { PillLink } from "@/components/ui/pill-link";
import { EASE } from "@/lib/motion";
import { CONTACT } from "@/lib/constants";
import { FAQS } from "@/lib/faq";

/* ── FAQ — objection-killer before the final CTA (also the nav "FAQ" target) ─
   Two-column on desktop: a sticky intro on the left ORIENTS the reader (where to
   start + a way out if their question isn't here), and a roomy accordion on the
   right. Each item is a separated card with generous padding — so it reads as a
   set of distinct questions, not one squished wall of rows. One item open at a
   time; the active card tints pink and its "+" rotates to "×". Reduced motion
   collapses to an instant toggle. Data + the FAQPage JSON-LD both read @/lib/faq. */

function FaqItem({
  faq,
  index,
  open,
  onToggle,
}: {
  faq: { q: string; a: string };
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();
  const uid = useId();
  const btnId = `${uid}-btn`;
  const panelId = `${uid}-panel`;

  return (
    <div
      className="overflow-hidden rounded-2xl transition-[background-color,border-color] duration-300"
      style={{
        // Karty w ciepłej strefie strony — surface-warm (H335) zamiast
        // neutralnego surface-1, żeby siedziały w kolorze canvasu pod sobą.
        backgroundColor: open ? "rgba(207,67,184,0.07)" : "var(--color-surface-warm)",
        border: `1px solid ${open ? "rgba(207,67,184,0.24)" : "var(--color-line)"}`,
      }}
    >
      <h3 className="m-0">
        <button
          id={btnId}
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="group grid w-full grid-cols-[auto_1fr_auto] items-start gap-4 px-[clamp(18px,2.4vw,30px)] py-[clamp(18px,2.2vw,26px)] text-left outline-offset-[-6px] sm:gap-6"
        >
          {/* number — orients the set, accents when open */}
          <span
            aria-hidden="true"
            className="pt-1 font-heading text-[13px] font-bold"
            style={{
              letterSpacing: "0.04em",
              color: open ? "var(--color-pink-bright)" : "var(--color-ink-faint)",
              transition: "color 300ms ease",
            }}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span
            className="font-heading font-semibold transition-colors duration-300 group-hover:text-pink"
            style={{
              fontSize: "clamp(1.05rem,1.7vw,1.45rem)",
              letterSpacing: "-0.02em",
              lineHeight: 1.3,
              color: open ? "var(--color-pink-bright)" : "var(--color-ink)",
            }}
          >
            {faq.q}
          </span>
          {/* "+" → "×": rotate 45° on open */}
          <motion.span
            aria-hidden="true"
            className="mt-0.5 shrink-0 font-heading leading-none"
            style={{
              fontSize: "clamp(1.5rem,2.2vw,2rem)",
              fontWeight: 300,
              color: "var(--color-accent)",
            }}
            animate={{ rotate: open ? 45 : 0 }}
            transition={reduce ? { duration: 0 } : { duration: 0.35, ease: EASE.out }}
          >
            +
          </motion.span>
        </button>
      </h3>

      <motion.div
        id={panelId}
        role="region"
        aria-labelledby={btnId}
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={reduce ? { duration: 0 } : { duration: 0.42, ease: EASE.out }}
        style={{ overflow: "hidden" }}
      >
        <p
          className="max-w-[60ch] pr-[clamp(18px,2.4vw,30px)] pb-[clamp(20px,2.4vw,28px)] pl-[clamp(52px,7vw,72px)]"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "clamp(1rem,1.1vw,1.1rem)",
            lineHeight: 1.65,
            color: "var(--color-ink-muted)",
          }}
        >
          {faq.a}
        </p>
      </motion.div>
    </div>
  );
}

export function Faq() {
  // Single-open accordion (-1 = none). First item opens by default so the
  // section reads as content, not a row of closed buttons.
  const [openIndex, setOpenIndex] = useState(0);

  // ── Foreshadow — róż Statementu ZAPOWIADA SIĘ światłem w dole FAQ ────────
  // Scroll-linked (czysta funkcja pozycji): im bliżej Statementu, tym mocniej
  // różowa łuna wybija od dołu sekcji. Dzięki temu wipe jest spełnioną
  // obietnicą, a nie policzkiem czerń→róż. Reduced-motion: stała, subtelna.
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["end 1.35", "end 0.5"],
  });
  const foreshadow = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      data-header-theme="dark"
      data-canvas="faq"
      className="relative scroll-mt-24"
    >
      {/* Tło = PageCanvas (hold „faq" #1a1017 — pierwsza ciepła powierzchnia
          H335; zwrot temperatury robi sam canvas, bez mostków). */}
      <Parallax
        speed={70}
        className="pointer-events-none absolute inset-x-0 z-0"
        style={{ top: "-14%", height: "70%" }}
      >
        <GlowField
          hue={335}
          x={8}
          y={26}
          strength={0.85}
          drift
          driftDuration={27}
          className="inset-0"
        />
      </Parallax>

      {/* Różowa łuna-zapowiedź nad dolną krawędzią (H335, taper alfa — nigdy
          przez `transparent`/szarość). Opacity jedzie ze scrollem. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0"
        style={{
          height: "52vh",
          // willChange: opacity pisana z JS per klatkę scrolla — bez promocji
          // ten pełnoszerokościowy gradient re-rasterowałby się co klatkę.
          willChange: "opacity",
          opacity: reduce ? 0.45 : foreshadow,
          background:
            "radial-gradient(ellipse 120% 86% at 50% 102%, oklch(0.62 0.215 335 / 0.26) 0%, oklch(0.5 0.17 335 / 0.11) 42%, oklch(0.4 0.13 335 / 0.04) 64%, oklch(0.4 0.13 335 / 0) 82%)",
        }}
      />

      <div className="container-koda section-y relative z-10">
        <div className="grid grid-cols-1 gap-[clamp(36px,5vw,64px)] lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-16">
          {/* ── Left: orienting intro (sticky on desktop) ── */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <FadeUp inView>
              {/* W ciepłej strefie mały różowy tekst = pink-bright (kontrast na
                  #1a1017 i na plum w strefie przejścia; #cf43b8 byłby na granicy AA). */}
              <span className="label-koda mb-5 block" style={{ color: "var(--color-pink-bright)" }}>
                FAQ
              </span>
            </FadeUp>
            <FadeUp inView delay={0.06}>
              <h2
                className="font-heading font-semibold"
                style={{
                  fontSize: "clamp(1.9rem,3.4vw,3rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.025em",
                  color: "var(--color-ink)",
                  textWrap: "balance",
                }}
              >
                Pytania, które słyszymy najczęściej
              </h2>
            </FadeUp>
            <FadeUp inView delay={0.12}>
              <p
                className="mt-6 max-w-[36ch]"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1rem,1.1vw,1.1rem)",
                  lineHeight: 1.6,
                  color: "var(--color-ink-muted)",
                }}
              >
                Najczęstsze wątpliwości, zanim ruszymy. Nie ma tu Twojego pytania? Napisz — wracamy
                z odpowiedzią w ciągu 24 godzin.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.18} className="mt-8 hidden lg:block">
              <Magnetic strength={0.35}>
                <PillLink
                  href="/kontakt"
                  bg="var(--color-surface-1)"
                  border="var(--color-line-strong)"
                  className="px-8 py-3.5 text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]"
                >
                  Zadaj pytanie
                </PillLink>
              </Magnetic>
            </FadeUp>
          </div>

          {/* ── Right: roomy accordion ── */}
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <FadeUp inView key={faq.q} delay={Math.min(0.04 * i, 0.2)} y={16}>
                <FaqItem
                  faq={faq}
                  index={i}
                  open={openIndex === i}
                  onToggle={() => setOpenIndex((cur) => (cur === i ? -1 : i))}
                />
              </FadeUp>
            ))}
            {/* Mobile-only "ask a question" link (the sticky CTA is desktop-only) */}
            <p className="mt-3 text-center font-body text-[14px] text-ink-muted lg:hidden">
              Masz inne pytanie?{" "}
              {/* pink-bright: #cf43b8 spadał pod AA dokładnie tam, gdzie
                  foreshadow + plum są najmocniejsze (dół FAQ przy Statement). */}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-pink-bright underline decoration-pink-bright/40 underline-offset-4 transition-colors hover:decoration-pink-bright"
              >
                Napisz do nas
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
