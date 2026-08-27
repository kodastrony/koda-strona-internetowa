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
  /** Zakres w 2–4-słownych chipach. */
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
    // Chipy = korzyści, nie cechy (korekta Natana 27.08: „mają przekonywać").
    chips: ["gotowy pod reklamy", "kontakt w 1 klik", "animacje premium", "start w 2–3 tygodnie"],
  },
  {
    id: "wizytowka",
    name: "Strona wizytówka",
    short: "Wizytówka",
    desc: "Pełna obecność firmy — do 5 podstron.",
    from: 3900,
    typical: "4 500 – 6 000 zł",
    chips: ["znajdą Cię w Google", "mapa i dojazd", "do 5 podstron", "start w 2–4 tygodnie"],
  },
  {
    id: "firmowa",
    name: "Strona firmowa",
    short: "Firmowa",
    desc: "6–10 podstron z treściami i strukturą pod SEO.",
    from: 6900,
    typical: "8 000 – 12 000 zł",
    chips: ["teksty piszemy my", "struktura pod Google", "6–10 podstron", "start w 4–6 tygodni"],
  },
  {
    id: "premium",
    name: "Premium 2D / 3D",
    short: "Premium 2D/3D",
    desc: "Indywidualny koncept: zaawansowane animacje, sceny 3D, konfiguratory.",
    from: 12900,
    typical: "15 000 – 25 000 zł",
    chips: ["design nie do podrobienia", "sceny 3D i animacje", "konfiguratory produktów", "start w 6–10 tygodni"],
  },
];

/** 12900 → „12 900" (twarda spacja; bez zależności od ICU w buildzie). */
export const formatPln = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
