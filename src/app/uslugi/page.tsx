import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { UslugiContent } from "@/components/sections/uslugi-content";
import { CTABand } from "@/components/sections/cta-band";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";
import { SERVICES } from "@/lib/services-data";
import { SITE_CONFIG } from "@/lib/constants";
import { LASTMOD } from "@/app/sitemap";

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Usługi", path: "/uslugi/" },
]);

// Service JSON-LD — każda usługa jako węzeł Service spięty z encją KODA
// (provider → #organization). Świadczone zdalnie dla całej Polski (areaServed),
// więc bez fałszywego lokalu. Wzmacnia rozumienie oferty przez Google i silniki
// AI; zero markupu Review/AggregateRating (self-serving = nieuprawniony).
const SERVICES_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    // OfferCatalog spina biznes (#business z layoutu) z ofertą — TYLKO tutaj,
    // bo węzły Service z @id istnieją wyłącznie na tej stronie (referencja z
    // layout.tsx wisiałaby na pozostałych 13 stronach). Parser scala ten węzeł
    // z pełnym ProfessionalService po tym samym @id.
    {
      "@id": `${SITE_CONFIG.url}/#business`,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Usługi KODA Studio",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: { "@id": `${SITE_CONFIG.url}/uslugi/#${s.id}` },
        })),
      },
    },
    // Bez inLanguage: to własność CreativeWork, nie Service (walidator Google:
    // UNKNOWN_FIELD). Język strony niesie WebPage/WebSite.
    ...SERVICES.map((s) => ({
      "@type": "Service",
      "@id": `${SITE_CONFIG.url}/uslugi/#${s.id}`,
      name: s.title,
      description: s.lead,
      serviceType: s.title,
      url: `${SITE_CONFIG.url}/uslugi/#${s.id}`,
      provider: { "@id": `${SITE_CONFIG.url}/#organization` },
      areaServed: { "@type": "Country", name: "Polska" },
    })),
  ],
};

export const metadata: Metadata = pageMetadata({
  title: "Usługi — strony internetowe, 3D i SEO",
  description:
    "Projektowanie UX/UI, strony internetowe 2D i 3D, SEO oraz opieka po starcie — dla firm z Bielska-Białej i całej Polski. Pod konkretny cel, nie pod szablon.",
  path: "/uslugi/",
});

// WebPage — jawny węzeł „ta strona" (breadcrumb po @id, isPartOf → #website).
const WEBPAGE_JSON_LD = webPageLd({
  path: "/uslugi/",
  name: "Usługi — strony internetowe, 3D i SEO",
  description:
    "Projektowanie UX/UI, strony internetowe 2D i 3D, SEO oraz opieka po starcie — dla firm z Bielska-Białej i całej Polski. Pod konkretny cel, nie pod szablon.",
  dateModified: LASTMOD["/uslugi/"],
  pageType: "CollectionPage",
});

export default function UslugiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(SERVICES_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(WEBPAGE_JSON_LD) }}
      />
      {/* H1 z frazą „strony internetowe" (audyt on-page: H1 bez keyworda na
          stronie usługowej) — „dla Ciebie" zostaje, ton bez zmian. */}
      <PageHero
        label="Usługi"
        title="Strony internetowe, które robimy dla Ciebie"
        lead="Cztery obszary, jeden cel: robimy dla Ciebie stronę, która dobrze wygląda i pozyskuje klientów. Od pierwszej rozmowy po wsparcie długo po starcie."
        hue={300}
      />
      <UslugiContent />
      <CTABand
        title="Zbudujemy dla Ciebie stronę"
        subtitle="Nie wiesz, od czego zacząć? Napisz w kilku słowach o swoim biznesie — skontaktujemy się w 24 h. Bez zobowiązań i haczyków."
      />
    </>
  );
}
