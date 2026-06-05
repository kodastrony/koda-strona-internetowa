"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useHeaderTheme } from "@/hooks/use-header-theme";
import { EASE, cssBezier } from "@/lib/motion";

/* ════════════════════════════════════════════════════════════════════
   KODA — custom scroll progress bar (baunfire-style)
   ────────────────────────────────────────────────────────────────────
   Cienka pionowa linia DOCIŚNIĘTA do prawej krawędzi. Wypełnienie rośnie
   z góry (scaleY = scrollYProgress) od 0 do pełnej wysokości.

   Kolor adaptacyjny (jak przełączanie headera, useHeaderTheme):
     • ciemne tło sekcji  → wypełnienie BIAŁE
     • jasne tło sekcji   → wypełnienie CIEMNE
   Płynne przejście koloru przy zmianie sekcji (500ms expo).
   ════════════════════════════════════════════════════════════════════ */

const SWITCH = `background-color 500ms ${cssBezier(EASE.expo)}`;

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 140,
    damping:   30,
    mass:      0.3,
  });

  const theme = useHeaderTheme();
  const fill = theme === "light" ? "#0f0f0f" : "#eeeeee";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 z-[var(--z-scrollbar)] hidden h-screen w-[3px] sm:block"
    >
      {/* tor — ledwo widoczny, neutralny (działa na ciemnym i jasnym) */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: "rgba(140,140,140,0.18)" }}
      />
      {/* wypełnienie — rośnie z góry; kolor adaptuje się do tła sekcji */}
      <motion.div
        className="absolute inset-x-0 top-0 h-full"
        style={{
          scaleY,
          transformOrigin: "top",
          backgroundColor: fill,
          transition:      SWITCH,
          willChange:      "transform",
        }}
      />
    </div>
  );
}
