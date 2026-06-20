"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Miękkie wygaszenie poświaty na wszystkich 4 krawędziach pudełka (≈12% pasy).
 *  Składane przez mask-composite:intersect (iloczyn osi) — patrz <GlowField>.
 *  Dla pudełek WĘŻSZYCH niż viewport (karty, panele): brzeg gradientu wpada w
 *  pole widzenia, więc trzeba go zgasić, inaczej twardy prostokątny „outline". */
const GLOW_EDGE_MASK_BOTH =
  "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), " +
  "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)";

/** Tylko PIONOWE wygaszenie (góra/dół). Dla poświat PEŁNOEKRANOWYCH (wrapper
 *  `inset-x-0` = pełna szerokość viewportu): pozioma maska 88% gasiła poświatę
 *  ~12% PRZED prawą krawędzią ekranu → widoczny pionowy SZEW (poświata znika,
 *  dalej goła kanwa = „biały pas przy prawej krawędzi"), który DODATKOWO jechał
 *  z dryfem. Bez poziomej maski światło dochodzi do KRAWĘDZI EKRANU i jest cięte
 *  czysto przez html{overflow-x:clip} (źródło światła zza kadru) — zero szwu w
 *  polu widzenia. Pionowa maska zostaje: górę/dół pudełka trzeba wygasić, bo te
 *  krawędzie wypadają WEWNĄTRZ ekranu (poziomy szew byłby widoczny). */
const GLOW_EDGE_MASK_VERTICAL =
  "linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)";

/* ── GlowField — „oświetlenie sceny" zamiast płaskiego bloba ───────────────
   Jedno źródło światła = TRZY nałożone radialne gradienty w jednym
   background-image (zero dodatkowych warstw):

     • CORE    — gorący, mały, nasycony (oklch L .68 C .24, hue sekcji),
     • HALO    — większy, przesunięty o kilka %, hue ściągnięte w stronę
                 fioletu (300) → światło „łamie się" jak w obiektywie,
     • AMBIENT — ogromny, ledwo widoczny, zdesaturowany (hue 285) → sekcja
                 siedzi we wspólnej atmosferze strony.

   Alfa spada wykładniczo (÷~3 na stop), a stop 0-alfa jest ściągnięty do
   ≤80%, więc krawędź gradientu NIGDY nie ląduje na krawędzi elementu (to
   właśnie te obcięte krawędzie wyglądały tanio). Miękkość jest ZAPIECZONA
   w gradiencie — żadnego filter:blur na wielkich warstwach (drogi paint).

   Pozycjonowanie zostawiamy wołającemu (absolute + inset z „bleedem" poza
   sekcję, często w <Parallax>); `drift` włącza podprogowy dryf .koda-blob. */

export function glowBackground(hue: number, x: number, y: number, strength = 1): string {
  // Halo ściąga hue w połowie drogi do fioletu (300) — wspólna „pogoda" strony.
  const halo = hue + (300 - hue) * 0.5;
  const a = (v: number) => (v * strength).toFixed(3);
  return [
    `radial-gradient(ellipse 30% 22% at ${x}% ${y}%, oklch(0.68 0.24 ${hue} / ${a(0.15)}) 0%, oklch(0.68 0.24 ${hue} / ${a(0.055)}) 38%, oklch(0.68 0.24 ${hue} / ${a(0.018)}) 60%, oklch(0.68 0.24 ${hue} / 0) 78%)`,
    `radial-gradient(ellipse 58% 44% at ${x + 4}% ${y - 3}%, oklch(0.55 0.19 ${halo} / ${a(0.085)}) 0%, oklch(0.55 0.19 ${halo} / 0) 70%)`,
    `radial-gradient(ellipse 115% 90% at ${x - 8}% ${y + 10}%, oklch(0.42 0.1 285 / ${a(0.05)}) 0%, oklch(0.42 0.1 285 / 0) 78%)`,
  ].join(", ");
}

interface GlowFieldProps {
  /** Hue OKLCH źródła światła (pink 340 · magenta 324 · violet 300 · indigo 273). */
  hue?: number;
  /** Środek światła w % szerokości/wysokości elementu. */
  x?: number;
  y?: number;
  /** Mnożnik alfa całego pola (0–1; indigo trzymać ≤0.7). */
  strength?: number;
  /** Podprogowy dryf (transform-only). Czas per-instancja, np. 19/26/33. */
  drift?: boolean;
  driftDuration?: number;
  /** Które krawędzie wygaszać maską:
   *  • "both" (domyślne) — wszystkie 4 (pudełka węższe od viewportu: karty/panele),
   *  • "vertical" — tylko góra/dół; poświata dochodzi do KRAWĘDZI EKRANU (dla
   *    poświat PEŁNOEKRANOWYCH `inset-x-0` — bez tego pozioma maska 88% robi szew
   *    przy prawej/lewej krawędzi, patrz GLOW_EDGE_MASK_VERTICAL),
   *  • "none" — bez maski. */
  edgeFade?: "both" | "vertical" | "none";
  className?: string;
  style?: React.CSSProperties;
}

export function GlowField({
  hue = 340,
  x = 50,
  y = 50,
  strength = 1,
  drift = false,
  driftDuration = 26,
  edgeFade = "both",
  className,
  style,
}: GlowFieldProps) {
  const blobRef = useRef<HTMLDivElement>(null);
  // Pełnoekranowe poświaty (edgeFade≠"both") nie mają poziomej maski → przy
  // dryfie pudełko musi WYSTAWAĆ poza ekran w poziomie, inaczej skrajna faza
  // dryfu (translate −4%, scale 1) odsłaniałaby ~4% pas gołej kanwy przy prawej
  // krawędzi (a ruch w prawo „przykrywałby" go — dokładnie zgłaszany szew).
  // Bleed −8% z każdej strony pokrywa cały zakres dryfu (−4%…+5%) z zapasem;
  // html{overflow-x:clip} ucina nadmiar (zero scrolla). Pionowy bleed jak dotąd.
  const horizontalBleed = edgeFade !== "both";

  // Dryf PAUZUJE daleko poza ekranem (ten sam wzorzec co marquee): uśpiona
  // animacja nie tyka kompozytora i pozwala zdemotować/odzyskać teksturę
  // warstwy. `alternate` + play-state wznawia z tej samej klatki — zero
  // zmiany wizualnej. Duży rootMargin = budzimy się na długo przed wjazdem.
  useEffect(() => {
    if (!drift) return;
    const el = blobRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.style.animationPlayState = entry.isIntersecting ? "running" : "paused";
      },
      { rootMargin: "60% 0px 60% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [drift]);

  // ★ Maska gaśnie poświatę do ZERA na krawędziach pudełka. Bez niej radialny
  // gradient (zwł. duży „ambient", przesunięty ku brzegowi) jest NIEZEROWY na
  // krawędzi warstwy GPU → twardy prostokątny „outline", który dodatkowo JEŹDZI
  // z dryfem `koda-blob` (translate+scale) i parallaxem. "both" gasi 4 krawędzie
  // (mask-composite:intersect = iloczyn osi) dla pudełek węższych od ekranu.
  // "vertical" gasi tylko górę/dół — pełnoekranowa poświata dochodzi do krawędzi
  // ekranu (cięta przez html{overflow-x:clip}), bez szwu przy prawej krawędzi.
  const maskStyle: React.CSSProperties =
    edgeFade === "none"
      ? {}
      : edgeFade === "vertical"
        ? { maskImage: GLOW_EDGE_MASK_VERTICAL, WebkitMaskImage: GLOW_EDGE_MASK_VERTICAL }
        : {
            maskImage: GLOW_EDGE_MASK_BOTH,
            WebkitMaskImage: GLOW_EDGE_MASK_BOTH,
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          };

  // Pełnoekranowy bleed (horizontalBleed) MUSI być cięty poziomo NA WRAPPERZE
  // (= szerokość viewportu, inset-x-0), inaczej blob wystaje −8% poza ekran i
  // robi poziomy scroll (root overflow-x:clip tego nie łapał). overflow-x:clip
  // tnie nadmiar poziomy DOKŁADNIE na krawędzi ekranu (światło zza kadru), a
  // overflow-y:visible ZACHOWUJE pionowy bleed (−8% góra/dół) bez zmian —
  // [spec: clip + visible nie wymusza zmiany żadnej osi]. Poświata wypełnia więc
  // całą szerokość przy każdej fazie dryfu, bez szwu i bez scrolla.
  const clipStyle: React.CSSProperties = horizontalBleed
    ? { overflowX: "clip", overflowY: "visible" }
    : {};

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      style={{ ...maskStyle, ...clipStyle, ...style }}
    >
      <div
        ref={blobRef}
        className={cn("absolute", drift && "koda-blob")}
        style={{
          // Bleed pionowy daje dryfowi zapas (krawędzie i tak gasi maska/clip).
          // Pełnoekranowe (horizontalBleed) bleedują TEŻ w poziomie, by żadna
          // faza dryfu nie odsłoniła pasa gołej kanwy przy bocznej krawędzi.
          inset: drift ? (horizontalBleed ? "-8% -8%" : "-8% 0") : "0",
          backgroundImage: glowBackground(hue, x, y, strength),
          ...(drift ? ({ "--blob-dur": `${driftDuration}s` } as React.CSSProperties) : null),
        }}
      />
    </div>
  );
}
