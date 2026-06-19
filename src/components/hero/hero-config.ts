/* ══════════════════════════════════════════════════════════════════════════
   hero-config — stałe oprawy hero strony głównej (design „baunfire 2D").

   Hero = pionowa kolumna „KODA" (font logo Syne) na ciemnej aurorze, z intro
   „dwóch linii": linia L→P odkrywa TŁO, linia P→L (przez napis) odkrywa docelowe
   kolory KODA — obie krzyżują się w środku liter (geometria mierzona w runtime).
   Aurora u dołu hero rozpływa się w globalny PageCanvas → płynne przejście do
   następnej sekcji („jeden świat").

   Napis KODA = PÓŁPRZEZROCZYSTE „szkło indygo" w barwach aurory (fiolet 288°,
   indygo 266°) — żywe tło prześwituje przez litery (efekt „życia w tle").
   ══════════════════════════════════════════════════════════════════════════ */

/** Wypełnienie liter KODA: pełny kolor LUB gradient (background-clip: text).
 *  Gradient z rgba() o niskiej alfie = litery półprzezroczyste → aurora prześwituje. */
export type KodaFill = { kind: "color"; value: string } | { kind: "gradient"; value: string };

/** Docelowe wypełnienie napisu KODA (odsłaniane linią intro = wypełnienie w hero). */
export const KODA_FILL: KodaFill = {
  kind: "gradient",
  value:
    "linear-gradient(180deg, rgba(208,118,224,0.10) 0%, rgba(150,128,238,0.085) 50%, rgba(112,122,232,0.095) 100%)",
};

/** „Kurtyna" intro — kolor planszy przed przejściem linii (śliwka aurory). */
export const INTRO_COVER = "#120617";

/** Kolor liter KODA podczas intro (Faza 1 + lewa strona przy krzyżowaniu). */
export const INTRO_KODA = "#c45cf0";

/** Baza ciemnego tła aurory (kolor pod gradientami/poświatami). */
export const HERO_BASE = "#0c0712";

/* ── Wariant JASNY (porcelana) — hero żyje też w trybie ☀ ─────────────────
   Cały „head" jest budowany pod motyw, nie doklejany: na papierze litery KODA
   to delikatny, kolorowy znak wodny (szkło różowo-fioletowo-indygowe), kurtyna
   intro jest porcelanowa z muśnięciem koloru, a litery intro świecą żywą
   magentą marki (czytelne na jasnej kurtynie). Aurorę jasną maluje samo
   <HeroBackground light />. */
export const KODA_FILL_LIGHT: KodaFill = {
  kind: "gradient",
  value:
    "linear-gradient(180deg, rgba(179,42,157,0.16) 0%, rgba(124,76,222,0.15) 52%, rgba(77,98,224,0.15) 100%)",
};

/** „Kurtyna" intro w trybie jasnym — porcelana z muśnięciem fioletu. */
export const INTRO_COVER_LIGHT = "#efe7f5";

/** Kolor liter KODA podczas intro (tryb jasny) — żywa magenta marki. */
export const INTRO_KODA_LIGHT = "#cf43b8";

/** Baza jasnego tła aurory (porcelana). */
export const HERO_BASE_LIGHT = "#f7f4f8";
