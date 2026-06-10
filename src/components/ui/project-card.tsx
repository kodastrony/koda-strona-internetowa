"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { EASE, cssBezier } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import type { Project } from "@/lib/projects";

/* ── MockWebsite — decorative placeholder screenshot ──────────────────────
   Stands in until a real screenshot is supplied via Project.image. Exported so
   the /realizacje/[id] showcase can reuse the same decorative mock at scale. */
export function MockWebsite({ accent }: { accent: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden={true}>
      {/* Browser chrome */}
      <div
        style={{
          position: "absolute",
          inset: "0 0 auto 0",
          height: "7.5%",
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "0 4%",
          background: "rgba(0,0,0,0.18)",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
        }}
      >
        {(["accent", "dim", "dimmer"] as const).map((k, i) => (
          <div
            key={k}
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background:
                i === 0 ? accent : i === 1 ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.08)",
              opacity: i === 0 ? 0.75 : 1,
            }}
          />
        ))}
        <div
          style={{
            flex: 1,
            height: "38%",
            borderRadius: 999,
            background: "rgba(255,255,255,0.05)",
            marginLeft: "2%",
          }}
        />
      </div>

      {/* Hero block */}
      <div
        style={{
          position: "absolute",
          top: "9.5%",
          left: "3%",
          right: "3%",
          height: "36%",
          borderRadius: "2%",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.05)",
          padding: "4% 5% 0",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "8%",
            width: "70%",
            borderRadius: 3,
            background: "rgba(255,255,255,0.16)",
            marginBottom: "5%",
          }}
        />
        <div
          style={{
            height: "8%",
            width: "54%",
            borderRadius: 3,
            background: "rgba(255,255,255,0.10)",
            marginBottom: "5%",
          }}
        />
        <div
          style={{
            height: "8%",
            width: "40%",
            borderRadius: 3,
            background: "rgba(255,255,255,0.07)",
            marginBottom: "9%",
          }}
        />
        <div
          style={{
            height: "15%",
            width: "28%",
            borderRadius: 999,
            background: accent,
            opacity: 0.58,
          }}
        />
      </div>

      {/* Feature cards row */}
      <div
        style={{
          position: "absolute",
          left: "3%",
          right: "3%",
          top: "47.5%",
          bottom: "15%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "2.5%",
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              borderRadius: "3%",
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.045)",
              display: "flex",
              flexDirection: "column" as const,
              justifyContent: "flex-end",
              padding: "0 8% 10%",
            }}
          >
            <div
              style={{
                height: 5,
                width: "60%",
                borderRadius: 3,
                background: "rgba(255,255,255,0.12)",
                marginBottom: 4,
              }}
            />
            <div
              style={{
                height: 5,
                width: "80%",
                borderRadius: 3,
                background: "rgba(255,255,255,0.07)",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ProjectCard — 3-D tilt portfolio card (shared) ───────────────────────
   Hover: the card tilts PRECISELY toward the cursor (tight spring) and a glare
   follows the pointer = depth + precision. Entrance: fade + rise (transform +
   opacity only = clean GPU composite). Links to the case-study page. */
export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  const TILT = { stiffness: 260, damping: 26, mass: 0.4 };
  const rotateY = useSpring(useTransform(mX, [-0.5, 0.5], reduce ? [0, 0] : [-9, 9]), TILT);
  const rotateX = useSpring(useTransform(mY, [-0.5, 0.5], reduce ? [0, 0] : [7, -7]), TILT);

  const scaleVal = useMotionValue(1);
  const scale = useSpring(scaleVal, { stiffness: 220, damping: 26 });

  const gx = useTransform(mX, [-0.5, 0.5], ["-22%", "22%"]);
  const gy = useTransform(mY, [-0.5, 0.5], ["-22%", "22%"]);

  // Cache the card's rect so onMove (fires up to ~60×/s) never reads layout per
  // frame. Refreshed on enter and — while hovered — on scroll/resize, since the
  // parallax columns move the card under the cursor.
  const rectRef = useRef<DOMRect | null>(null);
  const measure = useCallback(() => {
    rectRef.current = wrapperRef.current?.getBoundingClientRect() ?? null;
  }, []);

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const r = rectRef.current;
      if (!r) return;
      mX.set((e.clientX - r.left) / r.width - 0.5);
      mY.set((e.clientY - r.top) / r.height - 0.5);
    },
    [mX, mY]
  );

  const onEnter = useCallback(() => {
    measure();
    setHovered(true);
    scaleVal.set(1.03);
  }, [measure, scaleVal]);
  const onLeave = useCallback(() => {
    setHovered(false);
    mX.set(0);
    mY.set(0);
    scaleVal.set(1);
  }, [mX, mY, scaleVal]);

  // Keep the cached rect fresh while hovered (scroll/parallax shifts the card).
  // Only attached during hover, so there's zero cost when not interacting.
  useEffect(() => {
    if (!hovered) return;
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [hovered, measure]);

  return (
    <FadeUp inView delay={delay} y={48} duration={0.7} ease={EASE.expo}>
      <Link
        href={`/realizacje/${project.id}`}
        aria-label={`${project.title} — ${project.type}`}
        className="block"
      >
        <div
          ref={wrapperRef}
          style={{ perspective: "1000px" }}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          <motion.div
            style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}
            className="will-change-transform"
          >
            <div
              className="relative overflow-hidden rounded-[22px]"
              style={{
                border: "1px solid rgba(255,255,255,0.09)",
                transition: `box-shadow 600ms ${cssBezier(EASE.expo)}`,
                boxShadow: hovered
                  ? `0 44px 90px -34px rgba(0,0,0,0.75), 0 0 80px -22px rgba(${project.rgb},0.42)`
                  : "0 26px 60px -36px rgba(0,0,0,0.6)",
              }}
            >
              <div className="relative" style={{ paddingBottom: "66%" }}>
                <div className="absolute inset-0" style={{ background: project.bg }} />

                {/* Honest "Koncept" badge — flags demo/concept pieces so nothing
                    reads as a fake real client. Disappears once project.concept is false. */}
                {project.concept && (
                  <span
                    className="absolute top-0 left-0 z-[2] m-[clamp(10px,2vw,18px)] rounded-full border px-3 py-1 font-heading text-[10px] font-bold tracking-[0.16em] uppercase"
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      borderColor: "rgba(255,255,255,0.28)",
                      backgroundColor: "rgba(0,0,0,0.4)",
                    }}
                  >
                    Koncept
                  </span>
                )}

                {project.image && (
                  <Image
                    src={project.image}
                    alt={`${project.title} — ${project.type}`}
                    fill
                    sizes="(min-width: 768px) 45vw, 90vw"
                    className="object-cover object-top"
                  />
                )}

                {/* Ambient glow — softness baked into the gradient (no filter:blur). */}
                <div
                  className="pointer-events-none absolute"
                  aria-hidden={true}
                  style={{
                    width: "82%",
                    height: "56%",
                    top: "4%",
                    left: "9%",
                    borderRadius: "50%",
                    background: `radial-gradient(ellipse at center, rgba(${project.rgb},0.26) 0%, rgba(${project.rgb},0.10) 38%, transparent 72%)`,
                    opacity: hovered ? 1 : 0.7,
                    transition: `opacity 500ms ${cssBezier(EASE.expo)}`,
                  }}
                />

                {!project.image && <MockWebsite accent={project.glow} />}

                {/* Cursor-following glare */}
                <motion.div
                  className="pointer-events-none absolute inset-0 overflow-hidden"
                  aria-hidden={true}
                  style={{
                    opacity: hovered ? 1 : 0,
                    transition: `opacity 450ms ${cssBezier(EASE.expo)}`,
                  }}
                >
                  <motion.div
                    style={{
                      position: "absolute",
                      inset: "-25%",
                      x: gx,
                      y: gy,
                      background:
                        "radial-gradient(circle at center, rgba(255,255,255,0.18) 0%, transparent 55%)",
                    }}
                  />
                </motion.div>

                {/* Legibility gradient */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0"
                  style={{
                    height: "58%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.84) 0%, rgba(0,0,0,0.40) 42%, transparent 100%)",
                  }}
                />

                {/* Project info */}
                <div
                  className="absolute right-0 bottom-0 flex flex-col items-end"
                  style={{ padding: "clamp(14px,3vw,28px)" }}
                >
                  <h3
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontWeight: 800,
                      fontSize: "clamp(1.15rem, 2.2vw, 1.65rem)",
                      letterSpacing: "-0.025em",
                      lineHeight: 1.05,
                      color: "#ffffff",
                      textShadow: "0 2px 14px rgba(0,0,0,0.55)",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "clamp(0.6rem, 0.88vw, 0.72rem)",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase" as const,
                      color: "rgba(255,255,255,0.56)",
                      marginTop: 5,
                    }}
                  >
                    {project.type} · {project.concept ? "Koncept" : project.year}
                  </p>
                </div>

                {/* Inset accent border — blooms on hover */}
                <motion.div
                  className="pointer-events-none absolute inset-0 rounded-[22px]"
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
