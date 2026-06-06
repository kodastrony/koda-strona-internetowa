"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useHeaderTheme } from "@/hooks/use-header-theme";
import { useLogoHidden } from "@/hooks/use-logo-hide";
import { KodaLogo } from "@/components/ui/koda-logo";
import { EASE, INTRO_DURATION, cssBezier } from "@/lib/motion";
import { introHasPlayed } from "@/lib/intro-state";
import { MenuOverlay, type Origin } from "@/components/layout/menu-overlay";

const CLR_EASE = cssBezier(EASE.expo);
const CLR_DUR  = "500ms";

// Siła magnesu: przycisk podąża za kursorem o 35% jego odległości od środka.
const MAGNET_STRENGTH = 0.35;
const MAGNET_SPRING = { stiffness: 180, damping: 14, mass: 0.4 } as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const theme = useHeaderTheme();

  // Wejście headera jest zsync z intro tylko gdy intro gra (1. twarde wejście,
  // bez reduced-motion). Inaczej (SPA / reduced-motion) header jest od razu —
  // bez ~2.4 s pustego paska. Spójne z Hero.
  const reduce = useReducedMotion();
  const base = reduce || introHasPlayed() ? 0 : INTRO_DURATION;

  // Na białym menu (open) elementy headera są ciemne — niezależnie od sekcji.
  const light = open || theme === "light";
  // Nad różową sekcją (statement): elementy zostają białe jak na „dark", ALE
  // różowe akcenty (kropka logo, pill KONTAKT) muszą zmienić kolor, bo róż-na-różu
  // znika. Gdy menu otwarte, tło jest białe → traktuj jak zwykłe „light".
  const onPink = theme === "pink" && !open;

  // ── Ukrywanie logo (widoczne na górze → znika gdy dojdziesz do nagłówka) ──
  // Logo KODA jest fixed w lewym-górnym rogu. Jest widoczne na SAMEJ górze strony,
  // a gdy zjedziesz na tyle, że zaczęłoby zasłaniać główny nagłówek strony, płynnie
  // znika — i ZOSTAJE schowane do końca zjazdu (nie wraca nad treścią niżej).
  // Powrót na górę = znowu się pojawia. Próg jest jednokierunkowy (anchor =
  // `[data-logo-hide-anchor]` na czole hero/kontakt) → zero migotania. Mierzymy
  // STABILNY wrapper (nie animowany — inaczej jego ruch wracałby do testu).
  const logoSlotRef = useRef<HTMLDivElement>(null);
  const logoHidden = useLogoHidden(logoSlotRef);
  // Focus override: gdy ktoś przejdzie na logo Tabem, MUSI być widoczne (inaczej
  // „niewidzialny" focus). Logo zostaje też w drzewie a11y (czytniki zawsze mają
  // link do strony głównej).
  const [logoFocused, setLogoFocused] = useState(false);
  const hideLogo = logoHidden && !logoFocused;

  // ── Magnetyczny przycisk ──────────────────────────────────────────
  const btnRef = useRef<HTMLButtonElement>(null);
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const x = useSpring(mvx, MAGNET_SPRING);
  const y = useSpring(mvy, MAGNET_SPRING);

  const onMagnetMove = (e: React.MouseEvent) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mvx.set((e.clientX - cx) * MAGNET_STRENGTH);
    mvy.set((e.clientY - cy) * MAGNET_STRENGTH);
  };
  const onMagnetLeave = () => { mvx.set(0); mvy.set(0); };

  // ── Toggle menu — mierzy środek przycisku jako origin koła ─────────
  const toggle = () => {
    if (!open) {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setOpen((o) => !o);
  };

  // A1 — przycisk hamburgera HIGH-CONTRAST (odwrócony): biały krążek na ciemnym/
  // różowym tle, ciemny krążek na białym tle. Linie/X kontrastują z krążkiem.
  //   • czarne tło (hero)      → biały krążek, ciemne linie
  //   • białe tło (kontakt)    → ciemny krążek, białe linie
  //   • różowe tło (statement) → biały krążek, ciemne linie
  //   • menu otwarte           → ciemny krążek (#141414) na białym menu, biały X
  const buttonBg = open ? "#141414" : light ? "#0f0f0f" : "#ffffff";
  const iconColor = light ? "#ffffff" : "#0f0f0f";

  // B1 — wyrazisty pill KONTAKT (ważny przycisk → solidne tło = zawsze czytelny,
  // nigdy nie „nachodzi"/zlewa się z treścią za nim podczas scrolla).
  //   • ciemne/białe tło → różowy pill, biały tekst (akcent marki)
  //   • różowe tło        → biały pill, ciemny tekst (róż-na-różu by zniknął)
  const pillBg   = onPink ? "#ffffff" : "#cf43b8";
  const pillText = onPink ? "#0f0f0f" : "#ffffff";
  const pillShadow = onPink
    ? "shadow-[0_6px_20px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]"
    : "shadow-[0_8px_24px_-10px_rgba(207,67,184,0.7)] hover:shadow-[0_14px_34px_-10px_rgba(207,67,184,0.9)]";

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-[var(--z-header)]">
        <div className="w-full px-[clamp(24px,4vw,58px)]">
          <nav
            className="flex h-[84px] items-center justify-between md:h-[130px] md:pt-5"
            aria-label="Nawigacja główna"
          >
            {/* ── Logo ── (top-LEFT — ciemnieje wcześnie, więc wjeżdża wcześnie:
                 jeszcze w trakcie sweepu, slide z góry)
                 ANCHOR (plain div) = STABILNY box do detekcji kolizji — NIGDY nie
                 transformowany, więc ani wejście, ani ukrywanie nie wracają do
                 testu nakładania (zero oscylacji, zero skew przy starcie). */}
            <div ref={logoSlotRef} className="z-10 shrink-0">
              {/* WEJŚCIE — slide z góry, jednorazowe, zsync z intro */}
              <motion.div
                data-reveal
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE.primary, delay: base - 0.3 }}
              >
                {/* WIDOCZNOŚĆ — gładkie, powolne zniknięcie (fade + delikatny lift,
                    jakby chowało się z powrotem w header) i równie gładki powrót.
                    Dłużej (0.6s) + miękka krzywa in-out (EASE.smooth) = bez „skoku".
                    Focus (Tab) wymusza powrót do widoku; link zostaje w drzewie
                    a11y. Schowane = nieklikalne myszą (pointer-events none).
                    reduced-motion: motion zdejmuje transform, zostaje sam fade. */}
                <motion.div
                  onFocus={() => setLogoFocused(true)}
                  onBlur={() => setLogoFocused(false)}
                  animate={{
                    opacity: hideLogo ? 0 : 1,
                    y:       hideLogo ? -10 : 0,
                  }}
                  transition={{ duration: 0.6, ease: EASE.smooth }}
                  style={{
                    transformOrigin: "left center",
                    pointerEvents:   hideLogo ? "none" : "auto",
                    willChange:      "opacity, transform",
                  }}
                >
                  <Link
                    href="/"
                    aria-label={SITE_CONFIG.name}
                    className={cn(
                      "block",
                      // Nad różem KODA zostaje białe (róż-na-różu by zniknął); poza nim
                      // standard: dziedziczy kolor sekcji, na hover różowieje jak kropka.
                      onPink
                        ? "text-[#eeeeee] hover:text-white"
                        : cn("hover:text-[#cf43b8]", light ? "text-[#0f0f0f]" : "text-[#eeeeee]"),
                    )}
                    style={{ transition: `color ${CLR_DUR} ${CLR_EASE}` }}
                  >
                    <KodaLogo width={124} height={32} dotColor={onPink ? "#ffffff" : "#cf43b8"} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* ── Right side ── (top-RIGHT — ciemnieje na końcu sweepu, więc
                 wjeżdża gdy linia dochodzi do prawej krawędzi) */}
            <motion.div
              data-reveal
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE.primary, delay: base - 0.02 }}
            >
              {/* ── KONTAKT pill (główne CTA do kontaktu) ── */}
              <Link
                href="/kontakt"
                className={cn(
                  "hidden items-center justify-center rounded-full md:inline-flex",
                  "font-heading text-[12px] font-bold uppercase tracking-[0.14em]",
                  "px-5 py-2.5 hover:-translate-y-px",
                  pillShadow,
                )}
                style={{
                  backgroundColor: pillBg,
                  color:           pillText,
                  transition: `background-color ${CLR_DUR} ${CLR_EASE}, color ${CLR_DUR} ${CLR_EASE}, transform 320ms ${CLR_EASE}, box-shadow 320ms ${CLR_EASE}`,
                }}
              >
                Kontakt
              </Link>

              {/* ── Magnetic circular button ── */}
              <div
                className="relative shrink-0"
                onMouseMove={onMagnetMove}
                onMouseLeave={onMagnetLeave}
                style={{ padding: 18, margin: -18 }} // strefa łapania > przycisk (jak baunfire scale 1.5)
              >
                <motion.button
                  ref={btnRef}
                  style={{ x, y, backgroundColor: buttonBg, transition: `background-color ${CLR_DUR} ${CLR_EASE}` }}
                  className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full"
                  onClick={toggle}
                  aria-label={open ? "Zamknij menu" : "Otwórz menu"}
                  aria-expanded={open}
                >
                  {/* hamburger lines */}
                  <span
                    className={cn(
                      "absolute flex flex-col gap-[5px] transition-all duration-300",
                      open ? "scale-75 opacity-0" : "scale-100 opacity-100",
                    )}
                  >
                    {[20, 20, 12].map((w, i) => (
                      <span
                        key={i}
                        className="block h-px"
                        style={{
                          width:           w,
                          backgroundColor: iconColor,
                          transition:      `background-color ${CLR_DUR} ${CLR_EASE}`,
                        }}
                      />
                    ))}
                  </span>

                  {/* X (close) */}
                  <span
                    className={cn(
                      "absolute flex items-center justify-center transition-all duration-300",
                      open ? "scale-100 opacity-100" : "scale-75 opacity-0",
                    )}
                  >
                    <X size={18} strokeWidth={1.5} style={{ color: iconColor }} />
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </nav>
        </div>
      </header>

      {/* ── Full-screen menu (expanding circle) ── */}
      <MenuOverlay open={open} origin={origin} onClose={() => setOpen(false)} />
    </>
  );
}
