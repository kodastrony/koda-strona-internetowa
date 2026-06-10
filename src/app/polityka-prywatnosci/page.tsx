import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description: "Polityka prywatności i ochrony danych osobowych KODA Studio.",
  robots: { index: true, follow: true },
  alternates: { canonical: "/polityka-prywatnosci/" },
};

export default function PolitykaPrywatnosciPage() {
  return (
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
          Ochrona danych<span className="text-pink">.</span>
        </h1>

        <div className="font-body text-[16px] leading-relaxed text-[var(--color-ink-muted)]">
          <p className="mb-10 text-[14px] text-[var(--color-ink-faint)]">
            Ostatnia aktualizacja: 7 czerwca 2026
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            1. Administrator danych
          </h2>
          <p>
            Administratorem Twoich danych osobowych jest <strong>KODA Studio</strong>, działający
            pod adresem e-mail{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-pink underline underline-offset-4">
              {CONTACT.email}
            </a>
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
            <li>opcjonalnie: pliki (np. brief, logo, zdjęcia — PDF, DOC, JPG, ZIP — łącznie do 10 MB).</li>
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
            Strona <strong>kodastrony.pl</strong> nie używa własnych plików cookie do celów
            śledzenia ani analitycznych. Pliki cookie mogą być stosowane przez infrastrukturę
            serwera (OVH) w celach technicznych.
          </p>

          <h2 className="mt-10 mb-3 font-heading text-[1.3rem] font-bold text-[var(--color-ink)]">
            8. Kontakt
          </h2>
          <p>
            W sprawach ochrony danych osobowych skontaktuj się z nami pod adresem:{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-pink underline underline-offset-4">
              {CONTACT.email}
            </a>
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
  );
}
