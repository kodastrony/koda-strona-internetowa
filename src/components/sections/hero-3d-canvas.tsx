"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { SceneStage, type SceneProps } from "@/components/scene3d/scene-stage";
import { TOTEM_VARIANTS } from "@/components/scene3d/home/variants";
import { HeroPoster } from "@/components/scene3d/scene-poster";
import type { KodaBus } from "@/components/scene3d/scenes/cosmos";

/* ══════════════════════════════════════════════════════════════════════════
   Hero3DCanvas — CIĘŻKA, three-zależna część hero, wydzielona za granicę
   dynamic import().

   PO CO: SceneStage statycznie importuje @react-three/fiber + drei. Gdyby hero
   importował SceneStage wprost, three/fiber/drei trafiałyby do grafu strony
   głównej na KAŻDYM urządzeniu — także na tierze „static" (poster), gdzie 3D
   się nie renderuje. Tu cały ten kod jest ZA dynamic(ssr:false): hero montuje
   <Hero3DCanvas> dopiero gdy tier to dopuszcza (low/medium/high) i na idle.
   „static" nigdy go nie montuje → import() nie startuje → chunk three NIE jest
   pobierany (koniec ~20 s ładowania i ~232 KB na słabym sprzęcie/wolnym łączu).

   bus = most intro (z useIntroOrchestra w Hero3D) — scena czyta onReady/onIntroEnd.
   ══════════════════════════════════════════════════════════════════════════ */

const HomeTotemScene = dynamic(() => import("@/components/scene3d/scenes/home-totem"), {
  ssr: false,
});
const CFG = TOTEM_VARIANTS.c;

export default function Hero3DCanvas({ bus }: { bus: KodaBus }) {
  const Wrapped = useMemo(() => {
    return function HomeTotemC(p: SceneProps) {
      return <HomeTotemScene {...p} bus={bus} variant={CFG} />;
    };
  }, [bus]);

  return (
    <SceneStage
      scene={Wrapped}
      camera={{ position: [0, 0, 8], fov: 38 }}
      maskStops="black 74%, transparent 96%"
      coverSvh={155}
      poster={<HeroPoster />}
      fadeIn={false}
    />
  );
}
