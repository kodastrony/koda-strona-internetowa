"use client";

import { glowBackground } from "@/components/fx/glow-field";

/* ── Poster awaryjny sceny 3D (brak WebGL / utrata kontekstu) ──────────────
   Statyczny zamiennik canvasu = dwa pola światła marki (CSS), pokazywany gdy
   WebGL nie wstanie. Używany przez akcenty sekcji i horyzont (context-lost). */
export function ScenePoster({ hue }: { hue: number }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* Subtelne, rozlane pola światła (NIE jasna plama w rogu) — poster ma
          wyglądać jak ciemny kosmos, nie jak jaśniejszy „kwadrat" przy ładowaniu. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: glowBackground(hue, 60, 52, 0.55) }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: glowBackground(300, 22, 22, 0.3) }}
      />
    </div>
  );
}
