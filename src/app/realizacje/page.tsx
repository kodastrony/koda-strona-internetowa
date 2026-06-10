import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { RealizacjeContent } from "@/components/sections/realizacje-content";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Realizacje",
  description:
    "Wybrane realizacje KODA — strony firmowe i korporacyjne oraz platformy B2B dla polskich marek.",
  alternates: { canonical: "/realizacje/" },
};

export default function RealizacjePage() {
  return (
    <>
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
