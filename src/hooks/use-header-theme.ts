"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getTheme, subscribeTheme } from "@/lib/theme";

export type HeaderTheme = "dark" | "light" | "pink";

/* ── Header theme — JEDNO źródło prawdy dla całej chromy nad sekcjami ──────────
   Czyta data-header-theme="dark|light|pink" z sekcji i zwraca motyw tej, która
   jest aktualnie za headerem. "pink" = różowe tło (statement): elementy headera
   zostają białe jak na "dark", ale różowe akcenty (kropka logo, pill) adaptują się.

   WYDAJNOŚĆ: wcześniej hook był wołany OSOBNO przez Header i ScrollProgress —
   dwa listenery scrolla, każdy czytał offsetTop/offsetHeight wszystkich sekcji
   CO KLATKĘ (forced reflow ×2). Teraz JEDEN provider:
     • cache'uje offsety sekcji (odczyt = wymuszony layout) i odświeża je tylko
       przez ResizeObserver (Lenis = realny scroll → offsetTop stabilny przy zjeździe),
     • throttluje obliczenia do jednego rAF na klatkę,
     • nie re-renderuje, gdy motyw się nie zmienił.
   Header i ScrollProgress czytają wynik z kontekstu (zero dodatkowych listenerów). */

const HeaderThemeContext = createContext<HeaderTheme>("dark");
// Czy sekcja za headerem to CIEMNA WYSPA (Statement/stopka). Header używa tego,
// by POKAZAĆ (białe) logo i przełącznik nad takimi sekcjami — inaczej znikają
// przy zjeździe (logo-hide), a user chce je WIDZIEĆ białe na finałowym CTA.
const HeaderDarkIslandContext = createContext<boolean>(false);

interface Section {
  top: number;
  bottom: number;
  theme: HeaderTheme;
  /** Sekcja CIEMNA W OBU MOTYWACH (np. Statement „świt", stopka) — globalny
   *  tryb jasny NIE remapuje jej „dark"→„light", więc chrom (logo/przełącznik/
   *  burger) zostaje BIAŁY (czarny byłby niewidoczny na ciemnym tle). */
  darkIsland: boolean;
}

export function HeaderThemeProvider({
  children,
  headerHeight = 110,
}: {
  children: ReactNode;
  headerHeight?: number;
}) {
  const [theme, setTheme] = useState<HeaderTheme>("dark");
  const [darkIsland, setDarkIsland] = useState(false);

  useEffect(() => {
    let sections: Section[] = [];

    // Odczyt offsetów = wymuszony layout → robimy go RZADKO (mount / resize),
    // nie na każdej klatce scrolla.
    const measure = () => {
      sections = Array.from(document.querySelectorAll<HTMLElement>("[data-header-theme]")).map(
        (s) => ({
          top: s.offsetTop,
          bottom: s.offsetTop + s.offsetHeight,
          theme: (s.dataset.headerTheme as HeaderTheme | undefined) ?? "dark",
          darkIsland: s.hasAttribute("data-header-dark-island"),
        })
      );
    };

    let raf = 0;
    const compute = () => {
      raf = 0;
      if (!sections.length) return;
      const checkY = window.scrollY + headerHeight / 2;
      let found: HeaderTheme = "dark";
      let foundDarkIsland = false;
      for (const s of sections) {
        if (s.top <= checkY && s.bottom > checkY) {
          found = s.theme;
          foundDarkIsland = s.darkIsland;
        }
      }
      // Globalny motyw jasny: sekcje deklarujące „dark" stają się „light" (są
      // jasne w trybie jasnym). WYJĄTEK: ciemne wyspy (data-header-dark-island,
      // np. Statement „świt" / stopka) są ciemne w OBU motywach → chrom zostaje
      // biały (czarne logo/przełącznik byłyby niewidoczne na ciemnym tle).
      if (getTheme() === "light" && found === "dark" && !foundDarkIsland) found = "light";
      setTheme((prev) => (prev === found ? prev : found));
      setDarkIsland((prev) => (prev === foundDarkIsland ? prev : foundDarkIsland));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    measure();
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });

    // Zmiana wysokości dokumentu (route change, fonty, obrazy) → przelicz offsety
    // i motyw. Callback nie zmienia layoutu, więc nie zapętli się.
    const ro = new ResizeObserver(() => {
      measure();
      compute();
    });
    ro.observe(document.documentElement);

    // Przełączenie ☀/☾ bez scrolla — przelicz motyw headera natychmiast.
    const unsubTheme = subscribeTheme(compute);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      unsubTheme();
    };
  }, [headerHeight]);

  return createElement(
    HeaderThemeContext.Provider,
    { value: theme },
    createElement(HeaderDarkIslandContext.Provider, { value: darkIsland }, children)
  );
}

/** Zwraca motyw sekcji aktualnie za headerem (z kontekstu — bez własnego listenera). */
export function useHeaderTheme(): HeaderTheme {
  return useContext(HeaderThemeContext);
}

/** Czy header jest aktualnie nad CIEMNĄ WYSPĄ (Statement/stopka). */
export function useHeaderDarkIsland(): boolean {
  return useContext(HeaderDarkIslandContext);
}
