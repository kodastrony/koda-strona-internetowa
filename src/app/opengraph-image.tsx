import { ImageResponse } from "next/og";

// Przy output: export obrazek generowany statycznie raz przy buildzie.
export const dynamic = "force-static";

// Social share card (Open Graph + Twitter fallback) — generated at build time.
export const alt = "KODA Studio — Strony internetowe, które konwertują.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0b0d",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            color: "#cf43b8",
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: 10,
          }}
        >
          KODA STUDIO
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "#ffffff", fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
            Strony internetowe,
          </div>
          <div style={{ display: "flex", color: "rgba(255,255,255,0.5)", fontSize: 88, fontWeight: 800, lineHeight: 1.05 }}>
            które konwertują.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,0.42)", fontSize: 28 }}>
          <div style={{ display: "flex" }}>kodastrony.pl</div>
          <div style={{ display: "flex" }}>Polska</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
