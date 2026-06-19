"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";
import { introHasPlayed, markIntroPlayed } from "@/lib/intro-state";
import { useThemeValue } from "@/lib/theme";
import { KODA_FILL, KODA_FILL_LIGHT } from "./hero-config";
import { HeroBackground } from "./hero-background";
import { HeroIntro } from "./hero-intro";
import { KodaColumnLetters, KODA_LEFT } from "./koda-letters";

/* ══════════════════════════════════════════════════════════════════════════
   Hero — hero strony głównej (design „baunfire 2D"). Łączy: tło (HeroBackground
   = aurora), pionową kolumnę „KODA" (wspólny element z intro → bezszwowy handoff),
   treść (H1/opis/CTA) i overlay intro (HeroIntro „dwóch linii"). Aurora u dołu
   rozpływa się w globalny PageCanvas (płynne przejście do następnej sekcji).

   ★ WEJŚCIE STEROWANE ZDARZENIEM: treść (i trwała kolumna KODA na ≥lg) wjeżdża
   dopiero gdy `revealed` = true — czyli PO zakończeniu intro (onDone). Dzięki temu
   na <lg wyśrodkowany napis KODA znika ZANIM pojawi się treść (zero nakładania,
   niezależnie od czasu ładowania fontów), a handoff na ≥lg jest piksel-w-piksel.

   ★ ZERO BŁYSKU WEJŚCIA: overlay intro renderuje się już w SSR/pierwszej klatce
   (introActive startuje true, gdy intro jeszcze nie grało w tym załadowaniu),
   więc PIERWSZY namalowany kadr to ciemna kurtyna intro — nie ma migawki „gotowego
   hero", która potem przeskakuje na animację. Treść (i trwała kolumna KODA na ≥lg)
   wjeżdża dopiero gdy `revealed` = true (po onDone intro).

   INTRO PRZY KAŻDYM ODŚWIEŻENIU (flaga modułowa intro-state, NIE sessionStorage) —
   nowe wejście/F5 = znów wita; powrót w obrębie sesji SPA = treść od razu, bez
   powtórki. reduced-motion → bez intro (kurtyna ukryta CSS-em), treść natychmiast.
   Hero ADAPTUJE się do motywu (☾ ciemna aurora / ☀ świetlista porcelana) — tło,
   litery KODA, intro i tokeny mają warianty jasne (useThemeValue).
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Treść hero (H1/opis/CTA — tekst bez zmian). Wjeżdża, gdy `play` = true. ── */
function HeroCopy({ play }: { play: boolean }) {
  // H1 reveal respektuje reduced-motion (spójnie z FadeUp) — motion/react NIE jest
  // łapane globalną regułą CSS reduced-motion, więc gate'ujemy tu.
  const reduce = useReducedMotion();
  return (
    <div data-logo-hide-anchor className="w-full lg:w-[54%] lg:max-w-[620px]">
      <h1
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          // min(6vw, 9vh) — na NISKICH ekranach (landscape telefonu) H1 nie urośnie
          // do szerokości i nie wypchnie CTA pod zagięcie; na normalnych ekranach
          // 9vh nie wiąże, więc rozmiar bez zmian.
          fontSize: "clamp(2.5rem, min(6vw, 9vh), 5.25rem)",
          lineHeight: 1.03,
          letterSpacing: "-0.03em",
          color: "var(--color-ink)",
          textWrap: "balance",
        }}
      >
        {[
          <>Strona internetowa, która</>,
          <>
            <span style={{ color: "var(--color-accent)" }}>przynosi klientów</span>
            <span style={{ color: "var(--color-ink)" }}>.</span>
          </>,
        ].map((line, i) => (
          <span
            key={i}
            style={{
              display: "block",
              overflow: "hidden",
              paddingBottom: "0.12em",
              marginBottom: "-0.12em",
            }}
          >
            <motion.span
              data-reveal
              style={{ display: "block", willChange: "transform" }}
              initial={{ y: reduce ? "0%" : "112%" }}
              animate={{ y: play ? "0%" : "112%" }}
              transition={
                reduce
                  ? { duration: 0 }
                  : { duration: 0.9, ease: EASE.expo, delay: play ? i * 0.1 : 0 }
              }
            >
              {line}
            </motion.span>
          </span>
        ))}
      </h1>

      <FadeUp play={play} delay={0.12} duration={0.6} ease={EASE.expo} y={22} className="mt-8">
        <p
          className="leading-relaxed"
          style={{
            fontSize: "clamp(0.95rem, 1.15vw, 1.15rem)",
            color: "var(--color-ink-muted)",
            maxWidth: "46ch",
          }}
        >
          Projektujemy i kodujemy strony internetowe dla firm w Polsce. Od zera, pod konkretny cel.
        </p>
      </FadeUp>

      <FadeUp
        play={play}
        delay={0.24}
        duration={0.6}
        ease={EASE.back}
        y={16}
        scale={0.9}
        className="mt-10"
      >
        <Magnetic strength={0.4}>
          <PillLink
            href="/kontakt"
            bg="#cf43b8"
            border="#cf43b8"
            className="text-white hover:text-white hover:shadow-[0_18px_44px_-12px_rgba(207,67,184,0.55)]"
          >
            Bezpłatna wycena
          </PillLink>
        </Magnetic>
      </FadeUp>

      <FadeUp play={play} delay={0.36} duration={0.6} ease={EASE.expo} y={10} className="mt-5">
        <p className="text-[13px]" style={{ color: "var(--color-ink-faint)" }}>
          Odpowiadamy w 24 h · Bez zobowiązań
        </p>
      </FadeUp>
    </div>
  );
}

/* ── Wskaźnik SCROLL, tylko ≥lg. Pojawia się z treścią. Kolory adaptują się do
      motywu (atrament na porcelanie / biel na ciemnej aurorze). ── */
function ScrollHint({ play, light }: { play: boolean; light: boolean }) {
  const reduce = useReducedMotion();
  const track = light ? "rgba(22,16,31,0.12)" : "rgba(255,255,255,0.08)";
  const beam = light
    ? "linear-gradient(to bottom, transparent, rgba(22,16,31,0.34), transparent)"
    : "linear-gradient(to bottom, transparent, rgba(255,255,255,0.32), transparent)";
  const labelColor = light ? "rgba(22,16,31,0.32)" : "rgba(255,255,255,0.2)";
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: play ? 1 : 0 }}
      transition={{ duration: 0.7, delay: play ? 0.6 : 0 }}
      aria-hidden="true"
      className="absolute right-[clamp(20px,3vw,44px)] bottom-10 hidden flex-col items-center gap-3 lg:flex"
      style={{ zIndex: 10 }}
    >
      <div className="relative h-14 w-px overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundColor: track }} />
        {!reduce && (
          <motion.div
            className="absolute inset-x-0 top-0 h-6"
            style={{ background: beam }}
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "linear", repeatDelay: 0.6 }}
          />
        )}
      </div>
      <span
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "0.35em",
          textTransform: "uppercase" as const,
          color: labelColor,
          writingMode: "vertical-rl" as const,
        }}
      >
        SCROLL
      </span>
    </motion.div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const light = useThemeValue() === "light";
  // ★ Stan startuje na podstawie flagi modułowej (introHasPlayed), IDENTYCZNEJ na
  // serwerze i w pierwszej klatce klienta (na świeżym ładowaniu = false) → zero
  // niezgodności hydracji. Na świeżym wejściu: introActive=true (kurtyna w SSR =
  // brak błysku), revealed=false. Na powrocie SPA (flaga już true): introActive=
  // false, revealed=true (treść od razu, bez kurtyny). reduced-motion korygowany
  // w efekcie (overlay i tak ukryty CSS-em — patrz globals.css).
  const [introActive, setIntroActive] = useState(() => !introHasPlayed());
  const [revealed, setRevealed] = useState(() => introHasPlayed());

  // reduced-motion / brak intro → treść natychmiast (klient-only; SSR renderuje
  // stan świeżego wejścia, efekt go koryguje po pierwszym malowaniu).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (reduce) {
      markIntroPlayed();
      setIntroActive(false);
      setRevealed(true);
    }
  }, [reduce]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Koniec/pominięcie intro: oznacz odegrane (Header czyta tę flagę), zdejmij
  // overlay i ODSŁOŃ treść + trwałą kolumnę (≥lg) w TYM SAMYM commicie → handoff
  // piksel-w-piksel, brak nakładania na <lg.
  const onIntroDone = () => {
    markIntroPlayed();
    setIntroActive(false);
    setRevealed(true);
  };

  // Parallax kolumny KODA (handoff 1:1 z intro) i zanik treści przy zjeździe.
  const { scrollY } = useScroll();
  const kodaY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -240]);
  const copyOpacity = useTransform(scrollY, [0, 260, 660], [1, 1, 0]);
  const copyY = useTransform(scrollY, [0, 660], [0, -84]);

  return (
    <section
      // Hero ADAPTUJE się do motywu: ciemna aurora (☾) albo świetlista porcelana
      // (☀). Wymusza komplet tokenów ink/accent pod swoje tło, więc treść jest
      // czytelna, a header dostaje właściwy motyw (białe logo na ciemnym / atrament
      // na jasnym; mapowanie dark→light robi i tak useHeaderTheme).
      data-header-theme={light ? "light" : "dark"}
      data-canvas="hero"
      className="relative flex min-h-svh flex-col overflow-hidden"
      style={
        (light
          ? {
              "--color-ink": "#16101f",
              "--color-ink-muted": "#4e4459",
              "--color-ink-faint": "#6f6379",
              "--color-accent": "#b32a9d",
              "--color-pink": "#b32a9d",
            }
          : {
              "--color-ink": "#f5f5f7",
              "--color-ink-muted": "#b2b2ba",
              "--color-ink-faint": "#94949d",
              "--color-accent": "#cf43b8",
              "--color-pink": "#cf43b8",
            }) as React.CSSProperties
      }
    >
      {/* ── TŁO hero (aurora) z miękką MASKĄ u dołu. Maska wygasza TYLKO TŁO do
            przezroczystości w dolnej części ekranu → odsłania GLOBALNY PageCanvas
            (fixed -z-10), którego kolor scrubuje scrollem od holdu hero (#0b0b0d ≈
            baza aurory) do holdu Usług (#16111f). Hero ROZPŁYWA SIĘ w „jeden świat"
            jak na produkcji — stopniowy świt na całym viewporcie, nie twardy szew.
            ★ MASKA OBEJMUJE TYLKO TŁO — NIE litery KODA (inaczej dolna „A" gasłaby
            po intro). Kolumna KODA jest OSOBNO (niżej, niemaskowana). ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          maskImage: "linear-gradient(to bottom, #000 58%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to bottom, #000 58%, transparent 100%)",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
      >
        <HeroBackground light={light} />
      </div>

      {/* ── ≥lg: WIELKA, off-center pionowa kolumna KODA — TRWAŁA (backdrop).
            Ukryta (opacity 0) dopóki intro nie zrobi handoffu (`revealed`) — wtedy
            ujawnia się w tym samym commicie, w którym znika overlay (zero podwójnego
            malowania). „A" startuje pod ekranem i odsłania się przy scrollu (parallax).
            Na <lg jej NIE ma — pionowy napis żyje tylko w intro (wyśrodkowany). */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 z-0 hidden select-none lg:block"
        style={{
          left: KODA_LEFT,
          width: "max-content",
          y: kodaY,
          // Widoczna domyślnie (też bez JS); ukryta TYLKO w trakcie intro (overlay
          // maluje identyczną kolumnę → zero podwójnego malowania), wraca przy handoffie.
          opacity: introActive ? 0 : 1,
          willChange: "transform",
        }}
      >
        <KodaColumnLetters fill={light ? KODA_FILL_LIGHT : KODA_FILL} />
      </motion.div>

      <ScrollHint play={revealed} light={light} />

      {/* ── Treść (z-hero-content). W trakcie intro NIEKLIKALNA (klik = „pomiń").
            Wjeżdża przez `play={revealed}` — czyli PO intro. ── */}
      <motion.div
        className={`container-koda relative z-[var(--z-hero-content)] flex flex-1 flex-col pt-[88px] md:pt-[130px] [@media(max-height:600px)]:pt-[60px] ${
          introActive ? "pointer-events-none" : ""
        }`}
        style={reduce ? undefined : { opacity: copyOpacity, y: copyY }}
      >
        {/* Rozmieszczenie treści w pionie:
            • telefon (<md): justify-start — treść od razu pod headerem (czytelna
              natychmiast, bez spychania pod zagięcie),
            • tablet/„między" (≥md, <lg) i desktop (≥lg): justify-center — bez
              kolumny KODA (ukryta <lg) treść WYŚRODKOWANA w pionie, więc nie wisi
              w lewym-górnym rogu nad pustą aurorą (to wyglądało niezbalansowanie). */}
        <div
          className="flex flex-1 flex-col justify-start md:justify-center"
          style={{ paddingBottom: "clamp(50px, 7vh, 90px)" }}
        >
          <HeroCopy play={revealed} />
        </div>
      </motion.div>

      {/* ── Overlay intro (z-intro) — montowany tylko gdy intro faktycznie gra. ── */}
      {introActive && <HeroIntro onDone={onIntroDone} light={light} />}
    </section>
  );
}
