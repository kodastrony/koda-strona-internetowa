import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";
import { breadcrumbLd, jsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt",
  description:
    "Opowiedz nam o projekcie, a wrócimy z pomysłem i wyceną w ciągu 24 godzin. Bezpośredni kontakt, bez zobowiązań.",
  path: "/kontakt/",
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
