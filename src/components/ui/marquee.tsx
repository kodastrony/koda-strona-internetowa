/* ── Marquee ──────────────────────────────────────────────────────────────
   Infinite-scroll keyword strip — constant linear motion (Emil: linear for
   marquees) driven by a CSS keyframe (off the main thread, so it stays smooth
   under load). Two identical sequences + translateX(-50%) = seamless loop.
   Reduced-motion freezes it (global CSS clamps animation-duration) → static
   keywords, which is fine. */

const ITEMS = [
  "Strony internetowe",
  "Sklepy online",
  "UX/UI Design",
  "Optymalizacja SEO",
  "Identyfikacja wizualna",
  "Wsparcie i rozwój",
];

function Seq() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {ITEMS.map((it, i) => (
        <span key={i} className="flex items-center">
          <span
            className="font-heading font-semibold whitespace-nowrap text-[var(--color-ink)]"
            style={{
              fontSize: "clamp(1.1rem,2.3vw,1.95rem)",
              letterSpacing: "-0.02em",
              padding: "0 clamp(22px,3vw,44px)",
            }}
          >
            {it}
          </span>
          <span
            className="text-[var(--color-pink-bright)]"
            style={{ fontSize: "clamp(0.6rem,1vw,0.85rem)" }}
          >
            ✦
          </span>
        </span>
      ))}
    </div>
  );
}

export function Marquee() {
  return (
    <div
      className="relative overflow-hidden border-y"
      aria-hidden="true"
      style={{
        borderColor: "var(--color-line)",
        backgroundColor: "var(--color-bg)",
        paddingTop: "clamp(18px,2.2vw,30px)",
        paddingBottom: "clamp(18px,2.2vw,30px)",
      }}
    >
      <div
        className="flex w-max"
        style={{ animation: "marquee 34s linear infinite", willChange: "transform" }}
      >
        <Seq />
        <Seq />
      </div>
      {/* edge fades so words dissolve at the margins */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-20 md:w-32"
        style={{ background: "linear-gradient(to right, var(--color-bg), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-20 md:w-32"
        style={{ background: "linear-gradient(to left, var(--color-bg), transparent)" }}
      />
    </div>
  );
}
