"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
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
const FEATURED = [
  {
    id:      "vitanova",
    title:   "VitaNova",
    type:    "Sklep internetowy",
    bg:      "linear-gradient(150deg,#0d0514 0%,#1d0a2e 55%,#290e3f 100%)",
    glow:    "#cf43b8",
    rgb:     "207,67,184",
  },
  {
    id:      "syntra",
    title:   "Syntra Tech",
    type:    "Strona korporacyjna",
    bg:      "linear-gradient(135deg,#030c18 0%,#071525 55%,#0b2038 100%)",
    glow:    "#38bdf8",
    rgb:     "56,189,248",
  },
  {
    id:      "mazur",
    title:   "Kancelaria Mazur",
    type:    "Strona firmowa",
    bg:      "linear-gradient(160deg,#0e0808 0%,#1b1008 55%,#271808 100%)",
    glow:    "#d4a848",
    rgb:     "212,168,72",
  },
  {
    id:      "horeca",
    title:   "Horeca Trade",
    type:    "Platforma B2B",
    bg:      "linear-gradient(145deg,#040e0c 0%,#091c16 55%,#0f2920 100%)",
    glow:    "#34d399",
    rgb:     "52,211,153",
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
    <FadeUp inView delay={delay} y={48} duration={0.9} ease={EASE.expo}>
      <Link href={`/realizacje/${project.id}`} className="block">
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
            {/* Rounded clip — overflow + shadow live here */}
            <div
              className="relative rounded-[20px] overflow-hidden"
              style={{
                transition: `box-shadow 600ms ${cssBezier(EASE.expo)}`,
                boxShadow: hovered
                  ? `0 50px 100px -20px rgba(0,0,0,0.42),
                     0 0  60px -15px rgba(${project.rgb},0.22)`
                  : "0 15px 50px -15px rgba(0,0,0,0.18)",
              }}
            >
              {/* Aspect-ratio shell: 3 ÷ 4.2 ≈ portrait */}
              <div className="relative" style={{ paddingBottom: "138%" }}>

                {/* Background gradient */}
                <div
                  className="absolute inset-0"
                  style={{ background: project.bg }}
                />

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

                {/* Decorative website screenshot */}
                <MockWebsite accent={project.glow} />

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
                      color:         "rgba(255,255,255,0.46)",
                      marginTop:     4,
                    }}
                  >
                    {project.type}
                  </p>
                </div>

                {/* Inset border highlight on hover */}
                <motion.div
                  className="absolute inset-0 rounded-[20px] pointer-events-none"
                  style={{ border: `1px solid rgba(${project.rgb},0.40)` }}
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

  // Scroll-parallax kolumn — RĘCZNY, bulletproof: passive scroll listener +
  // bezpośredni transform (translate3d = GPU). Działa w KAŻDEJ przeglądarce,
  // 1:1 ze scrollem = płynne i przewidywalne. Tylko md+ (mobile: kolumny się
  // stackują → bez parallaxu, by nie było pionowych dziur). reduced-motion → off.
  useEffect(() => {
    const section = sectionRef.current;
    const a = colARef.current;
    const b = colBRef.current;
    if (!section || !a || !b) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const update = () => {
      if (window.innerWidth < 768) {
        a.style.transform = "";
        b.style.transform = "";
        return;
      }
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      // p: 0 = sekcja wjeżdża od dołu, 1 = wyjeżdża górą; c: −0.5..0.5 (środek = 0)
      const p = Math.max(0, Math.min(1, (vh - rect.top) / (vh + rect.height)));
      const c = p - 0.5;
      a.style.transform = `translate3d(0, ${(-c * 150).toFixed(1)}px, 0)`; // ±75
      b.style.transform = `translate3d(0, ${(-c * 60).toFixed(1)}px, 0)`;  // ±30
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      data-header-theme="light"
      className="relative overflow-hidden"
      style={{ backgroundColor: "#f7f7f7" }}
    >
      <div className="container-koda section-y">

        {/* ── Section header — per-line clip reveal (płynne wejście tekstu) ── */}
        <div className="mb-[clamp(52px,8vw,108px)]">
          <h2 className="text-section-title" style={{ color: "#0c0c0c" }}>
            {["Wybrane", "realizacje"].map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                viewport={{ once: true, margin: "0px 0px -80px 0px" }}
                transition={{ duration: 0.85, ease: EASE.smooth, delay: i * 0.1 }}
              >
                {line}
              </motion.span>
            ))}
          </h2>

          <FadeUp inView delay={0.24} y={20} className="mt-5">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "clamp(0.875rem, 1.1vw, 1rem)",
                color:      "rgba(12,12,12,0.46)",
                maxWidth:   380,
                lineHeight: 1.7,
              }}
            >
              Projekty stron internetowych, z których jesteśmy dumni.
            </p>
          </FadeUp>
        </div>

        {/* ── Two-column staggered grid (kolumny z parallaxem na scroll) ──── */}
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(16px,2.5vw,28px)" }}
        >
          {/* Left column — dryfuje szybciej (JS parallax, ±75px) */}
          <div
            ref={colARef}
            className="flex flex-col"
            style={{ gap: "clamp(16px,2.5vw,28px)", willChange: "transform" }}
          >
            <WorkCard project={FEATURED[0]} delay={0}    />
            <WorkCard project={FEATURED[2]} delay={0.08} />
          </div>

          {/* Right column — stagger (md+) + dryfuje wolniej (JS parallax, ±30px) */}
          <div
            ref={colBRef}
            className="work-right-stagger flex flex-col"
            style={{ gap: "clamp(16px,2.5vw,28px)", willChange: "transform" }}
          >
            <WorkCard project={FEATURED[1]} delay={0.05} />
            <WorkCard project={FEATURED[3]} delay={0.13} />
          </div>
        </div>

        {/* ── View-all CTA ─────────────────────────────────────── */}
        <div style={{ marginTop: "clamp(56px,8vw,96px)" }}>
          <FadeUp inView delay={0.08} className="flex justify-center">
            <PillLink
              href="/realizacje"
              bg="#0c0c0c"
              border="rgba(12,12,12,0.05)"
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
