"use client";

import { useState, useEffect } from "react";

export type HeaderTheme = "dark" | "light" | "pink";

// Reads data-header-theme="dark|light|pink" from sections and returns
// the theme of whichever section is currently behind the header.
// "pink" = a brand-pink background (the statement block): header elements stay
// white like on "dark", but the logo dot + contact pill must adapt so they
// don't vanish against the pink (a pink dot / pink pill would be invisible).
export function useHeaderTheme(headerHeight = 110): HeaderTheme {
  const [theme, setTheme] = useState<HeaderTheme>("dark");

  useEffect(() => {
    const update = () => {
      const sections =
        document.querySelectorAll<HTMLElement>("[data-header-theme]");
      if (!sections.length) return;

      const checkY = window.scrollY + headerHeight / 2;
      let found: HeaderTheme = "dark";

      sections.forEach((section) => {
        const top = section.offsetTop;
        const bottom = top + section.offsetHeight;
        if (top <= checkY && bottom > window.scrollY) {
          found =
            (section.dataset.headerTheme as HeaderTheme | undefined) ?? "dark";
        }
      });

      setTheme(found);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [headerHeight]);

  return theme;
}
