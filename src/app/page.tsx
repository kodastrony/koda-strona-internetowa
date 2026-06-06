import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Statement } from "@/components/sections/statement";
import { IntroAnimation } from "@/components/ui/intro-animation";

export default function HomePage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
  return (
    <>
      <IntroAnimation />
      <Hero />
      <Work />
      <Statement />
    </>
  );
}
