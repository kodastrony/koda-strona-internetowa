import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CennikContent, CENNIK_FAQ } from "@/components/sections/cennik-content";
import { CTABand } from "@/components/sections/cta-band";
import { SITE_CONFIG } from "@/lib/constants";
import { LASTMOD } from "@/app/sitemap";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Cennik stron internetowych 2026 — ceny KODA",
  description:
    "Landing od 2 900 zł, wizytówka od 3 900 zł, strona firmowa od 6 900 zł, premium 3D od 12 900 zł netto. Opieka od 149 zł/mc. Pełny cennik KODA + widełki rynku 2026.",
  path: "/cennik/",
});

// Article — sygnał E-E-A-T + kwalifikacja do cytowań AI. Autor = KODA Studio
// (organizacja, NIE osoba — zgodnie z decyzją „mówimy »my«, bez imion").
const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  // @id — FAQPage niżej i WebPage referencjonują ten węzeł (spójny graf strony).
  "@id": `${SITE_CONFIG.url}/cennik/#article`,
  headline: "Cennik stron internetowych 2026 — ceny KODA i widełki rynkowe",
  description:
    "Realny cennik KODA (landing od 2 900 zł, wizytówka od 3 900 zł, firmowa od 6 900 zł, premium 3D od 12 900 zł netto, opieka od 149 zł/mc) oraz orientacyjne widełki rynku PL 2026 wg typu strony.",
  inLanguage: "pl-PL",
  datePublished: "2026-06-17",
  // dateModified = realna data ostatniej zmiany TREŚCI artykułu (2026-08-27:
  // publikacja realnego cennika KODA — pakiety, dodatki, opieka). Spójne z sitemap.
  dateModified: "2026-08-27",
  author: { "@id": `${SITE_CONFIG.url}/#organization` },
  publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
  isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
  mainEntityOfPage: `${SITE_CONFIG.url}/cennik/`,
  about: { "@type": "Thing", name: "Koszt strony internetowej" },
  image: [`${SITE_CONFIG.url}/opengraph-image`],
};

// FAQPage — to samo źródło co sekcja FAQ na stronie (CENNIK_FAQ). Rich result FAQ
// jest wygaszony (V.2026), ale schema pomaga ekstrakcji przez silniki AI.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Spięcie z grafem encji (jak FAQ na stronie głównej) — @id + isPartOf + about.
  "@id": `${SITE_CONFIG.url}/cennik/#faq`,
  isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
  about: { "@id": `${SITE_CONFIG.url}/cennik/#article` },
  mainEntity: CENNIK_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// OfferCatalog — realny cennik KODA jako dane strukturalne. TYLKO prawdziwe
// ceny „od" (PriceSpecification.minPrice) i plany opieki (UnitPriceSpecification
// za miesiąc) — zgodne 1:1 z treścią strony i modelem CENNIK-MODEL-2026.
const OFERTA_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  "@id": `${SITE_CONFIG.url}/cennik/#oferta`,
  name: "Cennik KODA — strony internetowe",
  provider: { "@id": `${SITE_CONFIG.url}/#business` },
  itemListElement: [
    ...[
      ["Landing page / one-page", 2900, "Jedna strona sprzedażowa: do 6 sekcji, formularz, animacje."],
      ["Strona wizytówka", 3900, "Cała firma profesjonalnie pokazana w internecie — galeria realizacji i FAQ pod AI search."],
      ["Strona firmowa", 6900, "Rozbudowana strona, która sprzedaje i pozycjonuje — profesjonalny branding, treści pod konwersję, integracja CRM."],
      ["Strona premium 2D/3D", 12900, "Indywidualny koncept: zaawansowane animacje, sceny 3D, konfiguratory."],
    ].map(([name, minPrice, description]) => ({
      "@type": "Offer",
      name,
      description,
      priceSpecification: {
        "@type": "PriceSpecification",
        minPrice,
        priceCurrency: "PLN",
        valueAddedTaxIncluded: false,
      },
      itemOffered: {
        "@type": "Service",
        name,
        provider: { "@id": `${SITE_CONFIG.url}/#business` },
        areaServed: "Polska",
      },
    })),
    ...[
      ["Opieka techniczna „Czuwanie”", 149, "Monitoring 24/7, aktualizacje, kopie, zmiany do 1 h, hosting w cenie."],
      ["Opieka techniczna „Opieka+”", 349, "Zmiany do 3 h, miesięczny raport szybkości i widoczności, priorytet."],
      ["Opieka techniczna „Rozwój”", 799, "Do 6 h rozwoju miesięcznie, konsultacje, kwartalny przegląd."],
    ].map(([name, price, description]) => ({
      "@type": "Offer",
      name,
      description,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price,
        priceCurrency: "PLN",
        unitText: "miesiąc",
        valueAddedTaxIncluded: false,
      },
      itemOffered: {
        "@type": "Service",
        name,
        provider: { "@id": `${SITE_CONFIG.url}/#business` },
        areaServed: "Polska",
      },
    })),
  ],
};

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Cennik", path: "/cennik/" },
]);

// WebPage — jawny węzeł „ta strona" (mainEntity → Article, breadcrumb po @id).
const WEBPAGE_JSON_LD = webPageLd({
  path: "/cennik/",
  name: "Cennik stron internetowych 2026 — ceny KODA",
  description:
    "Landing od 2 900 zł, wizytówka od 3 900 zł, strona firmowa od 6 900 zł, premium 3D od 12 900 zł netto. Opieka od 149 zł/mc. Pełny cennik KODA + widełki rynku 2026.",
  dateModified: LASTMOD["/cennik/"],
  mainEntityId: `${SITE_CONFIG.url}/cennik/#article`,
});

export default function CennikPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(ARTICLE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(OFERTA_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(WEBPAGE_JSON_LD) }}
      />
      <PageHero
        label="Cennik"
        title="Ile kosztuje strona w KODA"
        lead="Konkretne ceny „od” dla każdego typu strony, dodatków i opieki — plus widełki rynkowe 2026 do porównania. Wycena zawsze bezpłatna, w 24 h."
        hue={300}
      />
      <CennikContent />
      <CTABand
        title="Poznajmy Twój projekt i podajmy konkret"
        subtitle="Opisz w kilku słowach, czego potrzebujesz — wrócimy z pomysłem i bezpłatną wyceną w ciągu 24 godzin. Bez zobowiązań."
      />
    </>
  );
}
