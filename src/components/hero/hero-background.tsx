"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import { GlowField } from "@/components/fx/glow-field";
import { HERO_BASE } from "./hero-config";

/* ══════════════════════════════════════════════════════════════════════════
   HeroBackground — ciemna AURORA marki pod hero (wypełnia absolute inset-0).
   Płynna mgławica: dwie miękkie, dryfujące poświaty (różne tempa = nigdy nie
   synchronizują) + ukośna „wstęga" + winieta. Dość ciemna, by treść była
   czytelna. Baza OPAQUE (HERO_BASE) — intro odsłania ją linią L→P; u dołu hero
   maska (w hero.tsx) wygasza całość do PageCanvas → płynne przejście.

   Wszystkie animacje = transform/opacity (kompozytor GPU). Zero animowania
   background-position/filter (drogi paint).
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Subtelny parallax od myszy (dwie warstwy w przeciwne strony = głębia) ──
   pointermove jest THROTTLOWANY do jednej aktualizacji na klatkę (rAF) — bez
   tego handler odpala z częstotliwością zdarzeń wskaźnika i karmił springy
   nadmiarowo. Warstwy konsumujące px/py mają will-change:transform (promocja
   warstwy kompozytora) → translate dużych gradientów bez repaintu. */
function useMouseParallax(amount: number) {
  const reduce = useReducedMotion();
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const spring = { stiffness: 55, damping: 18, mass: 0.6 };
  const px = useSpring(mvx, spring);
  const py = useSpring(mvy, spring);
  useEffect(() => {
    if (reduce) return;
    let raf = 0;
    let nx = 0;
    let ny = 0;
    const onMove = (e: PointerEvent) => {
      nx = (e.clientX / window.innerWidth - 0.5) * amount;
      ny = (e.clientY / window.innerHeight - 0.5) * amount;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        mvx.set(nx);
        mvy.set(ny);
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [amount, mvx, mvy, reduce]);
  return { px, py };
}

export function HeroBackground() {
  const { px, py } = useMouseParallax(48);
  const vx = useTransform(px, (v) => v * -0.6);
  const vy = useTransform(py, (v) => v * -0.6);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: HERO_BASE }}
    >
      {/* Głęboki gradient bazowy (śliwka → granat) */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(155deg, #160a1f 0%, #0c0712 45%, #0a0a16 100%)" }}
      />
      {/* Wstęga aurory — ukośny pas, miękki */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, transparent 28%, rgba(196,92,240,0.10) 50%, rgba(111,120,240,0.08) 62%, transparent 78%)",
          maskImage: "linear-gradient(to bottom, black 66%, transparent 97%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 66%, transparent 97%)",
        }}
      />
      {/* Światła aurory — dryf + parallax myszy (róż lewa-góra, fiolet prawa-góra) */}
      <motion.div className="absolute inset-0" style={{ x: px, y: py, willChange: "transform" }}>
        <GlowField
          hue={330}
          x={20}
          y={26}
          strength={1.25}
          drift
          driftDuration={23}
          className="inset-0"
        />
      </motion.div>
      <motion.div className="absolute inset-0" style={{ x: vx, y: vy, willChange: "transform" }}>
        <GlowField
          hue={288}
          x={84}
          y={20}
          strength={1.0}
          drift
          driftDuration={31}
          className="inset-0"
        />
      </motion.div>
      {/* Winieta dolna — utrzymuje kontrast pod treścią */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 30% 38%, transparent 46%, rgba(7,5,12,0.72) 100%)",
          maskImage: "linear-gradient(to bottom, black 60%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 96%)",
        }}
      />
    </div>
  );
}
