import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { RealizacjeContent } from "@/components/sections/realizacje-content";
import { CTABand } from "@/components/sections/cta-band";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Realizacje", path: "/realizacje/" },
]);

export const metadata: Metadata = pageMetadata({
  title: "Realizacje stron internetowych",
  description:
    "Realizacje KODA — strony internetowe (3D, produktowe, landingi) zbudowane od zera: projekt, kod i animacje. Realne marki i autorskie koncepty.",
  path: "/realizacje/",
});

export default function RealizacjePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
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
