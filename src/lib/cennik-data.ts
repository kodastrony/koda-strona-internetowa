/**
 * Cennik KODA — JEDNO źródło prawdy dla cen pakietów w kodzie.
 *
 * Konsumenci: /cennik (pełne wiersze pakietów) i /uslugi (interaktywna
 * sekcja „Wycena" z tickerem ceny). Liczby z modelu
 * `marketing/CENNIK-MODEL-2026.md` — zmiany cen: NAJPIERW model, potem tu
 * (a JSON-LD OfferCatalog w app/cennik/page.tsx trzyma te same wartości).
 */
export interface CennikPakiet {
  id: string;
  /** Pełna nazwa (wiersze na /cennik). */
  name: string;
  /** Krótka nazwa do pigułek przełącznika (/uslugi). */
  short: string;
  /** Jedno zdanie „co to jest". */
  desc: string;
  /** Cena „od" w PLN netto (minimalny zakres pakietu). */
  from: number;
  /** Typowy przedział realizacji (tekstowo, z „zł"). */
  typical: string;
  /** Chip dziedziczenia „Wszystko z X" (tiery KUMULATYWNE — rebrand 27.08:
   *  najniższy tier = pełny serwis premium, wyższe DODAJĄ zakres). */
  inherits?: string;
  /** NOWE rzeczy tego tiera, w 2–4-słownych chipach. */
  chips: string[];
}

export const CENNIK_PAKIETY: CennikPakiet[] = [
  {
    id: "landing",
    name: "Landing page",
    short: "Landing",
    desc: "Jedna strona, która sprzedaje jedną rzecz.",
    from: 2900,
    typical: "3 500 – 4 500 zł",
    // LANDING = pełna baza premium: WSZYSTKO, co realnie dajemy w najniższym
    // tierze (rebrand 27.08: „robimy tylko strony premium"). Wyższe tiery
    // DZIEDZICZĄ ten zestaw (chip „Wszystko z…") i dodają swój rząd.
    chips: [
      "autorski design premium",
      "SEO + AI search (AEO)",
      "szybkość 100/100",
      "animacje premium",
      "CTA pod konwersję",
      "pod Google Ads i Meta",
      "analityka konwersji",
      "formularz + telefon",
      "responsywność 100%",
      "start w 2–3 tygodnie",
    ],
  },
  {
    id: "wizytowka",
    name: "Strona wizytówka",
    short: "Wizytówka",
    desc: "Pełna obecność firmy — do 5 podstron.",
    from: 3900,
    typical: "4 500 – 6 000 zł",
    inherits: "Wszystko z Landing",
    chips: [
      "do 5 podstron",
      "SEO lokalne + Google Maps",
      "podstrony oferty",
      "sekcja opinii klientów",
      "start w 2–4 tygodnie",
    ],
  },
  {
    id: "firmowa",
    name: "Strona firmowa",
    short: "Firmowa",
    desc: "6–10 podstron z treściami i strukturą pod SEO.",
    from: 6900,
    typical: "8 000 – 12 000 zł",
    inherits: "Wszystko z Wizytówki",
    chips: [
      "6–10 podstron",
      "copywriting w cenie",
      "integracja CRM",
      "cele konwersji w analityce",
      "sekcja aktualności",
      "start w 4–6 tygodni",
    ],
  },
  {
    id: "premium",
    name: "Premium 2D / 3D",
    short: "Premium 2D/3D",
    desc: "Indywidualny koncept: zaawansowane animacje, sceny 3D, konfiguratory.",
    from: 12900,
    typical: "15 000 – 25 000 zł",
    inherits: "Wszystko z Firmowej",
    chips: [
      "koncept kreatywny 1:1",
      "sceny 3D / WebGL",
      "konfiguratory produktów",
      "kalkulatory wyceny",
      "scrollytelling i intro",
      "start w 6–10 tygodni",
    ],
  },
];

/** 12900 → „12 900" (twarda spacja; bez zależności od ICU w buildzie). */
export const formatPln = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
