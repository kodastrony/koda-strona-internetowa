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
    // Answer-first: NASZE ceny „od" w PIERWSZYM zdaniu (te same, które
    // publikujemy na /cennik/; spójność = wiarygodność + cytowalność przez AI).
    q: "Ile kosztuje strona?",
    a: "W KODA landing page kosztuje od 2 900 zł netto, strona wizytówka od 3 900 zł, strona firmowa od 6 900 zł, a projekty premium z animacjami i 3D — od 12 900 zł. Cena „od” to minimalny zakres pakietu; konkret dla Twojego projektu podajemy bezpłatnie w 24 godziny i zapisujemy w umowie — bez ukrytych kosztów później. Pełny cennik znajdziesz na podstronie Cennik.",
  },
  {
    // Answer-first: ramy czasowe w PIERWSZYM zdaniu (orientacyjne, rynkowe —
    // wiążący dla klienta jest wyłącznie termin z umowy, jak w drugim zdaniu).
    q: "Ile trwa zrobienie strony?",
    // Terminy IDENTYCZNE jak /cennik i llms.txt (landing 1–2 / wizytówka 2–3 /
    // firmowa 3–5 / premium 5–8) — rozjazd między stronami psuje zaufanie AI search.
    a: "Landing page powstaje zwykle w 1–2 tygodnie, strona wizytówka w 2–3 tygodnie, strona firmowa w 3–5 tygodni, a projekt premium — z indywidualnymi animacjami czy grafiką 3D — w 5–8 tygodni. W KODA konkretny termin ustalamy w umowie, zanim zaczniemy, i go pilnujemy. Pracujemy etapami i pokazujemy postępy na bieżąco, więc tworzenie strony internetowej przebiega sprawnie, a Ty przez cały czas wiesz, na czym stoimy.",
  },
  {
    q: "Czy strona jest moja po starcie?",
    a: "Tak — strona, domena i wszystkie pliki należą do Ciebie, a po starcie przekazujemy Ci pełne dostępy. Nic nie jest zablokowane po stronie KODA. Większość klientów zostaje z nami na opiece technicznej (aktualizacje, bezpieczeństwo i drobne zmiany w stałej, rozsądnej opłacie) — ale to Twój wybór, nie warunek.",
  },
  {
    // Answer-first pod frazę „strony internetowe premium" (rebrand 2026-08:
    // to nasz najbardziej wygrywalny keyword; SXO 2026-08-27). Fakty z /cennik.
    q: "Czym różni się strona premium od zwykłej strony firmowej?",
    a: "Strona premium w KODA to projekt w całości szyty na miarę: indywidualne animacje, często grafika 3D (WebGL/Three.js) i dopracowany każdy detal interakcji — od 12 900 zł netto, realizacja 5–8 tygodni. Zwykła strona firmowa (od 6 900 zł) opiera się na naszym sprawdzonym standardzie: autorski kod i szybkość te same, mniej indywidualnych animacji. W obu wypadkach zakres i termin są zapisane w umowie.",
  },
  {
    q: "Czy strona będzie dobrze widoczna w Google?",
    a: "Każdą stronę KODA buduje z technicznym SEO w standardzie: poprawna struktura, szybkość, responsywność i dane strukturalne. To fundament widoczności. Same pozycje w Google budują się potem treścią i czasem — i to możemy prowadzić razem w ramach opieki po starcie.",
  },
  {
    q: "Co z opieką po starcie?",
    a: "Start strony to początek, nie koniec. W KODA zakres opieki zapisujemy w umowie: aktualizacje, bezpieczeństwo i rozwijanie strony razem z Twoim biznesem. Nie znikamy po wdrożeniu.",
  },
  {
    q: "Jak przebiega cały proces?",
    a: "W KODA zaczynamy od rozmowy — mówisz, co ma się znaleźć na stronie i jak ma działać. Na tej podstawie projektujemy i budujemy całość, a potem pokazujemy Ci gotową stronę. Wtedy wspólnie dopinamy szczegóły i nanosimy poprawki, aż wszystko będzie dokładnie tak, jak chcesz. Zakres i termin masz w umowie od pierwszego dnia.",
  },
  {
    // Sygnał lokalny (Bielsko-Biała) w cytowalnym pasażu — odpowiada na pytania
    // typu „czy pracujecie zdalnie / skąd jesteście" (AEO + local SEO).
    q: "Skąd jesteście i czy pracujecie zdalnie?",
    a: "KODA Studio pracuje z Bielska-Białej, a projekty prowadzimy zdalnie dla firm z całej Polski. Spotkania robimy online, postępy pokazujemy na bieżąco, a cały zakres i termin są zapisane w umowie — dojazdy nie są do niczego potrzebne.",
  },
  {
    q: "Jak szybko odpowiadacie?",
    a: "Na każde zapytanie odpowiadamy w KODA w ciągu 24 godzin — zawsze ta sama osoba, która prowadzi Twój projekt.",
  },
];
