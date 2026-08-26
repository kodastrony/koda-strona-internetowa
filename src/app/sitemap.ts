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
// 2026-08-26: overhaul SEO/AEO — realne zmiany TREŚCI na wszystkich stronach
// (answer-first FAQ z liczbami, nowe pytania, sygnały lokalne Bielsko-Biała,
// sekcja „Technologia" na /o-nas/, akapit intro na /realizacje/, WebPage JSON-LD
// wszędzie). Poprzedni bump: 2026-08-17 (nowe OG/ikony).
// export: te same daty zasilają WebPage.dateModified w JSON-LD (lib/seo.ts →
// webPageLd) — jedno źródło prawdy, zero rozjazdu sitemap↔schema.
export const LASTMOD: Record<string, string> = {
  "/": "2026-08-26",
  "/uslugi/": "2026-08-26",
  "/uslugi/strony-3d/": "2026-08-26",
  "/cennik/": "2026-08-26",
  "/realizacje/": "2026-08-26",
  "/o-nas/": "2026-08-26",
  "/kontakt/": "2026-08-26",
  "/polityka-prywatnosci/": "2026-08-26",
};

// Realizacje (case studies) — 2026-08-26: nowe OG (JPG 1200×630), disclaimer
// „koncept" w JSON-LD, pauza wideo (wcześniej: publikacja portfolio 2026-06-15).
// export: j.w. — WebPage.dateModified na stronach case studies.
export const PROJECT_LASTMOD = "2026-08-26";

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
