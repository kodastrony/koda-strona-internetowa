"use client";

import { useSyncExternalStore } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   device-tier — JEDNO ŹRÓDŁO PRAWDY o możliwościach urządzenia.

   Problem: na słabym sprzęcie (stary laptop z iGPU, tani telefon, wolne łącze)
   ciężka scena 3D ładowała się ~20 s i chodziła ~1 FPS, bo kod traktował każdy
   szeroki ekran jako „mocny". Tu wykrywamy REALNE możliwości RAZ na kliencie i
   klasyfikujemy urządzenie do jednego z czterech tierów. Profil tieru steruje
   WSZYSTKIM (czy w ogóle WebGL, oktawy mgławicy, Environment, DPR, akcenty,
   płynny scroll, kursor…). Detekcja jest PROAKTYWNA; uzupełnia ją REAKTYWNY
   watchdog (scene-stage.tsx), który w razie pomyłki obniża tier na żywo —
   razem pokrywają KAŻDE urządzenie, także nieznane.

   Architektura store'a = lustro src/lib/theme.ts: modułowy stan + pub/sub +
   useSyncExternalStore (SSR-safe). getServerSnapshot = "high" (neutralny —
   hero i tak jest „poster-first" i dociąga 3D dopiero po montażu na kliencie,
   więc SSR nic ciężkiego nie renderuje). Realny tier liczony jest LENIWIE i
   SYNCHRONICZNIE przy pierwszym odczycie na kliencie (zero sieci), dzięki czemu
   hero może zdecydować „montować 3D czy nie" zanim w ogóle pobierze chunk
   three.js — najsłabsze urządzenia NIGDY go nie ściągają.
   ══════════════════════════════════════════════════════════════════════════ */

export type Tier = "static" | "low" | "medium" | "high";

/** Kolejność od najsłabszego do najmocniejszego (indeks = „moc”). */
export const TIER_ORDER: Tier[] = ["static", "low", "medium", "high"];

export interface TierProfile {
  /** Czy w ogóle montować WebGL (false → dopracowany statyczny poster). */
  webgl: boolean;
  /** Oktawy fbm mgławicy — GŁÓWNY koszt fill-rate (boot, wkompilowane w shader). */
  octaves: number;
  /** Precyzja fragmentów mgławicy (boot). */
  precision: "highp" | "mediump";
  /** Rozdzielczość PMREM <Environment>; null = brak (boot) → tanie światło zastępcze. */
  envRes: number | null;
  /** Liczba gwiazd (boot). */
  stars: number;
  /** Liczba pyłków (boot). */
  motes: number;
  /** Górny limit DPR (live — watchdog może zejść w dół). */
  dprCap: number;
  /** MSAA na canvasie (boot). */
  msaa: boolean;
  /** Kosmiczny akcent „orbity” pod Usługami (osobny kontekst WebGL). */
  accents: boolean;
  /** Canvas „świtu” w Statement (osobny kontekst WebGL). */
  horizon: boolean;
  /** Płynny scroll Lenis (CPU co klatkę). */
  smoothScroll: boolean;
  /** Własny kursor (rAF). */
  cursor: boolean;
}

/* ── Profile tierów ────────────────────────────────────────────────────────
   high = DOKŁADNIE obecny produkcyjny stan (mocny sprzęt nic nie traci).
   medium = solidny laptop/tablet bez słabych sygnałów: hero + świt, bez orbit,
            DPR≤1.25, Environment 64, bez MSAA.
   low    = słaby laptop (Intel HD) / starszy telefon: SAM hero, 2 oktawy,
            mediump, BEZ Environment (tanie światło), DPR 1, bez orbit/świtu,
            bez płynnego scrolla i kursora.
   static = brak/sw WebGL, save-data, bardzo słaby sprzęt: ZERO WebGL — czysty,
            dopracowany poster + cała treść (H1/CTA/sekcje) jak zawsze. */
export const TIER_PROFILES: Record<Tier, TierProfile> = {
  static: {
    webgl: false,
    octaves: 0,
    precision: "mediump",
    envRes: null,
    stars: 0,
    motes: 0,
    dprCap: 1,
    msaa: false,
    accents: false,
    horizon: false,
    smoothScroll: false,
    cursor: false,
  },
  low: {
    webgl: true,
    octaves: 2,
    precision: "mediump",
    // envRes 32 = TANI PMREM (one-time, nie per-klatkę) → litery dostają odbicia
    // (premium) zamiast płaskiej matowości; ogromny skok jakości na low. dpr 1.25
    // łagodzi schodki na krawędziach (watchdog zejdzie do 1 gdy realnie za słabo).
    envRes: 32,
    stars: 200,
    motes: 90,
    dprCap: 1.25,
    msaa: false,
    accents: false,
    horizon: false,
    smoothScroll: false,
    cursor: false,
  },
  medium: {
    webgl: true,
    octaves: 3,
    precision: "highp",
    envRes: 64,
    stars: 280,
    motes: 120,
    dprCap: 1.5, // 1.25→1.5: ostrzejszy/płynniejszy obraz przy scrollu, bliżej high
    msaa: false,
    accents: false,
    horizon: true,
    smoothScroll: true,
    cursor: true,
  },
  high: {
    webgl: true,
    octaves: 4,
    precision: "highp",
    envRes: 128,
    stars: 460,
    motes: 200,
    dprCap: 1.75,
    msaa: true,
    accents: true,
    horizon: true,
    smoothScroll: true,
    cursor: true,
  },
};

/* ── Klasyfikacja GPU po stringu renderera ─────────────────────────────────
   GPU to najważniejszy sygnał dla strony fill-rate-bound, ale string jest
   WIARYGODNY tylko w Chrome/Edge/Android-Chrome i Brave-Standard; maskowany w
   Firefox (RFP/deprecacja), generyczny „Apple GPU" w Safari/iOS, farblowany w
   Brave-Aggressive. Dlatego to JEDEN z sygnałów, a logika ma bezpieczne fallbacki. */
const SOFTWARE_RX = /swiftshader|llvmpipe|software|microsoft basic|paravirtual|virtualbox|vmware/i;
/** Apple GPU (Safari/iOS = generyczne; macOS Chrome = „ANGLE (Apple…") → mocne. */
const APPLE_GPU_RX = /apple gpu|apple m\d|angle \(apple/i;
/** Mocne dGPU → high: RTX, Radeon RX, GTX, Arc + AMD 680M/780M (RDNA2/3, klasa dGPU). */
const STRONG_GPU_RX = /(rtx|radeon rx|geforce gtx|arc a[3-9]\d\d|quadro|titan|\brx [4-9]\d{2,3}\b|\brx \d{4}\b|radeon \d{3}m)/i;
/** Dolna półka dyskretnych (GTX 9/10/16xx, RX 4xx/5xx): high ≤1080p, ale na 1440p+
    (w*dpr≥2400) fill-rate pada → medium (detect-gpu: GTX1650@4K≈59fps, nasz shader cięższy). */
const ENTRY_DISCRETE_RX = /gtx (9|10|16)\d\d|\brx [45]\d\d\b/i;
/** Słabe GPU → low: Intel HD/UHD 5xx-6xx, Iris Plus/Pro/stare Iris (~1.1 TFLOPS),
    niskie Adreno/Mali. UHD 7xx WYKLUCZONE (lookahead → medium); Iris Xe NIE pasuje
    (osobno w MID — Iris Xe to ~1.4-2.2 TFLOPS = medium). */
const WEAK_GPU_RX =
  /\b(u)?hd graphics\b(?! 7\d\d)|iris (plus|pro|graphics)|gma|ironlake|sandybridge|ivybridge|mali-(4\d\d|t[0-9]|g3\d|g5[127])|adreno \(tm\) ([234]\d\d|5[01]\d|6[0-3]\d)|adreno ([23])\d\d|powervr|videocore|tegra/i;
/** Średnie GPU → medium: Iris Xe, AMD APU (Radeon(TM) Graphics / Vega), Intel UHD 7xx,
    słabe dGPU NVIDIA (MX1xx-5xx, GeForce GT). „(TM)" w „Radeon(TM) Graphics" obsłużone. */
const IRIS_MED_RX =
  /iris xe|radeon(\(tm\))? graphics|\bvega\b|uhd graphics 7\d\d|geforce mx\d|geforce gt[\s\d]/i;

interface GlProbe {
  ok: boolean;
  software: boolean;
  renderer: string;
}

function probeWebGL(): GlProbe {
  try {
    const canvas = document.createElement("canvas");
    const attrs: WebGLContextAttributes = {
      failIfMajorPerformanceCaveat: false,
      // high-performance: na hybrydzie (laptop/desktop z dGPU) sonda widzi DYSKRETNĄ
      // kartę — tak jak realna scena (też high-performance). low-power raportowałby
      // Intel iGPU i mocny PC z RTX błędnie zjechałby do low.
      powerPreference: "high-performance",
      depth: false,
      stencil: false,
      antialias: false,
    };
    const gl = (canvas.getContext("webgl2", attrs) ||
      canvas.getContext("webgl", attrs) ||
      canvas.getContext("experimental-webgl", attrs)) as WebGLRenderingContext | null;
    if (!gl) return { ok: false, software: false, renderer: "" };

    let renderer = "";
    try {
      const dbg = gl.getExtension("WEBGL_debug_renderer_info");
      if (dbg) renderer = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) || "");
      if (!renderer) renderer = String(gl.getParameter(gl.RENDERER) || "");
    } catch {
      /* renderer zamaskowany (Firefox RFP / Brave Aggressive) — zostają inne sygnały */
    }

    // Zwolnij kontekst sondy (nie trzymaj slotu WebGL — ważne na iOS).
    try {
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      /* noop */
    }
    return { ok: true, software: SOFTWARE_RX.test(renderer), renderer };
  } catch {
    return { ok: false, software: false, renderer: "" };
  }
}

/* ── Dev/override tieru ────────────────────────────────────────────────────
   ?tier=static|low|medium|high w URL lub localStorage('koda-tier') wymusza
   tier — bezcenne do testów (renderowanie i zrzuty każdego poziomu) oraz dla
   power-userów. Ignorowane, gdy wartość spoza zbioru. */
function readOverride(): Tier | null {
  try {
    const q = new URLSearchParams(window.location.search).get("tier");
    if (q && (TIER_ORDER as string[]).includes(q)) return q as Tier;
    const ls = window.localStorage.getItem("koda-tier");
    if (ls && (TIER_ORDER as string[]).includes(ls)) return ls as Tier;
  } catch {
    /* prywatny tryb / brak window */
  }
  return null;
}

/* ── Detekcja: konserwatywna przy „static”, watchdog łapie resztę ──────────
   Filozofia: NIE zabijaj 3D pochopnie (false-positive = mocny sprzęt bez
   animacji). „static” tylko przy jednoznacznych sygnałach (brak/sw WebGL,
   save-data, 2g, skrajnie słaby CPU+RAM). Dla reszty zaczynamy od „high” i
   schodzimy za każdy słaby sygnał; jeśli detekcja przepuści za słabe „low” —
   reaktywny watchdog (FPS) zejdzie niżej, aż do „static” (posteru). */
function detectTier(): Tier {
  if (typeof window === "undefined") return "high";

  const override = readOverride();
  if (override) return override;

  const mm = (q: string) => {
    try {
      return window.matchMedia(q).matches;
    } catch {
      return false;
    }
  };

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
    brave?: { isBrave?: () => unknown };
    maxTouchPoints?: number;
  };
  const ua = nav.userAgent || "";

  // ── Platforma/przeglądarka — sygnały, którym MOŻNA ufać ──
  // iPadOS 13+ udaje Maca (platform „MacIntel" + dotyk) → wykrywamy po touch.
  const isIPhone = /iPhone|iPod/.test(ua);
  const isIPad = /iPad/.test(ua) || (nav.platform === "MacIntel" && (nav.maxTouchPoints || 0) > 1);
  const isIOS = isIPhone || isIPad;
  const isBrave = typeof nav.brave?.isBrave === "function"; // obiekt navigator.brave istnieje tylko w Brave
  const isFirefox = /firefox/i.test(ua);

  const reducedData = mm("(prefers-reduced-data: reduce)");
  const coarse = mm("(pointer: coarse)");
  const w = window.innerWidth || 1280;
  const dpr = window.devicePixelRatio || 1;
  const cores = nav.hardwareConcurrency || 4;
  const mem = nav.deviceMemory; // tylko Chromium (Safari/Firefox: undefined)
  const conn = nav.connection;
  const saveData = !!conn?.saveData;
  const eff = conn?.effectiveType;

  const gl = probeWebGL();
  // Strip „(R)" (®) — realne stringi to „Intel(R) Iris(R) Xe Graphics", przez co
  // `iris xe` by nie pasowało. „(TM)" zostaje (obsłużone jawnie w regexach: adreno/radeon).
  const renderer = gl.renderer.replace(/\(r\)/gi, "");
  const isAppleGPU = APPLE_GPU_RX.test(renderer);
  // „czytelny" renderer = niepusty i nie generyczny Apple (Apple = osobna ścieżka).
  const readable = renderer.trim().length > 3 && !isAppleGPU;
  const memKnown = typeof mem === "number";
  // hardwareConcurrency jest BEZWARTOŚCIOWE jako sygnał słabości gdy: iOS (WebKit
  // clamp 2), Brave (farbling 2..8), Firefox-RFP (clamp 2). Wtedy NIE schodzimy z cores.
  const coresTrusted = !isBrave && !isIOS && !(isFirefox && cores === 2);

  // ── 1. STATIC (twarda bramka) ──
  if (!gl.ok || gl.software) return "static";
  if (reducedData || saveData) return "static";
  if (eff === "slow-2g" || eff === "2g") return "static";
  // Realnie najsłabszy sprzęt: niskie rdzenie I niski RAM — OBA muszą być PRAWDZIWE
  // (cores zaufane + mem znane), inaczej iOS/Brave wpadałyby fałszywie w static.
  if (coresTrusted && cores <= 2 && memKnown && (mem as number) <= 2) return "static";

  // ── 2. iOS/iPadOS — cores=2 (clamp WebKit) bezużyteczne → decyzja po klasie ──
  if (isIPhone) return "low"; // iPhone: sam hero; watchdog → static gdy stary rzęzi
  if (isIPad) return "medium"; // każdy iPad (z Pro): hero+świt, bez orbit, 1 dod. kontekst

  // ── 3. Apple desktop (Mac). Apple Silicon (cores=8 clamp) → high. Stary Intel
  //       MacBook Air (Iris Plus + Retina, dual-core → cores≤4, też „Apple GPU"
  //       w Safari) ma słaby fill-rate na Retinie → low. ──
  if (!coarse && isAppleGPU) return cores <= 4 ? "low" : "high";

  // ── 4. Mocne dGPU (RTX/Radeon RX/GTX/Arc) → high, NAWET przy coarse ──
  // Te karty występują WYŁĄCZNIE w laptopach/desktopach (też DOTYKOWYCH) — nigdy
  // w telefonach/tabletach (tam Adreno/Mali/Apple). Więc coarse (dotykowy laptop)
  // NIE może ich błędnie zdegradować (bug Natana: RTX 5060 dotykowy w Brave → medium).
  // WYJĄTEK: dolna półka (GTX 9/10/16xx, RX 4xx/5xx) na 1440p+ → medium (fill-rate).
  if (readable && STRONG_GPU_RX.test(renderer)) {
    if (ENTRY_DISCRETE_RX.test(renderer) && w * dpr >= 2400) return "medium";
    return "high";
  }

  // ── 5. Brave / maskowany desktop: cores=szum → nie karać; arbiter = watchdog ──
  if (!coarse && !coresTrusted) {
    if (readable && WEAK_GPU_RX.test(renderer)) return "low";
    if (readable && IRIS_MED_RX.test(renderer)) return "medium";
    return "medium"; // start bezpieczny (nie high/low); watchdog ↑/↓ + override rozstrzyga
  }

  // ── 6. Reszta: start „high", schodź za KAŻDY ZAUFANY słaby sygnał ──
  let lvl = 3; // 3=high 2=medium 1=low
  const cap = (n: number) => {
    if (n < lvl) lvl = n;
  };

  if (readable) {
    if (WEAK_GPU_RX.test(renderer)) cap(1);
    else if (IRIS_MED_RX.test(renderer)) cap(2);
  }
  if (coresTrusted) {
    if (cores <= 4) cap(1);
    else if (cores <= 6) cap(2);
  }
  if (memKnown) {
    if ((mem as number) <= 3) cap(1);
    else if ((mem as number) <= 4) cap(2);
  }
  if (eff === "3g") cap(1);
  if (coarse) {
    // Telefon → low, tablet (≥768) → medium (mobilny fill-rate; bohater = hero).
    if (w < 768) cap(1);
    else cap(2);
  }
  // HiDPI na słabym CPU (≤4 wątki) = morderczy fill-rate. Apple wykluczone (krok 3).
  if (!coarse && dpr >= 2 && coresTrusted && cores <= 4 && !isAppleGPU) cap(2);
  // 4K/5K na słabszym CPU (≤6 wątków) → medium (mocny desktop zostaje high).
  if (!coarse && w * dpr >= 3000 && coresTrusted && cores <= 6 && !isAppleGPU) cap(2);

  return TIER_ORDER[Math.max(1, lvl)]; // 1..3 (static obsłużone wyżej)
}

/* ── Store (pub/sub + useSyncExternalStore) ───────────────────────────────── */
let current: Tier | null = null; // liczone leniwie przy 1. odczycie na kliencie
const subs = new Set<() => void>();

/** Bieżący tier (po ewentualnych downgrade'ach watchdoga). Liczy detekcję raz. */
export function getTier(): Tier {
  if (current === null) current = detectTier();
  return current;
}

/** Profil bieżącego tieru. */
export function getTierProfile(): TierProfile {
  return TIER_PROFILES[getTier()];
}

function emit() {
  subs.forEach((f) => f());
}

/** Czy tier jest WYMUSZONY (?tier= / localStorage). Wtedy watchdog go NIE rusza —
    explicytny wybór (test/power-user) ma być stabilny. */
export function isTierForced(): boolean {
  return typeof window !== "undefined" && readOverride() !== null;
}

/** Watchdog: zejdź O JEDEN poziom (jednokierunkowo). Zwraca nowy tier.
    Boot-parametry sceny (oktawy/Environment/cząstki/geometria) są ZAMROŻONE w
    momencie montażu — downgrade rusza tylko rzeczy bezpieczne na żywo (DPR,
    widoczność warstw, finalnie swap canvas→poster).
    NO-OP gdy tier wymuszony (?tier=) — inaczej test „?tier=low" sam zjeżdżał do
    static po ~10 s (litery „znikały"). */
export function downgradeTier(): Tier {
  if (isTierForced()) return getTier();
  const t = getTier();
  const i = TIER_ORDER.indexOf(t);
  if (i > 0) {
    current = TIER_ORDER[i - 1];
    emit();
  }
  return current as Tier;
}

/** Ręczne ustawienie tieru (dev/testy — np. z konsoli). */
export function setTier(t: Tier): void {
  current = t;
  emit();
}

function subscribe(cb: () => void): () => void {
  subs.add(cb);
  return () => {
    subs.delete(cb);
  };
}

/** Reaktywny tier (React). SSR/hydracja = "high" (neutralny; hero i tak jest
    poster-first), po hydracji przeskakuje na realny — wzorzec useSyncExternalStore. */
export function useTier(): Tier {
  return useSyncExternalStore(
    subscribe,
    () => getTier(),
    () => "high"
  );
}

/** Reaktywny profil bieżącego tieru. */
export function useTierProfile(): TierProfile {
  return TIER_PROFILES[useTier()];
}

/** Subskrypcja dla konsumentów spoza Reacta (np. vanilla rAF). */
export function subscribeTier(cb: () => void): () => void {
  return subscribe(cb);
}

/* Dev-only: most do konsoli — testowanie tierów i ścieżki downgrade watchdoga
   na żywo (np. __kodaSetTier('low') ma zdjąć orbity/świt, __kodaSetTier('static')
   ma zamienić hero na poster). W produkcji nic nie robi. */
if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
  const w = window as unknown as Record<string, unknown>;
  w.__kodaGetTier = () => getTier();
  w.__kodaSetTier = (t: Tier) => setTier(t);
  w.__kodaDowngrade = () => downgradeTier();
  // Diagnostyka „dlaczego ten tier": pokazuje DOKŁADNIE sygnały, które widzi
  // detectTier (sonda high-performance, coarse, flagi platformy, dopasowania GPU).
  w.__kodaTierDebug = () => {
    const p = probeWebGL();
    const n = navigator as Navigator & { brave?: { isBrave?: () => unknown }; deviceMemory?: number };
    const readable = p.renderer.trim().length > 3 && !APPLE_GPU_RX.test(p.renderer);
    return {
      tier: getTier(),
      coarse: (() => {
        try {
          return window.matchMedia("(pointer: coarse)").matches;
        } catch {
          return false;
        }
      })(),
      renderer: p.renderer,
      rendererReadable: readable,
      gpuStrong: readable && STRONG_GPU_RX.test(p.renderer),
      gpuWeak: readable && WEAK_GPU_RX.test(p.renderer),
      gpuIris: readable && IRIS_MED_RX.test(p.renderer),
      isAppleGPU: APPLE_GPU_RX.test(p.renderer),
      isBrave: typeof n.brave?.isBrave === "function",
      cores: navigator.hardwareConcurrency,
      deviceMemory: n.deviceMemory ?? null,
      dpr: window.devicePixelRatio,
      width: window.innerWidth,
    };
  };
}
