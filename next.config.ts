import type { NextConfig } from "next";

// ── Static export pod WŁASNĄ domenę (OVH / dowolny statyczny hosting) ───────
// Flagę STATIC_EXPORT ustawia workflow .github/workflows/deploy-ovh.yml (CI).
// Buduje czysty statyczny folder out/ serwowany z ROOTA domeny (https://kodastrony.pl/),
// dlatego BEZ basePath (inaczej assety szukałyby /<repo>/... → 404 na własnej domenie).
// trailingSlash → każda podstrona to /sciezka/index.html, co Apache na OVH serwuje
// natywnie (czyste URL-e bez .html). Routy plikowe (robots.txt, sitemap.xml,
// opengraph-image, apple-icon, icon.svg) mają już `export const dynamic = "force-static"`.
//
// Bez flagi (lokalny `next dev` / `next build`) konfiguracja jest DOMYŚLNA — pełny
// Next z optymalizacją obrazów (pod lokalne testy oraz ewentualny przyszły SSR/Vercel).
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export", // build → statyczny folder out/ (czysty HTML/CSS/JS)
      trailingSlash: true, // /kontakt/ → out/kontakt/index.html (Apache-friendly na OVH)
      images: { unoptimized: true }, // brak serwera Next = brak optymalizacji obrazów w locie
      experimental: { optimizePackageImports: ["lucide-react", "motion"] },
    }
  : {
      images: {
        remotePatterns: [
          { protocol: "https", hostname: "images.ctfassets.net" }, // Contentful (future CMS)
          { protocol: "https", hostname: "cdn.sanity.io" }, // Sanity (future CMS)
        ],
        formats: ["image/avif", "image/webp"],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920],
        imageSizes: [16, 32, 64, 96, 128, 256],
      },
      experimental: { optimizePackageImports: ["lucide-react", "motion"] },
    };

export default nextConfig;
