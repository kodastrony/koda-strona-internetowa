"use client";

import { MotionConfig } from "motion/react";

/**
 * Globalny kontekst ruchu dla całej strony.
 *
 * `reducedMotion="user"` sprawia, że WSZYSTKIE animacje motion/react (FadeUp,
 * Reveal, hero, work, menu, kontakt…) respektują systemowe „ogranicz ruch":
 * animacje transform/layout są wyłączane (skok do końca), zostaje tylko opacity.
 * Globalny CSS w globals.css neutralizuje jedynie CSS-transition/animation —
 * to pokrywa lukę dla ruchu sterowanego JS-em.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
