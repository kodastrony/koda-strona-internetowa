import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Usługi",
  description: "Oferta KODA Studio: strony internetowe, e-commerce, identyfikacja wizualna dla polskich firm.",
};

export default function UslugiPage() {
  return <ComingSoon title="Usługi" label="Co robimy" />;
}
