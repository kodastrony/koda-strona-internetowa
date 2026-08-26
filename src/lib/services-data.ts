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
  /** Chipy „co dostajesz" — 2–4 SŁOWA każdy (anty-slop: zero akapitów). */
  points: string[];
  /** GIGANT wiersza indeksu na /uslugi (H2): krótki WYNIK dla klienta. */
  outcome: string;
  /** JEDNA linijka pod gigantem (≤12 słów) — jedyna proza wiersza. */
  tagline: string;
  /** Weryfikowalny DOWÓD: żywe realizacje / mierzalny wynik / umowa. */
  proof: { label: string; href?: string; external?: boolean };
  /** Hue poświaty wiersza (system hue strony: 300/324/335/273). */
  hue: number;
}

// /uslugi = „WIELKI INDEKS" (redesign 2026-08-26 po korekcie Natana): gigantyczna
// typografia wyników zamiast akapitów. Budżet copy: outcome 2–4 słowa, tagline
// ≤12 słów, chipy 2–4 słowa. Obietnice TYLKO 24 h + umowa; liczby TYLKO
// sprawdzalne (100/100 Lighthouse tej strony). lead żyje wyłącznie w JSON-LD.
export const SERVICES: Service[] = [
  {
    n: "01",
    id: "projektowanie",
    title: "Projektowanie UX/UI",
    short: "Układ i ścieżki, które prowadzą odwiedzającego prosto do kontaktu.",
    lead: "Projektujemy układ i ścieżki strony pod jeden cel: odwiedzający ma szybko zrozumieć ofertę i wysłać zapytanie. Makiety do akceptacji przed kodowaniem.",
    points: [
      "Cel i grupa docelowa",
      "Ścieżka do kontaktu",
      "Design spójny z marką",
      "Makiety przed kodem",
    ],
    outcome: "Projekt, który sprzedaje",
    tagline: "Układ i ścieżki pod jedno: zapytanie od klienta.",
    proof: { label: "Zobacz na realizacjach", href: "/realizacje" },
    hue: 300,
  },
  {
    n: "02",
    id: "strony",
    title: "Strony internetowe 2D i 3D",
    short: "Szybkie strony na autorskim kodzie. Budowane pod Twój biznes, nie pod szablon.",
    lead: "Strony firmowe, landingi i wizytówki na autorskim, lekkim kodzie — bez szablonów i zbędnych wtyczek. Z animacjami i scenami 3D, gdy pasują do marki.",
    points: ["Autorski kod", "Animacje i 3D", "Każdy ekran", "Wszystko Twoje"],
    outcome: "Strona szybsza niż konkurencja",
    tagline: "Autorski kod od zera — błyskawiczny, dopracowany, w pełni Twój.",
    proof: { label: "Przetestuj dema na żywo", href: "/realizacje" },
    hue: 324,
  },
  {
    n: "03",
    id: "optymalizacja",
    title: "SEO (Pozycjonowanie strony)",
    short: "Szybkość, widoczność w Google i analityka, która mówi wprost, co przynosi klientów.",
    lead: "Techniczne fundamenty widoczności w standardzie: szybkość (Core Web Vitals), SEO techniczne, dane strukturalne pod Google i silniki AI, analityka i dostępność WCAG.",
    points: [
      "Core Web Vitals",
      "SEO techniczne",
      "Analityka bez cookies",
      "Dostępność WCAG",
    ],
    outcome: "Widoczność w Google i AI",
    tagline: "Szybkość, techniczne SEO i dostępność w standardzie, nie w dopłacie.",
    proof: {
      label: "Ta strona: 100/100 w Lighthouse — zmierz sam",
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
    lead: "Po wdrożeniu zostajemy na pokładzie: aktualizacje, monitoring bezpieczeństwa, kopie zapasowe i rozbudowa strony razem z rozwojem firmy.",
    points: [
      "Aktualizacje",
      "Bezpieczeństwo i kopie",
      "Rozbudowa strony",
      "Odpowiedź w 24 h",
    ],
    outcome: "Opieka po starcie",
    tagline: "Zostajemy na pokładzie — strona rośnie razem z firmą.",
    proof: { label: "Zakres i zasady zapisane w umowie" },
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
