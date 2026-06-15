"use client";

import { FadeUp, Parallax } from "@/components/motion";
import { ProjectCard } from "@/components/ui/project-card";
import { PROJECTS } from "@/lib/projects";

export function RealizacjeContent() {
  return (
    <section data-header-theme="dark" data-canvas="base" className="relative">
      <div className="container-koda" style={{ paddingBottom: "clamp(40px, 6vw, 90px)" }}>
        <h2 className="sr-only">Wszystkie realizacje</h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(28px,3.6vw,56px) clamp(20px,2.8vw,36px)" }}
        >
          {PROJECTS.map((p, i) => (
            <div key={p.id} className={i % 2 === 1 ? "md:mt-[clamp(32px,5vw,72px)]" : undefined}>
              {/* Cała komórka (karta + opis) dryfuje delikatnie ze scrollem,
                  kolumny w przeciwne strony — „żyjąca" siatka jak w sekcji Work
                  na home (transform-only). Karta i opis ruszają się RAZEM, więc
                  nie zbliżają się do siebie na żadnym etapie. Pierwsza karta =
                  kandydat na LCP (eager + priority); reszta lazy. */}
              <Parallax speed={i % 2 === 0 ? -26 : 34}>
                <ProjectCard project={p} delay={(i % 2) * 0.06} priority={i === 0} />
                <FadeUp inView delay={0.08} y={18}>
                  <p
                    className="mt-5 max-w-[44ch]"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "1rem",
                      lineHeight: 1.6,
                      color: "var(--color-ink-muted)",
                    }}
                  >
                    {p.summary}
                  </p>
                </FadeUp>
              </Parallax>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
