import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { CennikContent, CENNIK_FAQ } from "@/components/sections/cennik-content";
import { CTABand } from "@/components/sections/cta-band";
import { SITE_CONFIG } from "@/lib/constants";
import { breadcrumbLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ile kosztuje strona internetowa? Cennik 2026",
  description:
    "Ile kosztuje strona internetowa w Polsce w 2026? Orientacyjne widełki cen wg typu strony, co wpływa na cenę i czym różni się kreator, freelancer i agencja. Wycena w KODA — bezpłatnie.",
  alternates: { canonical: "/cennik/" },
  openGraph: {
    title: "Ile kosztuje strona internetowa? Cennik 2026 | KODA Studio",
    description:
      "Orientacyjne widełki cen stron internetowych w Polsce (2026), co wpływa na cenę i porównanie: kreator, freelancer, agencja. Wycena w KODA — bezpłatnie i bez zobowiązań.",
    url: "/cennik/",
  },
};

// Article — sygnał E-E-A-T + kwalifikacja do cytowań AI. Autor = KODA Studio
// (organizacja, NIE osoba — zgodnie z decyzją „mówimy »my«, bez imion").
const ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Ile kosztuje strona internetowa w 2026? Cennik i co wpływa na cenę",
  description:
    "Orientacyjne widełki cen stron internetowych w Polsce w 2026 roku wg typu strony, czynniki wpływające na cenę oraz porównanie kreatora, freelancera i agencji.",
  inLanguage: "pl-PL",
  datePublished: "2026-06-17",
  dateModified: "2026-06-17",
  author: { "@id": `${SITE_CONFIG.url}/#organization` },
  publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
  isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
  mainEntityOfPage: `${SITE_CONFIG.url}/cennik/`,
  about: { "@type": "Thing", name: "Koszt strony internetowej" },
};

// FAQPage — to samo źródło co sekcja FAQ na stronie (CENNIK_FAQ). Rich result FAQ
// jest wygaszony (V.2026), ale schema pomaga ekstrakcji przez silniki AI.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: CENNIK_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Cennik", path: "/cennik/" },
]);

export default function CennikPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ARTICLE_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <PageHero
        label="Cennik"
        title="Ile kosztuje strona internetowa"
        lead="Orientacyjne widełki rynkowe na 2026 rok i to, co realnie wpływa na cenę. W KODA wyceniamy każdy projekt indywidualnie — bezpłatnie."
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
