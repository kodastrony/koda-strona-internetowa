import type { Metadata } from "next";
import Link from "next/link";
import { FadeUp } from "@/components/motion";
import { PillLink } from "@/components/ui/pill-link";
import { SuccessCheck } from "@/components/ui/success-check";
import { CONTACT } from "@/lib/constants";

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
      data-canvas="base"
      className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center"
    >
      {/* Dot grid + pink glow — jak hero (tło = PageCanvas) */}
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
            "radial-gradient(ellipse 50% 40% at 50% 45%, oklch(0.62 0.215 335 / 0.11) 0%, oklch(0.5 0.17 335 / 0.04) 45%, oklch(0.5 0.17 335 / 0) 72%)",
        }}
      />

      <div className="relative flex flex-col items-center" style={{ zIndex: 1 }}>
        <SuccessCheck />
        <FadeUp delay={0.5}>
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
        <FadeUp delay={0.6}>
          <p
            className="text-[var(--color-ink-muted)]"
            style={{
              maxWidth: 460,
              lineHeight: 1.7,
              marginTop: "1.25rem",
              marginBottom: "2rem",
              fontSize: "clamp(0.95rem, 1.1vw, 1.05rem)",
            }}
          >
            Twoja wiadomość do nas dotarła. Odezwiemy się w ciągu 24 godzin.
          </p>
        </FadeUp>

        {/* „Co dalej" — ustawia oczekiwania, zamiast zostawiać użytkownika w próżni */}
        <FadeUp delay={0.7}>
          <div className="mb-12 w-full max-w-[360px] text-left">
            <p className="mb-5 text-center font-heading text-[11px] font-bold tracking-[0.2em] text-[var(--color-ink-faint)] uppercase">
              Co dalej
            </p>
            <ol className="flex flex-col gap-4">
              {[
                "Przejrzymy Twój projekt.",
                "Wrócimy z kilkoma pytaniami.",
                "Przygotujemy wstępną wycenę.",
              ].map((t, i) => (
                <li
                  key={t}
                  className="flex items-start gap-3 text-[var(--color-ink-muted)]"
                  style={{ fontSize: "0.95rem", lineHeight: 1.5 }}
                >
                  <span aria-hidden="true" className="font-heading font-bold text-pink">
                    {i + 1}
                  </span>
                  <span>{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </FadeUp>

        <FadeUp delay={0.78}>
          <p
            className="mb-9 text-[var(--color-ink-faint)]"
            style={{ fontSize: "0.9rem", lineHeight: 1.6 }}
          >
            Pilne? Napisz wprost:{" "}
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-[var(--color-ink-muted)] underline decoration-pink/40 underline-offset-4 transition-colors duration-300 hover:text-pink hover:decoration-pink"
            >
              {CONTACT.email}
            </a>
          </p>
        </FadeUp>

        <FadeUp delay={0.86} className="flex flex-col items-center gap-4 sm:flex-row">
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
