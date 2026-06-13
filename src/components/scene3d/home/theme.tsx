"use client";

/* ══════════════════════════════════════════════════════════════════════════
   home/theme — palety SCEN 3D dla motywu ciemny/jasny.

   Store motywu + przełącznik żyją globalnie w @/lib/theme (re-eksport niżej,
   żeby istniejące importy „../home/theme" działały). Tokeny CSS jasnego
   motywu, stopka-wyspa i pogoda są teraz w globals.css + PageCanvas (jeden
   system dla całej strony). Tu zostają TYLKO palety three.js, których shadery
   nie da się wyrazić zmiennymi CSS.
   ══════════════════════════════════════════════════════════════════════════ */

export type { KodaTheme } from "@/lib/theme";
export { useThemeValue, useKodaTheme } from "@/lib/theme";

/* ── Palety scen 3D ───────────────────────────────────────────────────────
   DARK = dokładnie BRAND (S5 1:1). LIGHT = pastelowa akwarela: mgławica
   miesza porcelanę ku różowo-lawendowym chmurom (shader: gałąź uLight),
   gwiazdy stają się drobinami atramentu (NormalBlending), litery porcelaną
   rzeźbioną szarym cieniem, kałuża dyskowa jaśnieje, cień zostaje szary. */
export interface ScenePalette {
  bg: string;
  pink: string;
  pinkBright: string;
  violet: string;
  indigo: string;
  starWarm: string;
  starCool: string;
  starAlpha: number;
  moteCol: string;
  moteAlpha: number;
  letter: { color: string; metalness: number; roughness: number; env: number };
  rimMul: number;
  keyColor: string;
  keyIntensity: number;
  fillColor: string;
  fillIntensity: number;
  disc: {
    deep: string;
    violet: string;
    pink: string;
    shadowMul: number;
    alphaMul: number;
  };
}

export const SCENE_DARK: ScenePalette = {
  bg: "#0b0b0d",
  pink: "#cf43b8",
  pinkBright: "#ff5ec8",
  violet: "#9a63ef",
  indigo: "#6478f0",
  starWarm: "#fff3fa",
  starCool: "#9a63ef",
  starAlpha: 1,
  moteCol: "#fe83c6",
  moteAlpha: 1,
  letter: { color: "#26262c", metalness: 0.42, roughness: 0.36, env: 1.05 },
  rimMul: 1,
  keyColor: "#fff0f8",
  keyIntensity: 2.5,
  fillColor: "#9a63ef",
  fillIntensity: 0.55,
  disc: { deep: "#270d20", violet: "#9a63ef", pink: "#cf43b8", shadowMul: 1, alphaMul: 1 },
};

export const SCENE_LIGHT: ScenePalette = {
  bg: "#f6f2f7",
  pink: "#eec4e2",
  pinkBright: "#f2aed9",
  violet: "#d9c8ef",
  indigo: "#c9cdf2",
  starWarm: "#a05d92",
  starCool: "#7a6a9e",
  starAlpha: 0.34,
  moteCol: "#c77bb1",
  moteAlpha: 0.5,
  letter: { color: "#efe9f2", metalness: 0.22, roughness: 0.46, env: 1.0 },
  rimMul: 0.45,
  keyColor: "#fff8fc",
  keyIntensity: 2.1,
  fillColor: "#b9c2ff",
  fillIntensity: 0.4,
  disc: { deep: "#cfc2d8", violet: "#ded2ec", pink: "#f2b9dd", shadowMul: 1.25, alphaMul: 0.9 },
};
