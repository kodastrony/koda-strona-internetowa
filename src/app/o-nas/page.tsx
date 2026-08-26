import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ONasContent } from "@/components/sections/o-nas-content";
import { CTABand } from "@/components/sections/cta-band";
import { LASTMOD } from "@/app/sitemap";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "O nas", path: "/o-nas/" },
]);

export const metadata: Metadata = pageMetadata({
  title: "O nas — studio web design",
  description:
    "Projektujemy i kodujemy strony internetowe dla firm w Polsce. Bezpośredni kontakt, jasne zasady i opieka po starcie — pod konkretny cel, nie pod szablon.",
  path: "/o-nas/",
});

const WEBPAGE_JSON_LD = webPageLd({
  path: "/o-nas/",
  name: "O nas — studio web design",
  description:
    "Projektujemy i kodujemy strony internetowe dla firm w Polsce. Bezpośredni kontakt, jasne zasady i opieka po starcie — pod konkretny cel, nie pod szablon.",
  dateModified: LASTMOD["/o-nas/"],
});

export default function ONasPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(WEBPAGE_JSON_LD) }}
      />
      <PageHero
        label="Kim jesteśmy"
        title="O nas"
        lead="Studio web-design z Bielska-Białej, dla firm z całej Polski. Projekt, kod i opieka — wszystko u nas."
        hue={340}
      />
      <ONasContent />
      <CTABand />
    </>
  );
}
