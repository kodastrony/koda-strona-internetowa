/**
 * Services — SINGLE SOURCE OF TRUTH.
 *
 * Used by the homepage "Co robimy" list (services.tsx → title + short) and the
 * full /uslugi page (lead + points). One module so the two never drift.
 */
export interface Service {
  /** Display number, e.g. "01" (używane na home; /uslugi już nie numeruje). */
  n: string;
  /** Anchor id on /uslugi (#projektowanie). */
  id: string;
  /** Nazwa usługi — chip na karcie /uslugi, wiersz na home, Service.name w JSON-LD. */
  title: string;
  /** One-liner used on the homepage row. */
  short: string;
  /** Akapit korzyści na /uslugi (język KUPUJĄCEGO) — też Service.description w JSON-LD. */
  lead: string;
  /** „Co dostajesz" — konkretne elementy usługi, każdy z korzyścią (redesign 2026-08-26). */
  points: string[];
  /** Nagłówek WYNIKOWY karty (H2): co klient z tego MA, nie jak my to nazywamy. */
  outcome: string;
  /** Jedna linijka „Efekt: …" — biznesowy skutek usługi (bez zmyślonych liczb). */
  payoff: string;
  /** Weryfikowalny DOWÓD (trust): link do żywych realizacji / mierzalnego wyniku / umowy. */
  proof: { label: string; href?: string; external?: boolean };
  /** Odcień poświaty karty (OKLCH hue — system hue strony: 300/324/335/273). */
  hue: number;
}

// Copy KUPUJĄCEGO (redesign /uslugi 2026-08-26): nagłówki wynikowe, „Co dostajesz"
// z korzyścią przy każdym punkcie, „Efekt" + weryfikowalny dowód. Zasady bez zmian:
// obietnice TYLKO 24 h + umowa; liczby TYLKO prawdziwe i sprawdzalne (100/100
// Lighthouse tej strony, 6 żywych realizacji); zero zmyślonego ROI.
export const SERVICES: Service[] = [
  {
    n: "01",
    id: "projektowanie",
    title: "Projektowanie UX/UI",
    short: "Układ i ścieżki, które prowadzą odwiedzającego prosto do kontaktu.",
    lead: "Projektujemy układ pod jedną rzecz: odwiedzający ma w kilka sekund zrozumieć, co oferujesz, i wiedzieć, co kliknąć. Mniej zgadywania po jego stronie, więcej zapytań po Twojej.",
    points: [
      "Plan strony pod Twój cel biznesowy — sekcje, które sprzedają, bez zapychaczy",
      "Ścieżka klienta od wejścia do kontaktu, przemyślana na telefon i komputer",
      "Projekt graficzny spójny z marką — wyglądasz jak firma z wyższej półki",
      "Makiety do Twojej akceptacji, zanim powstanie kod — wiesz, co dostaniesz",
    ],
    outcome: "Strona, która prowadzi klienta do kontaktu",
    payoff: "Efekt: więcej odwiedzin kończy się zapytaniem, a nie „byłem i wyszedłem”.",
    proof: { label: "Zobacz układy, które tak pracują — realizacje na żywo", href: "/realizacje" },
    hue: 300,
  },
  {
    n: "02",
    id: "strony",
    title: "Strony internetowe 2D i 3D",
    short: "Szybkie strony na autorskim kodzie. Budowane pod Twój biznes, nie pod szablon.",
    lead: "Kodujemy od zera, bez szablonów i zbędnych wtyczek. Twoja strona ładuje się natychmiast, działa na każdym telefonie i wygląda, jakby powstała tylko dla Ciebie — bo powstała.",
    points: [
      "Strona firmowa, landing albo wizytówka — na własnym, lekkim kodzie",
      "Animacje i sceny 3D, które zapadają w pamięć (gdy pasują do Twojej marki)",
      "Pełna responsywność: od małego telefonu po duży monitor",
      "Własność bez haczyków: kod, domena i wszystkie dostępy są Twoje",
    ],
    outcome: "Szybka strona, jakiej nie ma nikt inny",
    payoff: "Efekt: klient zostaje i ogląda, zamiast uciec, zanim strona się załaduje.",
    proof: {
      label: "Każdą realizację otwierasz na żywo — przetestuj na swoim telefonie",
      href: "/realizacje",
    },
    hue: 324,
  },
  {
    n: "03",
    id: "optymalizacja",
    title: "SEO (Pozycjonowanie strony)",
    short: "Szybkość, widoczność w Google i analityka, która mówi wprost, co przynosi klientów.",
    lead: "Szybkość, techniczne SEO i dane strukturalne dostajesz w standardzie, nie jako dopłatę. Strona jest przygotowana pod Google i pod odpowiedzi AI (ChatGPT, Perplexity), a w analityce widzisz, skąd przychodzą zapytania.",
    points: [
      "Błyskawiczne ładowanie — Core Web Vitals na zielono",
      "SEO techniczne i dane strukturalne: fundament widoczności w Google i w AI",
      "Analityka bez ciasteczek — widzisz, co działa, bez baneru zgód",
      "Dostępność WCAG — nie tracisz klientów, którym strona „nie działa”",
    ],
    outcome: "Klienci znajdują Cię w Google i w AI",
    payoff: "Efekt: strona pracuje na Twoją widoczność całą dobę, nie tylko dla tych, którzy znają adres.",
    proof: {
      label: "Ta strona: 100/100 w Google Lighthouse (SEO i dostępność) — zmierz sam",
      href: "https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fkodastrony.pl%2Fuslugi%2F",
      external: true,
    },
    hue: 335,
  },
  {
    n: "04",
    id: "wsparcie",
    title: "Wsparcie i opieka",
    short: "Po starcie zostajemy: aktualizacje, bezpieczeństwo i rozwój, gdy firma rośnie.",
    lead: "Wdrożenie to początek. Aktualizujemy, pilnujemy bezpieczeństwa i dokładamy kolejne sekcje, gdy firma rośnie — Ty zajmujesz się biznesem, nie serwerem.",
    points: [
      "Aktualizacje i opieka techniczna w stałej, ustalonej opłacie",
      "Monitoring bezpieczeństwa i kopie zapasowe",
      "Rozbudowa strony: nowe podstrony, funkcje i treści — bez zaczynania od zera",
      "Bezpośredni kontakt i odpowiedź w 24 godziny",
    ],
    outcome: "Po starcie nie zostajesz z tym sam",
    payoff: "Efekt: strona nie starzeje się razem z datą wdrożenia.",
    proof: { label: "Zakres, termin i zasady opieki zapisujemy w umowie — na piśmie" },
    hue: 273,
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
