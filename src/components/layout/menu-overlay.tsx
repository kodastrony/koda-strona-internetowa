"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EASE } from "@/lib/motion";
import { NAV_LINKS, CONTACT, SITE_CONFIG } from "@/lib/constants";

/* ════════════════════════════════════════════════════════════════════
   KODA — full-screen menu overlay (baunfire-style)
   ────────────────────────────────────────────────────────────────────
   Klik w magnetyczny przycisk → BIAŁE KOŁO skaluje się z pozycji przycisku
   i pokrywa całą stronę (transform scale = GPU, EASE.primary). Treść (numer,
   pozycje, kontakt) wjeżdża staggerem na wierzchu.

   ── SPAM-PROOF (fix „biała strona / tekst znika") ───────────────────
   Overlay jest ZAWSZE zamontowany; otwarcie/zamknięcie steruje WYŁĄCZNIE
   prop `open` (koło: scale ↔ 0, treść: variant visible ↔ hidden). NIE ma
   AnimatePresence ani montowania/odmontowywania — więc szybkie klikanie
   nie może zostawić „osieroconego" stanu (koło na full + treść zniknięta).
   Każde kliknięcie po prostu PRZEKIEROWUJE animację do nowego celu (motion
   płynnie przejmuje w locie). Zamknięty overlay: pointer-events:none + inert
   + aria-hidden (poza drzewem dostępności i kolejnością tabulacji).

   Hover pozycji: słowo wysuwa się w prawo, w zwolnionym miejscu pojawia się
   różowy numer (01–05), a WSZYSTKIE pozostałe pozycje przygasają (dim).
   Easing słowa/dim = EASE.smooth — identycznie jak baunfire.

   Kolory KODA: białe tło, ciemny tekst (#0f0f0f), różowe akcenty (#cf43b8).
   ════════════════════════════════════════════════════════════════════ */

export interface Origin { x: number; y: number; }

// Pozycje menu = nawigacja + Kontakt (numerowane 01–05)
const MENU_ITEMS = [
  ...NAV_LINKS,
  { label: "Kontakt", href: "/kontakt" },
] as const;

const DARK  = "#0f0f0f";                 // tekst aktywny
const DIM   = "rgba(15, 15, 15, 0.16)";  // tekst przygaszony (dim)
const SLIDE = 40;                        // px — wysunięcie słowa na hover

const CIRCLE_R = 30;                     // promień koła bazowego (60px)

// ── Timing OTWIERANIA vs ZAMYKANIA (asymetryczny — kluczowe dla „czystego" zamknięcia) ──
// OTWARCIE: białe koło rozszerza się, a treść wjeżdża staggerem PO nim (delayChildren).
// ZAMKNIĘCIE: treść znika NAJPIERW — szybko i RAZEM (bez staggera, easeOut = od razu
//   gaśnie) — a dopiero potem koło się cofa (ma własny delay, niżej). Inaczej koło
//   odsłaniało ciemny hero ZANIM zniknął ciemny tekst → tekst „wisiał" (bug z filmiku).
const content: Variants = {
  hidden:  {}, // brak orkiestracji → wszystkie dzieci gasną jednocześnie i szybko
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } },
};

const fadeItem: Variants = {
  hidden:  { opacity: 0, y: 6, transition: { duration: 0.15, ease: "easeOut" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.primary } },
};

const fadeSide: Variants = {
  hidden:  { opacity: 0, y: 6, transition: { duration: 0.15, ease: "easeOut" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.primary } },
};

export function MenuOverlay({
  open,
  origin,
  onClose,
}: {
  open: boolean;
  origin: Origin | null;
  onClose: () => void;
}) {
  const reduce = useReducedMotion();
  const [hovered, setHovered] = useState<number | null>(null);

  // Promień koła pokrywającego cały viewport z pozycji przycisku — DERIVED
  // (useMemo, nie setState w efekcie). SSR-safe: bez window/origin → 1.
  const scale = useMemo(() => {
    if (!origin || typeof window === "undefined") return 1;
    const dx = Math.max(origin.x, window.innerWidth - origin.x);
    const dy = Math.max(origin.y, window.innerHeight - origin.y);
    return (Math.hypot(dx, dy) / CIRCLE_R) * 1.08;
  }, [origin]);

  // Blokada scrolla + Esc — TYLKO gdy otwarte. Klucz `open` jest teraz
  // zmieniany rzadko i czysto (overlay zawsze zamontowany, brak wyścigu
  // montowania), więc lock/unlock zawsze trzymają się stanu.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  // Pozycja koła: środek przycisku (origin). Zanim user pierwszy raz otworzy
  // menu origin jest null → chowamy koło daleko poza ekran (i tak ma scale 0).
  const cx = origin?.x ?? -9999;
  const cy = origin?.y ?? -9999;

  return (
    // Zawsze zamontowany. Zamknięty = przezroczysty dla zdarzeń + inert (poza
    // dostępnością/tabulacją). data-menu → noscript chowa go bez JS (fail-open).
    <div
      data-menu
      className="fixed inset-0 z-[var(--z-menu)]"
      role="dialog"
      aria-modal="true"
      aria-label="Menu nawigacyjne"
      aria-hidden={!open}
      inert={!open || undefined}
      style={{ pointerEvents: open ? "auto" : "none" }}
    >
      {/* ── Białe koło — skaluje się z pozycji przycisku ─────────── */}
      <motion.div
        aria-hidden="true"
        style={{
          position:        "fixed",
          left:            cx - CIRCLE_R,
          top:             cy - CIRCLE_R,
          width:           CIRCLE_R * 2,
          height:          CIRCLE_R * 2,
          borderRadius:    "50%",
          backgroundColor: "#ffffff",
          transformOrigin: "center",
          willChange:      "transform",
        }}
        initial={false}
        animate={{ scale: open ? scale : 0 }}
        transition={reduce
          ? { duration: 0 }
          // Zamknięcie: koło CZEKA ~0.12s (tekst zdąży zniknąć), POTEM szybko się cofa
          // → kolejność „najpierw tekst, potem białe tło" (nie odwrotnie).
          : { duration: open ? 0.7 : 0.45, ease: EASE.primary, delay: open ? 0 : 0.12 }}
      />

      {/* ── Treść menu ───────────────────────────────────────────── */}
      <motion.div
        className="container-koda relative flex h-full flex-col justify-center"
        style={{ paddingTop: 130, paddingBottom: 40 }}
        variants={content}
        initial={false}
        animate={open ? "visible" : "hidden"}
        // Po pełnym zamknięciu zerujemy podświetlenie → następne otwarcie startuje
        // bez stale-hover. (Bez setState-in-effect.)
        onAnimationComplete={(def) => { if (def === "hidden") setHovered(null); }}
      >
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-20">

          {/* LEWA: etykieta MENU + pozycje */}
          <div className="flex items-start gap-5 sm:gap-8">
            <motion.span
              variants={fadeSide}
              aria-hidden="true"
              className="hidden sm:block shrink-0"
              style={{
                fontFamily:    "var(--font-heading)",
                fontSize:      "11px",
                fontWeight:    700,
                letterSpacing: "0.3em",
                color:         "rgba(15,15,15,0.3)",
                writingMode:   "vertical-rl",
                transform:     "rotate(180deg)",
                marginTop:     "0.5rem",
              }}
            >
              MENU
            </motion.span>

            <nav aria-label="Menu główne">
              <ul className="flex flex-col">
                {MENU_ITEMS.map((item, i) => {
                  const isHover = hovered === i;
                  const dim = hovered !== null && !isHover;
                  return (
                    <motion.li key={item.href} variants={fadeItem}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        onMouseEnter={() => setHovered(i)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative block"
                        style={{ paddingBlock: "clamp(2px, 0.4vw, 6px)" }}
                      >
                        {/* numer 01–05 — w miejscu zwolnionym przez słowo */}
                        <motion.span
                          aria-hidden="true"
                          className="absolute"
                          style={{
                            left:          0,
                            top:           "0.65em",
                            fontFamily:    "var(--font-heading)",
                            fontWeight:    700,
                            fontSize:      "clamp(10px, 0.9vw, 13px)",
                            letterSpacing: "0.05em",
                            color:         "var(--color-pink)",
                          }}
                          animate={{ opacity: isHover ? 1 : 0, x: isHover ? 0 : -6 }}
                          transition={{ duration: 0.45, ease: EASE.smooth }}
                        >
                          0{i + 1}
                        </motion.span>

                        {/* słowo — wysuwa się w prawo + przygasa */}
                        <motion.span
                          className="block"
                          style={{
                            fontFamily:    "var(--font-heading)",
                            fontWeight:    800,
                            fontSize:      "clamp(2.5rem, 7vw, 5.25rem)",
                            lineHeight:    1.04,
                            letterSpacing: "-0.03em",
                          }}
                          animate={{ x: isHover ? SLIDE : 0, color: dim ? DIM : DARK }}
                          transition={{ duration: 0.6, ease: EASE.smooth }}
                        >
                          {item.label}
                        </motion.span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* PRAWA: kontakt */}
          <motion.div
            variants={fadeSide}
            className="flex flex-col gap-3 lg:items-end lg:text-right"
          >
            <a
              href={`mailto:${CONTACT.email}`}
              className="transition-colors duration-300"
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "clamp(0.95rem, 1.3vw, 1.15rem)",
                color:      "var(--color-pink)",
              }}
            >
              {CONTACT.email}
            </a>
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize:   "0.95rem",
                color:      "rgba(15,15,15,0.55)",
              }}
            >
              Warszawa, Polska
            </span>
            <span
              style={{
                fontFamily:    "var(--font-heading)",
                fontSize:      "10px",
                fontWeight:    700,
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color:         "rgba(15,15,15,0.3)",
                marginTop:     "1.25rem",
              }}
            >
              {SITE_CONFIG.url.replace("https://", "")}
            </span>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
}
