import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Syne, Inter, Geologica } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { PageCanvas } from "@/components/fx/page-canvas";
import { Grain } from "@/components/fx/grain";
import { MotionProvider } from "@/components/motion/motion-provider";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { HeaderThemeProvider } from "@/hooks/use-header-theme";
import { SITE_CONFIG, CONTACT } from "@/lib/constants";
import "./globals.css";

// Organization + WebSite structured data (JSON-LD) — helps search engines build
// a knowledge panel and understand the brand. Static, so it ships in every page.
// Structured data (JSON-LD @graph, węzły spięte przez @id — AI engines i Google
// czytają graf jako jedną encję). Org (marka) → ProfessionalService (lokalny
// biznes: usługi, obszar, adres) → WebSite. Tylko PRAWDA — bez zmyślonych ocen,
// cen czy geo. sameAs (GitHub org) = realne potwierdzenie encji w sieci. To jest
// najmocniejsza dźwignia pod AI search / AEO (cytowanie marki przez LLM-y).
const ORG_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      email: CONTACT.email,
      logo: `${SITE_CONFIG.url}/icon.svg`,
      description: SITE_CONFIG.description,
      areaServed: "PL",
      sameAs: ["https://github.com/kodastrony"],
      contactPoint: {
        "@type": "ContactPoint",
        email: CONTACT.email,
        contactType: "customer service",
        areaServed: "PL",
        availableLanguage: ["pl"],
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.city,
        addressRegion: "śląskie",
        addressCountry: "PL",
      },
    },
    {
      "@type": "ProfessionalService",
      "@id": `${SITE_CONFIG.url}/#business`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      parentOrganization: { "@id": `${SITE_CONFIG.url}/#organization` },
      description: SITE_CONFIG.tagline,
      knowsLanguage: "pl",
      areaServed: [
        { "@type": "Country", name: "Polska" },
        { "@type": "City", name: CONTACT.city },
      ],
      serviceType: [
        "Projektowanie stron internetowych",
        "Strony internetowe 2D i 3D",
        "SEO i optymalizacja",
        "Opieka i rozwój stron",
      ],
      // Geo na poziomie MIASTA (centroid Bielska-Białej) — wzmacnia encję lokalną
      // pod local pack / lokalne odpowiedzi AI, bez podawania precyzyjnego adresu
      // (firma usługowa bez lokalu z obsługą klienta). openingHours / telephone /
      // NIP / aggregateRating dodajemy DOPIERO, gdy będą realne (zależne od Natana).
      geo: {
        "@type": "GeoCoordinates",
        latitude: 49.8224,
        longitude: 19.0444,
      },
      address: {
        "@type": "PostalAddress",
        addressLocality: CONTACT.city,
        addressRegion: "śląskie",
        addressCountry: "PL",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      inLanguage: "pl-PL",
      publisher: { "@id": `${SITE_CONFIG.url}/#organization` },
    },
  ],
};

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
  // Primary keyword front-loaded, differentiator ("projekt i kod" = projekt +
  // własny kod, bez szablonów), brand last. <title>, og:title, the H1 story and
  // the OG banner all tell the SAME story → Google ma mniejszy powód, by
  // przepisać tytuł (spójny encyjny sygnał, ważny też dla AI search / AEO).
  title: {
    default: "Strony internetowe dla firm — projekt i kod | KODA Studio",
    template: "%s | KODA Studio",
  },
  description:
    "Projektujemy i kodujemy strony internetowe dla firm — z Bielska-Białej i całej Polski. Bez szablonów, z zakresem i terminem w umowie. Odpowiadamy w 24 h.",
  keywords: [
    "strony internetowe dla firm",
    "tworzenie stron internetowych",
    "projektowanie stron www",
    "strona internetowa dla firmy",
    "strony internetowe na miarę",
    "strony internetowe bez szablonów",
    "agencja interaktywna",
    "strony internetowe Bielsko-Biała",
    "KODA Studio",
  ],
  authors: [{ name: "KODA Studio", url: "https://kodastrony.pl" }],
  creator: "KODA Studio",
  openGraph: {
    type: "website",
    locale: "pl_PL",
    url: "https://kodastrony.pl",
    siteName: "KODA Studio",
    // bez sufiksu marki — siteName już pokazuje „KODA Studio" w embedzie
    title: "Strony internetowe dla firm — projekt i kod na miarę",
    description:
      "Projektujemy i kodujemy strony internetowe dla firm — z Bielska-Białej i całej Polski. Bez szablonów, z zakresem i terminem w umowie. Odpowiadamy w 24 h.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Strony internetowe dla firm — KODA Studio",
    description:
      "Projektujemy i kodujemy strony internetowe dla firm w całej Polsce. Bez szablonów, z zakresem i terminem w umowie. Odpowiadamy w 24 h.",
  },
  metadataBase: new URL("https://kodastrony.pl"),
  alternates: {
    canonical: "/",
  },
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
    // suppressHydrationWarning: inline-skrypt motywu ustawia color-scheme /
    // data-koda-light na <html> PRZED hydracją — różnica atrybutów <html> jest
    // zamierzona (wzorzec next-themes), więc wyciszamy ostrzeżenie hydracji.
    <html
      lang="pl"
      suppressHydrationWarning
      className={`${display.variable} ${inter.variable} ${syne.variable}`}
    >
      <body className="flex min-h-svh flex-col bg-dark font-body text-off-white antialiased">
        {/* Motyw PRZED malowaniem (zero FOUC): czyta localStorage i ustawia
            html[data-koda-light] + color-scheme zanim załaduje się bundle.
            beforeInteractive → Next wstrzykuje skrypt do <head> statycznego HTML.
            Klucz 'koda-theme' MUSI się zgadzać z lib/theme.ts. */}
        <Script
          id="koda-theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('koda-theme');var d=document.documentElement;if(t==='light'){d.setAttribute('data-koda-light','');d.style.colorScheme='light';}else{d.style.colorScheme='dark';}}catch(e){}})();",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSON_LD) }}
        />
        {/* Beacon Cloudflare Web Analytics wstrzykuje samo Cloudflare („Automatic
            setup"). Nie dodajemy go tu (uniknięcie duplikatu). CSP w public/_headers
            wpuszcza domeny beacona, żeby nie był blokowany. */}
        {/* Skip-to-content — pierwszy element fokusowalny; pozwala pominąć nagłówek
            (logo + menu + CTA) i skoczyć do treści. Ukryty do momentu focusu (Tab). */}
        <a
          href="#main"
          className="sr-only rounded-full bg-pink px-5 py-3 font-heading text-[13px] font-bold text-white shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[400]"
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
              {/* ⚠ PageCanvas/Grain: NIE owijać ich (ani tego poddrzewa) we
                  wrappery z transform/filter/własnym tłem — fixed canvas
                  straciłby viewport albo zniknął pod tłem (patrz komentarz
                  w page-canvas.tsx). */}
              <PageCanvas />
              <Grain />
              <Header />
              <ScrollProgress />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
              <CustomCursor />
            </HeaderThemeProvider>
          </MotionProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
