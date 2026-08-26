import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { LASTMOD } from "@/app/sitemap";
import { breadcrumbLd, jsonLd, pageMetadata, webPageLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt — bezpłatna wycena strony w 24 h",
  description:
    "Opowiedz nam o projekcie strony internetowej — wrócimy z pomysłem i wyceną w 24 h. Studio z Bielska-Białej, bezpośredni kontakt, bez zobowiązań.",
  path: "/kontakt/",
  ogTitle: "Kontakt — KODA Studio",
});

const BREADCRUMB_JSON_LD = breadcrumbLd([
  { name: "Strona główna", path: "/" },
  { name: "Kontakt", path: "/kontakt/" },
]);

const WEBPAGE_JSON_LD = webPageLd({
  path: "/kontakt/",
  name: "Kontakt — bezpłatna wycena strony w 24 h",
  description:
    "Opowiedz nam o projekcie strony internetowej — wrócimy z pomysłem i wyceną w 24 h. Studio z Bielska-Białej, bezpośredni kontakt, bez zobowiązań.",
  dateModified: LASTMOD["/kontakt/"],
});

export default function KontaktPage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
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
      <Contact />
    </>
  );
}
