"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
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

// Stagger treści (po starcie koła)
const content: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.22 } },
  exit:    { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
};

const fadeItem: Variants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE.primary } },
  exit:    { opacity: 0, y: 16, transition: { duration: 0.25, ease: "easeIn" } },
};

const fadeSide: Variants = {
  hidden:  { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE.primary } },
  exit:    { opacity: 0, transition: { duration: 0.2 } },
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

  // Blokada scrolla + Esc — czysta synchronizacja z systemem (bez setState).
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

  return (
    // hover resetuje się po pełnym zamknięciu (Esc / klik pozycji / X w headerze)
    // → następne otwarcie startuje bez podświetlenia. Bez setState w efekcie.
    <AnimatePresence onExitComplete={() => setHovered(null)}>
      {open && origin && (
        <motion.div
          className="fixed inset-0 z-[var(--z-menu)]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu nawigacyjne"
          data-header-theme="light"
        >
          {/* ── Białe koło — skaluje się z pozycji przycisku ─────────── */}
          <motion.div
            aria-hidden="true"
            style={{
              position:        "fixed",
              left:            origin.x - CIRCLE_R,
              top:             origin.y - CIRCLE_R,
              width:           CIRCLE_R * 2,
              height:          CIRCLE_R * 2,
              borderRadius:    "50%",
              backgroundColor: "#ffffff",
              transformOrigin: "center",
              willChange:      "transform",
            }}
            initial={{ scale: 0 }}
            animate={{ scale }}
            exit={{ scale: 0 }}
            transition={reduce
              ? { duration: 0 }
              : { duration: 0.95, ease: EASE.primary }}
          />

          {/* ── Treść menu ───────────────────────────────────────────── */}
          <motion.div
            className="container-koda relative flex h-full flex-col justify-center"
            style={{ paddingTop: 130, paddingBottom: 40 }}
            variants={content}
            initial="hidden"
            animate="visible"
            exit="exit"
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
