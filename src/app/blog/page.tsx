import type { Metadata } from "next";
import { ComingSoon } from "@/components/ui/coming-soon";

export const metadata: Metadata = {
  title: "Blog",
  description: "Artykuły i poradniki KODA Studio na temat web designu, UX i marketingu dla polskich firm.",
};

export default function BlogPage() {
  return <ComingSoon title="Blog" label="Wiedza i inspiracje" />;
}
