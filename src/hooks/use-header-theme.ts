"use client";

import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

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

interface Section {
  top: number;
  bottom: number;
  theme: HeaderTheme;
}

export function HeaderThemeProvider({
  children,
  headerHeight = 110,
}: {
  children: ReactNode;
  headerHeight?: number;
}) {
  const [theme, setTheme] = useState<HeaderTheme>("dark");

  useEffect(() => {
    let sections: Section[] = [];

    // Odczyt offsetów = wymuszony layout → robimy go RZADKO (mount / resize),
    // nie na każdej klatce scrolla.
    const measure = () => {
      sections = Array.from(
        document.querySelectorAll<HTMLElement>("[data-header-theme]"),
      ).map((s) => ({
        top: s.offsetTop,
        bottom: s.offsetTop + s.offsetHeight,
        theme: (s.dataset.headerTheme as HeaderTheme | undefined) ?? "dark",
      }));
    };

    let raf = 0;
    const compute = () => {
      raf = 0;
      if (!sections.length) return;
      const checkY = window.scrollY + headerHeight / 2;
      let found: HeaderTheme = "dark";
      for (const s of sections) {
        if (s.top <= checkY && s.bottom > checkY) found = s.theme;
      }
      setTheme((prev) => (prev === found ? prev : found));
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

    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [headerHeight]);

  return createElement(HeaderThemeContext.Provider, { value: theme }, children);
}

/** Zwraca motyw sekcji aktualnie za headerem (z kontekstu — bez własnego listenera). */
export function useHeaderTheme(): HeaderTheme {
  return useContext(HeaderThemeContext);
}
