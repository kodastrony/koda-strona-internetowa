import type { NextConfig } from "next";

// ── GitHub Pages: statyczny eksport pod subpath /<repo> ─────────────────
// Flagę GITHUB_PAGES ustawia workflow .github/workflows/deploy-pages.yml.
// Bez flagi (lokalny `next dev` / `next build`) konfiguracja jest DOMYŚLNA —
// dev działa na http://localhost:3000 bez subpatha i z pełną optymalizacją obrazów.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repo = "koda-strona-internetowa";

const nextConfig: NextConfig = isGithubPages
  ? {
      output: "export", // build → statyczny folder out/ (czysty HTML/CSS/JS)
      basePath: `/${repo}`, // strona żyje pod kodastrony.github.io/<repo>
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
