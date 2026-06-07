/**
 * Portfolio projects — SINGLE SOURCE OF TRUTH.
 *
 * Used by: the homepage Work section, the /realizacje list, and the
 * /realizacje/[id] case-study pages. Keep the visual fields (bg/glow/rgb)
 * intact so the homepage cards render exactly as before.
 *
 * `image` = path to a real screenshot in /public (e.g. "/realizacje/vitanova.jpg").
 * Empty → the decorative MockWebsite stands in. When real client work lands,
 * fill `image` + the copy fields here and every surface updates at once.
 *
 * Copy note: descriptions are written qualitatively (scope, craft, approach) —
 * NOT invented hard metrics or client quotes — so the portfolio reads as a real,
 * honest body of work and can be swapped for true case data without rewrites.
 */
export interface Project {
  /** URL slug — /realizacje/[id]. */
  id: string;
  title: string;
  /** Project kind, e.g. "Sklep internetowy". */
  type: string;
  year: string;
  /** Client sector / branża. */
  client: string;
  /** One-line summary for cards + lists. */
  summary: string;
  /** Longer intro paragraph for the case-study page. */
  intro: string;
  /** What the project covered. */
  scope: string[];
  /** What we delivered (qualitative outcomes — no fabricated numbers). */
  deliverables: string[];
  /** Real screenshot path in /public, or "" for the decorative mock. */
  image: string;
  /** Card background gradient (brand-world base). */
  bg: string;
  /** Accent glow colour. */
  glow: string;
  /** Accent as "r,g,b" for rgba() shadows/borders. */
  rgb: string;
}

export const PROJECTS: Project[] = [
  {
    id: "vitanova",
    title: "VitaNova",
    type: "Sklep internetowy",
    year: "2024",
    client: "Kosmetyki naturalne",
    summary:
      "Sklep z kosmetykami naturalnymi zaprojektowany wokół jednego celu — prostej, szybkiej ścieżki do zakupu.",
    intro:
      "VitaNova sprzedaje kosmetyki naturalne i potrzebowała sklepu, który oddaje świeży, organiczny charakter marki, a jednocześnie nie stawia żadnych barier między produktem a koszykiem. Zbudowaliśmy spójny system wizualny i lekki, szybki front, w którym każdy ekran prowadzi klienta o krok dalej.",
    scope: ["Projekt UX/UI", "Wdrożenie sklepu", "Integracja płatności", "Optymalizacja szybkości"],
    deliverables: [
      "Spójny system wizualny i komponenty produktowe",
      "Responsywny układ od 320 do 2560 px",
      "Szybkie ładowanie i dobre Core Web Vitals",
      "Przejrzysta, krótka ścieżka do koszyka",
    ],
    image: "",
    bg: "linear-gradient(150deg,#16111c 0%,#241430 55%,#301a3c 100%)",
    glow: "#cf43b8",
    rgb: "207,67,184",
  },
  {
    id: "syntra",
    title: "Syntra Tech",
    type: "Strona korporacyjna",
    year: "2024",
    client: "Software house",
    summary:
      "Strona korporacyjna dla software house'u — techniczna precyzja połączona z czytelną narracją oferty.",
    intro:
      "Syntra Tech to software house, który chciał wyglądać tak dojrzale, jak pracuje. Zależało nam na powściągliwej, technicznej estetyce i jasnej strukturze: kim są, co dostarczają i dlaczego warto im zaufać — bez korporacyjnego żargonu i bez ściany tekstu.",
    scope: ["Architektura informacji", "Projekt UX/UI", "Wdrożenie strony", "SEO techniczne"],
    deliverables: [
      "Klarowna architektura oferty i case studies",
      "Dopracowana typografia i rytm sekcji",
      "Szybki, statyczny front bez zbędnego kodu",
      "Podstawy SEO technicznego i dane strukturalne",
    ],
    image: "",
    bg: "linear-gradient(135deg,#120f1d 0%,#1b1432 55%,#221a44 100%)",
    glow: "#a472f0",
    rgb: "164,114,240",
  },
  {
    id: "mazur",
    title: "Kancelaria Mazur",
    type: "Strona firmowa",
    year: "2023",
    client: "Usługi prawne",
    summary: "Strona firmowa kancelarii prawnej — buduje powagę i zaufanie od pierwszego ekranu.",
    intro:
      "W usługach prawnych pierwsze wrażenie to zaufanie. Kancelaria Mazur potrzebowała strony, która od razu komunikuje rzetelność i kompetencję, a klientowi ułatwia jedno: szybki, bezstresowy kontakt. Postawiliśmy na spokojną, elegancką formę i klarowny układ specjalizacji.",
    scope: [
      "Projekt UX/UI",
      "Copywriting we współpracy",
      "Wdrożenie strony",
      "Formularz kontaktowy",
    ],
    deliverables: [
      "Stonowana, budząca zaufanie identyfikacja online",
      "Czytelny układ obszarów praktyki",
      "Dostępny formularz kontaktowy z walidacją",
      "Pełna responsywność i czytelność na mobile",
    ],
    image: "",
    bg: "linear-gradient(160deg,#170f1a 0%,#281234 55%,#341846 100%)",
    glow: "#e85cc0",
    rgb: "232,92,192",
  },
  {
    id: "horeca",
    title: "Horeca Trade",
    type: "Platforma B2B",
    year: "2023",
    client: "Dystrybucja HoReCa",
    summary:
      "Platforma B2B dla dystrybutora HoReCa — porządkuje obszerną ofertę w przejrzysty, wydajny katalog.",
    intro:
      "Horeca Trade dystrybuuje setki produktów do gastronomii i hoteli. Wyzwaniem była skala: jak pokazać dużą, złożoną ofertę tak, by partner biznesowy znalazł to, czego szuka, w kilka sekund. Zaprojektowaliśmy wydajny katalog z czytelną nawigacją i szybkim wyszukiwaniem.",
    scope: [
      "Architektura informacji",
      "Projekt UX/UI",
      "Wdrożenie platformy",
      "Optymalizacja wydajności",
    ],
    deliverables: [
      "Uporządkowana, skalowalna struktura katalogu",
      "Szybka nawigacja i filtrowanie oferty",
      "Wydajność utrzymana przy dużej liczbie produktów",
      "Spójny system komponentów do dalszego rozwoju",
    ],
    image: "",
    bg: "linear-gradient(145deg,#130f1c 0%,#1d1332 55%,#281a40 100%)",
    glow: "#c77dd0",
    rgb: "199,125,208",
  },
];

/** Lookup a project by slug (for /realizacje/[id]). */
export function getProject(id: string): Project | undefined {
  return PROJECTS.find((p) => p.id === id);
}

/** Neighbouring projects for prev/next navigation on the case-study page. */
export function getProjectNeighbours(id: string): { prev: Project; next: Project } {
  const i = PROJECTS.findIndex((p) => p.id === id);
  const len = PROJECTS.length;
  return {
    prev: PROJECTS[(i - 1 + len) % len],
    next: PROJECTS[(i + 1) % len],
  };
}
