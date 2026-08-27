"use client";

import { FadeUp, Parallax } from "@/components/motion";
import { ProjectCard } from "@/components/ui/project-card";
import { PROJECTS } from "@/lib/projects";

export function RealizacjeContent() {
  return (
    <section data-header-theme="dark" data-canvas="base" className="relative">
      <div className="container-koda" style={{ paddingBottom: "clamp(40px, 6vw, 90px)" }}>
        {/* Akapit wprowadzający — samodzielny, cytowalny pasaż (AEO): kto, co,
            fakt weryfikowalny (żywe strony) i uczciwy podział klient/koncept.
            Wejście w CZYSTYM CSS — to LCP strony (FadeUp inView = LCP 7,2 s mobile). */}
        <div className="ph-lead-in" style={{ animationDelay: "0.1s" }}>
          <p
            className="mb-[clamp(36px,4.5vw,64px)] max-w-[62ch]"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.05rem,1.3vw,1.22rem)",
              lineHeight: 1.65,
              color: "var(--color-ink-muted)",
            }}
          >
            Każdą stronę w tym portfolio KODA zaprojektowała i zakodowała od zera — bez szablonów —
            i każda działa na żywo: klikniesz i sprawdzisz sam. Część powstała dla realnych klientów
            (JR Modular Systems, DrBlocks), pozostałe to jasno oznaczone projekty koncepcyjne, które
            pokazują nasz standard pracy — od konfiguratorów 3D po animowane strony produktowe.
          </p>
        </div>
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

        {/* Blok zamykający (audyt on-page 2026-08-27: /realizacje/ było najcieńszą
            stroną w indeksie, ~170 słów czystej treści). Fakty, nie ozdobniki:
            wspólny standard techniczny + zaproszenie. Cytowalny pasaż pod AEO. */}
        <div className="mx-auto mt-[clamp(56px,8vw,110px)] max-w-[640px]">
          <h2
            id="standard"
            className="font-heading font-semibold"
            style={{
              fontSize: "clamp(1.7rem,3vw,2.6rem)",
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: "var(--color-ink)",
              textWrap: "balance",
            }}
          >
            Jeden standard, cztery różne zadania.
          </h2>
          <p
            className="mt-5"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: "var(--color-ink-muted)",
            }}
          >
            Konfigurator budynków modułowych 3D, model produktu z kalkulatorem doboru, spacer po
            lokalu w przeglądarce i spokojna strona firmowa dla rzemiosła. Wszystkie te strony
            internetowe zbudowaliśmy w tym samym standardzie: autorski kod (React / Next.js, a przy
            grafice 3D — Three.js i WebGL), szybkie wczytywanie na telefonie, dostępność i
            techniczne SEO od pierwszego dnia.
          </p>
          <p
            className="mt-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "1.05rem",
              lineHeight: 1.65,
              color: "var(--color-ink-muted)",
            }}
          >
            Każdą realizację można przeklikać na żywo — na komputerze i na telefonie. Jeśli Twoja
            firma potrzebuje strony o podobnym charakterze, opisz projekt: bezpłatną wycenę i
            wstępny pomysł odsyłamy w ciągu 24 godzin.
          </p>
        </div>
      </div>
    </section>
  );
}
