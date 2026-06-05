"use client";

import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, DURATION, cssBezier } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { CONTACT } from "@/lib/constants";

/* ════════════════════════════════════════════════════════════════════
   KONTAKT — minimal na BIAŁYM tle, wypełnione pola + PŁYWAJĄCE etykiety.
   Etykieta startuje jak placeholder w polu; po focusie/wpisaniu kurczy się
   i wjeżdża na górę pola (forms-inputs: translateY+scale, 200ms, ease 0.4,0,0.2,1).
   Proste: 4 pola (imię i nazwisko, e-mail, telefon, opis) + załącznik.
   ════════════════════════════════════════════════════════════════════ */

const FLOAT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)";
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPT_EXTS = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".zip"];
const ACCEPT_ATTR = ACCEPT_EXTS.join(",");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Types ───────────────────────────────────────────────────────── */
interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
}
type FieldKey = "name" | "email" | "phone" | "message";
type FormStatus = "idle" | "loading" | "success" | "error";

/* ── Walidacja (prosta) ──────────────────────────────────────────── */
const VALIDATORS: Record<FieldKey, (v: string) => string | null> = {
  name: (v) => (!v.trim() ? "Podaj imię i nazwisko." : v.trim().length < 3 ? "To trochę za krótkie." : null),
  email: (v) => (!v.trim() ? "Podaj adres e-mail." : !EMAIL_RE.test(v) ? "Sprawdź adres e-mail." : null),
  phone: (v) => (v.trim() && v.replace(/[^\d]/g, "").length < 9 ? "Sprawdź numer telefonu." : null),
  message: (v) => (!v.trim() ? "Napisz kilka słów o projekcie." : v.trim().length < 10 ? "Dodaj trochę więcej szczegółów." : null),
};

/* ════════════════════════════════════════════════════════════════════
   FloatingField — wypełnione pole z pływającą etykietą (input / textarea).
   ════════════════════════════════════════════════════════════════════ */
function FloatingField({
  id,
  name,
  label,
  field,
  focused,
  type = "text",
  inputMode,
  autoComplete,
  required,
  multiline,
  disabled,
  onChange,
  onFocus,
  onBlur,
}: {
  id: string;
  name: FieldKey;
  label: string;
  field: FieldState;
  focused: boolean;
  type?: string;
  inputMode?: "email" | "tel" | "text";
  autoComplete?: string;
  required?: boolean;
  multiline?: boolean;
  disabled?: boolean;
  onChange: (key: FieldKey, value: string) => void;
  onFocus: (key: FieldKey) => void;
  onBlur: (key: FieldKey) => void;
}) {
  const invalid = !!(field.touched && field.error);
  const floated = focused || field.value !== "";

  const fieldCls = cn(
    "w-full rounded-xl bg-[#f2f2f2] px-4 font-body text-[16px] text-[#0f0f0f] outline-none",
    "transition-[background-color,box-shadow] duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    multiline ? "min-h-[140px] resize-none pt-7 pb-3" : "h-[58px] pt-6 pb-1",
    invalid
      ? "bg-[#fbeef2] shadow-[0_0_0_1.5px_rgba(204,43,94,0.45)]"
      : "focus:bg-[#ececec] focus:shadow-[0_0_0_2px_rgba(207,67,184,0.4)]",
  );

  // Pozycja etykiety: spoczynek (jak placeholder) → pływa w górę + kurczy się.
  const labelStyle: React.CSSProperties = {
    position: "absolute",
    left: "16px",
    pointerEvents: "none",
    whiteSpace: "nowrap",
    transformOrigin: "left center",
    fontFamily: "var(--font-body)",
    fontSize: "15px",
    transition: `top 200ms ${FLOAT_EASE}, transform 200ms ${FLOAT_EASE}, color 150ms ease-out`,
    color: invalid ? "#cc2b5e" : focused ? "#0f0f0f" : "#5f5f5f",
    ...(floated
      ? { top: "9px", transform: "translateY(0) scale(0.74)" }
      : multiline
        ? { top: "26px", transform: "translateY(0) scale(1)" }
        : { top: "50%", transform: "translateY(-50%) scale(1)" }),
  };

  const shared = {
    id,
    name,
    disabled,
    required,
    "aria-required": required || undefined,
    "aria-invalid": invalid,
    "aria-describedby": invalid ? `${id}-error` : undefined,
    value: field.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(name, e.target.value),
    onFocus: () => onFocus(name),
    onBlur: () => onBlur(name),
    className: fieldCls,
  };

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {multiline ? (
          <textarea {...shared} rows={4} />
        ) : (
          <input {...shared} type={type} inputMode={inputMode} autoComplete={autoComplete} />
        )}
        <label htmlFor={id} style={labelStyle}>
          {label}
          {required && <span style={{ color: "#cf43b8" }}> *</span>}
        </label>
      </div>
      {invalid && (
        <motion.p
          id={`${id}-error`}
          initial={{ opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, ease: EASE.expo }}
          role="alert"
          className="pl-1 font-body text-[12.5px] leading-snug text-[#cc2b5e]"
        >
          {field.error}
        </motion.p>
      )}
    </div>
  );
}

/* ── Minimalne dołączanie pliku ──────────────────────────────────── */
function FileAttach({
  id,
  file,
  error,
  disabled,
  onPick,
  onClear,
}: {
  id: string;
  file: File | null;
  error: string | null;
  disabled: boolean;
  onPick: (f: File) => void;
  onClear: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="flex flex-col gap-2 pl-1">
      <input
        ref={inputRef}
        id={id}
        type="file"
        accept={ACCEPT_ATTR}
        className="sr-only"
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      {file ? (
        <div className="flex items-center gap-2.5 text-[14px]">
          <PaperclipIcon />
          <span className="truncate font-body text-[#0f0f0f]">{file.name}</span>
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            aria-label="Usuń załączony plik"
            className="ml-1 rounded-full p-1 text-black/45 transition-colors duration-200 hover:bg-black/5 hover:text-black/80"
          >
            <svg width="13" height="13" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M4 4L11 11M11 4L4 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="group flex w-fit items-center gap-2.5 font-body text-[14px] text-black/60 transition-colors duration-200 hover:text-[#0f0f0f] disabled:opacity-50"
        >
          <PaperclipIcon />
          Załącz brief
          <span className="text-black/55">(opcjonalne, do 10 MB)</span>
        </button>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="font-body text-[12.5px] text-[#cc2b5e]">
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Stan sukcesu ────────────────────────────────────────────────── */
function SuccessMessage({ firstName }: { firstName: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: DURATION.fade, ease: EASE.expo }}
      className="flex flex-col items-start gap-5"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: EASE.back, delay: 0.05 }}
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-pink"
      >
        <svg width="24" height="24" viewBox="0 0 22 22" fill="none" aria-hidden="true">
          <motion.path
            d="M4 11.5L9 16.5L18 7"
            stroke="#0f0f0f"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, ease: EASE.expo, delay: 0.25 }}
          />
        </svg>
      </motion.div>
      <h2 className="font-heading text-[clamp(1.8rem,3.4vw,2.6rem)] font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0f0f0f]">
        Dziękujemy{firstName ? `, ${firstName}` : ""}!
      </h2>
      <p className="max-w-[440px] font-body text-[16px] leading-relaxed text-black/60">
        Wiadomość wysłana. Odezwiemy się w ciągu 24 godzin z odpowiedzią i propozycją następnego kroku.
      </p>
    </motion.div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   GŁÓWNY KOMPONENT
   ════════════════════════════════════════════════════════════════════ */
export function Contact() {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  const [fields, setFields] = useState<Record<FieldKey, FieldState>>({
    name: { value: "", error: null, touched: false },
    email: { value: "", error: null, touched: false },
    phone: { value: "", error: null, touched: false },
    message: { value: "", error: null, touched: false },
  });
  const [focusedKey, setFocusedKey] = useState<FieldKey | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const isLoading = status === "loading";

  const update = (key: FieldKey, value: string) =>
    setFields((prev) => ({
      ...prev,
      [key]: { ...prev[key], value, error: prev[key].touched ? null : prev[key].error },
    }));

  const handleFocus = (key: FieldKey) => setFocusedKey(key);
  const handleBlur = (key: FieldKey) => {
    setFocusedKey(null);
    setFields((prev) => ({ ...prev, [key]: { ...prev[key], error: VALIDATORS[key](prev[key].value), touched: true } }));
  };

  const pickFile = (f: File) => {
    if (f.size > MAX_FILE_BYTES) return setFileError("Plik jest za duży (max 10 MB).");
    const ext = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
    if (!ACCEPT_EXTS.includes(ext)) return setFileError("Nieobsługiwany format pliku.");
    setFileError(null);
    setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = {} as Record<FieldKey, string | null>;
    (Object.keys(fields) as FieldKey[]).forEach((k) => (nextErrors[k] = VALIDATORS[k](fields[k].value)));
    setFields((prev) => {
      const next = { ...prev };
      (Object.keys(prev) as FieldKey[]).forEach((k) => (next[k] = { ...prev[k], error: nextErrors[k], touched: true }));
      return next;
    });

    const target = (Object.keys(fields) as FieldKey[]).find((k) => nextErrors[k]);
    if (target) return document.getElementById(id(target))?.focus();

    setStatus("loading");
    try {
      // TODO(backend): podłącz realny endpoint pozyskiwania leadów ({ ...pola, file }).
      await new Promise((res) => setTimeout(res, 1100));
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      data-header-theme="light"
      id="kontakt"
      aria-labelledby="contact-heading"
      className="relative min-h-svh overflow-hidden bg-white"
      style={{ paddingTop: "clamp(128px, 15vw, 200px)", paddingBottom: "clamp(72px, 9vw, 128px)" }}
    >
      {/* Subtelny różowy refleks w rogu — jedyny ozdobnik */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 50% 45% at 92% 6%, rgba(207,67,184,0.05) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[600px] px-6 sm:px-8">
        {status === "success" ? (
          <SuccessMessage firstName={fields.name.value.trim().split(" ")[0]} />
        ) : (
          <>
            {/* ── Nagłówek ── */}
            <FadeUp inView>
              <span className="flex items-center gap-2.5 font-heading text-[11px] font-bold uppercase tracking-[0.4em] text-black/55">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pink" />
                Kontakt
              </span>
            </FadeUp>
            <FadeUp inView delay={0.07}>
              <h1
                id="contact-heading"
                className="mt-5 font-heading font-extrabold text-[#0f0f0f]"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4.25rem)", lineHeight: 1.02, letterSpacing: "-0.035em" }}
              >
                Porozmawiajmy<span className="text-pink">.</span>
              </h1>
            </FadeUp>
            <FadeUp inView delay={0.13}>
              <p className="mt-5 max-w-[440px] font-body text-[16px] leading-relaxed text-black/60">
                Opowiedz nam o projekcie, a wrócimy z propozycją i wyceną w ciągu 24 godzin. Wolisz e-mail?{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-[#0f0f0f] underline decoration-pink/40 underline-offset-4 transition-colors duration-300 hover:decoration-pink"
                >
                  {CONTACT.email}
                </a>
              </p>
            </FadeUp>

            {/* ── Formularz ── */}
            <FadeUp inView delay={0.2}>
              <form onSubmit={handleSubmit} noValidate aria-label="Formularz kontaktowy" className="mt-11 flex flex-col gap-4">
                <FloatingField id={id("name")} name="name" label="Imię i nazwisko" field={fields.name} focused={focusedKey === "name"} autoComplete="name" required disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />
                <FloatingField id={id("email")} name="email" label="E-mail" field={fields.email} focused={focusedKey === "email"} type="email" inputMode="email" autoComplete="email" required disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />
                <FloatingField id={id("phone")} name="phone" label="Telefon" field={fields.phone} focused={focusedKey === "phone"} type="tel" inputMode="tel" autoComplete="tel" disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />
                <FloatingField id={id("message")} name="message" label="Opis projektu" field={fields.message} focused={focusedKey === "message"} multiline required disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />

                <FileAttach id={id("file")} file={file} error={fileError} disabled={isLoading} onPick={pickFile} onClear={() => { setFile(null); setFileError(null); }} />

                {/* ── CTA ── */}
                <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={cn(
                      "group inline-flex items-center justify-center gap-3 rounded-full px-8 py-4",
                      "font-heading text-[14px] font-bold uppercase tracking-[0.1em] text-[#0f0f0f]",
                      "bg-pink transition-transform duration-300",
                      isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:-translate-y-0.5",
                    )}
                    style={{ transitionTimingFunction: cssBezier(EASE.expo) }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner />
                        Wysyłanie...
                      </>
                    ) : (
                      <>
                        Wyślij wiadomość
                        <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" style={{ transitionTimingFunction: cssBezier(EASE.expo) }}>
                          →
                        </span>
                      </>
                    )}
                  </button>
                  <p className="font-body text-[12.5px] text-black/55">Odpowiemy w ciągu 24 godzin.</p>
                </div>

                {status === "error" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="font-body text-[13px] text-[#cc2b5e]">
                    Coś poszło nie tak. Spróbuj ponownie albo napisz na{" "}
                    <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>.
                  </motion.p>
                )}
              </form>
            </FadeUp>
          </>
        )}
      </div>
    </section>
  );
}

/* ── Ikony / spinner ─────────────────────────────────────────────── */
function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
      className="inline-block"
      style={{ width: 15, height: 15, border: "2px solid rgba(15,15,15,0.3)", borderTopColor: "#0f0f0f", borderRadius: "50%", flexShrink: 0 }}
    />
  );
}

function PaperclipIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="shrink-0 text-pink">
      <path
        d="M14.5 8.5l-5.2 5.2a3 3 0 0 1-4.24-4.24l5.2-5.2a2 2 0 0 1 2.83 2.83l-5.2 5.2a1 1 0 0 1-1.42-1.42l4.6-4.6"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
