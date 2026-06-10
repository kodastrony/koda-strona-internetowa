import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Opowiedz nam o projekcie, a wrócimy z pomysłem i wyceną w ciągu 24 godzin. Bezpośredni kontakt, bez zobowiązań.",
  alternates: { canonical: "/kontakt/" },
};

export default function KontaktPage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
  return <Contact />;
}
