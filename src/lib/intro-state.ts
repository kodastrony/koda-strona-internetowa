/**
 * Współdzielona flaga „intro odegrane".
 *
 * Dwie warstwy:
 *  • module-scoped `played` — TRWA przez nawigację SPA (intro nie powtarza się
 *    przy przejściu między podstronami w tej samej sesji).
 *  • sessionStorage — TRWA też przez TWARDE odświeżenie (F5) i powrót na stronę
 *    w obrębie tej samej karty/sesji. Dzięki temu intro gra DOKŁADNIE RAZ na
 *    sesję (audyt: replay intro po reloadzie irytował zabieganych/powracających).
 *    Nowa karta / nowa sesja → intro znów gra (pierwsze, „wow" wejście).
 *
 * Hero/Header czytają to, by zdecydować, czy czekać na intro (delay =
 * INTRO_DURATION), czy pokazać treść natychmiast (delay 0).
 */
const KEY = "koda-intro-played";
let played = false;

export const introHasPlayed = (): boolean => {
  if (played) return true;
  if (typeof window !== "undefined") {
    try {
      if (window.sessionStorage.getItem(KEY) === "1") {
        played = true;
        return true;
      }
    } catch {
      /* sessionStorage niedostępny (tryb prywatny itp.) → tylko flaga modułowa */
    }
  }
  return false;
};

export const markIntroPlayed = (): void => {
  played = true;
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(KEY, "1");
    } catch {
      /* noop */
    }
  }
};
