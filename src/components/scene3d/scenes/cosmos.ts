"use client";

import * as THREE from "three";
import { BRAND, GLSL_DITHER, GLSL_SIMPLEX_3D, mulberry32 } from "../lib";
import { KODA_LINE_H, type KodaLetters3D } from "../text3d";

/* ══════════════════════════════════════════════════════════════════════════
   cosmos — wspólny świat „galaxy/kosmos" stron 4 i 5.

   Ewolucja aurory z SA (fbm z domain-warpem w hue marki) w pełny kosmos:
   - MGŁAWICA: opaque quad na CAŁY frustum (pułapka #3 — zero twardych
     krawędzi), baza = BRAND.bg (identyczna z holdem PageCanvas hero →
     scena maluje się NA pogodzie strony, nie obok niej). Pozycje świateł
     uniformami w uv canvasu (uC1 róż-core za kolumną KODA, uC2 fiolet),
     przekątny pas „drogi mlecznej" wiąże kompozycję z kolumną.
   - GWIAZDY: punkty w świecie (2 głębokości w jednym buforze), mrugają
     z sin(t·spd+seed), delikatny parallax ze scrollem (głębia).
   - PYŁ: rzadkie drobiny dryfujące ku górze przy kamerze (skala bliska).

   Sceny montują własne materiały (reduced trzyma własne wartości startowe),
   stąd eksportujemy GLSL + fabryki geometrii + wspólny typ busa intro.
   ══════════════════════════════════════════════════════════════════════════ */

/** Most scena↔strona (jak P1Bus/P3Bus): gotowość zasobów + koniec intro
    Z ZEGARA KLATEK sceny (ukryta karta mrozi rAF i motion RAZEM — timery
    DOM nie; overlay/treść wolno ruszyć dopiero, gdy canvas dogra partyturę). */
export interface KodaBus {
  onReady?: () => void;
  onIntroEnd?: () => void;
  skipped?: boolean;
}

export const COSMOS_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const COSMOS_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uIntro;   // narodziny świata (0→1)
uniform float uScroll;  // scroll w vh (0..1.4) — kosmos schodzi za treść
uniform vec2 uMouse;    // damped wskaźnik [-1,1]
uniform float uAspect;  // szer/wys CANVASU (155svh!) — dystanse w uv
uniform vec2 uC1;       // róż-core (uv canvasu, za kolumną KODA)
uniform vec2 uC2;       // fioletowe halo
uniform float uC1Str;   // mnożnik core (intro-sweep podbija przelot)
uniform vec3 uBg;
uniform vec3 uPink;
uniform vec3 uPinkBright;
uniform vec3 uViolet;
uniform vec3 uIndigo;
uniform float uLight; // 0 = ciemna formuła (S5 1:1), 1 = jasna akwarela
${GLSL_SIMPLEX_3D}
${GLSL_DITHER}

float fbm(vec2 p, float t) {
  float v = 0.0;
  float a = 0.55;
  for (int i = 0; i < 4; i++) {
    v += a * snoise(vec3(p, t));
    p = p * 2.04 + vec2(7.3, 3.1);
    a *= 0.5;
  }
  return v;
}

void main() {
  // Współrzędne z poprawką aspektu (dystanse w jednostkach wysokości canvasu).
  vec2 av = (vUv - 0.5) * vec2(uAspect, 1.0);
  vec2 p = vUv * vec2(1.75, 1.0);
  float t = uTime * 0.04;

  // Domain-warp jak w SA — mgławica „oddycha", nie płynie jak dym z maszyny.
  vec2 q = vec2(fbm(p, t), fbm(p + vec2(5.2, 1.3), t + 11.0));
  float f = fbm(p + 1.55 * q, t * 1.3);
  float f2 = fbm(p * 1.6 - 0.7 * q + vec2(0.0, 9.4), t * 0.7 + 4.0);

  // Pas „drogi mlecznej": przekątna wstęga (↘ przez kolumnę KODA), detal fbm.
  float band = dot(av, normalize(vec2(0.42, 1.0)));
  float bandW = exp(-band * band * 7.5);
  float bandTex = 0.45 + 0.55 * smoothstep(-0.35, 0.8, f2);

  // Światła: core za kolumną (uC1 — wędruje w intro!), halo, ambient u góry.
  // Szerokie, okrągłe spadki → światło ROZLEWA się po kadrze (jeden gładki
  // kosmos), zamiast tworzyć skoncentrowaną jaśniejszą plamę/„kwadrat" w rogu.
  vec2 d1 = (vUv - uC1) * vec2(uAspect, 1.0);
  vec2 d2 = (vUv - uC2) * vec2(uAspect, 1.0);
  float w1 = exp(-2.2 * length(d1 * vec2(1.18, 1.0)));
  float w2 = exp(-2.9 * length(d2 * vec2(1.18, 1.0)));
  float w3 = exp(-2.6 * length((vUv - vec2(0.14, 0.9)) * vec2(uAspect, 1.4)));

  float scrollDim = 1.0 - smoothstep(0.5, 1.35, uScroll) * 0.72;

  float s1 = 0.3 + 0.58 * smoothstep(-0.25, 0.85, f);
  float s2 = smoothstep(0.42, 0.95, f);
  float s3 = 0.28 + 0.62 * smoothstep(-0.2, 0.9, f2);
  float sf = smoothstep(0.2, 0.95, f);

  // CIEMNA formuła (addytywna). Niższe piki rdzenia (różowy hotspot za kolumną)
  // + szersze spadki = łuna rozlana, bez ostrego „lit vs dark".
  vec3 colD = uBg;
  colD += uViolet * bandW * bandTex * 0.115;
  colD += uIndigo * bandW * sf * 0.06;
  colD += uPink * w1 * s1 * 0.44 * uC1Str;
  colD += uPinkBright * w1 * s2 * 0.17 * uC1Str;
  colD += uViolet * w2 * s3 * 0.32;
  colD += uIndigo * w3 * 0.12;

  // JASNA formuła (akwarela — porcelana barwiona KU pastelom, nie ku bieli).
  vec3 colL = uBg;
  colL = mix(colL, uViolet, bandW * bandTex * 0.42);
  colL = mix(colL, uIndigo, bandW * sf * 0.2);
  colL = mix(colL, uPink, clamp(w1 * s1 * 0.62 * uC1Str, 0.0, 1.0));
  colL = mix(colL, uPinkBright, clamp(w1 * s2 * 0.3 * uC1Str, 0.0, 1.0));
  colL = mix(colL, uViolet, clamp(w2 * s3 * 0.4, 0.0, 1.0));
  colL = mix(colL, uIndigo, w3 * 0.14);

  // Winieta wiąże kadr; scroll ściąga światło w stronę treści (gaśnie godnie).
  // Szeroka, łagodna (bez płaskiego plateau w środku) → przejście światło→ciemność
  // jest stopniowe na CAŁEJ szerokości, więc nie ma wyczuwalnej krawędzi plamy.
  float vig = smoothstep(1.32, 0.16, length(av * vec2(0.76, 1.0)));
  float vis = vig * uIntro * scrollDim;

  // ── PageCanvas = JEDYNE tło ────────────────────────────────────────────────
  // Mgławica NIE maluje już nieprzezroczystego prostokąta (to dawało „kwadrat"
  // jaśniejszy/ciemniejszy od reszty + twardy szew hero↔strona, bo scena renderuje
  // w LINEAR, a CSS w sRGB → baza się rozjeżdżała). Teraz maluje TYLKO to, co
  // DODAJE do tła, więc canvas jest przezroczysty tam, gdzie nic się nie dzieje,
  // a bazę (#0b0b0d / porcelana) daje PageCanvas — jeden świat. uBg MUSI równać
  // się holdowi PageCanvas hero (globals.css --color-canvas-base = SCENE_DARK.bg).
  //
  // Tryb mieszania przełącza motyw (home-totem) RAZEM z material.premultipliedAlpha:
  //  • DARK  = premultiplied + AdditiveBlending → blendFunc(ONE,ONE): rgb DODAJE
  //    PEŁNE światło (jasność jak dawniej), alfa = pokrycie (puste pole → 0).
  //  • LIGHT = straight + NormalBlending: rgb = barwa, alfa = pokrycie →
  //    wynik = lerp(papier, barwa, cov).
  vec3 outRGB;
  float a;
  if (uLight > 0.5) {
    // LIGHT — akwarela barwi papier; pokrycie = jak mocno barwa odbiega od porcelany.
    float cov = clamp(length(colL - uBg) * 3.2, 0.0, 1.0) * vis;
    outRGB = colL;
    a = cov;
  } else {
    // DARK — czyste światło mgławicy ponad bazą: colD = uBg + dodatki.
    vec3 lightD = max(colD - uBg, 0.0) * vis;
    outRGB = lightD;
    a = clamp(max(lightD.r, max(lightD.g, lightD.b)), 0.0, 1.0);
  }

  gl_FragColor = vec4(kodaDither(outRGB, gl_FragCoord.xy), a);
}
`;

/* ── Gwiazdy: jeden bufor, dwie głębokości (aSeed.w ∈ {0,1} = warstwa) ───── */
export const STAR_VERT = /* glsl */ `
attribute vec4 aSeed; // xyz: pozycja znorm. [-1,1]; w: warstwa (0 daleko, 1 bliżej)
uniform float uTime;
uniform float uAlpha;
uniform float uPx;
uniform float uScroll;
uniform vec2 uSpread; // pół-rozmiar pola gwiazd (world)
varying float vA;
varying float vTint;
void main() {
  float layer = aSeed.w;
  vec3 pos = vec3(
    aSeed.x * uSpread.x,
    aSeed.y * uSpread.y + uScroll * (0.5 + 0.9 * layer),
    -6.2 + layer * 2.2
  );
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float tw = 0.55 + 0.45 * sin(uTime * (0.5 + 1.4 * fract(aSeed.z * 13.7)) + aSeed.x * 41.0);
  // Garść gwiazd „hero" — wyraźniejsze punkty niosą odczyt „kosmos".
  float big = step(0.91, fract(aSeed.z * 5.13));
  gl_PointSize = clamp(
    uPx * (0.9 + 1.5 * layer) * (1.0 + big * 1.1) * (10.0 / -mv.z) * (0.75 + 0.5 * tw),
    1.0,
    4.4
  );
  vA = uAlpha * tw * (0.45 + 0.65 * layer) * (1.0 + big * 0.5);
  vTint = fract(aSeed.z * 7.31);
}
`;

export const STAR_FRAG = /* glsl */ `
precision highp float;
varying float vA;
varying float vTint;
uniform vec3 uWarm;
uniform vec3 uCool;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float disc = smoothstep(0.25, 0.03, dot(c, c));
  vec3 col = mix(uWarm, uCool, smoothstep(0.35, 0.85, vTint));
  gl_FragColor = vec4(col, min(disc * vA, 1.0));
}
`;

/* ── Pył przy kamerze (rzadki, dryfuje ku górze — głębia bliska) ─────────── */
export const MOTE_VERT = /* glsl */ `
attribute vec3 aSeed;
uniform float uTime;
uniform float uAlpha;
uniform float uPx;
varying float vA;
void main() {
  vec3 pos = vec3(aSeed.x * 9.0, 0.0, aSeed.z * 3.0 - 0.5);
  pos.y = mod(aSeed.y * 6.0 + uTime * (0.07 + 0.05 * fract(aSeed.x * 7.31)), 6.0) - 2.6;
  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uPx * (34.0 / -mv.z), 1.0, 2.6);
  vA = uAlpha * smoothstep(3.2, 1.4, abs(pos.y)) * (0.3 + 0.7 * fract(aSeed.z * 9.7));
}
`;

export const MOTE_FRAG = /* glsl */ `
precision highp float;
varying float vA;
uniform vec3 uCol;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float disc = smoothstep(0.25, 0.04, dot(c, c));
  gl_FragColor = vec4(uCol, disc * vA * 0.4);
}
`;

export function makeStarGeometry(count: number, seed: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const seeds = new Float32Array(count * 4);
  const rng = mulberry32(seed);
  for (let i = 0; i < count; i++) {
    seeds[i * 4] = rng() * 2 - 1;
    seeds[i * 4 + 1] = rng() * 2 - 1;
    seeds[i * 4 + 2] = rng();
    seeds[i * 4 + 3] = rng() < 0.62 ? 0 : 1; // większość daleko, garść bliżej
  }
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
  return geo;
}

/* ── Wspólny układ liter KODA (strony 4 i 5) ──────────────────────────────
   Desktop (wide): pionowa kolumna w slocie DOM-owej kolumny hero
   (right:19%, fontPx = clamp(160, 21vw, 340), baseline0 0.78em od góry —
   parytet z page1-letters). Mobile: POZIOMY wiersz KODA wycentrowany nisko
   (~74% okna) — wzorzec mobilny piaskownicy (S2 robiło to teksturą; tu
   bryły zostają bryłami). Wszystko w px OKNA (winH), świat przez s=w/px —
   pułapka #2: size.height to wysokość CANVASU (155svh), nie okna. */
export interface KodaLayout {
  fontPx: number;
  /** Skala świata: 1em litery = fontW jednostek world. */
  fontW: number;
  /** Środki liter (world, canvas-centered). */
  centers: Array<{ x: number; y: number }>;
  /** Oś kolumny/wiersza (pivot obrotu strony 5). */
  axis: { x: number; y: number };
}

export function kodaLayout(
  L: KodaLetters3D,
  p: {
    wide: boolean;
    vwPx: number;
    winHPx: number;
    viewportW: number;
    viewportH: number;
  }
): KodaLayout {
  const s = p.viewportW / p.vwPx;
  const fontPx = p.wide
    ? Math.min(340, Math.max(160, 0.21 * p.vwPx))
    : Math.min(120, Math.max(64, 0.235 * p.vwPx));
  const fontW = fontPx * s;
  const centers: Array<{ x: number; y: number }> = [];

  if (p.wide) {
    const colLeftPx = 0.81 * p.vwPx - fontPx;
    const colLeftX = -p.viewportW / 2 + colLeftPx * s;
    const topBase = 0.78; // baseline0 w em od górnej krawędzi canvasu (parytet DOM)
    L.letters.forEach((g, i) => {
      centers.push({
        x: colLeftX + g.center[0] * fontW,
        y: p.viewportH / 2 - (topBase + i * KODA_LINE_H - g.center[1]) * fontW,
      });
    });
    return {
      fontPx,
      fontW,
      centers,
      axis: {
        x: colLeftX + (L.columnWidth / 2) * fontW,
        y: p.viewportH / 2 - (topBase - L.capTop + L.columnHeight / 2) * fontW,
      },
    };
  }

  // Wiersz: advance = szerokość inka + stały odstęp (zwarty logotyp 800).
  const GAP = 0.07;
  const total = L.letters.reduce((a, g) => a + g.width, 0) + GAP * (L.letters.length - 1);
  // 0.78 winH: wiersz brył siedzi w dolnej części (treść hero u góry na mobile)
  // — czysta separacja na typowych telefonach, na bardzo niskich (≤667) wiersz
  // staje się tłem pod CTA (tekst z-10 + winieta = czytelność zachowana).
  const rowCy = p.viewportH / 2 - 0.78 * p.winHPx * s;
  let cursor = -total / 2;
  L.letters.forEach((g) => {
    centers.push({
      x: (cursor + g.width / 2) * fontW,
      y: rowCy + (g.center[1] - L.capTop / 2) * fontW,
    });
    cursor += g.width + GAP;
  });
  return { fontPx, fontW, centers, axis: { x: 0, y: rowCy } };
}

export function makeMoteGeometry(count: number, seed: number): THREE.BufferGeometry {
  const geo = new THREE.BufferGeometry();
  const seeds = new Float32Array(count * 3);
  const rng = mulberry32(seed);
  for (let i = 0; i < count * 3; i++) seeds[i] = rng() * 2 - 1;
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  geo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));
  return geo;
}

/** Fabryki materiałów kosmosu — sceny podają wartości startowe reduced. */
export function makeCosmosMaterials(reduced: boolean) {
  const nebula = new THREE.ShaderMaterial({
    vertexShader: COSMOS_VERT,
    fragmentShader: COSMOS_FRAG,
    uniforms: {
      uTime: { value: reduced ? 6.0 : 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uScroll: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uAspect: { value: 1.0 },
      uC1: { value: new THREE.Vector2(0.72, 0.62) },
      uC2: { value: new THREE.Vector2(0.3, 0.74) },
      uC1Str: { value: 1 },
      uBg: { value: new THREE.Color(BRAND.bg) },
      uPink: { value: new THREE.Color(BRAND.pink) },
      uPinkBright: { value: new THREE.Color(BRAND.pinkBright) },
      uViolet: { value: new THREE.Color(BRAND.violet) },
      uIndigo: { value: new THREE.Color(BRAND.indigo) },
      uLight: { value: 0 },
    },
    // Mgławica maluje TYLKO dodawane światło na PageCanvas: dark = additive
    // premultiplied (pełna jasność światła), light = normal straight (atrament).
    // Blending + premultipliedAlpha przełącza motyw (home-totem useEffect);
    // startujemy w ciemnym = addytywnie + premultiplied.
    transparent: true,
    depthWrite: false,
    premultipliedAlpha: true,
    blending: THREE.AdditiveBlending,
  });

  const stars = new THREE.ShaderMaterial({
    vertexShader: STAR_VERT,
    fragmentShader: STAR_FRAG,
    uniforms: {
      uTime: { value: reduced ? 4 : 0 },
      uAlpha: { value: reduced ? 0.9 : 0 },
      uPx: { value: 2 },
      uScroll: { value: 0 },
      uSpread: { value: new THREE.Vector2(14, 8) },
      uWarm: { value: new THREE.Color("#fff3fa") },
      uCool: { value: new THREE.Color(BRAND.violet) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const motes = new THREE.ShaderMaterial({
    vertexShader: MOTE_VERT,
    fragmentShader: MOTE_FRAG,
    uniforms: {
      uTime: { value: reduced ? 5 : 0 },
      uAlpha: { value: reduced ? 0.8 : 0 },
      uPx: { value: 2 },
      uCol: { value: new THREE.Color(BRAND.pinkLighter) },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  return { nebula, stars, motes };
}
