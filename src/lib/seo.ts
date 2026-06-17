/**
 * SEO helpers — structured data builders shared across pages.
 *
 * Keep JSON-LD honest: only emit facts that are true (no fabricated ratings,
 * prices, clients or geo precision we can't stand behind). The Organization /
 * ProfessionalService / WebSite @graph lives in app/layout.tsx; per-page nodes
 * (BreadcrumbList, Article, Service…) are built here so every page stays
 * consistent and DRY.
 */
import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";

/** Plik-konwencja OG (1200×630) z app/opengraph-image.tsx. _headers wymusza
 *  Content-Type: image/png dla tej bezrozszerzeniowej ścieżki. */
export const OG_IMAGE = "/opengraph-image";

interface PageMetaInput {
  /** <title> strony (szablon „%s | KODA Studio" dokleja markę). */
  title: string;
  description: string;
  /** Kanoniczny URL + og:url, np. "/uslugi/" (ze slashem). */
  path: string;
  /** Opcjonalny osobny og/twitter title (domyślnie = title). */
  ogTitle?: string;
}

/**
 * Spójne metadane podstrony: canonical + KOMPLETNY Open Graph + Twitter z obrazem.
 *
 * Dlaczego helper, a nie ręczny `openGraph` per-strona: Next NIE scala obrazu z
 * konwencji `opengraph-image` do strony, która deklaruje własny `openGraph`
 * (gubi się `og:image`), a strona BEZ `openGraph` dziedziczy `og:url` i tytuł
 * STRONY GŁÓWNEJ (podgląd pokazuje home). Helper ustawia wszystko jawnie, więc
 * każda podstrona ma własny, poprawny OG/Twitter z obrazem. Jedno źródło prawdy.
 */
export function pageMetadata({ title, description, path, ogTitle }: PageMetaInput): Metadata {
  const ogT = ogTitle ?? title;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: "KODA Studio",
      url: path,
      title: ogT,
      description,
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: ogT }],
    },
    twitter: {
      card: "summary_large_image",
      title: ogT,
      description,
      images: [OG_IMAGE],
    },
  };
}

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
