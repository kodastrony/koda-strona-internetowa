export const SITE_CONFIG = {
  name: "KODA Studio",
  tagline: "Strony i sklepy internetowe dla polskich firm.",
  description:
    "Projektujemy i kodujemy strony oraz sklepy dla firm w Polsce — pod konkretny cel biznesowy, z jasnym zakresem w umowie i opieką po starcie.",
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
