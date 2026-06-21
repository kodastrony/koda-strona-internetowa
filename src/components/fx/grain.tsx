"use client";

/* ── Grain — globalna warstwa szumu (jeden „filmowy" materiał) ─────────────
   Czysty div, styl w globals.css (.koda-grain). Fixed nad treścią sekcji (z 50),
   pod paskiem scrolla/intro/menu/headerem/kursorem. Ditheruje banding ciemnych
   gradientów i skleja sekcje w jeden świat.

   NA KAŻDYM tierze (redesign 2026-06-21): to STATYCZNA tekstura (jeden malunek,
   bez blendu, bez animacji). Jej treść nigdy się nie zmienia, więc przy scrollu jest
   PRZESUWANA, a nie rasteryzowana od nowa; `.koda-grain` ma w globals.css
   `transform: translateZ(0)` → własna warstwa kompozytora (nie wpada w repaint
   scrubującej kanwy pod spodem). Brak grainu na słabym sprzęcie nic nie dawał, a
   różnicował teksturę między urządzeniami. (Stary koszt „blend alfa co klatkę"
   dotyczył wersji z mix-blend — tej już nie ma.) */
export function Grain() {
  return <div aria-hidden="true" className="koda-grain" />;
}
