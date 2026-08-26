import { CONTACT } from "@/lib/constants";

/**
 * Klikalny numer telefonu (`tel:`) — wspólny komponent, żeby numer, format
 * i href były IDENTYCZNE w każdym miejscu strony (NAP: hero, menu, /kontakt,
 * stopka, CTABand, Statement, /dziekujemy). Na telefonie tap = połączenie;
 * na desktopie klik otwiera aplikację do dzwonienia (jeśli jest).
 *
 * W przeciwieństwie do e-maila telefon NIE jest ruszany przez Cloudflare
 * Email Obfuscation — zwykła kotwica wystarczy (bez email_off).
 * `label` domyślnie = numer w formacie wyświetlanym ("511 107 468").
 */
export function PhoneLink({
  className,
  style,
  label,
  ariaLabel,
}: {
  className?: string;
  style?: React.CSSProperties;
  label?: React.ReactNode;
  /** Domyślnie „Zadzwoń: 511 107 468" — czytelne dla czytników ekranu. */
  ariaLabel?: string;
}) {
  return (
    <a
      href={CONTACT.phoneHref}
      className={className}
      style={style}
      aria-label={ariaLabel ?? `Zadzwoń: ${CONTACT.phone}`}
    >
      {label ?? CONTACT.phone}
    </a>
  );
}
