/**
 * SEO helpers — structured data builders shared across pages.
 *
 * Keep JSON-LD honest: only emit facts that are true (no fabricated ratings,
 * prices, clients or geo precision we can't stand behind). The Organization /
 * ProfessionalService / WebSite @graph lives in app/layout.tsx; per-page nodes
 * (BreadcrumbList, Article, Service…) are built here so every page stays
 * consistent and DRY.
 */
import { SITE_CONFIG } from "@/lib/constants";

/** One step in a breadcrumb trail. `path` is absolute, with trailing slash. */
export interface Crumb {
  name: string;
  /** e.g. "/uslugi/" — joined to SITE_CONFIG.url. Home is "/". */
  path: string;
}

/**
 * BreadcrumbList JSON-LD. Still rendered by Google in the SERP and a clean
 * hierarchy signal for both crawlers and AI engines. Absent from the site
 * until now — added to every non-home page.
 */
export function breadcrumbLd(trail: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_CONFIG.url}${c.path}`,
    })),
  };
}
