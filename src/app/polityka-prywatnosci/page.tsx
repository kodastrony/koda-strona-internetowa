import type { Metadata } from "next";
import Link from "next/link";
import { EmailLink } from "@/components/ui/email-link";
import { LASTMOD } from "@/app/sitemap";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Polityka prywatności",
  description:
    "Polityka prywatności KODA Studio — jakie dane zbiera formularz kontaktowy i rozmowa z asystentem K.O.D.A, po co, na jak długo i jakie masz prawa (RODO). Bez cookies śledzących.",
  path: "/polityka-prywatnosci/",
});

// Jedyna strona non-home, która nie miała breadcrumbu — teraz spójnie z resztą.
const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Polityka prywatności", path: "/polityka-prywatnosci/" },
]);

const WEBPAGE_JSON_LD = webPageLd({
  path: "/polityka-prywatnosci/",
  name: "Polityka prywatności",
  description:
    "Polityka prywatności KODA Studio — jakie dane zbiera formularz kontaktowy i rozmowa z asystentem K.O.D.A, po co, na jak długo i jakie masz prawa (RODO). Bez cookies śledzących.",
  dateModified: LASTMOD["/polityka-prywatnosci/"],
});

export default function PolitykaPrywatnosciPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(WEBPAGE_JSON_LD) }}
      />
    <section
      data-header-theme="dark"
      data-canvas="base"
      className="min-h-svh"
      style={{
        paddingTop: "clamp(100px, 12vw, 160px)",
        paddingBottom: "clamp(60px, 8vw, 120px)",
      }}
    >
      <div className="container-koda mx-auto max-w-[720px]">
        <span className="label-koda mb-6 block">Polityka prywatności</span>
        <h1
          className="font-heading font-semibold text-[var(--color-ink)]"
          style={{
            fontSize: "clamp(2rem, 5vw, 3.5rem)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "2.5rem",
          }}
        >
          Polityka prywatności<span className="text-pink">.</span>
        </h1>

        <div className="font-body text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
          <p className="mb-10 text-[14px] text-[var(--color-ink-faint)]">
            Ostatnia aktualizacja: 3 września 2026
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            1. Administrator danych
          </h2>
          <p>
            Administratorem Twoich danych osobowych jest <strong>KODA Studio</strong>, działający
            pod adresem e-mail{" "}
            <EmailLink className="text-pink underline underline-offset-4" />
            .
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            2. Jakie dane zbieramy
          </h2>
          <p>Poprzez formularz kontaktowy możemy zbierać następujące dane:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>imię i nazwisko,</li>
            <li>adres e-mail,</li>
            <li>numer telefonu,</li>
            <li>opcjonalnie: nazwa firmy,</li>
            <li>opis projektu / wiadomość,</li>
            <li>
              opcjonalnie: pliki (np. brief, logo, zdjęcia — PDF, DOC, JPG, ZIP — łącznie do 10 MB).
            </li>
          </ul>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            3. Cel i podstawa przetwarzania
          </h2>
          <p>
            Dane zbieramy wyłącznie w celu odpowiedzi na Twoje zapytanie i przygotowania oferty
            (podstawa: art. 6 ust. 1 lit. b RODO — niezbędność do wykonania umowy lub podjęcia
            działań przed jej zawarciem, lub art. 6 ust. 1 lit. f — prawnie uzasadniony interes
            administratora w postaci obsługi korespondencji).
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            4. Okres przechowywania
          </h2>
          <p>
            Dane przechowujemy do czasu zakończenia obsługi zapytania lub do momentu wniesienia
            sprzeciwu. W przypadku nawiązania współpracy — przez czas jej trwania oraz wymagany
            przepisami prawa okres po jej zakończeniu.
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            5. Twoje prawa
          </h2>
          <p>Przysługuje Ci prawo do:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>dostępu do swoich danych,</li>
            <li>sprostowania danych,</li>
            <li>usunięcia danych (&bdquo;prawo do bycia zapomnianym&rdquo;),</li>
            <li>ograniczenia przetwarzania,</li>
            <li>przenoszenia danych,</li>
            <li>wniesienia sprzeciwu wobec przetwarzania,</li>
            <li>wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych (UODO).</li>
          </ul>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            6. Przekazywanie danych
          </h2>
          <p>
            Nie sprzedajemy ani nie udostępniamy Twoich danych osobom trzecim w celach
            marketingowych. Dane mogą być przekazywane jedynie podmiotom przetwarzającym (np.
            dostawca poczty e-mail) na podstawie umów powierzenia.
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            7. Pliki cookie
          </h2>
          <p>
            Strony <strong>kodastrony.pl</strong> i <strong>kodastrony.com</strong> nie używają
            własnych plików cookie do celów śledzenia ani analitycznych. Pliki cookie mogą być
            stosowane przez infrastrukturę hostingową (Cloudflare) wyłącznie w celach
            technicznych, np. bezpieczeństwa połączenia. O pamięci przeglądarki używanej przez
            asystenta K.O.D.A piszemy w punkcie 9.
          </p>

          {/* ── Rozdział dopisany 3.09.2026 razem z uruchomieniem asystenta K.O.D.A.
                Robot działa inaczej niż formularz: zapisuje odpowiedzi po każdym
                kroku, także wtedy, gdy rozmowa zostanie przerwana. Przetwarzanie
                zaczyna się więc w chwili udzielenia pierwszej odpowiedzi, a nie
                w chwili kliknięcia „wyślij" — i to musi być tu powiedziane wprost,
                bo nota przy polu kontaktowym w rozmowie odsyła do tej strony. ── */}
          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            8. Rozmowa z asystentem K.O.D.A
          </h2>
          <p>
            Na stronie <strong>kodastrony.com</strong> działa asystent K.O.D.A — rozmowa,
            w której zamiast wypełniać formularz, odpowiadasz na kolejne pytania. Nie jest to
            sztuczna inteligencja, tylko przygotowany wcześniej scenariusz; nie analizujemy
            Twoich odpowiedzi automatycznie ani nie podejmujemy na ich podstawie
            zautomatyzowanych decyzji.
          </p>
          <p className="mt-3">
            <strong>Zapis następuje po każdej odpowiedzi, a nie dopiero na końcu.</strong> Jeśli
            przerwiesz rozmowę i zamkniesz kartę, to, co zdążyłeś podać, zostaje u nas zapisane.
            Robimy tak, żeby nie prosić Cię o te same informacje drugi raz i żeby móc odpowiedzieć
            także wtedy, gdy rozmowa się nie dokończy.
          </p>
          <p className="mt-3">W trakcie rozmowy zapisujemy:</p>
          <ul className="mt-2 list-disc space-y-1 pl-6">
            <li>Twoje odpowiedzi (m.in. imię, adres e-mail, opcjonalnie telefon i nazwę firmy, rodzaj projektu, termin, opis),</li>
            <li>przebieg rozmowy: które kroki zobaczyłeś, w jakiej kolejności i jak długo trwały,</li>
            <li>informację o tym, skąd trafiłeś na stronę (adres odsyłający, parametry kampanii reklamowej),</li>
            <li>podstawowe dane techniczne: rozmiar okna, język przeglądarki, strefa czasowa, kraj i miasto z sieci,</li>
            <li>
              nieodwracalny skrót adresu IP — samego adresu nie przechowujemy; skrót służy wyłącznie
              do ograniczania nadużyć.
            </li>
          </ul>
          <p className="mt-3">
            <strong>Podstawa prawna:</strong> art. 6 ust. 1 lit. b RODO (działania przed zawarciem
            umowy — przygotowanie wyceny, o którą prosisz) oraz art. 6 ust. 1 lit. f RODO (prawnie
            uzasadniony interes: obsługa zapytania, zabezpieczenie przed nadużyciami i mierzenie
            skuteczności własnych działań).
          </p>
          <p className="mt-3">
            <strong>Jak długo:</strong> rozmowa przerwana bez pozostawienia kontaktu — do 90 dni;
            rozmowa z kontaktem, która nie zakończyła się współpracą — do roku; przy nawiązaniu
            współpracy obowiązują terminy z punktu 4. Usuwanie odbywa się automatycznie.
          </p>
          <p className="mt-3">
            <strong>Czego nie robimy:</strong> nie wysyłamy wiadomości marketingowych ani nie
            dzwonimy do osób, które rozmowę przerwały. Odzywamy się wyłącznie w sprawie zapytania,
            z którym sam się do nas zwróciłeś.
          </p>
          <p className="mt-3">
            Dane z rozmowy trafiają na naszą własną infrastrukturę w Cloudflare (baza w regionie
            Europy Wschodniej). Nie są przekazywane innym podmiotom w celach marketingowych.
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            9. Pamięć przeglądarki w rozmowie
          </h2>
          <p>
            Asystent zapamiętuje w Twojej przeglądarce, na którym pytaniu skończyliście rozmowę
            i co już odpowiedziałeś — dzięki temu po powrocie możesz ją dokończyć zamiast
            zaczynać od nowa. Ta pamięć jest niezbędna do działania funkcji, o którą prosisz,
            więc nie wymaga zgody. Możesz ją w każdej chwili usunąć, czyszcząc dane witryny
            w ustawieniach przeglądarki albo wybierając w rozmowie opcję rozpoczęcia od nowa.
          </p>
          <p className="mt-3">
            Osobno traktujemy informację o kampanii reklamowej, z której trafiłeś na stronę.
            Przechowujemy ją dłużej niż jedną wizytę <strong>wyłącznie za Twoją zgodą</strong>,
            o którą pytamy paskiem u dołu ekranu; bez zgody znika wraz z zamknięciem karty,
            a zgodę możesz wycofać odnośnikiem „Zgody" w stopce. Statystyki Google (Analytics
            i Ads) uruchamiamy dopiero po wyrażeniu zgody — do tego czasu nie ładuje się żaden
            skrypt tych usług. Rozmowa działa identycznie niezależnie od Twojej decyzji.
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            10. Kontakt
          </h2>
          <p>
            W sprawach ochrony danych osobowych skontaktuj się z nami pod adresem:{" "}
            <EmailLink className="text-pink underline underline-offset-4" />
          </p>
        </div>

        <div className="mt-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-body text-[14px] text-[var(--color-ink-muted)] transition-colors duration-300 hover:text-pink"
          >
            ← Wróć na stronę główną
          </Link>
        </div>
      </div>
    </section>
    </>
  );
}
