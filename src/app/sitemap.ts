import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { PROJECTS } from "@/lib/projects";
import { ARTICLES } from "@/lib/articles";

// Przy output: export route musi być statyczny — generowany raz przy buildzie.
export const dynamic = "force-static";

// Trailing slashes match the served URLs (next.config trailingSlash:true →
// /uslugi/ etc.) and the per-page canonicals, so search engines see one
// consistent URL per page (no redirect/duplicate ambiguity).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  const lastModified = new Date();
  return [
    { url: `${base}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/uslugi/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/realizacje/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/o-nas/`, lastModified, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/blog/`, lastModified, changeFrequency: "weekly", priority: 0.6 },
    { url: `${base}/kontakt/`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    // Case studies
    ...PROJECTS.map((p) => ({
      url: `${base}/realizacje/${p.id}/`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    // Articles
    ...ARTICLES.map((a) => ({
      url: `${base}/blog/${a.slug}/`,
      lastModified,
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    {
      url: `${base}/polityka-prywatnosci/`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
