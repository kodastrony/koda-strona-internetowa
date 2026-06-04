"use client";

import { useState, useEffect } from "react";

export type HeaderTheme = "dark" | "light";

// Reads data-header-theme="dark|light" from sections and returns
// the theme of whichever section is currently behind the header.
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
