import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/motion";
import { PillLink } from "@/components/ui/pill-link";

// Strona-podziękowanie — cel `_next` po wysłaniu formularza (FormSubmit).
// noindex: nie chcemy jej w wynikach wyszukiwania.
export const metadata: Metadata = {
  title: "Dziękujemy",
  description: "Wiadomość wysłana — odezwiemy się w ciągu 24 godzin.",
  robots: { index: false, follow: false },
};

export default function DziekujemyPage() {
  return (
    <section
      data-header-theme="dark"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-dark px-6 text-center"
    >
      {/* Dot grid + pink glow — jak hero */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.022) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 50% 45%, rgba(207,67,184,0.10) 0%, transparent 70%)",
        }}
      />

      <div className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
        <FadeUp scale={0.8} y={0}>
          <span
            aria-hidden="true"
            className="mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-pink"
          >
            <svg width="28" height="28" viewBox="0 0 22 22" fill="none" aria-hidden="true">
              <path
                d="M4 11.5L9 16.5L18 7"
                stroke="#0b0b0d"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </FadeUp>
        <FadeUp delay={0.08}>
          <h1
            style={{
              fontFamily: "var(--font-heading)",
              fontWeight: 700,
              fontSize: "clamp(2.5rem, 7vw, 4.5rem)",
              lineHeight: 1.03,
              letterSpacing: "-0.03em",
              color: "var(--color-ink)",
            }}
          >
            Dziękujemy<span style={{ color: "var(--color-accent)" }}>.</span>
          </h1>
        </FadeUp>
        <FadeUp delay={0.14}>
          <p
            className="text-[var(--color-ink-muted)]"
            style={{
              maxWidth: 460,
              lineHeight: 1.7,
              marginTop: "1.25rem",
              marginBottom: "2.5rem",
              fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
            }}
          >
            Wiadomość wysłana. Odezwiemy się w ciągu 24 godzin z odpowiedzią i propozycją następnego
            kroku.
          </p>
        </FadeUp>
        <FadeUp delay={0.2} className="flex flex-col items-center gap-4 sm:flex-row">
          <PillLink href="/">Wróć na stronę główną</PillLink>
          <Link
            href="/realizacje"
            className="font-heading text-[11px] font-bold tracking-[0.18em] text-[var(--color-ink-muted)] uppercase transition-colors duration-300 hover:text-pink"
          >
            Zobacz realizacje →
          </Link>
        </FadeUp>
      </div>
    </section>
  );
}
