"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimate, stagger, useScroll, useTransform } from "motion/react";
import { EASE } from "@/lib/motion";
import { introHasPlayed, markIntroPlayed } from "@/lib/intro-state";

/* ════════════════════════════════════════════════════════════════════
   KODA — intro entrance animation
   ────────────────────────────────────────────────────────────────────
   Białe tło → różowa pionowa KODA ZAPEŁNIA SIĘ litera po literze (każda
   wjeżdża z dołu z opóźnieniem = niesymetrycznie, płynnie) → DWIE LINIE
   (1s) zamalowują scenę i spotykają się w środku KODA → końcowy kadr
   (ciemne tło + KODA #1c1c1c) = TŁO strony tytułowej.

   PŁYNNOŚĆ = priorytet → animujemy wyłącznie własności kompozytowane na
   GPU: transform (translateY / scaleX), opacity. Jedyny clip-path jest na
   MAŁYM elemencie (różowe litery, Phase 3).

   ── Phase 1: per-literowy reveal (slow-in/out + overlapping action) ──
   Każda litera: opacity 0→1 + translateY 50%→0, easeOutQuart (gładkie
   wyhamowanie, BEZ overshootu). Stagger 0.14s (K→A) → "zapełnia się"
   niesymetrycznie. Krótki dystans = wolny, spokojny ruch (nie smuga).

   ── Architektura warstw (brak różowego fringe) ──────────────────────
   BAZA = KODA #1c1c1c (pełna, BEZ clipa) = finalny kadr; RÓŻ na górze
   zdejmowany clipem P→L (Phase 3) → spod spodu wychodzi czysta baza.
   Glify Syne wystają poza kolumnę → RÓŻ ma width:max-content (clip nie
   tnie liter). Baza dzieli pozycję z hero (right:19%) → handoff 1:1.

   ── Dwie linie (Phase 3, 1.0s), spotkanie w środku liter (~73%) ─────
   Linia A (tło L→R): scaleX 0→1, EASE.crossing (f(0.5)≈0.735).
   Linia B (tekst P→L): róż zdejmowany clip inset(0 0%→100% 0 0), linear.
   ════════════════════════════════════════════════════════════════════ */

const PINK      = "var(--color-pink)";  // #cf43b8
const DARK_BG   = "var(--color-dark)";  // #0f0f0f — końcowe tło (= hero)
const KODA_GRAY = "#1c1c1c";            // kolor KODA w hero.tsx też

// easeOutQuart — gładkie, spokojne wyhamowanie reveala liter (bez overshootu)
const REVEAL: [number, number, number, number] = [0.25, 1, 0.5, 1];

const LETTERS = ["K", "O", "D", "A"] as const;

// Styl jednej litery — IDENTYCZNY w obu warstwach i w hero (bezszwowy handoff)
const letterStyle: React.CSSProperties = {
  fontFamily:    "var(--font-heading)",
  fontWeight:    800,
  fontSize:      "clamp(160px, 21vw, 340px)",
  letterSpacing: "-0.04em",
  lineHeight:    0.9,
  color:         "inherit",
};

// Lewa krawędź = ta sama co right:19% + width:clamp w hero → róż i baza mają
// IDENTYCZNĄ lewą krawędź glifów.
const KODA_LEFT = "calc(81% - clamp(160px, 21vw, 340px))";

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────────────

export function IntroAnimation() {
  const [scope, animate] = useAnimate();

  const bgRef   = useRef<HTMLDivElement>(null); // Linia A — ciemny panel (scaleX)
  const baseRef = useRef<HTMLDivElement>(null); // BAZA — KODA #1c1c1c (pełna)
  const pinkRef = useRef<HTMLDivElement>(null); // RÓŻ — litery (reveal + clip P→L)

  const [done, setDone] = useState(false);

  // ── Intro KODA podąża za scrollem JAK hero (shared element / staging) ──
  // Overlay jest fixed, więc KODA musi SAMA odtworzyć ruch scrolla (-v) PLUS
  // parallax hero (-0.4·min(v,600)). Dzięki temu: (1) podczas intro da się
  // scrollować i widać różowe A wjeżdżające z dołu, (2) handoff do hero jest
  // bez "teleportu" — pozycja KODA zgadza się przy każdej wartości scrolla.
  // Overlay jest ABSOLUTE (scrolluje z page'em, NIE fixed), więc nie zasłania sekcji
  // poniżej. KODA potrzebuje już tylko parallaxu hero (-0.4·min(v,600)) — natywny scroll
  // overlay'a robi resztę. Identyczne z hero → handoff 1:1.
  const { scrollY } = useScroll();
  const kodaY = useTransform(scrollY, [0, 600], [0, -240]);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      // Skip (replay-guard po SPA-nawigacji / reduced-motion). Wewnątrz async,
      // NIE w ciele efektu → SSR-safe i bez react-hooks/set-state-in-effect.
      if (
        introHasPlayed() ||
        window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
      ) {
        markIntroPlayed();
        setDone(true);
        return;
      }

      if (!scope.current || !bgRef.current || !baseRef.current || !pinkRef.current) return;

      const bgEl    = bgRef.current!;
      const baseEl  = baseRef.current!;
      const pinkEl  = pinkRef.current!;
      const overlay = scope.current!;

      // ── PHASE 0: czcionka gotowa (poprawne glify od razu) ────────────
      try { await Promise.race([document.fonts.ready, wait(150)]); } catch { /* noop */ }
      if (cancelled) return;
      await wait(30); // jedna klatka — stan początkowy zdąży się namalować
      if (cancelled) return;

      // ── PHASE 1: KODA zapełnia się litera po literze (~1.27s) ────────
      // opacity + translateY, easeOutQuart, stagger 0.14s (K→A).
      await animate(
        "[data-pink-letter]",
        { opacity: [0, 1], y: ["50%", "0%"] },
        { duration: 0.85, ease: REVEAL, delay: stagger(0.14) },
      );
      if (cancelled) return;
      await wait(100); // krótki oddech — widz rejestruje logo
      if (cancelled) return;

      // ── PHASE 3: DWIE LINIE (1.0s), spotkanie w środku KODA ──────────
      // Baza #1c1c1c widoczna (wciąż zakryta różem), róż zdejmowany P→L.
      baseEl.style.opacity = "1";
      await Promise.all([
        animate(bgEl, { scaleX: [0, 1] }, { duration: 0.85, ease: EASE.crossing }),
        animate(
          pinkEl,
          { clipPath: ["inset(0% 0% 0% 0%)", "inset(0% 100% 0% 0%)"] },
          { duration: 0.85, ease: "linear" },
        ),
      ]);
      if (cancelled) return;

      // ── PHASE 4: overlay zanika ⇄ hero/tekst ZACHODZĄ (bez "settle") ──
      // Brak martwej pauzy — fade startuje od razu po liniach, a tekst hero
      // zaczyna się jeszcze przed końcem fade'a (delay < INTRO_DURATION) =
      // ciągłe, płynne przejście jak baunfire.
      overlay.style.pointerEvents = "none";
      await animate(overlay, { opacity: 0 }, { duration: 0.28, ease: EASE.primary });

      markIntroPlayed();
      setDone(true);
    };

    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => { markIntroPlayed(); setDone(true); };
  if (done) return null;

  return (
    <div
      ref={scope}
      data-intro
      className="absolute left-0 top-0 z-[var(--z-intro)] h-svh w-full overflow-hidden"
      onClick={skip}
      style={{ cursor: "pointer" }}
      aria-hidden="true"
    >
      {/* L0 — białe tło (baza sceny) */}
      <div className="absolute inset-0" style={{ backgroundColor: "#ffffff" }} />

      {/* L1 — Linia A: ciemny panel tła, scaleX 0→1 (origin:left) */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundColor: DARK_BG,
          transform:       "scaleX(0)",
          transformOrigin: "left center",
          willChange:      "transform",
        }}
      />

      {/* L2 — BAZA: KODA #1c1c1c (pełna, bez clipa). Pozycja = hero (right:19%).
              Ukryta (opacity 0) do Phase 3; róż ją w pełni zakrywa. */}
      <motion.div
        ref={baseRef}
        className="select-none"
        style={{
          position: "absolute",
          top:      0,
          right:    "19%",
          width:    "clamp(160px, 21vw, 340px)",
          color:    KODA_GRAY,
          opacity:  0,
          pointerEvents: "none",
          y:        kodaY,
          willChange: "transform",
        }}
      >
        {LETTERS.map((l) => <div key={l} style={letterStyle}>{l}</div>)}
      </motion.div>

      {/* L3 — RÓŻ: KODA #cf43b8 — litery zapełniają się (Phase 1), potem
              zdejmowane clipem P→L (Phase 3). width:max-content = clip nie
              tnie liter. */}
      <motion.div
        ref={pinkRef}
        className="select-none"
        style={{
          position:      "absolute",
          top:           0,
          left:          KODA_LEFT,
          width:         "max-content",
          color:         PINK,
          willChange:    "transform, clip-path",
          pointerEvents: "none",
          y:             kodaY,
        }}
      >
        {LETTERS.map((l) => (
          <div
            key={l}
            data-pink-letter
            style={{ ...letterStyle, opacity: 0, transform: "translateY(50%)", willChange: "transform, opacity" }}
          >
            {l}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
