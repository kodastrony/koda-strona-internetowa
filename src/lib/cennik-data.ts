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
  /** Kontekstowe CTA sekcji Wycena (/uslugi): linia zachęty + label przycisku. */
  cta: { line: string; label: string };
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
    // Bez oczywistości i bez Google Maps (nie robimy — korekta Natana).
    // Chipy wyższych tierów = to, na czym NAJBARDZIEJ zależy kupującemu
    // dany tier; zero dubli z bazą Landing.
    chips: [
      "autorski design premium",
      "SEO + AI search (AEO)",
      "szybkość 100/100",
      "animacje premium",
      "CTA pod konwersję",
      "pod Google Ads i Meta",
      "analityka konwersji",
      "start w 1–2 tygodnie",
    ],
    cta: {
      line: "Landing pod Twoją kampanię? Opisz cel — wrócimy z konkretem w 24 h.",
      label: "Wyceń landing page",
    },
  },
  {
    id: "wizytowka",
    name: "Strona wizytówka",
    short: "Wizytówka",
    desc: "Cała firma profesjonalnie pokazana w internecie.",
    from: 3900,
    typical: "4 500 – 6 000 zł",
    // Buyer wizytówki: chce się PREZENTOWAĆ — duma z własnej strony.
    inherits: "Wszystko z Landing",
    chips: [
      "design, którym się pochwalisz",
      "galeria realizacji",
      "FAQ pod AI search",
      "start w 2–3 tygodnie",
    ],
    cta: {
      line: "Taka wizytówka może być Twoja. Opisz firmę — konkret w 24 h.",
      label: "Wyceń wizytówkę",
    },
  },
  {
    id: "firmowa",
    name: "Strona firmowa",
    short: "Firmowa",
    desc: "Rozbudowana strona, która sprzedaje i pozycjonuje.",
    from: 6900,
    typical: "8 000 – 12 000 zł",
    // Buyer firmowej: obchodzi go KASA — strona ma przynosić klientów.
    inherits: "Wszystko z Wizytówki",
    chips: [
      "profesjonalny branding firmy",
      "treści pod konwersję",
      "każda podstrona sprzedaje",
      "start w 3–5 tygodni",
    ],
    cta: {
      line: "Strona firmowa, która przynosi klientów? Umówmy krótką rozmowę.",
      label: "Wyceń stronę firmową",
    },
  },
  {
    id: "premium",
    name: "Premium 2D / 3D",
    short: "Premium 2D/3D",
    desc: "Indywidualny koncept: zaawansowane animacje, sceny 3D, konfiguratory.",
    from: 12900,
    typical: "15 000 – 25 000 zł",
    // Buyer premium: szczęka ma opaść od SPECJALISTYCZNYCH rzeczy.
    inherits: "Wszystko z Firmowej",
    chips: [
      "silnik 3D w przeglądarce (WebGL)",
      "konfiguratory produktów",
      "kalkulatory wyceny",
      "scrollytelling i intro",
      "koncept kreatywny 1:1",
      "start w 5–8 tygodni",
    ],
    cta: {
      line: "Masz pomysł na coś wyjątkowego? Pogadajmy o koncepcie.",
      label: "Wyceń projekt premium",
    },
  },
];

/** 12900 → „12 900" (twarda spacja; bez zależności od ICU w buildzie). */
export const formatPln = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
