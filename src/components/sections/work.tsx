"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "motion/react";
import { EASE, cssBezier } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { PillLink } from "@/components/ui/pill-link";

// ── Project data ──────────────────────────────────────────────────────
// `image` = path to a real screenshot in /public (e.g. "/realizacje/vitanova.jpg").
// Empty → the decorative MockWebsite stands in. Card bg + glow stay in ONE
// coherent magenta/violet family (the brand world), so placeholders never clash;
// real screenshots bring their own colour and read as a rich, varied portfolio.
const FEATURED = [
  {
    id:      "vitanova",
    title:   "VitaNova",
    type:    "Sklep internetowy",
    year:    "2024",
    image:   "",
    bg:      "linear-gradient(150deg,#16111c 0%,#241430 55%,#301a3c 100%)",
    glow:    "#cf43b8",
    rgb:     "207,67,184",
  },
  {
    id:      "syntra",
    title:   "Syntra Tech",
    type:    "Strona korporacyjna",
    year:    "2024",
    image:   "",
    bg:      "linear-gradient(135deg,#120f1d 0%,#1b1432 55%,#221a44 100%)",
    glow:    "#a472f0",
    rgb:     "164,114,240",
  },
  {
    id:      "mazur",
    title:   "Kancelaria Mazur",
    type:    "Strona firmowa",
    year:    "2023",
    image:   "",
    bg:      "linear-gradient(160deg,#170f1a 0%,#281234 55%,#341846 100%)",
    glow:    "#e85cc0",
    rgb:     "232,92,192",
  },
  {
    id:      "horeca",
    title:   "Horeca Trade",
    type:    "Platforma B2B",
    year:    "2023",
    image:   "",
    bg:      "linear-gradient(145deg,#130f1c 0%,#1d1332 55%,#281a40 100%)",
    glow:    "#c77dd0",
    rgb:     "199,125,208",
  },
] as const;

type Project = (typeof FEATURED)[number];

// ── Mock website screenshot (decorative) ─────────────────────────────
function MockWebsite({ accent }: { accent: string }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none select-none"
      aria-hidden={true}
    >
      {/* Browser chrome */}
      <div
        style={{
          position:     "absolute",
          inset:        "0 0 auto 0",
          height:       "7.5%",
          display:      "flex",
          alignItems:   "center",
          gap:          6,
          padding:      "0 4%",
          background:   "rgba(0,0,0,0.18)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {(["accent", "dim", "dimmer"] as const).map((k, i) => (
          <div
            key={k}
            style={{
              width:        7,
              height:       7,
              borderRadius: "50%",
              background:   i === 0 ? accent : i === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
              opacity:      i === 0 ? 0.75 : 1,
            }}
          />
        ))}
        <div
          style={{
            flex:         1,
            height:       "38%",
            borderRadius: 999,
            background:   "rgba(255,255,255,0.05)",
            marginLeft:   "2%",
          }}
        />
      </div>

      {/* Hero block */}
      <div
        style={{
          position:   "absolute",
          top:        "9.5%",
          left:       "3%",
          right:      "3%",
          height:     "36%",
          borderRadius: "2%",
          background: "rgba(255,255,255,0.03)",
          border:     "1px solid rgba(255,255,255,0.05)",
          padding:    "4% 5% 0",
          overflow:   "hidden",
        }}
      >
        <div style={{ height: "8%",  width: "70%", borderRadius: 3, background: "rgba(255,255,255,0.16)", marginBottom: "5%" }} />
        <div style={{ height: "8%",  width: "54%", borderRadius: 3, background: "rgba(255,255,255,0.10)", marginBottom: "5%" }} />
        <div style={{ height: "8%",  width: "40%", borderRadius: 3, background: "rgba(255,255,255,0.07)", marginBottom: "9%" }} />
        <div style={{ height: "15%", width: "28%", borderRadius: 999, background: accent, opacity: 0.58 }} />
      </div>

      {/* Feature cards row */}
      <div
        style={{
          position:              "absolute",
          left:                  "3%",
          right:                 "3%",
          top:                   "47.5%",
          bottom:                "15%",
          display:               "grid",
          gridTemplateColumns:   "1fr 1fr 1fr",
          gap:                   "2.5%",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              borderRadius:   "3%",
              background:     "rgba(255,255,255,0.03)",
              border:         "1px solid rgba(255,255,255,0.045)",
              display:        "flex",
              flexDirection:  "column" as const,
              justifyContent: "flex-end",
              padding:        "0 8% 10%",
            }}
          >
            <div style={{ height: 5, width: "60%", borderRadius: 3, background: "rgba(255,255,255,0.12)", marginBottom: 4 }} />
            <div style={{ height: 5, width: "80%", borderRadius: 3, background: "rgba(255,255,255,0.07)" }} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── 3-D tilt card ──────────────────────────────────────────────────────
   Hover: karta przechyla się PRECYZYJNIE w stronę kursora (tight spring) +
   światło (glare) podąża dokładnie pod kursorem = wrażenie głębi i precyzji.
   Wjazd: fade + rise (TYLKO opacity+translate = czysty GPU composite, bez jank). */
function WorkCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Pozycja kursora w karcie, znormalizowana do −0.5..0.5.
  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  // Tight, responsywny spring — wysoka czułość, minimalny overshoot (dokładność).
  const TILT = { stiffness: 260, damping: 26, mass: 0.4 };
  const rotateY = useSpring(useTransform(mX, [-0.5, 0.5], reduce ? [0, 0] : [-9, 9]), TILT);
  const rotateX = useSpring(useTransform(mY, [-0.5, 0.5], reduce ? [0, 0] : [7, -7]), TILT);

  const scaleVal = useMotionValue(1);
  const scale    = useSpring(scaleVal, { stiffness: 220, damping: 26 });

  // Glare — blob świetlny przesuwany transformem (GPU, bez repaintu) ku kursorowi.
  const gx = useTransform(mX, [-0.5, 0.5], ["-22%", "22%"]);
  const gy = useTransform(mY, [-0.5, 0.5], ["-22%", "22%"]);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = wrapperRef.current?.getBoundingClientRect();
      if (!r) return;
      mX.set((e.clientX - r.left) / r.width  - 0.5);
      mY.set((e.clientY - r.top)  / r.height - 0.5);
    },
    [mX, mY],
  );

  const onEnter = useCallback(() => { setHovered(true); scaleVal.set(1.03); }, [scaleVal]);
  const onLeave = useCallback(() => {
    setHovered(false);
    mX.set(0);
    mY.set(0);
    scaleVal.set(1);
  }, [mX, mY, scaleVal]);

  return (
    <FadeUp inView delay={delay} y={48} duration={0.7} ease={EASE.expo}>
      {/* Per-project detail pages (/realizacje/[id]) nie istnieją jeszcze (czekamy na
          prawdziwe realizacje) — link prowadzi na istniejącą listę /realizacje, żeby
          karta nigdy nie była 404 na statycznym eksporcie. Gdy powstaną podstrony,
          wrócić do href={`/realizacje/${project.id}`}. */}
      <Link href="/realizacje" aria-label={`${project.title} — ${project.type}`} className="block">
        {/* Perspective root — mierzy pozycję kursora */}
        <div
          ref={wrapperRef}
          style={{ perspective: "1000px" }}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {/* 3-D transform layer */}
          <motion.div
            style={{
              rotateX,
              rotateY,
              scale,
              transformStyle: "preserve-3d",
            }}
            className="will-change-transform"
          >
            {/* Rounded clip — overflow + hairline frame + dark-world shadow.
                (Big black shadows are invisible on a dark canvas; the lift comes
                from a soft drop + an accent glow that blooms on hover.) */}
            <div
              className="relative overflow-hidden rounded-[22px]"
              style={{
                border:     "1px solid rgba(255,255,255,0.09)",
                transition: `box-shadow 600ms ${cssBezier(EASE.expo)}`,
                boxShadow: hovered
                  ? `0 44px 90px -34px rgba(0,0,0,0.75),
                     0 0 80px -22px rgba(${project.rgb},0.42)`
                  : "0 26px 60px -36px rgba(0,0,0,0.6)",
              }}
            >
              {/* Aspect-ratio shell — landscape (real website screenshots are wide) */}
              <div className="relative" style={{ paddingBottom: "66%" }}>

                {/* Background gradient (brand-world base; also the matte behind
                    a real screenshot while it loads) */}
                <div
                  className="absolute inset-0"
                  style={{ background: project.bg }}
                />

                {/* Real screenshot — drop a path into FEATURED[].image and it
                    replaces the decorative mock. object-top shows the hero fold. */}
                {project.image && (
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.type}`}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover object-top"
                  />
                )}

                {/* Ambient glow orb */}
                {/* Ambient glow — softness baked into the gradient (NO filter:blur;
                    blur forces costly re-raster on every animated frame = jank). */}
                <div
                  className="absolute pointer-events-none"
                  aria-hidden={true}
                  style={{
                    width:        "82%",
                    height:       "56%",
                    top:          "4%",
                    left:         "9%",
                    borderRadius: "50%",
                    background:   `radial-gradient(ellipse at center, rgba(${project.rgb},0.26) 0%, rgba(${project.rgb},0.10) 38%, transparent 72%)`,
                    opacity:      hovered ? 1 : 0.7,
                    transition:   `opacity 500ms ${cssBezier(EASE.expo)}`,
                  }}
                />

                {/* Decorative website mock — stands in until a real screenshot
                    is supplied via FEATURED[].image */}
                {!project.image && <MockWebsite accent={project.glow} />}

                {/* Cursor-following glare (light catches the surface under the pointer) */}
                <motion.div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  aria-hidden={true}
                  style={{
                    opacity:    hovered ? 1 : 0,
                    transition: `opacity 450ms ${cssBezier(EASE.expo)}`,
                  }}
                >
                  <motion.div
                    style={{
                      position:   "absolute",
                      inset:      "-25%",
                      x:          gx,
                      y:          gy,
                      background: "radial-gradient(circle at center, rgba(255,255,255,0.18) 0%, transparent 55%)",
                    }}
                  />
                </motion.div>

                {/* Legibility gradient at bottom */}
                <div
                  className="absolute inset-x-0 bottom-0 pointer-events-none"
                  style={{
                    height:     "58%",
                    background: "linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.40) 42%, transparent 100%)",
                  }}
                />

                {/* Project info — bottom-right */}
                <div
                  className="absolute bottom-0 right-0 flex flex-col items-end"
                  style={{ padding: "clamp(14px,3vw,28px)" }}
                >
                  <h3
                    style={{
                      fontFamily:    "var(--font-heading)",
                      fontWeight:    800,
                      fontSize:      "clamp(1.15rem, 2.2vw, 1.65rem)",
                      letterSpacing: "-0.025em",
                      lineHeight:    1.05,
                      color:         "#ffffff",
                      textShadow:    "0 2px 14px rgba(0,0,0,0.55)",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontFamily:    "var(--font-body)",
                      fontSize:      "clamp(0.6rem, 0.88vw, 0.72rem)",
                      fontWeight:    400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color:         "rgba(255,255,255,0.56)",
                      marginTop:     5,
                    }}
                  >
                    {project.type} · {project.year}
                  </p>
                </div>

                {/* Inset accent border — blooms on hover */}
                <motion.div
                  className="absolute inset-0 rounded-[22px] pointer-events-none"
                  style={{ border: `1px solid rgba(${project.rgb},0.45)` }}
                  animate={{ opacity: hovered ? 1 : 0 }}
                  transition={{ duration: 0.35 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </Link>
    </FadeUp>
  );
}

// ══════════════════════════════════════════════════════════════════════
export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const colARef = useRef<HTMLDivElement>(null);
  const colBRef = useRef<HTMLDivElement>(null);

  // Scroll-parallax kolumn — transform pisany BEZPOŚREDNIO, ZSYNCHRONIZOWANY ze
  // scrollem (zero CSS-transition → kolumny są „przyklejone" do pozycji scrolla,
  // bez gumkowania; gładkość daje już Lenis). Odczyt rectu + zapis transformu raz
  // na klatkę (rAF-coalescing — wiele eventów scrolla na klatkę = jeden reflow).
  // Tylko transform (GPU). md+; mobile off; reduced-motion off.
  useEffect(() => {
    const section = sectionRef.current;
    const a = colARef.current;
    const b = colBRef.current;
    if (!section || !a || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const apply = () => {
      if (window.innerWidth < 768) {
        a.style.transform = "none";
        b.style.transform = "none";
        return;
      }
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // p: 0 = sekcja wjeżdża od dołu, 1 = wyjechała górą; c: −0.5..0.5 (środek = 0)
      const c = Math.max(-0.5, Math.min(0.5, (vh - rect.top) / (vh + rect.height) - 0.5));
      // SUBTLE drift only — the old ±360px shoved cards down on entry (the "huge
      // gap") then up on exit (the "cramped/overlap"). Gentle breathing instead.
      a.style.transform = `translate3d(0, ${(-c * 90).toFixed(1)}px, 0)`;  // lewa ±45px
      b.style.transform = `translate3d(0, ${(-c * 40).toFixed(1)}px, 0)`;  // prawa ±20px
    };

    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => { raf = 0; apply(); });
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", apply);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-theme="dark"
      className="relative overflow-hidden"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container-koda section-y">

        {/* ── Section header — title left, context right, so the heading fills
            the row instead of floating over a slab of empty space ── */}
        <div className="mb-[clamp(36px,4.5vw,64px)] flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <FadeUp inView>
              <span className="label-koda mb-5 block">Realizacje</span>
            </FadeUp>
            <h2 className="text-section-title">
              {["Wybrane", "realizacje"].map((line, i) => (
                <motion.span
                  key={line}
                  data-reveal
                  className="block"
                  initial={{ clipPath: "inset(0 100% 0 0)" }}
                  whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                  viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                  transition={{ duration: 0.85, ease: EASE.out, delay: 0.06 + i * 0.1 }}
                >
                  {line}
                </motion.span>
              ))}
            </h2>
          </div>

          <FadeUp inView delay={0.2} y={18} className="md:max-w-[360px] md:pb-2 md:text-right">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "clamp(0.95rem, 1.05vw, 1.05rem)",
                color:      "var(--color-ink-muted)",
                lineHeight: 1.6,
              }}
            >
              Projekty, które łączą dopracowany design z realnymi wynikami w sprzedaży.
            </p>
          </FadeUp>
        </div>

        {/* ── Two-column staggered grid (kolumny z parallaxem na scroll) ──── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(20px,2.8vw,36px)" }}
        >
          {/* Left column — dryfuje szybciej (JS parallax, ±75px) */}
          <div
            ref={colARef}
            className="flex flex-col"
            style={{ gap: "clamp(20px,2.8vw,36px)", willChange: "transform" }}
          >
            <WorkCard project={FEATURED[0]} delay={0}    />
            <WorkCard project={FEATURED[2]} delay={0.08} />
          </div>

          {/* Right column — stagger (md+) + dryfuje wolniej (JS parallax, ±30px) */}
          <div
            ref={colBRef}
            className="work-right-stagger flex flex-col"
            style={{ gap: "clamp(20px,2.8vw,36px)", willChange: "transform" }}
          >
            <WorkCard project={FEATURED[1]} delay={0.05} />
            <WorkCard project={FEATURED[3]} delay={0.13} />
          </div>
        </div>

        {/* ── View-all CTA — secondary action → quiet surface pill (the pink
            pill is reserved for the primary "Darmowa wycena" beat) ── */}
        <div style={{ marginTop: "clamp(48px,6vw,84px)" }}>
          <FadeUp inView delay={0.08} className="flex justify-center">
            <PillLink
              href="/realizacje"
              bg="var(--color-surface-1)"
              border="var(--color-line-strong)"
              className="px-9 py-4"
            >
              Sprawdź wszystkie realizacje
            </PillLink>
          </FadeUp>
        </div>

      </div>
    </section>
  );
}
