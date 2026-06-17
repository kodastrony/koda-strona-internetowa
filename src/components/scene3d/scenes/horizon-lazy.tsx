"use client";

import dynamic from "next/dynamic";
import { useTierProfile } from "@/lib/device-tier";

/* ══════════════════════════════════════════════════════════════════════════
   HorizonBackdropLazy — leniwy, tier-bramkowany wrapper na HorizonBackdrop.

   PO CO: horizon.tsx statycznie importuje SectionStage → @react-three/fiber +
   drei. Gdyby Statement importował HorizonBackdrop wprost, three trafiałby do
   grafu strony głównej na KAŻDYM urządzeniu (Statement jest na home). Tu gate
   tieru stoi PRZED dynamic import(): na low/static komponent zwraca null →
   import() nie startuje → chunk three NIE jest pobierany. medium/high → świt
   ładuje się leniwie (jest na dole strony). Reaktywnie znika przy downgrade.
   Statement i tak ma własne gradienty CSS, więc bez canvasu wygląda dobrze.
   ══════════════════════════════════════════════════════════════════════════ */

const HorizonInner = dynamic(
  () => import("@/components/scene3d/scenes/horizon").then((m) => m.HorizonBackdrop),
  { ssr: false }
);

export function HorizonBackdropLazy() {
  // Hook wołany bezwarunkowo; potem wczesny return. low/static → null → import()
  // nie startuje. SSR/hydracja = "high" (profile.horizon=true) → spójne z serwerem.
  if (!useTierProfile().horizon) return null;
  return <HorizonInner />;
}
