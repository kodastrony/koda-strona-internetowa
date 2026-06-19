"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useTierProfile } from "@/lib/device-tier";
import { introHasPlayed } from "@/lib/intro-state";
import { INTRO_DURATION } from "@/lib/motion";

/* ══════════════════════════════════════════════════════════════════════════
   HorizonBackdropLazy — tier-bramkowany ORAZ PRELADOWANY wrapper na
   HorizonBackdrop (świt nad planetą = tło sekcji Statement, sam dół home).

   PO CO TIER-GATE: horizon.tsx statycznie importuje SectionStage → @react-three/
   fiber + drei. Bez bramki three trafiałby do grafu na KAŻDYM urządzeniu. Na
   low/static komponent zwraca null → import() nie startuje → chunk three NIE
   jest pobierany.

   ★ PRELOAD (zamiast viewport-gate): świt MA BYĆ GOTOWY zanim user zjedzie do
   sekcji (życzenie — nie ma „pojawiać się” dopiero po wejściu). Dlatego montujemy
   GO WCZEŚNIE, nie czekając na scroll. Żeby ciężki chunk three.js NIE konkurował
   z intro „dwóch linii” na pierwszym wejściu home, czekamy do KOŃCA intro
   (INTRO_DURATION); na powrocie SPA (intro już zagrane) montujemy OD RAZU. Tak
   czy siak born-ramp (1.6 s) odgrywa się NA GÓRZE strony, więc po zjechaniu do
   sekcji świt jest już w pełni „urodzony” (jaśnieje dalej scrollem = uProg).
   Reaktywnie znika przy downgrade tieru.
   ══════════════════════════════════════════════════════════════════════════ */

const HorizonInner = dynamic(
  () => import("@/components/scene3d/scenes/horizon").then((m) => m.HorizonBackdrop),
  { ssr: false }
);

export function HorizonBackdropLazy() {
  const horizon = useTierProfile().horizon;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!horizon || mounted) return;
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
  }, [horizon, mounted]);

  if (!horizon) return null;
  // SectionStage renderuje absolute inset-0, więc wypełnia tę samą `relative` sekcję.
  return <div className="absolute inset-0">{mounted && <HorizonInner />}</div>;
}
