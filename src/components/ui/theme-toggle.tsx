"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { useKodaTheme } from "@/lib/theme";
import { useHeaderTheme } from "@/hooks/use-header-theme";
import { EASE, cssBezier } from "@/lib/motion";

/* ══════════════════════════════════════════════════════════════════════════
   ThemeToggle — przełącznik ciemny/jasny w nagłówku.

   Ikona MORFUJE płynnie: słońce (tarcza + 8 promieni) ↔ księżyc (sierp).
   Mechanika sierpa = maska SVG, w której czarne „ugryzienie" (okrąg) wjeżdża
   na tarczę; promienie chowają się skalą+rotacją. Wszystko na transform/
   opacity (GPU) + sprężysta krzywa = miękko, premium. Kolor ikony dobiera się
   do tła sekcji za headerem (jak logo/nav): atrament na papierze, biel na
   ciemnym/różowym. prefers-reduced-motion → natychmiastowy przeskok.
   ══════════════════════════════════════════════════════════════════════════ */

const CLR_DUR = "500ms";

// 8 promieni słońca — końce odcinków na okręgu wokół środka (12,12).
const RAYS = Array.from({ length: 8 }, (_, i) => {
  const a = (i * Math.PI) / 4;
  const c = Math.cos(a);
  const s = Math.sin(a);
  return {
    x1: +(12 + c * 7.6).toFixed(2),
    y1: +(12 + s * 7.6).toFixed(2),
    x2: +(12 + c * 10).toFixed(2),
    y2: +(12 + s * 10).toFixed(2),
  };
});

export function ThemeToggle() {
  const { theme, toggle } = useKodaTheme();
  const headerTheme = useHeaderTheme();
  const reduce = useReducedMotion();
  const isLight = theme === "light";

  // Kolor ikony = jak logo: na papierze atrament, na ciemnym/różowym biel;
  // hover → różowy akcent (na różu → biel, bo róż-na-różu znika).
  const onPink = headerTheme === "pink";
  const iconClass = onPink
    ? "text-[#eeeeee] hover:text-white"
    : cn("hover:text-[#cf43b8]", headerTheme === "light" ? "text-[#0f0f0f]" : "text-[#eeeeee]");

  const spring = reduce
    ? { duration: 0 }
    : ({ type: "spring", stiffness: 220, damping: 20, mass: 0.7 } as const);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isLight ? "Włącz tryb ciemny" : "Włącz tryb jasny"}
      aria-pressed={isLight}
      title={isLight ? "Tryb ciemny" : "Tryb jasny"}
      className={cn(
        "relative flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full",
        "transition-colors duration-300 hover:bg-[color-mix(in_srgb,currentColor_10%,transparent)]",
        iconClass
      )}
      style={{ transition: `color ${CLR_DUR} ${cssBezier(EASE.expo)}` }}
    >
      <motion.svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{ color: "currentColor", transformOrigin: "12px 12px" }}
        animate={{ rotate: isLight ? 0 : -32 }}
        transition={spring}
      >
        <mask id="koda-theme-moon">
          <rect x="0" y="0" width="24" height="24" fill="white" />
          {/* Czarne „ugryzienie": daleko = pełna tarcza (słońce); na tarczy = sierp. */}
          <motion.circle
            r="8"
            fill="black"
            initial={false}
            animate={{ cx: isLight ? 28 : 16.5, cy: isLight ? 4 : 7.5 }}
            transition={reduce ? { duration: 0 } : { duration: 0.5, ease: EASE.smooth }}
          />
        </mask>

        {/* Tarcza — słońce małe, księżyc większy; maskowana w sierp. */}
        <motion.circle
          cx="12"
          cy="12"
          fill="currentColor"
          mask="url(#koda-theme-moon)"
          initial={false}
          animate={{ r: isLight ? 5 : 6.4 }}
          transition={spring}
        />

        {/* Promienie — chowają się skalą+rotacją w trybie księżyca. */}
        <motion.g
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          initial={false}
          animate={{
            opacity: isLight ? 1 : 0,
            scale: isLight ? 1 : 0.4,
            rotate: isLight ? 0 : -40,
          }}
          transition={reduce ? { duration: 0 } : { duration: 0.42, ease: EASE.out }}
          style={{ transformOrigin: "12px 12px" }}
        >
          {RAYS.map((r, i) => (
            <line key={i} x1={r.x1} y1={r.y1} x2={r.x2} y2={r.y2} />
          ))}
        </motion.g>
      </motion.svg>
    </button>
  );
}
