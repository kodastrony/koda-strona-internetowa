"use client";

import { useSyncExternalStore } from "react";

/* ══════════════════════════════════════════════════════════════════════════
   theme — motyw strony przypięty NA STAŁE do JASNEGO (decyzja Natana,
   2026-08-26: „zostawiamy tylko biały motyw zawsze").

   Wcześniejszy model „auto wg pory dnia (jasny 07–20, ciemny nocą) + ręczne
   nadpisanie do progu + toggle w headerze" został USUNIĘTY w całości:
   theme-init.ts (inline-skrypt pre-paint), ThemeAutoSync (harmonogram progów)
   i ThemeToggle (przycisk ☀/☾) nie istnieją. SSR renderuje
   <html data-koda-light style="color-scheme:light"> i nic tego nigdy nie
   zdejmuje — zero FOUC, zero skryptu przed malowaniem.

   Ten moduł zostaje jako JEDNO źródło wartości motywu dla dotychczasowych
   konsumentów (hero, page-canvas, custom-cursor, use-header-theme,
   uslugi-content) — wszyscy dostają stałe "light", bez subskrypcji i bez
   re-renderów. Ciemne WYSPY designu (stopka, Statement) są niezależne od
   motywu — to lokalne tokeny w globals.css, zostają bez zmian.

   Gdyby ciemny motyw miał kiedyś wrócić: git history tego pliku (stan sprzed
   2026-08-26) + theme-init.ts + theme-auto-sync.tsx + theme-toggle.tsx.
   ══════════════════════════════════════════════════════════════════════════ */

export type KodaTheme = "light" | "dark";

const THEME: KodaTheme = "light";

/** Bieżący motyw bez Reacta (np. dla vanilla rAF kursora). Zawsze "light". */
export function getTheme(): KodaTheme {
  return THEME;
}

/** Subskrypcja zmian motywu — motyw jest stały, więc nigdy nie emituje. */
export function subscribeTheme(cb: () => void): () => void {
  void cb;
  return () => {};
}

const emptySubscribe = () => () => {};

/** Motyw dla komponentów React — stałe "light" (spójne SSR i klient). */
export function useThemeValue(): KodaTheme {
  return useSyncExternalStore(
    emptySubscribe,
    () => THEME,
    () => THEME
  );
}
