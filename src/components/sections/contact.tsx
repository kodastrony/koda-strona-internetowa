"use client";

import { useState, useId } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, DURATION, cssBezier } from "@/lib/motion";
import { Reveal, FadeUp } from "@/components/motion";
import { CONTACT } from "@/lib/constants";

/* ── Types ───────────────────────────────────────────────────────── */
interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
}

type FormStatus = "idle" | "loading" | "success" | "error";

/* ── Validation ──────────────────────────────────────────────────── */
function validateName(v: string) {
  if (!v.trim()) return "Imię jest wymagane.";
  if (v.trim().length < 2) return "Imię musi mieć co najmniej 2 znaki.";
  return null;
}
function validateEmail(v: string) {
  if (!v.trim()) return "Adres e-mail jest wymagany.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Podaj poprawny adres e-mail.";
  return null;
}
function validateMessage(v: string) {
  if (!v.trim()) return "Wiadomość jest wymagana.";
  if (v.trim().length < 20) return "Opisz swój projekt w kilku słowach (min. 20 znaków).";
  return null;
}

/* ── Field component ─────────────────────────────────────────────── */
function Field({
  id,
  label,
  required,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2"
        style={{
          fontFamily:    "var(--font-heading)",
          fontSize:      "10px",
          fontWeight:    700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color:         "rgba(255,255,255,0.45)",
        }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: "#cf43b8" }}>*</span>
        )}
        {optional && (
          <span
            style={{
              fontSize:      "9px",
              letterSpacing: "0.12em",
              color:         "rgba(255,255,255,0.22)",
            }}
          >
            OPCJONALNIE
          </span>
        )}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE.expo }}
          role="alert"
          style={{
            fontFamily: "var(--font-body)",
            fontSize:   "12px",
            color:      "rgba(255, 100, 100, 0.85)",
            lineHeight: 1.4,
          }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

/* ── Shared input / textarea styles ──────────────────────────────── */
function inputStyle(hasError: boolean) {
  return {
    fontFamily:      "var(--font-body)",
    fontSize:        "15px",
    lineHeight:      "1.5",
    color:           "#eeeeee",
    backgroundColor: "#141414",
    border:          `1px solid ${hasError ? "rgba(255,100,100,0.5)" : "rgba(255,255,255,0.08)"}`,
    borderRadius:    "8px",
    padding:         "15px 18px",
    width:           "100%",
    outline:         "none",
    transition:      `border-color 250ms ${cssBezier(EASE.expo)}, box-shadow 250ms ${cssBezier(EASE.expo)}`,
  } as React.CSSProperties;
}

/* ── Contact info item ───────────────────────────────────────────── */
function ContactDetail({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        style={{
          fontFamily:    "var(--font-heading)",
          fontSize:      "9px",
          fontWeight:    700,
          letterSpacing: "0.22em",
          textTransform: "uppercase" as const,
          color:         "rgba(255,255,255,0.28)",
        }}
      >
        {label}
      </span>
      {href ? (
        <a
          href={href}
          className="text-off-white hover:text-pink transition-colors duration-300"
          style={{
            fontFamily:    "var(--font-body)",
            fontSize:      "14px",
            transitionTimingFunction: cssBezier(EASE.expo),
          }}
        >
          {value}
        </a>
      ) : (
        <span
          style={{
            fontFamily: "var(--font-body)",
            fontSize:   "14px",
            color:      "rgba(255,255,255,0.7)",
          }}
        >
          {value}
        </span>
      )}
    </div>
  );
}

/* ── Right decorative panel ──────────────────────────────────────── */
function DecorativePanel() {
  return (
    <FadeUp inView delay={0.15} className="hidden lg:flex flex-col justify-between h-full">
      <div
        className="relative flex flex-col justify-between rounded-2xl overflow-hidden h-full"
        style={{
          backgroundColor: "#0d0d0d",
          border:          "1px solid rgba(255,255,255,0.05)",
          padding:         "clamp(32px, 4vw, 52px)",
          minHeight:       "520px",
        }}
      >
        {/* Pink glow top-right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{
            top:       "-80px",
            right:     "-80px",
            width:     "260px",
            height:    "260px",
            background:
              "radial-gradient(circle, rgba(207,67,184,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Large decorative letter */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 pointer-events-none select-none overflow-hidden"
          style={{ width: "60%", height: "50%" }}
        >
          <span
            style={{
              fontFamily:    "var(--font-heading)",
              fontWeight:    800,
              fontSize:      "clamp(140px, 16vw, 220px)",
              color:         "rgba(255,255,255,0.025)",
              lineHeight:    1,
              letterSpacing: "-0.04em",
              position:      "absolute",
              bottom:        "-10px",
              right:         "-12px",
            }}
          >
            K
          </span>
        </div>

        {/* Top: heading tag */}
        <div>
          <span
            className="label-koda"
            style={{ fontSize: "10px" }}
          >
            K O N T A K T
          </span>
        </div>

        {/* Middle: big response promise */}
        <div className="flex flex-col gap-3" style={{ zIndex: 1 }}>
          <p
            style={{
              fontFamily:    "var(--font-heading)",
              fontWeight:    800,
              fontSize:      "clamp(1.6rem, 2.5vw, 2.2rem)",
              lineHeight:    1.1,
              letterSpacing: "-0.025em",
              color:         "#ffffff",
            }}
          >
            Odpiszemy
            <br />
            <span style={{ color: "#cf43b8" }}>w 24 godziny.</span>
          </p>
          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize:   "13px",
              lineHeight: 1.65,
              color:      "rgba(255,255,255,0.38)",
              maxWidth:   "220px",
            }}
          >
            Każdy projekt zaczyna się od rozmowy. Napisz do nas, a wrócimy z propozycją.
          </p>
        </div>

        {/* Bottom: contact details */}
        <div className="flex flex-col gap-5" style={{ zIndex: 1 }}>
          <div
            style={{
              width:           "100%",
              height:          "1px",
              backgroundColor: "rgba(255,255,255,0.06)",
            }}
          />
          <ContactDetail
            label="E-mail"
            value={CONTACT.email}
            href={`mailto:${CONTACT.email}`}
          />
          <ContactDetail
            label="Lokalizacja"
            value="Polska"
          />
        </div>
      </div>
    </FadeUp>
  );
}

/* ── Success state ───────────────────────────────────────────────── */
function SuccessMessage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fade, ease: EASE.expo }}
      className="flex flex-col gap-6 items-start"
      style={{ paddingTop: "clamp(40px, 5vh, 64px)" }}
    >
      {/* Pink circle check */}
      <div
        aria-hidden="true"
        className="flex items-center justify-center rounded-full"
        style={{
          width:           "56px",
          height:          "56px",
          backgroundColor: "rgba(207,67,184,0.12)",
          border:          "1px solid rgba(207,67,184,0.25)",
        }}
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 11.5L9 16.5L18 7"
            stroke="#cf43b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-3">
        <h3
          style={{
            fontFamily:    "var(--font-heading)",
            fontWeight:    800,
            fontSize:      "clamp(1.5rem, 3vw, 2rem)",
            letterSpacing: "-0.025em",
            lineHeight:    1.1,
            color:         "#ffffff",
          }}
        >
          Wiadomość wysłana.
        </h3>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize:   "15px",
            color:      "rgba(255,255,255,0.45)",
            lineHeight: 1.6,
            maxWidth:   "360px",
          }}
        >
          Dziękujemy za kontakt. Odezwiemy się w ciągu 24 godzin z odpowiedzią lub propozycją.
        </p>
      </div>

      <Link
        href="/"
        className="group inline-flex items-center gap-4 rounded-full px-7 py-3.5 text-white/50 hover:text-white transition-all duration-500"
        style={{
          backgroundColor:         "#1a1a1a",
          border:                  "1px solid rgba(255,255,255,0.07)",
          fontFamily:              "var(--font-heading)",
          fontSize:                "11px",
          fontWeight:              700,
          letterSpacing:           "0.18em",
          textTransform:           "uppercase",
          transitionTimingFunction: cssBezier(EASE.expo),
        }}
      >
        Wróć na stronę główną
        <span
          className="text-lg font-light leading-none transition-transform duration-500 group-hover:rotate-45"
          style={{ transitionTimingFunction: cssBezier(EASE.expo) }}
        >
          +
        </span>
      </Link>
    </motion.div>
  );
}

/* ══════════════════════════════════════════════════════════════════ */
export function Contact() {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const [fields, setFields] = useState<Record<string, FieldState>>({
    name:    { value: "", error: null, touched: false },
    email:   { value: "", error: null, touched: false },
    phone:   { value: "", error: null, touched: false },
    company: { value: "", error: null, touched: false },
    message: { value: "", error: null, touched: false },
  });
  const [status, setStatus] = useState<FormStatus>("idle");

  /* Focus styles — injected via JS to avoid global CSS pollution */
  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(207,67,184,0.45)";
    e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(207,67,184,0.08)";
  };
  const onBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
    fieldKey: string,
    validator?: (v: string) => string | null,
  ) => {
    e.currentTarget.style.borderColor = "";
    e.currentTarget.style.boxShadow   = "";
    if (!validator) return;
    const error = validator(fields[fieldKey].value);
    setFields((prev) => ({
      ...prev,
      [fieldKey]: { ...prev[fieldKey], error, touched: true },
    }));
  };

  const update = (key: string, value: string) => {
    setFields((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        value,
        /* Clear error as user corrects the field */
        error: prev[key].touched ? null : prev[key].error,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    /* Run all validators and mark fields touched */
    const nameErr    = validateName(fields.name.value);
    const emailErr   = validateEmail(fields.email.value);
    const messageErr = validateMessage(fields.message.value);

    setFields((prev) => ({
      ...prev,
      name:    { ...prev.name,    error: nameErr,    touched: true },
      email:   { ...prev.email,   error: emailErr,   touched: true },
      message: { ...prev.message, error: messageErr, touched: true },
    }));

    if (nameErr || emailErr || messageErr) {
      /* Focus first invalid field */
      if (nameErr)         document.getElementById(id("name"))?.focus();
      else if (emailErr)   document.getElementById(id("email"))?.focus();
      else if (messageErr) document.getElementById(id("message"))?.focus();
      return;
    }

    setStatus("loading");

    /* Simulated async submit — replace with real API call */
    await new Promise((res) => setTimeout(res, 1200));
    setStatus("success");
  };

  const isLoading = status === "loading";

  const staggerDelay = (i: number) => 0.05 + i * 0.07;

  return (
    <section
      data-header-theme="dark"
      id="kontakt"
      className="relative overflow-hidden bg-dark"
      aria-labelledby="contact-heading"
    >
      {/* ── Dot grid ───────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.018) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* ── Pink glow — top-left ────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 40% at 8% 15%, rgba(207,67,184,0.06) 0%, transparent 70%)",
        }}
      />

      {/* ── Top border line ─────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0"
        style={{ height: "1px", backgroundColor: "rgba(255,255,255,0.05)" }}
      />

      <div
        className="container-koda section-y relative z-10"
      >
        <div
          className="grid grid-cols-1 gap-16"
          style={{
            gridTemplateColumns: "1fr",
          }}
        >
          {/* On lg+: 2 columns */}
          <div
            className="grid grid-cols-1 lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_420px] gap-12 xl:gap-16 items-start"
          >
            {/* ═══ LEFT: form ═══════════════════════════════════ */}
            <div className="flex flex-col">
              {/* Section label */}
              <Reveal inView delay={0}>
                <div className="flex items-center gap-5 mb-10">
                  <span className="label-koda">P O R O Z M A W I A J M Y</span>
                  <div
                    style={{
                      height:     "1px",
                      width:      "clamp(30px, 10vw, 80px)",
                      background: "rgba(255,255,255,0.07)",
                    }}
                  />
                </div>
              </Reveal>

              {/* Heading */}
              <FadeUp inView delay={0.08}>
                <h2
                  id="contact-heading"
                  className="text-section-title"
                  style={{ maxWidth: "560px", marginBottom: "clamp(10px, 2vh, 16px)" }}
                >
                  Cześć. Opowiedz nam
                  <br />
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>
                    o swoim projekcie.
                  </span>
                </h2>
              </FadeUp>

              {/* Subtext */}
              <FadeUp inView delay={0.16}>
                <p
                  style={{
                    fontFamily:   "var(--font-body)",
                    fontSize:     "clamp(0.875rem, 1.1vw, 1rem)",
                    color:        "rgba(255,255,255,0.4)",
                    lineHeight:   1.65,
                    marginBottom: "clamp(36px, 5vh, 52px)",
                    maxWidth:     "420px",
                  }}
                >
                  Wypełnij formularz lub napisz bezpośrednio na{" "}
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="text-pink hover:text-pink-light transition-colors duration-300"
                    style={{ transitionTimingFunction: cssBezier(EASE.expo) }}
                  >
                    {CONTACT.email}
                  </a>
                  .
                </p>
              </FadeUp>

              {/* ── Form or success ─────────────────────────── */}
              {status === "success" ? (
                <SuccessMessage />
              ) : (
                <form
                  onSubmit={handleSubmit}
                  noValidate
                  aria-label="Formularz kontaktowy"
                >
                  <div className="flex flex-col gap-5">
                    {/* Row 1: Name + Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FadeUp inView delay={staggerDelay(0)}>
                        <Field
                          id={id("name")}
                          label="Imię i nazwisko"
                          required
                          error={fields.name.touched ? fields.name.error : null}
                        >
                          <input
                            id={id("name")}
                            type="text"
                            name="name"
                            autoComplete="name"
                            placeholder="Jan Kowalski"
                            required
                            aria-required="true"
                            aria-invalid={!!fields.name.error}
                            aria-describedby={
                              fields.name.error ? `${id("name")}-error` : undefined
                            }
                            value={fields.name.value}
                            onChange={(e) => update("name", e.target.value)}
                            onFocus={onFocus}
                            onBlur={(e) => onBlur(e, "name", validateName)}
                            style={inputStyle(
                              !!(fields.name.touched && fields.name.error),
                            )}
                            disabled={isLoading}
                          />
                        </Field>
                      </FadeUp>

                      <FadeUp inView delay={staggerDelay(1)}>
                        <Field
                          id={id("email")}
                          label="Adres e-mail"
                          required
                          error={fields.email.touched ? fields.email.error : null}
                        >
                          <input
                            id={id("email")}
                            type="email"
                            name="email"
                            autoComplete="email"
                            placeholder="jan@firma.pl"
                            required
                            aria-required="true"
                            aria-invalid={!!fields.email.error}
                            value={fields.email.value}
                            onChange={(e) => update("email", e.target.value)}
                            onFocus={onFocus}
                            onBlur={(e) => onBlur(e, "email", validateEmail)}
                            style={inputStyle(
                              !!(fields.email.touched && fields.email.error),
                            )}
                            disabled={isLoading}
                          />
                        </Field>
                      </FadeUp>
                    </div>

                    {/* Row 2: Phone + Company */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <FadeUp inView delay={staggerDelay(2)}>
                        <Field id={id("phone")} label="Telefon" optional>
                          <input
                            id={id("phone")}
                            type="tel"
                            name="phone"
                            autoComplete="tel"
                            placeholder="+48 000 000 000"
                            value={fields.phone.value}
                            onChange={(e) => update("phone", e.target.value)}
                            onFocus={onFocus}
                            onBlur={(e) => onBlur(e, "phone")}
                            style={inputStyle(false)}
                            disabled={isLoading}
                          />
                        </Field>
                      </FadeUp>

                      <FadeUp inView delay={staggerDelay(3)}>
                        <Field id={id("company")} label="Firma" optional>
                          <input
                            id={id("company")}
                            type="text"
                            name="company"
                            autoComplete="organization"
                            placeholder="Nazwa firmy"
                            value={fields.company.value}
                            onChange={(e) => update("company", e.target.value)}
                            onFocus={onFocus}
                            onBlur={(e) => onBlur(e, "company")}
                            style={inputStyle(false)}
                            disabled={isLoading}
                          />
                        </Field>
                      </FadeUp>
                    </div>

                    {/* Row 3: Message */}
                    <FadeUp inView delay={staggerDelay(4)}>
                      <Field
                        id={id("message")}
                        label="O czym chcesz porozmawiać?"
                        required
                        error={fields.message.touched ? fields.message.error : null}
                      >
                        <textarea
                          id={id("message")}
                          name="message"
                          rows={5}
                          placeholder="Opisz swój projekt — zakres, cel, budżet, termin..."
                          required
                          aria-required="true"
                          aria-invalid={!!fields.message.error}
                          value={fields.message.value}
                          onChange={(e) => update("message", e.target.value)}
                          onFocus={onFocus}
                          onBlur={(e) => onBlur(e, "message", validateMessage)}
                          style={{
                            ...inputStyle(
                              !!(fields.message.touched && fields.message.error),
                            ),
                            resize:    "vertical",
                            minHeight: "130px",
                          }}
                          disabled={isLoading}
                        />
                      </Field>
                    </FadeUp>

                    {/* Submit row */}
                    <FadeUp inView delay={staggerDelay(5)}>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-2">
                        {/* CTA button */}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className={cn(
                            "group inline-flex items-center gap-5 rounded-full px-8 py-4",
                            "transition-all duration-500",
                            isLoading
                              ? "cursor-not-allowed opacity-60"
                              : "cursor-pointer",
                          )}
                          style={{
                            fontFamily:              "var(--font-heading)",
                            fontSize:                "11px",
                            fontWeight:              700,
                            letterSpacing:           "0.18em",
                            textTransform:           "uppercase",
                            color:                   isLoading ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.6)",
                            backgroundColor:         "#1a1a1a",
                            border:                  "1px solid rgba(255,255,255,0.07)",
                            transitionTimingFunction: cssBezier(EASE.expo),
                          }}
                          onMouseEnter={(e) => {
                            if (!isLoading) {
                              (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
                              (e.currentTarget as HTMLButtonElement).style.borderColor =
                                "rgba(255,255,255,0.14)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color =
                              "rgba(255,255,255,0.6)";
                            (e.currentTarget as HTMLButtonElement).style.borderColor =
                              "rgba(255,255,255,0.07)";
                          }}
                        >
                          {isLoading ? (
                            <>
                              <Spinner />
                              Wysyłanie...
                            </>
                          ) : (
                            <>
                              Wyślij wiadomość
                              <span
                                className="text-xl font-light leading-none transition-transform duration-500 group-hover:rotate-45"
                                style={{ transitionTimingFunction: cssBezier(EASE.expo) }}
                              >
                                +
                              </span>
                            </>
                          )}
                        </button>

                        {/* Trust microcopy */}
                        <p
                          style={{
                            fontFamily: "var(--font-body)",
                            fontSize:   "11px",
                            color:      "rgba(255,255,255,0.22)",
                            lineHeight: 1.5,
                          }}
                        >
                          Odpiszemy w ciągu 24 godzin.
                          <br className="hidden sm:block" />
                          {" "}Nie wysyłamy spamu.
                        </p>
                      </div>
                    </FadeUp>

                    {/* Server error message */}
                    {status === "error" && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        role="alert"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize:   "13px",
                          color:      "rgba(255, 100, 100, 0.85)",
                        }}
                      >
                        Coś poszło nie tak. Spróbuj ponownie lub napisz bezpośrednio na{" "}
                        <a href={`mailto:${CONTACT.email}`} className="underline">
                          {CONTACT.email}
                        </a>
                        .
                      </motion.p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* ═══ RIGHT: decorative panel ══════════════════════ */}
            <DecorativePanel />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Inline spinner ──────────────────────────────────────────────── */
function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      className="inline-block"
      aria-hidden="true"
      style={{
        width:        "14px",
        height:       "14px",
        border:       "2px solid rgba(255,255,255,0.15)",
        borderTop:    "2px solid rgba(255,255,255,0.6)",
        borderRadius: "50%",
        flexShrink:   0,
      }}
    />
  );
}
