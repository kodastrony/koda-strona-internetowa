import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Przy output: export obrazek generowany statycznie raz przy buildzie.
export const dynamic = "force-static";

// Social share card (Open Graph + Twitter) — 1200×630 PNG generowany przy buildzie.
//
// Design (2026-08): jasna „aurora" marki — 1:1 z banerem OG przygotowanym do
// profilu Useme (marketing/useme-grafiki/og-banner-1200x630.jpg, generator
// _portfolio-research/useme-og.mjs). Porcelana #f7f4f8 + trzy plamy różowo-
// fioletowe jak w hero strony, hook „Strona internetowa, która przynosi
// klientów." (Geologica 600 = font H1 strony), pigułka CTA w gradiencie
// magenta→fiolet, stopka z wordmarkiem KODA. (Syne 800) i domeną. Środek ciężkości
// w strefie bezpiecznej, więc przeżywa kadrowanie X/LinkedIn/iMessage/Discord.
// og:image:alt niesie słowa kluczowe.
export const alt =
  "KODA Studio — strona internetowa, która przynosi klientów. Projekt i kod od zera: animacje, grafika 3D, konfiguratory. Bezpłatna wycena w 24 h.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonty czytamy z REPO (src/assets/og-fonts — subsety Latin/Latin-Ext + strzałki,
// OFL), NIE z Google Fonts w czasie builda. Poprzednia wersja pobierała TTF z
// Google Fonts CSS API i po cichu spadała na sans-serif, gdy API zaczęło zwracać
// WOFF (tak wyglądał baner na żywo do 17.08.2026). Brak pliku = build ma się
// WYWALIĆ, a nie wypuścić brzydki baner.
const FONT_DIR = join(process.cwd(), "src", "assets", "og-fonts");
async function font(file: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(FONT_DIR, file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

// Tokeny marki (jasny motyw strony: porcelana, atrament, magenta tekstowa #b32a9d,
// fiolet #7c4cde). letter-spacing z em → px, bo Satori liczy w px.
const W = 1200;
const H = 630;
const PORCELAIN = "#f7f4f8";
const INK = "#131316";
const MAGENTA = "#b32a9d";
const VIOLET = "#7c4cde";
const em = (px: number, e: number) => Math.round(px * e * 100) / 100;

// Aurora ze strony: radial-gradient(1050px 560px at 78% 12%) itd. przeliczone na
// % pola 1200×630 (Satori przyjmuje rozmiar elipsy w %). Każda plama = osobna
// warstwa (Satori nie składa wielu obrazów tła w jednej właściwości).
const AURORA = [
  "radial-gradient(87.5% 88.9% at 78% 12%, rgba(207,67,184,0.13) 0%, rgba(207,67,184,0) 66%)",
  "radial-gradient(68.3% 82.5% at 96% 80%, rgba(150,118,222,0.11) 0%, rgba(150,118,222,0) 70%)",
  "radial-gradient(63.3% 76.2% at 5% 92%, rgba(255,94,200,0.08) 0%, rgba(255,94,200,0) 70%)",
];

export default async function Image() {
  const [geologica600, inter400, inter500, inter600, inter700, syne800] = await Promise.all([
    font("Geologica-600.ttf"),
    font("Inter-400.ttf"),
    font("Inter-500.ttf"),
    font("Inter-600.ttf"),
    font("Inter-700.ttf"),
    font("Syne-800.ttf"),
  ]);
  const fonts = [
    { name: "Geologica", data: geologica600, weight: 600 as const, style: "normal" as const },
    { name: "Inter", data: inter400, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: inter500, weight: 500 as const, style: "normal" as const },
    { name: "Inter", data: inter600, weight: 600 as const, style: "normal" as const },
    { name: "Inter", data: inter700, weight: 700 as const, style: "normal" as const },
    { name: "Syne", data: syne800, weight: 800 as const, style: "normal" as const },
  ];

  return new ImageResponse(
    <div
      style={{
        width: W,
        height: H,
        display: "flex",
        position: "relative",
        backgroundColor: PORCELAIN,
        fontFamily: "Inter",
      }}
    >
      {AURORA.map((bg) => (
        <div
          key={bg}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: W,
            height: H,
            display: "flex",
            backgroundImage: bg,
          }}
        />
      ))}

      <div
        style={{
          position: "relative",
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          padding: "58px 64px 50px",
        }}
      >
        {/* etykieta — kropka + rozstrzelony napis */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 9,
              height: 9,
              borderRadius: 9,
              backgroundColor: MAGENTA,
              display: "flex",
              marginRight: 10,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: em(13.5, 0.42),
              color: "#8a8a93",
            }}
          >
            KODA STUDIO
          </div>
        </div>

        {/* hook (font H1 strony) + akcent w magencie */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 41,
            fontFamily: "Geologica",
            fontWeight: 600,
            fontSize: 58,
            lineHeight: 1.13,
            letterSpacing: em(58, -0.015),
            color: INK,
          }}
        >
          <div style={{ display: "flex" }}>Strona internetowa,</div>
          <div style={{ display: "flex" }}>
            <span style={{ whiteSpace: "pre" }}>która </span>
            <span style={{ color: MAGENTA }}>przynosi klientów.</span>
          </div>
        </div>

        {/* zakres — jednym wierszem, kropki jak w banerze Useme */}
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 21,
            fontWeight: 400,
            color: "rgba(19,19,22,0.60)",
            letterSpacing: em(21, 0.01),
          }}
        >
          {/* twarde spacje (\u00a0) wokół kropek — Satori zwija zwykłe podwójne spacje */}
          {
            "Projekt i kod od zera \u00a0·\u00a0 animacje \u00a0·\u00a0 grafika 3D \u00a0·\u00a0 konfiguratory"
          }
        </div>

        {/* CTA — pigułka w gradiencie marki + dopisek */}
        <div style={{ display: "flex", alignItems: "center", marginTop: 42 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundImage: `linear-gradient(135deg, ${MAGENTA} 0%, ${VIOLET} 120%)`,
              color: "#fff",
              fontSize: 13.5,
              fontWeight: 700,
              letterSpacing: em(13.5, 0.17),
              padding: "18px 30px",
              borderRadius: 999,
              boxShadow: "0 12px 32px rgba(179,42,157,0.30)",
            }}
          >
            <span>BEZPŁATNA WYCENA W 24 H</span>
            <span style={{ fontSize: 16, letterSpacing: 0, marginLeft: 10 }}>→</span>
          </div>
          <div
            style={{ display: "flex", marginLeft: 20, fontSize: 15, color: "rgba(19,19,22,0.5)" }}
          >
            Bez zobowiązań
          </div>
        </div>

        {/* stopka — hairline + wordmark KODA. + domena / lokalizacja */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            borderTop: "1px solid rgba(19,19,22,0.10)",
            paddingTop: 17,
            justifyContent: "space-between",
            alignItems: "baseline",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontFamily: "Syne",
                fontWeight: 800,
                fontSize: 16,
                letterSpacing: em(16, -0.02),
                color: INK,
              }}
            >
              KODA
            </span>
            {/* kropka jako osobny span (kolor) — marginLeft -2 odtwarza kerning „A." */}
            <span
              style={{
                fontFamily: "Syne",
                fontWeight: 800,
                fontSize: 16,
                color: MAGENTA,
                marginLeft: -2,
              }}
            >
              .
            </span>
            <span
              style={{
                fontSize: 15,
                fontWeight: 500,
                letterSpacing: em(15, 0.01),
                color: "rgba(19,19,22,0.55)",
                marginLeft: 8,
              }}
            >
              kodastrony.pl
            </span>
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 12,
              fontWeight: 500,
              letterSpacing: em(12, 0.3),
              color: "#9a94a3",
            }}
          >
            BIELSKO-BIAŁA · POLSKA
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts }
  );
}
