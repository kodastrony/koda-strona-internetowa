"use client";

import { useCallback, useSyncExternalStore } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   theme — GLOBALNY motyw jasny/ciemny całej strony (jedno źródło prawdy).

   Architektura (bez FOUC):
   - inline-skrypt w layout (pierwsze dziecko <body>) czyta localStorage PRZED
     malowaniem i ustawia atrybut html[data-koda-light] → CSS (globals.css)
     przełącza tokeny natychmiast, jeszcze zanim załaduje się bundle React.
   - TEN store (pub/sub + useSyncExternalStore) inicjuje wartość z atrybutu,
     więc konsumenci JS (header, kursor, scena 3D) renderują się od razu
     poprawnie i NIE remontują się przy przełączeniu (kluczowe dla canvasa 3D —
     remount = intro od nowa).
   - toggle zapisuje localStorage, przełącza atrybut i powiadamia subskrybentów.

   Statement (różowy finał) zostaje różowy w OBU motywach — to klimaks strony;
   header/sekcje mapują „dark"→„light" w useHeaderTheme, nie mutując DOM.
   ══════════════════════════════════════════════════════════════════════════ */

export type KodaTheme = "dark" | "light";

const STORAGE_KEY = "koda-theme";
const ATTR = "data-koda-light";

/** Skrypt wstrzykiwany inline w <body> (string — patrz layout.tsx). Ustawia
    atrybut + color-scheme przed pierwszym malowaniem. Minimalny, owinięty w
    try/catch (tryb prywatny). */
export const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('${STORAGE_KEY}');var d=document.documentElement;if(t==='light'){d.setAttribute('${ATTR}','');d.style.colorScheme='light';}else{d.style.colorScheme='dark';}}catch(e){}})();`;

function readInitial(): KodaTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.hasAttribute(ATTR) ? "light" : "dark";
}

let CURRENT: KodaTheme = readInitial();
const SUBS = new Set<() => void>();

function applyDom(t: KodaTheme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "light") root.setAttribute(ATTR, "");
  else root.removeAttribute(ATTR);
  root.style.colorScheme = t === "light" ? "light" : "dark";
}

export function setTheme(t: KodaTheme): void {
  if (t === CURRENT) {
    applyDom(t);
    return;
  }
  CURRENT = t;
  try {
    localStorage.setItem(STORAGE_KEY, t);
  } catch {
    /* tryb prywatny — motyw zostaje na czas sesji w pamięci modułu */
  }
  applyDom(t);
  SUBS.forEach((f) => f());
}

export function toggleTheme(): void {
  setTheme(CURRENT === "dark" ? "light" : "dark");
}

/** Bieżący motyw bez Reacta (np. dla vanilla rAF kursora). */
export function getTheme(): KodaTheme {
  return CURRENT;
}

function subscribe(cb: () => void): () => void {
  SUBS.add(cb);
  return () => {
    SUBS.delete(cb);
  };
}

/** Subskrypcja bieżącego motywu. getServerSnapshot = "dark" (statyczny export
    renderuje ciemny HTML; klient koryguje przed malowaniem przez atrybut +
    ten store — wzorzec useSyncExternalStore dla store'a klienta). */
export function useThemeValue(): KodaTheme {
  return useSyncExternalStore(
    subscribe,
    () => CURRENT,
    () => "dark"
  );
}

/** Motyw + przełącznik (dla przycisku w headerze). */
export function useKodaTheme(): { theme: KodaTheme; toggle: () => void } {
  const theme = useThemeValue();
  const toggle = useCallback(() => toggleTheme(), []);
  return { theme, toggle };
}

/** Subskrypcja dla konsumentów spoza Reacta — zwraca funkcję odpinającą. */
export function subscribeTheme(cb: () => void): () => void {
  return subscribe(cb);
}
