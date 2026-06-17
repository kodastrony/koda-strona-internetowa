import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { UslugiContent } from "@/components/sections/uslugi-content";
import { CTABand } from "@/components/sections/cta-band";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Usługi", path: "/uslugi/" },
]);

export const metadata: Metadata = pageMetadata({
  title: "Usługi — strony internetowe, 3D i SEO",
  description:
    "Projektowanie UX/UI, strony internetowe 2D i 3D, optymalizacja i SEO oraz wsparcie po starcie — pod konkretny cel, nie pod szablon.",
  path: "/uslugi/",
});

export default function UslugiPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <PageHero
        label="Usługi"
        title="Co dla Ciebie zrobimy"
        lead="Cztery obszary, jeden cel: strona, która dobrze wygląda i pozyskuje klientów. Od pierwszej rozmowy po wsparcie długo po starcie."
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
