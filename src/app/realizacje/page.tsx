import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Realizacje",
  description: "Wybrane projekty stron internetowych KODA Studio — sklepy, strony korporacyjne, platformy B2B.",
};

export default function RealizacjePage() {
  return <ComingSoon title="Realizacje" label="Portfolio" />;
}
