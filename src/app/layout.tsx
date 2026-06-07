import type { Metadata, Viewport } from "next";
import { Syne, Inter, Geologica } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { HeaderThemeProvider } from "@/hooks/use-header-theme";
import "./globals.css";

// HEADING font (--font-heading). Variable grotesk → full weight axis, one file.
// To try another display font: swap this import + the --font-heading fallback
// name in globals.css. Nothing else changes (the logo is on --font-logo).
// HEADING font = Geologica (wybór Natana, 2026-06-07). Variable na Google Fonts;
// bierzemy realnie używane wagi (400/600/700/800) → mniejszy payload, a 800 jest
// REALNY (koniec syntetycznego faux-bold na nagłówkach/kartach/menu).
const display = Geologica({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"], // polskie znaki (ą, ę, ł, ó, ś, ż, ź, ć, ń)
  // Realnie używane wagi: 400 (glify "+"), 600 (nagłówki), 700 (label/bold),
  // 800 (extrabold nagłówki/karty/menu — wcześniej syntetyzowany faux-bold).
  // 500 usunięte — nieużywane (mniejszy payload).
  weight: ["400", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
  weight: ["400"], // body używa tylko 400 — 500/600 były nieużywane (mniejszy payload)
  display: "swap",
});

// Syne — now used ONLY by the KODA wordmark (--font-logo), so changing the
// heading font never alters the logo Natan likes. Trimmed to the single weight
// the wordmark renders (800).
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin", "latin-ext"],
  weight: ["800"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0b0b0d", // = --color-bg (kanwa) → chrome mobile pasuje do strony
};

export const metadata: Metadata = {
  title: {
    default: "KODA Studio — Strony internetowe dla biznesów w Polsce",
    template: "%s | KODA Studio",
  },
  description:
    "Tworzymy niestandardowe strony internetowe dla polskich firm. Szybkie, skuteczne, dopasowane do Twojego biznesu.",
  keywords: ["strony internetowe", "web design", "Polska", "agencja", "KODA", "Warsaw"],
  authors: [{ name: "KODA Studio", url: "https://kodastrony.pl" }],
  creator: "KODA Studio",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://kodastrony.pl",
    siteName: "KODA Studio",
    title: "KODA Studio — Strony internetowe dla biznesów w Polsce",
    description:
      "Tworzymy niestandardowe strony internetowe dla polskich firm. Szybkie, skuteczne, dopasowane do Twojego biznesu.",
  },
  twitter: {
    card: "summary_large_image",
    title: "KODA Studio",
    description: "Tworzymy niestandardowe strony internetowe dla polskich firm.",
  },
  metadataBase: new URL("https://kodastrony.pl"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${display.variable} ${inter.variable} ${syne.variable}`}>
      <body className="bg-dark text-off-white font-body antialiased flex flex-col min-h-svh">
        {/* Skip-to-content — pierwszy element fokusowalny; pozwala pominąć nagłówek
            (logo + menu + CTA) i skoczyć do treści. Ukryty do momentu focusu (Tab). */}
        <a
          href="#main"
          className="sr-only rounded-full bg-pink px-5 py-3 font-heading text-[13px] font-bold text-white shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[400]"
        >
          Przejdź do treści
        </a>
        {/* Fail-open: bez JS (lub dla botów nieczytających JS) animacje wejścia nie
            odpalą się, więc tu wymuszamy widoczność każdego [data-reveal] i chowamy
            zamrożony overlay intro. Z JS — ignorowane, animacje grają normalnie. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                "[data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}[data-intro]{display:none!important}[data-menu]{display:none!important}",
            }}
          />
        </noscript>
        <SmoothScroll>
          <MotionProvider>
            <HeaderThemeProvider>
              <Header />
              <ScrollProgress />
              <main id="main" className="flex-1">{children}</main>
              <Footer />
              <CustomCursor />
            </HeaderThemeProvider>
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
