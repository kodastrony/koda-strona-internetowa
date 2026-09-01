/**
 * LOKALIZACJE — treść stron lokalnych (`/strony-internetowe-<miasto>/`).
 *
 * PO CO TO ISTNIEJE (research 2026-09-01): w Search Console kodastrony.pl NIE
 * miało ANI JEDNEGO wyświetlenia na zapytanie lokalne — bo nie istniała żadna
 * strona celująca w „strony internetowe Bielsko-Biała”. Wszystkie serwisy z
 * pierwszej dziesiątki tego zapytania (silnet.pl, webtom.pl, iguanastudio.pl,
 * smart-agency.pl, 4adstudio.pl) mają dedykowaną podstronę miejską na 2 800 –
 * 3 500 słów, z nazwą miasta w H1, sekcją FAQ i listą obsługiwanych branż.
 * To jest wejściówka do tej gry, nie ozdoba.
 *
 * DLACZEGO TREŚĆ JEST PISANA RĘCZNIE PER MIASTO, a nie generowana z szablonu:
 * strony różniące się wyłącznie odmienioną nazwą miasta to w nomenklaturze
 * Google „doorway pages” — jawnie łamią wytyczne spamowe i potrafią ściągnąć
 * karę na CAŁĄ domenę. Każde miasto ma tu własny wstęp, własną listę branż
 * (realna struktura gospodarcza miejscowości) i własne odpowiedzi w FAQ.
 * Wspólny jest wyłącznie szkielet sekcji — tak samo jak na każdej innej podstronie.
 *
 * DYSCYPLINA OBIETNIC (jak w lib/faq.ts): obiecujemy WYŁĄCZNIE odpowiedź w 24 h
 * oraz zakres i termin w umowie. Ceny są identyczne z /cennik/ i llms.txt —
 * rozjazd liczb między podstronami psuje wiarygodność i u ludzi, i w AI search.
 * Zero wymyślonych klientów, opinii, ocen i „lat doświadczenia”.
 */

export interface LocationFaq {
  q: string;
  a: string;
}

export interface LocationIndustry {
  name: string;
  desc: string;
}

export interface Location {
  /** Segment URL, np. „strony-internetowe-bielsko-biala” (bez ukośników). */
  slug: string;
  /** Mianownik — „Bielsko-Biała”. */
  city: string;
  /** Miejscownik — „w Bielsku-Białej”. Polska odmiana, więc trzymana wprost. */
  inCity: string;
  /** Dopełniacz z przyimkiem — „z Bielska-Białej”. */
  fromCity: string;
  /** Region, do którego miasto się zalicza (używany w treści i opisach). */
  region: string;
  title: string;
  description: string;
  h1: string;
  /** BLUF — pierwszy akapit odpowiada na pytanie „ile i jak długo”. */
  lead: string;
  /** Akapity wstępu (2–3), każdy o TYM mieście. */
  intro: string[];
  /** Branże realnie obecne w tej miejscowości. */
  industries: LocationIndustry[];
  /** Zdanie o odległości/dojeździe — konkret, nie ogólnik. */
  proximity: string;
  /** Co lokalna firma zyskuje na stronie — akapity per miasto. */
  whyLocal: string[];
  faq: LocationFaq[];
  /** Slugi sąsiednich lokalizacji do linkowania wewnętrznego. */
  nearby: string[];
  /** ISO — data realnej zmiany treści (sitemap + WebPage.dateModified). */
  lastmod: string;
}

/* Powtarzalne fakty o ofercie. Trzymane raz i wstawiane do treści miast —
   dzięki temu ceny i terminy nie rozjadą się między podstronami. */
const CENY =
  "od 2 900 zł netto za landing page, 3 900 zł za stronę wizytówkę, 6 900 zł za stronę firmową i 12 900 zł za projekt premium z animacjami i grafiką 3D";
const TERMINY =
  "landing powstaje w 1–2 tygodnie, wizytówka w 2–3, strona firmowa w 3–5, a projekt premium w 5–8 tygodni";

export const LOCATIONS: Location[] = [
  /* ─────────────────────────── BIELSKO-BIAŁA ─────────────────────────────
     Strona-matka lokalnego SEO: miasto siedziby, najwyższy priorytet w mapie
     witryny, najszersza treść i najwięcej linków wewnętrznych. */
  {
    slug: "strony-internetowe-bielsko-biala",
    city: "Bielsko-Biała",
    inCity: "w Bielsku-Białej",
    fromCity: "z Bielska-Białej",
    region: "Podbeskidzie",
    title: "Strony internetowe Bielsko-Biała — projektowanie i kodowanie",
    description:
      "Tworzenie stron internetowych w Bielsku-Białej: autorski kod zamiast szablonu, ceny od 2 900 zł netto, zakres i termin w umowie, odpowiedź w 24 h. KODA pracuje z Bielska-Białej dla firm z Podbeskidzia i całej Polski.",
    h1: "Strony internetowe Bielsko-Biała",
    lead: `KODA projektuje i koduje strony internetowe dla firm z Bielska-Białej — ${CENY}. Zakres i termin zapisujemy w umowie przed startem, a na każde zapytanie odpowiadamy w ciągu 24 godzin. Pracujemy z Bielska-Białej, więc spotkanie na żywo nie wymaga niczyjego wyjazdu na drugi koniec województwa.`,
    intro: [
      "Bielsko-Biała żyje z firm, które mają konkretnego klienta: kooperantów motoryzacji i zakładów produkcyjnych, warsztatów, gabinetów, biur rachunkowych, ekip wykończeniowych, pensjonatów pod Szyndzielnią i Klimczokiem. Strona ma tu jedno zadanie — sprawić, żeby ktoś, kto właśnie szuka Twojej usługi w okolicy, trafił do Ciebie, a nie do firmy dwie ulice dalej.",
      "Dlatego nie zaczynamy od wyglądu, tylko od pytania, po co ta strona ma być. Inaczej buduje się witrynę zakładu, który chce trafić do działów zakupów w większych firmach, a inaczej stronę gabinetu, do którego pacjent ma po prostu szybko zadzwonić. Ten sam szablon obsłużyłby oba przypadki źle.",
      "Każdą stronę piszemy w autorskim kodzie — bez WordPressa i gotowych motywów. To nie jest kwestia gustu: szablon dokłada wtyczki i skrypty, których Twoja firma nigdy nie użyje, a które ładują się u każdego odwiedzającego i spowalniają stronę na telefonie w gorszym zasięgu. Szybkość i czysta struktura to fundament, na którym w ogóle da się później budować widoczność w Google.",
      "Konkurencja w Bielsku-Białej wygląda przy tym lepiej, niż się wydaje z perspektywy właściciela firmy: sporo tutejszych witryn to szablony sprzed kilku lat, w których nikt nie ruszał treści od wdrożenia. Na telefonie ładują się kilka sekund, a opisy usług są napisane tak, jak mówi o nich branża — a nie tak, jak szuka ich klient. To jest dokładnie ta szczelina, w którą wchodzi się nową, szybką stroną z sensownie napisaną treścią.",
      "Pracujemy przy tym tak samo z firmą z centrum, z Wapienicy, Aleksandrowic czy Lipnika, jak i z sąsiednich gmin — zasięg działania Twojej firmy opisujemy na stronie tak, jak wygląda naprawdę, bo to on decyduje, komu Google w ogóle Cię pokaże.",
    ],
    industries: [
      {
        name: "Produkcja i kooperanci motoryzacji",
        desc: "Strona, która przechodzi weryfikację działu zakupów: konkretne możliwości produkcyjne, park maszynowy, certyfikaty i szybki kontakt do właściwej osoby — bez marketingowej waty.",
      },
      {
        name: "Usługi lokalne i rzemiosło",
        desc: "Warsztaty, instalatorzy, serwisy i ekipy remontowe. Priorytet: telefon widoczny od pierwszej sekundy, obszar działania i realne zdjęcia zrobionych zleceń.",
      },
      {
        name: "Gabinety i usługi medyczne",
        desc: "Czytelny cennik, zakres zabiegów i prosta droga do rezerwacji albo telefonu. Spokojna typografia i zero przeładowania — pacjent ma znaleźć odpowiedź, nie podziwiać efekty.",
      },
      {
        name: "Turystyka, hotele i gastronomia w Beskidach",
        desc: "Pensjonaty, apartamenty i lokale pod Szczyrkiem i Wisłą. Zdjęcia, które sprzedają miejsce, dostępność terminów i kontakt działający na telefonie w drodze.",
      },
      {
        name: "Budownictwo i wykończenia",
        desc: "Realizacje pokazane tak, żeby broniły stawki: przed i po, zakres prac, materiały. To jedyny argument, który u wykonawcy naprawdę działa.",
      },
      {
        name: "Kancelarie, biura i doradztwo",
        desc: "Strona, która buduje zaufanie, zanim ktoś zadzwoni: jasne specjalizacje, konkretne kompetencje i formularz, który nie odstrasza pytaniem o wszystko naraz.",
      },
    ],
    proximity:
      "KODA pracuje z Bielska-Białej. Spotkanie na żywo umawiamy bez problemu, ale nie jest do niczego potrzebne — cały projekt prowadzimy zdalnie, a postępy pokazujemy na bieżąco.",
    whyLocal: [
      "Firma lokalna gra o inną stawkę niż ogólnopolski sklep. Tu nie chodzi o pierwsze miejsce na hasło, które wpisuje cała Polska, tylko o wygranie zapytań z dopiskiem „Bielsko-Biała” i okolice — bo to są ludzie, którzy realnie mogą zostać Twoim klientem. Taką stronę budujemy z technicznym SEO w standardzie: poprawną strukturą nagłówków, danymi strukturalnymi firmy, szybkością i pełną treścią w kodzie HTML.",
      "Powiemy uczciwie, gdzie kończy się rola strony: w wynikach lokalnych ogromną część roboty odwala wizytówka Google i opinie klientów, a tego nie zastąpi żaden kod. Strona jest fundamentem i miejscem, do którego prowadzi wizytówka — i tę część robimy tak, żeby nie było do czego się przyczepić. Pozostałe kroki podpowiemy, nawet jeśli nie będziesz ich robić z nami.",
    ],
    faq: [
      {
        q: "Ile kosztuje strona internetowa w Bielsku-Białej?",
        a: "W KODA landing page kosztuje od 2 900 zł netto, strona wizytówka od 3 900 zł, strona firmowa od 6 900 zł, a projekt premium z animacjami i 3D od 12 900 zł. Cena „od” to minimalny zakres pakietu — konkret dla Twojej firmy podajemy bezpłatnie w ciągu 24 godzin i zapisujemy w umowie, więc później nie dochodzą do niej żadne niespodzianki. Pełne widełki są na podstronie Cennik.",
      },
      {
        q: "Ile trwa zrobienie strony?",
        a: `W KODA ${TERMINY}. Konkretny termin ustalamy w umowie, zanim zaczniemy, i go pilnujemy. Pracujemy etapami — każdy etap zatwierdzasz, więc na końcu nie ma niespodzianek.`,
      },
      {
        q: "Czy trzeba się spotkać osobiście w Bielsku-Białej?",
        a: "Nie trzeba, ale można. KODA pracuje z Bielska-Białej, więc spotkanie na miejscu jest do umówienia. Zdecydowana większość projektów i tak idzie zdalnie: rozmowa, projekt do akceptacji, poprawki i start — dojazd niczego tu nie przyspiesza.",
      },
      {
        q: "Czy robicie strony na WordPressie?",
        a: "Nie. Każdą stronę KODA piszemy w autorskim kodzie, bo szablon zawsze dokłada wtyczki i skrypty, których Twoja firma nie potrzebuje, a które spowalniają stronę i wymagają ciągłych aktualizacji. Efekt: strona ładuje się szybciej, przechodzi Core Web Vitals i nie psuje się po aktualizacji cudzej wtyczki.",
      },
      {
        q: "Czy zajmiecie się też pozycjonowaniem lokalnym?",
        a: "Techniczne SEO jest w standardzie każdej strony: struktura, szybkość, dane strukturalne firmy i treść w HTML. To fundament widoczności. Same pozycje w Google budują się potem treścią, opiniami i czasem — możemy to prowadzić razem w ramach opieki po starcie, a jeśli wolisz robić to samodzielnie, podpowiemy, od czego zacząć.",
      },
      {
        q: "Mam już stronę — da się ją poprawić zamiast robić nową?",
        a: "Zależy, co pod nią siedzi. Czasem wystarczy poprawić szybkość, treść i strukturę istniejącej witryny; czasem taniej i szybciej wychodzi zbudować ją od zera niż łatać cudzy szablon z wtyczkami. Powiemy wprost, który wariant ma sens u Ciebie — także wtedy, gdy oznacza to mniejsze zlecenie dla nas.",
      },
      {
        q: "Pracujecie tylko z firmami z Bielska-Białej?",
        a: "Nie. Bielsko-Biała to nasza baza, ale projekty prowadzimy dla firm z całego Podbeskidzia, Śląska i reszty Polski — zdalnie, bez różnicy w cenie i terminie.",
      },
      {
        q: "Co, jeśli nie mam gotowych tekstów ani zdjęć?",
        a: "To normalna sytuacja i nie blokuje projektu. Teksty możemy napisać razem z Tobą — Ty mówisz, co robicie i dla kogo, my układamy to w treść, która odpowiada na pytania klientów. Zdjęcia da się na start zastąpić dobrze dobranymi materiałami, a docelowo warto zrobić własne. Zakres takiej pomocy ustalamy w wycenie, żeby nie było niespodzianek.",
      },
      {
        q: "Zrobicie stronę po angielsku lub niemiecku?",
        a: "Tak, i to częste pytanie w Bielsku-Białej — sporo tutejszych firm produkcyjnych pracuje z odbiorcami zagranicznymi. Każda wersja językowa dostaje osobny adres, własne opisy dla wyszukiwarki i znaczniki hreflang, żeby Google pokazywał właściwą wersję właściwemu użytkownikowi. Tłumaczenia możesz dostarczyć własne albo zamówić razem z projektem.",
      },
    ],
    nearby: [
      "strony-internetowe-czechowice-dziedzice",
      "strony-internetowe-zywiec",
      "strony-internetowe-cieszyn",
      "strony-internetowe-katowice",
    ],
    lastmod: "2026-09-01",
  },

  /* ───────────────────────────── KATOWICE ───────────────────────────────── */
  {
    slug: "strony-internetowe-katowice",
    city: "Katowice",
    inCity: "w Katowicach",
    fromCity: "z Katowic",
    region: "Górnośląsko-Zagłębiowska Metropolia",
    title: "Strony internetowe Katowice — projektowanie i kodowanie",
    description:
      "Tworzenie stron internetowych dla firm z Katowic i metropolii: autorski kod, ceny od 2 900 zł netto, zakres i termin w umowie, odpowiedź w 24 h. KODA — studio z Bielska-Białej, godzina drogi od Katowic.",
    h1: "Strony internetowe Katowice",
    lead: `KODA projektuje i koduje strony internetowe dla firm z Katowic i całej metropolii — ${CENY}. Zakres i termin trafiają do umowy przed startem, a odpowiedź na zapytanie dostajesz w 24 godziny. Jesteśmy z Bielska-Białej, czyli godzinę drogi od centrum Katowic.`,
    intro: [
      "Katowice to najgęstszy rynek usług w regionie — a to znaczy, że Twoja strona nie konkuruje z jedną firmą z sąsiedztwa, tylko z kilkudziesięcioma w tej samej branży, w promieniu kilkunastu kilometrów. Wygrywa nie ta ładniejsza, tylko ta, która w pierwszym ekranie odpowiada na pytanie klienta i nie każe go szukać.",
      "Robimy strony dla firm, które sprzedają kompetencję, a nie cenę: usług profesjonalnych, spółek technologicznych, firm produkcyjnych i podmiotów B2B z okolic Katowic. W takich projektach o wyniku decydują rzeczy niewidoczne na pierwszy rzut oka — struktura treści, szybkość na telefonie i to, czy formularz da się wypełnić bez irytacji.",
      "Cały kod piszemy sami, bez WordPressa i gotowych motywów. Na konkurencyjnym rynku różnica jednej sekundy ładowania jest różnicą między zapytaniem a zamkniętą kartą — a szablon z wtyczkami zawsze niesie balast, którego Twoja firma nigdy nie użyje.",
      "Metropolia ma jeszcze jedną cechę, która zmienia sposób pisania treści: Twój klient rzadko szuka „firmy w Katowicach”. Szuka firmy w Ligocie, na Załężu, w Zabrzu albo w Sosnowcu — bo tak wygląda codzienny dojazd w aglomeracji, gdzie granica miasta jest umowna. Strona, która nazywa obsługiwany obszar tak, jak myśli o nim klient, wygrywa zapytania, o które nikt się nie bije.",
    ],
    industries: [
      {
        name: "Usługi profesjonalne i doradztwo",
        desc: "Kancelarie, biura rachunkowe, doradcy. Strona ma udowodnić kompetencję przed pierwszą rozmową: konkretne specjalizacje zamiast listy wszystkiego.",
      },
      {
        name: "Firmy technologiczne i B2B",
        desc: "Czytelne wyjaśnienie, co dokładnie robicie i dla kogo — po polsku, bez żargonu, który rozumie wyłącznie zespół produktowy.",
      },
      {
        name: "Przemysł i usługi dla przemysłu",
        desc: "Możliwości, referencje i kontakt do właściwego działu. Strona jako materiał, który przechodzi weryfikację u kupca, a nie folder reklamowy.",
      },
      {
        name: "Medycyna i gabinety specjalistyczne",
        desc: "Zakres, cennik, rezerwacja. Priorytetem jest to, żeby pacjent w dwie sekundy wiedział, czy trafił we właściwe miejsce.",
      },
      {
        name: "Nieruchomości i inwestycje",
        desc: "Prezentacja inwestycji materiałem, który realnie sprzedaje: rzuty, wizualizacje, a przy większych projektach interaktywna scena 3D.",
      },
      {
        name: "Gastronomia i miejsca",
        desc: "Menu, godziny i rezerwacja bez klikania w PDF. Strona ma działać na telefonie, w biegu, jedną ręką.",
      },
    ],
    proximity:
      "Z Bielska-Białej do Katowic jedzie się drogą S1 około godziny. Spotkanie na miejscu jest do umówienia, natomiast sam projekt prowadzimy zdalnie i to nie zmienia ani ceny, ani terminu.",
    whyLocal: [
      "Na rynku tak nasyconym jak katowicki najtańsza przewaga leży tam, gdzie konkurencja odpuszcza: w szybkości i strukturze. Większość stron lokalnych firm to szablony obciążone wtyczkami, które na telefonie ładują się kilka sekund. Autorski kod i porządne techniczne SEO nie są tu luksusem, tylko sposobem na wyprzedzenie kogoś, kto wydał na stronę tyle samo.",
      "Druga rzecz to treść pisana pod realne zapytania, a nie pod jedno hasło „strony internetowe Katowice”. Klient szuka konkretnej usługi w konkretnej dzielnicy albo branży — i to te frazy są do wygrania, zanim w ogóle podejmiesz walkę o najbardziej obleganą.",
    ],
    faq: [
      {
        q: "Ile kosztuje strona internetowa w Katowicach?",
        a: "Ceny KODA są takie same niezależnie od miasta: landing page od 2 900 zł netto, wizytówka od 3 900 zł, strona firmowa od 6 900 zł, projekt premium z animacjami i 3D od 12 900 zł. Konkretną wycenę dla Twojej firmy przygotowujemy bezpłatnie w ciągu 24 godzin i zapisujemy w umowie.",
      },
      {
        q: "Czy pracujecie z firmami z Katowic zdalnie?",
        a: "Tak — i to jest domyślny tryb pracy. Rozmowa, projekt do akceptacji, poprawki, start. Spotkanie na miejscu w Katowicach też jest możliwe, bo z Bielska-Białej to godzina drogi.",
      },
      {
        q: "Ile trwa zrobienie strony?",
        a: `W KODA ${TERMINY}. Termin ustalamy w umowie przed startem i go pilnujemy — pracujemy etapami, a każdy etap zatwierdzasz.`,
      },
      {
        q: "Czym się różnicie od dużych agencji z Katowic?",
        a: "Rozmawiasz i pracujesz z tą samą osobą, która prowadzi Twój projekt, a nie z opiekunem klienta pośredniczącym między Tobą a zespołem. Kod piszemy sami, bez WordPressa. Ceny i terminy mamy podane wprost na stronie, zanim w ogóle zadzwonisz — to rzadkość w tej branży i celowa decyzja.",
      },
      {
        q: "Czy zrobicie sklep internetowy?",
        a: "Nie robimy sklepów ani systemów płatności — celowo, bo skupiamy się na stronach, które pozyskują zapytania. Jeśli potrzebujesz sprzedaży online, powiemy to od razu na pierwszej rozmowie, zamiast brać projekt, który nie jest naszą specjalnością.",
      },
      {
        q: "Pracujecie z firmami z całej metropolii, czy tylko z samych Katowic?",
        a: "Z całej aglomeracji — Chorzów, Sosnowiec, Gliwice, Zabrze, Tychy, Dąbrowa Górnicza. Przy pracy zdalnej granica administracyjna nie ma żadnego znaczenia, a obszar, na którym działa Twoja firma, opisujemy na stronie dokładnie tak, jak wygląda naprawdę — bo to on decyduje, komu Google pokaże Cię w wynikach lokalnych.",
      },
      {
        q: "Potrzebuję strony na konkretną datę — targi, kampania, otwarcie. Da się?",
        a: "Zwykle tak, jeśli data jest realna względem zakresu (landing 1–2 tygodnie, strona firmowa 3–5). Termin wpisujemy do umowy i to jest zobowiązanie, nie deklaracja. Jeśli data jest zbyt bliska dla wybranego pakietu, powiemy o tym przed podpisaniem i zaproponujemy węższy zakres na start, który zdążymy zrobić porządnie.",
      },
    ],
    nearby: ["strony-internetowe-bielsko-biala", "strony-internetowe-czechowice-dziedzice"],
    lastmod: "2026-09-01",
  },

  /* ────────────────────── CZECHOWICE-DZIEDZICE ──────────────────────────── */
  {
    slug: "strony-internetowe-czechowice-dziedzice",
    city: "Czechowice-Dziedzice",
    inCity: "w Czechowicach-Dziedzicach",
    fromCity: "z Czechowic-Dziedzic",
    region: "powiat bielski",
    title: "Strony internetowe Czechowice-Dziedzice — projekt i kod",
    description:
      "Tworzenie stron internetowych dla firm z Czechowic-Dziedzic: autorski kod zamiast szablonu, ceny od 2 900 zł netto, zakres i termin w umowie, odpowiedź w 24 h. KODA — studio z sąsiedniego Bielska-Białej.",
    h1: "Strony internetowe Czechowice-Dziedzice",
    lead: `KODA robi strony internetowe dla firm z Czechowic-Dziedzic — ${CENY}. Zakres i termin zapisujemy w umowie, odpowiadamy w 24 godziny, a dzieli nas kwadrans drogi: pracujemy z sąsiedniego Bielska-Białej.`,
    intro: [
      "Czechowice-Dziedzice to miasto zakładów produkcyjnych, firm technicznych i mocnego zaplecza usługowego — z warsztatami, instalatorami i wykonawcami, którzy zleceń szukają w promieniu kilkunastu kilometrów. Przy takim zasięgu strona nie musi wygrywać z całą Polską. Musi wygrać z konkurencją z tej samej gminy i z sąsiedniego Bielska.",
      "To akurat jest wykonalne i stosunkowo tanie, bo lokalna konkurencja rzadko ma stronę szybką, poprawnie opisaną i pisaną pod to, czego klient faktycznie szuka. Zwykle stoi na szablonie sprzed kilku lat, którego nikt nie aktualizował.",
      "Robimy więc rzecz prostą do opisania i trudną do podrobienia: piszemy stronę od zera w autorskim kodzie, wkładamy w nią treść odpowiadającą na realne pytania klientów i pilnujemy, żeby ładowała się natychmiast również na telefonie w słabym zasięgu.",
      "Jest tu jeszcze jeden czynnik, o którym łatwo zapomnieć: bliskość Bielska-Białej działa w obie strony. Klient z Czechowic bez wahania pojedzie kwadrans do Bielska, a bielska konkurencja równie chętnie bierze zlecenia w Czechowicach. Dlatego strona firmy z Czechowic-Dziedzic powinna być pisana pod oba te obszary naraz — inaczej oddajesz połowę rynku, który i tak jest w Twoim zasięgu.",
    ],
    industries: [
      {
        name: "Zakłady produkcyjne i firmy techniczne",
        desc: "Konkret zamiast ogólników: co produkujecie, w jakich seriach, na jakich maszynach i do kogo ma się odezwać kupujący.",
      },
      {
        name: "Usługi budowlane i instalacyjne",
        desc: "Realizacje z okolicy, zakres prac i obszar działania. Telefon dostępny z każdego miejsca na stronie.",
      },
      {
        name: "Warsztaty i serwisy",
        desc: "Co naprawiacie, jak szybko i ile to kosztuje. Klient szukający serwisu decyduje w kilkadziesiąt sekund.",
      },
      {
        name: "Handel i hurt lokalny",
        desc: "Czytelny katalog tego, co macie, i prosty kontakt do zapytania ofertowego — bez zmuszania do wypełniania ankiety.",
      },
      {
        name: "Gabinety i usługi zdrowotne",
        desc: "Godziny, zakres i rezerwacja podane wprost, spokojnym językiem, bez marketingowej przesady.",
      },
      {
        name: "Gastronomia i usługi lokalne",
        desc: "Menu i godziny widoczne od razu na telefonie, bez pobierania plików PDF.",
      },
    ],
    proximity:
      "Z Bielska-Białej do Czechowic-Dziedzic jest kilkanaście kilometrów, czyli kwadrans jazdy. Spotkanie na miejscu jest bezproblemowe, choć projekt i tak prowadzimy zdalnie.",
    whyLocal: [
      "Przy zasięgu gminnym i powiatowym o wyniku decyduje wizytówka Google i strona, do której ta wizytówka prowadzi. Nasza część to fundament: szybkość, struktura, dane strukturalne firmy z poprawnym adresem i telefonem oraz treść dopasowana do tego, jak ludzie faktycznie szukają usługi w okolicy.",
      "Nie sprzedajemy przy tym pozycjonowania jako cudownego środka. Powiemy wprost, ile z widoczności lokalnej zależy od strony, a ile od opinii i wizytówki — łącznie z tym, co możesz zrobić sam, bez płacenia nikomu.",
    ],
    faq: [
      {
        q: "Ile kosztuje strona internetowa w Czechowicach-Dziedzicach?",
        a: "Tyle samo co wszędzie u nas: landing page od 2 900 zł netto, wizytówka od 3 900 zł, strona firmowa od 6 900 zł, premium z animacjami i 3D od 12 900 zł. Wycenę pod Twoją firmę robimy bezpłatnie w 24 godziny i wpisujemy do umowy.",
      },
      {
        q: "Czy przyjedziecie na spotkanie?",
        a: "Tak, z Bielska-Białej to kwadrans drogi. Choć w praktyce większość klientów wybiera tryb zdalny, bo jest po prostu szybszy — projekt do akceptacji dostajesz mailem i oglądasz wtedy, kiedy masz czas.",
      },
      {
        q: "Jak długo powstaje strona?",
        a: `W KODA ${TERMINY}. Konkretny termin jest w umowie, ustalony przed rozpoczęciem pracy.`,
      },
      {
        q: "Czy mała firma potrzebuje strony, skoro ma profil w mediach społecznościowych?",
        a: "Profil jest wypożyczony — regulamin, zasięgi i sam dostęp zależą od cudzej platformy. Strona jest Twoja: to ona wychodzi w Google, gdy ktoś szuka usługi w okolicy, i to do niej prowadzi wizytówka Google. Jedno nie zastępuje drugiego, ale bez strony tracisz zapytania od ludzi, którzy szukają, zamiast przeglądać.",
      },
      {
        q: "Prowadzę jednoosobową działalność. Czy to nie za duży wydatek?",
        a: "Przy jednoosobowej działalności zwykle najsensowniej zacząć od strony wizytówki (od 3 900 zł netto) albo landing page pod jedną usługę (od 2 900 zł) — a nie od rozbudowanego serwisu, w którym połowa podstron świeci pustkami. Powiemy wprost, który wariant ma u Ciebie sens, także wtedy, gdy oznacza to mniejsze zlecenie dla nas.",
      },
      {
        q: "Czy będę mógł sam zmieniać treść na stronie?",
        a: "Zależy, czego potrzebujesz. Przy stronie, która zmienia się rzadko, taniej i bezpieczniej jest zgłaszać nam drobne zmiany w ramach opieki (od 149 zł miesięcznie) niż utrzymywać panel administracyjny. Jeśli zamierzasz aktualizować treść regularnie — na przykład prowadzić aktualności albo cennik — dokładamy prosty panel do samodzielnej edycji i ustalamy to na etapie wyceny.",
      },
    ],
    nearby: [
      "strony-internetowe-bielsko-biala",
      "strony-internetowe-zywiec",
      "strony-internetowe-cieszyn",
    ],
    lastmod: "2026-09-01",
  },

  /* ────────────────────────────── ŻYWIEC ─────────────────────────────────── */
  {
    slug: "strony-internetowe-zywiec",
    city: "Żywiec",
    inCity: "w Żywcu",
    fromCity: "z Żywca",
    region: "Żywiecczyzna",
    title: "Strony internetowe Żywiec — projektowanie i kodowanie",
    description:
      "Strony internetowe dla firm i obiektów z Żywca i Żywiecczyzny: autorski kod, ceny od 2 900 zł netto, zakres i termin w umowie, odpowiedź w 24 h. KODA — studio z Bielska-Białej, pół godziny drogi.",
    h1: "Strony internetowe Żywiec",
    lead: `KODA projektuje i koduje strony internetowe dla firm z Żywca i Żywiecczyzny — ${CENY}. Zakres i termin zapisujemy w umowie, a odpowiedź na zapytanie wysyłamy w ciągu 24 godzin. Z Bielska-Białej do Żywca jest pół godziny drogi.`,
    intro: [
      "Żywiecczyzna ma inną strukturę klienta niż miasto przemysłowe: dużą część zapytań generuje tu turystyka — pensjonaty, domki, apartamenty i agroturystyka nad Jeziorem Żywieckim oraz w Beskidzie Żywieckim — obok solidnego zaplecza zakładów produkcyjnych, stolarstwa i usług lokalnych.",
      "W turystyce strona pracuje inaczej niż w usługach. Decyzja zapada w kilka minut, najczęściej na telefonie, na podstawie zdjęć i tego, czy da się szybko sprawdzić dostępność i cenę. Strona, która każe pisać maila z pytaniem o wolne terminy, traci gościa na rzecz portalu rezerwacyjnego — i potem oddaje mu prowizję.",
      "Dlatego obiekty prowadzimy pod jednym celem: rezerwacja bezpośrednia. Zdjęcia pokazane tak, żeby sprzedawały miejsce, cena i dostępność widoczne bez szukania, kontakt działający jedną ręką w trasie. Wszystko w autorskim kodzie, który ładuje się natychmiast również przy słabym zasięgu w dolinie.",
      "Sezonowość zmienia też kalendarz samego projektu. Strona obiektu turystycznego powinna być gotowa i zaindeksowana na kilka miesięcy przed szczytem, bo rezerwacje na ferie czy lato zapadają dużo wcześniej niż sam wyjazd, a nowa strona potrzebuje czasu, zanim Google zacznie ją pokazywać. Najgorszy moment na start to środek sezonu — wtedy strona zdąży zebrać ruch dopiero na następny.",
    ],
    industries: [
      {
        name: "Pensjonaty, domki i apartamenty",
        desc: "Zdjęcia sprzedające miejsce, jasna cena i dostępność, kontakt jednym kliknięciem. Cel: rezerwacja bezpośrednia zamiast prowizji dla portalu.",
      },
      {
        name: "Agroturystyka i wynajem krótkoterminowy",
        desc: "Strona, która pokazuje to, czego szuka gość: okolicę, dojazd, co jest w cenie i dla kogo to miejsce naprawdę jest.",
      },
      {
        name: "Gastronomia i miejsca sezonowe",
        desc: "Menu i godziny widoczne od razu na telefonie, bez PDF-ów. Sezon nie wybacza stronie, która się nie otwiera.",
      },
      {
        name: "Stolarstwo, drewno i rzemiosło",
        desc: "Portfolio, które broni ceny: realizacje, materiały, detale wykonania. Rzemiosło sprzedaje się zdjęciem i konkretem.",
      },
      {
        name: "Zakłady produkcyjne i usługi techniczne",
        desc: "Możliwości, park maszynowy i bezpośredni kontakt do osoby decyzyjnej — materiał, który przechodzi weryfikację kupca.",
      },
      {
        name: "Usługi lokalne i budownictwo",
        desc: "Obszar działania, zakres prac i telefon widoczny na każdym ekranie. Prosto i bez waty.",
      },
    ],
    proximity:
      "Z Bielska-Białej do Żywca jedzie się około pół godziny. Spotkanie na miejscu jest do umówienia, ale cały projekt można poprowadzić zdalnie — bez różnicy w cenie i terminie.",
    whyLocal: [
      "W turystyce widoczność w Google przekłada się wprost na pieniądze, bo każda rezerwacja bezpośrednia to rezerwacja bez prowizji portalu. Strona obiektu musi więc być szybka, mieć poprawne dane w wyszukiwarce i treść odpowiadającą na pytania, które gość zadaje przed rezerwacją: gdzie to jest, co jest w cenie, jak z dojazdem i parkingiem.",
      "Dla firm produkcyjnych i rzemiosła sprawa wygląda inaczej: zapytań jest mniej, ale są znacznie więcej warte. Tam strona ma budować wiarygodność — pokazać realizacje, możliwości i ludzi, a nie sypać ogólnikami o pasji i jakości.",
    ],
    faq: [
      {
        q: "Ile kosztuje strona internetowa w Żywcu?",
        a: "Cennik jest ten sam niezależnie od miejscowości: landing page od 2 900 zł netto, wizytówka od 3 900 zł, strona firmowa od 6 900 zł, premium z animacjami i 3D od 12 900 zł. Wycena pod konkretny obiekt lub firmę jest bezpłatna i wraca w 24 godziny.",
      },
      {
        q: "Czy zrobicie stronę dla pensjonatu z rezerwacją?",
        a: "Zrobimy stronę nastawioną na rezerwację bezpośrednią: zdjęcia, ceny, dostępność i szybki kontakt. Nie budujemy natomiast własnych systemów płatności — jeśli potrzebujesz płatności online, wpinamy sprawdzony zewnętrzny silnik rezerwacyjny i mówimy o tym wprost na pierwszej rozmowie.",
      },
      {
        q: "Ile trwa zrobienie strony?",
        a: `W KODA ${TERMINY}. Przy obiektach turystycznych warto liczyć wstecz od sezonu — najlepiej zacząć kilka miesięcy przed nim, a nie w trakcie.`,
      },
      {
        q: "Czy trzeba przyjechać do Bielska-Białej?",
        a: "Nie. Projekt prowadzimy zdalnie, a jeśli wolisz spotkanie, dojazd do Żywca to pół godziny — umówimy się bez dopłat.",
      },
      {
        q: "Czy strona wytrzyma ruch w szczycie sezonu?",
        a: "Tak — i to jest realna różnica względem szablonu z wtyczkami. Strony budujemy jako statyczne, serwowane z sieci brzegowej, więc kilkukrotny skok ruchu w długi weekend nie zmienia czasu ładowania ani nie generuje dodatkowych kosztów serwera. Nie ma tu bazy danych, która potrafi się położyć w najgorszym możliwym momencie.",
      },
      {
        q: "Mam obiekt na portalu rezerwacyjnym. Po co mi jeszcze własna strona?",
        a: "Bo każda rezerwacja z własnej strony to rezerwacja bez prowizji, która przy kilkunastu procentach od pobytu potrafi zwrócić koszt strony w jeden sezon. Portal daje zasięg, ale zabiera marżę i relację z gościem. Zwykle najlepiej działa jedno i drugie równolegle: portal jako źródło pierwszego kontaktu, własna strona jako miejsce, do którego gość wraca przy kolejnym pobycie.",
      },
    ],
    nearby: [
      "strony-internetowe-bielsko-biala",
      "strony-internetowe-cieszyn",
      "strony-internetowe-czechowice-dziedzice",
    ],
    lastmod: "2026-09-01",
  },

  /* ────────────────────────────── CIESZYN ────────────────────────────────── */
  {
    slug: "strony-internetowe-cieszyn",
    city: "Cieszyn",
    inCity: "w Cieszynie",
    fromCity: "z Cieszyna",
    region: "Śląsk Cieszyński",
    title: "Strony internetowe Cieszyn — projektowanie i kodowanie",
    description:
      "Strony internetowe dla firm z Cieszyna i Śląska Cieszyńskiego: autorski kod, wersje językowe zrobione poprawnie, ceny od 2 900 zł netto, zakres i termin w umowie, odpowiedź w 24 h.",
    h1: "Strony internetowe Cieszyn",
    lead: `KODA projektuje i koduje strony internetowe dla firm ze Śląska Cieszyńskiego — ${CENY}. Zakres i termin trafiają do umowy przed startem, a na zapytanie odpowiadamy w 24 godziny. Z Bielska-Białej do Cieszyna jest niecałe pół godziny.`,
    intro: [
      "Cieszyn ma cechę, której nie mają sąsiednie miasta: granicę w środku. Spora część tutejszych firm obsługuje klientów po obu stronach Olzy, a ruch turystyczny w starówce jest w dużej mierze czeski. To zmienia wymagania wobec strony — czasem wystarczy jasna informacja o obsłudze w dwóch językach, czasem potrzebna jest pełna wersja obcojęzyczna z poprawnym oznaczeniem języka dla wyszukiwarki.",
      "Robimy strony wielojęzyczne technicznie poprawnie: osobne adresy dla każdej wersji i znaczniki hreflang, dzięki którym Google pokazuje właściwą wersję właściwemu użytkownikowi, zamiast traktować obie jako duplikat.",
      "Poza tym obowiązuje ta sama zasada co wszędzie u nas: autorski kod zamiast szablonu, treść pisana pod realne pytania klientów i szybkość, która nie zależy od tego, ile wtyczek ktoś kiedyś doinstalował.",
      "Śląsk Cieszyński to przy tym rynek rozproszony: klienci przyjeżdżają z Ustronia, Wisły, Skoczowa i Goleszowa, a w sezonie dochodzi do tego ruch turystyczny z całej Polski i z Czech. Strona firmy z Cieszyna powinna więc mówić jasno, kogo i gdzie obsługuje — inaczej wypada z wyników w miejscowościach, z których i tak przyjeżdżają do niej klienci.",
    ],
    industries: [
      {
        name: "Turystyka i miejsca na starówce",
        desc: "Kawiarnie, hotele, obiekty i atrakcje. Godziny, menu i kontakt widoczne od razu na telefonie, po polsku i po czesku, jeśli trzeba.",
      },
      {
        name: "Handel i usługi transgraniczne",
        desc: "Strona, która jasno mówi, kogo obsługujecie po obu stronach granicy, w jakich językach i na jakich zasadach.",
      },
      {
        name: "Rzemiosło i produkcja",
        desc: "Portfolio realizacji i konkret techniczny zamiast ogólników o jakości — to jedyne, co broni ceny u wykonawcy.",
      },
      {
        name: "Usługi profesjonalne",
        desc: "Kancelarie, biura i gabinety: konkretne specjalizacje, prosta droga do kontaktu, zero pustych deklaracji.",
      },
      {
        name: "Kultura, wydarzenia i instytucje",
        desc: "Terminy, program i dojazd podane czytelnie — strona, która działa również w dniu wydarzenia, przy dużym ruchu.",
      },
      {
        name: "Budownictwo i usługi lokalne",
        desc: "Obszar działania, zakres prac, realizacje z okolicy i telefon dostępny z każdego ekranu.",
      },
    ],
    proximity:
      "Z Bielska-Białej do Cieszyna jedzie się niecałe pół godziny. Spotkanie na miejscu jest do umówienia; projekt prowadzimy zdalnie, co nie zmienia ani ceny, ani terminu.",
    whyLocal: [
      "Przy działalności transgranicznej najczęstszy błąd to wrzucenie dwóch języków na jeden adres albo automatyczne tłumaczenie w tle. Google widzi wtedy jedną stronę o niejasnym języku i pokazuje ją gorzej po obu stronach granicy. Poprawnie zrobione wersje językowe to osobne adresy, własne opisy i hreflang — i tę różnicę widać w wynikach.",
      "Reszta jest jak wszędzie: wygrywa strona szybka, z treścią pisaną pod to, czego ludzie faktycznie szukają, i z porządnie opisanymi danymi firmy. Cieszyn jest przy tym rynkiem mniejszym niż Katowice, więc wejście na wysokie pozycje kosztuje tu realnie mniej pracy.",
    ],
    faq: [
      {
        q: "Ile kosztuje strona internetowa w Cieszynie?",
        a: "Landing page od 2 900 zł netto, wizytówka od 3 900 zł, strona firmowa od 6 900 zł, projekt premium z animacjami i 3D od 12 900 zł — ceny nie zależą od miejscowości. Konkretną wycenę przygotowujemy bezpłatnie w 24 godziny i zapisujemy w umowie.",
      },
      {
        q: "Zrobicie stronę po polsku i po czesku?",
        a: "Tak. Każda wersja językowa dostaje osobny adres, własne opisy dla wyszukiwarki i znaczniki hreflang, żeby Google pokazywał właściwą wersję właściwemu użytkownikowi. Tłumaczenie tekstów ustalamy przed startem — możesz dostarczyć własne albo zamówić je razem z projektem.",
      },
      {
        q: "Ile trwa zrobienie strony?",
        a: `W KODA ${TERMINY}. Wersja obcojęzyczna wydłuża projekt zwykle o kilka dni — dokładny termin jest w umowie.`,
      },
      {
        q: "Czy pracujecie z firmami z całego Śląska Cieszyńskiego?",
        a: "Tak — Cieszyn, Skoczów, Ustroń, Wisła i okolice. Projekt prowadzimy zdalnie, a na spotkanie dojeżdżamy z Bielska-Białej bez dodatkowych kosztów.",
      },
      {
        q: "Obsługuję klientów z Czech. Czy strona pomoże mnie tam znaleźć?",
        a: "Wersja czeska pod własnym adresem i z poprawnym hreflang jest widoczna w czeskim Google jak każda inna strona — sam język strony nie jest przeszkodą, a domena polska też nią nie jest. Największą różnicę robi natomiast to, czy podajesz wprost warunki obsługi klienta zza granicy: rozliczenie, dostawę, język kontaktu. To są pytania, które i tak padną w pierwszym mailu.",
      },
      {
        q: "Czy zapytania z formularza mogą przychodzić w dwóch językach?",
        a: "Tak — formularz na każdej wersji językowej może mieć własne etykiety i trafiać do tej samej skrzynki z oznaczeniem, z której wersji przyszedł. Dzięki temu od razu wiesz, w jakim języku odpisać, bez zgadywania po treści wiadomości.",
      },
    ],
    nearby: [
      "strony-internetowe-bielsko-biala",
      "strony-internetowe-zywiec",
      "strony-internetowe-czechowice-dziedzice",
    ],
    lastmod: "2026-09-01",
  },
];

/** Lokalizacja po slugu — używane przez strony i generateStaticParams. */
export function getLocation(slug: string): Location | undefined {
  return LOCATIONS.find((l) => l.slug === slug);
}

/** Miasto-baza. Wyróżnione w mapie witryny (priorytet) i w linkowaniu. */
export const PRIMARY_LOCATION = LOCATIONS[0];
