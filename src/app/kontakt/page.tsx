import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";

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

export default function KontaktPage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(BREADCRUMB_JSON_LD) }}
      />
      <Contact />
    </>
  );
}
