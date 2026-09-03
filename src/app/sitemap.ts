import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { PROJECTS } from "@/lib/projects";
import { LOCATIONS, PRIMARY_LOCATION } from "@/lib/locations";

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
// 2026-08-27: overhaul SEO/AEO ×2 — „premium" w title/description home, nowy
// wpis FAQ, linia zaufania (Work), lead /uslugi i /strony-3d, blok „Jeden
// standard" na /realizacje, poprawki polityki (Cloudflare, data), kotwice #id.
export const LASTMOD: Record<string, string> = {
  "/": "2026-08-27",
  "/uslugi/": "2026-08-27",
  "/uslugi/strony-3d/": "2026-08-27",
  "/cennik/": "2026-08-27",
  "/realizacje/": "2026-08-27",
  "/o-nas/": "2026-08-27",
  "/kontakt/": "2026-08-27",
  "/polityka-prywatnosci/": "2026-09-03",
};

// Realizacje (case studies) — 2026-08-27: VideoObject JSON-LD (realne czasy
// z ffprobe), seoTitle/seoDescription, AVIF kart (wcześniej 2026-08-26: nowe OG).
export const PROJECT_LASTMOD = "2026-08-27";

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
    // ── Strony lokalne ────────────────────────────────────────────────────
    // 2026-09-01: nowe podstrony miejskie (research: zero wyświetleń na
    // zapytania lokalne, bo nie było strony, która w nie celuje). Miasto
    // siedziby ma priorytet 0.9 — wyżej niż pozostałe lokalizacje, bo to
    // najważniejsze dla nas zapytanie w całym serwisie.
    ...LOCATIONS.map((l) => ({
      url: `${base}/${l.slug}/`,
      lastModified: l.lastmod,
      changeFrequency: "monthly" as const,
      priority: l.slug === PRIMARY_LOCATION.slug ? 0.9 : 0.7,
    })),
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
