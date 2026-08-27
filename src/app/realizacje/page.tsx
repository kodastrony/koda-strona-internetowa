import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { RealizacjeContent } from "@/components/sections/realizacje-content";
import { CTABand } from "@/components/sections/cta-band";
import { LASTMOD } from "@/app/sitemap";
import { PROJECTS } from "@/lib/projects";
import { SITE_CONFIG } from "@/lib/constants";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Realizacje", path: "/realizacje/" },
]);

export const metadata: Metadata = pageMetadata({
  title: "Realizacje — portfolio stron internetowych",
  description:
    "Realizacje KODA — strony internetowe (3D, produktowe, landingi) zbudowane od zera: projekt, kod i animacje. Realne marki i autorskie koncepty. Zobacz na żywo.",
  path: "/realizacje/",
});

// ItemList — spina 4 case studies w kolekcję (CollectionPage + lista pozycji);
// zero nowych faktów, tylko referencje do istniejących podstron.
const ITEMLIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_CONFIG.url}/realizacje/#lista`,
  name: "Realizacje KODA Studio",
  numberOfItems: PROJECTS.length,
  itemListElement: PROJECTS.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE_CONFIG.url}/realizacje/${p.id}/`,
    name: `${p.title} — ${p.type}`,
  })),
};

const WEBPAGE_JSON_LD = webPageLd({
  path: "/realizacje/",
  name: "Realizacje stron internetowych",
  description:
    "Realizacje KODA — strony internetowe (3D, produktowe, landingi) zbudowane od zera: projekt, kod i animacje. Realne marki i autorskie koncepty.",
  dateModified: LASTMOD["/realizacje/"],
  pageType: "CollectionPage",
});

export default function RealizacjePage() {
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(ITEMLIST_JSON_LD) }}
      />
      <PageHero
        label="Wybrane projekty"
        title="Realizacje"
        lead="Strony internetowe, które projektujemy i kodujemy od zera — pod konkretny cel i charakter każdej marki."
        hue={324}
      />
      <RealizacjeContent />
      <CTABand
        title="Twój projekt może być następny"
        subtitle="Opowiedz nam o swoim biznesie — pokażemy, jak możemy pomóc i ile to potrwa."
      />
    </>
  );
}
