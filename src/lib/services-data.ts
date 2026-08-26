/**
 * Services — SINGLE SOURCE OF TRUTH.
 *
 * Used by the homepage "Co robimy" list (services.tsx → title + short) and the
 * full /uslugi page (lead + points). One module so the two never drift.
 */
export interface Service {
  /** Display number, e.g. "01" (home; /uslugi nie numeruje). */
  n: string;
  /** Anchor id on /uslugi (#projektowanie) — linkowane z home i stopki. */
  id: string;
  /** Nazwa usługi — mały znacznik wiersza, wiersz na home, Service.name w JSON-LD. */
  title: string;
  /** One-liner used on the homepage row. */
  short: string;
  /** Opis usługi do Service.description w JSON-LD (na /uslugi NIE renderowany). */
  lead: string;
  /** 6 TICKÓW „co oferujemy" — jedyna treść sekcji poza nazwą (życzenie Natana). */
  points: string[];
  /** Hue poświaty sekcji (system hue strony: 300/324/335/273). */
  hue: number;
}

// /uslugi v4 (2026-08-26, doszlif Natana): sekcja = numer + NAZWA + 6 ticków.
// Zero dodatkowych linii tekstu i przekierowań. Ticki niosą KONKRET: nazwany
// stack (02), keywordy SEO/AEO (03) i warunki opieki z gwarancją 14 dni oraz
// telefonem (04 — zakres zamówiony przez Natana). lead żyje tylko w JSON-LD.
export const SERVICES: Service[] = [
  {
    n: "01",
    id: "projektowanie",
    title: "Projektowanie UX/UI",
    short: "Układ i ścieżki, które prowadzą odwiedzającego prosto do kontaktu.",
    lead: "Projektujemy układ i ścieżki strony pod jeden cel: odwiedzający ma szybko zrozumieć ofertę i wysłać zapytanie. Makiety do akceptacji przed kodowaniem.",
    // ** … ** = pogrubienie kluczowej frazy w ticku (renderer Emph na /uslugi).
    points: [
      "**Strategia:** cel i grupa docelowa",
      "**Ścieżka klienta** aż do kontaktu",
      "Design **spójny z Twoją marką**",
      "**Makiety do akceptacji** przed kodem",
      "Responsywność: **telefon, tablet, desktop**",
      "**Mikroanimacje** i interakcje",
    ],
    hue: 300,
  },
  {
    n: "02",
    id: "strony",
    title: "Strony internetowe 2D i 3D",
    short: "Szybkie strony na autorskim kodzie. Budowane pod Twój biznes, nie pod szablon.",
    lead: "Strony firmowe, landingi i wizytówki na autorskim kodzie: Next.js 16, React 19, Tailwind CSS 4, TypeScript, sceny 3D w Three.js/WebGL, animacje Motion i Lenis, hosting edge CDN.",
    points: [
      "**Next.js 16** + React 19",
      "**Tailwind CSS 4** + TypeScript",
      "Sceny 3D: **Three.js / WebGL**",
      "Animacje: **Motion + Lenis**",
      "**Edge CDN** — serwery blisko klienta",
      "**Autorski kod**, zero szablonów",
    ],
    hue: 324,
  },
  {
    n: "03",
    id: "optymalizacja",
    title: "SEO (Pozycjonowanie strony)",
    short: "Szybkość, widoczność w Google i analityka, która mówi wprost, co przynosi klientów.",
    lead: "Techniczne fundamenty widoczności w standardzie: Core Web Vitals, SEO techniczne, AEO / AI Search (ChatGPT, Perplexity, Google AI Overviews), dane strukturalne schema.org, analityka bez cookies i dostępność WCAG 2.2.",
    points: [
      "**Core Web Vitals: 100/100**",
      "**SEO techniczne** + sitemap",
      "**AEO / AI Search:** ChatGPT, Perplexity",
      "Dane strukturalne **schema.org**",
      "**Analityka bez cookies** (RODO-friendly)",
      "Dostępność **WCAG 2.2 AA**",
    ],
    hue: 335,
  },
  {
    n: "04",
    id: "wsparcie",
    title: "Wsparcie i opieka",
    short: "Po starcie zostajemy: aktualizacje, bezpieczeństwo i rozwój, gdy firma rośnie.",
    lead: "Po wdrożeniu zostajemy na pokładzie: gwarancja techniczna 14 dni, wsparcie telefoniczne, odpowiedź w 24 h, aktualizacje, kopie zapasowe, monitoring bezpieczeństwa i rozbudowa strony.",
    points: [
      "**Gwarancja techniczna:** 14 dni po starcie",
      "**Wsparcie telefoniczne:** 511 107 468",
      "Odpowiedź **w 24 godziny**",
      "**Aktualizacje** i kopie zapasowe",
      "**Monitoring bezpieczeństwa** 24/7",
      "Rozbudowa: **nowe sekcje i funkcje**",
    ],
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
