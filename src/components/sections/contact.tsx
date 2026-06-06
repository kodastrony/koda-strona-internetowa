"use client";

import { useId, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, DURATION, cssBezier } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { CONTACT } from "@/lib/constants";

/* ════════════════════════════════════════════════════════════════════
   KONTAKT — minimal na BIAŁYM tle. Formularz po LEWEJ, po prawej wielka
   ledwo widoczna kolumna „KODA" (jak na stronie tytułowej / hero).
   Pola wypełnione + pływające etykiety (forms-inputs). Telefon WYMAGANY.
   Animacje: płynna kaskada wejścia, mikro-interakcje (buttons-ctas).
   ════════════════════════════════════════════════════════════════════ */

const FLOAT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)"; // krzywa floatu pływających etykiet (forms-inputs)
const EXPO = cssBezier(EASE.expo);
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

/* ── Walidacja (prosta) — wszystkie 4 pola wymagane ──────────────── */
const VALIDATORS: Record<FieldKey, (v: string) => string | null> = {
  name: (v) => (!v.trim() ? "Podaj imię i nazwisko." : v.trim().length < 3 ? "To trochę za krótkie." : null),
  email: (v) => (!v.trim() ? "Podaj adres e-mail." : !EMAIL_RE.test(v) ? "Sprawdź adres e-mail." : null),
  phone: (v) => (!v.trim() ? "Podaj numer telefonu." : v.replace(/[^\d]/g, "").length < 9 ? "Sprawdź numer telefonu." : null),
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
    multiline ? "min-h-[112px] resize-none pt-7 pb-3" : "h-[58px] pt-6 pb-1",
    invalid
      ? "bg-[#fbeef2] shadow-[0_0_0_1.5px_rgba(204,43,94,0.45)]"
      : "focus:bg-[#ececec] focus:shadow-[0_0_0_2px_rgba(207,67,184,0.4)]",
  );

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
          <textarea {...shared} rows={3} />
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

/* ════════════════════════════════════════════════════════════════════
   Brief — przeprojektowana strefa załączania (dashed + mikro-interakcje).
   buttons-ctas: hover lift, ikona jako akcja drugorzędna, ease 0.4,0,0.2,1.
   ════════════════════════════════════════════════════════════════════ */
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
  const [dragOver, setDragOver] = useState(false);

  const sizeLabel = file ? (file.size < 1024 * 1024 ? `${Math.round(file.size / 1024)} KB` : `${(file.size / (1024 * 1024)).toFixed(1)} MB`) : "";

  return (
    <div className="flex flex-col gap-2">
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
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: EASE.expo }}
          className="flex items-center gap-3.5 rounded-xl border border-pink/30 bg-pink/[0.05] px-4 py-3.5"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pink/15 text-pink">
            <FileIcon />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-body text-[14.5px] text-[#0f0f0f]">{file.name}</p>
            <p className="font-body text-[12px] text-black/55">{sizeLabel} · gotowe do wysłania</p>
          </div>
          <button
            type="button"
            onClick={onClear}
            disabled={disabled}
            aria-label="Usuń załączony plik"
            className="shrink-0 rounded-full p-2 text-black/45 transition-colors duration-200 hover:bg-black/5 hover:text-black/80"
          >
            <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
              <path d="M4 4L11 11M11 4L4 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </motion.div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files?.[0]; if (f && !disabled) onPick(f); }}
          disabled={disabled}
          className={cn(
            "group flex w-full items-center gap-3.5 rounded-xl border border-dashed px-4 py-3.5 text-left",
            "transition-[border-color,background-color,transform] duration-200",
            "hover:-translate-y-px active:translate-y-0 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed",
            dragOver ? "border-pink/60 bg-pink/[0.05]" : "border-black/25 bg-transparent hover:border-pink/45 hover:bg-pink/[0.03]",
          )}
          style={{ transitionTimingFunction: FLOAT_EASE }}
        >
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200",
              dragOver ? "bg-pink/15 text-pink" : "bg-[#f2f2f2] text-black/55 group-hover:bg-pink/10 group-hover:text-pink group-hover:-translate-y-0.5",
            )}
            style={{ transitionTimingFunction: FLOAT_EASE }}
          >
            <UploadIcon />
          </span>
          <span className="flex flex-col">
            <span className="font-body text-[15px] text-[#0f0f0f]">
              {dragOver ? "Upuść plik tutaj" : "Załącz brief"}
              <span className="text-black/55"> (opcjonalne)</span>
            </span>
            <span className="font-body text-[12px] text-black/55">Przeciągnij lub kliknij · PDF, DOC, JPG, ZIP · do 10 MB</span>
          </span>
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

/* ── Wielka, ledwo widoczna kolumna „KODA" — po prawej (jak hero) ─── */
function KodaColumn() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 hidden -translate-y-1/2 select-none lg:block"
      style={{ right: "17%" }}
    >
      {(["K", "O", "D", "A"] as const).map((letter, i) => (
        <motion.div
          key={letter}
          data-reveal
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: EASE.expo, delay: 0.35 + i * 0.08 }}
          style={{
            fontFamily: "var(--font-heading)",
            fontWeight: 800,
            fontSize: "clamp(150px, 20vw, 320px)",
            letterSpacing: "-0.04em",
            color: "rgba(15,15,15,0.05)",
            lineHeight: 0.9,
          }}
        >
          {letter}
        </motion.div>
      ))}
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

  // Pomocnik kaskady wejścia — kolejne elementy formularza.
  let step = 0;
  const delay = () => 0.18 + step++ * 0.06;

  return (
    <section
      data-header-theme="light"
      id="kontakt"
      aria-labelledby="contact-heading"
      className="relative min-h-svh overflow-hidden bg-white"
      style={{ paddingTop: "clamp(94px, 10vw, 134px)", paddingBottom: "clamp(56px, 7vw, 96px)" }}
    >
      {/* Subtelny różowy refleks + kolumna KODA po prawej */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: "radial-gradient(ellipse 45% 40% at 88% 12%, rgba(207,67,184,0.05) 0%, transparent 70%)" }}
      />
      <KodaColumn />

      <div className="container-koda relative z-10 w-full">
        <div className="mx-auto w-full max-w-[620px] lg:mx-0 lg:w-[54%]">
          {status === "success" ? (
            <SuccessMessage firstName={fields.name.value.trim().split(" ")[0]} />
          ) : (
            <>
              {/* ── Nagłówek ── */}
              <FadeUp inView x={-14} y={0} duration={0.6}>
                <span className="flex items-center gap-2.5 font-heading text-[11px] font-bold uppercase tracking-[0.4em] text-black/55">
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pink" />
                  Kontakt
                </span>
              </FadeUp>
              <FadeUp inView delay={0.07}>
                <h1
                  id="contact-heading"
                  className="mt-5 font-heading font-extrabold text-[#0f0f0f]"
                  style={{ fontSize: "clamp(1.95rem, 7vw, 4.25rem)", lineHeight: 1.04, letterSpacing: "-0.035em", textWrap: "balance" }}
                >
                  Zacznijmy projekt<span className="text-pink">.</span>
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

              {/* ── Formularz (kaskada per-pole) ── */}
              <form onSubmit={handleSubmit} noValidate aria-label="Formularz kontaktowy" className="mt-7 flex flex-col gap-4">
                <FadeUp inView delay={delay()} y={18}>
                  <FloatingField id={id("name")} name="name" label="Imię i nazwisko" field={fields.name} focused={focusedKey === "name"} autoComplete="name" required disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />
                </FadeUp>
                <FadeUp inView delay={delay()} y={18}>
                  <FloatingField id={id("email")} name="email" label="E-mail" field={fields.email} focused={focusedKey === "email"} type="email" inputMode="email" autoComplete="email" required disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />
                </FadeUp>
                <FadeUp inView delay={delay()} y={18}>
                  <FloatingField id={id("phone")} name="phone" label="Telefon" field={fields.phone} focused={focusedKey === "phone"} type="tel" inputMode="tel" autoComplete="tel" required disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />
                </FadeUp>
                <FadeUp inView delay={delay()} y={18}>
                  <FloatingField id={id("message")} name="message" label="Opis projektu" field={fields.message} focused={focusedKey === "message"} multiline required disabled={isLoading} onChange={update} onFocus={handleFocus} onBlur={handleBlur} />
                </FadeUp>
                <FadeUp inView delay={delay()} y={18}>
                  <FileAttach id={id("file")} file={file} error={fileError} disabled={isLoading} onPick={pickFile} onClear={() => { setFile(null); setFileError(null); }} />
                </FadeUp>

                {/* ── CTA ── */}
                <FadeUp inView delay={delay()} y={16} scale={0.96} ease={EASE.back}>
                  <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={cn(
                        "group inline-flex items-center justify-center gap-3 rounded-full px-8 py-4",
                        "font-heading text-[14px] font-bold uppercase tracking-[0.1em] text-[#0f0f0f]",
                        "bg-pink transition-[transform,box-shadow] duration-300",
                        isLoading ? "cursor-not-allowed opacity-70" : "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(207,67,184,0.6)] active:scale-[0.98] active:translate-y-0",
                      )}
                      style={{ transitionTimingFunction: EXPO }}
                    >
                      {isLoading ? (
                        <>
                          <Spinner />
                          Wysyłanie...
                        </>
                      ) : (
                        <>
                          Wyślij wiadomość
                          <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1" style={{ transitionTimingFunction: EXPO }}>
                            →
                          </span>
                        </>
                      )}
                    </button>
                    <p className="font-body text-[12.5px] text-black/55">Odpowiemy w ciągu 24 godzin.</p>
                  </div>
                </FadeUp>

                {status === "error" && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="font-body text-[13px] text-[#cc2b5e]">
                    Coś poszło nie tak. Spróbuj ponownie albo napisz na{" "}
                    <a href={`mailto:${CONTACT.email}`} className="underline">{CONTACT.email}</a>.
                  </motion.p>
                )}
              </form>
            </>
          )}
        </div>
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

function UploadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M9 12V3M9 3L5.5 6.5M9 3L12.5 6.5M3 11v2.5A1.5 1.5 0 0 0 4.5 15h9a1.5 1.5 0 0 0 1.5-1.5V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M10.5 2H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 16h8a1.5 1.5 0 0 0 1.5-1.5V6L10.5 2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M10.5 2v4H14.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
