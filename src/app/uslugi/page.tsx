import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { UslugiContent } from "@/components/sections/uslugi-content";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Usługi",
  description:
    "Projektowanie UX/UI, strony i sklepy internetowe, optymalizacja i SEO oraz wsparcie po starcie — pod konkretny cel, nie pod szablon.",
  alternates: { canonical: "/uslugi/" },
};

export default function UslugiPage() {
  return (
    <>
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
