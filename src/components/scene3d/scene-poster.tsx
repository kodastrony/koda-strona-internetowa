import { glowBackground } from "@/components/fx/glow-field";

/* ── Poster awaryjny sceny 3D (brak WebGL / utrata kontekstu) ──────────────
   Statyczny zamiennik canvasu = dwa pola światła marki (CSS), pokazywany gdy
   WebGL nie wstanie. Używany przez hero (Hero3D) i akcenty sekcji. */
export function ScenePoster({ hue }: { hue: number }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <div
        className="absolute inset-0"
        style={{ backgroundImage: glowBackground(hue, 64, 56, 1.15) }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: glowBackground(300, 18, 18, 0.6) }}
      />
    </div>
  );
}
