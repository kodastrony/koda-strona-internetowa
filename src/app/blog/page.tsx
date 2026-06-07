import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { BlogContent } from "@/components/sections/blog-content";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Praktyczna wiedza o stronach internetowych dla firm: ceny, szybkość, UX i najczęstsze błędy, które kosztują klientów.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <PageHero
        label="Wiedza"
        title="Blog"
        lead="Konkretna wiedza dla właścicieli firm, którzy myślą o stronie internetowej — bez ściemy i żargonu."
        glow="rgba(196,74,208,0.13)"
      />
      <BlogContent />
      <CTABand
        title="Masz pytanie o swoją stronę"
        subtitle="Nie znalazłeś odpowiedzi w artykułach? Napisz do nas — chętnie pomożemy."
      />
    </>
  );
}
