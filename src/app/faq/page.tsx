import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Faq } from "@/components/sections/faq";
import { CTABand } from "@/components/sections/cta-band";
import { FAQS } from "@/lib/faq";
import { LASTMOD } from "@/app/sitemap";
import { SITE_CONFIG } from "@/lib/constants";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";

// ★14.10: FAQ dostaje WŁASNĄ podstronę. Po przepięciu domeny strona główna `/` to rozmowa z K.O.D.A (osobna
// aplikacja), więc sekcja <Faq/> z dawnej strony głównej zniknęłaby razem z jej FAQPage — a to najbardziej
// cytowalna treść dla AI (answer-first: ceny, czas, proces, skąd jesteśmy). Ta sama lista pytań (@/lib/faq),
// ten sam komponent, ten sam graf encji (@id). Link „FAQ" w menu i stopce prowadzi tutaj.

const DESCRIPTION =
  "Odpowiedzi KODA Studio: ile kosztuje strona, ile trwa, czy jest Twoja po starcie, jak wygląda proces i opieka, skąd jesteśmy i jak szybko odpowiadamy.";

export const metadata: Metadata = pageMetadata({
  title: "FAQ — ile kosztuje i ile trwa strona",
  description: DESCRIPTION,
  path: "/faq/",
});

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "FAQ", path: "/faq/" },
]);

// FAQPage — te same pytania, które renderuje <Faq/> (jedno źródło: @/lib/faq); spięte z grafem encji z layoutu.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${SITE_CONFIG.url}/faq/#faq`,
  isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
  about: { "@id": `${SITE_CONFIG.url}/#business` },
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const WEBPAGE_JSON_LD = webPageLd({
  path: "/faq/",
  name: "FAQ — najczęstsze pytania o strony internetowe",
  description: DESCRIPTION,
  dateModified: LASTMOD["/faq/"],
  mainEntityId: `${SITE_CONFIG.url}/faq/#faq`,
});

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(WEBPAGE_JSON_LD) }}
      />
      <PageHero
        label="Najczęstsze pytania"
        title="FAQ"
        lead="Ile kosztuje strona, ile trwa, co z opieką po starcie i jak wygląda współpraca — odpowiedzi wprost, z liczbami."
        hue={335}
      />
      <Faq />
      <CTABand />
    </>
  );
}
