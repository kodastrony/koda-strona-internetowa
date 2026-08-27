import type { Metadata } from "next";
import { Hero } from "@/components/hero/hero";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { Process } from "@/components/sections/process";
import { Faq } from "@/components/sections/faq";
import { Statement } from "@/components/sections/statement";
import { FAQS } from "@/lib/faq";
import { LASTMOD } from "@/app/sitemap";
import { jsonLd, webPageLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";

// Strona główna — jawne metadane (nie tylko dziedziczenie z layoutu): tytuł
// „absolute" pomija szablon „%s | KODA" (home = korzeń) + kanoniczny URL.
export const metadata: Metadata = {
  // Spójne z og:title i banerem OG (ten sam keyword z przodu) → mocny sygnał
  // encyjny dla Google i AI search; „absolute" pomija szablon (home = korzeń).
  // „premium" (2026-08-27): rebrand + audyt SXO — fraza „strony internetowe
  // premium" nie występowała w żadnym crawlowalnym title/H1 domeny. 56 znaków.
  title: { absolute: "Strony internetowe premium — projekt i kod | KODA Studio" },
  description:
    "Projektujemy i kodujemy strony internetowe premium — z Bielska-Białej, dla firm w całej Polsce. Bez szablonów, zakres i termin w umowie. Odpowiadamy w 24 h.",
  alternates: { canonical: "/" },
};

// FAQPage structured data — buduje rich-result w Google i wzmacnia sygnał zaufania.
// Te same pytania, które renderuje sekcja <Faq/> (jedno źródło: @/lib/faq).
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Spięcie z grafem encji z layoutu (Organization/ProfessionalService/WebSite)
  // przez @id → jeden spójny graf = mocniejszy sygnał dla Google i AI search.
  "@id": `${SITE_CONFIG.url}/#faq`,
  isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
  about: { "@id": `${SITE_CONFIG.url}/#business` },
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// WebPage — jawny węzeł „ta strona" także na home (spójnie z podstronami).
const WEBPAGE_JSON_LD = webPageLd({
  path: "/",
  name: "Strony internetowe premium — projekt i kod | KODA Studio",
  description:
    "Projektujemy i kodujemy strony internetowe premium — z Bielska-Białej, dla firm w całej Polsce. Bez szablonów, zakres i termin w umowie. Odpowiadamy w 24 h.",
  dateModified: LASTMOD["/"],
});

export default function HomePage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
  // Narracja konwertująca: hook → co robimy → dowód (realizacje) → jak
  // pracujemy → obiekcje (FAQ) → finałowe CTA. Jeden ciemny świat, jeden zjazd.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(FAQ_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(WEBPAGE_JSON_LD) }}
      />
      <Hero />

      {/* Usługi — sekcja przezroczysta (data-canvas) leży na płynnym PageCanvas.
          Bez akcentu „planeta/orbity" (hero 2D zastąpił wariant 3D). */}
      <Services />

      <Work />

      {/* Jak pracujemy — tylko oryginalna oś czasu (różowy progress bar 01–04
          w <Process/>); bez kosmicznego akcentu konstelacji (był drugą, „fancy"
          animacją progress baru i kreską na gładkim tle). */}
      <Process />

      <Faq />
      <Statement />
    </>
  );
}
