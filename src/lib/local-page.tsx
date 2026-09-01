import type { Metadata } from "next";
import { PageHero } from "@/components/sections/page-hero";
import { LocalContent } from "@/components/sections/local-content";
import { CTABand } from "@/components/sections/cta-band";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";
import { SITE_CONFIG } from "@/lib/constants";
import { getLocation, type Location } from "@/lib/locations";

/* ════════════════════════════════════════════════════════════════════════════
   Wspólny szkielet strony lokalnej. Każda podstrona miejska to plik na 3 linijki
   (`app/strony-internetowe-<miasto>/page.tsx`), który woła stąd metadane i widok.

   Osobne katalogi zamiast jednego segmentu dynamicznego [miasto] są celowe:
   URL musi być płaski (`/strony-internetowe-katowice/`), bo dokładnie tak
   wygląda zapytanie i tak mają to zrobione wszystkie serwisy z pierwszej
   dziesiątki. Segment dynamiczny w korzeniu (`app/[miasto]/`) przechwyciłby
   KAŻDY nieznany adres i rozbił stronę 404.
   ════════════════════════════════════════════════════════════════════════════ */

/** Ścieżka kanoniczna lokalizacji — ze slashem, jak reszta witryny. */
export function localPath(loc: Location): string {
  return `/${loc.slug}/`;
}

export function localMetadata(slug: string): Metadata {
  const loc = getLocation(slug);
  if (!loc) throw new Error(`Nieznana lokalizacja: ${slug}`);
  return pageMetadata({
    title: loc.title,
    description: loc.description,
    path: localPath(loc),
  });
}

export function LocalPage({ slug }: { slug: string }) {
  const loc = getLocation(slug);
  if (!loc) throw new Error(`Nieznana lokalizacja: ${slug}`);
  const path = localPath(loc);
  const url = `${SITE_CONFIG.url}${path}`;

  const breadcrumb = breadcrumbLd([
    { name: "Strona główna", path: "/" },
    { name: "Usługi", path: "/uslugi/" },
    { name: `Strony internetowe ${loc.city}`, path },
  ]);

  /* Service + FAQPage.

     Service z areaServed = konkretne miasto to najmocniejszy sygnał „obsługujemy
     TĘ miejscowość", jaki da się wyrazić danymi strukturalnymi; provider wskazuje
     po @id na encję firmy z layoutu, więc graf pozostaje jedną spójną całością
     zamiast rozsypywać się na luźne węzły.

     FAQPage NIE da tu wyników rozszerzonych — Google ograniczył je w 2023 r. do
     serwisów rządowych i medycznych. Zostaje, bo daje realną korzyść gdzie indziej:
     wiąże pytanie z odpowiedzią maszynowo, co wykorzystują silniki AI cytujące
     pojedyncze pasaże. Zero kosztu dla użytkownika (te same zdania są w treści). */
  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": `${url}#service`,
        name: `Tworzenie stron internetowych ${loc.city}`,
        serviceType: "Projektowanie i kodowanie stron internetowych",
        description: loc.description,
        url,
        provider: { "@id": `${SITE_CONFIG.url}/#organization` },
        areaServed: [
          { "@type": "City", name: loc.city },
          { "@type": "AdministrativeArea", name: loc.region },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: loc.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  const webPage = webPageLd({
    path,
    name: loc.title,
    description: loc.description,
    dateModified: loc.lastmod,
    mainEntityId: `${url}#service`,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(graph) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(webPage) }} />
      <PageHero
        label={loc.region}
        title={loc.h1}
        lead={`Projektujemy i kodujemy strony dla firm ${loc.inCity}. Bez szablonów, z zakresem i terminem w umowie.`}
        hue={324}
      />
      <LocalContent location={loc} />
      <CTABand
        title={`Zrobimy stronę dla Twojej firmy ${loc.inCity}`}
        subtitle="Napisz w kilku słowach, czym się zajmujesz — wycena i zakres wracają do Ciebie w 24 godziny. Bezpłatnie i bez zobowiązań."
      />
    </>
  );
}
