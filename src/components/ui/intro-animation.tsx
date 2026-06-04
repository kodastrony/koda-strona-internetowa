"use client";

import { useEffect, useRef, useState } from "react";
import { useAnimate } from "motion/react";
import { EASE } from "@/lib/motion";

/* ════════════════════════════════════════════════════════════════════
   KODA — intro entrance animation
   ────────────────────────────────────────────────────────────────────
   Białe tło → różowa pionowa KODA wjeżdża z dołu → glow pulse →
   DWIE LINIE (1s) zamalowują scenę i spotykają się w środku KODA →
   końcowy kadr (ciemne tło + KODA #1c1c1c) = TŁO strony tytułowej.

   PŁYNNOŚĆ = priorytet. Dlatego animujemy wyłącznie własności
   kompozytowane na GPU: transform (scaleX / translateY / scale) i
   opacity. Jedyny clip-path jest na MAŁYM elemencie (kolumna KODA).

   ── Dwie linie (Phase 3, 1.0s) ──────────────────────────────────────
   Linia A  (tło, lewa krawędź → prawa krawędź viewportu):
     ciemny panel skalowany `scaleX` 0→1 z origin:left.
     Prawa krawędź panelu = linia. Ease = EASE.crossing (szybko, potem
     zwalnia). f(0.5) ≈ 0.705 → linia jest na 70.5% viewportu w t=0.5s.
   Linia B  (tekst, prawa krawędź KODA → lewa krawędź KODA):
     warstwa KODA #1c1c1c odsłaniana clip-path od prawej do lewej,
     "linear" (stała prędkość). W t=0.5s linia jest w połowie KODA.
   Geometria KODA: prawa krawędź 81% (right:19%), szerokość ~21vw →
     lewa krawędź ~60%, ŚRODEK ~70.5%.
   → Obie linie są na 70.5% w t=0.5s ⇒ spotkanie DOKŁADNIE w środku KODA.

   Easing (z @/lib/motion — jedno źródło prawdy):
     EASE.expo     → Phase 1 (wjazd KODA, energetyczny + miękkie settle)
     EASE.crossing → Phase 3 (linia tła: szybko→wolno)
     EASE.primary  → Phase 4 (zanikanie overlay)
   ════════════════════════════════════════════════════════════════════ */

// CSS variables = te same tokeny co hero i globals.css → bezszwowy handoff
const PINK      = "var(--color-pink)";        // #cf43b8
const DARK_BG   = "var(--color-dark)";        // #0f0f0f — końcowe tło (= hero)
const KODA_GRAY = "#1c1c1c";                  // kolor KODA w hero.tsx też
const PINK_GLOW = "rgba(207, 67, 184, 0.45)"; // #cf43b8 z alpha — bloom

/** Resetuje się przy hard-refresh (F5); trwa przez SPA-nawigację. */
let introPlayedThisLoad = false;

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

// Pozycja kolumny KODA — identyczna z hero.tsx (right:19%, ~21vw)
const KODA_COLUMN: React.CSSProperties = {
  position:      "absolute",
  top:           0,
  right:         "19%",
  width:         "clamp(160px, 21vw, 340px)",
  pointerEvents: "none",
  userSelect:    "none",
};

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

// ─────────────────────────────────────────────────────────────────────

export function IntroAnimation() {
  const [scope, animate] = useAnimate();

  const bgRef   = useRef<HTMLDivElement>(null); // Linia A — ciemny panel (scaleX)
  const pinkRef = useRef<HTMLDivElement>(null); // grupa różowej KODA (wjeżdża)
  const glowRef = useRef<HTMLDivElement>(null); // różowy bloom (opacity + scale)
  const darkRef = useRef<HTMLDivElement>(null); // Linia B — KODA #1c1c1c (clip)

  const [done, setDone] = useState(false);

  useEffect(() => {
    if (introPlayedThisLoad) { setDone(true); return; }

    // Dostępność: użytkownicy z prefers-reduced-motion pomijają intro.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      introPlayedThisLoad = true;
      setDone(true);
      return;
    }

    if (!scope.current || !bgRef.current || !pinkRef.current ||
        !glowRef.current || !darkRef.current) return;

    let cancelled = false;

    const run = async () => {
      const bgEl    = bgRef.current!;
      const pinkEl  = pinkRef.current!;
      const glowEl  = glowRef.current!;
      const darkEl  = darkRef.current!;
      const overlay = scope.current!;

      // ── PHASE 0 (0–50ms): różowa KODA snap poniżej viewportu ──────────
      const startY = window.innerHeight * 1.3;
      animate(pinkEl, { y: startY }, { duration: 0 });
      await wait(50);
      if (cancelled) return;

      // ── PHASE 1 (50–800ms): KODA wjeżdża z dołu (0.75s, EXPO) ─────────
      // Staging: białe tło, jeden focal point. EXPO = energiczny start,
      // miękkie wyhamowanie (slow-out) → wjazd "ląduje" delikatnie.
      await animate(pinkEl, { y: 0 }, { duration: 0.75, ease: EASE.expo });
      if (cancelled) return;
      await wait(100); // oddech — widz rejestruje logo
      if (cancelled) return;

      // ── PHASE 2 (900–1200ms): różowy glow pulse — brand moment ────────
      // Osobny element (radial-gradient) animowany opacity+scale = GPU,
      // zamiast animowanego drop-shadow (drogie repainty co klatkę).
      await animate(
        glowEl,
        { opacity: [0, 1], scale: [0.9, 1.08] },
        { duration: 0.3, ease: "easeOut" },
      );
      if (cancelled) return;
      await wait(180); // pauza przed "puentą" (timing: kontrast napięcia)
      if (cancelled) return;

      // ── PHASE 3 (1380–2380ms): DWIE LINIE (1.0s) ─────────────────────
      // Spotkanie w środku KODA w t=0.5s (≈1880ms absolutnie).
      await Promise.all([
        // Linia A — tło L→R: scaleX 0→1 (origin:left), szybko→wolno.
        animate(bgEl, { scaleX: [0, 1] }, { duration: 1.0, ease: EASE.crossing }),
        // Linia B — tekst R→L: clip odsłania KODA #1c1c1c, stała prędkość.
        animate(
          darkEl,
          { clipPath: ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"] },
          { duration: 1.0, ease: "linear" },
        ),
        // Glow gaśnie zanim tło dotrze do KODA (czysty kadr końcowy).
        animate(glowEl, { opacity: 0 }, { duration: 0.45, ease: "easeOut" }),
      ] as Promise<unknown>[]);
      if (cancelled) return;

      // Warstwa #1c1c1c w pełni pokrywa różową — gasimy róż na wszelki
      // wypadek (sub-pixel), bez ryzyka "znikania liter" (dark już kryje).
      pinkEl.style.opacity = "0";

      await wait(120); // osadzenie — końcowy kadr "oddycha" (suma = 2.5s)
      if (cancelled) return;

      // ── PHASE 4 (2500–2850ms): overlay zanika ⇄ hero wchodzi ──────────
      // Końcowy kadr (ciemne tło + KODA #1c1c1c) jest piksel-w-piksel
      // identyczny z tłem hero → crossfade jest niewidoczny = bezszwowo.
      overlay.style.pointerEvents = "none";
      await animate(overlay, { opacity: 0 }, { duration: 0.35, ease: EASE.primary });

      introPlayedThisLoad = true;
      setDone(true);
    };

    run();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const skip = () => { introPlayedThisLoad = true; setDone(true); };
  if (done) return null;

  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[200]"
      onClick={skip}
      style={{ cursor: "pointer" }}
      aria-hidden="true"
    >
      {/* L0 — białe tło (baza) */}
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

      {/* L2 — różowa KODA (wjeżdża z dołu) + glow bloom za literami */}
      <div ref={pinkRef} className="select-none" style={{ ...KODA_COLUMN, willChange: "transform" }}>
        <div
          ref={glowRef}
          aria-hidden="true"
          style={{
            position:   "absolute",
            inset:      "4% -65%",
            opacity:    0,
            background: `radial-gradient(ellipse 46% 46% at 50% 50%, ${PINK_GLOW} 0%, transparent 70%)`,
            willChange: "opacity, transform",
            pointerEvents: "none",
          }}
        />
        <div style={{ position: "relative", color: PINK }}>
          {LETTERS.map((l) => <div key={l} style={letterStyle}>{l}</div>)}
        </div>
      </div>

      {/* L3 — Linia B: KODA #1c1c1c, clip odsłaniany od prawej do lewej */}
      <div
        ref={darkRef}
        className="select-none"
        style={{
          ...KODA_COLUMN,
          color:      KODA_GRAY,
          clipPath:   "inset(0% 0% 0% 100%)",
          willChange: "clip-path",
        }}
      >
        {LETTERS.map((l) => <div key={l} style={letterStyle}>{l}</div>)}
      </div>
    </div>
  );
}
