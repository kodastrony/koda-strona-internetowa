import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { UslugiContent } from "@/components/sections/uslugi-content";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Usługi",
  description:
    "Projektowanie UX/UI, strony i sklepy internetowe, optymalizacja i SEO oraz wsparcie po wdrożeniu — wszystko skrojone pod Twój biznes.",
  alternates: { canonical: "/uslugi/" },
};

export default function UslugiPage() {
  return (
    <>
      <PageHero
        label="Usługi"
        title="Co dla Ciebie zrobimy"
        lead="Od pierwszego pomysłu po działającą stronę, która zarabia. Cztery obszary, jeden cel — realny wynik dla Twojego biznesu."
      />
      <UslugiContent />
      <CTABand
        title="Który obszar jest dla Ciebie"
        subtitle="Nie wiesz, od czego zacząć? Napisz w kilku słowach o swoim biznesie — podpowiemy najlepszy krok."
      />
    </>
  );
}
