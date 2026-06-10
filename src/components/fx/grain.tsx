/* ── Grain — globalna warstwa szumu (jeden „filmowy" materiał) ─────────────
   Server component: czysty div, styl w globals.css (.koda-grain). Fixed nad
   treścią sekcji (z 50), pod paskiem scrolla/intro/menu/headerem/kursorem.
   Ditheruje banding ciemnych gradientów i skleja sekcje w jeden świat. */
export function Grain() {
  return <div aria-hidden="true" className="koda-grain" />;
}
