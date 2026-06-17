import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { Strony3DContent, STRONY3D_FAQ } from "@/components/sections/strony-3d-content";
import { CTABand } from "@/components/sections/cta-band";
import { SITE_CONFIG } from "@/lib/constants";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Strony internetowe 3D i animowane",
  description:
    "Strony internetowe 3D i z animacjami (WebGL/Three.js) — interaktywne sceny, które wyróżniają markę. Zobacz 4 działające dema. Szybkie i na każdym ekranie.",
  path: "/uslugi/strony-3d/",
});

// Service — usługa spięta z encją Organization (jasność encji + kwalifikacja AI).
const SERVICE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Strony internetowe 3D i animowane",
  serviceType: "Projektowanie i kodowanie interaktywnych stron 3D oraz stron z animacjami",
  description:
    "Interaktywne strony 3D (WebGL / Three.js / React Three Fiber) oraz strony z animacjami (GSAP), budowane na autorskim kodzie — szybkie, dostępne (WCAG) i responsywne.",
  url: `${SITE_CONFIG.url}/uslugi/strony-3d/`,
  inLanguage: "pl-PL",
  provider: { "@id": `${SITE_CONFIG.url}/#organization` },
  areaServed: { "@type": "Country", name: "Polska" },
};

// FAQPage — jedno źródło co sekcja FAQ (STRONY3D_FAQ). Rich result FAQ wygaszony
// (V.2026), ale schema wspiera ekstrakcję przez silniki AI.
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: STRONY3D_FAQ.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Usługi", path: "/uslugi/" },
  { name: "Strony 3D i animowane", path: "/uslugi/strony-3d/" },
]);

export default function Strony3DPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SERVICE_JSON_LD) }}
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
        label="Usługi · 3D i animacje"
        title="Strony internetowe 3D i animowane"
        lead="Interaktywne sceny w przeglądarce i animacje, które wyróżniają markę — z czterema działającymi demami. Szybkie, dostępne i na każdym ekranie."
        hue={324}
      />
      <Strony3DContent />
      <CTABand
        title="Masz pomysł na stronę 3D lub z animacjami?"
        subtitle="Opowiedz nam o projekcie — pokażemy, co się da zrobić, i odeślemy bezpłatną wycenę w ciągu 24 godzin."
      />
    </>
  );
}
