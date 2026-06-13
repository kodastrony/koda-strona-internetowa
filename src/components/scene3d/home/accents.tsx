"use client";

import { useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SectionStage, type SectionSceneProps } from "../scene-stage";
import { BRAND, GLSL_DITHER } from "../lib";
import { ScenePoster } from "../scene-poster";
import { useThemeValue } from "./theme";

/* ══════════════════════════════════════════════════════════════════════════
   accents — kosmiczne tła SEKCJI żywej strony (warianty A/B/C).

   Wszystko = JEDEN quad z shaderem na sekcję (SectionStage: IO-pauza, dpr
   clamp, reduced→demand, drive-mode). Treść sekcji zostaje żywa (te same
   komponenty co kodastrony.pl) — akcent gra POD nią, prowadzony scrollem.

   KONSTELACJA (Jak pracujemy): 4 gwiazdy-węzły połączone liniami, które
   RYSUJĄ SIĘ w miarę scrolla — „cztery etapy" jako gwiazdozbiór.
   ORBITY (Usługi, wariant B): dwie pochylone elipsy ze świetlnym węzłem.
   WELON (Realizacje, wariant B): rzadkie mrugające drobiny głębi.

   MOTYW: dark = światło (additive), light = atrament na papierze (normal,
   śliwkowe kreski/punkty — przełączenie uniformem uLight + blending).
   ══════════════════════════════════════════════════════════════════════════ */

const ACCENT_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/* ── Konstelacja czterech etapów ─────────────────────────────────────────── */
const CONSTELLATION_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uProg;
uniform float uAlpha;
uniform float uAspect;
uniform float uLight;
uniform vec3 uPink;
uniform vec3 uPinkBright;
uniform vec3 uViolet;
${GLSL_DITHER}

float seg(vec2 p, vec2 a, vec2 b, float draw) {
  vec2 ab = b - a;
  float h = clamp(dot(p - a, ab) / dot(ab, ab), 0.0, 1.0);
  h = min(h, draw);
  float d = length(p - (a + ab * h));
  return smoothstep(0.005, 0.0012, d) * step(0.001, draw);
}

float node(vec2 p, vec2 c, float lit, float tw) {
  float d2 = dot(p - c, p - c);
  return (exp(-d2 * 5200.0) * 1.2 + exp(-d2 * 420.0) * 0.45 * lit) * (0.45 + 0.55 * lit) * tw;
}

void main() {
  vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0);

  // Cztery węzły: łagodna linia przez prawą połowę sekcji (pod treścią).
  vec2 n0 = vec2(-0.62, 0.18);
  vec2 n1 = vec2(-0.18, -0.06);
  vec2 n2 = vec2(0.3, 0.14);
  vec2 n3 = vec2(0.72, -0.12);

  // Rysowanie prowadzone scrollem: odcinki po kolei, węzły zapalają się
  // gdy dociera do nich linia (rytm „beng-beng" jak ticki na /uslugi).
  float pr = clamp(uProg * 1.45 - 0.12, 0.0, 1.0);
  float d0 = clamp(pr * 3.0, 0.0, 1.0);
  float d1 = clamp(pr * 3.0 - 1.0, 0.0, 1.0);
  float d2 = clamp(pr * 3.0 - 2.0, 0.0, 1.0);

  float lines = seg(p, n0, n1, d0) + seg(p, n1, n2, d1) + seg(p, n2, n3, d2);

  float tw0 = 0.8 + 0.2 * sin(uTime * 1.1);
  float tw1 = 0.8 + 0.2 * sin(uTime * 1.3 + 2.1);
  float tw2 = 0.8 + 0.2 * sin(uTime * 0.9 + 4.2);
  float tw3 = 0.8 + 0.2 * sin(uTime * 1.2 + 1.3);

  float nodes = node(p, n0, smoothstep(0.0, 0.08, pr), tw0);
  nodes += node(p, n1, d0, tw1);
  nodes += node(p, n2, d1, tw2);
  nodes += node(p, n3, d2, tw3);

  // DARK: światło additive. LIGHT: śliwkowy atrament (normal blending).
  vec3 colD = uViolet * lines * 0.34 + uPinkBright * nodes * 0.85 + uPink * nodes * 0.3;
  vec3 colL = mix(vec3(0.42, 0.3, 0.47), vec3(0.7, 0.26, 0.6), 0.4 + 0.6 * nodes);
  float aD = uAlpha;
  float aL = clamp(lines * 0.3 + nodes * 0.5, 0.0, 0.55) * uAlpha;

  vec3 col = mix(colD * aD, colL, uLight);
  // Alfa = POKRYCIE (premultiplied): canvas zostaje PRZEZROCZYSTY tam, gdzie nic
  // nie świeci, więc PageCanvas jest JEDYNYM tłem — żadnego nieprzezroczystego
  // „kwadratu" zasłaniającego pogodę strony. W dark alfa = luminancja światła.
  float aDark = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  float a = mix(aDark, aL, uLight);
  // Wygaszenie L/P krawędzi quada (maska SectionStage tnie tylko górę/dół) —
  // światło konstelacji nigdy nie urywa się twardą pionową linią.
  float edgeH = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
  col *= edgeH;
  a *= edgeH;
  gl_FragColor = vec4(kodaDither(col, gl_FragCoord.xy), a);
}
`;

/* ── Orbity (usługi) — PLANETA + 3 orbity ze świetlnym węzłem prowadzonym
     scrollem (rdzeń = „cel", wokół którego wszystko krąży). Theme-aware. ─── */
const ORBITS_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uProg;
uniform float uAlpha;
uniform float uAspect;
uniform float uLight;
uniform vec3 uPink;
uniform vec3 uPinkBright;
uniform vec3 uViolet;
${GLSL_DITHER}

// GLSL ES 1.0 (bez konstruktorów tablic) — orbita jako funkcja, wołana 3×.
vec3 orbit(vec2 p, vec2 pr, mat2 rotInv, float r, float spd, float phase, float hue) {
  vec3 col = vec3(0.0);
  // Linia orbity (elipsa 1:0.42).
  vec2 e = pr * vec2(1.0, 2.38);
  float d = abs(length(e) - r);
  float line = smoothstep(0.011, 0.001, d);
  col += mix(uViolet, uPink, hue) * line * 0.16;

  // Węzeł: kąt = scroll * prędkość + miękki dryf czasu.
  float ang = phase + uProg * spd * 6.2831 * 0.55 + uTime * 0.07;
  vec2 np = rotInv * (vec2(cos(ang), sin(ang) / 2.38) * r);
  vec2 dn = p - np;
  float nd = dot(dn, dn);
  col += uPinkBright * exp(-nd * 2400.0) * 1.1;
  col += uPink * exp(-nd * 260.0) * 0.4;

  // Ogon komety: wygaszany kawałek łuku za węzłem.
  float pa = atan(e.y, e.x);
  float diff = pa - ang;
  diff = mod(diff + 3.14159, 6.2831) - 3.14159;
  float trail = smoothstep(0.0, -1.1, diff) * step(-1.1, diff) * line;
  col += uPink * trail * 0.5;
  return col;
}

void main() {
  // Środek ciężkości (planeta) w prawej-górnej części, z dala od kart usług.
  vec2 p = (vUv - vec2(0.8, 0.4)) * vec2(uAspect, 1.0);
  float ca = cos(-0.32);
  float sa = sin(-0.32);
  mat2 rot = mat2(ca, -sa, sa, ca);
  mat2 rotInv = mat2(ca, sa, -sa, ca);
  vec2 pr = rot * p;

  vec3 col = vec3(0.0);

  // Jądro: planeta/cel, wokół której wszystko krąży.
  float core = exp(-dot(p, p) * 100.0);
  col += uPinkBright * core * 0.5;
  col += uPink * exp(-dot(p, p) * 15.0) * 0.16;

  col += orbit(p, pr, rotInv, 0.30, 1.9, 0.6, 0.0);
  col += orbit(p, pr, rotInv, 0.52, 1.35, 2.9, 0.45);
  col += orbit(p, pr, rotInv, 0.78, 1.0, 4.6, 0.85);

  // DARK: światło additive. LIGHT: śliwkowy atrament (normal blending).
  float lum = dot(col, vec3(0.5));
  vec3 colL = mix(vec3(0.45, 0.32, 0.5), vec3(0.7, 0.26, 0.6), clamp(lum * 2.0, 0.0, 1.0));
  float aL = clamp(lum * 1.5, 0.0, 0.5) * uAlpha;

  vec3 outCol = mix(col * uAlpha, colL, uLight);
  // Alfa = pokrycie (premultiplied) — canvas przezroczysty poza świecącymi
  // orbitami/planetą; PageCanvas pozostaje JEDYNYM tłem (zero „kwadratu").
  float aDark = clamp(max(outCol.r, max(outCol.g, outCol.b)), 0.0, 1.0);
  float a = mix(aDark, aL, uLight);
  // Wygaszenie L/P krawędzi quada — orbity/planeta nie urywają się pionową kreską.
  float edgeH = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
  outCol *= edgeH;
  a *= edgeH;
  gl_FragColor = vec4(kodaDither(outCol, gl_FragCoord.xy), a);
}
`;

/* ── Welon gwiazd (realizacje — wariant B) ──────────────────────────────── */
const VEIL_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uProg;
uniform float uAlpha;
uniform float uAspect;
uniform float uLight;
uniform vec3 uPink;
uniform vec3 uViolet;
${GLSL_DITHER}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Drobiny dryfują DELIKATNIE w górę ze scrollem (głębia za kartami).
  vec2 grid = vUv * vec2(70.0, 40.0) + vec2(0.0, -uProg * 3.0);
  vec2 cell = floor(grid);
  float h = hash21(cell);
  vec2 jit = vec2(hash21(cell + 7.31), hash21(cell + 3.17)) - 0.5;
  float dotR = length(fract(grid) - 0.5 - jit * 0.55);
  float tw = 0.4 + 0.6 * sin(uTime * (0.7 + h) + h * 40.0);
  float star = step(0.965, h) * smoothstep(0.3, 0.05, dotR) * tw;

  // Wygaszenie w pionowym środku (karty mają czyste pole).
  float edge = smoothstep(0.32, 0.06, abs(vUv.x - 0.5)) * 0.25 + 0.75;

  vec3 colD = mix(uViolet, uPink, h) * star * 0.5 * edge;
  vec3 colL = vec3(0.48, 0.36, 0.52);
  float aL = star * 0.3 * edge * uAlpha;

  vec3 col = mix(colD * uAlpha, colL, uLight);
  // Alfa = pokrycie (premultiplied) — przezroczysto poza drobinami; PageCanvas
  // jest JEDYNYM tłem (welon to tylko świetlny pył, nie nieprzezroczysty quad).
  float aDark = clamp(max(col.r, max(col.g, col.b)), 0.0, 1.0);
  float a = mix(aDark, aL, uLight);
  float edgeH = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
  col *= edgeH;
  a *= edgeH;
  gl_FragColor = vec4(kodaDither(col, gl_FragCoord.xy), a);
}
`;

/* ── Wspólny runner akcentu ──────────────────────────────────────────────── */
function makeAccentMaterial(frag: string, reduced: boolean): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    vertexShader: ACCENT_VERT,
    fragmentShader: frag,
    uniforms: {
      uTime: { value: reduced ? 7 : 0 },
      uProg: { value: reduced ? 0.55 : 0 },
      uAlpha: { value: reduced ? 1 : 0 },
      uAspect: { value: 1.6 },
      uLight: { value: 0 },
      uPink: { value: new THREE.Color(BRAND.pink) },
      uPinkBright: { value: new THREE.Color(BRAND.pinkBright) },
      uViolet: { value: new THREE.Color(BRAND.violet) },
    },
    transparent: true,
    depthWrite: false,
    // Dark = additive PREMULTIPLIED (rgb dodaje pełne światło orbit/konstelacji,
    // alfa = pokrycie → pusty quad przezroczysty, zero „kwadratu", pełna jasność).
    premultipliedAlpha: true,
    blending: THREE.AdditiveBlending,
  });
}

function AccentScene({ reduced, getProgress, frag }: SectionSceneProps & { frag: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  // Motyw przez store — canvas akcentu NIE remontuje się przy ☾/☀.
  const theme = useThemeValue();

  const material = useMemo(() => makeAccentMaterial(frag, reduced), [frag, reduced]);
  useEffect(() => () => material.dispose(), [material]);

  // Motyw: dark = światło additive premultiplied (pełna jasność, pokrycie=alfa),
  // light = atrament normal straight (barwa+pokrycie). uLight przełącza gałąź
  // shadera, premultipliedAlpha+blending — tryb mieszania.
  useEffect(() => {
    material.uniforms.uLight.value = theme === "light" ? 1 : 0;
    material.premultipliedAlpha = theme !== "light";
    material.blending = theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending;
    material.needsUpdate = true;
  }, [theme, material]);

  const born = useRef(0);

  useFrame((state, rawDt) => {
    const m = meshRef.current;
    if (!m) return;
    m.scale.set(viewport.width, viewport.height, 1);
    material.uniforms.uAspect.value = size.width / Math.max(size.height, 1);
    if (reduced) return;
    const dt = Math.min(rawDt, 1 / 30);
    born.current = Math.min(1, born.current + dt / 1.6);
    material.uniforms.uAlpha.value = born.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
    material.uniforms.uProg.value = getProgress();
  });

  return (
    <mesh ref={meshRef} material={material}>
      <planeGeometry args={[1, 1]} />
    </mesh>
  );
}

/* ── Publiczne akcenty (absolute inset-0 robi SectionStage) ─────────────── */
function useAccent(frag: string) {
  return useMemo(() => {
    const W = (p: SectionSceneProps) => <AccentScene {...p} frag={frag} />;
    W.displayName = "KodaAccentScene";
    return W;
  }, [frag]);
}

/* Akcenty sekcji renderujemy TYLKO na ≥1024px: na telefonach/tabletach nie
   montujemy dodatkowych kontekstów WebGL (oszczędność pamięci/GPU — bohaterem
   mobile zostaje sam totem hero). SSR-safe przez useSyncExternalStore (serwer
   = false → akcenty nie trafiają do statycznego HTML, brak rozjazdu hydracji;
   klient czyta realny media-query). */
const ACCENTS_MQ = "(min-width: 1024px)";
function subscribeAccentsMq(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(ACCENTS_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function useDesktopAccents(): boolean {
  return useSyncExternalStore(
    subscribeAccentsMq,
    () => window.matchMedia(ACCENTS_MQ).matches,
    () => false
  );
}

export function ConstellationAccent() {
  const show = useDesktopAccents();
  const Scene = useAccent(CONSTELLATION_FRAG);
  if (!show) return null;
  return <SectionStage scene={Scene} poster={<ScenePoster hue={273} />} />;
}

export function OrbitsAccent() {
  const show = useDesktopAccents();
  const Scene = useAccent(ORBITS_FRAG);
  if (!show) return null;
  return <SectionStage scene={Scene} poster={<ScenePoster hue={300} />} />;
}

export function StarVeilAccent() {
  const show = useDesktopAccents();
  const Scene = useAccent(VEIL_FRAG);
  if (!show) return null;
  return <SectionStage scene={Scene} poster={<ScenePoster hue={324} />} />;
}
