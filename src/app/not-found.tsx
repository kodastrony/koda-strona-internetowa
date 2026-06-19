import type { Metadata } from "next";
import { PillLink } from "@/components/ui/pill-link";

// Własny tytuł + JAWNY noindex (override, nie append) — bez tego layout dokleja
// drugą metę robots „index, follow" (konflikt; noindex i tak wygrywał, ale to bug).
export const metadata: Metadata = {
  title: "Strona nie znaleziona (404)",
  robots: { index: false, follow: false },
};

// Custom 404 — renders inside the root layout (header/footer present).
export default function NotFound() {
  return (
    <section
      data-header-theme="dark"
      data-canvas="base"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Dot grid + pink glow — matches the hero's atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, var(--dot-grid) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(207,67,184,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
        <span className="label-koda mb-6">404 — Nie znaleziono</span>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 600,
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            lineHeight: 1.03,
            letterSpacing: "-0.03em",
            color: "var(--color-ink)",
            marginBottom: "1.25rem",
          }}
        >
          Ups. Tej strony
          <br />
          <span style={{ color: "var(--color-ink-faint)" }}>tu nie ma.</span>
        </h1>
        <p
          className="text-[var(--color-ink-muted)]"
          style={{
            maxWidth: 420,
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
          }}
        >
          Strona, której szukasz, mogła zostać przeniesiona lub nigdy nie istniała. Wróćmy na
          właściwy tor.
        </p>
        <PillLink href="/">Wróć na stronę główną</PillLink>
      </div>
    </section>
  );
}
