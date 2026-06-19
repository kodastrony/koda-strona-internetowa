import Link from "next/link";
import { FadeUp } from "@/components/motion";
import { ProjectCard } from "@/components/ui/project-card";
import { getProject } from "@/lib/projects";

/* ════════════════════════════════════════════════════════════════════════════
   /uslugi/strony-3d — strona-filar wokół największego wyróżnika KODA: strony 3D
   i animowane. Cel SEO/AEO: wygrać niszę „strony 3D / strony z animacjami" (niska
   konkurencja, on-trend 2026), której ŻADNA polska agencja nie obsadza z LIVE
   demami. Dowód = 6 działających dem: 3D (rikoszet, jr-modular, drblocks) +
   animacje (slice, wycisk, grabowski). Część to koncepty (fikcyjne marki —
   badge „Koncept"), część realne marki (DrBlocks, JR Modular) — patrz projects.ts.
   Answer-first BLUF + nazwany stack + mini-FAQ pod ekstrakcję AI (cytowania
   zdaniowe po przebudowie AI Mode z 6 maja 2026).
   ════════════════════════════════════════════════════════════════════════════ */

export interface Strony3DFaq {
  q: string;
  a: string;
}

export const STRONY3D_FAQ: Strony3DFaq[] = [
  {
    q: "Czy strona 3D nie spowalnia ładowania?",
    a: "Nie musi. Sceny 3D budujemy na autorskim, lekkim kodzie z systemem, który dopasowuje jakość grafiki do mocy urządzenia — na słabszym telefonie scena się upraszcza, zamiast zacinać. Pierwszy ekran pojawia się od razu (statyczny poster), a 3D dogrywa się w tle, więc strona pozostaje szybka i zdaje Core Web Vitals.",
  },
  {
    q: "Czy strona 3D działa na telefonie?",
    a: "Tak. Każdą scenę testujemy od telefonu po ekran 4K. Na słabszym sprzęcie automatycznie obniżamy jakość albo przełączamy na statyczną grafikę, więc animacja nigdy nie psuje płynności. Wspieramy też tryb ograniczonego ruchu (reduced motion) dla osób wrażliwych na animacje.",
  },
  {
    q: "Ile kosztuje strona z animacjami albo w 3D?",
    a: "Zwykle zaczyna się od kilkunastu tysięcy złotych — animacje i sceny 3D to dodatkowy czas projektu i programowania. Orientacyjne widełki znajdziesz na stronie cennika, a dokładną wycenę przygotujemy pod Twój pomysł, bezpłatnie i bez zobowiązań.",
  },
  {
    q: "Czy efekty 3D pomagają w Google i wyszukiwarkach AI?",
    a: "Same animacje nie podnoszą pozycji, ale ich efekt — dłuższy czas na stronie i wyróżnienie marki — to realny sygnał jakości. Całą treść trzymamy w kodzie HTML (czytelnym dla Google i silników AI) i pilnujemy szybkości, więc 3D dodaje charakteru, nie szkodząc widoczności.",
  },
  {
    q: "Czym różni się strona 3D od zwykłej animowanej?",
    a: "Strona animowana porusza płaskimi elementami (przewijanie, przejścia, ruch grafiki 2D). Strona 3D dokłada prawdziwą przestrzeń — interaktywne sceny WebGL, które można obracać i zwiedzać, jak wirtualny model produktu czy wnętrza. Robimy oba podejścia i dobieramy je do celu, nie odwrotnie.",
  },
];

/** Kiedy 3D/animacje realnie się opłacają (use-case'y, nie ozdoby). */
const USE_CASES: { title: string; desc: string }[] = [
  {
    title: "Marki premium i wyróżniające się",
    desc: "Gdy chcesz, by strona w sekundę komunikowała „inna liga” — ruch i 3D robią to, czego nie zrobi statyczne zdjęcie.",
  },
  {
    title: "Produkt, który warto pokazać z każdej strony",
    desc: "Interaktywny model 3D zastępuje galerię — klient ogląda produkt sam, obraca go i zagląda w szczegóły.",
  },
  {
    title: "Lokal, atmosfera, przestrzeń",
    desc: "Gastronomia, wnętrza, nieruchomości — scenę 3D można zwiedzić, zanim ktoś zadzwoni czy przyjdzie.",
  },
  {
    title: "Launch, kampania, „efekt wow”",
    desc: "Landing z mocną animacją zatrzymuje uwagę w pierwszej sekundzie i zostaje w pamięci dłużej niż konkurencja.",
  },
];

/** Jak budujemy — nazwany stack (sygnał ekspertyzy dla Google i AI). */
const HOW: { title: string; desc: string }[] = [
  {
    title: "Three.js / React Three Fiber",
    desc: "Sceny 3D generowane w przeglądarce (WebGL) — bez wtyczek i ciężkich plików do pobrania.",
  },
  {
    title: "GSAP / Lenis",
    desc: "Płynny scroll i precyzyjna choreografia animacji oparta na transformacjach (lekka dla procesora).",
  },
  {
    title: "Adaptacyjna wydajność",
    desc: "Jakość 3D dobiera się do urządzenia (od mocnego PC po słaby telefon), z podejściem poster-first.",
  },
  {
    title: "Dostępność i SEO w standardzie",
    desc: "Tryb ograniczonego ruchu, obsługa klawiatury (WCAG), cała treść w HTML i zielone Core Web Vitals.",
  },
];

/* ── Style spójne z /cennik i /uslugi ─────────────────────────────────────── */
const sectionDivider: React.CSSProperties = {
  borderTop: "1px solid var(--color-line)",
  paddingTop: "clamp(48px,6vw,96px)",
  paddingBottom: "clamp(48px,6vw,96px)",
};
const h2Style: React.CSSProperties = {
  fontSize: "clamp(1.7rem,3vw,2.6rem)",
  letterSpacing: "-0.03em",
  lineHeight: 1.1,
  color: "var(--color-ink)",
};
const bodyStyle: React.CSSProperties = {
  fontFamily: "var(--font-body)",
  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
  lineHeight: 1.65,
  color: "var(--color-ink-muted)",
};

// Dema w kolejności pod 3D/animacje: prawdziwe 3D na czele (scena, konfigurator,
// model), potem mocne animacje.
const DEMO_ORDER = ["rikoszet", "jr-modular", "drblocks", "slice", "wycisk", "grabowski"];
const DEMOS = DEMO_ORDER.map((id) => getProject(id)).filter((p): p is NonNullable<typeof p> => !!p);

export function Strony3DContent() {
  return (
    <section data-header-theme="dark" data-canvas="base" className="relative">
      {/* ── Answer-first (BLUF) ── */}
      <div className="container-koda" style={{ paddingBottom: "clamp(40px, 6vw, 96px)" }}>
        <FadeUp inView>
          <div
            style={{
              borderLeft: "3px solid var(--color-pink-bright)",
              paddingLeft: "clamp(18px, 2.5vw, 32px)",
              maxWidth: "64ch",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "clamp(1.12rem, 1.5vw, 1.4rem)",
                lineHeight: 1.6,
                color: "var(--color-ink)",
              }}
            >
              Strona 3D to witryna z interaktywną grafiką trójwymiarową działającą wprost w
              przeglądarce (WebGL/Three.js) — odwiedzający może obrócić scenę, obejrzeć produkt albo
              zwiedzić wnętrze. Razem ze stronami animowanymi to nasz znak rozpoznawczy: efekt
              „wow”, który wyróżnia markę i zatrzymuje uwagę.
            </p>
            <p className="mt-4" style={{ ...bodyStyle, maxWidth: "64ch" }}>
              Budujemy je na autorskim kodzie, z dbałością o szybkość i dostępność — działają
              płynnie też na telefonie. Poniżej zobaczysz sześć działających dem oraz to, kiedy 3D
              realnie się opłaca.
            </p>
          </div>
        </FadeUp>
      </div>

      {/* ── Live dema (dowód) ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Zobacz nasze strony 3D i animowane na żywo
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Sześć działających dem, które zaprojektowaliśmy i zakodowaliśmy od zera. Kliknij kartę,
            żeby zobaczyć pełne case study i otworzyć wersję na żywo.
          </p>
        </FadeUp>
        <div
          className="mt-10 grid grid-cols-1 md:grid-cols-2"
          style={{ gap: "clamp(24px,3vw,40px)" }}
        >
          {DEMOS.map((p, i) => (
            <ProjectCard key={p.id} project={p} delay={(i % 2) * 0.06} priority={i === 0} />
          ))}
        </div>
      </div>

      {/* ── Kiedy się opłaca ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Kiedy strona 3D albo z animacjami się opłaca?
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2" role="list">
            {USE_CASES.map((u) => (
              <li key={u.title}>
                <h3
                  className="font-heading font-semibold"
                  style={{
                    fontSize: "1.12rem",
                    letterSpacing: "-0.01em",
                    color: "var(--color-ink)",
                  }}
                >
                  {u.title}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "46ch" }}
                >
                  {u.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      {/* ── Jak budujemy (stack) ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Jak budujemy 3D i animacje
          </h2>
        </FadeUp>
        <FadeUp inView delay={0.08}>
          <p className="mt-4" style={{ ...bodyStyle, maxWidth: "60ch" }}>
            Efekt „wow” bez kompromisów w szybkości i dostępności — to kwestia warsztatu, nie
            gotowych wtyczek.
          </p>
        </FadeUp>
        <FadeUp inView delay={0.12}>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 sm:grid-cols-2" role="list">
            {HOW.map((h) => (
              <li key={h.title}>
                <h3
                  className="font-heading font-semibold"
                  style={{
                    fontSize: "1.12rem",
                    letterSpacing: "-0.01em",
                    color: "var(--color-ink)",
                  }}
                >
                  {h.title}
                </h3>
                <p
                  className="mt-1.5"
                  style={{ ...bodyStyle, fontSize: "0.98rem", maxWidth: "46ch" }}
                >
                  {h.desc}
                </p>
              </li>
            ))}
          </ul>
        </FadeUp>
      </div>

      {/* ── Mini-FAQ (zasila FAQPage JSON-LD) ── */}
      <div className="container-koda" style={sectionDivider}>
        <FadeUp inView>
          <h2 className="font-heading font-semibold" style={h2Style}>
            Częste pytania o strony 3D i animowane
          </h2>
        </FadeUp>
        <div className="mt-8 flex flex-col">
          {STRONY3D_FAQ.map((f, i) => (
            <FadeUp inView key={f.q} delay={0.04 * i}>
              <div
                style={{
                  borderTop: i === 0 ? "1px solid var(--color-line)" : undefined,
                  borderBottom: "1px solid var(--color-line)",
                  paddingTop: "clamp(20px,2.4vw,30px)",
                  paddingBottom: "clamp(20px,2.4vw,30px)",
                }}
              >
                <h3
                  className="font-heading font-semibold"
                  style={{ fontSize: "clamp(1.1rem,1.6vw,1.35rem)", color: "var(--color-ink)" }}
                >
                  {f.q}
                </h3>
                <p className="mt-3" style={{ ...bodyStyle, maxWidth: "70ch" }}>
                  {f.a}
                </p>
              </div>
            </FadeUp>
          ))}
        </div>

        {/* Link kontekstowy do cennika (internal linking hub-and-spoke) */}
        <FadeUp inView delay={0.1}>
          <Link
            href="/cennik"
            className="mt-8 inline-flex font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
            style={{ color: "var(--color-ink)" }}
          >
            Sprawdź, ile kosztuje strona internetowa →
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
