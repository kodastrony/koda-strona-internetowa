"use client";

/* ══════════════════════════════════════════════════════════════════════════
   scene3d/lib — wspólny fundament silnika 3D hero strony głównej.

   Wspólne kawałki GLSL (simplex, dithering), paleta marki w przestrzeni three
   i drobne hooki (wskaźnik myszy, jakość urządzenia).

   Zasady wydajności (research 2026-06-10, patrz pamięć projektu):
   - szum liczony WYŁĄCZNIE na GPU (zero per-frame pracy na CPU),
   - dithering na ciemnych gradientach (banding na #0b0b0d),
   - mysz/scroll czytane w useFrame z refów — nigdy przez setState.
   ══════════════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef } from "react";

/* ── Paleta marki (lustro tokenów globals.css w hexach three) ─────────────
   Dodatkowe stopnie ciemne (plum/deepRose) trzymają hue ~335 przy niskiej
   luminancji — sceny gasną W markę, nie w szarość. */
export const BRAND = {
  bg: "#0b0b0d",
  bgDeep: "#070709",
  pink: "#cf43b8",
  pinkBright: "#ff5ec8",
  pinkLighter: "#fe83c6",
  magenta: "#c44ad0",
  violet: "#9a63ef",
  indigo: "#6478f0",
  plumDeep: "#521648",
  plum: "#471440",
  deepRose: "#270d20",
  warmWhite: "#fff3fa",
  ink: "#f5f5f7",
  kodaGray: "#1c1c1c",
} as const;

/* ── GLSL: simplex noise 3D (Ashima Arts / Stefan Gustavson, MIT) ─────────
   Kanoniczna implementacja używana wszędzie (drei/lamina/maxime heckel). */
export const GLSL_SIMPLEX_3D = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

/* ── GLSL: dithering — zabija banding 8-bitowych ciemnych gradientów ──────
   Interleaved gradient noise (Jimenez) — ładniejszy od white noise, darmowy. */
export const GLSL_DITHER = /* glsl */ `
float ign(vec2 xy) {
  return fract(52.9829189 * fract(dot(xy, vec2(0.06711056, 0.00583715))));
}
vec3 kodaDither(vec3 color, vec2 fragCoord) {
  return color + (ign(fragCoord) - 0.5) * (1.5 / 255.0);
}
`;

/* ── Deterministyczny PRNG (mulberry32) ──────────────────────────────────
   Geometrie proceduralne budujemy z USTALONEGO ziarna: render jest czystą
   funkcją wejść (zgodność z react-hooks/purity), a scena wygląda IDENTYCZNIE
   przy każdym wejściu — łatwiej porównywać warianty i robić screenshoty. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ── Jakość urządzenia (raz, przy montażu) ────────────────────────────────
   "low" = telefon/tablet/coarse pointer/mało RAM → mniejsze liczniki,
   niższe rozdzielczości buforów. Świadomie prosta heurystyka. */
export type Quality = "low" | "high";

export function useDeviceQuality(): Quality {
  return useMemo<Quality>(() => {
    if (typeof window === "undefined") return "high";
    // Wąski ekran = mobile; coarse pointer liczy się tylko razem z małym oknem
    // (laptopy dotykowe / przeglądarki tnące deviceMemory dawały fałszywe "low").
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 768;
    return small || (coarse && window.innerWidth < 1024) ? "low" : "high";
  }, []);
}

/* ── Wskaźnik (mysz) — znormalizowany do [-1, 1], czytany w useFrame ────── */
export interface PointerRef {
  x: number;
  y: number;
}

export function usePointerRef(enabled: boolean) {
  const ref = useRef<PointerRef>({ x: 0, y: 0 });
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      ref.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      ref.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled]);
  return ref;
}

/* Uwaga: scrollY sceny czytają BEZPOŚREDNIO w useFrame (window.scrollY) —
   listener 'scroll' nie jest dostarczany w ukrytych kartach (drive-mode),
   a bezpośredni odczyt jest zawsze aktualny i darmowy. */

/* ── Font logo (Syne) dla rysowania na canvas 2D ──────────────────────────
   next/font hashuje family name — czytamy WYLICZONĄ rodzinę z proby DOM
   zamiast zgadywać. Zwraca string gotowy do ctx.font. */
export async function resolveLogoFontFamily(): Promise<string> {
  const probe = document.createElement("span");
  probe.style.fontFamily = "var(--font-logo, Syne, sans-serif)";
  probe.style.position = "absolute";
  probe.style.visibility = "hidden";
  probe.textContent = "K";
  document.body.appendChild(probe);
  const family = getComputedStyle(probe).fontFamily || "Syne, sans-serif";
  probe.remove();
  try {
    await document.fonts.load(`800 200px ${family}`);
    await document.fonts.ready;
  } catch {
    /* noop — fallback glify i tak się narysują */
  }
  return family;
}
