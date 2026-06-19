/* ══════════════════════════════════════════════════════════════════════════
   theme-init — WSPÓLNE (serwer + klient) jądro motywu: harmonogram pory dnia
   + skrypt inicjujący BEZ FOUC. CELOWO BEZ "use client", więc importują go
   ZARÓWNO layout.tsx (serwer — wstrzykuje THEME_INIT_SCRIPT), JAK I theme.ts
   (klient — store). Jedno źródło prawdy dla godzin progu i logiki auto.

   MODEL: motyw AUTOMATYCZNY wg LOKALNEJ godziny — JASNY w oknie [07:00, 20:00),
   poza nim CIEMNY. Ręczne przełączenie (theme.ts) zapisuje NADPISANIE, które
   obowiązuje tylko do najbliższego progu (nextBoundary); potem auto wraca.
   ══════════════════════════════════════════════════════════════════════════ */

export type KodaTheme = "dark" | "light";

/** localStorage: ręczne nadpisanie auto — JSON {t:"light"|"dark", exp:<ms>}. */
export const THEME_OVERRIDE_KEY = "koda-theme-override";
/** Atrybut <html> przełączający tokeny jasne (globals.css). */
export const THEME_ATTR = "data-koda-light";

/** Początek okna jasnego — 07:00, w minutach doby. */
export const LIGHT_START_MIN = 7 * 60; // 420
/** Koniec okna jasnego — 20:00, w minutach doby (od tej godziny ciemny). */
export const LIGHT_END_MIN = 20 * 60; // 1200

/** Motyw automatyczny (wg pory dnia) dla podanego momentu. */
export function autoThemeAt(d: Date): KodaTheme {
  const min = d.getHours() * 60 + d.getMinutes();
  return min >= LIGHT_START_MIN && min < LIGHT_END_MIN ? "light" : "dark";
}

/** Najbliższy próg przełączenia (początek albo koniec okna jasnego) ściśle PO
    `d`, jako ms. To także moment wygaśnięcia ręcznego nadpisania → wtedy auto
    przejmuje. Granice wyprowadzone z LIGHT_START_MIN/LIGHT_END_MIN (jedno źródło). */
export function nextBoundary(d: Date): number {
  const min = d.getHours() * 60 + d.getMinutes();
  const at = new Date(d);
  at.setSeconds(0, 0);
  let boundaryMin: number;
  if (min < LIGHT_START_MIN) {
    boundaryMin = LIGHT_START_MIN; // dziś początek okna jasnego
  } else if (min < LIGHT_END_MIN) {
    boundaryMin = LIGHT_END_MIN; // dziś koniec okna jasnego
  } else {
    at.setDate(at.getDate() + 1); // jutro początek okna jasnego
    boundaryMin = LIGHT_START_MIN;
  }
  at.setHours(Math.floor(boundaryMin / 60), boundaryMin % 60, 0, 0);
  return at.getTime();
}

/** Inline-skrypt (string) wstrzykiwany w <head> PRZED malowaniem (layout.tsx,
    strategy beforeInteractive). Vanilla, samowystarczalny, owinięty w try/catch.
    Ustala motyw: auto wg godziny, a jeśli jest WAŻNE ręczne nadpisanie — bierze je.
    Godziny progu wstrzyknięte z LIGHT_START_MIN/LIGHT_END_MIN (jedno źródło). */
export const THEME_INIT_SCRIPT =
  `(function(){try{` +
  `var d=document.documentElement;` +
  `var now=new Date();var m=now.getHours()*60+now.getMinutes();` +
  `var t=(m>=${LIGHT_START_MIN}&&m<${LIGHT_END_MIN})?'light':'dark';` +
  `try{var raw=localStorage.getItem('${THEME_OVERRIDE_KEY}');if(raw){var o=JSON.parse(raw);` +
  `if(o&&(o.t==='light'||o.t==='dark')&&typeof o.exp==='number'&&Date.now()<o.exp){t=o.t;}` +
  `else{localStorage.removeItem('${THEME_OVERRIDE_KEY}');}}}catch(e2){}` +
  `if(t==='light'){d.setAttribute('${THEME_ATTR}','');d.style.colorScheme='light';}` +
  `else{d.removeAttribute('${THEME_ATTR}');d.style.colorScheme='dark';}` +
  `}catch(e){}})();`;
