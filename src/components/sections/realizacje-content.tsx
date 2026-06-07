"use client";

import { FadeUp } from "@/components/motion";
import { ProjectCard } from "@/components/ui/project-card";
import { PROJECTS } from "@/lib/projects";

export function RealizacjeContent() {
  return (
    <section
      data-header-theme="dark"
      className="relative"
      style={{ backgroundColor: "var(--color-bg)" }}
    >
      <div className="container-koda" style={{ paddingBottom: "clamp(40px, 6vw, 90px)" }}>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(28px,3.6vw,56px) clamp(20px,2.8vw,36px)" }}
        >
          {PROJECTS.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "md:mt-[clamp(32px,5vw,72px)]" : undefined}>
              <ProjectCard project={p} delay={(i % 2) * 0.06} />
              <FadeUp inView delay={0.08} y={18}>
                <div className="mt-5">
                  <span
                    className="font-heading text-[11px] font-bold tracking-[0.18em] uppercase"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {p.client}
                  </span>
                  <p
                    className="mt-2 max-w-[42ch]"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {p.summary}
                  </p>
                </div>
              </FadeUp>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
