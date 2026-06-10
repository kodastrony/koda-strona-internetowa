/**
 * FAQ — SINGLE SOURCE OF TRUTH.
 *
 * Each entry answers a real objection a cautious Polish SMB owner has before
 * hiring a studio (price, timeline, what-if-I-don't-like-it, access, support,
 * deadlines, response time). Used by the <Faq> accordion on the homepage AND
 * the FAQPage JSON-LD in app/page.tsx.
 *
 * Promise discipline: we ONLY commit to what we can keep — a 24h response and
 * an agreed scope+deadline in a contract. No money-back, no unlimited
 * revisions, no "the code is yours". Confidence comes from the staged,
 * accept-each-step process — stated plainly, never defensively.
 */
export interface Faq {
  q: string;
  a: string;
}

export const FAQS: Faq[] = [
  {
    q: "Ile kosztuje strona?",
    a: "Zależy od zakresu — liczby podstron, treści i funkcji. Konkretną kwotę podajemy po krótkiej rozmowie. Wycena jest bezpłatna i bez zobowiązań, a wszystko zapisujemy w umowie — bez ukrytych kosztów później.",
  },
  {
    q: "Ile trwa zrobienie strony?",
    a: "Działamy ekspresowo — i bez pójścia na skróty. Konkretny termin ustalamy w umowie, zanim zaczniemy, i go pilnujemy. Pracujemy etapami i pokazujemy postępy na bieżąco, więc strona powstaje szybko, a Ty przez cały czas wiesz, na czym stoimy — bez kompromisów w jakości.",
  },
  {
    q: "Czy strona jest moja po starcie?",
    a: "Tak — strona, domena i wszystkie pliki należą do Ciebie, a po starcie przekazujemy Ci pełne dostępy. Nic nie jest zablokowane u nas. Większość klientów zostaje z nami na opiece technicznej (aktualizacje, bezpieczeństwo i drobne zmiany w stałej, rozsądnej opłacie) — ale to Twój wybór, nie warunek.",
  },
  {
    q: "Czy strona będzie dobrze widoczna w Google?",
    a: "Każdą stronę budujemy z technicznym SEO w standardzie: poprawna struktura, szybkość, responsywność i dane strukturalne. To fundament widoczności. Same pozycje w Google budują się potem treścią i czasem — i to możemy prowadzić razem w ramach opieki po starcie.",
  },
  {
    q: "Co z opieką po starcie?",
    a: "Start strony to początek, nie koniec. Zakres opieki zapisujemy w umowie: aktualizacje, bezpieczeństwo i rozwijanie strony razem z Twoim biznesem. Nie znikamy po wdrożeniu.",
  },
  {
    q: "Jak przebiega cały proces?",
    a: "Zaczynamy od rozmowy — mówisz, co ma się znaleźć na stronie i jak ma działać. Na tej podstawie projektujemy i budujemy całość, a potem pokazujemy Ci gotową stronę. Wtedy wspólnie dopinamy szczegóły i nanosimy poprawki, aż wszystko będzie dokładnie tak, jak chcesz. Zakres i termin masz w umowie od pierwszego dnia.",
  },
  {
    q: "Jak szybko odpowiadacie?",
    a: "Na każde zapytanie odpowiadamy w ciągu 24 godzin — zawsze ta sama osoba, która prowadzi Twój projekt.",
  },
];
