"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  autoThemeAt,
  nextBoundary,
  THEME_ATTR,
  THEME_OVERRIDE_KEY,
  type KodaTheme,
} from "./theme-init";

/* ══════════════════════════════════════════════════════════════════════════
   theme — GLOBALNY motyw jasny/ciemny całej strony (jedno źródło prawdy, store
   klienta).

   MODEL „auto + ręczne nadpisanie do progu" (patrz theme-init.ts):
   - DOMYŚLNIE automat wg LOKALNEJ godziny: JASNY 07:00–20:00, poza tym CIEMNY.
   - Przycisk w headerze (toggle) zapisuje NADPISANIE, które obowiązuje tylko
     do najbliższego progu (07:00/20:00) — potem automat WRACA.
   - <ThemeAutoSync/> (montowany w layout) aktualizuje motyw NA ŻYWO na progu
     i po powrocie do karty (np. laptop spał przez próg).

   Architektura (bez FOUC):
   - inline-skrypt THEME_INIT_SCRIPT (theme-init.ts) ustawia html[data-koda-light]
     PRZED malowaniem (auto + ewentualne WAŻNE nadpisanie), jeszcze zanim
     załaduje się bundle React.
   - TEN store inicjuje wartość z atrybutu (useSyncExternalStore), więc konsumenci
     JS (header, kursor, scena 3D, hero) renderują się od razu poprawnie i NIE
     remontują się przy zmianie (kluczowe dla canvasa 3D — remount = intro od nowa).

   Statement (różowy finał) zostaje różowy w OBU motywach — header/sekcje mapują
   „dark"→„light" w useHeaderTheme, nie mutując DOM.
   ══════════════════════════════════════════════════════════════════════════ */

export type { KodaTheme };

function readDomTheme(): KodaTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.hasAttribute(THEME_ATTR) ? "light" : "dark";
}

/** Ważne (jeszcze nie wygasłe) ręczne nadpisanie albo null. Sprząta wygasłe. */
function readOverride(): KodaTheme | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(THEME_OVERRIDE_KEY);
    if (!raw) return null;
    const o = JSON.parse(raw) as { t?: unknown; exp?: unknown };
    if ((o.t === "light" || o.t === "dark") && typeof o.exp === "number" && Date.now() < o.exp) {
      return o.t;
    }
    localStorage.removeItem(THEME_OVERRIDE_KEY); // wygasłe → sprzątamy
  } catch {
    /* zła / legacy wartość — ignorujemy (auto przejmie) */
  }
  return null;
}

/** Efektywny motyw TERAZ: ważne nadpisanie, inaczej auto wg pory dnia. */
function computeTheme(): KodaTheme {
  return readOverride() ?? autoThemeAt(new Date());
}

let CURRENT: KodaTheme = readDomTheme();
const SUBS = new Set<() => void>();

function applyDom(t: KodaTheme): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (t === "light") root.setAttribute(THEME_ATTR, "");
  else root.removeAttribute(THEME_ATTR);
  root.style.colorScheme = t === "light" ? "light" : "dark";
}

/** Zastosuj efektywny motyw: zsynchronizuj DOM i (przy zmianie) powiadom subskrybentów. */
function commit(t: KodaTheme): void {
  applyDom(t); // zawsze synchronizuj DOM (np. korekta po hydracji / na progu)
  if (t === CURRENT) return;
  CURRENT = t;
  SUBS.forEach((f) => f());
}

/** Ustaw KONKRETNY motyw jako ręczne nadpisanie — obowiązuje do najbliższego
    progu (07:00/20:00), potem auto wraca. */
export function setTheme(t: KodaTheme): void {
  try {
    localStorage.setItem(THEME_OVERRIDE_KEY, JSON.stringify({ t, exp: nextBoundary(new Date()) }));
  } catch {
    /* tryb prywatny — nadpisanie tylko na czas sesji (commit niżej i tak zadziała) */
  }
  commit(t);
  schedule();
}

/** Przełącz na przeciwny względem bieżącego EFEKTYWNEGO motywu (przycisk w headerze). */
export function toggleTheme(): void {
  setTheme(computeTheme() === "dark" ? "light" : "dark");
}

/** Bieżący efektywny motyw bez Reacta (np. dla vanilla rAF kursora). */
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

/* ── Harmonogram automatu — przełącza motyw NA ŻYWO na progu 07:00/20:00 ─────
   (próg = też moment wygaśnięcia ręcznego nadpisania). Pojedynczy timer modułu,
   przeplanowywany po każdym odpaleniu. */
let timer: ReturnType<typeof setTimeout> | null = null;

function schedule(): void {
  if (typeof window === "undefined") return;
  if (timer) clearTimeout(timer);
  // +1000 ms zapasu, by po odpaleniu getHours() był już ZA progiem (nie tuż przed).
  const delay = Math.max(1000, nextBoundary(new Date()) - Date.now() + 1000);
  timer = setTimeout(() => {
    commit(computeTheme());
    schedule();
  }, delay);
}

/** Uruchom automat: harmonogram progów (07:00/20:00) + resync po powrocie do
    karty (np. laptop spał przez próg). Zwraca funkcję sprzątającą. Wołane RAZ
    przez <ThemeAutoSync/> (components/layout/theme-auto-sync.tsx) w useEffect.
    Trzymane TU (nie jako komponent), by lib/theme.ts nie eksportował komponentu
    obok funkcji importowanych poza drzewem Reacta → czysty Fast Refresh / HMR. */
export function startThemeAutoSync(): () => void {
  if (typeof window === "undefined") return () => {};
  commit(computeTheme()); // korekta na wejściu (np. nadpisanie wygasło między SSR a hydracją)
  schedule();
  const onVisible = () => {
    if (document.visibilityState === "visible") {
      commit(computeTheme());
      schedule();
    }
  };
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    document.removeEventListener("visibilitychange", onVisible);
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };
}
