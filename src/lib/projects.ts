/**
 * Portfolio projects — SINGLE SOURCE OF TRUTH.
 *
 * Used by: the homepage Work section, the /realizacje list, and the
 * /realizacje/[id] case-study pages. One data model drives the grid card,
 * the full case study and the per-page JSON-LD.
 *
 * HONESTY NOTE (critical — never break): every project below is a fully built,
 * LIVE website (see `liveUrl`) that KODA designed and coded from scratch — but
 * each is for a FICTIONAL brand, built as a showcase of how we work. So:
 *   • never present a project as a real paying client,
 *   • never imply KODA was hired or paid for it,
 *   • NEVER fabricate a business metric (no "+70% konwersji").
 * `concept: true` renders the honest "Koncept" framing. The verifiable craft
 * proof in `metrics` is the credible substitute for fake KPIs — a viewer can
 * confirm every number by opening the live demo. When a REAL client project
 * lands, add it with concept omitted/false and real copy.
 */

/** A deliberate design decision, framed constraint → choice → benefit. */
export interface Decision {
  constraint: string;
  choice: string;
  benefit: string;
}

/** A verifiable craft fact (NOT a fabricated business KPI). */
export interface Metric {
  value: string;
  label: string;
}

/** A standout feature of the build. */
export interface Feature {
  title: string;
  desc: string;
}

/** A gallery screenshot + its caption. */
export interface GalleryShot {
  src: string;
  caption: string;
}

export interface Project {
  /** URL slug — /realizacje/[id]. */
  id: string;
  /** Brand name (display H1). */
  title: string;
  /** One-line brand descriptor, shown under the name. */
  tagline: string;
  /** Project kind, e.g. "Interaktywna strona 3D". */
  type: string;
  year: string;
  /** Client sector / branża. */
  client: string;
  /** The live, working demo. */
  liveUrl: string;
  /** One-line summary for cards + lists. */
  summary: string;
  /** Longer intro paragraph for the case-study hero. */
  intro: string;
  /** The business problem this kind of company faces (headline + paragraph). */
  challengeTitle: string;
  challenge: string;
  /** Decision log — the honest substitute for a testimonial. */
  decisions: Decision[];
  /** What the project covered. */
  scope: string[];
  /** What the build delivers (qualitative craft signals — no fabricated numbers). */
  deliverables: string[];
  /** Standout features. */
  features: Feature[];
  /** Verifiable craft proof (true, testable in-browser). */
  metrics: Metric[];
  /** Tech stack. */
  tech: string[];
  /** Card crop (4:3) in /public/realizacje. */
  image: string;
  /** Detail-page hero showcase (wide). */
  showcase: string;
  /** Gallery screenshots (desktop). */
  gallery: GalleryShot[];
  /** Mobile (phone) screenshot. */
  mobileImage: string;
  /** Looping clip of the signature animation (mp4, muted) + its poster frame. */
  video: string;
  poster: string;
  /** True = concept/demo piece for a fictional brand (renders honest framing). */
  concept?: boolean;
  /** Card background gradient (brand-world base, shows as glow/loading state). */
  bg: string;
  /** Accent glow colour. */
  glow: string;
  /** Accent as "r,g,b" for rgba() shadows/borders. */
  rgb: string;
}

export const PROJECTS: Project[] = [
  {
    id: "rikoszet",
    title: "RIKOSZET",
    tagline: "Bar i klub gier, który zwiedzasz w 3D",
    type: "Interaktywna strona 3D",
    year: "2026",
    client: "Gastronomia & rozrywka",
    liveUrl: "https://rikoszet.kodastrony.pl",
    summary:
      "Bar i klub gier, który zwiedzasz w 3D — cały lokal w przeglądarce, z rezerwacją stołu na planie sali.",
    intro:
      "RIKOSZET to bar w starej rozlewni: bilard, rzutki, karaoke i scena pod jednym dachem. Zamiast galerii zdjęć zbudowaliśmy cały lokal w 3D — można obejrzeć go z każdej strony, zajrzeć do środka i od razu zarezerwować konkretny stół. Wszystko działa płynnie w przeglądarce, na telefonie i na komputerze.",
    challengeTitle: "Lokal pełen atrakcji, którego nie da się pokazać zdjęciem.",
    challenge:
      "Bar z bilardem, rzutkami, karaoke i sceną żyje atmosferą — a tę najtrudniej oddać statyczną galerią. Gość chce poczuć miejsce i wiedzieć, gdzie usiądzie, zanim zadzwoni i zarezerwuje.",
    decisions: [
      {
        constraint: "Bar to atmosfera, nie menu.",
        choice: "Zbudowaliśmy interaktywną scenę 3D zamiast galerii zdjęć.",
        benefit: "Gość czuje klimat lokalu, zanim w ogóle wejdzie.",
      },
      {
        constraint: "Cztery strefy trudno pokazać na płasko.",
        choice: "Dodaliśmy przekroje budynku i klikalne hotspoty stref.",
        benefit: "Każda atrakcja dostaje swój moment i kontekst.",
      },
      {
        constraint: "3D bywa ciężkie na telefonie.",
        choice: "Scena generuje się w kodzie, z auto-dopasowaniem jakości.",
        benefit: "Płynnie i na mocnym PC, i na słabszym telefonie.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Modelowanie sceny 3D (Three.js)",
      "Interaktywny kreator rezerwacji",
      "Tryb dzienny i nocny",
      "Optymalizacja wydajności 3D",
      "SEO i dostępność (WCAG 2.2 AA)",
    ],
    deliverables: [
      "Cały lokal w 3D generowany w przeglądarce — zero plików do pobrania",
      "Automatyczne dopasowanie jakości do mocy urządzenia",
      "Pełna obsługa klawiatury i czytników ekranu (axe-core: 0 błędów)",
      "Dane strukturalne dla Google (godziny, adres, mapa) + komplet meta i ikon",
    ],
    features: [
      {
        title: "Zwiedzanie w 3D",
        desc: "Cały lokal do obejrzenia z każdej strony — obrót, zoom i trzy przekroje budynku (parter, piętro, dach).",
      },
      {
        title: "Tryb nocny z neonami",
        desc: "Jednym kliknięciem lokal zmienia się w wieczorny klimat: świecący szyld, lampki w ogródku, ciepłe okna.",
      },
      {
        title: "Rezerwacja na planie sali",
        desc: "Kreator w 5 krokach — gość wybiera konkretny stół, tor do rzutek albo lożę i widzi dostępność.",
      },
      {
        title: "Status „otwarte do…”",
        desc: "Godziny otwarcia liczone na żywo, więc informacja jest zawsze aktualna.",
      },
    ],
    metrics: [
      { value: "3D", label: "Cały lokal w przeglądarce" },
      { value: "WCAG 2.2 AA", label: "axe-core: 0 błędów" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["Three.js", "Vite", "JavaScript", "WebGL"],
    image: "/realizacje/rikoszet-card.webp",
    showcase: "/realizacje/rikoszet-showcase.webp",
    gallery: [
      {
        src: "/realizacje/rikoszet-g1.webp",
        caption: "Tryb nocny — neony, lampki i ciepłe okna jednym kliknięciem.",
      },
      {
        src: "/realizacje/rikoszet-g2.webp",
        caption: "Przekrój budynku — wnętrza widać jak w domku dla lalek.",
      },
    ],
    mobileImage: "/realizacje/rikoszet-mobile.webp",
    video: "/realizacje/rikoszet.mp4",
    poster: "/realizacje/rikoszet-poster.webp",
    concept: true,
    bg: "linear-gradient(150deg,#0e1a14 0%,#13241c 55%,#1b3327 100%)",
    glow: "#efb24a",
    rgb: "239,178,74",
  },
  {
    id: "grabowski",
    title: "Grabowski",
    tagline: "Pracownia stolarska w szwajcarskim stylu",
    type: "Strona firmowa",
    year: "2026",
    client: "Stolarstwo & rzemiosło",
    liveUrl: "https://grabowski.kodastrony.pl",
    summary:
      "Strona pracowni stolarskiej w szwajcarskim stylu — spokojna, elegancka, z realizacjami w pełnoekranowych galeriach.",
    intro:
      "Grabowski projektuje kuchnie, zabudowy i meble z litego drewna na wymiar. Strona miała oddać to, czym jest dobre rzemiosło: spokój, precyzję i jakość. Postawiliśmy na dużo światła, dużą typografię i płynny scroll — a realizacje pokazujemy w poziomych galeriach przewijanych ruchem strony.",
    challengeTitle: "Najwyższa jakość rzemiosła i strona jak u wszystkich.",
    challenge:
      "Dobry stolarz konkuruje precyzją i materiałem, nie ceną. Jeśli strona wygląda przeciętnie, klient z góry zakłada przeciętną pracownię — a to, co premium, ginie, zanim zdąży się pokazać.",
    decisions: [
      {
        constraint: "Rzemiosło konkuruje jakością, nie ceną.",
        choice: "Postawiliśmy na szwajcarski spokój: światło, typografię, powietrze.",
        benefit: "Strona od pierwszego ekranu mówi „klasa”.",
      },
      {
        constraint: "Realizacje muszą mówić same za siebie.",
        choice: "Pokazujemy je w poziomych galeriach przewijanych scrollem.",
        benefit: "Zdjęcia płyną krawędź w krawędź — jak w albumie.",
      },
      {
        constraint: "Płynność nie może kosztować wydajności.",
        choice: "Na słabszym sprzęcie wyłączamy efekty i wracamy do natywnego scrolla.",
        benefit: "Zero janku, niezależnie od urządzenia.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Architektura treści (SPA)",
      "Galerie realizacji scrubowane scrollem",
      "Animacje i płynny scroll (GSAP)",
      "Formularz zapytania z RODO",
      "SEO, wydajność i dostępność",
    ],
    deliverables: [
      "Spokojna, „szwajcarska” identyfikacja online budująca zaufanie",
      "Płynny scroll z automatycznym wyłączeniem na słabszych urządzeniach",
      "Dostępność WCAG 2.2 AA (fokus, pułapka fokusu w menu, reduced-motion)",
      "Komplet pod SEO: dane strukturalne firmy, sitemap, Open Graph",
    ],
    features: [
      {
        title: "Płynny scroll i parallax",
        desc: "Cała strona porusza się miękko, a zdjęcia przesuwają się z lekkim parallaxem — wrażenie dopracowania w każdym geście.",
      },
      {
        title: "Galerie scrubowane scrollem",
        desc: "Realizacje pokazujemy w poziomych galeriach przewijanych ruchem strony; na telefonie składają się do czytelnego pionu.",
      },
      {
        title: "Hero z autorskim sliderem",
        desc: "Płynna „taśma” slajdów: nawet spam kliknięć nie psuje animacji — strona dowozi jeden gładki przejazd.",
      },
      {
        title: "Mega-menu i podstrony",
        desc: "Oferta i realizacje na osobnych podstronach, z markowymi przejściami i powrotami — jak w dużych serwisach.",
      },
    ],
    metrics: [
      { value: "Płynny scroll", label: "GSAP + ScrollSmoother" },
      { value: "WCAG 2.2 AA", label: "Fokus, kontrast, reduced-motion" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["GSAP", "ScrollTrigger", "HTML / CSS / JS", "Bez frameworka"],
    image: "/realizacje/grabowski-card.webp",
    showcase: "/realizacje/grabowski-showcase.webp",
    gallery: [
      {
        src: "/realizacje/grabowski-g1.webp",
        caption:
          "Realizacje w poziomej galerii — zdjęcia przesuwają się w bok, gdy zjeżdżasz stroną.",
      },
      {
        src: "/realizacje/grabowski-g2.webp",
        caption: "Spokojna, edytorska strona oferty z galerią realizacji.",
      },
    ],
    mobileImage: "/realizacje/grabowski-mobile.webp",
    video: "/realizacje/grabowski.mp4",
    poster: "/realizacje/grabowski-poster.webp",
    concept: true,
    bg: "linear-gradient(150deg,#17130f 0%,#241c14 55%,#33271a 100%)",
    glow: "#c9a06a",
    rgb: "201,160,106",
  },
  {
    id: "wycisk",
    title: "WYCISK",
    tagline: "Fit soki rozłożone na czynniki pierwsze",
    type: "Strona produktowa",
    year: "2026",
    client: "Soki & zdrowe odżywianie",
    liveUrl: "https://wycisk.kodastrony.pl",
    summary:
      "Soki rozkładane na czynniki pierwsze — kliknij butelkę, a składniki rozlatują się na orbitę z witaminami i przepisem.",
    intro:
      "WYCISK to marka fit soków z charakterem. Zamiast nudnej listy składników zrobiliśmy z niej atrakcję: klikasz sok, a butelka rozpada się na czynniki pierwsze — składniki wylatują na orbitę, pokazują witaminy i przepis, a listę zakupów wrzucasz prosto do koszyka. Jest też kreator własnego soku.",
    challengeTitle: "Zdrowy sok, który musi się obronić bez detoks-ściemy.",
    challenge:
      "Produkt spożywczy sprzedaje apetyt i zaufanie. Trzeba pokazać, że sok jest naprawdę z owoców — w sposób, który bawi i zapada w pamięć, a nie brzmi jak kolejna obietnica „oczyszczania organizmu”.",
    decisions: [
      {
        constraint: "Lista składników to nuda.",
        choice: "Zrobiliśmy z niej animację „rozkładu na czynniki pierwsze”.",
        benefit: "Poznawanie soku staje się atrakcją, którą się pamięta.",
      },
      {
        constraint: "Jedzenie sprzedaje zaufanie.",
        choice: "Pokazujemy konkretne składniki, witaminy i liczby — zero detoks-ściemy.",
        benefit: "Marka brzmi szczerze i apetycznie.",
      },
      {
        constraint: "Strona ma działać, nie udawać.",
        choice: "Koszyk liczy, kreator buduje, każdy przycisk dowozi.",
        benefit: "Zero dekoracyjnych atrap — wszystko naprawdę działa.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Autorskie ilustracje SVG",
      "Animacja „rozkładu” soków",
      "Kreator własnego soku + koszyk",
      "Treść (przepisy, wartości)",
      "Responsywność i dostępność",
    ],
    deliverables: [
      "Lekka, jednoplikowa strona — błyskawiczne ładowanie, zero zależności",
      "Każdy element naprawdę działa (koszyk, kreator, przepisy)",
      "Pełna responsywność — orbita składników działa też na telefonie",
      "Spójny, autorski system wizualny i ilustracje",
    ],
    features: [
      {
        title: "Rozkład na czynniki pierwsze",
        desc: "Kliknięcie soku odpala animację: składniki wylatują na orbitę z witaminami, ilościami i przepisem krok po kroku.",
      },
      {
        title: "Kreator własnego soku",
        desc: "Wybierasz 3–6 składników, nazywasz miksturę, a butelka napełnia się na żywo kolorem zależnym od owoców.",
      },
      {
        title: "Działający koszyk",
        desc: "Składniki z przepisu wrzucasz do koszyka — wysuwany panel z sumą i listą zakupów.",
      },
      {
        title: "Ręcznie rysowane SVG",
        desc: "Każdy owoc, butelka i odznaka to autorska grafika wektorowa — ostra na każdym ekranie.",
      },
    ],
    metrics: [
      { value: "1 plik", label: "Zero zależności, błyskawiczny start" },
      { value: "100%", label: "Działające UI (koszyk, kreator)" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["HTML / CSS / JS", "SVG", "Animacje natywne", "Zero zależności"],
    image: "/realizacje/soki-card.webp",
    showcase: "/realizacje/soki-showcase.webp",
    gallery: [
      {
        src: "/realizacje/soki-g1.webp",
        caption: "Rozkład soku — składniki na orbicie, witaminy i przepis.",
      },
      {
        src: "/realizacje/soki-g2.webp",
        caption: "Kreator własnego soku z butelką napełnianą na żywo.",
      },
    ],
    mobileImage: "/realizacje/soki-mobile.webp",
    video: "/realizacje/wycisk.mp4",
    poster: "/realizacje/wycisk-poster.webp",
    concept: true,
    bg: "linear-gradient(150deg,#101710 0%,#16241a 55%,#1d3324 100%)",
    glow: "#8ec63f",
    rgb: "142,198,63",
  },
  {
    id: "slice",
    title: "SLICE",
    tagline: "Kreskówkowy landing pizzerii z pieca",
    type: "Landing page",
    year: "2026",
    client: "Gastronomia / pizzeria",
    liveUrl: "https://slice.kodastrony.pl",
    summary:
      "Odważny, kreskówkowy landing pizzerii — wielka typografia plakatowa, maskotki z „oczami google” i samolocik lecący ze scrollem.",
    intro:
      "SLICE to neapolitańska pizza z pieca opalanego drewnem — i landing, który krzyczy charakterem. Intro buduje pizzę składnik po składniku, kolory wjeżdżają pasami, a po stronie lata papierowy samolocik prowadzony scrollem. Maksymalizm w dobrym stylu: dużo animacji, zero przypadku.",
    challengeTitle: "Lokalna pizzeria, która ginie wśród sieciówek.",
    challenge:
      "Na rynku pełnym powtarzalnych, „bezpiecznych” stron gastronomicznych trudno się wyróżnić. Marka z charakterem potrzebuje strony, która sprzedaje ten charakter w pierwszej sekundzie — zanim ktoś w ogóle pomyśli o zamówieniu.",
    decisions: [
      {
        constraint: "Pizzeria ginie wśród sieciówek.",
        choice: "Daliśmy marce odważną, kreskówkową tożsamość.",
        benefit: "SLICE wyróżnia się i zostaje w głowie w sekundę.",
      },
      {
        constraint: "„Wow” musi przyjść od razu.",
        choice: "Intro buduje pizzę składnik po składniku, a kolor wjeżdża pasami.",
        benefit: "Pierwszy ekran zatrzymuje gościa, zanim scrollnie dalej.",
      },
      {
        constraint: "Dużo animacji to ryzyko zacięć.",
        choice: "Ruch oparty tylko na transform/opacity, z pełnym reduced-motion.",
        benefit: "Bogata oprawa, a mimo to płynnie i dostępnie.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Autorskie ilustracje i maskotki SVG",
      "Intro-loader i odsłona",
      "Choreografia animacji scrollem (GSAP)",
      "Płynny scroll (Lenis)",
      "Responsywność i dostępność",
    ],
    deliverables: [
      "Mocna, rozpoznawalna tożsamość wizualna marki",
      "Bogate animacje oparte tylko na transform/opacity — płynnie mimo „głośnej” oprawy",
      "Fonty i biblioteki hostowane lokalnie — działa offline, ładuje się szybko",
      "Pełne wsparcie reduced-motion i obsługa klawiatury",
    ],
    features: [
      {
        title: "Intro budujące pizzę",
        desc: "Loader składa pizzę warstwa po warstwie — sos, ser, pepperoni, bazylia — a potem kolor wjeżdża pasami do hero.",
      },
      {
        title: "Samolocik na scrollu",
        desc: "Papierowy samolot leci po wyznaczonej trasie SVG między kartami miast — zawsze trzyma się ścieżki, na każdym ekranie.",
      },
      {
        title: "Maskotki z charakterem",
        desc: "Pizze z „oczami google” śledzącymi kursor i białymi rękawiczkami — tożsamość, którą się pamięta.",
      },
      {
        title: "Typografia plakatowa",
        desc: "Wielka, obrysowana typografia daje „pulchny”, plakatowy efekt — głośno, ale ze smakiem.",
      },
    ],
    metrics: [
      { value: "WCAG 2.1 AA", label: "Pełne reduced-motion" },
      { value: "Offline", label: "Fonty i biblioteki lokalnie" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["GSAP", "ScrollTrigger", "Lenis", "HTML / CSS / JS", "SVG"],
    image: "/realizacje/slice-card.webp",
    showcase: "/realizacje/slice-showcase.webp",
    gallery: [
      {
        src: "/realizacje/slice-g1.webp",
        caption: "Papierowy samolot leci ze scrollem po trasie między miastami.",
      },
      {
        src: "/realizacje/slice-g2.webp",
        caption: "Apetyczne zdjęcia dań i maskotki z „oczami google”.",
      },
    ],
    mobileImage: "/realizacje/slice-mobile.webp",
    video: "/realizacje/slice.mp4",
    poster: "/realizacje/slice-poster.webp",
    concept: true,
    bg: "linear-gradient(150deg,#1a0f0c 0%,#2a1310 55%,#3a1814 100%)",
    glow: "#f0512f",
    rgb: "240,81,47",
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
