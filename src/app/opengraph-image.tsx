import { ImageResponse } from "next/og";

// Przy output: export obrazek generowany statycznie raz przy buildzie.
export const dynamic = "force-static";

// Social share card (Open Graph + Twitter) — 1200×630 PNG generated at build time.
// Design (2026): "Obsidian" near-black + oversized brand type + one magenta light
// + a tech-spec footer. Headline = primary keyword (entity/SEO consistency with
// <title>); accent line = differentiator. Center-weighted inside the safe zone so
// it survives X/LinkedIn/iMessage crops. og:image:alt carries the keywords.
export const alt =
  "KODA Studio — strony internetowe dla firm. Projekt i kod na miarę, bez szablonów.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Load a real Geologica weight (the site's heading font) into Satori. We hit the
// Google Fonts CSS API with an OLD user-agent → it returns TTF (Satori can't read
// woff2), subset to just the glyphs we draw. Resilient: any failure → null and we
// fall back to the system sans-serif so the build never breaks.
async function loadGeologica(weight: number, text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Geologica:wght@${weight}&text=${encodeURIComponent(text)}`;
    const css = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_3) AppleWebKit/537.75.14 (KHTML, like Gecko) Version/7.0.3 Safari/537.75.14",
      },
    }).then((r) => r.text());
    const m = css.match(/src:\s*url\((https:\/\/[^)]+)\)\s*format\(['"]truetype['"]\)/);
    if (!m) return null;
    return await fetch(m[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

const HEAVY = "Strony internetowe dla firm.Projekt i kod na miaręKODA STUDIO";
const LIGHT = "kodastrony.pl BIELSKO-BIAŁA · POLSKA";

export default async function Image() {
  const [heavy, light] = await Promise.all([loadGeologica(800, HEAVY), loadGeologica(500, LIGHT)]);
  const fonts = [
    heavy && { name: "Geologica", data: heavy, weight: 800 as const, style: "normal" as const },
    light && { name: "Geologica", data: light, weight: 500 as const, style: "normal" as const },
  ].filter(Boolean) as { name: string; data: ArrayBuffer; weight: 800 | 500; style: "normal" }[];
  const ff = fonts.length ? "Geologica" : "sans-serif";

  const INK = "#f7f4f8";
  const MAGENTA = "#e85cce";
  const MUTED = "#9a93a3";

  return new ImageResponse(
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        position: "relative",
        background: "#0a0a0c",
        fontFamily: ff,
      }}
    >
      {/* magenta key light — behind the headline (depth, never flat) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          backgroundImage:
            "radial-gradient(58% 72% at 26% 42%, rgba(179,42,157,0.36) 0%, rgba(179,42,157,0) 62%)",
        }}
      />
      {/* cool violet fill — lower-right, keeps the corner alive */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 1200,
          height: 630,
          display: "flex",
          backgroundImage:
            "radial-gradient(46% 58% at 100% 106%, rgba(110,43,216,0.22) 0%, rgba(110,43,216,0) 55%)",
        }}
      />

      <div
        style={{
          position: "relative",
          width: 1200,
          height: 630,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "70px 80px",
        }}
      >
        {/* wordmark — dot + tracked label */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              width: 13,
              height: 13,
              borderRadius: 13,
              background: MAGENTA,
              marginRight: 18,
              display: "flex",
            }}
          />
          <div
            style={{
              display: "flex",
              color: "rgba(247,244,248,0.92)",
              fontSize: 27,
              fontWeight: 800,
              letterSpacing: 9,
            }}
          >
            KODA STUDIO
          </div>
        </div>

        {/* hero headline (primary keyword) + accent differentiator */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: INK,
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: -3,
            }}
          >
            Strony internetowe
          </div>
          <div
            style={{
              display: "flex",
              color: INK,
              fontSize: 104,
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: -3,
            }}
          >
            dla firm.
          </div>
          <div
            style={{
              display: "flex",
              color: MAGENTA,
              fontSize: 40,
              fontWeight: 800,
              letterSpacing: -0.5,
              marginTop: 28,
            }}
          >
            Projekt i kod na miarę.
          </div>
        </div>

        {/* tech-spec footer — hairline + domain / locality */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: "100%",
              height: 1,
              background: "rgba(255,255,255,0.10)",
              marginBottom: 22,
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", color: MUTED, fontSize: 25, fontWeight: 500 }}>
              kodastrony.pl
            </div>
            <div
              style={{
                display: "flex",
                color: MUTED,
                fontSize: 22,
                fontWeight: 500,
                letterSpacing: 2,
              }}
            >
              BIELSKO-BIAŁA · POLSKA
            </div>
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts: fonts.length ? fonts : undefined }
  );
}
