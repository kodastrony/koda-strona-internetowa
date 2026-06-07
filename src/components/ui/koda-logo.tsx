interface KodaLogoProps {
  width?: number;
  height?: number;
  /** Extra CSS classes — use to set color, e.g. "text-[#eeeeee]" */
  className?: string;
  /**
   * Colour of the trailing dot ".". Defaults to brand-pink (#cf43b8). Pass a
   * different colour (e.g. white) over a pink background, where a pink dot would
   * be invisible. A CSS transition on the <tspan> keeps the switch smooth.
   */
  dotColor?: string;
}

/**
 * KODA wordmark as inline SVG.
 *
 * "KODA" tspan uses fill="currentColor" so it inherits the CSS `color`
 * property of the nearest ancestor — transition color on the parent Link to
 * get smooth fill animation on hover / section-theme switches.
 *
 * The dot "." is brand-pink by default, but `dotColor` lets the header turn it
 * white over the pink statement block so it never disappears.
 */
export function KodaLogo({ width = 108, height = 28, className, dotColor = "#cf43b8" }: KodaLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2 -1 134 32"
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <text
        fontFamily="var(--font-logo), 'Syne', 'Helvetica Neue', Arial, sans-serif"
        fontWeight={800}
        fontSize={26}
        letterSpacing="-1.04"
        y="23"
      >
        {/* KODA inherits CSS `color` so transitions work on the parent */}
        <tspan fill="currentColor">KODA</tspan>
        {/* dot colour is themable (pink by default, white over pink sections) */}
        <tspan fill={dotColor} style={{ transition: "fill 500ms cubic-bezier(0.19,1,0.22,1)" }}>.</tspan>
      </text>
    </svg>
  );
}
