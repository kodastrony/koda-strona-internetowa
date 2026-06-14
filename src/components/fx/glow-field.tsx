"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Miękkie wygaszenie poświaty na wszystkich 4 krawędziach pudełka (≈12% pasy).
 *  Składane przez mask-composite:intersect (iloczyn osi) — patrz <GlowField>. */
const GLOW_EDGE_MASK =
  "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%), " +
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
  className,
  style,
}: GlowFieldProps) {
  const blobRef = useRef<HTMLDivElement>(null);

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

  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute", className)}
      // ★ Maska gaśnie poświatę do ZERA na WSZYSTKICH 4 krawędziach pudełka.
      // Bez niej radialny gradient (zwł. duży „ambient", przesunięty ku brzegowi
      // przy x≈8/90) jest NIEZEROWY na krawędzi warstwy GPU → twardy prostokątny
      // „outline", który dodatkowo JEŹDZIŁ z dryfem `koda-blob` (translate+scale)
      // i parallaxem. Teraz światło wtapia się miękko w ramkę (jak źródło zza
      // kadru) — zero prostokąta. mask-composite:intersect = iloczyn obu osi.
      style={{
        maskImage: GLOW_EDGE_MASK,
        WebkitMaskImage: GLOW_EDGE_MASK,
        maskComposite: "intersect",
        WebkitMaskComposite: "source-in",
        ...style,
      }}
    >
      <div
        ref={blobRef}
        className={cn("absolute", drift && "koda-blob")}
        style={{
          // Bleed pionowy daje dryfowi zapas; krawędzie i tak gasi maska wrappera.
          inset: drift ? "-8% 0" : "0",
          backgroundImage: glowBackground(hue, x, y, strength),
          ...(drift ? ({ "--blob-dur": `${driftDuration}s` } as React.CSSProperties) : null),
        }}
      />
    </div>
  );
}
