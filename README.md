# KODA Studio — kodastrony.pl

Strona agencji KODA Studio. Statyczny eksport Next.js 16 hostowany na OVH.

## Stack

| Warstwa   | Technologia                                                        |
| --------- | ------------------------------------------------------------------ |
| Framework | Next.js 16 (App Router, static export)                             |
| Styling   | Tailwind CSS v4                                                    |
| Animacje  | Framer Motion (motion/react v12)                                   |
| Czcionki  | Geologica (nagłówki) + Inter (body) + Syne (logo), przez next/font |
| Hosting   | OVH shared hosting (Apache)                                        |
| Deploy    | GitHub Actions → FTP (deploy-ovh.yml)                              |

## Uruchamianie

```bash
cd koda-site
npm install
npm run dev        # dev server (localhost:3000)
npm run build      # pełny Next.js build (SSR, lokalne testy)
npm run lint       # ESLint
npm run type-check # TypeScript
npm run format     # Prettier
```

Aby zbudować statyczny eksport (tak jak CI):

```bash
STATIC_EXPORT=true npm run build
# → out/ (gotowy do uploadu na OVH)
```

## Struktura

```
src/
  app/              # Next.js App Router — strony i metadane
  components/
    layout/         # Header, Footer, MenuOverlay, ScrollProgress
    sections/       # Hero, Services, Work, WhyKoda, Statement, Contact
    motion/         # FadeUp, Reveal, MotionProvider, SmoothScroll, Magnetic
    ui/             # KodaLogo, PillLink, IntroAnimation, ComingSoon, CustomCursor, Marquee
  hooks/            # useHeaderTheme (provider), useLogoHidden
  lib/              # constants.ts, motion.ts, utils.ts, intro-state.ts
public/
  .htaccess         # Apache: HTTPS redirect, security headers, cache
  logos/            # SVG logo (różne warianty kolorystyczne)
```

## Zmienne środowiskowe

| Zmienna         | Wartość w CI | Opis                                       |
| --------------- | ------------ | ------------------------------------------ |
| `STATIC_EXPORT` | `"true"`     | Włącza `output: "export"` w next.config.ts |

Formularz leadów używa FormSubmit.co (natywny POST) — **bez kluczy ani zmiennych środowiskowych**.

## Deploy

Każdy push na `main` uruchamia `.github/workflows/deploy-ovh.yml`:

1. `npm ci` → `STATIC_EXPORT=true npm run build` → `out/`
2. `SamKirkland/FTP-Deploy-Action` uploaduje `out/` → OVH `www/`

Sekrety GitHub (ustawione w Settings → Secrets):

- `FTP_USERNAME` — login FTP do konta OVH
- `FTP_PASSWORD` — hasło FTP

## Kontakt / formularz

Formularz kontaktowy (`/kontakt`) ma walidację po stronie klienta i **wysyła leady
przez [FormSubmit.co](https://formsubmit.co)** — darmowo, bez konta i bez kluczy,
z obsługą **załącznika (brief) do 10 MB** (free tier Web3Forms plików nie wysyła).
Mechanizm: po walidacji formularz robi natywny `multipart/form-data` POST na
`https://formsubmit.co/kontakt@kodastrony.pl`, FormSubmit wysyła maila z załącznikiem
i przekierowuje na `/dziekujemy`. Honeypot (`_honey`) chroni przed spamem.

⚠️ **Aktywacja (jednorazowo)**: przy pierwszej wysyłce FormSubmit wyśle na
kontakt@kodastrony.pl mail „Activate Form" — kliknij raz, żeby potwierdzić adres.
Od tego momentu wszystkie zgłoszenia dochodzą. (Można też podmienić adres w
`action` formularza na zahaszowany alias z FormSubmit, by nie pokazywać e-maila.)
