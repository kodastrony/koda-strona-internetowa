import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/constants";

// Przy output: export route musi być statyczny — generowany raz przy buildzie.
export const dynamic = "force-static";

// Jawne reguły dla wyszukiwarek i silników AI. „*" już wszystko dopuszcza, ale
// nazwane reguły są czytelnym, świadomym sygnałem „wpuszczamy AI" (i odporne na
// przyszłe domyślne blokady niektórych botów). Cel: być CYTOWANYM przez
// ChatGPT / Perplexity / Google AI Overviews & AI Mode / Gemini / Copilot —
// dla nowej domeny cytowanie w AI wyprzedza ranking organiczny. Wszystkie boty
// AI search + trenujące dostają allow „/", bo chcemy być obecni w ich odpowiedziach.
const AI_AND_SEARCH_BOTS = [
  // OpenAI / ChatGPT
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Anthropic / Claude
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  // Google (Gemini / AI Overviews / AI Mode — osobny token od Googlebota)
  "Google-Extended",
  // Apple Intelligence
  "Applebot",
  "Applebot-Extended",
  // Microsoft / Bing / Copilot
  "Bingbot",
  // Common Crawl (zbiór, na którym trenują modele) + Amazon
  "CCBot",
  "Amazonbot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      { userAgent: AI_AND_SEARCH_BOTS, allow: "/" },
    ],
    sitemap: `${SITE_CONFIG.url}/sitemap.xml`,
    host: SITE_CONFIG.url,
  };
}
