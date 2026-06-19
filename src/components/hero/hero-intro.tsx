"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { cssBezier, EASE } from "@/lib/motion";
import {
  INTRO_COVER,
  INTRO_COVER_LIGHT,
  INTRO_KODA,
  INTRO_KODA_LIGHT,
  KODA_FILL,
  KODA_FILL_LIGHT,
} from "./hero-config";
import { KodaColumnLetters, KODA_LEFT, KODA_FONT_CENTER } from "./koda-letters";

/* ══════════════════════════════════════════════════════════════════════════
   HeroIntro — intro „dwóch linii" (baunfire DNA), odporne na każdy rozmiar ekranu.

   DWA TRYBY (próg = lg, 1024px):
   • ≥lg „kolumna" (MODE A): WIELKA, off-center pionowa kolumna KODA (jak w hero).
     Po intro overlay znika NATYCHMIAST → odsłania identyczną, TRWAŁĄ kolumnę hero
     (handoff piksel-w-piksel; litera „A" odsłania się dalej scrollem).
   • <lg „środek" (MODE B): pionowa kolumna KODA WYŚRODKOWANA i dopasowana do ekranu
     (KODA_FONT_CENTER). Po intro KODA ZNIKA (fade overlayu) — hero NIE ma trwałego
     napisu na małych ekranach; treść wjeżdża PO zniknięciu (zero nakładania).

   Sekwencja (oba tryby):
     Faza 1 (~1.0s): pionowe KODA zapełnia się literą po literze (kolor intro) na kurtynie.
     Faza 3 (0.7s):  DWIE LINIE krzyżujące się W ŚRODKU LITER — linia A (kurtyna)
        scaleX(1→0) origin:right odsłania TŁO; linia B (litery) clip inset(right 0→100%)
        odsłania DOCELOWE wypełnienie KODA. Krzyżowanie geometryczne: m = środek
        kolumny mierzony w runtime (≈0.5 wyśrodkowanej, ~0.65 off-center).
     Faza 4: MODE A → handoff NATYCHMIASTOWY (overlay znika, trwała kolumna zostaje);
             MODE B → overlay (z wyśrodkowanym KODA) zanika opacity 1→0, potem znika.

   Animacje przez WAAPI (element.animate) — kończą się też w karcie w tle.
   ══════════════════════════════════════════════════════════════════════════ */

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
const QUART_OUT = "cubic-bezier(0.25, 1, 0.5, 1)";

/** Krzywa pozycji linii tła: sześcienna, monotoniczna, przechodzi przez
 *  (0.5, m). lineA(t) = 3c·t·(1−t) + t³, c = (8m−1)/6. */
function coverScaleKeyframes(m: number): Keyframe[] {
  const c = (8 * m - 1) / 6;
  const N = 18;
  const frames: Keyframe[] = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N;
    const lineA = 3 * c * t * (1 - t) + t * t * t; // 0 → 1, =m przy t=0.5
    frames.push({ transform: `scaleX(${Math.max(0, 1 - lineA)})`, offset: t });
  }
  return frames;
}

interface HeroIntroProps {
  /** Wołane po zakończeniu (lub pominięciu) — rodzic zdejmuje overlay. */
  onDone: () => void;
  /** Tryb jasny — porcelanowa kurtyna + jasne wypełnienie KODA. */
  light?: boolean;
}

export function HeroIntro({ onDone, light = false }: HeroIntroProps) {
  const reduce = useReducedMotion();
  const coverColor = light ? INTRO_COVER_LIGHT : INTRO_COVER;
  const finalFill = light ? KODA_FILL_LIGHT : KODA_FILL;

  const overlayRef = useRef<HTMLDivElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  // Dwie kolumny: A = off-center (≥lg), B = wyśrodkowana (<lg). Aktywna wg matchMedia.
  const finalRefA = useRef<HTMLDivElement>(null);
  const pinkRefA = useRef<HTMLDivElement>(null);
  const finalRefB = useRef<HTMLDivElement>(null);
  const pinkRefB = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);
  const animsRef = useRef<Animation[]>([]);

  // Parallax KODA off-center = IDENTYCZNY z hero (scroll podczas intro → handoff 1:1).
  const { scrollY } = useScroll();
  const kodaY = useTransform(scrollY, [0, 600], [0, reduce ? 0 : -240]);

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDone();
  };

  useEffect(() => {
    let cancelled = false;
    const anims = animsRef.current;

    const run = async () => {
      if (reduce) {
        finish();
        return;
      }
      const overlay = overlayRef.current;
      const cover = coverRef.current;
      if (!overlay || !cover) return;

      // Czcionka gotowa → poprawne glify i poprawny pomiar szerokości KODA.
      try {
        await Promise.race([document.fonts.ready, wait(300)]);
      } catch {
        /* noop */
      }
      if (cancelled) return;
      await wait(20); // klatka na namalowanie stanu startowego
      if (cancelled) return;

      const wide = window.matchMedia("(min-width: 1024px)").matches;
      // Aktywna kolumna wg progu (ta druga ma display:none → niewidoczna).
      const pink = wide ? pinkRefA.current : pinkRefB.current;
      const finalEl = wide ? finalRefA.current : finalRefB.current;

      /* ── DEV: ?introhold=cross — zatrzymaj intro w klatce krzyżowania. ─────── */
      if (
        process.env.NODE_ENV !== "production" &&
        pink &&
        finalEl &&
        new URLSearchParams(window.location.search).get("introhold") === "cross"
      ) {
        const r = pink.getBoundingClientRect();
        const m = Math.min(
          0.875,
          Math.max(0.125, (r.left + r.width / 2) / (window.innerWidth || 1))
        );
        pink
          .querySelectorAll<HTMLElement>("[data-pink-letter]")
          .forEach((el) => ((el.style.opacity = "1"), (el.style.transform = "translateY(0%)")));
        finalEl.style.opacity = "1";
        pink.style.clipPath = "inset(0% 50% 0% 0%)";
        cover.style.transform = `scaleX(${(1 - m).toFixed(3)})`;
        return; // trzymaj tę klatkę
      }

      /* ── Faza 1: litery KODA zapełniają się (aktywna kolumna) ─────────────── */
      if (pink) {
        const letters = Array.from(pink.querySelectorAll<HTMLElement>("[data-pink-letter]"));
        const phase1 = letters.map((el, i) =>
          el.animate(
            [
              { opacity: 0, transform: "translateY(50%)" },
              { opacity: 1, transform: "translateY(0%)" },
            ],
            { duration: 700, delay: i * 100, easing: QUART_OUT, fill: "both" }
          )
        );
        anims.push(...phase1);
        await Promise.all(phase1.map((a) => a.finished)).catch(() => {});
        if (cancelled) return;
        await wait(70);
        if (cancelled) return;
      }

      /* ── Faza 3: dwie linie krzyżujące się w środku liter ───────────────────
            (oba tryby — różni się tylko geometria m: ~0.5 środek / ~0.65 off-center). */
      const lineAnims: Animation[] = [];

      if (pink && finalEl) {
        const r = pink.getBoundingClientRect();
        const vw = window.innerWidth || 1;
        const m = Math.min(0.875, Math.max(0.125, (r.left + r.width / 2) / vw));

        finalEl.style.opacity = "1"; // baza docelowa pod różem (odsłaniana clipem)

        lineAnims.push(
          cover.animate(coverScaleKeyframes(m), {
            duration: 700,
            easing: "linear",
            fill: "forwards",
          })
        );
        lineAnims.push(
          pink.animate([{ clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 100% 0% 0%)" }], {
            duration: 700,
            easing: "linear",
            fill: "forwards",
          })
        );
      } else {
        // Brak liter (skrajnie wcześnie / awaria) — samo odsłonięcie tła linią L→P.
        await wait(120);
        if (cancelled) return;
        lineAnims.push(
          cover.animate([{ transform: "scaleX(1)" }, { transform: "scaleX(0)" }], {
            duration: 820,
            easing: cssBezier(EASE.crossing),
            fill: "forwards",
          })
        );
      }

      anims.push(...lineAnims);
      await Promise.all(lineAnims.map((a) => a.finished)).catch(() => {});
      if (cancelled) return;

      overlay.style.pointerEvents = "none";

      if (wide) {
        /* ── MODE A — handoff NATYCHMIASTOWY. Kolumna KODA w hero jest identyczna
              z finalRefA i ujawnia się w TYM SAMYM commicie, w którym overlay znika
              → zamiana niewidoczna, napis zostaje DOKŁADNIE w kolorze z linii.
              ⚠️ NIE wracać do fade overlayu: finalKoda jest półprzezroczysty (rgba),
              fade nad widoczną kolumną hero = podwójne malowanie → „przyciemnienie". */
        finish();
      } else {
        /* ── MODE B — KODA ZNIKA: hero <lg NIE ma trwałego napisu, więc overlay
              (z wyśrodkowanym KODA) może bezpiecznie zaniknąć (nic pod spodem do
              podwójnego malowania). Treść hero wjeżdża PO tym (mobilny `base`)
              → napis NIE nakłada się z treścią podczas znikania. */
        const fade = overlay.animate([{ opacity: 1 }, { opacity: 0 }], {
          duration: 450,
          easing: cssBezier(EASE.primary),
          fill: "forwards",
        });
        anims.push(fade);
        await fade.finished.catch(() => {});
        if (cancelled) return;
        finish();
      }
    };

    run();

    const holdMode =
      process.env.NODE_ENV !== "production" &&
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("introhold") === "cross";
    const safety = holdMode ? undefined : window.setTimeout(finish, 5000);
    return () => {
      cancelled = true;
      if (safety) window.clearTimeout(safety);
      anims.forEach((a) => a.cancel());
      animsRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  const skip = () => {
    animsRef.current.forEach((a) => a.cancel());
    finish();
  };

  // Klawiatura: Escape pomija intro (klik w tło/przycisk to dodatkowe skróty).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const introFill = { kind: "color", value: light ? INTRO_KODA_LIGHT : INTRO_KODA } as const;
  const startHidden = () => ({ opacity: 0, transform: "translateY(50%)" }) as const;

  return (
    <div
      ref={overlayRef}
      data-intro
      className="absolute top-0 left-0 z-[var(--z-intro)] h-svh w-full overflow-hidden"
      onClick={skip}
      style={{ cursor: "pointer" }}
    >
      {/* ── Linia A: „kurtyna" (cover). scaleX(1→0) origin:right = odsłania L→P
              PRAWDZIWE tło hero pod overlayem (transform = kompozytor, zero repaintu). ── */}
      <div
        ref={coverRef}
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          // ★ Kolor kurtyny z CSS-zmiennej (ustawianej atrybutem html[data-koda-light]
          // PRZEZ inline-skrypt PRZED malowaniem) — NIE z propa `light` (ten przy
          // hydracji jest chwilowo "dark" → kurtyna błyskała czarnym i dopiero po
          // sekundzie bielała). Teraz PIERWSZA klatka ma poprawny motyw. `coverColor`
          // zostaje jako fallback (gdyby zmiennej nie było).
          backgroundColor: `var(--intro-cover, ${coverColor})`,
          transformOrigin: "right center",
          willChange: "transform",
        }}
      />

      {/* ── MODE A (≥lg): WIELKA off-center kolumna KODA. Parallax = hero (handoff 1:1). ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 hidden select-none lg:block"
        style={{ left: KODA_LEFT, width: "max-content", y: kodaY }}
      >
        <div ref={finalRefA} className="absolute top-0 left-0" style={{ opacity: 0 }}>
          <KodaColumnLetters fill={finalFill} />
        </div>
        <div ref={pinkRefA} className="absolute top-0 left-0" style={{ willChange: "clip-path" }}>
          <KodaColumnLetters
            fill={introFill}
            letterAttr="data-pink-letter"
            letterProps={startHidden}
          />
        </div>
      </motion.div>

      {/* ── MODE B (<lg): WYŚRODKOWANA, dopasowana do ekranu pionowa kolumna KODA.
              Po intro znika (fade overlayu) — brak trwałego napisu na małych ekranach. ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center select-none lg:hidden"
      >
        <div className="relative">
          <div
            ref={finalRefB}
            className="absolute inset-0 flex flex-col items-center"
            style={{ opacity: 0 }}
          >
            <KodaColumnLetters fill={finalFill} fontSize={KODA_FONT_CENTER} />
          </div>
          <div
            ref={pinkRefB}
            className="flex flex-col items-center"
            style={{ willChange: "clip-path" }}
          >
            <KodaColumnLetters
              fill={introFill}
              fontSize={KODA_FONT_CENTER}
              letterAttr="data-pink-letter"
              letterProps={startHidden}
            />
          </div>
        </div>
      </div>

      {/* Bez widocznego przycisku „Pomiń" (usunięty na życzenie). Pominięcie nadal
          działa niewidocznie: klik gdziekolwiek w overlay (onClick={skip}) oraz
          Escape — afordancje a11y bez elementu UI. */}
    </div>
  );
}
