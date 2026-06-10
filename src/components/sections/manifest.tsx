"use client";

import { Fragment } from "react";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp, Parallax } from "@/components/motion";

/* ── Manifest / POV ───────────────────────────────────────────────────────
   Krótki, twardy moment autorytetu MIĘDZY dowodem (Realizacje) a argumentem
   (Dlaczego my). Jedna teza, stwierdzona płasko (wzorzec Huge „We Believe").
   Bez eyebrow, bez CTA — jednoekranowy oddech, który uogólnia to, co użytkownik
   właśnie zobaczył w realizacjach: „te koncepty nie są przypadkiem — tak
   działa każda nasza strona". Nagłówek odsłaniany słowo po słowie; akcent
   „nie przypadek." w różu marki. */
const HEAD_WORDS = [
  { t: "Dobra" },
  { t: "strona" },
  { t: "to" },
  { t: "nie", accent: true },
  { t: "przypadek.", accent: true },
];

export function Manifest() {
  return (
    <section
      data-header-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      {/* Subtelna różowa atmosfera — dryfuje delikatnie na scrollu (czysto dekoracyjne). */}
      <Parallax speed={60} className="pointer-events-none absolute inset-0 z-0">
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 55% at 16% 20%, rgba(207,67,184,0.10) 0%, transparent 60%)",
          }}
        />
      </Parallax>

      <div className="container-koda section-y relative z-10">
        <h2
          className="max-w-[15ch] font-heading font-semibold"
          style={{
            fontSize: "clamp(2.3rem,5.4vw,4.2rem)",
            lineHeight: 1.04,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
          }}
        >
          {HEAD_WORDS.map((w, i) => (
            <Fragment key={i}>
              <motion.span
                data-reveal
                className="inline-block"
                style={{
                  color: w.accent ? "var(--color-pink-bright)" : undefined,
                  willChange: "transform",
                }}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -90px 0px" }}
                transition={{ duration: 0.62, ease: EASE.out, delay: 0.05 + i * 0.075 }}
              >
                {w.t}
              </motion.span>
              {i < HEAD_WORDS.length - 1 ? " " : null}
            </Fragment>
          ))}
        </h2>

        <FadeUp inView delay={0.14} className="mt-8">
          <p
            className="max-w-[58ch]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.1rem,1.5vw,1.4rem)",
              lineHeight: 1.55,
              color: "var(--color-ink-muted)",
            }}
          >
            O wyniku nie decyduje to, co ładne na pierwszy rzut oka, tylko to, czego nie widać:
            szybkość, czytelna droga do kontaktu i struktura, którą rozumie i klient, i Google. Każdą
            stronę projektujemy wokół jednego celu — i pod ten cel dobieramy układ, treść i kod.
          </p>
        </FadeUp>
      </div>
    </section>
  );
}
