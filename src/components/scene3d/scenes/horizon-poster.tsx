"use client";

/* ══════════════════════════════════════════════════════════════════════════
   HorizonPoster — CSS-owy „świt nad planetą" (look-alike shadera horizon.tsx).

   Po co: świt-WebGL jest jedynym naprawdę kosztownym (fill-rate) elementem strony,
   więc na słabym sprzęcie / telefonie (tier low/static) i przy utracie kontekstu
   GO NIE montujemy. Ale finał („Zbudujmy stronę…") MA wyglądać tak samo na każdym
   urządzeniu — ciemna wyspa, z której WSCHODZI różowo-biały świt. Ta warstwa daje
   dokładnie to, statycznie: kilka radialnych poświat zakotwiczonych u DOŁU sekcji
   (jak crest planety w shaderze), w kolorach marki (BRAND.pink/pinkBright/violet).

   Tło jest PRZEZROCZYSTE — poster maluje tylko ŚWIATŁO na ciemnej bazie sekcji
   (tak jak shader maluje światło na kanwie). Poświaty gasną ku górze, więc szew
   FAQ→Statement zostaje czysty (u góry widać ciemny scrub kanwy). „Born-ramp"
   wejścia jest zbędny — to statyka, więc zero kosztu po pierwszej klatce.

   Nie importuje Three/R3F → bezpieczne w HorizonBackdropLazy (chunk three NIE
   trafia na low/static).
   ══════════════════════════════════════════════════════════════════════════ */

export function HorizonPoster() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      {/* Welon fioletu (najwyżej sięga, najsłabszy) — niebo nad horyzontem. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(135% 92% at 50% 122%, rgba(154,99,239,0.26) 0%, rgba(154,99,239,0.10) 42%, rgba(154,99,239,0) 70%)",
        }}
      />
      {/* Łuna różu marki — główna masa świtu wschodzącego zza dolnej krawędzi.
          Sięga aż w okolice treści (jak shader przy PROG_PEAK), żeby finał naprawdę
          „świecił się", nie był ciemnym pasem z muśnięciem różu na dnie. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(118% 66% at 50% 112%, rgba(207,67,184,0.6) 0%, rgba(207,67,184,0.26) 36%, rgba(207,67,184,0.06) 62%, rgba(207,67,184,0) 78%)",
        }}
      />
      {/* Jądro świtu — gorące, biało-różowe, szerokie pasmo tuż przy dolnej krawędzi
          (odpowiednik crestu/dawnCore w shaderze; to ono najmocniej „świeci się"). */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(86% 38% at 50% 104%, rgba(255,240,250,0.7) 0%, rgba(255,94,200,0.5) 22%, rgba(255,94,200,0.12) 50%, rgba(255,94,200,0) 70%)",
        }}
      />
    </div>
  );
}
