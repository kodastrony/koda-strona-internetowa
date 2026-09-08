/**
 * Portfolio projects — SINGLE SOURCE OF TRUTH.
 *
 * Used by: the homepage Work section, the /realizacje list, and the
 * /realizacje/[id] case-study pages. One data model drives the grid card,
 * the full case study and the per-page JSON-LD.
 *
 * HONESTY NOTE (critical — never break): every project below is a fully built,
 * LIVE website (see `liveUrl`) that KODA designed and coded from scratch.
 *   • `concept: true` → a FICTIONAL brand built purely as a showcase of how we
 *     work; renders the honest "Koncept" framing. Never present it as a real
 *     paying client and never imply KODA was hired or paid for it.
 *   • concept omitted/false → a REAL brand with a real product (e.g. DrBlocks,
 *     JR Modular Systems) whose site KODA built; copy describes only what was
 *     built, never a hire/payment we can't prove.
 *   • In BOTH cases: NEVER fabricate a business metric (no "+70% konwersji").
 * The verifiable craft proof in `metrics` is the credible substitute for fake
 * KPIs — a viewer can confirm every claim by opening the live site.
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
  /** Opcjonalny SEO <title> (bez sufiksu marki) — gdy `title — type` wypada poza
   *  okno 50–60 znaków z template'em „| KODA Studio". */
  seoTitle?: string;
  /** Opcjonalna meta description 150–160 znaków — gdy summary za krótkie/za długie. */
  seoDescription?: string;
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
  /** Czas trwania klipu (ISO 8601) do VideoObject JSON-LD — REALNY, z ffprobe. */
  videoDuration: string;
  /** True = concept/demo piece for a fictional brand (renders honest framing). */
  concept?: boolean;
  /** Card background gradient (brand-world base, shows as glow/loading state). */
  bg: string;
  /** Accent glow colour. */
  glow: string;
  /** Accent as "r,g,b" for rgba() shadows/borders. */
  rgb: string;
}

const PROJECTS_DATA: Project[] = [
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
    seoDescription:
      "Bar i klub gier, który zwiedzasz w 3D — cały lokal w przeglądarce: tryb nocny z neonami, rezerwacja konkretnego stołu na planie sali i godziny otwarcia na żywo.",
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
    videoDuration: "PT11S",
    concept: true,
    bg: "linear-gradient(150deg,#0e1a14 0%,#13241c 55%,#1b3327 100%)",
    glow: "#efb24a",
    rgb: "239,178,74",
  },
  {
    id: "jr-modular",
    title: "JR Modular Systems",
    tagline: "Budynki modułowe, które układasz w 3D",
    type: "Strona firmowa z konfiguratorem 3D",
    year: "2026",
    client: "Budownictwo modułowe",
    liveUrl: "https://jr-modular-systems.kodastrony.pl",
    summary:
      "Producent budynków modułowych z filmowym hero i konfiguratorem 3D — układasz obiekt z kontenerów 20'/40', dokładasz okna, drzwi, panele PV i taras.",
    seoTitle: "JR Modular — strona z konfiguratorem 3D",
    intro:
      "JR Modular Systems stawia budynki z modułów — biura, przedszkola, gastronomię, hotele. Stronie daliśmy filmowy, przemysłowy charakter i autorski konfigurator 3D: klient układa swój obiekt z kontenerów 20' i 40', piętruje moduły, dokłada okna, drzwi, panele PV i taras — a gotowy projekt wysyła do wyceny.",
    challengeTitle: "Modułowy producent musi pokazać skalę i elastyczność naraz.",
    challenge:
      "Budynki z kontenerów żyją elastycznością — można je łączyć, piętrować i dowolnie konfigurować. Trudno to oddać galerią cudzych realizacji; klient chce zobaczyć WŁASNY obiekt, zanim zapyta o cenę.",
    decisions: [
      {
        constraint: "Modułowości nie odda zdjęcie gotowej realizacji.",
        choice: "Zbudowaliśmy konfigurator 3D — klient układa obiekt z modułów 20'/40' na placu.",
        benefit: "Każdy projektuje swój budynek, nie ogląda cudzego.",
      },
      {
        constraint: "Pierwsze sekundy decydują, czy ktoś zostaje.",
        choice: "Hero to filmowe, surowe ujęcia montażu modułów dźwigiem na żywo.",
        benefit: "Marka od razu mówi „robimy to naprawdę, w skali”.",
      },
      {
        constraint: "Konfigurator 3D bywa ciężki i nieczytelny.",
        choice:
          "Izometryczny plac z siatką, podpowiedzi krok po kroku i licznik modułów/m²/kondygnacji.",
        benefit: "Składanie obiektu jest proste jak układanie klocków.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Konfigurator 3D obiektów modułowych (Three.js)",
      "Filmowy hero i montaż treści",
      "Architektura oferty (8 typów obiektów)",
      "Realizacje, proces i FAQ",
      "SEO, wydajność i dostępność",
    ],
    deliverables: [
      "Konfigurator 3D: moduły 20'/40', piętrowanie, okna, drzwi, panele PV i taras",
      "Licznik modułów, metrażu i kondygnacji liczony na żywo",
      "Filmowy hero budujący zaufanie od pierwszego ekranu",
      "Komplet pod SEO: dane strukturalne firmy, sitemap, Open Graph",
    ],
    features: [
      {
        title: "Konfigurator 3D „Kreator”",
        desc: "Układasz obiekt z kontenerów 20' i 40' na placu, stawiasz piętra i od razu widzisz metraż, liczbę modułów i kondygnacji.",
      },
      {
        title: "Okna, drzwi, taras, PV",
        desc: "Detale dokładasz na właściwych ścianach i dachach — konfigurator pilnuje, co gdzie pasuje (np. ostrzega „brak podpory”).",
      },
      {
        title: "Filmowy hero",
        desc: "Surowe, czarno-białe ujęcia montażu modułów dźwigiem — strona od pierwszej sekundy mówi „prawdziwa produkcja”.",
      },
      {
        title: "Pełna oferta i realizacje",
        desc: "Osiem typów obiektów, proces w pięciu krokach i galeria realizacji — jeden spójny, przemysłowy świat.",
      },
    ],
    metrics: [
      { value: "Konfigurator 3D", label: "Twój obiekt z modułów 20'/40' w przeglądarce" },
      { value: "20' / 40'", label: "Moduły ISO, piętrowanie, okna, drzwi, taras, PV" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["Three.js", "WebGL", "JavaScript", "SPA (hash-router)"],
    image: "/realizacje/jr-card.webp",
    showcase: "/realizacje/jr-showcase.webp",
    gallery: [
      {
        src: "/realizacje/jr-g1.webp",
        caption: "Realizacje obiektów modułowych — biura, gastronomia, pawilony i strefy eventowe.",
      },
      {
        src: "/realizacje/jr-g2.webp",
        caption: "Oferta podzielona na osiem typów obiektów — każdy z własnym kontekstem.",
      },
    ],
    mobileImage: "/realizacje/jr-mobile.webp",
    video: "/realizacje/jr.mp4",
    poster: "/realizacje/jr-poster.webp",
    videoDuration: "PT14S",
    bg: "linear-gradient(150deg,#14130e 0%,#201d12 55%,#2b2614 100%)",
    glow: "#f4c020",
    rgb: "244,192,32",
  },
  {
    id: "drblocks",
    title: "DrBlocks",
    tagline: "Regulowane bloczki fundamentowe, których dotkniesz w 3D",
    type: "Strona produktowa z modelem 3D",
    year: "2026",
    client: "Fundamenty & budownictwo",
    liveUrl: "https://drblocks.kodastrony.pl",
    summary:
      "Strona regulowanych bloczków fundamentowych z interaktywnym modelem 3D i kalkulatorem, który dobiera rozstaw, rozkłada podpory i sprawdza nośność.",
    intro:
      "DrBlocks to system regulowanych bloczków fundamentowych — fundament w jeden dzień, bez wylewki i tygodni schnięcia. Zamiast katalogu zbudowaliśmy stronę, która pokazuje produkt tak, jak działa: pełny bloczek w 3D z regulacją wysokości na żywo i kalkulator, który dobiera rozstaw, liczy podpory i sprawdza nośność.",
    challengeTitle: "Inżynierski produkt, którego nie sprzeda zdjęcie w katalogu.",
    challenge:
      "Regulowany bloczek fundamentowy to konkret: beton B30, stalowa stopa, śruby M16, regulacja co do milimetra. Z płaskiego zdjęcia klient nie zobaczy, jak to działa — ani ile bloczków potrzebuje pod swój taras czy dom modułowy.",
    decisions: [
      {
        constraint: "Bloczka trudno docenić ze zdjęcia.",
        choice: "Zbudowaliśmy interaktywny model 3D — obrót, zoom i regulacja 120–200 mm na żywo.",
        benefit: "Klient rozumie konstrukcję, zanim cokolwiek zamówi.",
      },
      {
        constraint: "Klienci nie wiedzą, ile bloczków kupić.",
        choice: "Kalkulator doboru liczy rozstaw, podpory i nośność na bazie researchu.",
        benefit: "Realna wstępna ocena zamiast zgadywanki — i gotowy lead.",
      },
      {
        constraint: "Ciężki render 3D potrafi ściąć telefon.",
        choice:
          "Pętla renderu pauzuje poza ekranem i w trakcie scrolla, jakość dobiera się do sprzętu.",
        benefit: "Płynnie i na mocnym PC, i na słabszym telefonie.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Interaktywny model bloczka 3D (React Three Fiber)",
      "Kalkulator doboru bloczków",
      "Treść techniczna (specyfikacja, FAQ, blog)",
      "Optymalizacja wydajności 3D",
      "SEO, dane strukturalne i dostępność",
    ],
    deliverables: [
      "Pełny model bloczka generowany w przeglądarce — zero plików do pobrania",
      "Kalkulator liczący rozstaw, podpory i nośność z realnego researchu",
      "Pętla renderu 3D pauzowana poza ekranem — płynny scroll na słabszym sprzęcie",
      "Komplet pod SEO: dane strukturalne produktu, sitemap, Open Graph",
    ],
    features: [
      {
        title: "Bloczek w 3D",
        desc: "Cały bloczek w przeglądarce: obrót, zoom, wariant Standard/Plus i suwak regulacji 120–200 mm, który na żywo unosi stalową stopę.",
      },
      {
        title: "Kalkulator doboru",
        desc: "Wybierasz zastosowanie i wymiary, a kalkulator rozkłada podpory (narożniki, obwód, siatka), liczy bloczki i sprawdza nośność.",
      },
      {
        title: "Etykiety części",
        desc: "Włączasz opisy, a model sam pokazuje korpus B30, stopę, śruby M16 i chwytak magnetyczny — jak instrukcja, tylko interaktywna.",
      },
      {
        title: "Spokojny, techniczny wygląd",
        desc: "Dużo światła, czytelna typografia i jeden akcent — strona mówi „precyzja”, a nie „katalog”.",
      },
    ],
    metrics: [
      { value: "Model 3D", label: "Bloczek w przeglądarce — obrót, zoom, regulacja na żywo" },
      { value: "Kalkulator", label: "Liczy rozstaw, podpory i nośność z researchu" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["Next.js", "React Three Fiber", "Three.js", "Tailwind CSS"],
    image: "/realizacje/drblocks-card.webp",
    showcase: "/realizacje/drblocks-showcase.webp",
    gallery: [
      {
        src: "/realizacje/drblocks-g1.webp",
        caption: "Model z etykietami — korpus B30, stalowa stopa, śruby M16 i chwytak magnetyczny.",
      },
      {
        src: "/realizacje/drblocks-g2.webp",
        caption: "Kalkulator doboru — rozstaw, rozkład podpór i sprawdzenie nośności na żywo.",
      },
    ],
    mobileImage: "/realizacje/drblocks-mobile.webp",
    video: "/realizacje/drblocks.mp4",
    poster: "/realizacje/drblocks-poster.webp",
    videoDuration: "PT14S",
    bg: "linear-gradient(150deg,#0c1f24 0%,#11313a 55%,#16454c 100%)",
    glow: "#2dbdb0",
    rgb: "45,189,176",
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
    seoTitle: "Grabowski — strona firmowa dla stolarni",
    seoDescription:
      "Strona pracowni stolarskiej w szwajcarskim stylu — płynny scroll, galerie realizacji scrubowane scrollem i autorski slider w hero. Spokojna elegancja rzemiosła.",
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
    videoDuration: "PT9S",
    concept: true,
    bg: "linear-gradient(150deg,#17130f 0%,#241c14 55%,#33271a 100%)",
    glow: "#c9a06a",
    rgb: "201,160,106",
  },
  {
    id: "elbis",
    title: "ELBIS",
    tagline: "Hurtownia AGD, która zaczyna się od NIP-u",
    type: "Strona firmowa B2B z formularzem hurtowym",
    year: "2026",
    client: "Hurtownia AGD i chemii (B2B)",
    liveUrl: "https://elbis-agdrtv.pl",
    summary:
      "Hurtownia AGD z Bielska-Białej: filmowe wejście, hero przechodzące w zdjęcie magazynu, trzy języki i formularz B2B, który od NIP-u prowadzi do konta hurtowego.",
    seoTitle: "ELBIS — strona hurtowni AGD ze strefą B2B",
    seoDescription:
      "Strona hurtowni AGD ELBIS: animowane wejście, hero przechodzące w zdjęcie magazynu, wersje PL/CZ/EN i formularz B2B w dwóch krokach — od NIP-u do konta.",
    intro:
      "ELBIS to rodzinna hurtownia AGD, chemii i artykułów dziecięcych, która od 1990 roku zaopatruje sklepy w Polsce i Czechach. Strona ma jedno zadanie: zamienić właściciela sklepu w partnera hurtowego. Dlatego wejście jest filmowe — nagłówek odsłania się warstwami, liczby rosną, a przy pierwszym przewinięciu czerwony panel ustępuje miejsca zdjęciu prawdziwego magazynu. Cała droga kończy się w Strefie B2B, gdzie na start wystarczy NIP.",
    challengeTitle: "Hurtownia sprzedaje zaufanie, nie katalog.",
    challenge:
      "Sklep, który szuka dostawcy, nie chce przeglądać tysięcy produktów — chce wiedzieć, czy firma jest realna, od kiedy działa i jak szybko dostanie konto z cennikiem. Do tego trzy grupy odbiorców (sklepy, producenci, klienci detaliczni) i dwa rynki językowe, których nie obsłuży jedna strona z formularzem kontaktowym.",
    decisions: [
      {
        constraint: "Pierwsze sekundy mają mówić „to poważna firma”.",
        choice:
          "Wejście z odsłaniającym się nagłówkiem, a hero przy przewijaniu przechodzi z czerwonej grafiki w zdjęcie magazynu ELBIS.",
        benefit: "Marka i realne miejsce w jednym ruchu, bez sekcji „o nas”.",
      },
      {
        constraint: "Konto hurtowe to formularz, którego nikt nie lubi wypełniać.",
        choice:
          "Dwa kroki: najpierw sam NIP, dopiero potem dane kontaktowe — z jasną obietnicą „konto w 24 h”.",
        benefit: "Sklep zaczyna od jednego pola, nie od dziesięciu.",
      },
      {
        constraint: "Trzy różne grupy trafiają na jedną stronę główną.",
        choice:
          "Sekcja „Trzy ścieżki, jeden magazyn” rozdziela sklepy, producentów i klientów detalicznych na osobne wejścia.",
        benefit: "Każdy trafia do swojej oferty po jednym kliknięciu.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Strona firmowa w Next.js (PL / CZ / EN)",
      "Strefa B2B z formularzem hurtowym w dwóch krokach",
      "Katalog 266 marek z wyszukiwarką",
      "Podstrona dla producentów",
      "SEO, dane strukturalne i FAQ",
    ],
    deliverables: [
      "Animowane wejście i hero przechodzące w zdjęcie magazynu przy przewijaniu",
      "Formularz B2B: NIP → dane kontaktowe, z obietnicą „konto w 24 h”",
      "Trzy wersje językowe na jednym kodzie (PL, CZ, EN)",
      "Katalog marek z wyszukiwarką i FAQ pod pytania z Google",
    ],
    features: [
      {
        title: "Wejście, które odsłania markę",
        desc: "Nagłówek pojawia się warstwami, liczby rosną, a przy pierwszym przewinięciu czerwony panel ustępuje zdjęciu magazynu ELBIS.",
      },
      {
        title: "Formularz B2B od NIP-u",
        desc: "Dwa kroki zamiast długiej ankiety: NIP firmy, potem imię, telefon i e-mail. Osobna ścieżka dla firm z Czech i Słowacji bez polskiego NIP-u.",
      },
      {
        title: "Trzy ścieżki, jeden magazyn",
        desc: "Sklep, producent i klient detaliczny dostają osobne wejścia — do Strefy B2B, oferty dla producentów i sklepu agdperfekt.pl.",
      },
      {
        title: "266 marek z wyszukiwarką",
        desc: "Katalog marek podzielony na działy, z wyszukiwarką i licznikiem — od Boscha po Lavazzę.",
      },
    ],
    metrics: [
      { value: "PL · CZ · EN", label: "Trzy wersje językowe" },
      { value: "2 kroki", label: "Formularz B2B: NIP → kontakt" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    image: "/realizacje/elbis-card.webp",
    showcase: "/realizacje/elbis-showcase.webp",
    gallery: [
      {
        src: "/realizacje/elbis-g1.webp",
        caption: "Strefa B2B — konto hurtowe zaczyna się od jednego pola: NIP-u firmy.",
      },
      {
        src: "/realizacje/elbis-g2.webp",
        caption: "Wszystkie kanały w jednym magazynie — hurt B2B, sklepy własne i marketplace’y.",
      },
    ],
    mobileImage: "/realizacje/elbis-mobile.webp",
    video: "/realizacje/elbis.mp4",
    poster: "/realizacje/elbis-poster.webp",
    videoDuration: "PT17S",
    bg: "linear-gradient(150deg,#1a0b0e 0%,#2a1015 55%,#3a151c 100%)",
    glow: "#e0163a",
    rgb: "224,22,58",
  },
  {
    id: "agdprime",
    title: "AGD Prime",
    tagline: "Sklep AGD z banerami, które reagują na kursor",
    type: "Sklep internetowy z interaktywnymi banerami",
    year: "2026",
    client: "E-commerce — AGD i chemia",
    liveUrl: "https://agdprime.pl",
    summary:
      "Sklep internetowy hurtowni ELBIS: banery, które reagują na kursor — światło wędruje za myszą, każdy kolor młynka ma własną kartę z ceną — i układ, który prowadzi do koszyka.",
    seoTitle: "AGD Prime — sklep z interaktywnymi banerami",
    seoDescription:
      "Sklep AGD Prime na PrestaShop: interaktywne banery hero (światło za kursorem, karty produktów na punktach), kafle promocji i układ prowadzący do koszyka.",
    intro:
      "AGD Prime to sklep detaliczny hurtowni ELBIS — AGD Bosch, Amica i Philips, chemia i artykuły dziecięce z własnego magazynu w Bielsku-Białej. Zbudowaliśmy go na PrestaShop, ale to, co widać na wejściu, jest autorskie: slajdy hero, po których wędruje światło, punkty na produktach odsłaniające karty z ceną, kafle promocji i przejrzysty układ, w którym od strony głównej do koszyka są dwa kliknięcia.",
    challengeTitle: "Sklep AGD musi wyglądać jak sklep, nie jak szablon.",
    challenge:
      "Ceny w AGD są porównywalne wszędzie, więc o wyborze decyduje wrażenie: czy sklep wygląda na prowadzony, czy produkty są od ręki i czy szybko da się dojść do koszyka. Gotowe szablony sklepowe dają wszystko oprócz tego wrażenia.",
    decisions: [
      {
        constraint: "Baner hero to zwykle statyczna grafika, którą wzrok omija.",
        choice:
          "Slajdy reagują na kursor: światło wędruje za myszą, a punkty na produktach odsłaniają karty z nazwą, ceną i linkiem.",
        benefit: "Baner staje się pierwszą półką sklepu, nie tapetą.",
      },
      {
        constraint: "Muśnięcie kursorem urywało animację w pół drogi.",
        choice:
          "Hover, który się kończy: stan najazdu zostaje tyle, ile trwa przejście, liczone od wejścia kursora.",
        benefit: "Zero szarpnięć — każdy najazd odgrywa pełny ruch.",
      },
      {
        constraint: "PrestaShop narzuca ciężki układ strony głównej.",
        choice:
          "Własne moduły: kafle promocji, pasek korzyści i siatka produktów w jednym rytmie kolorów marki.",
        benefit: "Strona główna prowadzi wzrok od promocji do koszyka.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny sklepu",
      "Wdrożenie na PrestaShop z autorskimi modułami",
      "Interaktywne banery hero i kafle promocji",
      "Karta produktu, porównywarka, ulubione",
      "Katalog ponad 4 600 produktów w działach",
      "SEO sklepu i FAQ na stronie głównej",
    ],
    deliverables: [
      "Cztery interaktywne slajdy hero z punktami produktowymi i światłem za kursorem",
      "Kafle promocji z animacją najazdu, która zawsze dobiega końca",
      "Karta produktu z galerią, stanem magazynowym i korzyściami (zwrot 14 dni, rękojmia, faktura VAT)",
      "Wersja mobilna z menu działów i szybkim wyszukiwaniem",
    ],
    features: [
      {
        title: "Światło za kursorem",
        desc: "Na slajdzie promocyjnym poświata przesuwa się za myszą — grafika żyje, a przycisk „Zobacz zestaw” unosi się przy najeździe.",
      },
      {
        title: "Punkty na produktach",
        desc: "Cztery kolory młynka Bosch, cztery punkty — każdy odsłania kartę z nazwą, ceną i linkiem do produktu.",
      },
      {
        title: "Kafle promocji",
        desc: "Trzy kafle pod slajderem: kategoria, produkt, cena za litr lub kilogram i przycisk „Kup teraz”.",
      },
      {
        title: "Układ, który prowadzi do koszyka",
        desc: "Menu działów, pasek korzyści, polecane produkty i nowości — od strony głównej do zamówienia w dwa kliknięcia.",
      },
    ],
    metrics: [
      { value: "4 slajdy", label: "Interaktywne banery hero z punktami" },
      { value: "2 kliknięcia", label: "Od strony głównej do koszyka" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["PrestaShop", "PHP", "JavaScript", "CSS"],
    image: "/realizacje/agdprime-card.webp",
    showcase: "/realizacje/agdprime-showcase.webp",
    gallery: [
      {
        src: "/realizacje/agdprime-g1.webp",
        caption: "Karta produktu — galeria, stan magazynowy i korzyści zakupu w jednym widoku.",
      },
      {
        src: "/realizacje/agdprime-g2.webp",
        caption: "Strona główna sklepu — pasek korzyści, polecane produkty i banery promocyjne.",
      },
    ],
    mobileImage: "/realizacje/agdprime-mobile.webp",
    video: "/realizacje/agdprime.mp4",
    poster: "/realizacje/agdprime-poster.webp",
    videoDuration: "PT20S",
    bg: "linear-gradient(150deg,#1c1206 0%,#2c1c0a 55%,#3d260c 100%)",
    glow: "#f28c0f",
    rgb: "242,140,15",
  },
  {
    id: "ksbss",
    title: "KSBSS",
    tagline: "Klub strzelecki z drogą do pozwolenia w pięciu krokach",
    type: "Strona klubu z trackerem „Droga do pozwolenia”",
    year: "2026",
    client: "Klub sportowy — strzelectwo",
    liveUrl: "https://ksbss.pl",
    summary:
      "Klub strzelecki z Bielska-Białej: prosta strona, która jedną ścieżką prowadzi kandydata od zapisu do pozwolenia na broń — z czasem, kosztem i dokumentami na każdym kroku.",
    seoTitle: "KSBSS — strona klubu z drogą do pozwolenia",
    seoDescription:
      "Strona klubu strzeleckiego KSBSS: interaktywna droga do pozwolenia na broń w 5 krokach, najbliższe terminy w hero, kalendarz zawodów i przeprosty układ.",
    intro:
      "KSBSS szkoli do patentu strzeleckiego, poświadcza licencje PZSS i organizuje zawody klubowe. Kandydat trafia na stronę z jednym pytaniem: „jak zdobyć pozwolenie?”. Zamiast długiego tekstu dostaje tracker w pięciu krokach — zapis, szkolenie, patent, licencja, pozwolenie — z czasem, kosztem i dokumentami przy każdym z nich. Reszta strony jest celowo prosta: terminy, aktualności, FAQ, kontakt.",
    challengeTitle: "Kandydat ma jedno pytanie, a klub dziesięć podstron.",
    challenge:
      "Droga do pozwolenia na broń to kilka miesięcy, kilka opłat i kilka instytucji. Większość stron klubów wkleja regulaminy i PDF-y — kandydat nie wie, od czego zacząć, i dzwoni. Strona miała zdjąć te telefony i zamienić je w zapisy.",
    decisions: [
      {
        constraint: "Pierwszy ekran musi odpowiadać na „od czego zacząć”.",
        choice:
          "Dwa przyciski: „Droga do pozwolenia” i „Dołącz do klubu”, obok karta z najbliższymi terminami.",
        benefit: "Kandydat od razu wie, co kliknąć i kiedy przyjść.",
      },
      {
        constraint: "Pięć etapów, każdy z innym kosztem i dokumentem.",
        choice:
          "Interaktywny tracker: pasek postępu, czas, koszt, dokumenty i link „więcej” na każdym kroku.",
        benefit: "Cała procedura mieści się na jednym ekranie.",
      },
      {
        constraint: "Klub aktualizuje stronę sam, bez programisty.",
        choice:
          "Statyczny HTML bez frameworka: kalendarz sam przygasza rozegrane terminy, status biura liczy się z zegara.",
        benefit: "Strona działa latami, ładuje się natychmiast i nie wymaga panelu.",
      },
    ],
    scope: [
      "Projekt i kierunek wizualny",
      "Strona statyczna (HTML, CSS, JavaScript)",
      "Tracker „Droga do pozwolenia” w 5 krokach",
      "Kalendarz zawodów z automatycznym statusem",
      "Podstrony: patent, klub, komunikaty, dokumenty, galeria",
      "SEO lokalne, FAQ i deklaracja dostępności",
    ],
    deliverables: [
      "Tracker w 5 krokach z paskiem postępu, obsługą klawiatury (strzałki) i rolami ARIA",
      "Kalendarz, który sam oznacza rozegrane rundy i wyróżnia najbliższe zawody",
      "Status biura klubu liczony na żywo (wt. i czw. 16:00–19:00)",
      "Mapa dojazdu ładowana dopiero po zgodzie (RODO) i deklaracja dostępności",
    ],
    features: [
      {
        title: "Droga do pozwolenia",
        desc: "Pięć kroków od zapisu do pozwolenia — każdy z czasem, kosztem i dokumentami. Klikasz krok albo „Następny”, pasek rośnie.",
      },
      {
        title: "Najbliższe terminy na wejściu",
        desc: "Karta w hero: treningi otwarte, szkolenie wstępne, najbliższa runda Pucharu — z linkiem do pełnego kalendarza.",
      },
      {
        title: "Kalendarz, który sam się aktualizuje",
        desc: "Rozegrane rundy przygaszone, najbliższe zawody wyróżnione z licznikiem dni — bez ręcznej edycji.",
      },
      {
        title: "Przeprosty układ",
        desc: "Cztery kafle skrótów, aktualności, FAQ, kontakt. Zero sekcji na siłę — wszystko prowadzi do zapisu.",
      },
    ],
    metrics: [
      { value: "5 kroków", label: "Tracker od zapisu do pozwolenia" },
      { value: "0 frameworków", label: "Czysty HTML + JS, ładuje się natychmiast" },
      { value: "320–2560 px", label: "Telefon → 4K" },
    ],
    tech: ["HTML", "CSS", "JavaScript"],
    image: "/realizacje/ksbss-card.webp",
    showcase: "/realizacje/ksbss-showcase.webp",
    gallery: [
      {
        src: "/realizacje/ksbss-g1.webp",
        caption:
          "Tracker „Droga do pozwolenia na broń” — krok 3 z 5: egzamin na patent, z czasem, kosztem i dokumentami.",
      },
      {
        src: "/realizacje/ksbss-g2.webp",
        caption:
          "Kalendarz sezonu — najbliższe zawody wyróżnione, rozegrane rundy przygaszone automatycznie.",
      },
    ],
    mobileImage: "/realizacje/ksbss-mobile.webp",
    video: "/realizacje/ksbss.mp4",
    poster: "/realizacje/ksbss-poster.webp",
    videoDuration: "PT17S",
    bg: "linear-gradient(150deg,#0d1a12 0%,#132619 55%,#1a3322 100%)",
    glow: "#4f9a62",
    rgb: "79,154,98",
  },
];

// ── Kolejność EKSPOZYCJI (home / /realizacje/ / dema na /uslugi/strony-3d/) ───
// Od NAJMOCNIEJSZEJ realizacji w dół (decyzja Natana 2026-09-08): ELBIS (pełna
// strona firmowa B2B), JR Modular (konfigurator 3D), AGD Prime (sklep), DrBlocks
// (model 3D), RIKOSZET (3D, koncept), KSBSS (prosta strona), Grabowski (koncept).
// Pierwsze cztery = realni klienci → siatka Work na home bierze je z czoła listy.
// Same dane projektów wyżej zostają w oryginalnej kolejności.
const DISPLAY_ORDER = [
  "elbis",
  "jr-modular",
  "agdprime",
  "drblocks",
  "rikoszet",
  "ksbss",
  "grabowski",
];

export const PROJECTS: Project[] = DISPLAY_ORDER.map((id) => {
  const p = PROJECTS_DATA.find((x) => x.id === id);
  if (!p) throw new Error(`DISPLAY_ORDER: nieznany projekt "${id}"`);
  return p;
});
if (PROJECTS.length !== PROJECTS_DATA.length) {
  // Nowy projekt w PROJECTS_DATA musi też trafić do DISPLAY_ORDER (build-time guard).
  throw new Error("DISPLAY_ORDER nie pokrywa wszystkich projektów z PROJECTS_DATA");
}

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
