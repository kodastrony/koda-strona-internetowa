import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Przy output: export route musi być statyczny — generowany raz przy buildzie.
export const dynamic = "force-static";

// Only routes that actually exist today. Add new pages here as they ship.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const lastModified = new Date();
  return [
    { url: base, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/kontakt`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
