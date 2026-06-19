"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useTierProfile } from "@/lib/device-tier";

/* ══════════════════════════════════════════════════════════════════════════
   HorizonBackdropLazy — leniwy, tier-bramkowany ORAZ viewport-bramkowany
   wrapper na HorizonBackdrop (świt nad planetą = tło sekcji Statement).

   PO CO TIER-GATE: horizon.tsx statycznie importuje SectionStage → @react-three/
   fiber + drei. Bez bramki three trafiałby do grafu strony głównej na KAŻDYM
   urządzeniu. Na low/static komponent zwraca null → import() nie startuje →
   chunk three NIE jest pobierany.

   PO CO VIEWPORT-GATE (★): Statement leży tuż nad stopką — DALEKO pod pierwszym
   ekranem. Bez tej bramki ciężki chunk three.js parsował się zaraz po hydracji,
   konkurując z intro hero (klatki crossing) i wydłużając pierwsze wejście. Teraz
   import() startuje dopiero, gdy sekcja zbliża się do viewportu (Intersection
   Observer, rootMargin ~ pół ekranu) → intro hero jest gładkie, a three.js
   dociąga się DOPIERO, gdy faktycznie potrzebny. Statement i tak ma własne
   gradienty CSS, więc do tego czasu wygląda dobrze. Reaktywnie znika przy
   downgrade tieru.
   ══════════════════════════════════════════════════════════════════════════ */

const HorizonInner = dynamic(
  () => import("@/components/scene3d/scenes/horizon").then((m) => m.HorizonBackdrop),
  { ssr: false }
);

export function HorizonBackdropLazy() {
  // Hooki wołane bezwarunkowo (kolejność stała). low/static → horizon=false → null.
  const horizon = useTierProfile().horizon;
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    if (!horizon || near) return;
    const el = ref.current;
    if (!el) return;
    // Zamontuj (a tym samym pobierz chunk three) dopiero gdy sekcja zbliża się do
    // ekranu — ~pół viewportu zapasu, by świt zdążył się „urodzić" (born ramp),
    // zanim wejdzie w kadr. Jednorazowo: po pierwszym przecięciu odłączamy obserwatora.
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "60% 0px 60% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [horizon, near]);

  if (!horizon) return null;
  // Placeholder (absolute inset-0) = cel obserwacji; SectionStage też renderuje
  // absolute inset-0, więc zagnieżdżenie wypełnia tę samą `relative` sekcję.
  return (
    <div ref={ref} className="absolute inset-0">
      {near && <HorizonInner />}
    </div>
  );
}
