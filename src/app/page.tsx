import { Hero } from "@/components/sections/hero";
import { Work } from "@/components/sections/work";
import { Contact } from "@/components/sections/contact";
import { IntroAnimation } from "@/components/ui/intro-animation";

export default function HomePage() {
  return (
    <main>
      <IntroAnimation />
      <Hero />
      <Work />
      <Contact />
    </main>
  );
}
