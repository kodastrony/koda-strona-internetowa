/**
 * Blog articles — SINGLE SOURCE OF TRUTH.
 *
 * Real, useful content (no filler) written for Polish business owners deciding
 * about a website. Rendered by /blog (list) and /blog/[slug] (article).
 * Dates are absolute ISO strings (stable across builds — no Date.now()).
 */
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

export interface Article {
  slug: string;
  title: string;
  /** Card + meta description. */
  excerpt: string;
  /** ISO date (YYYY-MM-DD). */
  date: string;
  /** Estimated reading time in minutes. */
  readMinutes: number;
  category: string;
  body: Block[];
}

export const ARTICLES: Article[] = [
  {
    slug: "ile-kosztuje-strona-internetowa",
    title: "Ile kosztuje strona internetowa dla firmy?",
    excerpt:
      "Od czego naprawdę zależy cena strony i dlaczego „2000 zł” i „20 000 zł” mogą znaczyć dwie zupełnie różne rzeczy.",
    date: "2026-04-22",
    readMinutes: 5,
    category: "Poradnik",
    body: [
      {
        type: "p",
        text: "To pierwsze pytanie, które słyszymy — i jednocześnie najtrudniejsze. „Ile kosztuje strona?” jest jak „ile kosztuje samochód?”. Odpowiedź zależy od tego, co ma robić, jak długo ma służyć i kto ją zbuduje. Zamiast podawać liczbę z sufitu, pokażemy, co realnie wpływa na cenę.",
      },
      { type: "h2", text: "Co podbija (i obniża) koszt" },
      {
        type: "p",
        text: "Cena to przede wszystkim zakres i czas. Prosta wizytówka na kilka sekcji to inny projekt niż sklep z setkami produktów albo platforma B2B z logowaniem. Najwięcej kosztuje to, czego nie widać na pierwszy rzut oka:",
      },
      {
        type: "ul",
        items: [
          "Indywidualny projekt vs. gotowy szablon — własny design wyróżnia, ale wymaga pracy.",
          "Liczba i złożoność podstron oraz funkcji (płatności, integracje, panele).",
          "Jakość kodu i wydajność — szybka strona to więcej pracy niż wolna.",
          "Treści i zdjęcia — kto je przygotowuje, Ty czy wykonawca.",
          "Wsparcie po wdrożeniu — opieka i rozwój vs. „oddajemy i znikamy”.",
        ],
      },
      { type: "h2", text: "Tani szablon kontra własny projekt" },
      {
        type: "p",
        text: "Gotowy szablon jest kuszący ceną, ale ma koszt ukryty: wygląda jak tysiąc innych stron, bywa ciężki i wolny, a jego rozbudowa szybko staje się walką z cudzym kodem. Indywidualny projekt kosztuje więcej na starcie, ale jest skrojony pod Twój biznes, ładuje się szybciej i łatwiej go rozwijać.",
      },
      { type: "h2", text: "Jak myśleć o budżecie" },
      {
        type: "p",
        text: "Najlepiej traktować stronę jak inwestycję, nie wydatek. Dobre pytanie nie brzmi „ile to kosztuje”, tylko „ile może mi przynieść”. Strona, która ładuje się szybko, jest czytelna i prowadzi klienta do kontaktu, zwraca się jednym czy dwoma zleceniami. Strona, której nikt nie rozumie, nie zwróci się nigdy — niezależnie od ceny.",
      },
      {
        type: "p",
        text: "U nas każdą wycenę zaczynamy od rozmowy o celu. Dopiero gdy wiemy, co strona ma osiągnąć, podajemy konkretny zakres i cenę — bez niespodzianek w trakcie.",
      },
    ],
  },
  {
    slug: "szybkosc-strony-to-pieniadze",
    title: "Dlaczego szybkość strony to realne pieniądze",
    excerpt:
      "Wolna strona traci klientów, zanim zdążą cokolwiek przeczytać. Oto co dzieje się w tych pierwszych sekundach.",
    date: "2026-03-11",
    readMinutes: 4,
    category: "Wydajność",
    body: [
      {
        type: "p",
        text: "Masz kilka sekund. Tyle czeka przeciętny użytkownik, zanim zniecierpliwiony zamknie wolno ładującą się stronę i wróci do wyników Google — najpewniej do konkurencji. Szybkość to nie szczegół techniczny dla programistów. To pierwsza rzecz, którą czuje klient.",
      },
      { type: "h2", text: "Wolno = drożej, na trzy sposoby" },
      {
        type: "ul",
        items: [
          "Konwersja: każda dodatkowa sekunda ładowania to mierzalny spadek liczby zapytań i zakupów.",
          "Google: szybkość jest oficjalnym czynnikiem rankingowym (Core Web Vitals). Wolna strona spada w wynikach.",
          "Zaufanie: ociężała strona podświadomie sygnalizuje „niechlujna firma”, zanim klient przeczyta choć słowo.",
        ],
      },
      { type: "h2", text: "Co najczęściej spowalnia stronę" },
      {
        type: "p",
        text: "Zwykle winowajcy są ci sami: ogromne, niezoptymalizowane zdjęcia, dziesiątki wtyczek doklejonych „na wszelki wypadek”, ciężkie szablony robiące dużo więcej, niż potrzeba, oraz brak pamięci podręcznej. Każdy z tych elementów dokłada kilobajty i milisekundy, które klient odczuwa jako „muli”.",
      },
      { type: "h2", text: "Jak robimy to u nas" },
      {
        type: "p",
        text: "Budujemy strony jako lekki, statyczny kod — bez zbędnych wtyczek i ciężkich frameworków tam, gdzie nie są potrzebne. Zdjęcia optymalizujemy, zasoby buforujemy, a animacje opieramy wyłącznie na właściwościach przyspieszanych sprzętowo, żeby były płynne nawet na słabszym telefonie. Efekt: strona, która otwiera się od razu — i nie traci klientów na starcie.",
      },
    ],
  },
  {
    slug: "5-rzeczy-ktore-odstraszaja-klientow",
    title: "5 rzeczy, które odstraszają klientów na Twojej stronie",
    excerpt: "Najczęstsze błędy, które codziennie kosztują firmy zapytania — i jak je naprawić.",
    date: "2026-02-04",
    readMinutes: 5,
    category: "UX",
    body: [
      {
        type: "p",
        text: "Większość stron nie traci klientów przez jeden wielki błąd, tylko przez kilka małych, które się sumują. Oto pięć, które widzimy najczęściej — i które najłatwiej naprawić.",
      },
      { type: "h2", text: "1. Nie wiadomo, co robicie" },
      {
        type: "p",
        text: "Klient w trzy sekundy musi zrozumieć, czym się zajmujesz i czy trafił we właściwe miejsce. Jeśli pierwszy ekran to ogólnik w stylu „witamy na naszej stronie”, klient nie zostaje. Powiedz wprost, co oferujesz i dla kogo.",
      },
      { type: "h2", text: "2. Nie wiadomo, co kliknąć dalej" },
      {
        type: "p",
        text: "Każda strona powinna mieć jedną, wyraźną akcję: zadzwoń, napisz, zamów. Gdy wszystko wygląda jednakowo ważne, nic nie jest ważne. Jasne wezwanie do działania prowadzi klienta za rękę.",
      },
      { type: "h2", text: "3. Strona jest wolna" },
      {
        type: "p",
        text: "Wolne ładowanie to najszybszy sposób, by stracić kogoś, kto był już zdecydowany. Jeśli strona „muli” na telefonie, klient wróci do Google. Szybkość to dziś podstawa, nie luksus.",
      },
      { type: "h2", text: "4. Nie działa na telefonie" },
      {
        type: "p",
        text: "Ponad połowa ruchu to urządzenia mobilne. Jeśli na telefonie trzeba przewijać w bok, a przyciski są za małe, żeby w nie trafić, połowa Twoich klientów odbija się od progu. Strona musi być wygodna na każdym ekranie.",
      },
      { type: "h2", text: "5. Brak zaufania" },
      {
        type: "p",
        text: "Ludzie kupują od firm, którym ufają. Realne zdjęcia, konkretne treści, dane kontaktowe i dopracowany wygląd budują wiarygodność. Stockowe zdjęcia i ogólniki — przeciwnie. Wygląd strony to dziś pierwsze wrażenie o firmie.",
      },
      {
        type: "p",
        text: "Dobra wiadomość: każdy z tych punktów da się naprawić. Jeśli chcesz wiedzieć, które dotyczą Twojej strony, napisz do nas — chętnie spojrzymy.",
      },
    ],
  },
];

/** Lookup an article by slug (for /blog/[slug]). */
export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

/** Articles sorted newest-first for the /blog index. */
export const ARTICLES_BY_DATE: Article[] = [...ARTICLES].sort((a, b) => (a.date < b.date ? 1 : -1));

/** Format an ISO date as a Polish long date, e.g. "22 kwietnia 2026". */
export function formatArticleDate(iso: string): string {
  return new Intl.DateTimeFormat("pl-PL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso + "T00:00:00"));
}
