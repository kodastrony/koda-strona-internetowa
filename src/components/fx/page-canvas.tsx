"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue } from "motion/react";
import { useThemeValue } from "@/lib/theme";

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

/** data-canvas id → hold color. Bazowy kolor CAŁEGO tła (sceny 3D malują już
 *  TYLKO światło NA tym — patrz cosmos/accents). Dark = analogiczny łuk hue
 *  z WYRAŹNĄ tożsamością każdego beatu (żeby zjazd „żył", a nie był jednolitą
 *  czernią), ale wciąż niska luminancja (zero „PowerPointu"/flashbangu):
 *  kosmos → fiolet (usługi) → chłodny indygo (proces, najzimniejszy punkt) →
 *  ciepła róża (FAQ) → plumowy świt (statement) → ciepła czerń (stopka).
 *  hero MUSI = SCENE_DARK.bg (#0b0b0d): mgławica odejmuje uBg, więc puste pole
 *  sceny = ten hold (zero szwu). */
const HOLDS: Record<string, string> = {
  hero: "#0b0b0d",
  base: "#0b0b0d",
  services: "#16111f",
  tint: "#16111f",
  work: "#0e0b13",
  process: "#0b1120",
  faq: "#1b0f16",
  // Statement = ŚWIT NAD PLANETĄ: deep plum-black (NIE jasny plum slab) — finał
  // płynnie CIEMNIEJE faq → statement → footer #0a0609 (zero plumowego „garbu"
  // /szwów), a różowy świt horyzontu świeci na czystym ciemnym kosmosie.
  statement: "#1d0a18",
  cta: "#30132a",
  footer: "#0a0609",
  // HOME: stopka siedzi pod ciemnym Statementem („świt"). Osobny hold = ten sam
  // ciemny kolor co `footer` → w trybie CIEMNYM bez żadnej różnicy. Sens ma w
  // jasnym (LIGHT_HOLDS niżej): tam musi zostać CIEMNY, by scrub statement→stopka
  // nie rozjaśniał kanwy (prześwit przez półprzezroczysty horyzont = „biały pas").
  "footer-home": "#0a0609",
};

/** Jasny motyw: odpowiedniki holdów (subtelne pastele — papier z światłem).
 *  PageCanvas wchłonął dawny LightWeather: JEDEN element tła dla obu motywów. */
const LIGHT_HOLDS: Record<string, string> = {
  hero: "#f7f4f8",
  base: "#f7f4f8",
  services: "#f3eef8",
  tint: "#f3eef8",
  work: "#f7f4f8",
  process: "#eff0f8",
  faq: "#f9eef5",
  // Statement = ciemna wyspa „świtu nad planetą" w OBU motywach (jak stopka):
  // horyzont (ciemny kosmos + różowy świt) potrzebuje ciemnego tła, a biały
  // tekst klimaksu jest czytelny. Finał: ciemny horyzont → ciemna stopka.
  statement: "#160a14",
  cta: "#f2e3ee",
  // Stopka hold JASNY — żeby na PODSTRONACH jasny CTA (CTABand) został jasny aż do
  // krawędzi stopki (życzenie usera: bez ciemnienia CTA, jak było). Subpages =
  // data-canvas="footer".
  footer: "#efe9f1",
  // ★ HOME = data-canvas="footer-home" (footer.tsx wg trasy): CIEMNY hold także w
  // jasnym motywie. Bez tego scrub statement(#160a14)→footer(#efe9f1) rozjaśniał
  // CAŁĄ kanwę przy zjeździe do stopki, a niebo świtu jest półprzezroczyste →
  // jasna kanwa prześwitywała = „biały pas / rozjaśnianie poniżej sekcji". Teraz
  // statement→footer-home zostaje ciemny do końca (świt gaśnie w ciemność, jak
  // chce user). Stopka-element i tak jest ciemną wyspą (globals: html[data-koda-light]
  // footer). Sam dół home = ciemny mimo light theme, dokładnie jak prosił user.
  "footer-home": "#0a0609",
};

const FALLBACK = "#0b0b0d";
const FALLBACK_LIGHT = "#f7f4f8";
// Kolor PIERWSZEJ klatki canvasu (przed hydracją) — z CSS-zmiennej sterowanej
// motywem PRZED malowaniem (globals: :root #0b0b0d / html[data-koda-light]
// #f7f4f8). NIE z propa theme: useThemeValue() przy SSR/hydracji ma snapshot
// "dark", więc inline-style wpisywał #0b0b0d → na jasnym motywie CIEMNY błysk
// canvasu przez ułamek sekundy. Zmienna = poprawny motyw od 1. klatki; measure()
// i tak nadpisze hexem (scrub) tuż po hydracji (useLayoutEffect, przed paintem).
const CANVAS_FALLBACK_VAR = "var(--canvas-fallback)";

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

function colorAt(stops: Stops | null, p: number, fallback: string): string {
  if (!stops || !stops.at.length) return fallback;
  const { at, lch } = stops;
  if (p <= at[0]) return lchToHex(lch[0]);
  for (let i = 1; i < at.length; i++) {
    if (p <= at[i]) {
      const span = at[i] - at[i - 1];
      const t = span > 0 ? (p - at[i - 1]) / span : 1;
      // smoothstep: kolor rusza i dochodzi MIĘKKO (slow-in/slow-out), więc
      // przejścia nie mają wyczuwalnego startu/stopu — „ściemniacz", nie slajd.
      const e = t * t * (3 - 2 * t);
      return lchToHex(mixOklch(lch[i - 1], lch[i], e));
    }
  }
  return lchToHex(lch[lch.length - 1]);
}

export function PageCanvas() {
  const pathname = usePathname();
  const theme = useThemeValue();
  const light = theme === "light";
  const stopsRef = useRef<Stops | null>(null);
  // Init = CSS-zmienna (poprawny motyw na 1. klatce, bez błysku — patrz wyżej).
  // measure() ustawi właściwy hex w useLayoutEffect (przed pierwszym paintem po
  // hydracji), więc zmienna jest realnie widoczna tylko w klatkach pre-hydracji.
  const bg = useMotionValue<string>(CANVAS_FALLBACK_VAR);

  const measure = useCallback(() => {
    const holds = light ? LIGHT_HOLDS : HOLDS;
    const fallback = light ? FALLBACK_LIGHT : FALLBACK;
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-canvas]"));
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (!els.length || total <= 0) {
      stopsRef.current = null;
      bg.set(fallback);
      return;
    }

    const vh = window.innerHeight;
    const scrollY = window.scrollY;
    const colorOf = (el: HTMLElement): string => {
      const id = el.dataset.canvas ?? "";
      const c = holds[id];
      if (!c && process.env.NODE_ENV !== "production") {
        console.warn(`[PageCanvas] nieznane data-canvas="${id}" — używam fallbacku`);
      }
      return c ?? fallback;
    };

    const at: number[] = [0];
    const colors: string[] = [colorOf(els[0])];

    for (let i = 1; i < els.length; i++) {
      const prev = colors[colors.length - 1];
      const next = colorOf(els[i]);
      if (next === prev) continue; // ten sam hold — brak szwu

      // Strefa przejścia ≈ CAŁY viewport: kolor wędruje przez prawie cały ekran
      // scrolla (zaczyna gdy szew jest ~0.92vh nad dołem, kończy tuż przy górze)
      // — bardzo stopniowy „świt"/zmierzch, nigdy pstryczek. + smoothstep w
      // colorAt = miękki start i koniec. Razem: zero „prezentacji PowerPoint".
      const seamY = els[i].getBoundingClientRect().top + scrollY;
      let aY = seamY - 0.92 * vh;
      let bY = seamY - 0.06 * vh;
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
    bg.set(colorAt(stopsRef.current, scrollY, fallback));
  }, [bg, light]);

  // useLayoutEffect: pierwszy pomiar PRZED malowaniem klatki (deep-linki typu
  // /#faq dostają od razu właściwy kolor zamiast błysku czerni).
  useLayoutEffect(() => {
    // Scrub działa na KAŻDYM tierze (redesign 2026-06-21): koszt to ≈0,18 µs/
    // klatkę (math) + jeden solid-fill repaint promowanej warstwy fixed — najtańszy
    // możliwy paint. Brak scrubu rozjeżdżał WYGLĄD (utrata holdów per sekcja →
    // m.in. ciemna wyspa Statement robiła się jasna). Maszyneria measure/scroll/
    // rAF/RO jest lekka i bezpieczna także na telefonie (scroll natywny ją karmi).
    measure();

    // Własny listener scrolla (passive) zamiast useScroll: progi i odczyt są
    // w TEJ SAMEJ skali (px dokumentu) — żaden cudzy „total" się nie rozjedzie.
    const fallback = light ? FALLBACK_LIGHT : FALLBACK;
    // Throttle do rAF: scroll potrafi sypać wiele zdarzeń na klatkę (zwł. z
    // Lenis) — koalescencja do JEDNEJ aktualizacji koloru na klatkę zdejmuje
    // zbędną pracę z głównego wątku (lżej na słabym CPU), bez zmiany efektu.
    let scrollRaf = 0;
    const onScroll = () => {
      if (scrollRaf) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        bg.set(colorAt(stopsRef.current, window.scrollY, fallback));
      });
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
      if (scrollRaf) cancelAnimationFrame(scrollRaf);
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("resize", remeasure);
      window.visualViewport?.removeEventListener("resize", remeasure);
    };
  }, [measure, bg, pathname, light]);

  // Pastelowa poświata jasnego motywu (dawny LightWeather). Opacity z CSS-zmiennej
  // (--canvas-pastel-opacity: 0 ciemny / 1 jasny, ustawiana html[data-koda-light]
  // PRZED malowaniem) — poprawna od 1. klatki na jasnym wczytaniu (JS-owy `light`
  // miał snapshot SSR="dark" → rogi wfadowywały się 700 ms po hydracji). transition
  // wciąż animuje crossfade przy ręcznym ☀/☾ (zmienna zmienia się z atrybutem).
  const pastel = (
    <div
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-700 ease-out"
      style={{
        opacity: "var(--canvas-pastel-opacity)",
        // Pastelowa „pogoda" papieru — różowo-fioletowo-indygowe światło w rogach
        // (echo ciemnej aurory marki). Trochę mocniejsze niż wcześniej + trzeci,
        // indygowy akcent u dołu = porcelana ŻYJE kolorem, nie jest płaska. Alfy
        // niskie (0.06–0.10) → wciąż lekka i przewiewna, bez „brudu".
        background:
          "radial-gradient(56% 42% at 13% 5%, rgba(207,67,184,0.10) 0%, rgba(207,67,184,0) 68%)," +
          "radial-gradient(50% 38% at 90% 11%, rgba(124,76,222,0.09) 0%, rgba(124,76,222,0) 70%)," +
          "radial-gradient(64% 44% at 82% 94%, rgba(77,98,224,0.06) 0%, rgba(77,98,224,0) 72%)",
      }}
    />
  );

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
      // translateZ(0): własna warstwa kompozytora. Kolor tła zmienia się co klatkę
      // scrolla NA KAŻDYM tierze (też mobile) — promocja trzyma ten repaint w
      // izolowanej warstwie, zamiast brudzić korzeń z treścią/grainem nad spodem.
      style={{ backgroundColor: bg, transform: "translateZ(0)" }}
    >
      {pastel}
    </motion.div>
  );
}
