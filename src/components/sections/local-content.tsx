import Link from "next/link";
import { FadeUp } from "@/components/motion";
import { PhoneLink } from "@/components/ui/phone-link";
import { getLocation, type Location } from "@/lib/locations";

/* ════════════════════════════════════════════════════════════════════════════
   Treść strony lokalnej (`/strony-internetowe-<miasto>/`).

   Szkielet jest wspólny, ale KAŻDY akapit pochodzi z lib/locations.ts i jest
   pisany osobno dla danego miasta — patrz komentarz o doorway pages w tamtym
   pliku. Tu siedzi wyłącznie prezentacja.

   Układ celowo bez kart-kontenerów: hairline'y i typografia, jak na /cennik,
   /uslugi i /uslugi/strony-3d — jeden język wizualny w całym serwisie.

   LCP: akapit wiodący wchodzi CZYSTYM CSS-em (klasa .ph-lead-in), a nie
   FadeUp inView — komponent motion czeka na hydrację, przez co największy
   element strony pojawiał się dopiero po JS (audyt CWV 2026-08-26).
   ════════════════════════════════════════════════════════════════════════════ */

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
const h3Style: React.CSSProperties = {
  fontSize: "1.12rem",
  letterSpacing: "-0.01em",
  color: "var(--color-ink)",
};

/** Pakiety — liczby identyczne z /cennik/, lib/cennik-data.ts i llms.txt. */
const PAKIETY: { name: string; price: string; time: string; desc: string }[] = [
  {
    name: "Landing page",
    price: "od 2 900 zł",
    time: "1–2 tygodnie",
    desc: "Jedna strona pod jeden cel: kampanię, nowy produkt albo pojedynczą usługę.",
  },
  {
    name: "Strona wizytówka",
    price: "od 3 900 zł",
    time: "2–3 tygodnie",
    desc: "Kilka podstron: oferta, o firmie, kontakt. Standard dla małej firmy usługowej.",
  },
  {
    name: "Strona firmowa",
    price: "od 6 900 zł",
    time: "3–5 tygodni",
    desc: "Rozbudowana oferta, realizacje, blog albo aktualności. Dla firm z szerszym zakresem.",
  },
  {
    name: "Projekt premium",
    price: "od 12 900 zł",
    time: "5–8 tygodni",
    desc: "Indywidualne animacje i grafika 3D w przeglądarce. Kiedy strona ma robić różnicę.",
  },
];

/** Co wchodzi w cenę — odpowiedź na najczęstsze „a co ja właściwie dostaję”. */
const W_CENIE: { name: string; desc: string }[] = [
  {
    name: "Projekt graficzny pod Twoją firmę",
    desc: "Układ, typografia i kolory dobrane do tego, co sprzedajesz — nie kupiony motyw z galerii szablonów.",
  },
  {
    name: "Kod pisany od zera",
    desc: "Bez WordPressa, budowniczych stron i wtyczek. Strona robi dokładnie to, co ma robić, i nic ponadto.",
  },
  {
    name: "Wersja na telefon i tablet",
    desc: "Projektowana osobno, nie „ściśnięta” z wersji na komputer. Ruch z telefonów to dziś zwykle ponad połowa odwiedzin.",
  },
  {
    name: "Techniczne SEO",
    desc: "Struktura nagłówków, opisy dla wyszukiwarki, dane strukturalne firmy, mapa witryny i szybkość mierzona w Core Web Vitals.",
  },
  {
    name: "Formularz kontaktowy i analityka",
    desc: "Zgłoszenia trafiają na Twoją skrzynkę, a Ty widzisz, ile osób wchodzi i skąd. Bez płatnych narzędzi na start.",
  },
  {
    name: "Uruchomienie i dostępy",
    desc: "Wdrożenie na serwerze, podpięcie domeny, certyfikat, a po starcie pełne dostępy przekazane Tobie.",
  },
  {
    name: "Poprawki po pokazaniu projektu",
    desc: "Zakres poprawek ustalamy w umowie z góry, żeby żadna strona nie kończyła się kłótnią o „jeszcze jedną zmianę”.",
  },
  {
    name: "Opieka po starcie — opcjonalnie",
    desc: "Aktualizacje, kopie zapasowe, bezpieczeństwo i drobne zmiany od 149 zł miesięcznie. Twoja decyzja, nie warunek.",
  },
];

/** Co realnie przesuwa cenę — najczęstsze pytanie po zobaczeniu widełek. */
const CO_WPLYWA: { name: string; desc: string }[] = [
  {
    name: "Liczba podstron i sekcji",
    desc: "Jedna strona sprzedażowa to inny nakład pracy niż serwis z ofertą podzieloną na kilkanaście usług.",
  },
  {
    name: "Treść i zdjęcia",
    desc: "Jeśli masz gotowe teksty i materiały, projekt idzie szybciej. Jeśli nie — możemy je przygotować, i to widać w wycenie.",
  },
  {
    name: "Animacje i grafika 3D",
    desc: "Indywidualne animacje albo interaktywna scena 3D to osobna praca projektowa. Efekt bywa wart różnicy, ale mówimy o niej wprost.",
  },
  {
    name: "Funkcje poza standardem",
    desc: "Wersje językowe, kalkulator, konfigurator, integracja z systemem, który już masz — każda z nich ma swoją wycenę.",
  },
];

/* Co poza samą stroną decyduje o widoczności lokalnej. Sekcja jest tu z dwóch
   powodów: to najczęstsze realne pytanie klienta po zamówieniu strony, a
   jednocześnie zwarty, cytowalny materiał dla wyszukiwarek AI odpowiadających
   na pytanie „jak być widocznym w Google lokalnie”. Nic tu nie obiecujemy —
   wymieniamy rzeczy, które klient może zrobić także bez nas. */
const CO_DECYDUJE: { name: string; desc: string }[] = [
  {
    name: "Wizytówka Google",
    desc: "Bezpłatny profil firmy, który decyduje o mapie i wynikach lokalnych. Bez niego strona startuje z ręką związaną za plecami — założenie zajmuje kwadrans.",
  },
  {
    name: "Opinie klientów",
    desc: "Najmocniejszy sygnał, na który masz bezpośredni wpływ. Kilkanaście prawdziwych opinii potrafi zrobić więcej niż miesiące pracy nad samą stroną.",
  },
  {
    name: "Ta sama nazwa, adres i telefon wszędzie",
    desc: "W wizytówce, na stronie i w katalogach. Rozjazd w danych to najczęstszy powód, dla którego lokalna firma nie wychodzi tam, gdzie powinna.",
  },
  {
    name: "Treść odpowiadająca na pytania",
    desc: "Strony, które wprost odpowiadają na pytania klientów — ile to kosztuje, jak długo trwa, co jest w cenie — wygrywają dziś także w odpowiedziach generowanych przez sztuczną inteligencję.",
  },
];

/** Etapy pracy — takie same jak w procesie opisanym na stronie głównej. */
const ETAPY: { step: string; title: string; desc: string }[] = [
  {
    step: "01",
    title: "Rozmowa i wycena",
    desc: "Mówisz, co firma ma osiągnąć. W 24 godziny wracamy z zakresem i ceną, które trafiają do umowy.",
  },
  {
    step: "02",
    title: "Projekt do akceptacji",
    desc: "Najpierw widzisz, jak strona ma wyglądać i działać. Kod powstaje dopiero po Twojej zgodzie.",
  },
  {
    step: "03",
    title: "Kodowanie",
    desc: "Piszemy stronę od zera — bez szablonów i wtyczek. Szybkość, telefon i techniczne SEO w standardzie.",
  },
  {
    step: "04",
    title: "Start i opieka",
    desc: "Uruchomienie, przekazanie pełnych dostępów, a potem — jeśli chcesz — aktualizacje i rozwój.",
  },
];

export function LocalContent({ location }: { location: Location }) {
  const nearby = location.nearby
    .map((slug) => getLocation(slug))
    .filter((l): l is Location => Boolean(l));

  return (
    <section data-header-theme="dark" data-canvas="base" className="relative">
      {/* ── Answer-first (BLUF): cena + termin + kontakt w pierwszym akapicie.
          To jest pasaż, który cytują silniki AI, i pierwsze, co czyta człowiek. ── */}
      <div className="container-koda" style={{ paddingBottom: "clamp(40px, 6vw, 96px)" }}>
        <div className="ph-lead-in" style={{ animationDelay: "0.1s" }}>
          <div
            style={{
              borderLeft: "3px solid var(--color-pink-bright)",
              paddingLeft: "clamp(18px, 2.5vw, 32px)",
              maxWidth: "68ch",
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
              {location.lead}
            </p>
            <p className="mt-5" style={{ ...bodyStyle, maxWidth: "64ch" }}>
              Zadzwoń albo napisz — wycena jest bezpłatna i niezobowiązująca.{" "}
              <PhoneLink
                className="font-heading font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                style={{ color: "var(--color-ink)" }}
              />
            </p>
          </div>
        </div>
      </div>

      {/* ── Wstęp o TYM mieście ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="dla-kogo-piszemy" className="font-heading font-semibold" style={h2Style}>
            Strona internetowa dla firmy {location.inCity} — co to zmienia
          </h2>
        </FadeUp>
        <div className="mt-6 flex flex-col gap-5">
          {location.intro.map((p, i) => (
            <FadeUp inView key={p.slice(0, 24)} delay={0.06 * i}>
              <p style={{ ...bodyStyle, maxWidth: "72ch" }}>{p}</p>
            </FadeUp>
          ))}
        </div>
      </div>

      {/* ── Branże ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="branze" className="font-heading font-semibold" style={h2Style}>
            Dla jakich firm {location.inCity} robimy strony
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2" role="list">
            {location.industries.map((b) => (
              <li key={b.name}>
                <h3 className="font-heading font-semibold" style={h3Style}>
                  {b.name}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "48ch" }}
                >
                  {b.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      {/* ── Ceny: konkretne liczby. Żadna agencja z pierwszej dziesiątki na to
          zapytanie nie podaje cen — to jest nasz wyróżnik i najczęściej
          cytowany fragment przez wyszukiwarki AI. ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="cennik" className="font-heading font-semibold" style={h2Style}>
            Ile kosztuje strona internetowa {location.inCity}
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "62ch" }}>
            Ceny są te same niezależnie od miejscowości. Podajemy je wprost, bo „wycena
            indywidualna” bez żadnej liczby to strata czasu obu stron.
          </p>
        </FadeUp>
        <div className="mt-9 flex flex-col">
          {PAKIETY.map((p, i) => (
            <FadeUp inView key={p.name} delay={0.05 * i}>
              <div
                className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-8"
                style={{
                  borderTop: i === 0 ? "1px solid var(--color-line)" : undefined,
                  borderBottom: "1px solid var(--color-line)",
                  paddingTop: "clamp(18px,2.2vw,26px)",
                  paddingBottom: "clamp(18px,2.2vw,26px)",
                }}
              >
                <h3
                  className="font-heading font-semibold sm:w-[38%] sm:shrink-0"
                  style={{ ...h3Style, fontSize: "clamp(1.05rem,1.5vw,1.25rem)" }}
                >
                  {p.name} <span style={{ color: "var(--color-pink-bright)" }}>{p.price}</span>{" "}
                  <span
                    className="font-body font-normal"
                    style={{ color: "var(--color-ink-muted)", fontSize: "0.92rem" }}
                  >
                    netto · {p.time}
                  </span>
                </h3>
                <p style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "52ch" }}>{p.desc}</p>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp inView delay={0.1}>
          <Link
            href="/cennik"
            className="mt-8 inline-flex font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
            style={{ color: "var(--color-ink)" }}
          >
            Zobacz pełny cennik i zakres pakietów →
          </Link>
        </FadeUp>
      </div>

      {/* ── Co w cenie ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="co-w-cenie" className="font-heading font-semibold" style={h2Style}>
            Co dostajesz w cenie
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2" role="list">
            {W_CENIE.map((w) => (
              <li key={w.name}>
                <h3 className="font-heading font-semibold" style={h3Style}>
                  {w.name}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "48ch" }}
                >
                  {w.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      {/* ── Co wpływa na cenę ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="co-wplywa-na-cene" className="font-heading font-semibold" style={h2Style}>
            Od czego zależy cena
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2" role="list">
            {CO_WPLYWA.map((c) => (
              <li key={c.name}>
                <h3 className="font-heading font-semibold" style={h3Style}>
                  {c.name}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "48ch" }}
                >
                  {c.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp inView delay={0.12}>
          <p className="mt-8" style={{ ...bodyStyle, maxWidth: "70ch" }}>
            <strong style={{ color: "var(--color-ink)", fontWeight: 600 }}>
              Czego nie robimy:
            </strong>{" "}
            sklepów internetowych, systemów płatności ani stron na WordPressie. Nie dlatego, że się
            nie da — po prostu robimy jedną rzecz i chcemy ją robić dobrze. Jeśli Twój projekt to
            sprzedaż online, powiemy to na pierwszej rozmowie, zamiast brać zlecenie i uczyć się na
            Twój koszt.
          </p>
        </FadeUp>
      </div>

      {/* ── Proces ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="proces" className="font-heading font-semibold" style={h2Style}>
            Jak wygląda praca nad stroną
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "62ch" }}>
            {location.proximity}
          </p>
        </FadeUp>
        <FadeUp inView delay={0.12}>
          <ol className="mt-9 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2">
            {ETAPY.map((e) => (
              <li key={e.step}>
                <p className="label-koda mb-2" style={{ color: "var(--color-pink-bright)" }}>
                  {e.step}
                </p>
                <h3 className="font-heading font-semibold" style={h3Style}>
                  {e.title}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "46ch" }}
                >
                  {e.desc}
                </p>
              </li>
            ))}
          </ol>
        </FadeUp>
      </div>

      {/* ── Widoczność lokalna: uczciwie, gdzie kończy się rola strony ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="widocznosc" className="font-heading font-semibold" style={h2Style}>
            Widoczność w Google {location.inCity}
          </h2>
        </FadeUp>
        <div className="mt-6 flex flex-col gap-5">
          {location.whyLocal.map((p, i) => (
            <FadeUp inView key={p.slice(0, 24)} delay={0.06 * i}>
              <p style={{ ...bodyStyle, maxWidth: "72ch" }}>{p}</p>
            </FadeUp>
          ))}
        </div>
        <FadeUp inView delay={0.12}>
          <ul className="mt-9 grid grid-cols-1 gap-x-10 gap-y-7 sm:grid-cols-2" role="list">
            {CO_DECYDUJE.map((c) => (
              <li key={c.name}>
                <h3 className="font-heading font-semibold" style={h3Style}>
                  {c.name}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "48ch" }}
                >
                  {c.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
        <FadeUp inView delay={0.14}>
          <p className="mt-8" style={{ ...bodyStyle, maxWidth: "72ch" }}>
            Jeśli zależy Ci na stronie, która wyróżnia się mocniej niż konkurencja, zobacz{" "}
            <Link
              href="/uslugi/strony-3d"
              className="underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
              style={{ color: "var(--color-ink)" }}
            >
              strony 3D i animowane
            </Link>{" "}
            albo{" "}
            <Link
              href="/realizacje"
              className="underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
              style={{ color: "var(--color-ink)" }}
            >
              nasze realizacje
            </Link>
            .
          </p>
        </FadeUp>
      </div>

      {/* ── FAQ (zasila FAQPage JSON-LD strony) ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 id="faq" className="font-heading font-semibold" style={h2Style}>
            Częste pytania — strony internetowe {location.city}
          </h2>
        </FadeUp>
        <div className="mt-8 flex flex-col">
          {location.faq.map((f, i) => (
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

      {/* ── Sąsiednie lokalizacje: linkowanie wewnętrzne między stronami
          lokalnymi (klaster tematyczny — każda strona ma wejście z pozostałych,
          więc żadna nie zostaje sierotą w strukturze witryny). ── */}
      {nearby.length > 0 && (
        <div className="container-koda" style={sectionDivider}>
          <FadeUp inView>
            <h2 id="okolica" className="font-heading font-semibold" style={h2Style}>
              Robimy strony także w okolicy
            </h2>
          </FadeUp>
          <FadeUp inView delay={0.08}>
            <ul className="mt-7 flex flex-wrap gap-x-8 gap-y-4" role="list">
              {nearby.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/${n.slug}/`}
                    className="font-heading text-[1.02rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                    style={{ color: "var(--color-ink)" }}
                  >
                    Strony internetowe {n.city} →
                  </Link>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>
      )}
    </section>
  );
}
