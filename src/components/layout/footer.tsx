import Link from "next/link";
import { SITE_CONFIG, NAV_LINKS, CONTACT } from "@/lib/constants";
import { KodaLogo } from "@/components/ui/koda-logo";
import { EASE, cssBezier } from "@/lib/motion";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-2 border-t border-white/5 mt-auto">
      <div className="container-koda py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
            <p className="text-sm text-ink-muted leading-relaxed max-w-xs">
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
                    className="text-sm text-ink-muted hover:text-white transition-colors duration-300"
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
              className="text-sm text-ink-muted hover:text-pink transition-colors duration-300"
            >
              {CONTACT.email}
            </a>
            <p className="text-sm text-ink-muted">
              Warszawa, Polska
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs text-ink-muted">
          <span>© {year} KODA. Wszelkie prawa zastrzeżone.</span>
          <div className="flex gap-6">
            <Link href="/polityka-prywatnosci" className="hover:text-white transition-colors">
              Polityka prywatności
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
