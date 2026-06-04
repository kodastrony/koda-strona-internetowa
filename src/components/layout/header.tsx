"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS, SITE_CONFIG } from "@/lib/constants";
import { useHeaderTheme } from "@/hooks/use-header-theme";
import { KodaLogo } from "@/components/ui/koda-logo";
import { EASE, INTRO_DURATION, cssBezier } from "@/lib/motion";

const CLR_EASE = cssBezier(EASE.expo);
const CLR_DUR  = "500ms";

export function Header() {
  const [open, setOpen] = useState(false);
  const theme = useHeaderTheme();
  const light = theme === "light";

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full px-[clamp(24px,4vw,58px)]">
        <nav
          className="flex items-center justify-between h-[130px] pt-5"
          aria-label="Nawigacja główna"
        >
          {/* ── Logo — slides in from top ── */}
          <motion.div
            className="shrink-0 z-10"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE.expo, delay: INTRO_DURATION }}
          >
            <Link
              href="/"
              aria-label={SITE_CONFIG.name}
              className={cn(
                "block hover:text-[#cf43b8]",
                light ? "text-[#0f0f0f]" : "text-[#eeeeee]",
              )}
              style={{ transition: `color ${CLR_DUR} ${CLR_EASE}` }}
            >
              <KodaLogo width={124} height={32} />
            </Link>
          </motion.div>

          {/* ── Right side — slides in slightly after logo ── */}
          <motion.div
            className="flex items-center gap-6"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: EASE.expo, delay: INTRO_DURATION + 0.06 }}
          >
            {/* "Porozmawiajmy" text link */}
            <Link
              href="/kontakt"
              className={cn(
                "hidden md:block text-[13px] font-heading font-bold tracking-[0.16em] uppercase",
                light
                  ? "text-[#0f0f0f]/70 hover:text-[#0f0f0f]"
                  : "text-white/70 hover:text-white",
              )}
              style={{
                textDecoration:      "underline",
                textDecorationColor: light
                  ? "rgba(0,0,0,0.2)"
                  : "rgba(255,255,255,0.22)",
                textUnderlineOffset: "5px",
                transition: `color ${CLR_DUR} ${CLR_EASE}, text-decoration-color ${CLR_DUR} ${CLR_EASE}`,
              }}
            >
              Porozmawiajmy
            </Link>

            {/* Circular hamburger */}
            <button
              className="relative w-[50px] h-[50px] rounded-full flex items-center justify-center shrink-0 hover:scale-105"
              style={{
                backgroundColor: light ? "#e8e8e8" : "#1f1e1d",
                transition: `background-color ${CLR_DUR} ${CLR_EASE}, transform 300ms ease`,
              }}
              onClick={() => setOpen((o) => !o)}
              aria-label={open ? "Zamknij menu" : "Otwórz menu"}
              aria-expanded={open}
            >
              <span
                className={cn(
                  "absolute flex flex-col gap-[5px] transition-all duration-300",
                  open ? "opacity-0 scale-75" : "opacity-100 scale-100",
                )}
              >
                {[20, 20, 12].map((w, i) => (
                  <span
                    key={i}
                    className="block h-px"
                    style={{
                      width:           w,
                      backgroundColor: light ? "#0f0f0f" : "#ffffff",
                      transition:      `background-color ${CLR_DUR} ${CLR_EASE}`,
                    }}
                  />
                ))}
              </span>

              <span
                className={cn(
                  "absolute flex items-center justify-center transition-all duration-300",
                  open ? "opacity-100 scale-100" : "opacity-0 scale-75",
                )}
              >
                <X
                  size={17}
                  strokeWidth={1.5}
                  style={{
                    color:      light ? "#0f0f0f" : "#ffffff",
                    transition: `color ${CLR_DUR} ${CLR_EASE}`,
                  }}
                />
              </span>
            </button>
          </motion.div>
        </nav>
      </div>

      {/* ── Dropdown menu ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500",
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="bg-dark border-b border-white/[0.07]">
          <div
            className="flex flex-col gap-5 py-8"
            style={{ padding: `32px clamp(24px,4vw,58px)` }}
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-xs font-heading font-bold tracking-[0.3em] uppercase text-white/40 hover:text-white transition-colors duration-300 py-1"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/kontakt"
              onClick={() => setOpen(false)}
              className="md:hidden text-xs font-heading font-bold tracking-[0.3em] uppercase text-pink hover:text-pink-lighter transition-colors duration-300 py-1"
            >
              Porozmawiajmy
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
