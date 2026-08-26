import type { Metadata, Viewport } from "next";
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
import { SITE_CONFIG, CONTACT, ANALYTICS } from "@/lib/constants";
import { jsonLd } from "@/lib/seo";
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
      telephone: CONTACT.phoneE164,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/icon.svg`,
        width: 512,
        height: 512,
      },
      description: SITE_CONFIG.description,
      areaServed: "PL",
      sameAs: ["https://github.com/kodastrony"],
      contactPoint: {
        "@type": "ContactPoint",
        email: CONTACT.email,
        telephone: CONTACT.phoneE164,
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
      // telephone: REALNY numer (dodany 2026-08-26 na życzenie Natana) — domyka
      // NAP (nazwa+adres+telefon) i odblokowuje spójność z przyszłym GBP.
      telephone: CONTACT.phoneE164,
      image: [`${SITE_CONFIG.url}/icon.svg`, `${SITE_CONFIG.url}/opengraph-image`],
      parentOrganization: { "@id": `${SITE_CONFIG.url}/#organization` },
      description: SITE_CONFIG.tagline,
      knowsLanguage: "pl",
      // Realne, weryfikowalne kompetencje (6 żywych dem + treść /uslugi/) —
      // czysty sygnał encyjny dla AI search, zero fabrykacji.
      knowsAbout: [
        "Projektowanie stron internetowych",
        "Strony internetowe 3D (WebGL, Three.js, React Three Fiber)",
        "Animacje webowe",
        "SEO techniczne i Core Web Vitals",
        "Dostępność cyfrowa (WCAG 2.2 AA)",
      ],
      areaServed: [
        { "@type": "Country", name: "Polska" },
        { "@type": "AdministrativeArea", name: "województwo śląskie" },
        { "@type": "City", name: CONTACT.city },
      ],
      // Bez serviceType: to własność typu Service, NIE ProfessionalService/LocalBusiness
      // (walidator Google: UNKNOWN_FIELD ×4 na każdej stronie). Zakres usług niosą
      // knowsAbout (wyżej) + węzły Service i OfferCatalog na /uslugi/.
      // Geo na poziomie MIASTA (centroid Bielska-Białej) — wzmacnia encję lokalną
      // pod local pack / lokalne odpowiedzi AI, bez podawania precyzyjnego adresu
      // (firma usługowa bez lokalu z obsługą klienta). openingHours / NIP /
      // aggregateRating dodajemy DOPIERO, gdy będą realne (zależne od Natana);
      // telephone jest już realny (2026-08-26).
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
  // theme-color = kolor, którym Chromium maluje TŁO dokumentu podczas nawigacji
  // (między starą a nową stroną — widoczne TYLKO przy pierwszym wejściu, nie refresh).
  // Historia tego pola:
  //  • stałe ciemne #0b0b0d → przy wejściu z ciemnej karty na naszą JASNĄ stronę
  //    1 klatka CZARNA;
  //  • wariant prefers-color-scheme (light/dark) → Chromium NIE używa media-query
  //    theme-color do backdropu, więc spadał na DOMYŚLNY ciemny kolor schematu OS
  //    = SZARY #3b3a3f (user na ciemnym OS + jasny motyw strony widział szary błysk).
  // ROZWIĄZANIE: JEDEN, STAŁY kolor = porcelana #f7f4f8 (główny/jasny look marki).
  // Strona jest light-first (auto-jasny 07–20, marka = porcelana), więc backdrop
  // wejścia zawsze jasny → płynnie wtapia się w jasny top strony, bez błysku — i to
  // NIEZALEŻNIE od motywu OS usera. (Kompromis: wejście NOCĄ przy auto-ciemnym da
  // krótki jasny backdrop zamiast ciemnego — akceptowalne, bo i tak najpierw widać
  // markową porcelanę; gdyby przeszkadzało, do rozważenia dynamiczny update metatagu.)
  themeColor: "#f7f4f8",
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
  // Bez meta keywords: Google ignoruje od 2009, część audytorów flaguje jako
  // przestarzałe, a lista zdradzała strategię fraz konkurencji (audyt 2026-08-26).
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
    // ★ MOTYW: TYLKO JASNY, NA STAŁE (decyzja Natana 2026-08-26 — „zostawiamy
    // tylko biały motyw zawsze"). SSR renderuje <html data-koda-light
    // style=color-scheme:light> i NIC tego nigdy nie zdejmuje: dawny automat
    // pory dnia (jasny 07–20 / ciemny nocą), inline-skrypt theme-init,
    // ThemeAutoSync i toggle ☀/☾ w headerze zostały USUNIĘTE (git: stan sprzed
    // 2026-08-26). Pierwsza klatka zawsze porcelanowa, zero skryptu przed
    // malowaniem, zero FOUC. Ciemne WYSPY (stopka, Statement) są niezależne od
    // motywu — lokalne tokeny w globals.css. Ciemne tokeny :root w globals.css
    // zostają jako martwa gałąź (html bez atrybutu nie występuje) + zasilają wyspy.
    <html
      lang="pl"
      data-koda-light=""
      // ⚠️ NIE ustawiać tła na <html>! PageCanvas (fixed -z-10) działa TYLKO gdy
      // <html> NIE ma tła — wtedy tło body propaguje na „canvas dokumentu", a
      // PageCanvas maluje NAD nim. Tło na <html> łamało ten inwariant → PageCanvas
      // przestawał zasłaniać → jasne tło body prześwitywało przez przezroczyste
      // sekcje (np. ciemna wyspa Statement robiła się jasna na górze). Tu zostaje
      // tylko colorScheme:light (spójny chrom/scrollbar od startu).
      style={{ colorScheme: "light" }}
      className={`${display.variable} ${inter.variable} ${syne.variable}`}
    >
      {/* Tło porcelana INLINE na <body> (NIE na <html> — to łamało PageCanvas).
          Body to „canvas dokumentu", nad którym PageCanvas (-z-10) maluje, więc
          tło body jest BEZPIECZNE i wypełnia lukę „przed wczytaniem globals.css"
          porcelaną zamiast szarego domyślnego tła przeglądarki. */}
      <body
        style={{ backgroundColor: "#f7f4f8" }}
        className="flex min-h-svh flex-col bg-dark font-body text-off-white antialiased"
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(ORG_JSON_LD) }}
        />
        {/* Cloudflare Web Analytics — surowy <script> (serwerowo w statycznym HTML,
            ładuje się od razu, dokładnie wg snippetu Cloudflare). Świadomie NIE
            next/script (afterInteractive wstrzykiwał go dopiero po stronie klienta,
            więc nie było go w HTML). Cookieless; CSP w public/_headers wpuszcza jego
            domeny. Renderuje się gdy token ustawiony. */}
        {ANALYTICS.cfBeaconToken ? (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: ANALYTICS.cfBeaconToken })}
          />
        ) : null}
        {/* Skip-to-content — pierwszy element fokusowalny; pozwala pominąć nagłówek
            (logo + menu + CTA) i skoczyć do treści. Ukryty do momentu focusu (Tab). */}
        <a
          href="#main"
          className="sr-only rounded-full bg-[#b32a9d] px-5 py-3 font-heading text-[13px] font-bold text-white shadow-lg focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[400]"
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
