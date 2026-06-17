export const SITE_CONFIG = {
  name: "KODA Studio",
  tagline: "Strony internetowe dla polskich firm.",
  description:
    "Projektujemy i kodujemy strony internetowe dla firm w Polsce — pod konkretny cel biznesowy, z jasnym zakresem w umowie i opieką po starcie.",
  url: "https://kodastrony.pl",
  email: "kontakt@kodastrony.pl",
  locale: "pl_PL",
} as const;

export const NAV_LINKS = [
  { label: "Realizacje", href: "/realizacje" },
  { label: "Usługi", href: "/uslugi" },
  { label: "O nas", href: "/o-nas" },
  { label: "FAQ", href: "/#faq" },
] as const;

export const CONTACT = {
  email: "kontakt@kodastrony.pl",
  domain: "kodastrony.pl",
  city: "Bielsko-Biała",
  // ⬇️ Opcjonalnie — po wpisaniu NIP renderuje się sam w stopce („NIP: …"). Puste = nie pokazuje się.
  nip: "" as string, // np. "0000000000"
} as const;

// ── Analytics ────────────────────────────────────────────────────────────────
// Cloudflare Web Analytics jest podpięte przez „Automatic setup" w panelu
// Cloudflare — to ONO wstrzykuje beacon (z tokenem) na krawędzi proxy, więc NIE
// dodajemy własnego beacona w kodzie (byłby duplikatem → podwójne liczenie).
// Warunek działania: CSP w public/_headers MUSI wpuszczać static.cloudflareinsights.com
// (script-src) i cloudflareinsights.com (connect-src) — bez tego beacon jest blokowany.
// Cookieless, bez bannera RODO. Uwaga: Brave/uBlock blokują ten beacon → własne
// wizyty mogą się nie liczyć (testuj w Chrome/Edge).
