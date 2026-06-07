import Link from "next/link";
import { SITE_CONFIG, NAV_LINKS, CONTACT } from "@/lib/constants";
import { KodaLogo } from "@/components/ui/koda-logo";
import { EASE, cssBezier } from "@/lib/motion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-dark-2">
      <div className="container-koda py-16 md:py-20">
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

          {/* Nav */}
          <nav aria-label="Nawigacja stopki">
            <p className="label-koda mb-5">Strony</p>
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
            </ul>
          </nav>

          {/* Contact */}
          <div className="flex flex-col gap-5">
            <p className="label-koda">Kontakt</p>
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-sm text-ink-muted transition-colors duration-300 hover:text-pink"
            >
              {CONTACT.email}
            </a>
            <p className="text-sm text-ink-muted">Warszawa, Polska</p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 text-xs text-ink-muted sm:flex-row sm:items-center">
          <span>© {year} KODA. Wszelkie prawa zastrzeżone.</span>
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
