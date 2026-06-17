"use client";

import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { useTierProfile } from "@/lib/device-tier";

/* ══════════════════════════════════════════════════════════════════════════
   OrbitsAccentLazy — leniwy, bramkowany media-query wrapper na OrbitsAccent.

   PO CO: OrbitsAccent (planeta+orbity pod Usługami) renderuje się TYLKO ≥1024px,
   ale gdy page.tsx importował go statycznie, jego chunk (three/fiber/drei +
   ORBITS_FRAG, ~73 KB) trafiał do EAGER grafu strony głównej na KAŻDYM urządzeniu
   — także na telefonie, gdzie akcent i tak jest null. Tu bramka media-query stoi
   PRZED dynamic import(): na mobile komponent zwraca null, więc import() nigdy się
   nie odpala i chunk NIE jest pobierany; na desktopie ładuje się leniwie (akcent
   jest poniżej zgięcia, pod Usługami — opóźnienie niewidoczne).

   matchMedia jest świadomie ZDUPLIKOWANE z accents.tsx (useDesktopAccents):
   import tego hooka z accents.tsx wciągnąłby cały moduł akcentu z powrotem do
   grafu strony i zniweczył podział. SSR-safe: serwer = false → zero rozjazdu
   hydracji (statyczny HTML i tak nie zawierał akcentu). Logika renderu akcentu
   jest NIEZMIENIONA — to wyłącznie zmiana KIEDY ładuje się kod, nie CO renderuje.
   ══════════════════════════════════════════════════════════════════════════ */

const ACCENTS_MQ = "(min-width: 1024px)";

function subscribe(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia(ACCENTS_MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function useDesktop(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(ACCENTS_MQ).matches,
    () => false
  );
}

const OrbitsAccentInner = dynamic(
  () => import("@/components/scene3d/home/accents").then((m) => m.OrbitsAccent),
  { ssr: false }
);

export function OrbitsAccentLazy() {
  // Bramka media-query (≥1024) ORAZ tier: orbity (3. kontekst WebGL) tylko na
  // tierze „high". Na low/medium/static komponent zwraca null → import() nie
  // startuje → chunk akcentu NIE jest pobierany. Reaktywnie: gdy watchdog zejdzie
  // high→medium, orbity znikają (zwolniony kontekst WebGL). Hooki bezwarunkowo.
  const desktop = useDesktop();
  const accents = useTierProfile().accents;
  if (!desktop || !accents) return null;
  return <OrbitsAccentInner />;
}
