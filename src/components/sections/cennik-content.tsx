import Link from "next/link";
import { FadeUp } from "@/components/motion";

/* ════════════════════════════════════════════════════════════════════════════
   /cennik — filar treści „Ile kosztuje strona internetowa".

   Cel SEO/AEO: wygrać frazy „ile kosztuje strona internetowa / cennik stron",
   które mają najwyższą intencję zakupową i są #1 formatem cytowań przez AI
   (tabele + konkretne liczby). Strategia uzgodniona z Natanem:
   • WIDEŁKI RYNKOWE (edukacja, ogólny rynek PL 2026) — NIE cennik KODA,
   • KODA dalej bez sztywnego cennika → wycena indywidualna, bezpłatna,
   • answer-first (BLUF) + tabele + mini-FAQ = maksymalna „ekstrahowalność" dla AI.

   Liczby zgruntowane researchem rynku PL VI.2026 (zdobywcysieci, Growto, WPStore,
   home.pl, websitestyle, seomantyczny i in.) — orientacyjne widełki netto. Author
   w schema = KODA Studio (organizacja), NIE osoba (zgodnie z decyzją: mówimy „my").
   ════════════════════════════════════════════════════════════════════════════ */

export interface CennikFaq {
  q: string;
  a: string;
}

/** Mini-FAQ — jedno źródło prawdy: renderuje sekcję poniżej ORAZ FAQPage JSON-LD
 *  na /cennik (app/cennik/page.tsx). Odpowiedzi answer-first (pod ekstrakcję AI). */
export const CENNIK_FAQ: CennikFaq[] = [
  {
    q: "Ile kosztuje strona internetowa dla małej firmy?",
    a: "Solidna strona firmowa dla małej lub średniej firmy kosztuje na rynku najczęściej od 3 000 do 8 000 zł netto. Prosta wizytówka zaczyna się od ok. 2 000 zł, a rozbudowana strona z indywidualnym projektem, animacjami czy 3D — od kilkunastu tysięcy. Konkretną kwotę dla Twojego projektu podajemy po krótkiej rozmowie, bezpłatnie i bez zobowiązań.",
  },
  {
    q: "Czy tania strona z kreatora się opłaca?",
    a: "Na start jest tania (zwykle 100–500 zł rocznie za abonament), ale płacisz za to inaczej: szablonowym wyglądem jak u tysięcy innych firm, słabszym SEO, wolniejszym ładowaniem i trudną rozbudową. Jeśli strona ma realnie pozyskiwać klientów, autorski kod zwykle zwraca się szybciej niż pozorna oszczędność na starcie.",
  },
  {
    q: "Ile kosztuje strona z animacjami albo w 3D?",
    a: "To nasza specjalność i zwykle zaczyna się od kilkunastu tysięcy złotych — animacje i sceny 3D to dodatkowy czas projektu i programowania, ale też efekt „wow”, który wyróżnia markę. Zakres najłatwiej ocenić, oglądając nasze realizacje, a dokładną wycenę przygotujemy pod Twój pomysł.",
  },
  {
    q: "Płaci się za stronę raz, czy co miesiąc?",
    a: "Za zaprojektowanie i zbudowanie strony płacisz jednorazowo — strona, domena i wszystkie pliki są Twoje, a po starcie przekazujemy Ci pełne dostępy. Dochodzą tylko niewielkie, stałe koszty utrzymania (domena i hosting) oraz — opcjonalnie — opieka techniczna w stałej, rozsądnej opłacie.",
  },
  {
    q: "Dlaczego nie macie gotowego cennika?",
    a: "Bo uczciwa cena zależy od zakresu: liczby podstron, treści, funkcji i terminu. Zamiast podawać kwotę „z sufitu”, wolimy poznać Twój projekt i podać konkret, który zapisujemy w umowie — bez ukrytych kosztów później. Wycena jest bezpłatna i bez zobowiązań.",
  },
];

/** Widełki rynkowe wg typu strony (rynek PL 2026, netto, orientacyjnie). */
const PRICE_BY_TYPE: { type: string; range: string }[] = [
  { type: "One page / prosta strona", range: "1 000 – 2 500 zł" },
  { type: "Landing page", range: "1 500 – 3 000 zł" },
  { type: "Strona wizytówka", range: "2 000 – 4 000 zł" },
  { type: "Strona firmowa (mała / średnia firma)", range: "3 000 – 8 000 zł" },
  { type: "Rozbudowana — z animacjami i 3D", range: "od ok. 10 000 zł" },
];

/** Porównanie sposobów wykonania (rynek PL 2026). */
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
    get: "Jedna osoba robi całość",
    watch: "Brak zastępstwa, zmienny czas odpowiedzi, różna jakość i wsparcie",
  },
  {
    name: "Studio / butik (jak KODA)",
    cost: "3 000 – 15 000 zł",
    get: "Projekt + autorski kod + opieka, zakres i termin w umowie",
    watch: "Warto wybrać wykonawcę, który zostaje po starcie",
  },
  {
    name: "Duża agencja z PM-em",
    cost: "15 000 – 50 000 zł",
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
    title: "Dostępność (WCAG)",
    desc: "Strona, z której korzysta każdy — także na telefonie i z czytnikiem ekranu.",
  },
  {
    title: "Opieka po starcie",
    desc: "Aktualizacje, bezpieczeństwo i rozwój strony razem z firmą — opcjonalnie, w stałej opłacie.",
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

export function CennikContent() {
  return (
    <section data-header-theme="dark" data-canvas="base" className="relative">
      <div className="container-koda" style={{ paddingBottom: "clamp(40px, 6vw, 96px)" }}>
        {/* ── Answer-first (BLUF) — bezpośrednia odpowiedź dla Google i AI ── */}
        <FadeUp inView>
          <div
            style={{
              borderLeft: "3px solid var(--color-pink-bright)",
              paddingLeft: "clamp(18px, 2.5vw, 32px)",
              maxWidth: "62ch",
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
              Strona internetowa dla firmy w Polsce kosztuje najczęściej od{" "}
              <strong style={{ color: "var(--color-ink)" }}>3 000 do 15 000 zł</strong>. Prosta
              wizytówka zaczyna się od ok. 2 000 zł, a rozbudowana strona z indywidualnym projektem,
              animacjami czy 3D — od kilkunastu tysięcy. Ostateczna cena zależy od zakresu: liczby
              podstron, treści, funkcji i tego, kto ją tworzy.
            </p>
            <p className="mt-4" style={{ ...bodyStyle, maxWidth: "62ch" }}>
              Poniżej znajdziesz orientacyjne widełki rynkowe na 2026 rok i to, co realnie wpływa na
              cenę. W KODA nie mamy sztywnego cennika — każdy projekt wyceniamy indywidualnie i{" "}
              <Link
                href="/kontakt"
                className="font-medium underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                style={{ color: "var(--color-ink)" }}
              >
                bezpłatnie
              </Link>
              .
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ── Tabela 1 — widełki wg typu strony ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Ile kosztuje strona internetowa według typu?
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Orientacyjne widełki rynkowe w Polsce (2026, ceny netto). To nie cennik KODA — pokazują,
            czego ogólnie można się spodziewać przy różnym zakresie projektu.
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

      {/* ── Tabela 2 — kto tworzy stronę (porównanie) ── */}
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
        {/* Desktop (md+): tabela — czytają ją też crawlery i silniki AI (struktura
            porównawcza = format #1 cytowań). Bez min-width: na <md zastępują ją karty. */}
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

        {/* Mobile (<md): te same dane jako czytelne karty — zero poziomego scrolla */}
        <ul className="mt-8 flex flex-col gap-4 md:hidden" role="list">
          {WORK_MODELS.map((m, i) => (
            <FadeUp inView key={m.name} delay={0.04 * i}>
              <li className="rounded-2xl p-5" style={{ border: "1px solid var(--color-line)" }}>
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
              </li>
            </FadeUp>
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
      </div>

      {/* ── Koszty utrzymania ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Ile kosztuje utrzymanie strony?
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Po wdrożeniu zostają tylko niewielkie, stałe koszty. Łącznie to zwykle{" "}
            <strong style={{ color: "var(--color-ink)" }}>500 – 1 500 zł rocznie</strong>:
          </p>
        </FadeUp>
        <FadeUp inView delay={0.14}>
          <ul className="mt-6 flex flex-col gap-3" role="list" style={{ maxWidth: "60ch" }}>
            {[
              ["Domena", "ok. 50 – 150 zł / rok"],
              ["Hosting", "ok. 200 – 600 zł / rok (u nas lekki kod = niższe koszty)"],
              [
                "Opieka techniczna",
                "opcjonalnie, wg umowy — aktualizacje, bezpieczeństwo, drobne zmiany",
              ],
            ].map(([k, v]) => (
              <li
                key={k}
                className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                style={{ borderBottom: "1px solid var(--color-line)", paddingBottom: "0.75rem" }}
              >
                <span className="font-heading font-semibold" style={{ color: "var(--color-ink)" }}>
                  {k}
                </span>
                <span style={{ ...bodyStyle, fontSize: "0.98rem" }}>{v}</span>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      {/* ── Transparentność: dlaczego nie ma sztywnego cennika ── */}
      <div className="container-koda" style={sectionDivider}>
        <div className="grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-12">
          <div className="md:col-span-5">
            <FadeUp inView>
              <h2 className="font-heading font-semibold" style={h2Style}>
                Dlaczego nie podajemy ceny „z sufitu”
              </h2>
            </FadeUp>
          </div>
          <div className="md:col-span-7">
            <FadeUp inView delay={0.08}>
              <p style={{ ...bodyStyle, maxWidth: "56ch" }}>
                Każdy biznes jest inny, więc uczciwa cena zależy od zakresu. Zamiast obiecywać
                kwotę, której potem trzeba „pilnować”, poznajemy Twój projekt i podajemy konkret —
                który zapisujemy w umowie razem z terminem. Bez ukrytych kosztów później.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.14}>
              <p
                className="mt-5"
                style={{ ...bodyStyle, color: "var(--color-ink)", maxWidth: "56ch" }}
              >
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
        </div>
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
