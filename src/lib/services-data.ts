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
    short: "Układ i ścieżki, które prowadzą odwiedzającego prosto do kontaktu.",
    lead: "Określamy cel i projektujemy stronę internetową, która reprezentuje Twój biznes i przynosi klientów.",
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
    title: "Strony internetowe 2D i 3D",
    short: "Szybkie strony na autorskim kodzie. Budowane pod Twój biznes, nie pod szablon.",
    lead: "Budujemy na czystym, wydajnym kodzie — nie na ciężkich szablonach. Efekt: strona, która ładuje się błyskawicznie, dobrze wygląda na każdym ekranie i łatwo się rozwija.",
    points: [
      "Strony firmowe, landing page i wizytówki",
      "Efekty 2D i 3D — nowoczesny, wyróżniający się charakter",
      "Kod skrojony pod projekt — zero zbędnych wtyczek",
      "Dobrze wygląda na każdym telefonie i ekranie",
    ],
  },
  {
    n: "03",
    id: "optymalizacja",
    title: "SEO (Pozycjonowanie strony)",
    short: "Szybkość, widoczność w Google i analityka, która mówi wprost, co przynosi klientów.",
    lead: "Najpiękniejsza strona nic nie da, jeśli nikt jej nie znajdzie i wolno się ładuje. Dbamy o techniczne fundamenty: szybkość, widoczność w wyszukiwarce i dane, które mówią, co działa.",
    points: [
      "Błyskawiczne ładowanie (Core Web Vitals — Google to docenia)",
      "Lepsza widoczność w Google (SEO techniczne)",
      "Analityka — widzisz, co działa, a co nie",
      "Dostępność — z Twojej strony skorzysta każdy, też na telefonie (WCAG)",
    ],
  },
  {
    n: "04",
    id: "wsparcie",
    title: "Wsparcie i opieka",
    short: "Po starcie zostajemy: aktualizacje, bezpieczeństwo i rozwój, gdy firma rośnie.",
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
 * "Jak pracujemy" — the process, shown on the homepage, /uslugi and /o-nas.
 * Four honest steps, no buzzwords.
 */
export const PROCESS: { n: string; title: string; desc: string }[] = [
  {
    n: "01",
    title: "Rozmawiamy o celu",
    desc: "Poznajemy Twój biznes i ustalamy, co strona ma realnie osiągnąć. Bez tego reszta nie ma sensu.",
  },
  {
    n: "02",
    title: "Projektujemy razem",
    desc: "Widzisz makiety i akceptujesz je, zanim cokolwiek powstanie w kodzie.",
  },
  {
    n: "03",
    title: "Budujemy i testujemy",
    desc: "Szybki, czysty kod, sprawdzony na każdym urządzeniu. Opiniujesz na bieżąco.",
  },
  {
    n: "04",
    title: "Start i rozwój",
    desc: "Publikujemy, mierzymy wyniki i rozwijamy stronę razem z Twoim biznesem.",
  },
];
