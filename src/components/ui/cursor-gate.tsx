"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* ── CursorGate — kursor tylko tam, gdzie ma sens, i tylko wtedy ładowany ────
   Kod kursora (rAF-pętla, warstwy dot/ring) jest bezużyteczny na dotyku i przy
   reduced-motion — wcześniej i tak SZEDŁ w bundlu każdego telefonu (PSI mobile
   2026-08-27: „Ogranicz nieużywany JavaScript"). dynamic() wydziela go do
   osobnego chunka, dociąganego DOPIERO gdy matchMedia potwierdzi fine-pointer.
   ssr:false bez kosztu — kursor i tak nie renderuje nic w SSR. */
const CustomCursor = dynamic(
  () => import("./custom-cursor").then((m) => m.CustomCursor),
  { ssr: false }
);

export function CursorGate() {
  const [enabled, setEnabled] = useState(false);
  // matchMedia dostępne dopiero po mount (SSR-safe) — jednorazowy set jest tu
  // zamierzony, jak w hero.tsx (ten sam wyjątek od reguły).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (fine && !reduce) setEnabled(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  return enabled ? <CustomCursor /> : null;
}
