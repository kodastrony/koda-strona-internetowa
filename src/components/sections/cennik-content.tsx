import Link from "next/link";
import { FadeUp } from "@/components/motion";

/* ════════════════════════════════════════════════════════════════════════════
   /cennik — REALNY CENNIK KODA + kontekst rynkowy (przebudowa 27.08.2026).

   Decyzja Natana (27.08): publikujemy prawdziwe ceny „od" dla WSZYSTKICH
   przypadków (pakiety stron, dodatki, opieka), zamiast samych widełek
   rynkowych. Liczby z modelu `marketing/CENNIK-MODEL-2026.md`:
   research PL 08.2026 (4 raporty, ~45 źródeł: cenniki agencji, Index Useme,
   raporty płac) × nakład pracy KODA (godziny × stawka efektywna 150 zł/h).
   Pozycjonowanie: „technologia z półki 15–35 tys. (autorski kod Next.js,
   CWV 100) w cenach dobrej lokalnej agencji".

   Struktura strony: BLUF z cenami (LCP, czysty CSS) → pakiety (wiersze
   hairline, bez kart — anti-slop) → co w cenie każdej strony → dodatki →
   opieka → zasady → rynek 2026 (kontekst SEO/AEO) → FAQ (answer-first).
   Sekcja rynkowa NADAL wygrywa frazy „ile kosztuje strona internetowa"
   (tabele = format #1 cytowań AI) — teraz z naszymi cenami obok.
   ════════════════════════════════════════════════════════════════════════════ */

export interface CennikFaq {
  q: string;
  a: string;
}

/** Mini-FAQ — jedno źródło prawdy: sekcja niżej ORAZ FAQPage JSON-LD na
 *  /cennik (app/cennik/page.tsx). Odpowiedzi answer-first (ekstrakcja AI). */
export const CENNIK_FAQ: CennikFaq[] = [
  {
    q: "Ile kosztuje strona internetowa w KODA?",
    a: "Landing page kosztuje w KODA od 2 900 zł netto, strona wizytówka (do 5 podstron) od 3 900 zł, strona firmowa (6–10 podstron) od 6 900 zł, a projekty premium z zaawansowanymi animacjami i 3D — od 12 900 zł. Cena „od” dotyczy minimalnego zakresu pakietu; konkretną wycenę dla Twojego projektu podajemy bezpłatnie w ciągu 24 godzin i zapisujemy w umowie.",
  },
  {
    q: "Co jest w cenie każdej strony?",
    a: "W każdej cenie KODA jest: autorski kod (bez szablonów), responsywność, wyniki szybkości 100/100 (Core Web Vitals), SEO techniczne z danymi strukturalnymi schema.org, formularz i mapa dojazdu, analityka bez cookies, wzór polityki prywatności, makiety do akceptacji przed kodowaniem, umowa z zakresem i terminem oraz 14 dni gwarancji technicznej po starcie. Za te elementy duża część rynku dolicza osobno.",
  },
  {
    q: "Czy cena „od” to cena ostateczna?",
    a: "Cena „od” to realny koszt najprostszego wariantu pakietu — przy treściach dostarczonych przez Ciebie i standardowym zakresie. Ostateczną kwotę poznasz przed startem: bezpłatna wycena w 24 godziny, konkret zapisany w umowie razem z terminem. Cena z umowy się nie zmienia — zamiast dopłat, ewentualne zmiany zakresu ustalamy wspólnie.",
  },
  {
    q: "Ile kosztuje opieka nad stroną po starcie?",
    a: "Opieka techniczna KODA kosztuje od 149 zł netto miesięcznie (monitoring 24/7, aktualizacje, kopie zapasowe, drobne zmiany do 1 h — z hostingiem w cenie). Plan z większą pulą zmian i raportem to 349 zł/mc, a plan rozwojowy z 6 h prac — 799 zł/mc. Bez abonamentu rozliczamy 150 zł/h. Przez pierwsze 14 dni po starcie poprawki są zawsze bezpłatne — to gwarancja techniczna.",
  },
  {
    q: "Ile kosztuje strona internetowa na rynku w 2026?",
    a: "W Polsce w 2026 roku strona wizytówka kosztuje najczęściej 2 000–4 000 zł netto, strona firmowa na WordPressie 3 000–8 000 zł, strona firmowa na autorskim kodzie (Next.js/React) 12 000–35 000 zł, a kreatywne projekty premium z animacjami i 3D — 20 000–80 000 zł. Średnia cena projektu strony u freelancera to ok. 1 900 zł (Index Useme). KODA daje autorski kod w cenach z niższej półki: od 2 900 do ok. 25 000 zł.",
  },
  {
    q: "Ile trwa zrobienie strony internetowej?",
    a: "Landing page robimy zwykle w 2–3 tygodnie, wizytówkę w 2–4 tygodnie, stronę firmową w 4–6 tygodni, a projekty premium z animacjami i 3D w 6–10 tygodni. Najwięcej czasu zajmują treści i rundy poprawek, dlatego termin ustalamy w umowie przed startem — i go pilnujemy. Za dopłatą +30% realizujemy tryb ekspres z priorytetem terminu.",
  },
  {
    q: "Płaci się raz, czy co miesiąc?",
    a: "Za stronę płacisz jednorazowo: 30% zaliczki na start i resztę przy oddaniu — strona, pliki i domena są Twoje. Później zostaje tylko domena (ok. 100 zł rocznie) oraz — opcjonalnie — opieka techniczna od 149 zł miesięcznie, w której hosting jest już w cenie. Bez ukrytych kosztów.",
  },
];

/* ── CENNIK KODA — dane (źródło: marketing/CENNIK-MODEL-2026.md) ─────────── */

const PAKIETY: {
  name: string;
  desc: string;
  from: string;
  typical: string;
  chips: string[];
}[] = [
  {
    name: "Landing page",
    desc: "Jedna strona, która sprzedaje jedną rzecz.",
    from: "2 900",
    typical: "3 500 – 4 500 zł",
    chips: ["do 6 sekcji", "formularz + telefon", "animacje", "2–3 tygodnie"],
  },
  {
    name: "Strona wizytówka",
    desc: "Pełna obecność firmy — do 5 podstron.",
    from: "3 900",
    typical: "4 500 – 6 000 zł",
    chips: ["do 5 podstron", "mapa dojazdu", "rozbudowany home", "2–4 tygodnie"],
  },
  {
    name: "Strona firmowa",
    desc: "6–10 podstron z treściami i strukturą pod SEO.",
    from: "6 900",
    typical: "8 000 – 12 000 zł",
    chips: ["6–10 podstron", "treści z nami", "struktura SEO", "4–6 tygodni"],
  },
  {
    name: "Premium 2D / 3D",
    desc: "Indywidualny koncept: zaawansowane animacje, sceny 3D, konfiguratory.",
    from: "12 900",
    typical: "15 000 – 25 000 zł",
    chips: ["autorski koncept", "sceny 3D / WebGL", "konfiguratory", "6–10 tygodni"],
  },
];

/** Zawsze w cenie — rynek za większość z tego dolicza osobno. */
const W_CENIE: string[] = [
  "Autorski kod — zero szablonów",
  "Responsywność: telefon, tablet, desktop",
  "Core Web Vitals 100/100",
  "SEO techniczne + schema.org",
  "Formularz i mapa dojazdu",
  "Analityka bez cookies",
  "Wzór polityki prywatności",
  "Makiety do akceptacji przed kodem",
  "Umowa: zakres i termin",
  "Gwarancja techniczna 14 dni",
];

const DODATKI: { name: string; price: string }[] = [
  { name: "Dodatkowa podstrona", price: "od 400 zł" },
  { name: "Treść podstrony (copywriting)", price: "od 300 zł" },
  { name: "Dodatkowa wersja językowa (do 5 podstron)", price: "od 1 500 zł" },
  { name: "Kalkulator wyceny / formularz z logiką", price: "od 1 900 zł" },
  { name: "Sekcja 3D — model produktu na stronie", price: "od 2 900 zł" },
  { name: "Konfigurator produktu", price: "od 6 900 zł" },
  { name: "System rezerwacji (wdrożenie)", price: "od 1 200 zł" },
  { name: "Analityka rozszerzona (cele i zdarzenia)", price: "od 900 zł" },
  { name: "Logo przy okazji strony", price: "od 1 500 zł" },
  { name: "SEO start dla istniejącej strony (audyt + wdrożenie)", price: "od 1 200 zł" },
  { name: "Redesign — odświeżenie istniejącej strony", price: "od 2 900 zł" },
  { name: "Tryb ekspres — priorytet terminu", price: "+30%" },
];

const OPIEKA: { name: string; price: string; points: string[] }[] = [
  {
    name: "Czuwanie",
    price: "149",
    points: [
      "monitoring 24/7",
      "aktualizacje i kopie zapasowe",
      "drobne zmiany do 1 h / mc",
      "hosting w cenie",
      "odpowiedź w 24 h + telefon",
    ],
  },
  {
    name: "Opieka+",
    price: "349",
    points: [
      "wszystko z Czuwania",
      "zmiany do 3 h / mc",
      "miesięczny raport: szybkość i widoczność",
      "priorytet zgłoszeń",
    ],
  },
  {
    name: "Rozwój",
    price: "799",
    points: [
      "wszystko z Opieki+",
      "do 6 h / mc — nowe sekcje i funkcje",
      "konsultacje rozwoju strony",
      "kwartalny przegląd wyników",
    ],
  },
];

const ZASADY: { title: string; desc: string }[] = [
  {
    title: "30% zaliczki, 70% przy oddaniu",
    desc: "Prosto i przewidywalnie. Faktura za całość przy przekazaniu strony.",
  },
  {
    title: "Umowa: zakres i termin",
    desc: "Cena z umowy się nie zmienia. Dwie rundy poprawek na etap w cenie.",
  },
  {
    title: "Strona jest Twoja",
    desc: "Kod, pliki i domena należą do Ciebie. Po starcie przekazujemy pełne dostępy.",
  },
  {
    title: "Stała cena zamiast rabatów",
    desc: "Nie gramy w promocje. Gdy budżet jest mniejszy — dopasowujemy zakres, nie jakość.",
  },
];

/* ── Rynek 2026 (kontekst edukacyjny; liczby z researchu 08.2026) ────────── */

const PRICE_BY_TYPE: { type: string; range: string }[] = [
  { type: "One page / prosta strona", range: "1 000 – 2 500 zł" },
  { type: "Landing page (na zamówienie)", range: "1 500 – 4 500 zł" },
  { type: "Strona wizytówka", range: "2 000 – 4 000 zł" },
  { type: "Strona firmowa (WordPress)", range: "3 000 – 8 000 zł" },
  { type: "Strona firmowa — autorski kod (Next.js / React)", range: "12 000 – 35 000 zł" },
  { type: "Kreatywna premium — animacje i 3D", range: "20 000 – 80 000 zł" },
];

const WORK_MODELS: { name: string; cost: string; get: string; watch: string }[] = [
  {
    name: "Kreator (Wix, Squarespace)",
    cost: "100 – 500 zł / rok + Twój czas",
    get: "Szablon, który składasz samodzielnie",
    watch: "Szablonowy wygląd, słabsze SEO, wolniejsze ładowanie, trudna rozbudowa",
  },
  {
    name: "Freelancer",
    cost: "1 500 – 8 000 zł",
    get: "Jedna osoba robi całość (śr. cena projektu: ok. 1 900 zł — Index Useme)",
    watch: "Brak zastępstwa, zmienny czas odpowiedzi, różna jakość i wsparcie",
  },
  {
    name: "Studio / butik (jak KODA)",
    cost: "3 000 – 25 000 zł",
    get: "Projekt + autorski kod + opieka, zakres i termin w umowie",
    watch: "Warto wybrać wykonawcę, który zostaje po starcie",
  },
  {
    name: "Duża agencja z PM-em",
    cost: "15 000 – 80 000 zł",
    get: "Pełny zespół i rozbudowany proces",
    watch: "Drożej, więcej formalności i pośredników",
  },
];

const COST_DRIVERS: { title: string; desc: string }[] = [
  {
    title: "Liczba podstron i sekcji",
    desc: "Im więcej treści i widoków, tym więcej pracy projektowej i programistycznej.",
  },
  {
    title: "Treści i zdjęcia",
    desc: "Czy dostarczasz teksty i materiały, czy tworzymy je razem od zera.",
  },
  {
    title: "Projekt indywidualny czy szablon",
    desc: "Autorski projekt pod markę kosztuje więcej niż gotowy motyw — i tyle samo wyróżnia.",
  },
  {
    title: "Funkcje",
    desc: "Formularze, integracje, wielojęzyczność, animacje i 3D podnoszą zakres.",
  },
  {
    title: "SEO techniczne i wydajność",
    desc: "Szybkość (Core Web Vitals) i poprawna struktura to fundament widoczności w Google.",
  },
  {
    title: "Opieka po starcie",
    desc: "Aktualizacje, bezpieczeństwo i rozwój strony razem z firmą — u nas od 149 zł/mc.",
  },
];

/* ── Pomocnicze style sekcji (spójne z /uslugi) ──────────────────────────── */
const sectionDivider: React.CSSProperties = {
  borderTop: "1px solid var(--color-line)",
  paddingTop: "clamp(48px,6vw,96px)",
  paddingBottom: "clamp(48px,6vw,96px)",
};
const h2Style: React.CSSProperties = {
  fontSize: "clamp(1.7rem,3vw,2.6rem)",
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "var(--color-ink)",
};
const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
  lineHeight: 1.65,
  color: "var(--color-ink-muted)",
};
const chipStyle: React.CSSProperties = {
  border: "1px solid var(--color-line)",
  borderRadius: 999,
  padding: "0.35rem 0.85rem",
  fontFamily: "var(--font-body)",
  fontSize: "0.82rem",
  color: "var(--color-ink-muted)",
  whiteSpace: "nowrap",
};

export function CennikContent() {
  return (
    <section data-header-theme="dark" data-canvas="base" className="relative">
      {/* ── BLUF z cenami KODA (LCP → czysty CSS .ph-lead-in) ── */}
      <div className="container-koda" style={{ paddingBottom: "clamp(40px, 6vw, 96px)" }}>
        <div className="ph-lead-in" style={{ animationDelay: "0.1s" }}>
          <div
            style={{
              borderLeft: "3px solid var(--color-pink-bright)",
              paddingLeft: "clamp(18px, 2.5vw, 32px)",
              maxWidth: "64ch",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.12rem, 1.5vw, 1.4rem)",
                lineHeight: 1.6,
                color: "var(--color-ink)",
              }}
            >
              Strona internetowa w KODA kosztuje{" "}
              <strong>od 2 900 zł netto</strong> (landing page), wizytówka{" "}
              <strong>od 3 900 zł</strong>, strona firmowa <strong>od 6 900 zł</strong>, a projekty
              premium z animacjami i 3D — <strong>od 12 900 zł</strong>. W każdej cenie: autorski
              kod, szybkość 100/100 i 14 dni gwarancji.
            </p>
            <p className="mt-4" style={{ ...bodyStyle, maxWidth: "64ch" }}>
              <span style={{ color: "var(--color-ink-faint)" }}>Stan na: sierpień 2026.</span>{" "}
              Ceny „od” to minimalny zakres pakietu — konkret dla Twojego projektu podajemy{" "}
              <Link
                href="/kontakt"
                className="font-medium underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                style={{ color: "var(--color-ink)" }}
              >
                bezpłatnie w 24 h
              </Link>
              , a kwotę zapisujemy w umowie.
            </p>
          </div>
        </div>
      </div>

      {/* ── PAKIETY — wiersze hairline, wielka cena, chipy zakresu ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Cennik KODA — strony
          </h2>
        </FadeUp>
        <div className="mt-8 flex flex-col">
          {PAKIETY.map((p, i) => (
            <FadeUp inView key={p.name} delay={0.05 * i}>
              <div
                className="grid grid-cols-1 gap-y-4 py-8 md:grid-cols-12 md:items-center md:gap-x-8"
                style={{
                  borderTop: i === 0 ? "1px solid var(--color-line)" : undefined,
                  borderBottom: "1px solid var(--color-line)",
                }}
              >
                <div className="md:col-span-6">
                  <h3
                    className="font-heading font-semibold"
                    style={{
                      fontSize: "clamp(1.35rem,2.2vw,1.9rem)",
                      letterSpacing: "-0.02em",
                      color: "var(--color-ink)",
                    }}
                  >
                    {p.name}
                  </h3>
                  <p className="mt-1.5" style={{ ...bodyStyle, fontSize: "1rem", maxWidth: "44ch" }}>
                    {p.desc}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2" role="list">
                    {p.chips.map((c) => (
                      <li key={c} style={chipStyle}>
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="md:col-span-6 md:text-right">
                  <div
                    className="font-heading font-semibold"
                    style={{
                      fontSize: "clamp(2rem,4vw,3.2rem)",
                      letterSpacing: "-0.03em",
                      lineHeight: 1,
                      color: "var(--color-ink)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.45em",
                        fontWeight: 600,
                        color: "var(--color-ink-muted)",
                        marginRight: "0.5rem",
                        letterSpacing: "0",
                      }}
                    >
                      od
                    </span>
                    {p.from}
                    <span style={{ fontSize: "0.45em", fontWeight: 600, marginLeft: "0.35rem" }}>
                      zł
                    </span>
                  </div>
                  <p
                    className="mt-2"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.92rem",
                      color: "var(--color-ink-faint)",
                    }}
                  >
                    typowy zakres: {p.typical} netto
                  </p>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp inView delay={0.1}>
          <p className="mt-6" style={{ ...bodyStyle, fontSize: "0.95rem", maxWidth: "64ch" }}>
            Ceny netto. Rynkowe odniesienie: strona firmowa na autorskim kodzie (Next.js / React)
            kosztuje w Polsce 12 000 – 35 000 zł, a kreatywne projekty premium 20 000 – 80 000 zł —
            pełne widełki znajdziesz niżej.
          </p>
        </FadeUp>
      </div>

      {/* ── W CENIE KAŻDEJ STRONY ── */}
      <div className="container-koda" style={sectionDivider}>
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-5">
            <FadeUp inView>
              <h2 className="font-heading font-semibold" style={h2Style}>
                W cenie każdej strony
              </h2>
            </FadeUp>
            <FadeUp inView delay={0.08}>
              <p className="mt-4" style={{ ...bodyStyle, maxWidth: "40ch" }}>
                Duża część rynku dolicza to osobno. U nas to standard — w landingu za 2 900 zł tak
                samo, jak w projekcie premium.
              </p>
            </FadeUp>
          </div>
          <div className="md:col-span-7">
            <FadeUp inView delay={0.12}>
              <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2" role="list">
                {W_CENIE.map((w) => (
                  <li
                    key={w}
                    className="flex items-baseline gap-3"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      color: "var(--color-ink)",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: "var(--color-accent)" }}
                    />
                    {w}
                  </li>
                ))}
              </ul>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* ── DODATKI ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Dodatki i rozbudowa
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Do nowej strony albo do już istniejącej. Ceny netto — „od” zależnie od zakresu.
          </p>
        </FadeUp>
        <FadeUp inView delay={0.14}>
          <table className="mt-8 w-full border-collapse text-left">
            <caption className="sr-only">
              Cennik dodatków KODA: podstrony, wersje językowe, kalkulatory, 3D, integracje
            </caption>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--color-line)" }}>
                <th
                  scope="col"
                  className="label-koda pb-3"
                  style={{ color: "var(--color-ink-muted)", fontWeight: 700 }}
                >
                  Usługa
                </th>
                <th
                  scope="col"
                  className="label-koda pb-3 text-right"
                  style={{ color: "var(--color-ink-muted)", fontWeight: 700 }}
                >
                  Cena netto
                </th>
              </tr>
            </thead>
            <tbody>
              {DODATKI.map((d) => (
                <tr key={d.name} style={{ borderBottom: "1px solid var(--color-line)" }}>
                  <td
                    className="py-3.5 pr-4"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(0.95rem,1.05vw,1.05rem)",
                      color: "var(--color-ink)",
                    }}
                  >
                    {d.name}
                  </td>
                  <td
                    className="py-3.5 text-right font-heading font-semibold whitespace-nowrap"
                    style={{ fontSize: "clamp(0.95rem,1.05vw,1.05rem)", color: "var(--color-ink)" }}
                  >
                    {d.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </FadeUp>
      </div>

      {/* ── OPIEKA ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Opieka po starcie
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Pierwsze 14 dni po starcie to zawsze bezpłatna gwarancja techniczna. Potem — jeśli
            chcesz — zostajemy na stałe. Hosting jest w cenie każdego planu.
          </p>
        </FadeUp>
        <div className="mt-8 grid grid-cols-1 gap-y-10 md:grid-cols-3 md:gap-x-10">
          {OPIEKA.map((o, i) => (
            <FadeUp inView key={o.name} delay={0.06 * i}>
              <div
                style={{ borderTop: "2px solid var(--color-ink)", paddingTop: "1.25rem" }}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3
                    className="font-heading font-semibold"
                    style={{ fontSize: "1.25rem", color: "var(--color-ink)" }}
                  >
                    {o.name}
                  </h3>
                  <div
                    className="font-heading font-semibold whitespace-nowrap"
                    style={{ fontSize: "clamp(1.5rem,2.4vw,2rem)", color: "var(--color-ink)" }}
                  >
                    {o.price}
                    <span
                      style={{
                        fontSize: "0.55em",
                        fontWeight: 600,
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {" "}
                      zł/mc
                    </span>
                  </div>
                </div>
                <ul className="mt-4 flex flex-col gap-2" role="list">
                  {o.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-baseline gap-3"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      <span
                        aria-hidden="true"
                        className="inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: "var(--color-accent)" }}
                      />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp inView delay={0.12}>
          <p className="mt-8" style={{ ...bodyStyle, fontSize: "0.95rem", maxWidth: "64ch" }}>
            Bez abonamentu: <strong style={{ color: "var(--color-ink)" }}>150 zł / h</strong>{" "}
            (min. 1 h). Widoczność lokalna (SEO) w abonamencie:{" "}
            <strong style={{ color: "var(--color-ink)" }}>od 690 zł / mc</strong> — ograniczona
            liczba miejsc. Domena po Twojej stronie: ok. 100 zł rocznie.
          </p>
        </FadeUp>
      </div>

      {/* ── ZASADY ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Zasady — bez gwiazdek
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2" role="list">
            {ZASADY.map((z) => (
              <li key={z.title}>
                <h3
                  className="font-heading font-semibold"
                  style={{ fontSize: "1.12rem", letterSpacing: "-0.01em", color: "var(--color-ink)" }}
                >
                  {z.title}
                </h3>
                <p className="mt-1.5" style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "46ch" }}>
                  {z.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      {/* ── RYNEK 2026 — kontekst (SEO/AEO: tabele = format #1 cytowań) ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Ile kosztuje strona internetowa na rynku?
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Orientacyjne widełki rynkowe w Polsce (sierpień 2026, ceny netto) — żebyś mógł nasze
            ceny z czymś porównać.
          </p>
        </FadeUp>
        <FadeUp inView delay={0.14}>
          <div className="mt-8">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Orientacyjne ceny stron internetowych w Polsce w 2026 roku według typu strony
              </caption>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-line)" }}>
                  <th
                    scope="col"
                    className="label-koda pb-3"
                    style={{ color: "var(--color-ink-muted)", fontWeight: 700 }}
                  >
                    Typ strony
                  </th>
                  <th
                    scope="col"
                    className="label-koda pb-3 text-right"
                    style={{ color: "var(--color-ink-muted)", fontWeight: 700 }}
                  >
                    Koszt (rynek PL)
                  </th>
                </tr>
              </thead>
              <tbody>
                {PRICE_BY_TYPE.map((row) => (
                  <tr key={row.type} style={{ borderBottom: "1px solid var(--color-line)" }}>
                    <td
                      className="py-4 pr-4"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.98rem,1.1vw,1.1rem)",
                        color: "var(--color-ink)",
                      }}
                    >
                      {row.type}
                    </td>
                    <td
                      className="py-4 text-right font-heading font-semibold whitespace-nowrap"
                      style={{ fontSize: "clamp(0.98rem,1.1vw,1.1rem)", color: "var(--color-ink)" }}
                    >
                      {row.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </div>

      {/* ── Kto tworzy stronę (porównanie) ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Kreator, freelancer czy agencja — co wybrać?
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Cena zależy nie tylko od typu strony, ale i od tego, kto ją buduje. Każda opcja ma inny
            koszt, inny efekt i inne ryzyko.
          </p>
        </FadeUp>
        <FadeUp inView delay={0.14}>
          <div className="mt-8 hidden md:block">
            <table className="w-full border-collapse text-left">
              <caption className="sr-only">
                Porównanie sposobów wykonania strony internetowej: kreator, freelancer, studio i
                agencja — koszt, co dostajesz i na co uważać
              </caption>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-line)" }}>
                  {["Sposób wykonania", "Koszt", "Co dostajesz", "Na co uważać"].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="label-koda pb-3"
                      style={{ color: "var(--color-ink-muted)", fontWeight: 700 }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {WORK_MODELS.map((m) => (
                  <tr key={m.name} style={{ borderBottom: "1px solid var(--color-line)" }}>
                    <th
                      scope="row"
                      className="py-4 pr-5 align-top font-heading"
                      style={{ fontSize: "0.98rem", color: "var(--color-ink)", fontWeight: 600 }}
                    >
                      {m.name}
                    </th>
                    <td
                      className="py-4 pr-5 align-top"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--color-ink)",
                      }}
                    >
                      {m.cost}
                    </td>
                    <td
                      className="py-4 pr-5 align-top"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {m.get}
                    </td>
                    <td
                      className="py-4 align-top"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {m.watch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>

        {/* Mobile: te same dane jako karty — zero poziomego scrolla */}
        <ul className="mt-8 flex flex-col gap-4 md:hidden" role="list">
          {WORK_MODELS.map((m, i) => (
            <li
              key={m.name}
              className="rounded-2xl p-5"
              style={{ border: "1px solid var(--color-line)" }}
            >
              <FadeUp inView delay={0.04 * i}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span
                    className="font-heading font-semibold"
                    style={{ fontSize: "1.05rem", color: "var(--color-ink)" }}
                  >
                    {m.name}
                  </span>
                  <span
                    className="font-heading font-semibold"
                    style={{ fontSize: "0.95rem", color: "var(--color-pink-bright)" }}
                  >
                    {m.cost}
                  </span>
                </div>
                <dl className="mt-3 flex flex-col gap-2">
                  <div>
                    <dt className="label-koda" style={{ color: "var(--color-ink-muted)" }}>
                      Co dostajesz
                    </dt>
                    <dd
                      className="mt-0.5"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--color-ink)",
                      }}
                    >
                      {m.get}
                    </dd>
                  </div>
                  <div>
                    <dt className="label-koda" style={{ color: "var(--color-ink-muted)" }}>
                      Na co uważać
                    </dt>
                    <dd
                      className="mt-0.5"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.95rem",
                        color: "var(--color-ink-muted)",
                      }}
                    >
                      {m.watch}
                    </dd>
                  </div>
                </dl>
              </FadeUp>
            </li>
          ))}
        </ul>
      </div>

      {/* ── Co wpływa na cenę ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Co wpływa na cenę strony?
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2" role="list">
            {COST_DRIVERS.map((d) => (
              <li key={d.title}>
                <h3
                  className="font-heading font-semibold"
                  style={{
                    fontSize: "1.12rem",
                    letterSpacing: "-0.01em",
                    color: "var(--color-ink)",
                  }}
                >
                  {d.title}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "44ch" }}
                >
                  {d.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp inView delay={0.12}>
          <p className="mt-10" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Zobacz, co realnie dostajesz w naszych{" "}
            <Link
              href="/realizacje"
              className="font-medium underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
              style={{ color: "var(--color-ink)" }}
            >
              realizacjach
            </Link>{" "}
            i pełen zakres{" "}
            <Link
              href="/uslugi"
              className="font-medium underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
              style={{ color: "var(--color-ink)" }}
            >
              usług
            </Link>{" "}
            — w tym{" "}
            <Link
              href="/uslugi/strony-3d"
              className="font-medium underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
              style={{ color: "var(--color-ink)" }}
            >
              strony 3D i animowane
            </Link>
            .
          </p>
        </FadeUp>
      </div>

      {/* ── Mini-FAQ (zasila FAQPage JSON-LD; answer-first pod AI) ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Najczęstsze pytania o cenę strony
          </h2>
        </FadeUp>
        <div className="mt-8 flex flex-col">
          {CENNIK_FAQ.map((f, i) => (
            <FadeUp inView key={f.q} delay={0.04 * i}>
              <div
                style={{
                  borderTop: i === 0 ? "1px solid var(--color-line)" : undefined,
                  borderBottom: "1px solid var(--color-line)",
                  paddingTop: "clamp(20px,2.4vw,30px)",
                  paddingBottom: "clamp(20px,2.4vw,30px)",
                }}
              >
                <h3
                  className="font-heading font-semibold"
                  style={{ fontSize: "clamp(1.1rem,1.6vw,1.35rem)", color: "var(--color-ink)" }}
                >
                  {f.q}
                </h3>
                <p className="mt-3" style={{ ...bodyStyle, maxWidth: "70ch" }}>
                  {f.a}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
