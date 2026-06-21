"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTierProfile } from "@/lib/device-tier";
import { introHasPlayed } from "@/lib/intro-state";
import { INTRO_DURATION } from "@/lib/motion";
import { HorizonPoster } from "./horizon-poster";

/* ══════════════════════════════════════════════════════════════════════════
   HorizonBackdropLazy — tier-bramkowany ORAZ PRELADOWANY wrapper na
   HorizonBackdrop (świt nad planetą = tło sekcji Statement, sam dół home).

   PO CO TIER-GATE: horizon.tsx statycznie importuje SectionStage → @react-three/
   fiber + drei. Bez bramki three trafiałby do grafu na KAŻDYM urządzeniu. Gdy
   profil NIE ma webgl (low/static) montujemy CSS-owy świt (HorizonPoster) i NIE
   wołamy import() → chunk three NIE jest pobierany. Świt-WebGL = progresywne
   ulepszenie NAD tym samym look-alike (redesign 2026-06-21): słabe urządzenie
   dostaje TEN SAM ciemny, świecący finał, tylko statyczny.

   ★ PRELOAD (zamiast viewport-gate): świt MA BYĆ GOTOWY zanim user zjedzie do
   sekcji (życzenie — nie ma „pojawiać się” dopiero po wejściu). Dlatego montujemy
   GO WCZEŚNIE, nie czekając na scroll. Żeby ciężki chunk three.js NIE konkurował
   z intro „dwóch linii” na pierwszym wejściu home, czekamy do KOŃCA intro
   (INTRO_DURATION); na powrocie SPA (intro już zagrane) montujemy OD RAZU. Tak
   czy siak born-ramp (1.6 s) odgrywa się NA GÓRZE strony, więc po zjechaniu do
   sekcji świt jest już w pełni „urodzony” (jaśnieje dalej scrollem = uProg).
   Reaktywnie schodzi do CSS-świtu przy downgrade tieru (watchdog).

   ★ CSS-świt leży POD shaderem także na webgl: dopóki chunk three się dociąga,
   sekcja już świeci (zero „pop"); shader maluje się NAD nim półprzezroczyście.
   ══════════════════════════════════════════════════════════════════════════ */

const HorizonInner = dynamic(
  () => import("@/components/scene3d/scenes/horizon").then((m) => m.HorizonBackdrop),
  { ssr: false }
);

export function HorizonBackdropLazy() {
  const webgl = useTierProfile().webgl;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!webgl || mounted) return;
    let cancelled = false;
    // Home pierwsze wejście: poczekaj aż intro się odegra (heavy three.js poza
    // klatkami „dwóch linii”). Powrót SPA / intro już było: montuj od razu.
    const delay = introHasPlayed() ? 0 : INTRO_DURATION * 1000 + 300;
    const t = window.setTimeout(() => {
      if (!cancelled) setMounted(true);
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [webgl, mounted]);

  // Bez WebGL (low/static, downgrade) → sam CSS-świt = ten sam ciemny świecący finał.
  if (!webgl) {
    return (
      <div className="absolute inset-0">
        <HorizonPoster />
      </div>
    );
  }
  // SectionStage renderuje absolute inset-0; CSS-świt leży POD nim do czasu, aż
  // shader się dociągnie i namaluje (zero przerwy w świeceniu).
  return (
    <div className="absolute inset-0">
      <HorizonPoster />
      {mounted && <HorizonInner />}
    </div>
  );
}
