interface KodaLogoProps {
  width?: number;
  height?: number;
  /** Extra CSS classes — use to set color, e.g. "text-[#eeeeee]" */
  className?: string;
}

/**
 * KODA wordmark as inline SVG.
 *
 * "KODA" tspan uses fill="currentColor" so it inherits the CSS `color`
 * property of the nearest ancestor — transition color on the parent Link to
 * get smooth fill animation on hover / section-theme switches.
 *
 * The dot "." is always brand-pink (#cf43b8).
 */
export function KodaLogo({ width = 108, height = 28, className }: KodaLogoProps) {
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
        fontFamily="var(--font-heading), 'Syne', 'Helvetica Neue', Arial, sans-serif"
        fontWeight={800}
        fontSize={26}
        letterSpacing="-1.04"
        y="23"
      >
        {/* KODA inherits CSS `color` so transitions work on the parent */}
        <tspan fill="currentColor">KODA</tspan>
        {/* dot stays brand-pink always */}
        <tspan fill="#cf43b8">.</tspan>
      </text>
    </svg>
  );
}
