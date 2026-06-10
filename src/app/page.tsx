import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { Process } from "@/components/sections/process";
import { Faq } from "@/components/sections/faq";
import { Statement } from "@/components/sections/statement";
import { IntroAnimation } from "@/components/ui/intro-animation";
import { FAQS } from "@/lib/faq";

// Strona główna — jawne metadane (nie tylko dziedziczenie z layoutu): tytuł
// „absolute" pomija szablon „%s | KODA" (home = korzeń) + kanoniczny URL.
export const metadata: Metadata = {
  title: { absolute: "KODA — strony internetowe dla firm | projekt, kod, wsparcie" },
  description:
    "Projektujemy i kodujemy strony oraz sklepy dla firm w Polsce — pod konkretny cel biznesowy, z zakresem i terminem w umowie. Odpowiadamy w 24 godziny.",
  alternates: { canonical: "/" },
};

// FAQPage structured data — buduje rich-result w Google i wzmacnia sygnał zaufania.
// Te same pytania, które renderuje sekcja <Faq/> (jedno źródło: @/lib/faq).
const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function HomePage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
  // Narracja konwertująca: hook → co robimy → dowód (realizacje) → jak
  // pracujemy → obiekcje (FAQ) → finałowe CTA. Jeden ciemny świat, jeden zjazd.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <IntroAnimation />
      <Hero />
      <Services />
      <Work />
      <Process />
      <Faq />
      <Statement />
    </>
  );
}
