import Link from "next/link";
import { PillLink } from "@/components/ui/pill-link";

interface ComingSoonProps {
  /** Page title — e.g. "Realizacje" */
  title: string;
  /** Label shown above the heading (eyebrow). */
  label: string;
}

/** Full-screen placeholder for pages that aren't built yet. Matches the hero's dark atmosphere. */
export function ComingSoon({ title, label }: ComingSoonProps) {
  return (
    <section
      data-header-theme="dark"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-dark px-6 text-center"
    >
      {/* Dot grid — matches hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      {/* Pink glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(207,67,184,0.07) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
        <span className="label-koda mb-6">{label}</span>
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
          {title}
          <span style={{ color: "var(--color-accent)" }}>.</span>
        </h1>
        <p
          className="text-[var(--color-ink-muted)]"
          style={{
            maxWidth: 400,
            lineHeight: 1.7,
            marginBottom: "2.5rem",
            fontSize: "clamp(0.9rem, 1.1vw, 1rem)",
          }}
        >
          Ta sekcja jest w trakcie przygotowywania. Wróć wkrótce.
        </p>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <PillLink href="/">Wróć na stronę główną</PillLink>
          <Link
            href="/kontakt"
            className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--color-ink-muted)] transition-colors duration-300 hover:text-pink"
          >
            Skontaktuj się →
          </Link>
        </div>
      </div>
    </section>
  );
}
