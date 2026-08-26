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

/**
 * Serializuj JSON-LD do bezpiecznego wstrzyknięcia w `<script>`. Escapuje „<"
 * → `<`, więc treść NIGDY nie zamknie przedwcześnie tagu `</script>`
 * (hardening XSS + zalecany przez Next.js wzorzec dla structured data). Używać
 * we WSZYSTKICH blokach `<script type="application/ld+json">`.
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
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
  // @id wyliczane ze ścieżki bieżącej strony (ostatni okruszek) — dzięki temu
  // WebPage.breadcrumb może referencjonować ten węzeł po @id (spójny graf).
  const current = trail[trail.length - 1];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${SITE_CONFIG.url}${current.path}#breadcrumb`,
    itemListElement: trail.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_CONFIG.url}${c.path}`,
    })),
  };
}

export interface WebPageInput {
  /** np. "/uslugi/" — ze slashem, jak w Crumb.path. Home = "/". */
  path: string;
  name: string;
  description: string;
  /** ISO 8601 — ta sama data co w sitemap.ts (LASTMOD), jedno źródło prawdy. */
  dateModified: string;
  /** @id węzła, o którym ta strona „jest" (Article/Service/CreativeWork…). Opcjonalne. */
  mainEntityId?: string;
}

/**
 * WebPage JSON-LD — jawny węzeł „ta strona" (standardowy wzorzec grafu, m.in.
 * Yoast): oddziela stronę od jej głównego tematu (mainEntity) i spina breadcrumb
 * po @id. Uzupełnia graf encji z layoutu (isPartOf → #website) — czysty sygnał
 * dla Google i silników AI, zero nowych treści (name/description = metadane strony).
 */
export function webPageLd({ path, name, description, dateModified, mainEntityId }: WebPageInput) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_CONFIG.url}${path}#webpage`,
    url: `${SITE_CONFIG.url}${path}`,
    name,
    description,
    inLanguage: "pl-PL",
    isPartOf: { "@id": `${SITE_CONFIG.url}/#website` },
    dateModified,
    ...(path !== "/" ? { breadcrumb: { "@id": `${SITE_CONFIG.url}${path}#breadcrumb` } } : {}),
    ...(mainEntityId ? { mainEntity: { "@id": mainEntityId } } : {}),
  };
}
