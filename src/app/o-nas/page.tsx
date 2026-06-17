import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ONasContent } from "@/components/sections/o-nas-content";
import { CTABand } from "@/components/sections/cta-band";
import { breadcrumbLd } from "@/lib/seo";

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "O nas", path: "/o-nas/" },
]);

export const metadata: Metadata = {
  title: "O nas",
  description:
    "Projektujemy i kodujemy strony internetowe dla firm w Polsce. Bezpośredni kontakt, jasne zasady i opieka po starcie — pod konkretny cel, nie pod szablon.",
  alternates: { canonical: "/o-nas/" },
};

export default function ONasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_JSON_LD) }}
      />
      <PageHero
        label="Kim jesteśmy"
        title="O nas"
        lead="Studio web-design z Polski. Projekt, kod i opieka — wszystko u nas."
        hue={340}
      />
      <ONasContent />
      <CTABand />
    </>
  );
}
