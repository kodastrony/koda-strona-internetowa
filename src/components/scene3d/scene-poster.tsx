"use client";

import { glowBackground } from "@/components/fx/glow-field";
import { useThemeValue } from "@/lib/theme";

/* ── Poster awaryjny sceny 3D (brak WebGL / utrata kontekstu) ──────────────
   Statyczny zamiennik canvasu = dwa pola światła marki (CSS), pokazywany gdy
   WebGL nie wstanie. Używany przez akcenty sekcji i horyzont (context-lost). */
export function ScenePoster({ hue }: { hue: number }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      {/* Subtelne, rozlane pola światła (NIE jasna plama w rogu) — poster ma
          wyglądać jak ciemny kosmos, nie jak jaśniejszy „kwadrat" przy ładowaniu. */}
      <div
        className="absolute inset-0"
        style={{ backgroundImage: glowBackground(hue, 60, 52, 0.55) }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: glowBackground(300, 22, 22, 0.3) }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   HeroPoster — DOPRACOWANY statyczny zamiennik HERO dla tieru „static”
   (brak/sw WebGL, save-data, bardzo słaby sprzęt) ORAZ stan ładowania chunku
   3D na sprzęcie zdolnym (poster-first → płynny upgrade do 3D).

   REDESIGN: zamiast wąskiego „świetlnego paska” (wyglądał jak błąd) — miękka,
   ORGANICZNA aurora marki: rozległe, nakładające się pola światła (ambient →
   aurora → gorący rdzeń → horyzont → winieta) budują GŁĘBIĘ i atmosferę, a nie
   płaski słup. Dwie warstwy ODDYCHAJĄ (.koda-poster-bloom, GPU-only, tanie nawet
   na słabym sprzęcie; reduced-motion je wyłącza) → światło żyje, jak osiadła
   scena 3D. Czysty CSS, zero WebGL. Komponuje się z PageCanvas (maluje TYLKO
   dodane światło nad przezroczystością → baza z kanwy, zero „kwadratu”/szwu).
   Theme-aware (kosmos / porcelana). Desktop → aurora po PRAWEJ (gdzie stoi 3D
   KODA); mobile → niżej i bliżej środka (treść hero u góry).
   ══════════════════════════════════════════════════════════════════════════ */
export function HeroPoster() {
  const light = useThemeValue() === "light";
  const fadeMask = "linear-gradient(to bottom, black 74%, transparent 98%)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[155svh] overflow-hidden"
      style={{ maskImage: fadeMask, WebkitMaskImage: fadeMask }}
    >
      {/* 1 — AMBIENT: rozległa, ledwo widoczna atmosfera (głębia, nie płaskie tło). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: light
            ? "radial-gradient(125% 95% at 76% 36%, oklch(0.9 0.045 318 / 0.5) 0%, oklch(0.9 0.045 318 / 0) 62%)"
            : "radial-gradient(125% 95% at 76% 36%, oklch(0.42 0.12 292 / 0.17) 0%, oklch(0.42 0.12 292 / 0) 62%)",
        }}
      />

      {/* 2 — AURORA (desktop): duża, miękka bloomy światła gdzie stoi monolit KODA.
          ODDYCHA. Szeroki, organiczny rozlew (42%×52%) — NIE wąski pasek. */}
      <div
        className="koda-poster-bloom absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: light
            ? "radial-gradient(42% 54% at 70% 46%, oklch(0.84 0.1 330 / 0.62) 0%, oklch(0.84 0.1 330 / 0.18) 44%, oklch(0.84 0.1 330 / 0) 74%)"
            : "radial-gradient(42% 54% at 70% 46%, oklch(0.58 0.2 332 / 0.34) 0%, oklch(0.5 0.17 312 / 0.12) 46%, oklch(0.5 0.17 312 / 0) 74%)",
        }}
      />
      {/* 3 — RDZEŃ (desktop): gorętszy, mniejszy punkt-źródło światła. Kontr-faza. */}
      <div
        className="koda-poster-bloom2 absolute inset-0 hidden lg:block"
        style={{
          backgroundImage: light
            ? "radial-gradient(19% 27% at 71% 44%, oklch(0.92 0.12 332 / 0.55) 0%, oklch(0.92 0.12 332 / 0) 64%)"
            : "radial-gradient(18% 27% at 71% 43%, oklch(0.76 0.21 334 / 0.42) 0%, oklch(0.66 0.19 322 / 0.1) 40%, oklch(0.66 0.19 322 / 0) 66%)",
        }}
      />

      {/* 2b/3b — MOBILE: bloomy niżej i bliżej środka. */}
      <div
        className="koda-poster-bloom absolute inset-0 lg:hidden"
        style={{
          backgroundImage: light
            ? "radial-gradient(62% 38% at 50% 70%, oklch(0.84 0.1 330 / 0.56) 0%, oklch(0.84 0.1 330 / 0.16) 48%, oklch(0.84 0.1 330 / 0) 80%)"
            : "radial-gradient(62% 40% at 50% 70%, oklch(0.57 0.2 332 / 0.32) 0%, oklch(0.5 0.17 312 / 0.1) 48%, oklch(0.5 0.17 312 / 0) 80%)",
        }}
      />
      <div
        className="koda-poster-bloom2 absolute inset-0 lg:hidden"
        style={{
          backgroundImage: light
            ? "radial-gradient(30% 19% at 50% 67%, oklch(0.92 0.12 332 / 0.5) 0%, oklch(0.92 0.12 332 / 0) 70%)"
            : "radial-gradient(28% 19% at 50% 67%, oklch(0.76 0.21 334 / 0.4) 0%, oklch(0.76 0.21 334 / 0) 70%)",
        }}
      />

      {/* 4 — HORYZONT: szeroka, niska łuna (echo świetlnego dysku 3D) spina dół. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%]"
        style={{
          backgroundImage: light
            ? "radial-gradient(85% 62% at 50% 122%, oklch(0.86 0.075 322 / 0.42) 0%, oklch(0.86 0.075 322 / 0) 70%)"
            : "radial-gradient(85% 62% at 50% 124%, oklch(0.4 0.15 330 / 0.28) 0%, oklch(0.32 0.12 322 / 0.08) 42%, oklch(0.32 0.12 322 / 0) 72%)",
        }}
      />

      {/* 5 — WINIETA: osadza światło w atmosferze (rogi). */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: light
            ? "radial-gradient(125% 108% at 46% 42%, transparent 50%, oklch(0.95 0.012 320 / 0.3) 100%)"
            : "radial-gradient(125% 108% at 46% 42%, transparent 52%, oklch(0.07 0.014 320 / 0.55) 100%)",
        }}
      />
    </div>
  );
}
