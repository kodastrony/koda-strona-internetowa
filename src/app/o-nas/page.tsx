import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "O nas",
  description: "Poznaj KODA Studio — zespół tworzący niestandardowe strony internetowe dla polskich firm.",
};

export default function ONasPage() {
  return <ComingSoon title="O nas" label="Kim jesteśmy" />;
}
