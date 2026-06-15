/* eslint-disable @next/next/no-img-element -- Static export (images.unoptimized): hand-optimized
   webp with explicit width/height; next/image adds no value in this build. */
/* ── Device frames — CSS/SVG chrome around clean screenshots ────────────────
   Crisp at any DPR, theme-adaptive (read --color-* tokens), and swappable
   without re-compositing a PNG. Used inside case-study pages to present the
   real screenshots as a real website (browser) and on a phone. Every <img>
   carries explicit width/height so the box is reserved before bytes arrive
   (no CLS). Images are decorative-with-context: meaningful alt is required. */

export function BrowserFrame({
  src,
  alt,
  url,
  width = 1680,
  height = 1050,
  className,
}: {
  src: string;
  alt: string;
  /** Shown in the address bar (e.g. "rikoszet-bar"). */
  url: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-[16px] ${className ?? ""}`}
      style={{
        border: "1px solid var(--color-line-strong)",
        background: "var(--color-surface-1)",
        boxShadow: "0 40px 90px -42px rgba(0,0,0,0.65)",
      }}
    >
      {/* Chrome bar */}
      <div
        className="flex items-center gap-2 px-4"
        style={{
          height: 40,
          borderBottom: "1px solid var(--color-line)",
          background: "var(--color-surface-2)",
        }}
      >
        <div className="flex items-center gap-1.5">
          {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
            <span
              key={c}
              style={{ width: 11, height: 11, borderRadius: "50%", background: c, opacity: 0.9 }}
            />
          ))}
        </div>
        <div
          className="ml-3 flex h-[22px] flex-1 items-center gap-2 rounded-full px-3"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            maxWidth: 320,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M12 2a7 7 0 0 0-7 7v2H4v9h16v-9h-1V9a7 7 0 0 0-7-7Zm0 2a5 5 0 0 1 5 5v2H7V9a5 5 0 0 1 5-5Z"
              fill="var(--color-ink-faint)"
            />
          </svg>
          <span
            className="truncate font-body text-[11px]"
            style={{ color: "var(--color-ink-faint)", letterSpacing: "0.01em" }}
          >
            kodastrony.github.io/{url}
          </span>
        </div>
      </div>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
      />
    </div>
  );
}

export function PhoneFrame({
  src,
  alt,
  width = 600,
  height = 1298,
  className,
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative ${className ?? ""}`}
      style={{
        borderRadius: 38,
        padding: 8,
        background: "linear-gradient(160deg,#26262c,#121216)",
        border: "1px solid var(--color-line-strong)",
        boxShadow: "0 40px 80px -40px rgba(0,0,0,0.7)",
      }}
    >
      {/* notch */}
      <div
        aria-hidden="true"
        className="absolute top-[14px] left-1/2 z-10 -translate-x-1/2 rounded-full"
        style={{ width: 92, height: 18, background: "#0a0a0c" }}
      />
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="block h-auto w-full"
        style={{ borderRadius: 30 }}
      />
    </div>
  );
}
