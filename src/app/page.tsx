import type { Metadata } from "next";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/ui/marquee";
import { Services } from "@/components/sections/services";
import { Work } from "@/components/sections/work";
import { WhyKoda } from "@/components/sections/why-koda";
import { Statement } from "@/components/sections/statement";
import { IntroAnimation } from "@/components/ui/intro-animation";

// Strona główna — jawne metadane (nie tylko dziedziczenie z layoutu): tytuł
// „absolute" pomija szablon „%s | KODA Studio" (home = korzeń) + kanoniczny URL.
export const metadata: Metadata = {
  title: { absolute: "KODA Studio — Strony internetowe dla biznesów w Polsce" },
  description:
    "Tworzymy niestandardowe strony internetowe dla polskich firm. Szybkie, skuteczne, dopasowane do Twojego biznesu.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
  // Narracja konwertująca: hook → co robimy → dowód (realizacje) → dlaczego my
  // → finałowe CTA. Jeden ciemny świat, jeden płynny zjazd.
  return (
    <>
      <IntroAnimation />
      <Hero />
      <Marquee />
      <Services />
      <Work />
      <WhyKoda />
      <Statement />
    </>
  );
}
