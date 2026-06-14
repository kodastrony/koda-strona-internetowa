/* ══════════════════════════════════════════════════════════════════════════
   intro-timings — JEDNA partytura intro 3D (strona 1 i strona 3 piaskownicy).

   DOM (biały overlay, ciemny panel-sweep, kaskada treści) i CANVAS (litery /
   szkło / jedwab) odmierzają te same fazy od tego samego zera = momentu
   gotowości sceny (geometria liter zbudowana / scena zamontowana). Stałe są
   lustrem żywego intro 2D (intro-animation.tsx + lib/motion INTRO_DURATION).
   ══════════════════════════════════════════════════════════════════════════ */

/** Strona 1 — litery 3D: rise → oddech → podwójny sweep → fade overlayu. */
export const P1_INTRO = {
  /** Czas wjazdu jednej litery (quartOut, jak intro 2D). */
  rise: 0.7,
  /** Odstęp między literami K→O→D→A. */
  stagger: 0.1,
  /** Wjazd całości: rise + 3·stagger. */
  riseTotal: 0.7 + 3 * 0.1,
  /** Oddech między wjazdem a liniami. */
  breath: 0.06,
  /** Start podwójnego sweepu (panel tła L→P + przebarwienie liter P→L). */
  sweepStart: 0.7 + 3 * 0.1 + 0.06,
  /** Czas sweepu (obie linie). */
  sweep: 0.7,
  /** Kotwica treści hero = koniec linii (jak INTRO_DURATION na żywo). */
  base: 0.7 + 3 * 0.1 + 0.06 + 0.7,
  /** Fade białego overlayu (final kadr = ciemne tło + grafitowe litery). */
  fade: 0.28,
  /** Pełen czas życia overlayu. */
  total: 0.7 + 3 * 0.1 + 0.06 + 0.7 + 0.28,
} as const;

/** Strona 3 — dwie linie odkrycia: tło L→P (crossing), szkło+logo P→L. */
export const P3_INTRO = {
  /** Chwila bieli przed ruchem (widz rejestruje scenę). */
  hold: 0.22,
  /** Start obu linii. */
  sweepStart: 0.22,
  /** Czas odkrycia (obie linie jednocześnie, spotkanie na szkle ~73%). */
  sweep: 0.9,
  /** Kotwica treści = koniec linii. */
  base: 0.22 + 0.9,
  /** Dośpiew sceny (szkło osiada) — overlay już nie istnieje (linie w scenie). */
  settle: 0.5,
} as const;

/** Strona 4 — szklane litery × kosmos: mgławica oddycha → litery wjeżdżają
    kolejno z głębi → ŚWIATŁO STRONY przelatuje za kolumną i zapala litery
    (refrakcja flaruje per litera). Intro w całości ciemne, w canvasie. */
export const P4_INTRO = {
  /** Narodziny mgławicy (świat budzi się pierwszy — antycypacja). */
  world: 0.45,
  /** Wjazd jednej litery (quartOut — lustro intro 2D). */
  rise: 0.66,
  /** Odstęp K→O→D→A. */
  stagger: 0.09,
  /** Start wjazdu liter (świat już oddycha). */
  lettersStart: 0.22,
  /** Start przelotu światła (zachodzi na lądowanie A — overlapping action). */
  sweepStart: 1.06,
  /** Czas przelotu światła przez kolumnę. */
  sweep: 0.78,
  /** Kotwica treści hero = światło osiada za kolumną. */
  base: 1.06 + 0.78,
  /** Dośpiew (flary gasną, idle przejmuje). */
  settle: 0.34,
  /** Pełen czas partytury (po nim onIntroEnd). */
  total: 1.06 + 0.78 + 0.34,
} as const;

/** Strona 5 — monolit × kosmos: bryły wjeżdżają z LEKKIM obrotem (sprężyna
    niesie jaw z −49° do spoczynku), a klucz światła obiega kolumnę —
    ściany liter zapalają się kolejno (intro = cieniowanie, nie kurtyna). */
export const P5_INTRO = {
  /** Wjazd jednej bryły. */
  rise: 0.72,
  /** Odstęp K→O→D→A. */
  stagger: 0.09,
  /** Start wjazdu brył. */
  lettersStart: 0.16,
  /** Start obiegu klucza światła wokół kolumny. */
  sweepStart: 0.96,
  /** Czas obiegu (azymut −80°→+36°). */
  sweep: 0.82,
  /** Kotwica treści hero (scena 3D: osiadanie światła) — czyta ją home-totem. */
  base: 0.96 + 0.82,
  /** ⚡ Kotwica DOM-owej treści hero (H1/opis/CTA) — ŚWIADOMIE wcześniejsza niż
      `base`. Treść H1 to element LCP strony; trzymanie jej do ~1,5 s (sync ze
      światłem sceny) psuło Core Web Vitals przy 1. wizycie. Tu wjeżdża ~0,5 s,
      a intro 3D gra DALEJ swój pełny czas — scena czyta `base`/`sweep`/`total`,
      NIE to pole (patrz home-totem.tsx). Dotyczy tylko 1. wizyty; powracający
      i tak mają 0,15 (useIntroOrchestra zwraca 0,15 przy skipped). */
  copyBase: 0.8,
  /** Dośpiew (sprężyna jaw domyka spoczynek). */
  settle: 0.4,
  /** Pełen czas partytury. */
  total: 0.96 + 0.82 + 0.4,
} as const;
