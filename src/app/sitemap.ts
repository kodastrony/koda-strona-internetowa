import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Przy output: export route musi być statyczny — generowany raz przy buildzie.
export const dynamic = "force-static";

// Only routes that actually exist today. Add new pages here as they ship.
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const lastModified = new Date();
  return [
    { url: base,                          lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/kontakt`,             lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/realizacje`,          lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/uslugi`,              lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/o-nas`,               lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog`,                lastModified, changeFrequency: "weekly",  priority: 0.5 },
    { url: `${base}/polityka-prywatnosci`, lastModified, changeFrequency: "yearly",  priority: 0.2 },
  ];
}
