"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { PillLink } from "@/components/ui/pill-link";
import { ProjectCard } from "@/components/ui/project-card";
import { PROJECTS } from "@/lib/projects";

// ══════════════════════════════════════════════════════════════════════
// Homepage "Wybrane realizacje" — a teaser of the portfolio. Cards live in
// the shared <ProjectCard> (also used on /realizacje); data comes from
// @/lib/projects. The two columns drift at slightly different speeds on scroll
// (JS parallax, transform-only) for a gentle sense of depth.
export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const colARef = useRef<HTMLDivElement>(null);
  const colBRef = useRef<HTMLDivElement>(null);

  // Scroll-parallax kolumn — transform pisany BEZPOŚREDNIO, ZSYNCHRONIZOWANY ze
  // scrollem (zero CSS-transition → kolumny „przyklejone" do pozycji scrolla;
  // gładkość daje Lenis). Odczyt rectu + zapis transformu raz na klatkę
  // (rAF-coalescing). Tylko transform (GPU). md+; mobile off; reduced-motion off.
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
      const c = Math.max(-0.5, Math.min(0.5, (vh - rect.top) / (vh + rect.height) - 0.5));
      a.style.transform = `translate3d(0, ${(-c * 90).toFixed(1)}px, 0)`; // lewa ±45px
      b.style.transform = `translate3d(0, ${(-c * 40).toFixed(1)}px, 0)`; // prawa ±20px
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
    window.addEventListener("resize", apply);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", apply);
    };
  }, []);

  return (
    <section ref={sectionRef} data-header-theme="dark" className="relative overflow-hidden" style={{ backgroundColor: "var(--color-bg)" }}>
      <div className="container-koda section-y">
        {/* ── Section header — title left, context right ── */}
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
            <p style={{ fontFamily: "var(--font-body)", fontSize: "clamp(0.95rem, 1.05vw, 1.05rem)", color: "var(--color-ink-muted)", lineHeight: 1.6 }}>
              Projekty, które łączą dopracowany design z realnymi wynikami w sprzedaży.
            </p>
          </FadeUp>
        </div>

        {/* ── Two-column staggered grid (kolumny z parallaxem na scroll) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "clamp(20px,2.8vw,36px)" }}>
          <div ref={colARef} className="flex flex-col" style={{ gap: "clamp(20px,2.8vw,36px)", willChange: "transform" }}>
            <ProjectCard project={PROJECTS[0]} delay={0} />
            <ProjectCard project={PROJECTS[2]} delay={0.08} />
          </div>

          <div ref={colBRef} className="work-right-stagger flex flex-col" style={{ gap: "clamp(20px,2.8vw,36px)", willChange: "transform" }}>
            <ProjectCard project={PROJECTS[1]} delay={0.05} />
            <ProjectCard project={PROJECTS[3]} delay={0.13} />
          </div>
        </div>

        {/* ── View-all CTA — quiet surface pill (pink pill stays the primary CTA) ── */}
        <div style={{ marginTop: "clamp(48px,6vw,84px)" }}>
          <FadeUp inView delay={0.08} className="flex justify-center">
            <PillLink href="/realizacje" bg="var(--color-surface-1)" border="var(--color-line-strong)" className="px-9 py-4">
              Sprawdź wszystkie realizacje
            </PillLink>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}
