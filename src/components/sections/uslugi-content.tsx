"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp, Parallax } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";
import { PhoneLink } from "@/components/ui/phone-link";
import { VideoShowcase } from "@/components/ui/video-showcase";
import { CONTACT } from "@/lib/constants";
import { SERVICES, type Service } from "@/lib/services-data";

/* ════════════════════════════════════════════════════════════════════════════
   /uslugi v3 — „USŁUGI POKAZANE PRACĄ" (2026-08-26, po dwóch korektach Natana).

   Diagnozy poprzednich podejść: v1 = białe karty + ściany tekstu (slop);
   v2 = hasła-giganty w akordeonie (nie wiadomo, co jest czym; treść schowana).

   v3: cztery sekcje wprost na kanwie (zero pudełek), każda NAZWANA po ludzku
   (H2 = nazwa usługi → nawigowalność), z całą ofertą WIDOCZNĄ bez klikania
   (linia wyniku + chipy 2–4 słowa + dowód), a „wow" robi PRAWDZIWA praca:
   • Projektowanie → pływający stos zrzutów realnych projektów (parallax,
     hover prostuje) · • Strony 2D/3D → żywe wideo animacji (VideoShowcase)
   • SEO → odliczające się REALNE wyniki tej strony (100/100, CLS 0,00)
   • Opieka → realizacja + pulsujący badge „Odpowiadamy w 24 h".
   Naprzemienne strony, hue-poświata per usługa. Wycena/Proces bez zmian.
   ══════════════════════════════════════════════════════════════════════════ */

/* „Pełny" tick: rysujący się ptaszek w wypełnionym różowym kółku (wzór Natana
   2026-08-26). Kaskada zapala się po wejściu w widok. */
function CheckBadge({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span
      aria-hidden="true"
      className="mt-[1px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: "rgba(207, 67, 184, 0.11)" }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <motion.path
          d="M3 8.5L6.5 12L13 4.5"
          stroke="var(--color-accent)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE.out, delay }}
        />
      </svg>
    </span>
  );
}

/* Renderer podświetleń w tickach: „**fraza**" → RÓŻOWY semibold (highlight —
   życzenie Natana; #b32a9d na porcelanie = 5,6:1, AA). Reszta ink-muted. */
function Emph({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold" style={{ color: "var(--color-accent)" }}>
            {p}
          </strong>
        ) : (
          p
        )
      )}
    </>
  );
}

/* Odliczanie do wartości przy wejściu w widok (SEO-wyniki). rAF + ease-out,
   reduced-motion → od razu wartość końcowa. */
function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return; // reduce: render niżej pokazuje od razu wartość końcową
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4); // quart-out
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  const shown = reduce ? to : val;
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown.toFixed(decimals).replace(".", ",")}
    </span>
  );
}

/* ── Wizual 1 (Projektowanie): makieta-wireframe, która SIĘ SKŁADA ──────────
   Stylizowane okno przeglądarki z szkieletem projektu: bloki wjeżdżają
   kaskadą przy scrollu (jak makieta nabierająca kształtu), CTA pulsuje różem.
   Czysty CSS/DOM — zero zdjęć, w tokenach marki. */
function WireBlock({
  delay,
  className,
  style,
  children,
}: {
  delay: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  return (
    <FadeUp inView delay={delay} y={14} duration={0.5} className={className}>
      <div className="h-full w-full" style={style}>
        {children}
      </div>
    </FadeUp>
  );
}

function WireframeVisual() {
  const bone: React.CSSProperties = {
    backgroundColor: "rgba(36, 27, 43, 0.07)",
    borderRadius: 8,
  };
  return (
    <Parallax speed={14}>
      <div
        aria-hidden="true"
        className="relative overflow-hidden"
        style={{
          border: "1px solid var(--color-line)",
          borderRadius: 18,
          background: "var(--color-surface-1)",
          boxShadow: "var(--shadow-card-hover)",
        }}
      >
        {/* Pasek przeglądarki */}
        <div
          className="flex items-center gap-2 px-5"
          style={{ height: 44, borderBottom: "1px solid var(--color-line)" }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: "rgba(36,27,43,0.12)" }}
            />
          ))}
          <span
            className="ml-3 hidden h-5 flex-1 rounded-full sm:block"
            style={{ backgroundColor: "rgba(36,27,43,0.05)", maxWidth: 280 }}
          />
        </div>

        {/* Szkielet projektu — składa się kaskadą */}
        <div className="grid grid-cols-6 gap-3 p-5 sm:gap-4 sm:p-7">
          {/* nav */}
          <WireBlock delay={0.05} className="col-span-2">
            <div style={{ ...bone, height: 14, width: "70%" }} />
          </WireBlock>
          <WireBlock delay={0.1} className="col-span-4">
            <div className="flex justify-end gap-2.5">
              {[44, 52, 40].map((w, i) => (
                <div key={i} style={{ ...bone, height: 12, width: w }} />
              ))}
              <div
                style={{ height: 12, width: 62, borderRadius: 999, backgroundColor: "rgba(179,42,157,0.25)" }}
              />
            </div>
          </WireBlock>
          {/* hero */}
          <WireBlock delay={0.18} className="col-span-6 sm:col-span-4">
            <div style={{ ...bone, height: 26, width: "88%" }} />
            <div className="mt-2.5" style={{ ...bone, height: 26, width: "62%" }} />
            <div className="mt-4" style={{ ...bone, height: 11, width: "78%", opacity: 0.7 }} />
            <div className="mt-2" style={{ ...bone, height: 11, width: "64%", opacity: 0.7 }} />
            {/* CTA — pulsuje różem (highlight ścieżki do kontaktu) */}
            <div
              className="koda-pulse mt-5"
              style={{
                height: 34,
                width: 132,
                borderRadius: 999,
                backgroundColor: "var(--color-accent)",
                opacity: 0.9,
              }}
            />
          </WireBlock>
          <WireBlock delay={0.26} className="col-span-6 sm:col-span-2">
            <div style={{ ...bone, height: "100%", minHeight: 120, borderRadius: 12 }} />
          </WireBlock>
          {/* trzy kafle */}
          {[0.34, 0.4, 0.46].map((d, i) => (
            <WireBlock key={i} delay={d} className="col-span-2">
              <div style={{ ...bone, height: 54, borderRadius: 10 }} />
              <div className="mt-2" style={{ ...bone, height: 9, width: "80%", opacity: 0.7 }} />
              <div className="mt-1.5" style={{ ...bone, height: 9, width: "55%", opacity: 0.7 }} />
            </WireBlock>
          ))}
        </div>
      </div>
    </Parallax>
  );
}

/* ── Wizual 3 (SEO): zegary jak z SEO-checkera — realne wyniki tej strony ──
   Pierścienie w stylu Lighthouse/PageSpeed (SVG, stroke rysuje się przy
   scrollu, liczba odlicza). Docelowo Natan podmieni na żywe widgety
   checkerów — ten sam slot. */
function Gauge({ score, label, delay }: { score: number; label: string; delay: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const R = 52;
  const C = 2 * Math.PI * R;
  const target = C * (1 - score / 100);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 128, height: 128 }}>
        <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
          <circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke="rgba(36,27,43,0.08)"
            strokeWidth="9"
          />
          <circle
            ref={ref}
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={inView ? target : C}
            transform="rotate(-90 64 64)"
            style={{
              transition: reduce
                ? "none"
                : `stroke-dashoffset 1.2s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
            }}
          />
        </svg>
        <div
          className="absolute inset-0 grid place-items-center font-heading font-extrabold"
          style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--color-ink)" }}
        >
          <CountUp to={score} />
        </div>
      </div>
      <div
        className="text-center font-heading font-bold uppercase"
        style={{ fontSize: "10.5px", letterSpacing: "0.14em", color: "var(--color-ink-muted)" }}
      >
        {label}
      </div>
    </div>
  );
}

function ScoreStrip() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8 md:justify-start">
        <Gauge score={100} label="Lighthouse SEO" delay={0} />
        <Gauge score={100} label="Dostępność" delay={0.12} />
        <Gauge score={96} label="Best Practices" delay={0.24} />
      </div>
      <p className="mt-6 font-body" style={{ fontSize: "0.9rem", color: "var(--color-ink-faint)" }}>
        Wyniki tej strony — Google Lighthouse, sierpień 2026.
      </p>
    </div>
  );
}

/* ── Wizual 4 (Opieka): czat „jak z reklamy" — ZAPĘTLONA scenka ────────────
   Klient pisze (kropki) → wiadomość wskakuje → KODA pisze → odpowiedź →
   „Ekstra, dzięki!" → ❤️ reakcja → pauza → płynny reset i od nowa. Sterowane maszynką
   kroków (setTimeout) startującą po wejściu w widok; reduced-motion →
   statyczna pełna rozmowa, bez pętli. Tylko bąbelki — zero dodatkowych
   tekstów (życzenie Natana). */
// delay = czas spędzony W danym stanie, zanim przejdziemy do kolejnego.
// Stan 7 = ❤️ reakcja KODY + „hold" całej rozmowy, stan 0 = pusto (oddech
// przed kolejną pętlą; to też stan startowy — dlatego krótki). Tempo celowo
// reklamowe: cała scenka ~6 s (korekta Natana — wolniejsza wersja „pusta").
const CHAT_FLOW: Record<number, { next: number; delay: number }> = {
  0: { next: 1, delay: 350 }, // pusto → klient zaczyna pisać
  1: { next: 2, delay: 600 }, // klient pisze…
  2: { next: 3, delay: 550 }, // pytanie na ekranie
  3: { next: 4, delay: 700 }, // KODA pisze…
  4: { next: 5, delay: 650 }, // odpowiedź na ekranie
  5: { next: 6, delay: 500 }, // klient pisze…
  6: { next: 7, delay: 450 }, // „dzięki" wskoczyło
  7: { next: 0, delay: 2300 }, // ❤️ pop + hold całości → reset
};

function TypingDots({ onPink = false }: { onPink?: boolean }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="koda-typing-dot inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: onPink ? "rgba(255,255,255,0.9)" : "rgba(36,27,43,0.45)" }}
        />
      ))}
    </span>
  );
}

function ChatBubble({
  side,
  visible,
  typing,
  reaction,
  children,
}: {
  side: "left" | "right";
  visible: boolean;
  typing?: boolean;
  /** ❤️ reakcja KODY doczepiona do rogu bąbla (pop, gdy true). */
  reaction?: boolean;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const pink = side === "right";
  // Stan „schowany": spory zsuw + skala + lekki przechył od rogu nadawcy
  // + blur — wejście sprężyną z odbiciem daje „eksplozywny" pop jak
  // w reklamach komunikatorów. Wyjście (reset pętli) = szybki zjazd bez
  // sprężyny, żeby nie ciągnąć resetu.
  const hidden = reduce
    ? { opacity: 0, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" }
    : { opacity: 0, y: 22, scale: 0.7, rotate: pink ? 5 : -5, filter: "blur(6px)" };
  const shown = { opacity: 1, y: 0, scale: 1, rotate: 0, filter: "blur(0px)" };
  return (
    <div className={pink ? "flex justify-end" : "flex justify-start"}>
      <motion.div
        // Kropki „pisze…" montują się w trakcie pętli — initial=hidden,
        // żeby też strzelały sprężyną, nie pojawiały się „na sucho".
        initial={reduce ? false : hidden}
        animate={visible ? shown : hidden}
        transition={
          reduce
            ? { duration: 0 }
            : visible
              ? {
                  type: "spring",
                  duration: 0.44,
                  bounce: 0.44,
                  // opacity/blur bez sprężyny (odbicie na nich = artefakty).
                  opacity: { duration: 0.14, ease: "easeOut" },
                  filter: { duration: 0.2, ease: "easeOut" },
                }
              : { duration: 0.16, ease: EASE.out }
        }
        className="font-body relative"
        style={{
          fontSize: "1.02rem",
          lineHeight: 1.5,
          padding: typing ? "15px 18px" : "14px 19px",
          maxWidth: "32ch",
          backgroundColor: pink ? "#b32a9d" : "var(--color-surface-1)",
          border: pink ? "none" : "1px solid var(--color-line)",
          borderRadius: pink ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
          color: pink ? "#ffffff" : "var(--color-ink)",
          boxShadow: pink
            ? "0 18px 40px -16px rgba(179,42,157,0.6)"
            : "var(--shadow-card-hover)",
          transformOrigin: pink ? "bottom right" : "bottom left",
        }}
      >
        {children}
        {reaction !== undefined && (
          <motion.span
            initial={false}
            animate={
              reaction
                ? { opacity: 1, scale: 1, rotate: 0 }
                : { opacity: 0, scale: reduce ? 1 : 0.3, rotate: reduce ? 0 : -30 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : reaction
                  ? { type: "spring", duration: 0.5, bounce: 0.6, opacity: { duration: 0.1 } }
                  : { duration: 0.12, ease: EASE.out }
            }
            className="absolute flex items-center justify-center"
            style={{
              right: -12,
              bottom: -14,
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "var(--color-surface-1)",
              border: "1px solid var(--color-line)",
              boxShadow: "var(--shadow-card-hover)",
              fontSize: 15,
            }}
          >
            ❤️
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}

function CareChatVisual() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: false, margin: "-15% 0px -15% 0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return; // statyczna pełna rozmowa
    if (!inView) return; // pauza poza ekranem (oszczędza baterię)
    const cur = CHAT_FLOW[step] ?? CHAT_FLOW[0];
    const t = setTimeout(() => setStep(cur.next), cur.delay);
    return () => clearTimeout(t);
  }, [step, inView, reduce]);

  // reduced-motion: wszystko widoczne, bez kropek i bez pętli.
  const show = (n: number) => (reduce ? true : step >= n);
  const typingLeft1 = !reduce && step === 1;
  const typingRight = !reduce && step === 3;
  const typingLeft2 = !reduce && step === 5;

  return (
    <Parallax speed={14}>
      <div ref={wrapRef} aria-hidden="true" className="flex flex-col gap-4 md:px-8">
        {/* 1: klient pisze… / wiadomość */}
        {typingLeft1 ? (
          <ChatBubble side="left" visible typing>
            <TypingDots />
          </ChatBubble>
        ) : (
          <ChatBubble side="left" visible={show(2)}>
            Dodacie nam zakładkę z nową usługą i podepniecie cennik PDF?
          </ChatBubble>
        )}

        {/* 2: KODA pisze… / odpowiedź */}
        {typingRight ? (
          <ChatBubble side="right" visible typing>
            <TypingDots onPink />
          </ChatBubble>
        ) : (
          <ChatBubble side="right" visible={show(4)}>
            Jasne, już się robi. Podeślemy podgląd do akceptacji. 👍
          </ChatBubble>
        )}

        {/* 3: klient pisze… / domknięcie (+ ❤️ reakcja KODY w holdzie) */}
        {typingLeft2 ? (
          <ChatBubble side="left" visible typing>
            <TypingDots />
          </ChatBubble>
        ) : (
          <ChatBubble side="left" visible={show(6)} reaction={show(7)}>
            Ekstra, dzięki! 🙌
          </ChatBubble>
        )}
      </div>
    </Parallax>
  );
}

/* ── Sekcja usługi: tekst (nazwa → wynik → chipy → dowód) + wizual ── */
function ServiceSection({ s, index }: { s: Service; index: number }) {
  const reversed = index % 2 === 1;
  const visual =
    s.id === "projektowanie" ? (
      <WireframeVisual />
    ) : s.id === "strony" ? (
      <VideoShowcase
        src="/realizacje/rikoszet.mp4"
        poster="/realizacje/rikoszet-poster.webp"
        rgb="207,67,184"
        label="RIKOSZET — nagranie animacji strony 3D zbudowanej przez KODA"
      />
    ) : s.id === "optymalizacja" ? (
      <ScoreStrip />
    ) : (
      <CareChatVisual />
    );

  return (
    <section
      id={s.id}
      data-header-theme="dark"
      data-canvas="base"
      className="relative scroll-mt-24"
    >
      {/* Poświata sekcji w hue usługi — po stronie wizualu, wtapia się w kanwę */}
      <GlowField
        hue={s.hue}
        x={reversed ? 12 : 88}
        y={40}
        strength={0.55}
        drift
        driftDuration={29 + index * 3}
        edgeFade="vertical"
        className="inset-x-0 z-0"
        style={{ top: "-8%", height: "90%" }}
      />

      <div
        className="container-koda relative z-10 grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-14"
        style={{
          borderTop: "1px solid var(--color-line)",
          paddingTop: "clamp(52px, 6.5vw, 104px)",
          paddingBottom: "clamp(52px, 6.5vw, 104px)",
        }}
      >
        {/* Tekst — TYLKO numer, nazwa i 6 ticków (doszlif Natana: bez dodatkowych
            linii i przekierowań; konkret niosą ticki). */}
        <div className={reversed ? "md:order-2 md:col-span-5" : "md:col-span-5"}>
          <FadeUp inView>
            <span
              className="font-heading font-bold"
              style={{ fontSize: "0.95rem", letterSpacing: "0.02em", color: "var(--color-accent)" }}
            >
              {s.n}
            </span>
          </FadeUp>
          <FadeUp inView delay={0.05}>
            <h2
              className="mt-2 font-heading font-semibold"
              style={{
                fontSize: "clamp(1.9rem, 3.4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--color-ink)",
                textWrap: "balance",
              }}
            >
              {s.title}
            </h2>
          </FadeUp>
          <FadeUp inView delay={0.12}>
            <ul className="mt-8 flex flex-col gap-[18px]" role="list">
              {s.points.map((p, idx) => (
                <li
                  key={p}
                  className="flex items-start gap-3.5 font-body"
                  style={{ fontSize: "1.02rem", lineHeight: 1.5, color: "var(--color-ink-muted)" }}
                >
                  <CheckBadge delay={idx * 0.08} />
                  <span className="pt-[1px]" style={{ fontSize: "1.05rem" }}>
                    <Emph text={p} />
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>

        {/* Wizual — prawdziwa praca zamiast opisu */}
        <div className={reversed ? "md:order-1 md:col-span-7" : "md:col-span-7"}>
          <FadeUp inView delay={0.1} y={36} duration={0.7}>
            {visual}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function UslugiContent() {
  return (
    <>
      {SERVICES.map((s, i) => (
        <ServiceSection key={s.id} s={s} index={i} />
      ))}

      {/* Jedna cicha linia akcji pod usługami */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div
          className="container-koda flex flex-wrap items-center gap-x-7 gap-y-4"
          style={{ paddingBottom: "clamp(56px, 7vw, 100px)" }}
        >
          <Magnetic strength={0.35}>
            <PillLink
              href="/kontakt"
              bg="#b32a9d"
              border="#b32a9d"
              className="text-white hover:text-white hover:shadow-[0_18px_44px_-12px_rgba(207,67,184,0.55)]"
            >
              Bezpłatna wycena
            </PillLink>
          </Magnetic>
          <PhoneLink
            className="inline-flex min-h-[44px] items-center font-heading text-[1.02rem] font-bold transition-colors duration-300 hover:text-pink"
            style={{ color: "var(--color-ink)" }}
            label={`lub zadzwoń: ${CONTACT.phone}`}
          />
        </div>
      </section>

      {/* ── Wycena — uczciwa rama ceny bez cennika ── */}
      <section data-header-theme="dark" className="relative">
        <div
          className="container-koda grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-12"
          style={{
            borderTop: "1px solid var(--color-line)",
            paddingTop: "clamp(48px,6vw,96px)",
            paddingBottom: "clamp(60px,8vw,120px)",
          }}
        >
          <div className="md:col-span-5">
            <FadeUp inView>
              <span className="label-koda mb-5 block">Wycena</span>
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
                Ile kosztuje strona?
              </h2>
            </FadeUp>
          </div>
          <div className="md:col-span-7">
            <FadeUp inView delay={0.1}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                  maxWidth: "56ch",
                }}
              >
                Na polskim rynku strona dla firmy kosztuje najczęściej od 3 000 do 15 000 zł netto
                — dokładna kwota zależy od zakresu: liczby podstron, treści, integracji i terminu.
                Dlatego nie podajemy cen z sufitu — opisz nam krótko projekt, a wrócimy z konkretną
                kwotą. Bezpłatnie i bez zobowiązań.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.16}>
              <p
                className="mt-5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink)",
                  maxWidth: "56ch",
                }}
              >
                Kreator i gotowy szablon są tanie na start, ale wyglądają jak tysiąc innych stron i
                trudno je rozwijać. U nas dostajesz coś innego: kod pisany pod Twój konkretny
                biznes, bezpośredni kontakt z osobami, które go tworzą, i zakres ustalony w umowie.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.22}>
              <Link
                href="/cennik"
                className="mt-6 inline-flex font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                style={{ color: "var(--color-ink)" }}
              >
                Zobacz pełny cennik i co wpływa na cenę →
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Process — "Jak pracujemy" ── */}
      <section data-header-theme="dark" data-canvas="process" className="relative">
        {/* Tło = PageCanvas (indygowy hold „process", jak na home). Indygowe
            światło wystaje ponad sekcję — świeci przez szew w górę. */}
        <GlowField
          hue={273}
          x={10}
          y={26}
          strength={0.6}
          drift
          driftDuration={31}
          edgeFade="vertical"
          className="inset-x-0 z-0"
          style={{ top: "-18%", height: "80%" }}
        />

        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-5 block">Proces</span>
          </FadeUp>
          <FadeUp inView delay={0.06}>
            <h2 className="text-section-title max-w-[16ch]">Jak pracujemy</h2>
          </FadeUp>

          <ProcessSteps />
        </div>
      </section>
    </>
  );
}
