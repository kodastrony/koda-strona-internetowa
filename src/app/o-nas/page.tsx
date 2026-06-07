import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { ONasContent } from "@/components/sections/o-nas-content";
import { CTABand } from "@/components/sections/cta-band";

export const metadata: Metadata = {
  title: "O nas",
  description:
    "KODA to niewielki zespół projektantów i programistów z Polski. Tworzymy szybkie, skuteczne strony dla polskich firm — pod cel, nie pod szablon.",
  alternates: { canonical: "/o-nas" },
};

export default function ONasPage() {
  return (
    <>
      <PageHero
        label="Kim jesteśmy"
        title="O nas"
        lead="Małe studio z Polski, które robi strony nie po to, żeby ładnie wyglądały, tylko żeby realnie przynosiły klientów."
        glow="rgba(100,120,240,0.13)"
      />
      <ONasContent />
      <CTABand />
    </>
  );
}
