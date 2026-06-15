/* eslint-disable @next/next/no-img-element -- Static export (images.unoptimized): we ship
   hand-optimized webp with manual srcset/sizes; next/image can't srcset here. */
"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "motion/react";
import { EASE, cssBezier } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import type { Project } from "@/lib/projects";

/* ── MockWebsite — decorative fallback ─────────────────────────────────────
   Only stands in when a project has no real screenshot (Project.image === "").
   All current projects ship real crops, so this is a safety net. */
export function MockWebsite({ accent }: { accent: string }) {
  return (
    <div className="pointer-events-none absolute inset-0 select-none" aria-hidden={true}>
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
      <div
        style={{
          position: "absolute",
          top: "12%",
          left: "6%",
          width: "60%",
          height: "9%",
          borderRadius: 4,
          background: "rgba(255,255,255,0.14)",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "24%",
          left: "6%",
          width: "42%",
          height: "9%",
          borderRadius: 4,
          background: "rgba(255,255,255,0.08)",
        }}
      />
    </div>
  );
}

/* ── ProjectCard — 4:3 portfolio tile (shared) ────────────────────────────
   Full-bleed signature screenshot (the work IS the tile). One locked ratio
   across every card = the grid reads as one studio. Hover: precise 3-D tilt
   toward the cursor, a cursor-following glare, image zoom and an accent arrow
   that blooms — all reduced-motion gated. Links to the case study. */
export function ProjectCard({
  project,
  delay = 0,
  priority = false,
}: {
  project: Project;
  delay?: number;
  /** Eager-load the image (first row on /realizacje). Default lazy. */
  priority?: boolean;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState(false);

  // Hover-to-play video preview (desktop, fine pointer, motion allowed). Lazy:
  // the mp4 mounts only on first hover; never on touch / reduced-motion / mobile.
  const canHoverRef = useRef(false);
  const reducedRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mountVideo, setMountVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    canHoverRef.current = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (hovered && mountVideo && !reducedRef.current) v.play().catch(() => {});
    else v.pause();
  }, [hovered, mountVideo]);

  const mX = useMotionValue(0);
  const mY = useMotionValue(0);

  const TILT = { stiffness: 260, damping: 26, mass: 0.4 };
  const rotateY = useSpring(useTransform(mX, [-0.5, 0.5], reduce ? [0, 0] : [-11, 11]), TILT);
  const rotateX = useSpring(useTransform(mY, [-0.5, 0.5], reduce ? [0, 0] : [8, -8]), TILT);

  const scaleVal = useMotionValue(1);
  const scale = useSpring(scaleVal, { stiffness: 220, damping: 26 });

  const gx = useTransform(mX, [-0.5, 0.5], ["-22%", "22%"]);
  const gy = useTransform(mY, [-0.5, 0.5], ["-22%", "22%"]);

  // Cache the card's rect so onMove (≈60×/s) never reads layout per frame.
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
    scaleVal.set(1.04);
    if (project.video && canHoverRef.current && !reducedRef.current) setMountVideo(true);
  }, [measure, scaleVal, project.video]);
  const onLeave = useCallback(() => {
    setHovered(false);
    mX.set(0);
    mY.set(0);
    scaleVal.set(1);
  }, [mX, mY, scaleVal]);

  // Keep the cached rect fresh while hovered (scroll/parallax shifts the card).
  useEffect(() => {
    if (!hovered) return;
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [hovered, measure]);

  const src640 = project.image.replace(/\.webp$/, "-640.webp");

  return (
    <FadeUp inView delay={delay} y={48} duration={0.7} ease={EASE.expo}>
      <Link
        href={`/realizacje/${project.id}`}
        aria-label={`${project.title} — ${project.tagline}`}
        className="group block"
      >
        <div
          ref={wrapperRef}
          style={{ perspective: "1000px" }}
          onMouseMove={onMove}
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
        >
          {/* motion/react auto-manages will-change: it promotes the layer only
              while the tilt/scale springs are animating and releases it at rest —
              so no idle compositor layers (no hardcoded will-change). */}
          <motion.div style={{ rotateX, rotateY, scale, transformStyle: "preserve-3d" }}>
            <div
              className="relative overflow-hidden rounded-[22px]"
              style={{
                border: "1px solid rgba(255,255,255,0.09)",
                transition: `box-shadow 600ms ${cssBezier(EASE.expo)}`,
                boxShadow: hovered
                  ? `0 44px 90px -34px rgba(0,0,0,0.78), 0 0 80px -22px rgba(${project.rgb},0.42)`
                  : "0 26px 60px -36px rgba(0,0,0,0.6)",
              }}
            >
              {/* 4:3 frame — the #1 cohesion lever across all cards. */}
              <div className="relative" style={{ paddingBottom: "75%" }}>
                <div className="absolute inset-0" style={{ background: project.bg }} />

                {project.image ? (
                  <img
                    src={project.image}
                    srcSet={`${src640} 640w, ${project.image} 1200w`}
                    sizes="(min-width: 768px) 45vw, 92vw"
                    alt={`${project.title} — ${project.type}`}
                    width={1200}
                    height={900}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={priority ? "high" : "auto"}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    style={{
                      transform: hovered && !reduce ? "scale(1.06)" : "scale(1)",
                      transition: `transform 700ms ${cssBezier(EASE.expo)}`,
                      // Promote to its own layer only during the hover zoom (no idle layers).
                      willChange: hovered && !reduce ? "transform" : "auto",
                    }}
                  />
                ) : (
                  <MockWebsite accent={project.glow} />
                )}

                {/* Hover video preview — fades in over the still once it can play */}
                {mountVideo && project.video && (
                  <video
                    ref={videoRef}
                    src={project.video}
                    poster={project.image}
                    muted
                    loop
                    playsInline
                    preload="none"
                    aria-hidden="true"
                    onLoadedData={() => setVideoReady(true)}
                    className="absolute inset-0 h-full w-full object-cover object-top"
                    style={{
                      opacity: hovered && videoReady ? 1 : 0,
                      transition: `opacity 450ms ${cssBezier(EASE.expo)}`,
                    }}
                  />
                )}

                {/* Ambient brand glow (softness baked in — no filter:blur). */}
                <div
                  className="pointer-events-none absolute"
                  aria-hidden={true}
                  style={{
                    width: "82%",
                    height: "52%",
                    top: "3%",
                    left: "9%",
                    borderRadius: "50%",
                    background: `radial-gradient(ellipse at center, rgba(${project.rgb},0.20) 0%, rgba(${project.rgb},0.07) 40%, transparent 72%)`,
                    opacity: hovered ? 1 : 0.7,
                    transition: `opacity 500ms ${cssBezier(EASE.expo)}`,
                    mixBlendMode: "screen",
                  }}
                />

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
                        "radial-gradient(circle at center, rgba(255,255,255,0.16) 0%, transparent 55%)",
                    }}
                  />
                </motion.div>

                {/* Legibility gradient */}
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0"
                  style={{
                    height: "62%",
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.86) 0%, rgba(0,0,0,0.44) 44%, transparent 100%)",
                  }}
                />

                {/* Title + category (always visible — static HTML for SEO/a11y) */}
                <div
                  className="absolute right-0 bottom-0 left-0 flex items-end justify-between gap-3"
                  style={{ padding: "clamp(16px,3vw,28px)" }}
                >
                  <div className="min-w-0">
                    <h3
                      style={{
                        fontFamily: "var(--font-heading)",
                        fontWeight: 800,
                        fontSize: "clamp(1.3rem, 2.3vw, 1.85rem)",
                        letterSpacing: "-0.025em",
                        lineHeight: 1.04,
                        color: "#ffffff",
                        textShadow: "0 2px 16px rgba(0,0,0,0.6)",
                      }}
                    >
                      {project.title}
                    </h3>
                    <p
                      className="mt-1.5 flex items-center gap-2"
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "clamp(0.64rem, 0.9vw, 0.76rem)",
                        fontWeight: 400,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.66)",
                      }}
                    >
                      <span>{project.type}</span>
                      {project.concept && (
                        <>
                          <span aria-hidden="true" style={{ color: `rgba(${project.rgb},0.9)` }}>
                            ·
                          </span>
                          <span>Koncept</span>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Arrow affordance — visible at rest (touch-friendly), blooms on hover */}
                  <span
                    aria-hidden="true"
                    className="grid shrink-0 place-items-center rounded-full"
                    style={{
                      width: "clamp(38px,3.4vw,46px)",
                      height: "clamp(38px,3.4vw,46px)",
                      color: hovered ? "#0b0b0d" : "#ffffff",
                      background: hovered ? `rgb(${project.rgb})` : "rgba(255,255,255,0.12)",
                      border: `1px solid ${hovered ? `rgb(${project.rgb})` : "rgba(255,255,255,0.22)"}`,
                      backdropFilter: "blur(4px)",
                      transition: `background 400ms ${cssBezier(EASE.expo)}, color 400ms ${cssBezier(EASE.expo)}, transform 400ms ${cssBezier(EASE.expo)}`,
                      transform: hovered && !reduce ? "translateX(2px) scale(1.06)" : "none",
                    }}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
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
