/**
 * Services — SINGLE SOURCE OF TRUTH.
 *
 * Used by the homepage "Co robimy" list (services.tsx → title + short) and the
 * full /uslugi page (lead + points). One module so the two never drift.
 */
export interface Service {
  /** Display number, e.g. "01". */
  n: string;
  /** Anchor id on /uslugi (#projektowanie). */
  id: string;
  title: string;
  /** One-liner used on the homepage row. */
  short: string;
  /** Intro paragraph on the /uslugi page. */
  lead: string;
  /** What the service includes — bullet points on /uslugi. */
  points: string[];
}

export const SERVICES: Service[] = [
  {
    n: "01",
    id: "projektowanie",
    title: "Projektowanie UX/UI",
    short:
      "Interfejsy, które prowadzą użytkownika prosto do kontaktu i zakupu. Każdy ekran ma zadanie.",
    lead: "Zaczynamy od celu biznesowego, nie od ładnych pikseli. Projektujemy ścieżki, które prowadzą odwiedzającego dokładnie tam, gdzie chcesz — do zapytania, telefonu albo zakupu.",
    points: [
      "Analiza celów i grupy docelowej",
      "Architektura informacji i ścieżki konwersji",
      "Projekt UI w spójnym systemie wizualnym",
      "Prototyp i makiety responsywne",
    ],
  },
  {
    n: "02",
    id: "strony",
    title: "Strony i sklepy",
    short:
      "Szybkie, nowoczesne strony i sklepy na solidnym kodzie. Pod Twój biznes, nie pod szablon.",
    lead: "Budujemy na czystym, wydajnym kodzie — nie na ciężkich szablonach. Efekt: strona, która ładuje się błyskawicznie, dobrze wygląda na każdym ekranie i łatwo się rozwija.",
    points: [
      "Strony firmowe, landing page i sklepy",
      "Kod skrojony pod projekt — zero zbędnych wtyczek",
      "Responsywność od 320 do 2560 px",
      "Integracje: płatności, formularze, analityka",
    ],
  },
  {
    n: "03",
    id: "optymalizacja",
    title: "Optymalizacja i SEO",
    short: "Szybkość, widoczność w Google i analityka, żeby strona realnie przyciągała klientów.",
    lead: "Najpiękniejsza strona nic nie da, jeśli nikt jej nie znajdzie i wolno się ładuje. Dbamy o techniczne fundamenty: szybkość, widoczność w wyszukiwarce i dane, które mówią, co działa.",
    points: [
      "Optymalizacja szybkości i Core Web Vitals",
      "SEO techniczne i dane strukturalne",
      "Konfiguracja analityki i celów",
      "Dostępność (WCAG) i poprawna semantyka",
    ],
  },
  {
    n: "04",
    id: "wsparcie",
    title: "Wsparcie i rozwój",
    short:
      "Po wdrożeniu zostajemy: aktualizacje, opieka techniczna i rozwój, gdy Twój biznes rośnie.",
    lead: "Wdrożenie to początek, nie koniec. Zostajemy na pokładzie: aktualizujemy, pilnujemy bezpieczeństwa i rozwijamy stronę razem z Twoim biznesem.",
    points: [
      "Aktualizacje i opieka techniczna",
      "Monitoring bezpieczeństwa i kopie zapasowe",
      "Rozbudowa o nowe sekcje i funkcje",
      "Doradztwo i bieżące wsparcie",
    ],
  },
];

/**
 * "Jak pracujemy" — the process, shown on /uslugi and /o-nas. Four honest
 * steps, no buzzwords.
 */
export const PROCESS: { n: string; title: string; desc: string }[] = [
  {
    n: "01",
    title: "Rozmowa i cel",
    desc: "Poznajemy Twój biznes i ustalamy, co strona ma realnie osiągnąć. Bez tego reszta nie ma sensu.",
  },
  {
    n: "02",
    title: "Projekt",
    desc: "Projektujemy strukturę i wygląd. Widzisz makiety, zanim cokolwiek powstanie w kodzie.",
  },
  {
    n: "03",
    title: "Wdrożenie",
    desc: "Budujemy na szybkim, czystym kodzie i testujemy na każdym urządzeniu. Ty opiniujesz na bieżąco.",
  },
  {
    n: "04",
    title: "Start i rozwój",
    desc: "Publikujemy, mierzymy efekty i rozwijamy stronę dalej — tak długo, jak tego potrzebujesz.",
  },
];
