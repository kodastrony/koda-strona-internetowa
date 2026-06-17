"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { introHasPlayed, markIntroPlayed } from "@/lib/intro-state";
import type { KodaBus } from "./scenes/cosmos";

/* ══════════════════════════════════════════════════════════════════════════
   Orkiestracja intro 3D — wspólny most scena↔strona (bus + bezpieczniki +
   skip), używany przez hero strony głównej (Hero3D). Koniec intro przychodzi
   z ZEGARA KLATEK sceny (bus.onIntroEnd), wall-clock zostaje bezpiecznikiem.
   ══════════════════════════════════════════════════════════════════════════ */

/* oncePerSession: strona główna gra intro 3D DOKŁADNIE RAZ na sesję (przy
   SPA/F5 scena startuje od razu w spoczynku). */
export function useIntroOrchestra(
  introBase: number,
  opts?: { oncePerSession?: boolean; instant?: boolean }
) {
  const reduce = useReducedMotion();
  const oncePerSession = opts?.oncePerSession ?? false;
  // instant: tier „static" (poster, brak sceny 3D) — treść hero (H1/CTA) ma się
  // pokazać OD RAZU, bez czekania na bus sceny ani 5 s wall-clock safety.
  const instant = opts?.instant ?? false;
  // ⚠ SSR-safe: NIE czytamy sessionStorage podczas renderu (rozjazd hydracji —
  // serwer „intro gra", klient „już grało"). Pierwszy render zawsze = „intro
  // gra" (zgodny z SSR), a decyzję o pominięciu podejmuje efekt PO montażu.
  const [run, setRun] = useState(0);
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const [skipped, setSkipped] = useState(false);

  const bus = useMemo<KodaBus>(
    () => ({
      onReady: () => setReady(true),
      onIntroEnd: () => {
        setIntroDone(true);
        if (oncePerSession) markIntroPlayed();
      },
      skipped: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [run]
  );

  // Once-per-session (po montażu, raz): jeśli intro grało już w tej sesji →
  // natychmiast pomiń (scena 3D doładowuje się asynchronicznie, więc zdąży
  // wstać w spoczynku zanim narysuje pierwszą klatkę). Replay tym nie rusza.
  const didInit = useRef(false);
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    if (instant || (oncePerSession && introHasPlayed())) {
      bus.skipped = true; // mutacja (nie state) — scena 3D (async) czyta od 1. klatki
      // Stany odkładamy do microtaska: poza synchronicznym ciałem efektu
      // (react-hooks/set-state-in-effect), batchowane w jeden render, wciąż
      // przed malowaniem → zero migotania, zero rozjazdu hydracji.
      queueMicrotask(() => {
        setSkipped(true);
        setReady(true);
        setIntroDone(true);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bezpiecznik wall-clock: scena bez WebGL/zabita karta nigdy nie zawoła
  // onReady/onIntroEnd → po budżecie wpuszczamy treść bez intro.
  useEffect(() => {
    if (reduce || introDone) return;
    const safety = setTimeout(
      () => {
        bus.skipped = true;
        setSkipped(true);
        setReady(true);
        setIntroDone(true);
      },
      ready ? 12000 : 5000
    );
    return () => clearTimeout(safety);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, introDone, reduce, run]);

  const skip = () => {
    bus.skipped = true;
    setSkipped(true);
    setIntroDone(true);
    if (oncePerSession) markIntroPlayed();
  };
  const replay = () => {
    window.scrollTo(0, 0);
    setReady(false);
    setIntroDone(false);
    setSkipped(false);
    setRun((r) => r + 1);
  };

  return {
    reduce,
    run,
    bus,
    skip,
    replay,
    introOn: !reduce && !introDone,
    contentReady: reduce || skipped || ready,
    base: reduce || skipped ? 0.15 : introBase,
  };
}

/* Pełnoekranowy „łapacz" pominięcia intro (klik gdziekolwiek). data-intro →
   bez JS chowany (noscript w layout) → nie zasłania CTA. */
export function SkipCatcher({ onSkip }: { onSkip: () => void }) {
  return (
    <div
      aria-hidden="true"
      data-intro
      className="fixed inset-0 z-[150]"
      style={{ cursor: "pointer" }}
      onClick={onSkip}
    >
      <span
        className="absolute right-5 bottom-5 rounded-full px-3.5 py-1.5 font-heading text-[10px] font-bold tracking-[0.2em] uppercase"
        style={{ color: "#ffffff", backgroundColor: "rgba(0,0,0,0.38)" }}
      >
        Pomiń →
      </span>
    </div>
  );
}
