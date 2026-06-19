/**
 * Współdzielona flaga „intro już zagrane W TYM ŁADOWANIU STRONY".
 *
 * ZAKRES = pojedyncze załadowanie dokumentu (NIE sesja, NIE localStorage):
 *  • module-scoped `played` TRWA przez nawigację SPA (klik w logo z podstrony →
 *    powrót na „/" NIE odpala intro od nowa — byłoby irytujące w obrębie wizyty),
 *  • ale KAŻDE twarde odświeżenie / nowe wejście (F5, nowa karta, wpisanie URL)
 *    przeładowuje moduł → `played` wraca do `false` → intro gra ZNOWU.
 *
 * To świadoma decyzja produktowa (życzenie właściciela): intro „dwóch linii" to
 * wizytówka marki i ma witać przy każdym wejściu na stronę, nie tylko pierwszym.
 *
 * Hero (decyzja „czy montować overlay intro") oraz Header (czy opóźnić wejście
 * o INTRO_DURATION) czytają TĘ SAMĄ flagę — jedno źródło prawdy, zero rozjazdu
 * (wcześniej Hero trzymał własny klucz sessionStorage, a Header inny → niespójność).
 */
let played = false;

/** Czy intro już zostało odegrane w tym załadowaniu strony (SPA-trwałe). */
export const introHasPlayed = (): boolean => played;

/** Oznacz intro jako odegrane (wołane przez Hero po zakończeniu/pominięciu intro
 *  oraz gdy intro jest pomijane — reduced-motion). */
export const markIntroPlayed = (): void => {
  played = true;
};
