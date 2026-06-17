import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { PROJECTS } from "@/lib/projects";

// Przy output: export route musi być statyczny — generowany raz przy buildzie.
export const dynamic = "force-static";

// ── lastmod = STAŁA data per-URL (string ISO), NIGDY new Date() ───────────────
// new Date() przy każdym buildzie re-datował WSZYSTKIE 8 URL-i na „dziś", więc po
// każdym deployu na Cloudflare Google widział „wszystko zmienione dzisiaj" i
// dyskontował <lastmod> w całej witrynie — marnując jedyny sygnał priorytetu
// indeksowania, którego potrzebuje nowa domena. Tu trzymamy realne daty edycji:
// bumpuj datę strony WYŁĄCZNIE, gdy jej treść faktycznie się zmieni.
const LASTMOD: Record<string, string> = {
  "/": "2026-06-17",
  "/uslugi/": "2026-06-17",
  "/uslugi/strony-3d/": "2026-06-17",
  "/cennik/": "2026-06-17",
  "/realizacje/": "2026-06-15",
  "/o-nas/": "2026-06-17",
  "/kontakt/": "2026-06-17",
  "/polityka-prywatnosci/": "2026-06-14",
};

// Realizacje (case studies) — data publikacji portfolio (stała).
const PROJECT_LASTMOD = "2026-06-15";

// Trailing slashes match the served URLs (next.config trailingSlash:true →
// /uslugi/ etc.) and the per-page canonicals, so search engines see one
// consistent URL per page (no redirect/duplicate ambiguity).
export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE_CONFIG.url;
  return [
    { url: `${base}/`, lastModified: LASTMOD["/"], changeFrequency: "monthly", priority: 1 },
    {
      url: `${base}/uslugi/`,
      lastModified: LASTMOD["/uslugi/"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/uslugi/strony-3d/`,
      lastModified: LASTMOD["/uslugi/strony-3d/"],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${base}/cennik/`,
      lastModified: LASTMOD["/cennik/"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/realizacje/`,
      lastModified: LASTMOD["/realizacje/"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${base}/o-nas/`,
      lastModified: LASTMOD["/o-nas/"],
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/kontakt/`,
      lastModified: LASTMOD["/kontakt/"],
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Case studies
    ...PROJECTS.map((p) => ({
      url: `${base}/realizacje/${p.id}/`,
      lastModified: PROJECT_LASTMOD,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
    {
      url: `${base}/polityka-prywatnosci/`,
      lastModified: LASTMOD["/polityka-prywatnosci/"],
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
