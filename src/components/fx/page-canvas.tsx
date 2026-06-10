"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue } from "motion/react";

/* ══════════════════════════════════════════════════════════════════════════
   PageCanvas — ONE scroll-scrubbed background for the whole page.

   Zamiast per-sekcyjnych teł i mostków `to-transparent` (twarde szwy =
   „PowerPoint"), strona ma JEDEN fixed div, którego kolor jest czystą funkcją
   pozycji scrolla. Szew przestaje być linią pikseli — staje się ZAKRESEM
   scrolla (~0.45 viewportu), a bezwładność Lenis wygładza go za darmo.

   Sekcje deklarują swój „hold" przez data-canvas="<id>" (mapa HOLDS niżej)
   i same są PRZEZROCZYSTE. Między holdami kolor jest mieszany per klatkę
   w OKLCH (hue po najkrótszej drodze) — róż przechodzi w czerń po stałym
   hue ~335 zamiast przez błotnistą szarość sRGB.

   Architektura bez setState: pomiar zapisuje segmenty do refa, a subskrypcja
   scrollYProgress pisze kolor wprost do MotionValue (zero re-renderów).

   ⚠ INWARIANT MONTAŻU: ten element musi pozostać dzieckiem drzewa BEZ
   przodka z transform/filter/will-change (fixed liczyłby się względem niego)
   i BEZ przodka malującego własne tło nad nim. Działa, bo tło dokumentu
   pochodzi z <body> (html nie ma tła → body bg propaguje na canvas
   dokumentu), a -z-10 maluje NAD canvasem dokumentu i POD całą treścią.
   Wrapper z tłem/transformem między body a tym divem = canvas znika bez
   żadnego błędu. Acceptance check: paint-flashing w DevTools pokazuje przy
   scrollu wyłącznie repaint tego diva.
   ══════════════════════════════════════════════════════════════════════════ */

/** data-canvas id → hold color. Wartości = tokeny --color-canvas-* (globals.css). */
const HOLDS: Record<string, string> = {
  hero: "#0b0b0d",
  base: "#0b0b0d",
  services: "#15121b",
  tint: "#15121b",
  work: "#0b0b0d",
  process: "#11131c",
  faq: "#1a1017",
  statement: "#521648",
  cta: "#30132a",
  footer: "#0a0609",
};

const FALLBACK = "#0b0b0d";

/* ── OKLCH math (wystarczająco mała, żeby nie ciągnąć biblioteki) ────────── */

type Lch = { L: number; C: number; h: number };

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function linearToSrgb(c: number): number {
  const v = c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return Math.min(1, Math.max(0, v));
}

function hexToLch(hex: string): Lch {
  const n = parseInt(hex.slice(1), 16);
  const r = srgbToLinear(((n >> 16) & 255) / 255);
  const g = srgbToLinear(((n >> 8) & 255) / 255);
  const b = srgbToLinear((n & 255) / 255);

  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);

  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;

  return { L, C: Math.hypot(a, bb), h: (Math.atan2(bb, a) * 180) / Math.PI };
}

function lchToHex({ L, C, h }: Lch): string {
  const rad = (h * Math.PI) / 180;
  const a = C * Math.cos(rad);
  const bb = C * Math.sin(rad);

  const l = (L + 0.3963377774 * a + 0.2158037573 * bb) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * bb) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * bb) ** 3;

  const r = linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const b = linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);

  const to255 = (v: number) => Math.round(v * 255);
  return `#${((1 << 24) | (to255(r) << 16) | (to255(g) << 8) | to255(b)).toString(16).slice(1)}`;
}

/** Mix in OKLCH, hue po najkrótszej drodze; przy ~zerowej chromie hue bierze
 *  drugą stronę (czerń nie ma sensownego hue — nie wolno przez nią „kręcić"). */
function mixOklch(A: Lch, B: Lch, t: number): Lch {
  let ha = A.h;
  let hb = B.h;
  if (A.C < 0.005) ha = hb;
  if (B.C < 0.005) hb = ha;
  let dh = hb - ha;
  if (dh > 180) dh -= 360;
  if (dh < -180) dh += 360;
  return { L: A.L + (B.L - A.L) * t, C: A.C + (B.C - A.C) * t, h: ha + dh * t };
}

/* ────────────────────────────────────────────────────────────────────────── */

/** Punkty łamanej koloru W PIKSELACH scrollY dokumentu: w `at[i]` kanwa ma
 *  kolor `lch[i]`; pomiędzy — mieszanie OKLCH. Px zamiast progressu 0–1:
 *  zero rozjazdu skali z czyimkolwiek „total" (motion liczy własny). */
interface Stops {
  at: number[];
  lch: Lch[];
}

function colorAt(stops: Stops | null, p: number): string {
  if (!stops || !stops.at.length) return FALLBACK;
  const { at, lch } = stops;
  if (p <= at[0]) return lchToHex(lch[0]);
  for (let i = 1; i < at.length; i++) {
    if (p <= at[i]) {
      const span = at[i] - at[i - 1];
      const t = span > 0 ? (p - at[i - 1]) / span : 1;
      return lchToHex(mixOklch(lch[i - 1], lch[i], t));
    }
  }
  return lchToHex(lch[lch.length - 1]);
}

export function PageCanvas() {
  const pathname = usePathname();
  const stopsRef = useRef<Stops | null>(null);
  const bg = useMotionValue<string>(FALLBACK);

  const measure = useCallback(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-canvas]"));
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (!els.length || total <= 0) {
      stopsRef.current = null;
      bg.set(FALLBACK);
      return;
    }

    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    const colorOf = (el: HTMLElement): string => {
      const id = el.dataset.canvas ?? "";
      const c = HOLDS[id];
      if (!c && process.env.NODE_ENV !== "production") {
        console.warn(`[PageCanvas] nieznane data-canvas="${id}" — używam fallbacku`);
      }
      return c ?? FALLBACK;
    };

    const at: number[] = [0];
    const colors: string[] = [colorOf(els[0])];

    for (let i = 1; i < els.length; i++) {
      const prev = colors[colors.length - 1];
      const next = colorOf(els[i]);
      if (next === prev) continue; // ten sam hold — brak szwu

      // Strefa przejścia: zaczyna się gdy szew jest 55% wysokości viewportu nad
      // dołem ekranu, kończy gdy dociera blisko góry — nowy kolor „przychodzi"
      // gdy granica mija środek ekranu (zmierzch, nie pstryczek).
      const seamY = els[i].getBoundingClientRect().top + scrollY;
      let aY = seamY - 0.55 * vh;
      let bY = seamY - 0.1 * vh;
      // Szwy przy końcu dokumentu (stopka) wypadają za maks. scrollem — dosuń
      // okno w górę, żeby ostatni hold ZDĄŻYŁ w pełni przyjść.
      if (bY > total) {
        aY -= bY - total;
        bY = total;
      }
      at.push(aY, bY);
      colors.push(prev, next);
    }

    // colorAt wymaga ściśle rosnących progów (clamp ujemnych startów, krótkich
    // sekcji, duplikatów). Progi w px scrollY dokumentu.
    for (let i = 1; i < at.length; i++) at[i] = Math.max(at[i], at[i - 1] + 0.5);
    // …i NIC nie może wypaść za maks. scroll: gdy DWA końcowe szwy się nakładają
    // (cta+footer na wysokich viewportach, vh ≳ 1280), forward-clamp wypchnąłby
    // ostatnie progi za `total` → ostatni hold (ciepła stopka) nigdy by nie
    // przyszedł. Dociskamy od końca z zachowaniem ścisłej monotoniczności —
    // przy za krótkiej stronie okna łagodnie kolabują, ale finał ZAWSZE dojeżdża.
    let cap = total;
    for (let i = at.length - 1; i >= 1; i--) {
      if (at[i] > cap) at[i] = cap;
      cap = at[i] - 0.5;
    }

    stopsRef.current = { at, lch: colors.map(hexToLch) };
    bg.set(colorAt(stopsRef.current, scrollY));
  }, [bg]);

  // useLayoutEffect: pierwszy pomiar PRZED malowaniem klatki (deep-linki typu
  // /#faq dostają od razu właściwy kolor zamiast błysku czerni).
  useLayoutEffect(() => {
    measure();

    // Własny listener scrolla (passive) zamiast useScroll: progi i odczyt są
    // w TEJ SAMEJ skali (px dokumentu) — żaden cudzy „total" się nie rozjedzie.
    const onScroll = () => {
      bg.set(colorAt(stopsRef.current, window.scrollY));
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    let raf = 0;
    const remeasure = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        measure();
      });
    };

    // Wysokość dokumentu zmienia się po fontach/obrazkach/akordeonach — RO na
    // <html> to łapie. visualViewport łapie pasek adresu iOS (innerHeight
    // zmienia się bez zmiany wysokości html).
    const ro = new ResizeObserver(remeasure);
    ro.observe(document.documentElement);
    window.addEventListener("resize", remeasure);
    window.visualViewport?.addEventListener("resize", remeasure);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", remeasure);
      window.visualViewport?.removeEventListener("resize", remeasure);
    };
  }, [measure, bg, pathname]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ backgroundColor: bg }}
    />
  );
}
