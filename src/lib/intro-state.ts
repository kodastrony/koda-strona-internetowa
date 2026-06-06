/**
 * Współdzielona flaga „intro odegrane w tym załadowaniu strony".
 *
 * Module-scoped → resetuje się przy twardym odświeżeniu (F5), ale TRWA przez
 * nawigację SPA. Dzięki temu Hero wie, czy intro w ogóle się odegra:
 *  • pierwsze (twarde) wejście, bez reduced-motion → intro gra → Hero czeka
 *    (delay = INTRO_DURATION), żeby tekst wszedł zsynchronizowany z intro.
 *  • nawigacja SPA z innej podstrony / reduced-motion → intro NIE gra → Hero
 *    pokazuje treść NATYCHMIAST (delay 0), zamiast ~2.4 s pustego kadru.
 */
let played = false;

export const introHasPlayed = (): boolean => played;
export const markIntroPlayed = (): void => {
  played = true;
};
