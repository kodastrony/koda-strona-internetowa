"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@/lib/motion";
import { FadeUp, Parallax } from "@/components/motion";
import { GlowField } from "@/components/fx/glow-field";
import { ProcessSteps } from "@/components/sections/process-steps";
import { Magnetic } from "@/components/motion/magnetic";
import { PillLink } from "@/components/ui/pill-link";
import { PhoneLink } from "@/components/ui/phone-link";
import { VideoShowcase } from "@/components/ui/video-showcase";
import { CONTACT } from "@/lib/constants";
import { SERVICES, type Service } from "@/lib/services-data";

/* ════════════════════════════════════════════════════════════════════════════
   /uslugi v3 — „USŁUGI POKAZANE PRACĄ" (2026-08-26, po dwóch korektach Natana).

   Diagnozy poprzednich podejść: v1 = białe karty + ściany tekstu (slop);
   v2 = hasła-giganty w akordeonie (nie wiadomo, co jest czym; treść schowana).

   v3: cztery sekcje wprost na kanwie (zero pudełek), każda NAZWANA po ludzku
   (H2 = nazwa usługi → nawigowalność), z całą ofertą WIDOCZNĄ bez klikania
   (linia wyniku + chipy 2–4 słowa + dowód), a „wow" robi PRAWDZIWA praca:
   • Projektowanie → pływający stos zrzutów realnych projektów (parallax,
     hover prostuje) · • Strony 2D/3D → żywe wideo animacji (VideoShowcase)
   • SEO → odliczające się REALNE wyniki tej strony (100/100, CLS 0,00)
   • Opieka → realizacja + pulsujący badge „Odpowiadamy w 24 h".
   Naprzemienne strony, hue-poświata per usługa. Wycena/Proces bez zmian.
   ══════════════════════════════════════════════════════════════════════════ */

/* „Pełny" tick: rysujący się ptaszek w wypełnionym różowym kółku (wzór Natana
   2026-08-26). Kaskada zapala się po wejściu w widok. */
function CheckBadge({ delay }: { delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span
      aria-hidden="true"
      className="mt-[1px] flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: "rgba(207, 67, 184, 0.11)" }}
    >
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
        <motion.path
          d="M3 8.5L6.5 12L13 4.5"
          stroke="var(--color-accent)"
          strokeWidth="2.1"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
          transition={reduce ? { duration: 0 } : { duration: 0.4, ease: EASE.out, delay }}
        />
      </svg>
    </span>
  );
}

/* Renderer podświetleń w tickach: „**fraza**" → RÓŻOWY semibold (highlight —
   życzenie Natana; #b32a9d na porcelanie = 5,6:1, AA). Reszta ink-muted. */
function Emph({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 === 1 ? (
          <strong key={i} className="font-semibold" style={{ color: "var(--color-accent)" }}>
            {p}
          </strong>
        ) : (
          p
        )
      )}
    </>
  );
}

/* Odliczanie do wartości przy wejściu w widok (SEO-wyniki). rAF + ease-out,
   reduced-motion → od razu wartość końcowa. */
function CountUp({ to, decimals = 0 }: { to: number; decimals?: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView || reduce) return; // reduce: render niżej pokazuje od razu wartość końcową
    const t0 = performance.now();
    const dur = 1100;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 4); // quart-out
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, to]);

  const shown = reduce ? to : val;
  return (
    <span ref={ref} style={{ fontVariantNumeric: "tabular-nums" }}>
      {shown.toFixed(decimals).replace(".", ",")}
    </span>
  );
}

/* ── Wizual 1 (Projektowanie): „BAŁAGAN → PORZĄDEK" ─────────────────────────
   Meta-dowód kompetencji UX/UI: TA SAMA makieta w dwóch stanach. Start =
   chaos (bloki krzywe, porozrzucane, nakładają się, CTA szary i zgubiony
   w rogu), po chwili wszystko składa się kaskadą sprężyn w czysty layout
   na siatce, z różowym CTA na ścieżce wzroku. Przełącznik PRZED/PO pozwala
   klientowi samemu „posprzątać" projekt. Czysty DOM, tokeny marki.
   Wybrane spośród kilku konceptów (kursor-ścieżka, slider porównawczy,
   morf tokenów) — patrz commit. */
type MorphPhase = "before" | "after";

interface MorphState {
  x: number; // left, % szerokości kadru
  y: number; // top, % wysokości kadru
  w: number; // width, %
  h: number; // height, %
  rot: number;
  r: number; // border-radius, px
  bg: string;
  op?: number;
}

const BONE = "rgba(36,27,43,0.07)";
const BONE_DARK = "rgba(36,27,43,0.13)";
const GRAY_CTA = "rgba(36,27,43,0.18)";
const PINK_SOFT = "rgba(179,42,157,0.10)";
const PINK_NAV = "rgba(179,42,157,0.25)";

/* before = chaos (krzywo, nakładki, niespójne radiusy — celowo „spartaczone"),
   after = ład (siatka, oddechy, spójne radiusy, CTA różowy przy H1). */
const MORPH_BLOCKS: { id: string; before: MorphState; after: MorphState; cta?: boolean }[] = [
  { id: "logo", before: { x: 36, y: 8, w: 26, h: 7, rot: -7, r: 2, bg: BONE_DARK }, after: { x: 4, y: 5, w: 14, h: 5, rot: 0, r: 8, bg: BONE } },
  { id: "nav1", before: { x: 6, y: 30, w: 12, h: 4, rot: 10, r: 2, bg: BONE_DARK }, after: { x: 60, y: 6, w: 8, h: 3.5, rot: 0, r: 6, bg: BONE } },
  { id: "nav2", before: { x: 22, y: 7, w: 9, h: 4, rot: -12, r: 10, bg: BONE_DARK }, after: { x: 70, y: 6, w: 8, h: 3.5, rot: 0, r: 6, bg: BONE } },
  { id: "navCta", before: { x: 84, y: 44, w: 12, h: 4, rot: 6, r: 3, bg: GRAY_CTA }, after: { x: 81, y: 5.2, w: 15, h: 5, rot: 0, r: 999, bg: PINK_NAV } },
  { id: "h1a", before: { x: 18, y: 36, w: 58, h: 9, rot: -4, r: 3, bg: BONE_DARK }, after: { x: 4, y: 17, w: 50, h: 8, rot: 0, r: 8, bg: BONE } },
  { id: "h1b", before: { x: 8, y: 48, w: 46, h: 9, rot: 3, r: 14, bg: BONE_DARK }, after: { x: 4, y: 27.5, w: 36, h: 8, rot: 0, r: 8, bg: BONE } },
  { id: "sub1", before: { x: 48, y: 61, w: 44, h: 4.5, rot: -3, r: 2, bg: BONE_DARK, op: 0.85 }, after: { x: 4, y: 40, w: 42, h: 3.8, rot: 0, r: 6, bg: BONE, op: 0.7 } },
  { id: "sub2", before: { x: 10, y: 57, w: 30, h: 4.5, rot: 6, r: 2, bg: BONE_DARK, op: 0.85 }, after: { x: 4, y: 46, w: 32, h: 3.8, rot: 0, r: 6, bg: BONE, op: 0.7 } },
  { id: "cta", before: { x: 78, y: 90, w: 17, h: 7, rot: -9, r: 4, bg: GRAY_CTA }, after: { x: 4, y: 55, w: 20, h: 9, rot: 0, r: 999, bg: "var(--color-accent)", op: 0.9 }, cta: true },
  { id: "img", before: { x: 1, y: 66, w: 30, h: 30, rot: 7, r: 4, bg: "rgba(36,27,43,0.10)" }, after: { x: 60, y: 17, w: 36, h: 47, rot: 0, r: 12, bg: PINK_SOFT } },
  { id: "card1", before: { x: 38, y: 74, w: 34, h: 20, rot: -5, r: 18, bg: BONE_DARK }, after: { x: 4, y: 72, w: 28, h: 21, rot: 0, r: 10, bg: BONE } },
  { id: "card2", before: { x: 64, y: 68, w: 30, h: 18, rot: 8, r: 4, bg: BONE_DARK }, after: { x: 36, y: 72, w: 28, h: 21, rot: 0, r: 10, bg: BONE } },
  { id: "card3", before: { x: 30, y: 90, w: 28, h: 12, rot: -3, r: 6, bg: BONE_DARK }, after: { x: 68, y: 72, w: 28, h: 21, rot: 0, r: 10, bg: BONE } },
];

function WireframeVisual() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: true, margin: "-15% 0px -15% 0px" });
  // SSR/no-JS renderuje ŁAD (bezpieczny default); klient bez reduce cofa do
  // chaosu jeszcze pod foldem i „sprząta" dopiero na oczach usera (inView).
  const [phase, setPhase] = useState<MorphPhase>("after");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (reduce || touched) return;
    // setTimeout(0): flip po hydratacji (SSR musi zostać przy „after" —
    // pierwszy render klienta musi się z nim zgadzać), poza ciałem efektu
    // (reguła react-hooks/set-state-in-effect).
    const t = setTimeout(() => setPhase("before"), 0);
    return () => clearTimeout(t);
  }, [reduce, touched]);

  useEffect(() => {
    if (reduce || touched || !inView || phase !== "before") return;
    const t = setTimeout(() => setPhase("after"), 950);
    return () => clearTimeout(t);
  }, [reduce, touched, inView, phase]);

  const pick = (p: MorphPhase) => {
    setTouched(true);
    setPhase(p);
  };

  const n = MORPH_BLOCKS.length;
  const chip = (active: boolean) =>
    `rounded-full border px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#9a2487] ${
      active
        ? "border-[#b32a9d] bg-[#b32a9d] text-white"
        : "border-[var(--color-line)] text-[var(--color-ink-muted)] hover:border-[#b32a9d] hover:text-[#9a2487]"
    }`;

  return (
    <Parallax speed={14}>
      <div ref={wrapRef}>
        <div
          aria-hidden="true"
          className="relative overflow-hidden"
          style={{
            border: "1px solid var(--color-line)",
            borderRadius: 18,
            background: "var(--color-surface-1)",
            boxShadow: "var(--shadow-card-hover)",
          }}
        >
          {/* Pasek przeglądarki */}
          <div
            className="flex items-center gap-2 px-5"
            style={{ height: 44, borderBottom: "1px solid var(--color-line)" }}
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: "rgba(36,27,43,0.12)" }}
              />
            ))}
            <span
              className="ml-3 hidden h-5 flex-1 rounded-full sm:block"
              style={{ backgroundColor: "rgba(36,27,43,0.05)", maxWidth: 280 }}
            />
          </div>

          {/* Kadr makiety: bloki % → skalują się z szerokością kolumny */}
          <div className="relative w-full" style={{ aspectRatio: "16 / 10.5" }}>
            {/* Siatka projektowa — wyłania się dopiero w PO (dowód „ładu") */}
            {[25, 50, 75].map((x) => (
              <motion.span
                key={x}
                initial={false}
                animate={{ opacity: phase === "after" ? 0.6 : 0 }}
                transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.35 }}
                className="absolute top-0 h-full w-px"
                style={{ left: `${x}%`, backgroundColor: "var(--color-line)" }}
              />
            ))}
            {MORPH_BLOCKS.map((b, i) => {
              const s = phase === "before" ? b.before : b.after;
              return (
                <motion.div
                  key={b.id}
                  initial={false}
                  animate={{
                    left: `${s.x}%`,
                    top: `${s.y}%`,
                    width: `${s.w}%`,
                    height: `${s.h}%`,
                    rotate: s.rot,
                    borderRadius: s.r,
                    backgroundColor: s.bg,
                    opacity: s.op ?? 1,
                  }}
                  transition={
                    reduce
                      ? { duration: 0 }
                      : {
                          type: "spring",
                          duration: 0.8,
                          bounce: 0.26,
                          // Sprzątanie = kaskada od góry; bałagan wraca szybciej.
                          delay: phase === "after" ? i * 0.045 : (n - 1 - i) * 0.015,
                        }
                  }
                  className="absolute"
                >
                  {/* Różowe halo CTA — oddycha dopiero, gdy jest PORZĄDEK. */}
                  {b.cta && phase === "after" && (
                    <span
                      className="koda-halo pointer-events-none absolute"
                      style={{
                        inset: -4,
                        borderRadius: 999,
                        boxShadow: "0 0 26px 8px rgba(179,42,157,0.4)",
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Przełącznik: klient sam „sprząta" projekt */}
        <div
          role="group"
          aria-label="Makieta: przed i po uporządkowaniu"
          className="mt-5 flex justify-center gap-2"
        >
          {(["before", "after"] as const).map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={phase === p}
              onClick={() => pick(p)}
              className={chip(phase === p)}
            >
              {p === "before" ? "Przed" : "Po"}
            </button>
          ))}
        </div>
      </div>
    </Parallax>
  );
}

/* ── Wizual 3 (SEO): zegary jak z SEO-checkera — realne wyniki tej strony ──
   Pierścienie w stylu Lighthouse/PageSpeed (SVG, stroke rysuje się przy
   scrollu, liczba odlicza). Docelowo Natan podmieni na żywe widgety
   checkerów — ten sam slot. */
function Gauge({ score, label, delay }: { score: number; label: string; delay: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<SVGCircleElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px -15% 0px" });
  const R = 52;
  const C = 2 * Math.PI * R;
  const target = C * (1 - score / 100);
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: 128, height: 128 }}>
        <svg width="128" height="128" viewBox="0 0 128 128" aria-hidden="true">
          <circle
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke="rgba(36,27,43,0.08)"
            strokeWidth="9"
          />
          <circle
            ref={ref}
            cx="64"
            cy="64"
            r={R}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="9"
            strokeLinecap="round"
            strokeDasharray={C}
            strokeDashoffset={inView ? target : C}
            transform="rotate(-90 64 64)"
            style={{
              transition: reduce
                ? "none"
                : `stroke-dashoffset 1.2s cubic-bezier(0.23, 1, 0.32, 1) ${delay}s`,
            }}
          />
        </svg>
        <div
          className="absolute inset-0 grid place-items-center font-heading font-extrabold"
          style={{ fontSize: "2rem", letterSpacing: "-0.03em", color: "var(--color-ink)" }}
        >
          <CountUp to={score} />
        </div>
      </div>
      <div
        className="text-center font-heading font-bold uppercase"
        style={{ fontSize: "10.5px", letterSpacing: "0.14em", color: "var(--color-ink-muted)" }}
      >
        {label}
      </div>
    </div>
  );
}

function ScoreStrip() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8 md:justify-start">
        <Gauge score={100} label="Lighthouse SEO" delay={0} />
        <Gauge score={100} label="Dostępność" delay={0.12} />
        <Gauge score={96} label="Best Practices" delay={0.24} />
      </div>
      <p className="mt-6 font-body" style={{ fontSize: "0.9rem", color: "var(--color-ink-faint)" }}>
        Wyniki tej strony — Google Lighthouse, sierpień 2026.
      </p>
    </div>
  );
}

/* ── Wizual 4 (Opieka): czat „jak z reklamy" — scenka grana RAZ ────────────
   Klient pisze (kropki) → wiadomość wskakuje → KODA pisze → odpowiedź →
   „Ekstra, dzięki!" → ❤️ reakcja → rozmowa ZOSTAJE (bez replaya — korekta
   Natana). Po wejściu bąble spokojnie unoszą się w górę/dół (.koda-bob).
   Sterowane maszynką kroków (setTimeout) startującą po wejściu w widok;
   reduced-motion → statyczna pełna rozmowa. Tylko bąbelki — zero
   dodatkowych tekstów (życzenie Natana). */
// delay = czas spędzony W danym stanie, zanim przejdziemy do kolejnego.
// Stan 7 = finał (❤️ pop) — maszynka się zatrzymuje, nic nie planujemy.
const CHAT_FLOW: Record<number, { next: number; delay: number }> = {
  0: { next: 1, delay: 350 }, // pusto → klient zaczyna pisać
  1: { next: 2, delay: 600 }, // klient pisze…
  2: { next: 3, delay: 700 }, // pytanie na ekranie (kaskada słów potrzebuje chwili)
  3: { next: 4, delay: 700 }, // KODA pisze…
  4: { next: 5, delay: 750 }, // odpowiedź na ekranie (jw.)
  5: { next: 6, delay: 500 }, // klient pisze…
  6: { next: 7, delay: 500 }, // „dzięki" wskoczyło → ❤️ i koniec
};
const CHAT_DONE = 7;

const EMOJI_RE = /\p{Extended_Pictographic}/u;

/* Kinetic typography w bąblu: słowa wystrzeliwują kaskadą (mini-sprężyny,
   40 ms odstępu), emoji wpada na końcu mocniej i z zakrętem — „reklamowo",
   a nie 1:1 jak w telefonie (korekta Natana). Spany inline-block z „pre"
   zachowują spacje, a chowanie tylko przez opacity/transform ⇒ bąbel ma
   finalny rozmiar od razu (zero reflow / skoków layoutu). */
function PopWords({ text, visible }: { text: string; visible: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const emoji = EMOJI_RE.test(w);
        // Start po ~0.16 s (bąbel zdążył „boing-nąć"), potem kaskada.
        const delay = 0.16 + i * 0.04 + (emoji ? 0.12 : 0);
        return (
          <motion.span
            key={i}
            // Bąbel wiadomości REMONTUJE się przy podmianie kropek→tekst,
            // więc initial MUSI być stanem ukrytym — z initial={false} span
            // montuje się od razu „gotowy" i kaskada w ogóle nie gra.
            initial={
              reduce
                ? false
                : { opacity: 0, y: 9, scale: emoji ? 0.2 : 0.6, rotate: emoji ? -25 : 0 }
            }
            animate={
              visible
                ? { opacity: 1, y: 0, scale: 1, rotate: 0 }
                : reduce
                  ? { opacity: 0, y: 0, scale: 1, rotate: 0 }
                  : { opacity: 0, y: 9, scale: emoji ? 0.2 : 0.6, rotate: emoji ? -25 : 0 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : visible
                  ? {
                      delay,
                      type: "spring",
                      duration: emoji ? 0.5 : 0.34,
                      bounce: emoji ? 0.58 : 0.42,
                      opacity: { delay, duration: 0.1, ease: "easeOut" },
                    }
                  : { duration: 0.1 }
            }
            className="inline-block"
            style={{ whiteSpace: "pre" }}
          >
            {i < words.length - 1 ? `${w} ` : w}
          </motion.span>
        );
      })}
    </>
  );
}

function TypingDots({ onPink = false }: { onPink?: boolean }) {
  return (
    <span className="flex items-center gap-1" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="koda-typing-dot inline-block h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: onPink ? "rgba(255,255,255,0.9)" : "rgba(36,27,43,0.45)" }}
        />
      ))}
    </span>
  );
}

function ChatBubble({
  side,
  visible,
  typing,
  reaction,
  bob,
  children,
}: {
  side: "left" | "right";
  visible: boolean;
  typing?: boolean;
  /** ❤️ reakcja KODY doczepiona do rogu bąbla (pop, gdy true). */
  reaction?: boolean;
  /** Faza spokojnego unoszenia się chmurki (1–3, rozstrojone, by nie falowały synchronicznie). */
  bob?: 1 | 2 | 3;
  children?: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  const pink = side === "right";
  // Wejście = PODSKOK do góry (korekta Natana: pion, nie „pozioma linia"):
  // bąbel wystrzeliwuje z dołu NAD cel, lekko się rozciąga w pionie,
  // spłaszcza przy lądowaniu i dopina. Do tego mały przechył od rogu
  // nadawcy i blur-in. Potem wrapper (.koda-bob) unosi go spokojnie
  // w górę i w dół jak chmurkę.
  const hidden = reduce
    ? { opacity: 0, y: 0, scaleX: 1, scaleY: 1, rotate: 0, filter: "blur(0px)" }
    : { opacity: 0, y: 38, scaleX: 0.72, scaleY: 0.72, rotate: pink ? 5 : -5, filter: "blur(7px)" };
  const boing = {
    opacity: 1,
    y: [38, -12, 3, 0],
    scaleX: [0.72, 1.02, 0.99, 1],
    scaleY: [0.72, 1.1, 0.94, 1],
    rotate: [pink ? 5 : -5, pink ? -1.5 : 1.5, pink ? 0.5 : -0.5, 0],
    filter: "blur(0px)",
  };
  const bobClass = bob ? ` koda-bob koda-bob-${bob}` : "";
  return (
    <div className={(pink ? "flex justify-end" : "flex justify-start") + bobClass}>
      <motion.div
        // Kropki „pisze…" montują się w trakcie pętli — initial=hidden,
        // żeby też strzelały popem, nie pojawiały się „na sucho".
        initial={reduce ? false : hidden}
        animate={visible ? boing : hidden}
        transition={
          reduce
            ? { duration: 0 }
            : visible
              ? {
                  duration: 0.52,
                  times: [0, 0.4, 0.7, 1],
                  ease: ["easeOut", "easeInOut", "easeInOut"],
                  // opacity/blur bez keyframe'ów (mrugałyby przy odbiciu).
                  opacity: { duration: 0.13, ease: "easeOut" },
                  filter: { duration: 0.18, ease: "easeOut" },
                }
              : { duration: 0.16, ease: EASE.out }
        }
        className="font-body relative"
        style={{
          fontSize: "1.02rem",
          lineHeight: 1.5,
          padding: typing ? "15px 18px" : "14px 19px",
          maxWidth: "32ch",
          backgroundColor: pink ? "#b32a9d" : "var(--color-surface-1)",
          border: pink ? "none" : "1px solid var(--color-line)",
          borderRadius: pink ? "20px 20px 6px 20px" : "20px 20px 20px 6px",
          color: pink ? "#ffffff" : "var(--color-ink)",
          boxShadow: pink
            ? "0 18px 40px -16px rgba(179,42,157,0.6)"
            : "var(--shadow-card-hover)",
          transformOrigin: pink ? "bottom right" : "bottom left",
        }}
      >
        {children}
        {reaction !== undefined && (
          <motion.span
            initial={false}
            animate={
              reaction
                ? { opacity: 1, scale: 1, rotate: 0 }
                : { opacity: 0, scale: reduce ? 1 : 0.3, rotate: reduce ? 0 : -30 }
            }
            transition={
              reduce
                ? { duration: 0 }
                : reaction
                  ? { type: "spring", duration: 0.5, bounce: 0.6, opacity: { duration: 0.1 } }
                  : { duration: 0.12, ease: EASE.out }
            }
            className="absolute flex items-center justify-center"
            style={{
              right: -12,
              bottom: -14,
              width: 32,
              height: 32,
              borderRadius: "50%",
              backgroundColor: "var(--color-surface-1)",
              border: "1px solid var(--color-line)",
              boxShadow: "var(--shadow-card-hover)",
              fontSize: 15,
            }}
          >
            ❤️
          </motion.span>
        )}
      </motion.div>
    </div>
  );
}

function CareChatVisual() {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { once: false, margin: "-15% 0px -15% 0px" });
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce) return; // statyczna pełna rozmowa
    if (!inView) return; // pauza poza ekranem (oszczędza baterię)
    if (step >= CHAT_DONE) return; // scenka odegrana — zostaje, bez replaya
    const cur = CHAT_FLOW[step] ?? CHAT_FLOW[0];
    const t = setTimeout(() => setStep(cur.next), cur.delay);
    return () => clearTimeout(t);
  }, [step, inView, reduce]);

  // reduced-motion: wszystko widoczne, bez kropek i bez pętli.
  const show = (n: number) => (reduce ? true : step >= n);
  const typingLeft1 = !reduce && step === 1;
  const typingRight = !reduce && step === 3;
  const typingLeft2 = !reduce && step === 5;

  return (
    <Parallax speed={14}>
      <div ref={wrapRef} aria-hidden="true" className="flex flex-col gap-4 md:px-8">
        {/* 1: klient pisze… / wiadomość */}
        {typingLeft1 ? (
          <ChatBubble side="left" visible typing bob={1}>
            <TypingDots />
          </ChatBubble>
        ) : (
          <ChatBubble side="left" visible={show(2)} bob={1}>
            <PopWords text="Dodacie nam zakładkę z nową usługą i podepniecie cennik PDF?" visible={show(2)} />
          </ChatBubble>
        )}

        {/* 2: KODA pisze… / odpowiedź */}
        {typingRight ? (
          <ChatBubble side="right" visible typing bob={2}>
            <TypingDots onPink />
          </ChatBubble>
        ) : (
          <ChatBubble side="right" visible={show(4)} bob={2}>
            <PopWords text="Jasne, już się robi. Podeślemy podgląd do akceptacji. 👍" visible={show(4)} />
          </ChatBubble>
        )}

        {/* 3: klient pisze… / domknięcie (+ ❤️ reakcja KODY w holdzie) */}
        {typingLeft2 ? (
          <ChatBubble side="left" visible typing bob={3}>
            <TypingDots />
          </ChatBubble>
        ) : (
          <ChatBubble side="left" visible={show(6)} reaction={show(7)} bob={3}>
            <PopWords text="Ekstra, dzięki! 🙌" visible={show(6)} />
          </ChatBubble>
        )}
      </div>
    </Parallax>
  );
}

/* ── Sekcja usługi: tekst (nazwa → wynik → chipy → dowód) + wizual ── */
function ServiceSection({ s, index }: { s: Service; index: number }) {
  const reversed = index % 2 === 1;
  const visual =
    s.id === "projektowanie" ? (
      <WireframeVisual />
    ) : s.id === "strony" ? (
      <VideoShowcase
        src="/realizacje/rikoszet.mp4"
        poster="/realizacje/rikoszet-poster.webp"
        rgb="207,67,184"
        label="RIKOSZET — nagranie animacji strony 3D zbudowanej przez KODA"
      />
    ) : s.id === "optymalizacja" ? (
      <ScoreStrip />
    ) : (
      <CareChatVisual />
    );

  return (
    <section
      id={s.id}
      data-header-theme="dark"
      data-canvas="base"
      className="relative scroll-mt-24"
    >
      {/* Poświata sekcji w hue usługi — po stronie wizualu, wtapia się w kanwę */}
      <GlowField
        hue={s.hue}
        x={reversed ? 12 : 88}
        y={40}
        strength={0.55}
        drift
        driftDuration={29 + index * 3}
        edgeFade="vertical"
        className="inset-x-0 z-0"
        style={{ top: "-8%", height: "90%" }}
      />

      <div
        className="container-koda relative z-10 grid grid-cols-1 items-center gap-y-10 md:grid-cols-12 md:gap-x-14"
        style={{
          borderTop: "1px solid var(--color-line)",
          paddingTop: "clamp(52px, 6.5vw, 104px)",
          paddingBottom: "clamp(52px, 6.5vw, 104px)",
        }}
      >
        {/* Tekst — TYLKO numer, nazwa i 6 ticków (doszlif Natana: bez dodatkowych
            linii i przekierowań; konkret niosą ticki). */}
        <div className={reversed ? "md:order-2 md:col-span-5" : "md:col-span-5"}>
          <FadeUp inView>
            <span
              className="font-heading font-bold"
              style={{ fontSize: "0.95rem", letterSpacing: "0.02em", color: "var(--color-accent)" }}
            >
              {s.n}
            </span>
          </FadeUp>
          <FadeUp inView delay={0.05}>
            <h2
              className="mt-2 font-heading font-semibold"
              style={{
                fontSize: "clamp(1.9rem, 3.4vw, 3rem)",
                letterSpacing: "-0.03em",
                lineHeight: 1.05,
                color: "var(--color-ink)",
                textWrap: "balance",
              }}
            >
              {s.title}
            </h2>
          </FadeUp>
          <FadeUp inView delay={0.12}>
            <ul className="mt-8 flex flex-col gap-[18px]" role="list">
              {s.points.map((p, idx) => (
                <li
                  key={p}
                  className="flex items-start gap-3.5 font-body"
                  style={{ fontSize: "1.02rem", lineHeight: 1.5, color: "var(--color-ink-muted)" }}
                >
                  <CheckBadge delay={idx * 0.08} />
                  <span className="pt-[1px]" style={{ fontSize: "1.05rem" }}>
                    <Emph text={p} />
                  </span>
                </li>
              ))}
            </ul>
          </FadeUp>
        </div>

        {/* Wizual — prawdziwa praca zamiast opisu */}
        <div className={reversed ? "md:order-1 md:col-span-7" : "md:col-span-7"}>
          <FadeUp inView delay={0.1} y={36} duration={0.7}>
            {visual}
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

export function UslugiContent() {
  return (
    <>
      {SERVICES.map((s, i) => (
        <ServiceSection key={s.id} s={s} index={i} />
      ))}

      {/* Jedna cicha linia akcji pod usługami */}
      <section data-header-theme="dark" data-canvas="base" className="relative">
        <div
          className="container-koda flex flex-wrap items-center gap-x-7 gap-y-4"
          style={{ paddingBottom: "clamp(56px, 7vw, 100px)" }}
        >
          <Magnetic strength={0.35}>
            <PillLink
              href="/kontakt"
              bg="#b32a9d"
              border="#b32a9d"
              className="text-white hover:text-white hover:shadow-[0_18px_44px_-12px_rgba(207,67,184,0.55)]"
            >
              Bezpłatna wycena
            </PillLink>
          </Magnetic>
          <PhoneLink
            className="inline-flex min-h-[44px] items-center font-heading text-[1.02rem] font-bold transition-colors duration-300 hover:text-pink"
            style={{ color: "var(--color-ink)" }}
            label={`lub zadzwoń: ${CONTACT.phone}`}
          />
        </div>
      </section>

      {/* ── Wycena — uczciwa rama ceny bez cennika ── */}
      <section data-header-theme="dark" className="relative">
        <div
          className="container-koda grid grid-cols-1 gap-y-6 md:grid-cols-12 md:gap-x-12"
          style={{
            borderTop: "1px solid var(--color-line)",
            paddingTop: "clamp(48px,6vw,96px)",
            paddingBottom: "clamp(60px,8vw,120px)",
          }}
        >
          <div className="md:col-span-5">
            <FadeUp inView>
              <span className="label-koda mb-5 block">Wycena</span>
            </FadeUp>
            <FadeUp inView delay={0.06}>
              <h2
                className="font-heading font-semibold"
                style={{
                  fontSize: "clamp(1.7rem,3vw,2.6rem)",
                  letterSpacing: "-0.03em",
                  lineHeight: 1.08,
                  color: "var(--color-ink)",
                }}
              >
                Ile kosztuje strona?
              </h2>
            </FadeUp>
          </div>
          <div className="md:col-span-7">
            <FadeUp inView delay={0.1}>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink-muted)",
                  maxWidth: "56ch",
                }}
              >
                Na polskim rynku strona dla firmy kosztuje najczęściej od 3 000 do 15 000 zł netto
                — dokładna kwota zależy od zakresu: liczby podstron, treści, integracji i terminu.
                Dlatego nie podajemy cen z sufitu — opisz nam krótko projekt, a wrócimy z konkretną
                kwotą. Bezpłatnie i bez zobowiązań.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.16}>
              <p
                className="mt-5"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "clamp(1.02rem,1.25vw,1.18rem)",
                  lineHeight: 1.65,
                  color: "var(--color-ink)",
                  maxWidth: "56ch",
                }}
              >
                Kreator i gotowy szablon są tanie na start, ale wyglądają jak tysiąc innych stron i
                trudno je rozwijać. U nas dostajesz coś innego: kod pisany pod Twój konkretny
                biznes, bezpośredni kontakt z osobami, które go tworzą, i zakres ustalony w umowie.
              </p>
            </FadeUp>
            <FadeUp inView delay={0.22}>
              <Link
                href="/cennik"
                className="mt-6 inline-flex font-heading text-[0.95rem] font-semibold underline decoration-pink/40 underline-offset-4 transition-colors hover:decoration-pink"
                style={{ color: "var(--color-ink)" }}
              >
                Zobacz pełny cennik i co wpływa na cenę →
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Process — "Jak pracujemy" ── */}
      <section data-header-theme="dark" data-canvas="process" className="relative">
        {/* Tło = PageCanvas (indygowy hold „process", jak na home). Indygowe
            światło wystaje ponad sekcję — świeci przez szew w górę. */}
        <GlowField
          hue={273}
          x={10}
          y={26}
          strength={0.6}
          drift
          driftDuration={31}
          edgeFade="vertical"
          className="inset-x-0 z-0"
          style={{ top: "-18%", height: "80%" }}
        />

        <div className="container-koda section-y relative z-10">
          <FadeUp inView>
            <span className="label-koda mb-5 block">Proces</span>
          </FadeUp>
          <FadeUp inView delay={0.06}>
            <h2 className="text-section-title max-w-[16ch]">Jak pracujemy</h2>
          </FadeUp>

          <ProcessSteps />
        </div>
      </section>
    </>
  );
}
