"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE_CONFIG, NAV_LINKS, CONTACT } from "@/lib/constants";
import { KodaLogo } from "@/components/ui/koda-logo";
import { EASE, cssBezier } from "@/lib/motion";

export function Footer() {
  const year = new Date().getFullYear();

  // Hold kanwy pod stopką zależy od trasy (patrz HOLDS/LIGHT_HOLDS w page-canvas):
  // • HOME ("/") → "footer-home": CIEMNY w obu motywach, bo stopka domyka ciemny
  //   Statement („świt"). Inaczej scrub statement→stopka rozjaśniałby kanwę i
  //   prześwitywała przez półprzezroczysty horyzont = „rozjaśnianie poniżej sekcji".
  // • PODSTRONY → "footer": JASNY hold w jasnym motywie, by jasny CTA (CTABand)
  //   został jasny aż do krawędzi stopki (życzenie usera). Sama stopka-element jest
  //   ciemną wyspą w obu wariantach (globals.css), niezależnie od holdu.
  const pathname = usePathname();
  const canvas = pathname === "/" ? "footer-home" : "footer";

  return (
    // Tło = PageCanvas (hold ciemny #0a0609 — ciepła czerń H335: róż Statementu
    // „umiera" W stopkę zamiast zderzać się z zimnym #070709).
    <footer data-canvas={canvas} className="relative mt-auto">
      {/* Poświata — róż ledwo dogasa u górnej krawędzi (ostatni takt color story) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-64"
        style={{
          background:
            "radial-gradient(ellipse 75% 100% at 50% 0%, oklch(0.62 0.215 335 / 0.07) 0%, oklch(0.62 0.215 335 / 0.025) 45%, oklch(0.62 0.215 335 / 0) 75%)",
        }}
      />
      {/* Ciepły hairline zamiast zimnego white/5 — spójny z H335 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ backgroundColor: "rgba(255, 94, 200, 0.09)" }}
      />
      <div className="container-koda relative z-10 py-16 md:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            {/* Logo: white text + pink dot; hover → both become pink */}
            <Link
              href="/"
              aria-label={SITE_CONFIG.name}
              className="block text-[#eeeeee] hover:text-[#cf43b8]"
              style={{ transition: `color 500ms ${cssBezier(EASE.expo)}` }}
            >
              <KodaLogo width={100} height={26} />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-ink-muted">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Nav — pink-bright: #cf43b8 spada do ~3.1:1 w strefie plum→stopka */}
          <nav aria-label="Nawigacja stopki">
            <p className="label-koda mb-5" style={{ color: "var(--color-pink-bright)" }}>
              Strony
            </p>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-ink-muted transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/uslugi/strony-3d"
                  className="text-sm text-ink-muted transition-colors duration-300 hover:text-white"
                >
                  Strony 3D
                </Link>
              </li>
              <li>
                <Link
                  href="/cennik"
                  className="text-sm text-ink-muted transition-colors duration-300 hover:text-white"
                >
                  Cennik
                </Link>
              </li>
            </ul>
          </nav>

          {/* Contact — pasek odpowiedzialności: realne, sprawdzalne sygnały zaufania */}
          <div className="flex flex-col gap-4">
            <p className="label-koda" style={{ color: "var(--color-pink-bright)" }}>
              Kontakt
            </p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-sm text-ink-muted transition-colors duration-300 hover:text-pink"
            >
              {CONTACT.email}
            </a>
            <p className="text-sm text-ink-muted">{CONTACT.city}, Polska</p>
            <p className="text-sm text-ink-muted">Odpowiadamy w 24 h</p>
            <p className="text-sm text-ink-muted">
              Pracujemy na umowie z ustalonym zakresem i terminem
            </p>
            {CONTACT.nip && <p className="text-sm text-ink-muted">NIP: {CONTACT.nip}</p>}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ink-muted sm:flex-row sm:items-center">
          {/* suppressHydrationWarning: rok liczony z new Date() jest „zapiekany" w
              statycznym eksporcie w momencie buildu; gdyby stronę z buildu z roku N
              otworzyć po 1 stycznia N+1 bez redeployu, SSR='N' a klient='N+1' = mismatch
              (#418) na całej stronie. Tłumimy ten jeden węzeł (klient pokaże aktualny rok). */}
          <span suppressHydrationWarning>© {year} KODA. Wszelkie prawa zastrzeżone.</span>
          <div className="flex gap-6">
            <Link href="/polityka-prywatnosci" className="transition-colors hover:text-white">
              Polityka prywatności
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
