"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import type { SceneProps } from "../scene-stage";
import { BRAND, GLSL_DITHER, usePointerRef } from "../lib";
import { buildKodaLetters3D, type KodaLetters3D } from "../text3d";
import { P5_INTRO } from "../intro-timings";
import { SCENE_DARK, SCENE_LIGHT, useThemeValue, type ScenePalette } from "../home/theme";
import type { TotemVariantCfg } from "../home/variants";
import {
  kodaLayout,
  makeCosmosMaterials,
  makeMoteGeometry,
  makeStarGeometry,
  type KodaBus,
} from "./cosmos";

/* ══════════════════════════════════════════════════════════════════════════
   HOME-TOTEM — monolit KODA (DNA strony 5) w trzech charakterach, z motywem.

   Wariant A „Monolit"  — spokojna godność: scroll obraca kolumnę sprężyną
     z pędem dokładnie jak S5; intro = wjazd brył z lekkim obrotem.
   Wariant B „Orbita"   — perpetuum: kolumna wiruje POWOLI bez przerwy
     (sprężyna goni rosnący cel), scroll dorzuca pędu jak koło zamachowe;
     litery wchodzą w intro PO ORBITALNYM ŁUKU (z prawej, z głębi); kosmos
     żywszy (mgławica oddycha, gwiazdy gęstsze), klucz kołysze się szerzej.
   Wariant C „Reflektor" — światłocień: kolumna niemal frontalna (scroll =
     tylko dostojny pochył), za to KLUCZ ŚWIATŁA jedzie ze scrollem przez
     szeroki azymut — ściany rozpalają się i gasną, cień na dysku wydłuża
     się jak wskazówka zegara słonecznego. Intro = czyste odsłonięcie
     światłem: bryły stoją od pierwszej klatki, obiega je reflektor.

   MOTYW: dark = paleta S5 1:1; light = porcelanowe bryły rzeźbione szarym
   cieniem na pastelowej mgławicy (kolory przez uniformy/propy materiałów —
   zero rekompilacji; przełączenie natychmiastowe).
   ══════════════════════════════════════════════════════════════════════════ */

const quartOut = (t: number) => 1 - Math.pow(1 - t, 4);
const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => (t < 0 ? 0 : t > 1 ? 1 : t);

const TOTEM_VERT = /* glsl */ `
varying vec3 vNw;
varying vec3 vWp;
void main() {
  vNw = normalize(mat3(modelMatrix) * normal);
  vWp = (modelMatrix * vec4(position, 1.0)).xyz;
}
`;

const TOTEM_FRAG = /* glsl */ `
varying vec3 vNw;
varying vec3 vWp;
uniform vec3 uPink;
uniform vec3 uViolet;
uniform vec3 uPinkBright;
uniform vec3 uKeyDir;
uniform float uRim;
uniform float uIgnite;
void main() {
  vec3 N = normalize(vNw);
  vec3 V = normalize(cameraPosition - vWp);
  float fres = pow(1.0 - abs(dot(N, V)), 2.8);
  vec3 rim = mix(uPink, uViolet, 0.5 + 0.5 * sin(vWp.y * 0.85 + vWp.x * 0.5));
  csm_Emissive += rim * fres * uRim;
  float keyFace = max(dot(N, uKeyDir), 0.0);
  csm_Emissive += uPinkBright * uIgnite * (0.2 + 0.8 * keyFace);
}
`;

const DISC_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const DISC_FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uShadowDir;
uniform float uShadowStr;
uniform float uShadowStretch;
uniform vec2 uGlowDir;
uniform float uA;
uniform vec3 uDeep;
uniform vec3 uViolet;
uniform vec3 uPink;
${GLSL_DITHER}
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float fog = exp(-dot(p, p) * 2.3);

  vec2 sd = normalize(uShadowDir + vec2(1e-4));
  vec2 q = p - sd * 0.2;
  float along = dot(q, sd);
  vec2 q2 = q - sd * along * (uShadowStretch / (1.0 + uShadowStretch));
  float sh = exp(-dot(q2, q2) * 7.5) * uShadowStr;

  vec2 gq = p - uGlowDir * 0.45;
  float glow = exp(-dot(gq, gq) * 3.2);

  vec3 col = mix(uDeep, uViolet, 0.45) * 0.9;
  col += uPink * glow * 0.85;
  col += vec3(1.0, 0.92, 0.97) * exp(-dot(gq, gq) * 9.0) * 0.25;
  col *= (1.0 - sh * 0.9);

  gl_FragColor = vec4(kodaDither(col, gl_FragCoord.xy), fog * uA);
}
`;

interface HomeTotemProps extends SceneProps {
  bus: KodaBus;
  variant: TotemVariantCfg;
}

export default function HomeTotemScene({ reduced, quality, bus, variant }: HomeTotemProps) {
  const cfg = variant;
  // Motyw przez subskrypcję store'a — NIE przez prop (prop remontowałby Canvas).
  const theme = useThemeValue();
  const ptr = usePointerRef(!reduced);
  const viewport = useThree((s) => s.viewport);
  const size = useThree((s) => s.size);
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);

  const totemRef = useRef<THREE.Group>(null);
  const letterRefs = useRef<Array<THREE.Group | null>>([null, null, null, null]);
  const nebulaRef = useRef<THREE.Mesh>(null);
  const discRef = useRef<THREE.Mesh>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const keyTarget = useMemo(() => new THREE.Object3D(), []);

  /** Aktualna paleta motywu — czytana w pętli klatek przez ref. */
  const palette = useRef<ScenePalette>(theme === "light" ? SCENE_LIGHT : SCENE_DARK);

  /* ── Geometrie brył ────────────────────────────────────────────────────── */
  const [letters, setLetters] = useState<KodaLetters3D | null>(null);
  useEffect(() => {
    let alive = true;
    let data: KodaLetters3D | null = null;
    buildKodaLetters3D({ quality, depth: cfg.depth, bevel: cfg.bevel }).then((d) => {
      if (!alive) {
        d.dispose();
        return;
      }
      data = d;
      setLetters(d);
      bus.onReady?.();
    });
    return () => {
      alive = false;
      data?.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quality]);

  /* ── Materiały brył ────────────────────────────────────────────────────── */
  const shared = useMemo(
    () => ({
      uPink: { value: new THREE.Color(BRAND.pink) },
      uViolet: { value: new THREE.Color(BRAND.violet) },
      uPinkBright: { value: new THREE.Color(BRAND.pinkBright) },
      uKeyDir: { value: new THREE.Vector3(0.6, 0.4, 0.7) },
      uRim: { value: cfg.rim.base },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  const ignites = useMemo(() => Array.from({ length: 4 }, () => ({ value: 0 })), []);
  const materials = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        return new CustomShaderMaterial({
          baseMaterial: THREE.MeshStandardMaterial,
          vertexShader: TOTEM_VERT,
          fragmentShader: TOTEM_FRAG,
          uniforms: { ...shared, uIgnite: ignites[i] },
          color: SCENE_DARK.letter.color,
          metalness: SCENE_DARK.letter.metalness,
          roughness: SCENE_DARK.letter.roughness,
          envMapIntensity: SCENE_DARK.letter.env,
          transparent: true,
          opacity: 0,
        });
      }),
    [shared, ignites]
  );
  useEffect(() => {
    return () => materials.forEach((m) => m.dispose());
  }, [materials]);

  const discMaterial = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: DISC_VERT,
        fragmentShader: DISC_FRAG,
        uniforms: {
          uShadowDir: { value: new THREE.Vector2(-0.7, 0.4) },
          uShadowStr: { value: reduced ? 0.55 : 0 },
          uShadowStretch: { value: 1 },
          uGlowDir: { value: new THREE.Vector2(0.7, -0.4) },
          uA: { value: reduced ? 0.8 : 0 },
          uDeep: { value: new THREE.Color(SCENE_DARK.disc.deep) },
          uViolet: { value: new THREE.Color(SCENE_DARK.disc.violet) },
          uPink: { value: new THREE.Color(SCENE_DARK.disc.pink) },
        },
        transparent: true,
        depthWrite: false,
      }),
    [reduced]
  );
  useEffect(() => () => discMaterial.dispose(), [discMaterial]);

  /* ── Kosmos ────────────────────────────────────────────────────────────── */
  const cosmos = useMemo(() => makeCosmosMaterials(reduced), [reduced]);
  useEffect(
    () => () => {
      cosmos.nebula.dispose();
      cosmos.stars.dispose();
      cosmos.motes.dispose();
    },
    [cosmos]
  );
  const starGeometry = useMemo(
    () => makeStarGeometry(quality === "high" ? 460 : 210, 0x7073 + cfg.id.charCodeAt(0)),
    [quality, cfg.id]
  );
  const moteGeometry = useMemo(
    () => makeMoteGeometry(quality === "high" ? 200 : 80, 0xbead),
    [quality]
  );
  useEffect(
    () => () => {
      starGeometry.dispose();
      moteGeometry.dispose();
    },
    [starGeometry, moteGeometry]
  );

  useEffect(() => {
    if (keyLightRef.current) keyLightRef.current.target = keyTarget;
  }, [keyTarget, letters]);

  /* ── MOTYW: paleta przez uniformy/propy — natychmiast, bez rekompilacji ── */
  useEffect(() => {
    const p = theme === "light" ? SCENE_LIGHT : SCENE_DARK;
    palette.current = p;

    cosmos.nebula.uniforms.uBg.value.set(p.bg);
    cosmos.nebula.uniforms.uPink.value.set(p.pink);
    cosmos.nebula.uniforms.uPinkBright.value.set(p.pinkBright);
    cosmos.nebula.uniforms.uViolet.value.set(p.violet);
    cosmos.nebula.uniforms.uIndigo.value.set(p.indigo);
    cosmos.nebula.uniforms.uLight.value = theme === "light" ? 1 : 0;
    // Mgławica: dark = additive PREMULTIPLIED (rgb dodaje pełne światło, alfa =
    // pokrycie → pusta przestrzeń przezroczysta, baza z PageCanvas, jasność jak
    // dawniej); light = normal STRAIGHT (barwa+pokrycie → lerp papier↔barwa).
    cosmos.nebula.premultipliedAlpha = theme !== "light";
    cosmos.nebula.blending = theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending;
    cosmos.nebula.needsUpdate = true;

    cosmos.stars.uniforms.uWarm.value.set(p.starWarm);
    cosmos.stars.uniforms.uCool.value.set(p.starCool);
    // Jasny motyw: gwiazdy = drobiny atramentu (normal), ciemny: światło (add).
    cosmos.stars.blending = theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending;
    cosmos.stars.needsUpdate = true;
    cosmos.motes.uniforms.uCol.value.set(p.moteCol);
    cosmos.motes.blending = theme === "light" ? THREE.NormalBlending : THREE.AdditiveBlending;
    cosmos.motes.needsUpdate = true;

    materials.forEach((m) => {
      // CSM proxuje propy materiału bazowego w runtime, ale nie w typach.
      const std = m as unknown as THREE.MeshStandardMaterial;
      std.color.set(p.letter.color);
      std.metalness = p.letter.metalness;
      std.roughness = p.letter.roughness;
      std.envMapIntensity = p.letter.env;
    });

    discMaterial.uniforms.uDeep.value.set(p.disc.deep);
    discMaterial.uniforms.uViolet.value.set(p.disc.violet);
    discMaterial.uniforms.uPink.value.set(p.disc.pink);

    if (keyLightRef.current) {
      keyLightRef.current.color.set(p.keyColor);
      keyLightRef.current.intensity = p.keyIntensity;
    }
    if (fillLightRef.current) {
      fillLightRef.current.color.set(p.fillColor);
      fillLightRef.current.intensity = p.fillIntensity;
    }
  }, [theme, cosmos, materials, discMaterial]);

  /* ── Zegary + sprężyna obrotu ─────────────────────────────────────────── */
  const riseAt = useRef<number | null>(null);
  const endSent = useRef(false);
  const yaw = useRef(cfg.intro === "light" ? cfg.spin.rest : cfg.intro === "arc" ? -1.6 : -0.85);
  const yawVel = useRef(0);

  useFrame((state, rawDt) => {
    const g = totemRef.current;
    if (!g || !letters) return;
    const dt = Math.min(rawDt, 1 / 30);
    const t = state.clock.elapsedTime;
    const pal = palette.current;

    const vwPx = size.width;
    const canvasH = size.height || 1;
    const winH = (typeof window !== "undefined" && window.innerHeight) || canvasH;
    const wide = vwPx >= 1024;
    const s = viewport.width / vwPx;

    const layout = kodaLayout(letters, {
      wide,
      vwPx,
      winHPx: winH,
      viewportW: viewport.width,
      viewportH: viewport.height,
    });
    const fontW = layout.fontW;
    const fontPx = layout.fontPx;

    const neb = nebulaRef.current;
    const fovRad = (camera as THREE.PerspectiveCamera).fov * 0.0174533;
    if (neb) {
      const dist = camera.position.z + 6;
      const worldH = 2 * dist * Math.tan(fovRad / 2);
      neb.scale.set(worldH * (vwPx / canvasH) * 1.06, worldH * 1.06, 1);
    }
    cosmos.nebula.uniforms.uAspect.value = vwPx / canvasH;

    const restCx = wide ? (0.81 * vwPx - fontPx * 0.45) / vwPx : 0.5;
    const restCy = 1 - (wide ? winH * 0.46 : winH * 0.7) / canvasH;
    cosmos.nebula.uniforms.uC2.value.set(wide ? restCx - 0.34 : 0.22, restCy + 0.14);

    const discY = viewport.height / 2 - (wide ? 0.86 : 0.92) * winH * s;

    const poseLetters = (q: (i: number) => number, op: (i: number) => number, lag: number) => {
      letters.letters.forEach((_L, i) => {
        const lg = letterRefs.current[i];
        if (!lg) return;
        const qi = q(i);
        lg.scale.setScalar(fontW);
        if (cfg.intro === "arc") {
          // Orbitalny łuk: z prawej i z głębi, z kontr-obrotem (wariant B).
          lg.position.x = layout.centers[i].x - layout.axis.x + (1 - qi) * 1.25 * fontW;
          lg.position.y = layout.centers[i].y - layout.axis.y + (1 - qi) * -0.22 * fontW;
          lg.position.z = (1 - qi) * -2.3;
          lg.rotation.x = (1 - qi) * -0.2;
          lg.rotation.y =
            THREE.MathUtils.clamp(-lag * cfg.spin.lag * i, -0.38, 0.38) + (1 - qi) * -1.3;
        } else {
          lg.position.x = layout.centers[i].x - layout.axis.x;
          lg.position.y = layout.centers[i].y - layout.axis.y + (1 - qi) * -0.55 * fontW;
          lg.position.z = (1 - qi) * -0.9;
          lg.rotation.x = (1 - qi) * -0.35;
          lg.rotation.y = THREE.MathUtils.clamp(-lag * cfg.spin.lag * i, -0.38, 0.38);
        }
        materials[i].opacity = op(i);
      });
    };

    const placeDisc = () => {
      const disc = discRef.current;
      if (!disc) return;
      disc.position.set(layout.axis.x, discY, -0.4);
      disc.rotation.set(-1.18, 0, 0);
      const r = wide ? 6.0 : 7.2;
      disc.scale.set(fontW * r, fontW * r, 1);
    };

    const setKey = (az: number) => {
      const kl = keyLightRef.current;
      keyTarget.position.set(layout.axis.x, layout.axis.y, 0);
      keyTarget.updateMatrixWorld();
      if (kl) {
        kl.position.set(layout.axis.x + Math.cos(az) * 6, layout.axis.y + 2.2, Math.sin(az) * 6);
      }
      const dir = shared.uKeyDir.value as THREE.Vector3;
      dir.set(Math.cos(az) * 6, 2.2, Math.sin(az) * 6).normalize();
      (discMaterial.uniforms.uShadowDir.value as THREE.Vector2).set(-Math.cos(az), -Math.sin(az));
      (discMaterial.uniforms.uGlowDir.value as THREE.Vector2).set(Math.cos(az), Math.sin(az));
    };

    if (reduced) {
      cosmos.nebula.uniforms.uC1.value.set(restCx, restCy);
      cosmos.nebula.uniforms.uC1Str.value = cfg.cosmos.c1Mul;
      cosmos.stars.uniforms.uAlpha.value = 0.9 * pal.starAlpha * cfg.cosmos.starMul;
      cosmos.motes.uniforms.uAlpha.value = 0.8 * pal.moteAlpha;
      g.position.set(layout.axis.x, layout.axis.y, 0);
      g.rotation.set(0, 0.34, 0);
      poseLetters(
        () => 1,
        () => 1,
        0
      );
      placeDisc();
      setKey(cfg.key.azRest);
      discMaterial.uniforms.uA.value = 0.8 * pal.disc.alphaMul;
      discMaterial.uniforms.uShadowStr.value = 0.55 * pal.disc.shadowMul;
      discMaterial.uniforms.uShadowStretch.value = 1;
      shared.uRim.value = cfg.rim.base * pal.rimMul;
      return;
    }

    /* ── Partytura ─────────────────────────────────────────────────────── */
    if (riseAt.current === null) {
      riseAt.current = bus.skipped ? t - P5_INTRO.total : t;
      if (bus.skipped) {
        yaw.current = cfg.spin.rest;
        yawVel.current = 0;
      }
    }
    if (bus.skipped && t - riseAt.current < P5_INTRO.total) {
      riseAt.current = t - P5_INTRO.total;
      yaw.current = cfg.spin.rest;
      yawVel.current = 0;
    }
    const tIntro = t - riseAt.current;

    if (!endSent.current && tIntro >= P5_INTRO.total) {
      endSent.current = true;
      bus.onIntroEnd?.();
    }

    const worldIn = easeOutExpo(clamp01(tIntro / 0.5));
    const sweepT = clamp01((tIntro - P5_INTRO.sweepStart) / P5_INTRO.sweep);
    const heroT = clamp01((tIntro - P5_INTRO.base) / 0.6);

    const scrollPx = window.scrollY;
    const s2 = Math.min(scrollPx / winH, 1.6);

    /* ── Świat ──────────────────────────────────────────────────────────── */
    cosmos.nebula.uniforms.uTime.value = t + 27;
    cosmos.nebula.uniforms.uIntro.value = worldIn;
    cosmos.nebula.uniforms.uScroll.value = s2;
    const mouse = cosmos.nebula.uniforms.uMouse.value as THREE.Vector2;
    mouse.set(
      THREE.MathUtils.damp(mouse.x, ptr.current.x, 2, dt),
      THREE.MathUtils.damp(mouse.y, ptr.current.y, 2, dt)
    );
    cosmos.nebula.uniforms.uC1.value.set(
      restCx + mouse.x * 0.018,
      restCy - mouse.y * 0.012 + s2 * 0.05
    );
    // Oddech mgławicy (B) + puls obiegu klucza w intro — światło jest JEDNO.
    cosmos.nebula.uniforms.uC1Str.value =
      cfg.cosmos.c1Mul *
      (1 + Math.sin(sweepT * Math.PI) * 0.5 + cfg.cosmos.c1Breathe * Math.sin(t * 0.4) * heroT);

    cosmos.stars.uniforms.uTime.value = t;
    cosmos.stars.uniforms.uAlpha.value =
      worldIn *
      pal.starAlpha *
      cfg.cosmos.starMul *
      (1 - THREE.MathUtils.smoothstep(s2, 1.0, 1.5) * 0.6);
    cosmos.stars.uniforms.uScroll.value = s2;
    cosmos.stars.uniforms.uPx.value = 2 * gl.getPixelRatio();
    (cosmos.stars.uniforms.uSpread.value as THREE.Vector2).set(
      Math.max(14, viewport.width * 0.85),
      Math.max(8, viewport.height * 0.62)
    );
    cosmos.motes.uniforms.uTime.value = t;
    cosmos.motes.uniforms.uAlpha.value = worldIn * 0.7 * pal.moteAlpha;
    cosmos.motes.uniforms.uPx.value = 2 * gl.getPixelRatio();

    /* ── Obrót: sprężyna z pędem (A/B) lub dostojny pochył (C) ───────────── */
    const introYawTarget =
      cfg.intro === "light"
        ? cfg.spin.rest
        : tIntro < P5_INTRO.lettersStart
          ? cfg.intro === "arc"
            ? -1.6
            : -0.85
          : cfg.spin.rest;
    const spinAmt = wide ? cfg.spin.scrollAmt : cfg.spin.scrollAmtMobile;
    const yawTarget =
      introYawTarget +
      heroT * (Math.min(s2, 1.6) / 1.6) * spinAmt +
      cfg.spin.idle * Math.max(0, tIntro - P5_INTRO.base) * heroT +
      ptr.current.x * cfg.spin.ptr * heroT +
      Math.sin(t * 0.3) * 0.045 * heroT;
    yawVel.current += (yawTarget - yaw.current) * cfg.spin.k * dt;
    yawVel.current *= Math.exp(-cfg.spin.damp * dt);
    yaw.current += yawVel.current * dt;

    /* ── Klucz światła ──────────────────────────────────────────────────── */
    const az =
      tIntro < P5_INTRO.sweepStart
        ? cfg.key.azStart
        : THREE.MathUtils.lerp(cfg.key.azStart, cfg.key.azRest, easeInOutCubic(sweepT)) +
          heroT * s2 * cfg.key.azScroll +
          Math.sin(t * 0.26) * cfg.key.sway * heroT;
    setKey(az);

    shared.uRim.value =
      (cfg.rim.base + s2 * cfg.rim.scroll + Math.sin(sweepT * Math.PI) * 0.1) * pal.rimMul;

    /* ── Totem ──────────────────────────────────────────────────────────── */
    const par = -0.4 * Math.min(scrollPx, 600) * s;
    const bob = Math.sin(t * 0.5) * 0.012 * fontW * heroT;
    g.position.set(layout.axis.x, layout.axis.y + par + bob, 0);
    g.rotation.y = yaw.current;
    g.rotation.x = THREE.MathUtils.damp(
      g.rotation.x,
      -ptr.current.y * 0.06 * heroT - s2 * 0.1,
      2.2,
      dt
    );

    // Flara sekwencyjna K→O→D→A zsynchronizowana z obiegiem klucza.
    const igniteAmp = cfg.intro === "light" ? 0.72 : 0.5;
    letters.letters.forEach((_, i) => {
      const ign =
        sweepT > 0 && sweepT < 1
          ? Math.exp(-Math.pow((easeInOutCubic(sweepT) * 4.4 - (i + 0.55)) / 0.62, 2))
          : 0;
      ignites[i].value = ign * igniteAmp;
    });

    if (cfg.intro === "light") {
      // Reflektor: bryły STOJĄ od pierwszej klatki (sylwety), światło odsłania.
      poseLetters(
        () => 1,
        (i) => clamp01((tIntro - 0.1 - i * 0.05) / 0.5),
        yawVel.current
      );
    } else {
      poseLetters(
        (i) =>
          quartOut(
            clamp01((tIntro - P5_INTRO.lettersStart - i * P5_INTRO.stagger) / P5_INTRO.rise)
          ),
        (i) =>
          quartOut(
            clamp01((tIntro - P5_INTRO.lettersStart - i * P5_INTRO.stagger) / P5_INTRO.rise)
          ),
        yawVel.current
      );
    }

    placeDisc();
    discMaterial.uniforms.uA.value = worldIn * (wide ? 0.9 : 0.75) * pal.disc.alphaMul;
    discMaterial.uniforms.uShadowStr.value =
      (0.45 + 0.3 * clamp01(tIntro / P5_INTRO.base)) * (1 - s2 * 0.18) * pal.disc.shadowMul;
    discMaterial.uniforms.uShadowStretch.value = 1 + s2 * (cfg.id === "c" ? 1.6 : 0.9);
  });

  return (
    <>
      <mesh ref={nebulaRef} position={[0, 0, -6]} material={cosmos.nebula} renderOrder={0}>
        <planeGeometry args={[1, 1]} />
      </mesh>
      <points
        geometry={starGeometry}
        material={cosmos.stars}
        frustumCulled={false}
        renderOrder={1}
      />

      <mesh ref={discRef} material={discMaterial} renderOrder={2}>
        <planeGeometry args={[1, 1]} />
      </mesh>

      <points
        geometry={moteGeometry}
        material={cosmos.motes}
        frustumCulled={false}
        renderOrder={3}
      />

      <group ref={totemRef}>
        {letters &&
          letters.letters.map((L, i) => (
            <group
              key={L.letter}
              ref={(el) => {
                letterRefs.current[i] = el;
              }}
            >
              <mesh geometry={L.geometry} material={materials[i]} renderOrder={6} />
            </group>
          ))}
      </group>

      <directionalLight ref={keyLightRef} intensity={2.5} color="#fff0f8" />
      <directionalLight
        ref={fillLightRef}
        position={[-5, -1, 2.5]}
        intensity={0.55}
        color={BRAND.violet}
      />
      <primitive object={keyTarget} />

      <Environment resolution={128} frames={1}>
        <Lightformer
          form="rect"
          intensity={2.4}
          color="#ffffff"
          position={[1.5, 5, 3]}
          scale={[8, 3, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color={BRAND.pinkBright}
          position={[-5.5, -1, 1.5]}
          scale={[6, 5, 1]}
          target={[0, 0, 0]}
        />
        <Lightformer
          form="circle"
          intensity={2.6}
          color="#ffeaf7"
          position={[3.4, 1.4, 4.6]}
          scale={1.6}
          target={[0, 0, 0]}
        />
      </Environment>
    </>
  );
}
