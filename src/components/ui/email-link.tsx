import { CONTACT } from "@/lib/constants";

/**
 * Link `mailto:` odporny na Cloudflare Email Address Obfuscation.
 *
 * CF (Scrape Shield) przepisywał każdy `<a href="mailto:…">` w HTML na
 * `/cdn-cgi/l/email-protection#…` + dekoder JS. Skutki: bez JS link jest MARTWY,
 * a crawlery (Google/Bing/boty AI) widzą „[email protected]” zamiast adresu —
 * co psuje spójność NAP (local SEO) i cytowalność kontaktu w AI search.
 * Udokumentowany opt-out Cloudflare to region w komentarzach HTML
 * `<!--email_off--> … <!--/email_off-->`. JSX nie potrafi emitować komentarzy,
 * więc CAŁĄ kotwicę renderujemy przez dangerouslySetInnerHTML.
 *
 * Użycie: className trafia na <a> (podkreślenia/hover), a style — na wrapper
 * <span> (tylko właściwości DZIEDZICZONE: color, fontFamily, fontSize itp.).
 * `label` domyślnie = adres e-mail. Adres w JSON-LD pozostaje bezpieczny
 * niezależnie od tego komponentu (CF nie dotyka <script type="application/ld+json">).
 */
export function EmailLink({
  className,
  style,
  label,
}: {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}) {
  const text = label ?? CONTACT.email;
  const cls = className ? ` class="${className}"` : "";
  return (
    <span
      style={style}
      dangerouslySetInnerHTML={{
        __html: `<!--email_off--><a href="mailto:${CONTACT.email}"${cls}>${text}</a><!--/email_off-->`,
      }}
    />
  );
}
