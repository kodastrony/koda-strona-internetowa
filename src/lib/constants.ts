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

// ── Cloudflare Web Analytics (cookieless, bez bannera RODO) ───────────────────
// Beacon HARD-CODED (token jest publiczny). Dlaczego nie auto: „Automatic setup"
// w panelu Cloudflare NIE wstrzykiwał beacona po deployu Pages — potwierdzone na
// żywo 2026-06-17 (kruche). CSP w public/_headers wpuszcza static.cloudflareinsights.com
// (script-src) i cloudflareinsights.com (connect-src).
// ⚠️ Aby uniknąć podwójnego liczenia: w panelu Cloudflare → Web Analytics przełącz
// „kodastrony.pl" z Automatic na MANUAL (skoro beacon jest już w kodzie).
// Uwaga: Brave/uBlock blokują beacon → własne wizyty mogą się nie liczyć (testuj w Chrome/Edge).
export const ANALYTICS = {
  cfBeaconToken: "9f4fafef62ab476d945f2cd828c86322",
} as const;
