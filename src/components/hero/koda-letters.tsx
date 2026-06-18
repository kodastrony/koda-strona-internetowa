"use client";

import type { CSSProperties } from "react";
import type { KodaFill } from "./hero-config";

/* ══════════════════════════════════════════════════════════════════════════
   Pionowa kolumna „KODA" — JEDEN komponent dla intro i hero (bezszwowy handoff).

   Geometria jest IDENTYCZNA wszędzie (te same stałe), więc napis z overlayu
   intro leży piksel-w-piksel nad napisem w hero — gdy overlay znika, po prostu
   go odsłania. Wypełnienie liter może być pełnym kolorem albo gradientem
   (background-clip: text), dzięki czemu warianty mają różne barwy bez zmiany
   układu. BEZ poświaty/maski/tła — czyste litery na tle strony.
   ══════════════════════════════════════════════════════════════════════════ */

export const LETTERS = ["K", "O", "D", "A"] as const;

/** Rozmiar liter — WIELKI (oryginał). Cztery litery są wyższe niż viewport, więc
 *  litera „A" startuje SCHOWANA pod ekranem i odsłania się przy scrollu (parallax
 *  kolumny). Patrz Hero — kolumna top:0, dolne wygaszenie tła. */
export const KODA_FONT = "clamp(160px, 21vw, 340px)";

/** Lewa krawędź = 81% − rozmiar (skaluje się z fontem) → litery left-aligned;
 *  identyczne w intro i hero (handoff piksel-w-piksel). */
export const KODA_LEFT = `calc(81% - ${KODA_FONT})`;

/** Rozmiar WYŚRODKOWANEJ kolumny KODA dla intro na małych ekranach (< lg).
 *  Dobrany tak, by CZTERY litery zmieściły się w pionie (≈ 4·0.86·font ≤ ~80vh)
 *  i w poziomie na wąskim telefonie — wektor: min(wysokość, szerokość). */
export const KODA_FONT_CENTER = "clamp(56px, min(23vh, 42vw), 184px)";

/** Styl pojedynczej litery — wspólny dla wszystkich warstw. */
export const letterStyle: CSSProperties = {
  fontFamily: "var(--font-logo)",
  fontWeight: 800,
  fontSize: KODA_FONT,
  letterSpacing: "-0.04em",
  lineHeight: 0.9,
};

/** Zwraca style wypełnienia litery (pełny kolor lub gradient przez clip-text). */
export function fillStyle(fill: KodaFill): CSSProperties {
  if (fill.kind === "color") return { color: fill.value };
  return {
    backgroundImage: fill.value,
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    color: "transparent",
    WebkitTextFillColor: "transparent",
  };
}

interface KodaColumnLettersProps {
  fill: KodaFill;
  /** Nadpisanie rozmiaru fontu (np. KODA_FONT_CENTER dla wyśrodkowanej kolumny <lg). */
  fontSize?: string;
  /** per-litera dodatkowy styl (np. opacity/transform startowe dla Fazy 1). */
  letterProps?: (index: number) => CSSProperties;
  /** atrybut data- na każdej literze (np. data-pink-letter dla animacji Fazy 1). */
  letterAttr?: string;
}

/** Cztery litery jedna pod drugą — sam zestaw glifów (pozycjonowanie robi rodzic). */
export function KodaColumnLetters({
  fill,
  fontSize,
  letterProps,
  letterAttr,
}: KodaColumnLettersProps) {
  const filled = fillStyle(fill);
  return (
    <>
      {LETTERS.map((l, i) => (
        <div
          key={l}
          {...(letterAttr ? { [letterAttr]: "" } : {})}
          style={{
            ...letterStyle,
            ...(fontSize ? { fontSize } : null),
            ...filled,
            ...(letterProps ? letterProps(i) : null),
          }}
        >
          {l}
        </div>
      ))}
    </>
  );
}
