"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { SectionStage, type SectionSceneProps } from "../scene-stage";
import { BRAND, GLSL_DITHER, GLSL_SIMPLEX_3D } from "../lib";
import { ScenePoster } from "../scene-poster";

/* ══════════════════════════════════════════════════════════════════════════
   HORYZONT — ŚWIT NAD PLANETĄ (tło finałowej sekcji = Statement).

   Czyste światło zamiast obiektów: u dołu sekcji wisi łuk ciemnej planety
   z cienką różową atmosferą (rim marki), a zza horyzontu WSCHODZI światło —
   im głębiej w sekcję (scroll → uProg → rise), tym jaśniej; klimaks dokładnie
   pod treścią/CTA. Nad horyzontem rzadkie gwiazdy gasnące w łunie. Jeden quad,
   zero brył. To ta sekcja, którą user pamięta jako „świecącą się przy scrollu".
   ══════════════════════════════════════════════════════════════════════════ */

const HORIZON_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const HORIZON_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uProg;
uniform float uAlpha;
uniform float uAspect;
uniform vec3 uPink;
uniform vec3 uPinkBright;
uniform vec3 uViolet;
uniform vec3 uDeep;
${GLSL_SIMPLEX_3D}
${GLSL_DITHER}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  // Współrzędne od DOLNEJ krawędzi, dystanse w wysokościach sekcji.
  vec2 av = (vUv - vec2(0.5, 0.0)) * vec2(uAspect, 1.0);
  float rise = smoothstep(0.12, 0.85, uProg);

  // Planeta: wielki dysk pod sekcją; horyzont wspina się ze scrollem tak,
  // by ŁUK był widoczny w kadrze (krzywizna czyta się od razu).
  vec2 C = vec2(0.0, -0.88 + rise * 0.12);
  float R = 1.12;
  float d = length(av - C);
  float inside = smoothstep(R + 0.004, R - 0.006, d);

  // Ciało planety: prawie czarne, z reliefem mgły przy krawędzi.
  float relief = 0.5 + 0.5 * snoise(vec3(av * 2.6, uTime * 0.02));
  vec3 body = mix(vec3(0.014, 0.008, 0.013), uDeep * 0.55, relief * 0.4);
  body *= smoothstep(R, R * 0.55, d) * 0.8 + 0.2;

  // Atmosfera: OSTRA różowa linia (rim) + fioletowy welon nad nią.
  float edge = exp(-abs(d - R) * 120.0);
  float veil = exp(-max(d - R, 0.0) * 8.5);
  vec3 light = mix(uPink, uPinkBright, 0.35 + 0.65 * rise) * edge * (0.7 + 1.4 * rise);
  light += uViolet * veil * 0.14 * (0.4 + 0.6 * rise);

  // ŚWIT: jądro światła wschodzi w punkcie szczytu horyzontu.
  vec2 crest = C + vec2(0.0, R);
  vec2 gq = av - crest;
  float dawnCore = exp(-dot(gq * vec2(2.4, 5.2), gq * vec2(2.4, 5.2)));
  float dawnWide = exp(-dot(gq * vec2(1.1, 1.9), gq * vec2(1.1, 1.9)));
  light += (vec3(1.0, 0.93, 0.985) * 0.7 + uPinkBright * 0.5) * dawnCore * (0.25 + 1.3 * rise);
  light += uPink * dawnWide * (0.12 + 0.5 * rise);

  // Niebo nad planetą lekko POGŁĘBIONE (plum kanwy schodzi w kosmos) —
  // gwiazdy i świt mają na czym zagrać.
  float sky = smoothstep(R + 0.65, R + 0.05, d) * (1.0 - inside);
  vec3 skyCol = vec3(0.02, 0.01, 0.02);

  // Gwiazdy na CAŁYM niebie: okrągłe punkty z jitterem w komórce
  // (bez kształtu i jittera wychodzą kwadraty ustawione w siatkę).
  vec2 grid = vUv * vec2(120.0, 68.0);
  vec2 cell = floor(grid);
  float h = hash21(cell);
  vec2 jit = vec2(hash21(cell + 7.31), hash21(cell + 3.17)) - 0.5;
  float dotR = length(fract(grid) - 0.5 - jit * 0.55);
  float tw = 0.45 + 0.55 * sin(uTime * 1.2 + h * 41.0);
  float star =
    step(0.986, h) * smoothstep(0.34, 0.05, dotR) * tw *
    smoothstep(R + 0.02, R + 0.12, d) * (1.0 - dawnWide * 0.85);
  light += vec3(0.9, 0.88, 0.96) * star * 0.6;

  vec3 col = body * inside + skyCol * sky + light;
  float a = clamp(inside * 0.8 + sky * 0.38 + dot(light, vec3(0.45)), 0.0, 0.96) * uAlpha;
  // Wygaszenie L/P krawędzi quada (maska SectionStage tnie tylko górę/dół) —
  // ostry różowy rim planety nigdy nie urywa się twardą pionową linią.
  float edgeH = smoothstep(0.0, 0.05, vUv.x) * smoothstep(1.0, 0.95, vUv.x);
  col *= edgeH;
  a *= edgeH;
  gl_FragColor = vec4(kodaDither(col, gl_FragCoord.xy), a);
}
`;

function HorizonScene({ reduced, getProgress }: SectionSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: HORIZON_VERT,
        fragmentShader: HORIZON_FRAG,
        uniforms: {
          uTime: { value: reduced ? 6 : 0 },
          uProg: { value: reduced ? 0.62 : 0 },
          uAlpha: { value: reduced ? 1 : 0 },
          uAspect: { value: 1.6 },
          uPink: { value: new THREE.Color(BRAND.pink) },
          uPinkBright: { value: new THREE.Color(BRAND.pinkBright) },
          uViolet: { value: new THREE.Color(BRAND.violet) },
          uDeep: { value: new THREE.Color(BRAND.deepRose) },
        },
        transparent: true,
        depthWrite: false,
      }),
    [reduced]
  );
  useEffect(() => () => material.dispose(), [material]);

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

/* Tło-canvas finałowej sekcji: SectionStage (IO-pauza, DPR clamp, reduced→
   demand, context-lost→poster, drive-mode). absolute inset-0 robi SectionStage. */
export function HorizonBackdrop() {
  return (
    <SectionStage
      scene={HorizonScene}
      camera={{ position: [0, 0, 8], fov: 42 }}
      maskStops="transparent 0%, black 16%, black 90%, transparent 100%"
      poster={<ScenePoster hue={335} />}
    />
  );
}
