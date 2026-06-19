"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, type Bezier } from "@/lib/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { HorizonBackdropLazy } from "@/components/scene3d/scenes/horizon-lazy";
import { CONTACT } from "@/lib/constants";

/* ── Final CTA "moment" — the conversion climax before the footer ──────────
   NOT a full-bleed pink slab (that was the old flashbang). Instead the brand
   pink SWELLS out of the dark world as a soft bloom and settles back into it,
   so the section emerges from and returns to the same canvas as everything
   above: one world, no hard seam. A centered headline + a risk-reducer line +
   the white "Darmowa wycena" pill (the QuoteButton) close the page.

   ENTRANCE (one coordinated beat, driven by a single `useInView`): the bloom
   scales/fades up while the copy cascades (headline clip-reveal → sub → CTA pop).
   Decorations get their own pop-in + scroll-parallax drift. */

/** Decorative "+" glyph — echoes the hero's plus motif, very low contrast. */
function Plus({
  size = "clamp(26px, 3vw, 48px)",
  opacity = 0.16,
}: {
  size?: string;
  opacity?: number;
}) {
  return (
    <span
      className="block leading-none select-none"
      style={{
        fontFamily: "var(--font-heading)",
        fontWeight: 400,
        fontSize: size,
        color: `rgba(255,255,255,${opacity})`,
      }}
    >
      +
    </span>
  );
}

/**
 * A decorative ornament with TWO independent motions on TWO elements, so their
 * transforms never collide:
 *  • OUTER wrapper → scroll PARALLAX. A passive scroll listener (in <Statement>)
 *    writes `translate3d(0,Y,0)` straight onto it; `data-parallax` is the px
 *    travel (± flips direction / depth). Reads/writes are coalesced to one rAF
 *    per frame and the drift is locked to scroll (Lenis smooths it; no CSS
 *    transition → no rubber-band). Works in every browser.
 *  • INNER motion.div → the ENTRANCE: fade + scale (+ optional rotate) on
 *    `inView`, so each ornament pops in on its own beat just after the pink wipe.
 */
interface FloatDecorProps {
  inView: boolean;
  /** Parallax travel in px (peak-to-peak ≈ this). Negative drifts the other way. */
  speed: number;
  delay: number;
  duration?: number;
  scaleFrom?: number;
  rotateFrom?: number;
  ease?: Bezier;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

function FloatDecor({
  inView,
  speed,
  delay,
  duration = 0.9,
  scaleFrom = 0.6,
  rotateFrom = 0,
  ease = EASE.expo,
  className,
  style,
  children,
}: FloatDecorProps) {
  return (
    <div
      data-parallax={speed}
      className={cn("absolute", className)}
      style={{ willChange: "transform", ...style }}
    >
      <motion.div
        data-reveal
        initial={{ opacity: 0, scale: scaleFrom, rotate: rotateFrom }}
        animate={inView ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
        transition={{ duration, ease, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/** Expanding pink ripple from the click point — removes itself when done. */
function Ripple({ x, y, onDone }: { x: number; y: number; onDone: () => void }) {
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute z-[1] rounded-full"
      style={{
        left: x,
        top: y,
        width: 24,
        height: 24,
        marginLeft: -12,
        marginTop: -12,
        background: "rgba(207,67,184,0.45)",
      }}
      initial={{ scale: 0, opacity: 0.55 }}
      animate={{ scale: 26, opacity: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      onAnimationComplete={onDone}
    />
  );
}

/* ── White "Darmowa wycena" CTA ───────────────────────────────────────────
   The section's hero CTA — deliberately distinct from the shared dark PillLink.
   • HOVER: the pill smoothly "fills up". A dark panel WITH a white copy of the
     label is unveiled bottom→top by an animating clip-path; the resting (dark)
     label sits exactly beneath it, so the colour flips precisely at the rising
     fill line — always legible, perfectly smooth, and NOT a sliding swap. Plus a
     spring lift + soft shadow.
   • TAP: a pink ripple bursts from the pointer and the whole pill springs down
     (0.96) for a tactile press. */
function QuoteButton({ href, label }: { href: string; label: string }) {
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  // Monotonic counter → every ripple has a guaranteed-unique id (no Date.now()
  // collision on rapid clicks within the same millisecond).
  const rippleId = useRef(0);

  const spawnRipple = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    setRipples((prev) => [
      ...prev,
      { id: (rippleId.current += 1), x: e.clientX - r.left, y: e.clientY - r.top },
    ]);
  };

  // Rendered twice (resting copy + fill copy) so the two overlap pixel-exact.
  const renderLabel = () => (
    <>
      {label}
      <span aria-hidden="true" className="text-[22px] leading-none font-normal">
        +
      </span>
    </>
  );

  return (
    <Link href={href} className="inline-block rounded-full">
      <motion.div
        className="group relative inline-flex overflow-hidden rounded-full font-heading text-[12px] font-bold tracking-[0.2em] uppercase"
        onPointerDown={spawnRipple}
        whileHover={{ y: -3, boxShadow: "0 24px 52px -14px rgba(15,15,15,0.5)" }}
        whileTap={{ scale: 0.96 }}
        transition={{ type: "spring", stiffness: 420, damping: 24 }}
        style={{
          backgroundColor: "#ffffff",
          boxShadow: "0 10px 26px -16px rgba(15,15,15,0.35)",
          willChange: "transform",
        }}
      >
        {/* Click ripples — on the white base, behind the labels */}
        {ripples.map((r) => (
          <Ripple
            key={r.id}
            x={r.x}
            y={r.y}
            onDone={() => setRipples((prev) => prev.filter((p) => p.id !== r.id))}
          />
        ))}

        {/* Resting label — dark ink on white (this copy sizes the pill) */}
        <span className="relative z-10 flex items-center gap-5 px-10 py-5 text-[#0f0f0f]">
          {renderLabel()}
        </span>

        {/* Fill — dark panel + white label, unveiled bottom→top by clip-path.
            No sliding: the colour simply flips at the rising fill line. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-20 flex items-center gap-5 px-10 text-white transition-[clip-path] duration-[620ms] ease-[cubic-bezier(0.63,0.03,0.21,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0%_0_0_0)]"
          style={{ backgroundColor: "#0f0f0f" }}
        >
          {renderLabel()}
        </span>
      </motion.div>
    </Link>
  );
}

export function Statement() {
  // Single trigger orchestrates the whole "moment": the pink bloom swells while
  // the copy cascades, as ONE beat the user is actually looking at.
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-18% 0px -18% 0px" });
  // clip-path NIE jest transformem — MotionConfig reducedMotion="user" go nie
  // wyłącza (gasi tylko transform/layout). Wipe i nagłówki gate'ujemy ręcznie,
  // jak w shared <Reveal> (duration 0 → stan końcowy od razu).
  const reduce = useReducedMotion();

  // Content lands as the pink wipe sweeps across (wipe ≈ 1.15s; centre ≈ 0.55s).
  const BASE = 0.45;

  // ── Decoration parallax ────────────────────────────────────────────────
  // A passive scroll listener drives every `[data-parallax]` ornament: as the
  // section travels through the viewport it writes `translate3d(0,Y,0)` directly,
  // locked to scroll (no CSS transition → no rubber-band; Lenis already smooths the
  // scroll). Reads/writes are coalesced to one rAF per frame. Skipped for reduced-motion.
  const sectionRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const els = Array.from(section.querySelectorAll<HTMLElement>("[data-parallax]"));
    if (!els.length) return;

    const apply = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // c ∈ [-0.5, 0.5]: -0.5 = section entering from below, +0.5 = leaving the top.
      const c = Math.max(-0.5, Math.min(0.5, (vh - rect.top) / (vh + rect.height) - 0.5));
      // Gentler drift on phones (less room → keep ornaments well clear of copy).
      const factor = window.innerWidth < 768 ? 0.5 : 1;
      for (const el of els) {
        const speed = parseFloat(el.dataset.parallax ?? "0");
        el.style.transform = `translate3d(0, ${(-c * speed * factor).toFixed(1)}px, 0)`;
      }
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        apply();
      });
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    // resize też przez wrapper rAF (jak scroll) — koalescencja reflowów przy
    // zmianie orientacji/rozmiaru okna (apply() czyta layout: getBoundingClientRect).
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      // CIEMNA WYSPA w obu motywach (świt) → chrom headera (logo/przełącznik/
      // burger) zostaje BIAŁY także w trybie jasnym (inaczej czarne logo i ☀ są
      // niewidoczne na ciemnym tle). useHeaderTheme/custom-cursor czytają tę flagę.
      data-header-dark-island=""
      data-canvas="statement"
      className="relative isolate flex min-h-[90svh] flex-col items-center justify-center"
    >
      {/* ── CIEMNA BAZA (HOME-only fix „białego pasa") — GRADIENT: przezroczysta
          U GÓRY, ciemna U DOŁU. Góra przezroczysta → przejście FAQ→Statement
          zostaje GŁADKIM scrubem kanwy (jak było — NIE twarda krawędź; to ją
          wcześniej psułem pełną bazą). Dół ciemny (kolor holdu Statementu,
          var(--statement-base)) → zasłania prześwit jasnej kanwy przez
          półprzezroczyste, masko­wane DNO świtu przy zjeździe do stopki
          („biały pas"). Świt maluje NA niej → wygląd bez zmian. ── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, transparent 66%, var(--statement-base) 84%, var(--statement-base) 100%)",
        }}
      />

      {/* ── ŚWIT NAD PLANETĄ — finałowy klimaks: ciemny kosmos na plumowym
          holdzie kanwy (#521648), a różowo-biały świt WSCHODZI i ROZJAŚNIA SIĘ
          im głębiej zjedziesz (uProg ze scrolla). To sekcja, którą user
          pamięta jako „świecącą się". Sekcja = ciemna wyspa w OBU motywach
          (LIGHT_HOLDS.statement też plum) — biały tekst czytelny, świt gra. ── */}
      <HorizonBackdropLazy />

      {/* ── Wejście z FAQ: kontynuacja różowej łuny PRZEZ szew ────────────────
          FAQ ma łunę-zapowiedź H335 nad SWOJĄ dolną krawędzią (peak dokładnie na
          szwie, gdy patrzysz na granicę → foreshadow=1). Tu LUSTRZANA łuna nad
          GÓRNĄ krawędzią Statement schodzi tym samym różem w dół — róż nie urywa
          się na szwie, tylko płynnie przechodzi w ciemny świt. Identyczny gradient
          (tylko zakotwiczony u góry: 50% -2%) = przejście FAQ→Statement gładkie. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
        style={{
          height: "52vh",
          background:
            "radial-gradient(ellipse 120% 86% at 50% -2%, oklch(0.62 0.215 335 / 0.26) 0%, oklch(0.5 0.17 335 / 0.11) 42%, oklch(0.4 0.13 335 / 0.04) 64%, oklch(0.4 0.13 335 / 0) 82%)",
        }}
      />

      {/* Zejście do stopki — ciemne dno horyzontu wtapia się w ciepłą czerń
          stopki (#0a0609 = hold footer), zero plumowego paska na szwie. Wysokość
          viewport-relative (clamp): na wysokich ekranach świt sięga wyżej, więc
          ciemny wash MUSI dosięgnąć tam, gdzie różowe światło gaśnie (bez stopnia). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[clamp(192px,28vh,440px)]"
        style={{
          background:
            "linear-gradient(to top, #0a0609 0%, rgba(10,6,9,0.6) 42%, rgba(10,6,9,0) 100%)",
        }}
      />

      {/* ── Decorations — own pop-in + scroll-parallax drift (subtle, white on pink) ── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <FloatDecor
          inView={inView}
          speed={-160}
          delay={0.5}
          scaleFrom={0.3}
          rotateFrom={-50}
          ease={EASE.back}
          className="hidden md:block"
          style={{ top: "22%", left: "13%" }}
        >
          <Plus size="clamp(28px, 3vw, 46px)" opacity={0.32} />
        </FloatDecor>
        <FloatDecor
          inView={inView}
          speed={210}
          delay={0.62}
          scaleFrom={0.3}
          rotateFrom={46}
          ease={EASE.back}
          style={{ bottom: "23%", right: "15%" }}
        >
          <Plus size="clamp(24px, 2.6vw, 40px)" opacity={0.28} />
        </FloatDecor>
        <FloatDecor
          inView={inView}
          speed={-150}
          delay={0.7}
          scaleFrom={0.3}
          rotateFrom={-38}
          ease={EASE.back}
          className="hidden md:block"
          style={{ top: "30%", right: "18%" }}
        >
          <Plus size="clamp(18px, 2vw, 30px)" opacity={0.24} />
        </FloatDecor>

        {/* Faint ring — drifts, adds depth (md+ only) */}
        <FloatDecor
          inView={inView}
          speed={150}
          delay={0.8}
          duration={1.0}
          scaleFrom={0.5}
          className="hidden md:block"
          style={{ top: "26%", left: "20%" }}
        >
          <div
            style={{
              width: "clamp(80px, 9vw, 140px)",
              height: "clamp(80px, 9vw, 140px)",
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,0.22)",
            }}
          />
        </FloatDecor>
      </div>

      {/* ── Content — centered final-CTA composition (the conversion climax) ── */}
      <div
        ref={ref}
        className="container-koda relative z-10 flex flex-col items-center text-center"
        style={{
          paddingTop: "clamp(88px, 16vh, 200px)",
          paddingBottom: "clamp(88px, 16vh, 200px)",
        }}
      >
        <div className="max-w-[880px]">
          {/* Headline — the final hook. White ink; the pink is the ambient light,
              not the lettering (pink-on-pink would vanish). */}
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 600,
              fontSize: "clamp(2.1rem, 4.8vw, 3.9rem)",
              lineHeight: 1.07,
              letterSpacing: "-0.025em",
              color: "#ffffff",
            }}
          >
            {["Zbudujmy stronę,", "która przynosi klientów."].map((line, i) => (
              <motion.span
                key={i}
                data-reveal
                className="block"
                initial={{ clipPath: "inset(-40% 100% -40% 0)", opacity: 0 }}
                animate={inView ? { clipPath: "inset(-40% 0% -40% 0)", opacity: 1 } : undefined}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { duration: 0.85, ease: EASE.smooth, delay: BASE + i * 0.12 }
                }
              >
                {line}
              </motion.span>
            ))}
          </h2>

          {/* Sub — concrete risk-reducer (white-ish for contrast over the bloom) */}
          <motion.p
            data-reveal
            className="mx-auto mt-7"
            style={{
              maxWidth: "46ch",
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1rem, 1.2vw, 1.18rem)",
              lineHeight: 1.6,
              color: "#ffffff",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.7, ease: EASE.expo, delay: BASE + 0.34 }}
          >
            Opowiedz nam o swoim projekcie. Darmową wycenę i pierwszy pomysł dostajesz w 24 godziny.
            Bez zobowiązań.
          </motion.p>

          {/* CTA — the white "Darmowa wycena" pill + a secondary email link */}
          <motion.div
            data-reveal
            className="mt-11 flex flex-col items-center gap-6"
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={inView ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={{ duration: 0.6, ease: EASE.back, delay: BASE + 0.5 }}
          >
            <Magnetic strength={0.35}>
              <QuoteButton href="/kontakt" label="Zacznijmy projekt" />
            </Magnetic>
            {/* Pełna biel — white/85 spadał pod 4.5:1 na jasnym końcu gradientu. */}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-[14px] text-white underline-offset-4 transition-[text-decoration-color] hover:underline"
            >
              Napisz: {CONTACT.email}
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
