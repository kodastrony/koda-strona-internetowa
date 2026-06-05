import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Kontakt",
  description:
    "Opowiedz nam o swoim projekcie. Projektujemy strony internetowe dla polskich firm.",
};

export default function KontaktPage() {
  // Brak <main> tutaj — layout.tsx już renderuje <main className="flex-1">.
  return <Contact />;
}
