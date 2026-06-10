/**
 * Testimonials — SINGLE SOURCE OF TRUTH.
 *
 * Social proof is the single biggest trust gap on the site (audit: 9/12
 * personas). The <Testimonials> section renders ONLY when this array is
 * non-empty — so right now it shows nothing (no fake proof), and the moment you
 * add a real quote it appears on the homepage automatically.
 *
 * ⚠️ ONLY real, consented quotes. Never invent testimonials — fabricated social
 * proof burns trust harder than having none.
 */
export interface Testimonial {
  quote: string;
  /** Real person — first name + last initial is fine, e.g. "Anna K.". */
  name: string;
  /** Company / industry + city, e.g. "Gabinet stomatologiczny, Warszawa". */
  company: string;
  /** Optional link to a public Google review / profile that backs the quote. */
  link?: string;
}

export const TESTIMONIALS: Testimonial[] = [
  // Przykład (USUŃ ten komentarz i wstaw prawdziwe opinie):
  // {
  //   quote: "Po nowej stronie zaczęliśmy dostawać zapytania z formularza — wcześniej zero.",
  //   name: "Anna K.",
  //   company: "Gabinet stomatologiczny, Warszawa",
  //   link: "https://g.page/...",
  // },
];
