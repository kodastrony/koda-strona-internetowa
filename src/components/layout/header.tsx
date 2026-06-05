"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useHeaderTheme } from "@/hooks/use-header-theme";
import { KodaLogo } from "@/components/ui/koda-logo";
import { EASE, INTRO_DURATION, cssBezier } from "@/lib/motion";
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

  // Na białym menu (open) elementy headera są ciemne — niezależnie od sekcji.
  const light = open || theme === "light";

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

  const buttonBg = open ? "#141414" : theme === "light" ? "#e8e8e8" : "#1f1e1d";
  const iconColor = open ? "#ffffff" : light ? "#0f0f0f" : "#ffffff";

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-[var(--z-header)]">
        <div className="w-full px-[clamp(24px,4vw,58px)]">
          <nav
            className="flex h-[84px] items-center justify-between md:h-[130px] md:pt-5"
            aria-label="Nawigacja główna"
          >
            {/* ── Logo ── (top-LEFT — ciemnieje wcześnie, więc wjeżdża wcześnie:
                 jeszcze w trakcie sweepu, slide z góry) */}
            <motion.div
              className="z-10 shrink-0"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE.primary, delay: INTRO_DURATION - 0.3 }}
            >
              <Link
                href="/"
                aria-label={SITE_CONFIG.name}
                className={cn("block hover:text-[#cf43b8]", light ? "text-[#0f0f0f]" : "text-[#eeeeee]")}
                style={{ transition: `color ${CLR_DUR} ${CLR_EASE}` }}
              >
                <KodaLogo width={124} height={32} />
              </Link>
            </motion.div>

            {/* ── Right side ── (top-RIGHT — ciemnieje na końcu sweepu, więc
                 wjeżdża gdy linia dochodzi do prawej krawędzi) */}
            <motion.div
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE.primary, delay: INTRO_DURATION - 0.02 }}
            >
              {/* "Porozmawiajmy" */}
              <Link
                href="/kontakt"
                className={cn(
                  "hidden font-heading text-[13px] font-bold uppercase tracking-[0.16em] md:block",
                  light ? "text-[#0f0f0f]/70 hover:text-[#0f0f0f]" : "text-white/70 hover:text-white",
                )}
                style={{
                  textDecoration:      "underline",
                  textDecorationColor: light ? "rgba(0,0,0,0.2)" : "rgba(255,255,255,0.22)",
                  textUnderlineOffset: "5px",
                  transition: `color ${CLR_DUR} ${CLR_EASE}, text-decoration-color ${CLR_DUR} ${CLR_EASE}`,
                }}
              >
                Porozmawiajmy
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
