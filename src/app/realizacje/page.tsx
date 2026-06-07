import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { RealizacjeContent } from "@/components/sections/realizacje-content";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "Realizacje",
  description:
    "Wybrane projekty KODA — sklepy internetowe, strony korporacyjne i firmowe oraz platformy B2B dla polskich marek.",
  alternates: { canonical: "/realizacje" },
};

export default function RealizacjePage() {
  return (
    <>
      <PageHero
        label="Portfolio"
        title="Realizacje"
        lead="Wybrane projekty, które łączą dopracowany design z realnymi wynikami w sprzedaży. Każdy zbudowany pod konkretny biznes — nie pod szablon."
        glow="rgba(164,114,240,0.13)"
      />
      <RealizacjeContent />
      <CTABand
        title="Twój projekt może być następny"
        subtitle="Opowiedz nam o swoim biznesie — pokażemy, jak możemy pomóc i ile to potrwa."
      />
    </>
  );
}
