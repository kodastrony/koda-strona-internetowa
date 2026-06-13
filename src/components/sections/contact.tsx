"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { EASE, cssBezier } from "@/lib/motion";
import { FadeUp } from "@/components/motion";
import { CONTACT, SITE_CONFIG } from "@/lib/constants";

/* ════════════════════════════════════════════════════════════════════
   KONTAKT — minimal na BIAŁYM tle. Formularz po LEWEJ, po prawej wielka
   ledwo widoczna kolumna „KODA" (jak na stronie tytułowej / hero).
   Pola wypełnione + pływające etykiety (forms-inputs): imię, firma (opcj.),
   e-mail, telefon, opis + opcjonalne pliki (można dołączyć kilka).
   Animacje: płynna kaskada wejścia, mikro-interakcje (buttons-ctas).
   ════════════════════════════════════════════════════════════════════ */

const FLOAT_EASE = "cubic-bezier(0.4, 0, 0.2, 1)"; // krzywa floatu pływających etykiet (forms-inputs)
const EXPO = cssBezier(EASE.expo);
const MAX_FILES = 5; // ile plików maksymalnie
const MAX_TOTAL_BYTES = 10 * 1024 * 1024; // 10 MB ŁĄCZNIE (limit załączników FormSubmit)
const ACCEPT_EXTS = [".pdf", ".doc", ".docx", ".png", ".jpg", ".jpeg", ".webp", ".zip"];
const ACCEPT_ATTR = ACCEPT_EXTS.join(",");
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ── Backend leadów: FormSubmit.co — DARMOWY, obsługuje ZAŁĄCZNIKI ≤10 MB ──────
   (Web3Forms free nie wysyła plików; user chce dosyłać brief z formularza.)
   Wysyłka = GRACEFUL `fetch` multipart (z plikami) — endpoint FormSubmit zwraca CORS
   (Allow-Origin: *), więc cross-origin fetch działa, a my obsługujemy sukces/błąd
   PŁYNNIE na własnej stronie. Sukces → /dziekujemy/; awaria (np. 521) → komunikat +
   e-mail, dane zostają. Bez JS: natywny <form> POST (action/method/enctype = fallback).
   Wiele plików = wiele części o nazwie `attachment` (FormSubmit dołącza wszystkie).
   Honeypot = pole `_honey`. Zero kluczy/env. CSP `form-action` ma https://formsubmit.co,
   a `connect-src` https://formsubmit.co (fetch = connect-src).
   ⚠️ AKTYWACJA: pierwsza wysyłka wyśle na CONTACT.email mail „Activate Form" —
   kliknąć RAZ; od tego momentu wszystkie leady dochodzą. */
const FORMSUBMIT_ENDPOINT = `https://formsubmit.co/${CONTACT.email}`;

/* ── Types ───────────────────────────────────────────────────────── */
interface FieldState {
  value: string;
  error: string | null;
  touched: boolean;
}
type FieldKey = "name" | "company" | "email" | "phone" | "message";
type FormStatus = "idle" | "loading" | "error";

/* ── Walidacja (prosta) ──────────────────────────────────────────── */
const VALIDATORS: Record<FieldKey, (v: string) => string | null> = {
  name: (v) =>
    !v.trim() ? "Podaj imię i nazwisko." : v.trim().length < 3 ? "To trochę za krótkie." : null,
  // Firma jest opcjonalna — nigdy nie blokuje wysyłki.
  company: () => null,
  email: (v) =>
    !v.trim() ? "Podaj adres e-mail." : !EMAIL_RE.test(v) ? "Sprawdź adres e-mail." : null,
  phone: (v) => {
    const digits = v.replace(/\D/g, "");
    return !v.trim()
      ? "Podaj numer telefonu."
      : digits.length < 9
        ? "Sprawdź numer telefonu."
        : null;
  },
  message: (v) =>
    !v.trim()
      ? "Napisz kilka słów o projekcie."
      : v.trim().length < 10
        ? "Dodaj trochę więcej szczegółów."
        : null,
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
  hint,
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
  /** Krótka podpowiedź pod polem (np. po co prosimy o telefon) — znika, gdy jest błąd. */
  hint?: string;
  onChange: (key: FieldKey, value: string) => void;
  onFocus: (key: FieldKey) => void;
  onBlur: (key: FieldKey) => void;
}) {
  const reduce = useReducedMotion();
  const invalid = !!(field.touched && field.error);
  const floated = focused || field.value !== "";

  const fieldCls = cn(
    "w-full rounded-xl bg-[#f2f2f2] px-4 font-body text-[16px] text-[#0f0f0f] outline-none",
    "transition-[background-color,box-shadow] duration-200",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    multiline ? "min-h-[120px] resize-none pt-7 pb-3" : "h-[58px] pt-6 pb-1",
    invalid
      ? "bg-[#fbeef2] shadow-[0_0_0_1.5px_rgba(204,43,94,0.45)]"
      : "focus:bg-[#ececec] focus:shadow-[0_0_0_2px_rgba(207,67,184,0.4)]"
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
    "aria-describedby": invalid ? `${id}-error` : hint ? `${id}-hint` : undefined,
    value: field.value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange(name, e.target.value),
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
          {/* Gwiazdka dziedziczy kolor etykiety (AA na bieli); „wymagane" i tak
              niesie aria-required na inpucie, więc znak jest aria-hidden. */}
          {required && <span aria-hidden="true"> *</span>}
        </label>
      </div>
      {invalid && (
        <motion.p
          id={`${id}-error`}
          initial={reduce ? false : { opacity: 0, y: -3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduce ? { duration: 0 } : { duration: 0.2, ease: EASE.expo }}
          role="alert"
          className="pl-1 font-body text-[12.5px] leading-snug text-[#cc2b5e]"
        >
          {field.error}
        </motion.p>
      )}
      {!invalid && hint && (
        <p id={`${id}-hint`} className="pl-1 font-body text-[12px] leading-snug text-black/45">
          {hint}
        </p>
      )}
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   FileAttach — strefa załączania na KILKA plików (dashed + mikro-interakcje).
   buttons-ctas: hover lift, ikona jako akcja drugorzędna, ease 0.4,0,0.2,1.
   ════════════════════════════════════════════════════════════════════ */
function FileAttach({
  id,
  files,
  error,
  disabled,
  onAdd,
  onRemove,
}: {
  id: string;
  files: File[];
  error: string | null;
  disabled: boolean;
  onAdd: (list: FileList | File[]) => void;
  onRemove: (index: number) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const reduce = useReducedMotion();

  // Trzymaj prawdziwy <input type=file multiple name=attachment> ZSYNCHRONIZOWANY
  // ze stanem (DataTransfer) — żeby natywny multipart POST (fallback bez JS) też
  // niósł wszystkie pliki. Ścieżka JS i tak buduje FormData ze stanu (poniżej).
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    const dt = new DataTransfer();
    files.forEach((f) => dt.items.add(f));
    input.files = dt.files;
  }, [files]);

  const sizeLabel = (size: number) =>
    size < 1024 * 1024
      ? `${Math.round(size / 1024)} KB`
      : `${(size / (1024 * 1024)).toFixed(1)} MB`;

  const atMax = files.length >= MAX_FILES;

  return (
    <div className="flex flex-col gap-2.5">
      <input
        ref={inputRef}
        id={id}
        name="attachment"
        type="file"
        multiple
        accept={ACCEPT_ATTR}
        className="sr-only"
        aria-describedby={error ? `${id}-error` : undefined}
        disabled={disabled}
        onChange={(e) => {
          if (e.target.files?.length) onAdd(e.target.files);
          e.target.value = ""; // pozwala ponownie dodać wcześniej usunięty plik
        }}
      />

      {/* ── Lista dołączonych plików ── */}
      {files.length > 0 && (
        <ul className="flex flex-col gap-2" role="list">
          {files.map((f, i) => (
            <motion.li
              key={`${f.name}-${f.size}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { duration: 0.25, ease: EASE.expo }}
              className="flex items-center gap-3.5 rounded-xl border border-pink/30 bg-pink/[0.05] px-4 py-3"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink/15 text-pink">
                <FileIcon />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-body text-[14px] text-[#0f0f0f]">{f.name}</p>
                <p className="font-body text-[12px] text-black/55">{sizeLabel(f.size)}</p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(i)}
                disabled={disabled}
                aria-label={`Usuń plik ${f.name}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-black/45 transition-colors duration-200 hover:bg-black/5 hover:text-black/80"
              >
                <svg width="14" height="14" viewBox="0 0 15 15" fill="none" aria-hidden="true">
                  <path
                    d="M4 4L11 11M11 4L4 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {/* ── Dodaj plik(i) — dashed dropzone (znika po osiągnięciu limitu) ── */}
      {!atMax ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled) setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            if (!disabled && e.dataTransfer.files?.length) onAdd(e.dataTransfer.files);
          }}
          disabled={disabled}
          className={cn(
            "group flex w-full items-center gap-3.5 rounded-xl border border-dashed px-4 py-3.5 text-left",
            "transition-[border-color,background-color,transform] duration-200",
            "hover:-translate-y-px active:translate-y-0 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50",
            dragOver
              ? "border-pink/60 bg-pink/[0.05]"
              : "border-black/25 bg-transparent hover:border-pink/45 hover:bg-pink/[0.03]"
          )}
          style={{ transitionTimingFunction: FLOAT_EASE }}
        >
          <span
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform] duration-200",
              dragOver
                ? "bg-pink/15 text-pink"
                : "bg-[#f2f2f2] text-black/55 group-hover:-translate-y-0.5 group-hover:bg-pink/10 group-hover:text-pink"
            )}
            style={{ transitionTimingFunction: FLOAT_EASE }}
          >
            <UploadIcon />
          </span>
          <span className="flex flex-col">
            <span className="font-body text-[15px] text-[#0f0f0f]">
              {dragOver
                ? "Upuść pliki tutaj"
                : files.length > 0
                  ? "Dodaj kolejny plik"
                  : "Dołącz pliki"}
              <span className="text-black/55"> (opcjonalnie)</span>
            </span>
            <span className="font-body text-[12px] text-black/55">
              Zdjęcia, logo, stara strona, brief · PDF, DOC, JPG, ZIP · do 10 MB łącznie
            </span>
          </span>
        </button>
      ) : (
        <p className="pl-1 font-body text-[12px] leading-snug text-black/45">
          Dodano maksymalną liczbę plików ({MAX_FILES}).
        </p>
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
            // Giant „KODA" = wordmark w skali → font logo (Syne 800, realny bold),
            // spójnie z hero/intro (nie heading/Geologica, by mark był identyczny wszędzie).
            fontFamily: "var(--font-logo)",
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

/* ════════════════════════════════════════════════════════════════════
   GŁÓWNY KOMPONENT
   ════════════════════════════════════════════════════════════════════ */
export function Contact() {
  const uid = useId();
  const id = (n: string) => `${uid}-${n}`;

  const [fields, setFields] = useState<Record<FieldKey, FieldState>>({
    name: { value: "", error: null, touched: false },
    company: { value: "", error: null, touched: false },
    email: { value: "", error: null, touched: false },
    phone: { value: "", error: null, touched: false },
    message: { value: "", error: null, touched: false },
  });
  const [focusedKey, setFocusedKey] = useState<FieldKey | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  // Honeypot — pole-pułapka niewidoczne dla ludzi (`_honey`); jeśli bot je wypełni,
  // nie wysyłamy. FormSubmit sprawdza `_honey` też po stronie serwera.
  const [honeypot, setHoneypot] = useState("");
  const isLoading = status === "loading";

  // `_next` (strona po wysyłce) musi być URL-em absolutnym i z bieżącej domeny —
  // ustawiamy go po stronie klienta na origin, by działał i lokalnie, i na prod.
  const nextRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    // Trailing slash = kanoniczny URL statycznego eksportu (trailingSlash:true →
    // out/dziekujemy/index.html). Bez slasha FormSubmit przekieruje na /dziekujemy,
    // a Apache musiałby DOPIERO zrobić 301 na /dziekujemy/ (zależne od DirectorySlash)
    // — ze slashem trafiamy w plik wprost, zero ryzyka 404 po wysłaniu formularza.
    if (nextRef.current) nextRef.current.value = `${window.location.origin}/dziekujemy/`;
  }, []);

  // Ref do formularza — z niego budujemy FormData (pola + pliki) do graceful fetcha.
  // Atrybuty <form action/method/enctype> zostają = natywny POST jako fallback bez JS.
  const formRef = useRef<HTMLFormElement>(null);

  const update = (key: FieldKey, value: string) => {
    // Gdy poprzednia wysyłka się nie powiodła, pierwsza edycja czyści stan błędu
    // (przycisk wraca do „Wyślij wiadomość", znika czerwony komunikat).
    if (status === "error") setStatus("idle");
    setFields((prev) => ({
      ...prev,
      [key]: { ...prev[key], value, error: prev[key].touched ? null : prev[key].error },
    }));
  };

  const handleFocus = (key: FieldKey) => setFocusedKey(key);
  const handleBlur = (key: FieldKey) => {
    setFocusedKey(null);
    setFields((prev) => ({
      ...prev,
      [key]: { ...prev[key], error: VALIDATORS[key](prev[key].value), touched: true },
    }));
  };

  // Dodaje pliki do listy: waliduje format, łączny rozmiar i limit liczby; dedupe.
  const addFiles = (incoming: FileList | File[]) => {
    const next = [...files];
    let error: string | null = null;
    for (const f of Array.from(incoming)) {
      const ext = "." + (f.name.split(".").pop()?.toLowerCase() ?? "");
      if (!ACCEPT_EXTS.includes(ext)) {
        error = "Nieobsługiwany format pliku.";
        continue;
      }
      if (next.some((p) => p.name === f.name && p.size === f.size)) continue; // już dodany
      if (next.length >= MAX_FILES) {
        error = `Możesz dołączyć maksymalnie ${MAX_FILES} plików.`;
        break;
      }
      if (next.reduce((s, p) => s + p.size, 0) + f.size > MAX_TOTAL_BYTES) {
        error = "Pliki są za duże — łącznie do 10 MB.";
        continue;
      }
      next.push(f);
    }
    setFiles(next);
    setFileError(error);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setFileError(null);
  };

  // Wysyłka leadu: walidacja → GRACEFUL fetch (multipart, z plikami) do FormSubmit.
  // Dlaczego fetch, a nie natywna nawigacja: gdy FormSubmit ma awarię (np. błąd 521),
  // natywny POST wyrzuciłby użytkownika na OBCĄ stronę błędu i lead by przepadł. fetch
  // pozwala obsłużyć błąd PŁYNNIE na naszej stronie (komunikat + e-mail), a wpisane dane
  // zostają. Endpoint FormSubmit zwraca CORS (Allow-Origin: *), więc cross-origin fetch
  // z plikami działa. Sukces → /dziekujemy/. Bez JS: natywny <form> POST (fallback).
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLoading) return; // już wysyłamy — ignoruj powtórne kliknięcia (anty-podwójny submit)
    const nextErrors = {} as Record<FieldKey, string | null>;
    (Object.keys(fields) as FieldKey[]).forEach(
      (k) => (nextErrors[k] = VALIDATORS[k](fields[k].value))
    );
    setFields((prev) => {
      const next = { ...prev };
      (Object.keys(prev) as FieldKey[]).forEach(
        (k) => (next[k] = { ...prev[k], error: nextErrors[k], touched: true })
      );
      return next;
    });

    const target = (Object.keys(fields) as FieldKey[]).find((k) => nextErrors[k]);
    if (target) {
      document.getElementById(id(target))?.focus();
      return;
    }
    if (honeypot) return; // bot wypełnił pułapkę → nie wysyłaj

    const form = formRef.current;
    if (!form) return;
    setStatus("loading");
    try {
      // Buduj FormData ze stanu (pewne, niezależne od synchronizacji <input>):
      // pola tekstowe + ukryte z formularza, a załączniki ze stanu `files`.
      const fd = new FormData(form);
      fd.delete("attachment");
      files.forEach((f) => fd.append("attachment", f));
      const res = await fetch(FORMSUBMIT_ENDPOINT, {
        method: "POST",
        body: fd, // wszystkie pola + pliki (multipart)
        redirect: "manual", // 302 z FormSubmit traktujemy jako sukces (opaqueredirect)
      });
      // Sukces = serwer przyjął zgłoszenie (200 strona aktywacji / 302 redirect). Awaria
      // (np. 521) → CORS-reject (throw) albo status błędu → łapiemy w catch.
      if (!res.ok && res.type !== "opaqueredirect") {
        throw new Error(`FormSubmit ${res.status}`);
      }
      window.location.assign(`${window.location.origin}/dziekujemy/`);
    } catch {
      setStatus("error"); // płynny komunikat na stronie zamiast obcej strony błędu
    }
  };

  // Pomocnik kaskady wejścia — kolejne elementy formularza.
  let step = 0;
  const delay = () => 0.18 + step++ * 0.05;

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
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 88% 12%, rgba(207,67,184,0.05) 0%, transparent 70%)",
        }}
      />
      <KodaColumn />

      <div className="container-koda relative z-10 w-full">
        {/* data-logo-hide-anchor: czoło tej kolumny = eyebrow „Kontakt"/nagłówek.
            Logo widoczne na wejściu /kontakt, znika gdy nagłówek dojedzie do niego
            na scrollu (koniec zasłaniania pól, zob. zrzut „E-mail") i zostaje schowane. */}
        <div data-logo-hide-anchor className="mx-auto w-full max-w-[640px] lg:mx-0 lg:w-[56%]">
          {/* ── Nagłówek ── */}
          <FadeUp inView x={-14} y={0} duration={0.6}>
            {/* Eyebrow = ten sam token co na pozostałych stronach (.label-koda),
                ale ciemny kolor pod białe tło kontaktu (accent-róż na bieli był < AA). */}
            <span
              className="label-koda flex items-center gap-2.5"
              style={{ color: "rgba(15,15,15,0.6)" }}
            >
              <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-pink" />
              Kontakt
            </span>
          </FadeUp>
          <FadeUp inView delay={0.07}>
            <h1
              id="contact-heading"
              className="mt-5 font-heading font-extrabold text-[#0f0f0f]"
              style={{
                fontSize: "clamp(2.4rem, 7vw, 5rem)",
                lineHeight: 1.02,
                letterSpacing: "-0.035em",
                textWrap: "balance",
              }}
            >
              Zacznijmy projekt<span className="text-pink">.</span>
            </h1>
          </FadeUp>
          <FadeUp inView delay={0.13}>
            <p className="mt-5 max-w-[460px] font-body text-[16px] leading-relaxed text-black/60">
              Opowiedz nam o projekcie, a wrócimy z pomysłem i wyceną w ciągu 24 godzin. Wolisz
              e-mail?{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-[#0f0f0f] underline decoration-pink/40 underline-offset-4 transition-colors duration-300 hover:decoration-pink"
              >
                {CONTACT.email}
              </a>
            </p>
          </FadeUp>

          {/* ── Formularz (kaskada per-pole) ── */}
          <form
            ref={formRef}
            action={FORMSUBMIT_ENDPOINT}
            method="POST"
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            noValidate
            aria-label="Formularz kontaktowy"
            className="mt-7 flex flex-col gap-4"
          >
            {/* FormSubmit — ukryte pola sterujące */}
            <input type="hidden" name="_subject" defaultValue="Nowe zapytanie z kodastrony.pl" />
            <input type="hidden" name="_template" defaultValue="table" />
            <input type="hidden" name="_captcha" defaultValue="false" />
            <input
              ref={nextRef}
              type="hidden"
              name="_next"
              defaultValue={`${SITE_CONFIG.url}/dziekujemy/`}
            />
            {/* Honeypot (_honey) — poza widokiem i dostępnością; ludzie go nie wypełnią. */}
            <input
              type="text"
              name="_honey"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{
                position: "absolute",
                left: "-9999px",
                width: 1,
                height: 1,
                opacity: 0,
                pointerEvents: "none",
              }}
            />

            {/* Imię i nazwisko + Firma (opcjonalnie) */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FadeUp inView delay={delay()} y={18}>
                <FloatingField
                  id={id("name")}
                  name="name"
                  label="Imię i nazwisko"
                  field={fields.name}
                  focused={focusedKey === "name"}
                  autoComplete="name"
                  required
                  disabled={isLoading}
                  onChange={update}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </FadeUp>
              <FadeUp inView delay={delay()} y={18}>
                <FloatingField
                  id={id("company")}
                  name="company"
                  label="Firma (opcjonalnie)"
                  field={fields.company}
                  focused={focusedKey === "company"}
                  autoComplete="organization"
                  disabled={isLoading}
                  onChange={update}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </FadeUp>
            </div>

            {/* E-mail + Telefon (oba wymagane) */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FadeUp inView delay={delay()} y={18}>
                <FloatingField
                  id={id("email")}
                  name="email"
                  label="E-mail"
                  field={fields.email}
                  focused={focusedKey === "email"}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  onChange={update}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </FadeUp>
              <FadeUp inView delay={delay()} y={18}>
                <FloatingField
                  id={id("phone")}
                  name="phone"
                  label="Telefon"
                  field={fields.phone}
                  focused={focusedKey === "phone"}
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  required
                  hint="Czasem szybciej omówić projekt przez telefon."
                  disabled={isLoading}
                  onChange={update}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                />
              </FadeUp>
            </div>

            <FadeUp inView delay={delay()} y={18}>
              <FloatingField
                id={id("message")}
                name="message"
                label="Opis projektu"
                field={fields.message}
                focused={focusedKey === "message"}
                multiline
                required
                disabled={isLoading}
                onChange={update}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
            </FadeUp>
            <FadeUp inView delay={delay()} y={18}>
              <FileAttach
                id={id("file")}
                files={files}
                error={fileError}
                disabled={isLoading}
                onAdd={addFiles}
                onRemove={removeFile}
              />
            </FadeUp>

            {/* ── CTA ── */}
            <FadeUp inView delay={delay()} y={16} scale={0.96} ease={EASE.back}>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={cn(
                    "group inline-flex items-center justify-center gap-3 rounded-full px-8 py-4",
                    "font-heading text-[14px] font-bold tracking-[0.1em] text-[#0f0f0f] uppercase",
                    "bg-pink transition-[transform,box-shadow] duration-300",
                    isLoading
                      ? "cursor-not-allowed opacity-70"
                      : "cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_30px_-10px_rgba(207,67,184,0.6)] active:translate-y-0 active:scale-[0.98]"
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
                      {status === "error" ? "Spróbuj ponownie" : "Wyślij wiadomość"}
                      <span
                        aria-hidden="true"
                        className="transition-transform duration-300 group-hover:translate-x-1"
                        style={{ transitionTimingFunction: EXPO }}
                      >
                        →
                      </span>
                    </>
                  )}
                </button>
                <p className="font-body text-[12.5px] text-black/55">
                  Odpowiadamy w ciągu 24 godzin · Bez zobowiązań.
                </p>
              </div>
              {/* RODO — krótko, dokładnie w momencie decyzji */}
              <p className="mt-4 max-w-[460px] font-body text-[12px] leading-snug text-black/45">
                Twoje dane wykorzystamy tylko do przygotowania wyceny. Bez spamu. Więcej w{" "}
                <a
                  href="/polityka-prywatnosci/"
                  className="underline decoration-black/25 underline-offset-2 transition-colors hover:text-black/70 hover:decoration-pink"
                >
                  polityce prywatności
                </a>
                .
              </p>
              {status === "error" && (
                <p
                  role="alert"
                  className="mt-4 font-body text-[13.5px] leading-snug text-[#cc2b5e]"
                >
                  Nie udało się wysłać — serwer formularza jest chwilowo niedostępny. Spróbuj
                  ponownie za chwilę lub napisz bezpośrednio na{" "}
                  <a
                    href={`mailto:${CONTACT.email}`}
                    className="font-semibold underline underline-offset-2"
                  >
                    {CONTACT.email}
                  </a>
                  .
                </p>
              )}
            </FadeUp>
          </form>
        </div>
      </div>
    </section>
  );
}

/* ── Ikony / spinner ─────────────────────────────────────────────── */
function Spinner() {
  const reduce = useReducedMotion();
  const ringStyle: React.CSSProperties = {
    width: 15,
    height: 15,
    border: "2px solid rgba(15,15,15,0.3)",
    borderTopColor: "#0f0f0f",
    borderRadius: "50%",
    flexShrink: 0,
  };
  // Reduced motion → static ring (no perpetual rotation).
  if (reduce) return <span aria-hidden="true" className="inline-block" style={ringStyle} />;
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      aria-hidden="true"
      className="inline-block"
      style={ringStyle}
    />
  );
}

function UploadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M9 12V3M9 3L5.5 6.5M9 3L12.5 6.5M3 11v2.5A1.5 1.5 0 0 0 4.5 15h9a1.5 1.5 0 0 0 1.5-1.5V11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M10.5 2H5a1.5 1.5 0 0 0-1.5 1.5v11A1.5 1.5 0 0 0 5 16h8a1.5 1.5 0 0 0 1.5-1.5V6L10.5 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <path d="M10.5 2v4H14.5" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}
