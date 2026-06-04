export const SITE_CONFIG = {
  name: "KODA Studio",
  tagline: "Strony internetowe, które konwertują.",
  description:
    "Tworzymy custom strony internetowe dla polskich biznesów — od małych firm po rozwijające się marki.",
  url: "https://kodastrony.pl",
  email: "kodakontakt@gmail.com",
  locale: "pl_PL",
} as const;

export const NAV_LINKS = [
  { label: "Realizacje", href: "/realizacje" },
  { label: "Usługi", href: "/uslugi" },
  { label: "O nas", href: "/o-nas" },
  { label: "Blog", href: "/blog" },
] as const;

export const SOCIAL_LINKS = {
  instagram: "",
  facebook: "",
  linkedin: "",
} as const;

export const CONTACT = {
  email: "kodakontakt@gmail.com",
  domain: "kodastrony.pl",
} as const;
