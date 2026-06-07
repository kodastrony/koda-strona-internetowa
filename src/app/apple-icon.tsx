import { ImageResponse } from "next/og";

// Przy output: export ikona generowana statycznie raz przy buildzie.
export const dynamic = "force-static";

// Apple touch icon (home-screen) — generated as PNG at build time.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0b0b0d",
        color: "#cf43b8",
        fontSize: 120,
        fontWeight: 800,
        fontFamily: "sans-serif",
      }}
    >
      K
    </div>,
    { ...size }
  );
}
