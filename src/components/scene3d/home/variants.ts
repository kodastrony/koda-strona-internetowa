/* ── Konfiguracje wariantów totemu (A/B/C) ────────────────────────────────
   Osobny, LEKKI moduł (zero three.js) — strony importują go statycznie do
   metadanych/labeli, a ciężka scena (home-totem) dociąga się dynamicznie. */

export interface TotemVariantCfg {
  id: "a" | "b" | "c";
  depth: number;
  bevel: number;
  spin: {
    rest: number;
    scrollAmt: number;
    scrollAmtMobile: number;
    /** Perpetualny obrót (rad/s) — koło zamachowe wariantu B. */
    idle: number;
    k: number;
    damp: number;
    ptr: number;
    /** Follow-through liter (mnożnik prędkości obrotu). */
    lag: number;
  };
  key: { azStart: number; azRest: number; azScroll: number; sway: number };
  rim: { base: number; scroll: number };
  cosmos: { c1Breathe: number; starMul: number; c1Mul: number };
  intro: "rise" | "arc" | "light";
}

export const TOTEM_VARIANTS: Record<"a" | "b" | "c", TotemVariantCfg> = {
  /* A „Monolit" — DNA S5: spokojna godność, scroll = obrót sprężyną z pędem. */
  a: {
    id: "a",
    depth: 0.5,
    bevel: 0.024,
    spin: {
      rest: 0.16,
      scrollAmt: 4.4,
      scrollAmtMobile: 3.1,
      idle: 0,
      k: 24,
      damp: 5.2,
      ptr: 0.16,
      lag: 0.045,
    },
    key: { azStart: -1.4, azRest: 0.62, azScroll: 1.05, sway: 0.05 },
    rim: { base: 0.34, scroll: 0.2 },
    cosmos: { c1Breathe: 0, starMul: 1, c1Mul: 1 },
    intro: "rise",
  },
  /* B „Orbita" — perpetuum: stały wolny obrót + scroll jako koło zamachowe;
     litery wchodzą po orbitalnym łuku; kosmos żywszy. */
  b: {
    id: "b",
    depth: 0.46,
    bevel: 0.022,
    spin: {
      rest: 0.1,
      scrollAmt: 5.2,
      scrollAmtMobile: 3.6,
      idle: 0.11,
      k: 17,
      damp: 3.6,
      ptr: 0.2,
      lag: 0.06,
    },
    key: { azStart: -1.7, azRest: 0.5, azScroll: 0.85, sway: 0.16 },
    rim: { base: 0.4, scroll: 0.18 },
    cosmos: { c1Breathe: 0.18, starMul: 1.25, c1Mul: 1.06 },
    intro: "arc",
  },
  /* C „Reflektor" — światłocień: kolumna frontalna (scroll = dostojny pochył),
     klucz światła jedzie szerokim azymutem, cień wydłuża się jak wskazówka. */
  c: {
    id: "c",
    depth: 0.62,
    bevel: 0.028,
    spin: {
      rest: 0.22,
      scrollAmt: 1.0,
      scrollAmtMobile: 0.8,
      idle: 0,
      k: 30,
      damp: 6.5,
      ptr: 0.1,
      lag: 0.03,
    },
    key: { azStart: -1.35, azRest: 0.55, azScroll: 2.1, sway: 0.03 },
    rim: { base: 0.22, scroll: 0.3 },
    cosmos: { c1Breathe: 0, starMul: 0.75, c1Mul: 0.85 },
    intro: "light",
  },
};
