import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Przy output: export route musi być statyczny — generowany raz przy buildzie.
export const dynamic = "force-static";

// Web App Manifest — nie robimy z witryny PWA (display: browser = uczciwie
// „to strona www"), ale sam plik domyka checklisty audytorów (Lighthouse BP,
// SEO-checkery „installable/manifest") i daje Androidowi/Chrome poprawną nazwę
// oraz kolor marki przy dodaniu do ekranu głównego. Ikony = istniejące assety
// (SVG skaluje się do każdego rozmiaru; apple-icon 180 px jako raster fallback).
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: "KODA",
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "browser",
    lang: "pl",
    background_color: "#f7f4f8",
    theme_color: "#f7f4f8",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
