import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Przy output: export obrazek generowany statycznie raz przy buildzie.
export const dynamic = "force-static";

// Social share card (Open Graph + Twitter) — 1200×630 PNG generowany przy buildzie.
//
// Design (17.08.2026, decyzja Natana): 1:1 z „tłem profilu" Useme
// (marketing/useme-grafiki/tlo-koda.jpg, generator _portfolio-research/useme-v5.mjs,
// sekcja TŁO) — porcelana #f7f4f8 + aurora jak w hero strony, wielki wordmark
// „KODA." (Syne 800, pastelowy gradient różowo-lawendowy przez background-clip:
// text — „duch" liter z hero), pod nim „Strony internetowe premium." (Inter 700)
// i zakres (Inter 400). Wszystko wyśrodkowane, więc przeżywa kadrowanie
// X/LinkedIn/iMessage/Discord. Proporcje przeliczone z kadru 1580×500 na 1200×630
// (wordmark ~73% szerokości, stos ~45% wysokości, środek optyczny 5 px nad
// geometrycznym). Poprzednia wersja (hook + pigułka CTA) — git 85b0e9c.
// og:image:alt niesie słowa kluczowe.
export const alt =
  "KODA. — strony internetowe premium: grafika 3D, konfiguratory produktów, animacje. Projekt i kod od zera, Bielsko-Biała · kodastrony.pl";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Fonty czytamy z REPO (src/assets/og-fonts — subsety Latin/Latin-Ext, OFL), NIE
// z Google Fonts w czasie builda. Poprzednia wersja pobierała TTF z Google Fonts
// CSS API i po cichu spadała na sans-serif, gdy API zaczęło zwracać WOFF (tak
// wyglądał baner na żywo do 17.08.2026). Brak pliku = build ma się WYWALIĆ,
// a nie wypuścić brzydki baner.
const FONT_DIR = join(process.cwd(), "src", "assets", "og-fonts");
async function font(file: string): Promise<ArrayBuffer> {
  const buf = await readFile(join(FONT_DIR, file));
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer;
}

// Tokeny marki (jasny motyw strony: porcelana, atrament). letter-spacing z em → px,
// bo Satori liczy w px.
const W = 1200;
const H = 630;
const PORCELAIN = "#f7f4f8";
const INK = "#131316";
const em = (px: number, e: number) => Math.round(px * e * 100) / 100;

// Aurora ze strony: radial-gradient(1050px 560px at 78% 12%) itd. przeliczone na
// % pola 1200×630 (Satori przyjmuje rozmiar elipsy w %). Każda plama = osobna
// warstwa (Satori nie składa wielu obrazów tła w jednej właściwości).
const AURORA = [
  "radial-gradient(87.5% 88.9% at 78% 12%, rgba(207,67,184,0.13) 0%, rgba(207,67,184,0) 66%)",
  "radial-gradient(68.3% 82.5% at 96% 80%, rgba(150,118,222,0.11) 0%, rgba(150,118,222,0) 70%)",
  "radial-gradient(63.3% 76.2% at 5% 92%, rgba(255,94,200,0.08) 0%, rgba(255,94,200,0) 70%)",
];

// Pastelowy gradient „ducha" wordmarku — DOKŁADNIE jak w useme-v5.mjs (GRAD):
// gradient KODA_FILL_LIGHT ze strony złożony z porcelaną, lekko dociążony.
const WORDMARK_GRADIENT = "linear-gradient(180deg, #E8CCE6 0%, #D9C7EE 52%, #D0CCF0 100%)";

// Rozmiary (px na 1200×630). Z kadru Useme (168/31/20 na 1580×500) powiększone,
// bo karta w komunikatorach jest oglądana w ~400–500 px szerokości.
const WORDMARK = 180;
const HEADLINE = 40;
const SUB = 25;

export default async function Image() {
  const [inter400, inter700, syne800] = await Promise.all([
    font("Inter-400.ttf"),
    font("Inter-700.ttf"),
    font("Syne-800.ttf"),
  ]);
  const fonts = [
    { name: "Inter", data: inter400, weight: 400 as const, style: "normal" as const },
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

      {/* stos wyśrodkowany; paddingBottom = środek optyczny lekko nad geometrycznym
          (wordmark jest cięższy od tekstu pod nim) */}
      <div
        style={{
          position: "relative",
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 30,
        }}
      >
        {/* wordmark KODA. — Syne 800, tracking -0.04em, pastelowy gradient w literach.
            marginLeft 21 = korekta optyczna: lewe światło „K" (70 j. fontu) + ujemny
            tracking po kropce przesuwały wizualny środek ~10 px w lewo (pomiar bboxu). */}
        <div
          style={{
            display: "flex",
            marginLeft: 21,
            fontFamily: "Syne",
            fontWeight: 800,
            fontSize: WORDMARK,
            lineHeight: 0.9,
            letterSpacing: em(WORDMARK, -0.04),
            backgroundImage: WORDMARK_GRADIENT,
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
        >
          KODA.
        </div>

        {/* hook — Inter 700 jak na tle profilu */}
        <div
          style={{
            display: "flex",
            marginTop: 44,
            fontWeight: 700,
            fontSize: HEADLINE,
            letterSpacing: em(HEADLINE, -0.01),
            color: INK,
          }}
        >
          Strony internetowe premium.
        </div>

        {/* zakres — twarde spacje (\u00a0) wokół kropek: Satori zwija zwykłe podwójne spacje */}
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontWeight: 400,
            fontSize: SUB,
            letterSpacing: em(SUB, 0.02),
            color: "rgba(19,19,22,0.58)",
          }}
        >
          {"grafika 3D \u00a0·\u00a0 konfiguratory produktów \u00a0·\u00a0 animacje"}
        </div>
      </div>
    </div>,
    { ...size, fonts }
  );
}
