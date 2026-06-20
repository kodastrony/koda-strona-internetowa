"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";
import { SITE_CONFIG } from "@/lib/constants";
import { useHeaderTheme } from "@/hooks/use-header-theme";
import { useLogoHidden } from "@/hooks/use-logo-hide";
import { KodaLogo } from "@/components/ui/koda-logo";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { EASE, INTRO_DURATION, cssBezier } from "@/lib/motion";
import { introHasPlayed } from "@/lib/intro-state";
import { MenuOverlay, type Origin } from "@/components/layout/menu-overlay";

const CLR_EASE = cssBezier(EASE.expo);
const CLR_DUR = "500ms";

// Siła magnesu: przycisk DOJEŻDŻA do kursora o 50% odległości od środka (to
// przycisk nachodzi na kursor — nie odwrotnie; ring kursora tylko ramkuje ikonę).
const MAGNET_STRENGTH = 0.5;
const MAGNET_SPRING = { stiffness: 180, damping: 14, mass: 0.4 } as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [origin, setOrigin] = useState<Origin | null>(null);
  const theme = useHeaderTheme();

  // Wejście headera jest zsync z intro TYLKO gdy intro faktycznie gra: strona
  // główna („/"), pierwsze twarde wejście, bez reduced-motion. Na podstronach
  // (brak intro), powrocie SPA (flaga introHasPlayed) i reduced-motion header
  // wjeżdża od razu — bez ~1.9 s pustego paska. Spójne z Hero (ta sama flaga).
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const base = reduce || !isHome || introHasPlayed() ? 0 : INTRO_DURATION;

  // ── Zamknij menu przy KAŻDEJ zmianie trasy (defensywnie) ──────────────────
  // Pozycje menu mają już onClick={onClose}, ale to gwarantuje, że overlay NIGDY
  // nie zostaje otwarty po nawigacji — także przez back/forward, klik w pozycję
  // będącą bieżącą trasą, czy nawigację programową. (Hash typu „/#faq" nie zmienia
  // pathname → tam zamyka onClick={onClose}; oba mechanizmy razem pokrywają wszystko.)
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Na białym menu (open) elementy headera są ciemne — niezależnie od sekcji.
  const light = open || theme === "light";
  // Nad różową sekcją (statement): elementy zostają białe jak na „dark", ALE
  // różowe akcenty (kropka logo, pill KONTAKT) muszą zmienić kolor, bo róż-na-różu
  // znika. Gdy menu otwarte, tło jest białe → traktuj jak zwykłe „light".
  const onPink = theme === "pink" && !open;

  // ── Ukrywanie logo (widoczne na górze → znika gdy dojdziesz do nagłówka) ──
  // Logo KODA jest fixed w lewym-górnym rogu. Jest widoczne na SAMEJ górze strony,
  // a gdy zjedziesz na tyle, że zaczęłoby zasłaniać główny nagłówek strony, płynnie
  // znika — i ZOSTAJE schowane do końca zjazdu (nie wraca nad treścią niżej).
  // Powrót na górę = znowu się pojawia. Próg jest jednokierunkowy (anchor =
  // `[data-logo-hide-anchor]` na czole hero/kontakt) → zero migotania. Mierzymy
  // STABILNY wrapper (nie animowany — inaczej jego ruch wracałby do testu).
  const logoSlotRef = useRef<HTMLDivElement>(null);
  const logoHidden = useLogoHidden(logoSlotRef);
  // Focus override: gdy ktoś przejdzie na logo Tabem, MUSI być widoczne (inaczej
  // „niewidzialny" focus). Logo zostaje też w drzewie a11y (czytniki zawsze mają
  // link do strony głównej).
  const [logoFocused, setLogoFocused] = useState(false);
  // Gdy menu jest otwarte, KODA MUSI być widoczne (białe menu, ciemny napis) —
  // żeby było co kliknąć (powrót na stronę główną) i żeby nie znikało, gdy ktoś
  // otworzy menu po zjechaniu w dół (gdzie logo jest normalnie schowane).
  // ★ Logo ZNIKA przy zjeździe i ZOSTAJE schowane do końca (życzenie usera) —
  // BEZ ponownego pokazywania nad ciemną wyspą Statement/CTA. Wraca tylko na
  // górze strony albo przy fokusie (Tab, a11y).
  const hideLogo = logoHidden && !logoFocused && !open;

  // ── Przełącznik motywu chowa się TAK SAMO jak logo ────────────────────────
  // (życzenie usera: ikonka ☀/☾ znika przy zjeździe i wraca na górze, dokładnie
  // jak wordmark KODA). Burger i pill „Kontakt" ZOSTAJĄ (menu zawsze dostępne).
  // Osobny stan focusu, by Tab na przełącznik wymuszał jego widoczność (a11y).
  const [toggleFocused, setToggleFocused] = useState(false);
  const hideToggle = logoHidden && !toggleFocused && !open;

  // ── Magnetyczny przycisk ──────────────────────────────────────────
  const btnRef = useRef<HTMLButtonElement>(null);
  const mvx = useMotionValue(0);
  const mvy = useMotionValue(0);
  const x = useSpring(mvx, MAGNET_SPRING);
  const y = useSpring(mvy, MAGNET_SPRING);

  const onMagnetMove = (e: React.MouseEvent) => {
    const r = btnRef.current?.getBoundingClientRect();
    if (!r) return;
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    mvx.set((e.clientX - cx) * MAGNET_STRENGTH);
    mvy.set((e.clientY - cy) * MAGNET_STRENGTH);
  };
  const onMagnetLeave = () => {
    mvx.set(0);
    mvy.set(0);
  };

  // Stabilny handler zamknięcia (identyczna referencja) → efekt focus-trapu w
  // MenuOverlay nie re-uruchamia się przy każdym renderze.
  const closeMenu = useCallback(() => setOpen(false), []);

  // ── Toggle menu — mierzy środek przycisku jako origin koła ─────────
  const toggle = () => {
    if (!open) {
      const r = btnRef.current?.getBoundingClientRect();
      if (r) setOrigin({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
    }
    setOpen((o) => !o);
  };

  // A1 — przycisk hamburgera HIGH-CONTRAST (odwrócony): biały krążek na ciemnym/
  // różowym tle, ciemny krążek na białym tle. Linie/X kontrastują z krążkiem.
  //   • czarne tło (hero)      → biały krążek, ciemne linie
  //   • białe tło (kontakt)    → ciemny krążek, białe linie
  //   • różowe tło (statement) → biały krążek, ciemne linie
  //   • menu otwarte           → ciemny krążek (#141414) na białym menu, biały X
  const buttonBg = open ? "#141414" : light ? "#0f0f0f" : "#ffffff";
  const iconColor = light ? "#ffffff" : "#0f0f0f";

  // B1 — wyrazisty pill KONTAKT (ważny przycisk → solidne tło = zawsze czytelny,
  // nigdy nie „nachodzi"/zlewa się z treścią za nim podczas scrolla).
  //   • ciemne/białe tło → różowy pill, biały tekst (akcent marki)
  //   • różowe tło        → biały pill, ciemny tekst (róż-na-różu by zniknął)
  const pillBg = onPink ? "#ffffff" : "#cf43b8";
  const pillText = onPink ? "#0f0f0f" : "#ffffff";
  const pillShadow = onPink
    ? "shadow-[0_6px_20px_-10px_rgba(0,0,0,0.35)] hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]"
    : "shadow-[0_8px_24px_-10px_rgba(207,67,184,0.7)] hover:shadow-[0_14px_34px_-10px_rgba(207,67,184,0.9)]";

  return (
    <>
      {/* ⚠ pointer-events-none na całym pasku: przezroczyste „puste" pole headera
          (między logo a prawą grupą) rozciąga się na PEŁNĄ szerokość i z domyślnym
          pointer-events:auto PRZECHWYTYWAŁO kliknięcia w górnym pasie ekranu (84px
          mobile / 130px desktop). Każdy element pod tym pasem (np. przyciski FAQ
          przescrollowane pod header) stawał się NIEKLIKALNY — „da się kliknąć tylko
          gdy element jest niżej, na środku ekranu". Teraz pasek przepuszcza klik, a
          realne kontrolki (logo, przełącznik, pill, burger) włączają pointer-events
          z powrotem. */}
      <header className="pointer-events-none fixed top-0 right-0 left-0 z-[var(--z-header)]">
        <div className="w-full px-[clamp(24px,4vw,58px)]">
          <nav
            className="flex h-[84px] items-center justify-between md:h-[130px] md:pt-5"
            aria-label="Nawigacja główna"
          >
            {/* ── Logo ── (top-LEFT — ciemnieje wcześnie, więc wjeżdża wcześnie:
                 jeszcze w trakcie sweepu, slide z góry)
                 ANCHOR (plain div) = STABILNY box do detekcji kolizji — NIGDY nie
                 transformowany, więc ani wejście, ani ukrywanie nie wracają do
                 testu nakładania (zero oscylacji, zero skew przy starcie). */}
            <div ref={logoSlotRef} className="pointer-events-auto z-10 shrink-0">
              {/* WEJŚCIE — slide z góry, jednorazowe, zsync z intro */}
              <motion.div
                data-reveal
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: EASE.primary, delay: base - 0.3 }}
              >
                {/* WIDOCZNOŚĆ — gładkie, powolne zniknięcie (fade + delikatny lift,
                    jakby chowało się z powrotem w header) i równie gładki powrót.
                    Dłużej (0.6s) + miękka krzywa in-out (EASE.smooth) = bez „skoku".
                    Focus (Tab) wymusza powrót do widoku; link zostaje w drzewie
                    a11y. Schowane = nieklikalne myszą (pointer-events none).
                    reduced-motion: motion zdejmuje transform, zostaje sam fade. */}
                <motion.div
                  onFocus={() => setLogoFocused(true)}
                  onBlur={() => setLogoFocused(false)}
                  animate={{
                    opacity: hideLogo ? 0 : 1,
                    y: hideLogo ? -10 : 0,
                  }}
                  transition={{ duration: 0.6, ease: EASE.smooth }}
                  style={{
                    transformOrigin: "left center",
                    pointerEvents: hideLogo ? "none" : "auto",
                  }}
                >
                  <Link
                    href="/"
                    aria-label={SITE_CONFIG.name}
                    // Klik w logo (też w otwartym menu) wraca na stronę główną —
                    // i ZAMYKA menu. Header żyje w layoutcie, więc bez tego stan
                    // `open` zostałby true po soft-nawigacji i menu by „wisiało".
                    onClick={closeMenu}
                    className={cn(
                      "block",
                      // Nad różem KODA zostaje białe (róż-na-różu by zniknął); poza nim
                      // standard: dziedziczy kolor sekcji, na hover różowieje jak kropka.
                      onPink
                        ? "text-[#eeeeee] hover:text-white"
                        : cn("hover:text-[#cf43b8]", light ? "text-[#0f0f0f]" : "text-[#eeeeee]")
                    )}
                    style={{ transition: `color ${CLR_DUR} ${CLR_EASE}` }}
                  >
                    <KodaLogo width={124} height={32} dotColor={onPink ? "#ffffff" : "#cf43b8"} />
                  </Link>
                </motion.div>
              </motion.div>
            </div>

            {/* ── Right side ── (top-RIGHT — ciemnieje na końcu sweepu, więc
                 wjeżdża gdy linia dochodzi do prawej krawędzi) */}
            <motion.div
              data-reveal
              className="pointer-events-auto flex items-center gap-3 sm:gap-5"
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE.primary, delay: base - 0.02 }}
            >
              {/* ── Przełącznik motywu (jasny/ciemny) — dostępny też na mobile.
                  CHOWA SIĘ jak logo (fade + lekki lift) przy zjeździe, wraca na
                  górze. pointer-events:none gdy schowany = nieklikalny myszą, a
                  focus (Tab) wymusza powrót do widoku. */}
              <motion.div
                onFocus={() => setToggleFocused(true)}
                onBlur={() => setToggleFocused(false)}
                animate={{ opacity: hideToggle ? 0 : 1, y: hideToggle ? -10 : 0 }}
                transition={{ duration: 0.6, ease: EASE.smooth }}
                style={{ pointerEvents: hideToggle ? "none" : "auto" }}
              >
                <ThemeToggle />
              </motion.div>

              {/* ── KONTAKT pill (główne CTA do kontaktu) ── */}
              <Link
                href="/kontakt"
                className={cn(
                  "hidden items-center justify-center rounded-full sm:inline-flex",
                  "font-heading text-[12px] font-bold tracking-[0.14em] uppercase",
                  "min-h-[44px] px-5 py-2.5 hover:-translate-y-px",
                  pillShadow
                )}
                style={{
                  backgroundColor: pillBg,
                  color: pillText,
                  transition: `background-color ${CLR_DUR} ${CLR_EASE}, color ${CLR_DUR} ${CLR_EASE}, transform 320ms ${CLR_EASE}, box-shadow 320ms ${CLR_EASE}`,
                }}
              >
                Kontakt
              </Link>

              {/* ── Magnetic circular button ── */}
              <div
                className="relative shrink-0"
                onMouseMove={onMagnetMove}
                onMouseLeave={onMagnetLeave}
                style={{ padding: 18, margin: -18 }} // strefa łapania > przycisk (jak baunfire scale 1.5)
              >
                <motion.button
                  ref={btnRef}
                  style={{
                    x,
                    y,
                    backgroundColor: buttonBg,
                    transition: `background-color ${CLR_DUR} ${CLR_EASE}`,
                  }}
                  className="relative flex h-[50px] w-[50px] items-center justify-center rounded-full"
                  onClick={toggle}
                  aria-label={open ? "Zamknij menu" : "Otwórz menu"}
                  aria-expanded={open}
                >
                  {/* hamburger lines */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute flex flex-col gap-[5px] transition-[transform,opacity] duration-300",
                      open ? "scale-75 opacity-0" : "scale-100 opacity-100"
                    )}
                  >
                    {[20, 20, 12].map((w, i) => (
                      <span
                        key={i}
                        className="block h-px"
                        style={{
                          width: w,
                          backgroundColor: iconColor,
                          transition: `background-color ${CLR_DUR} ${CLR_EASE}`,
                        }}
                      />
                    ))}
                  </span>

                  {/* X (close) */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute flex items-center justify-center transition-[transform,opacity] duration-300",
                      open ? "scale-100 opacity-100" : "scale-75 opacity-0"
                    )}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={iconColor}
                      strokeWidth={1.5}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                      style={{ transition: `stroke ${CLR_DUR} ${CLR_EASE}` }}
                    >
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </span>
                </motion.button>
              </div>
            </motion.div>
          </nav>
        </div>
      </header>

      {/* ── Full-screen menu (expanding circle) ── */}
      <MenuOverlay
        open={open}
        origin={origin}
        onClose={closeMenu}
        triggerRef={btnRef as RefObject<HTMLElement | null>}
      />
    </>
  );
}
