"use client";

import { useTierProfile } from "@/lib/device-tier";

/* ── Grain — globalna warstwa szumu (jeden „filmowy" materiał) ─────────────
   Czysty div, styl w globals.css (.koda-grain). Fixed nad treścią sekcji (z 50),
   pod paskiem scrolla/intro/menu/headerem/kursorem. Ditheruje banding ciemnych
   gradientów i skleja sekcje w jeden świat.

   Tier low/static: WYŁĄCZONY (profile.grain=false). Pełnoekranowy blend alfa
   co klatkę kompozytora był zbędnym kosztem na słabym iGPU (konkurował z hero);
   ciemne tło ma już teksturę z mgławicy, więc strata wizualna jest pomijalna. */
export function Grain() {
  if (!useTierProfile().grain) return null;
  return <div aria-hidden="true" className="koda-grain" />;
}
