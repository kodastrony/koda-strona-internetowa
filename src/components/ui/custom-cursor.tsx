"use client";

import { useEffect, useRef } from "react";

/* ── Custom cursor — KODA (odwzorowanie baunfire.com) ──────────────────────
   NATYWNY kursor (biała strzałka) ZOSTAJE — to on jest wskaźnikiem. My dokładamy
   smukły akcent, który za nim podąża: mała różowa KROPKA (prowadzi) + cienki,
   subtelny szary RING (wlecze się za nią). Na hover ring „rozkwita" w miękki,
   półprzezroczysty DYSK wypełniany OD ŚRODKA na zewnątrz.

   ── Dlaczego tak zbudowane (płynność) ──────────────────────────────────────
   POZYCJĘ pisze jedna pętla rAF jako `transform: translate3d` na warstwie-pozycji.
   WYPEŁNIENIE to `transform: scale()` na ODDZIELNEJ, wewnętrznej warstwie ringu →
   skalowanie z GPU rośnie od środka i jest idealnie gładkie (animacja width/height
   ścinałaby się). Dwie różne warstwy = transformy się nie biją. Rozmiar/kolor =
   przejścia CSS na zmianę atrybutu (poza pętlą).

   STANY (data-cursor-state): idle / hover. MOTYW (data-cursor-theme): dark/light/pink.
   Magnes przycisku menu „dojeżdża" do kursora po stronie header.tsx — tu nic
   specjalnego (przycisk to zwykły hover). Tylko fine-pointer + bez reduced-motion. */

const INTERACTIVE =
  "a, button, input, textarea, select, label, [role='button'], [data-cursor='hover']";

const DOT_LERP = 0.8; // kropka — prawie przyklejona do strzałki (snappy, prowadzi)
const RING_LERP = 0.28; // ring — lekki „ogon" za kropką (jak baunfire)

type Theme = "dark" | "light" | "pink";

export function CustomCursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return; // touch / coarse / reduced → tylko natywny kursor

    const root = rootRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!root || !dot || !ring) return;

    // ── stan w refach (zero setState w pętli) ──
    const px = { x: window.innerWidth / 2, y: window.innerHeight / 2 }; // surowa mysz
    const dpos = { x: px.x, y: px.y }; // kropka — pozycja renderowana
    const rpos = { x: px.x, y: px.y }; // ring  — pozycja renderowana
    let primed = false; // pierwszy ruch = teleport (bez wjazdu z rogu ekranu)
    let state = "idle";
    let theme: Theme = "dark";

    const applyState = (s: string) => {
      if (s === state) return;
      state = s;
      root.dataset.cursorState = s;
    };
    const applyTheme = (t: Theme) => {
      if (t === theme) return;
      theme = t;
      root.dataset.cursorTheme = t;
    };

    // ── stan (hover) + motyw z elementu pod kursorem ──
    const resolveFrom = (el: Element | null) => {
      const menu = el?.closest("[data-menu]");
      if (menu && menu.getAttribute("aria-hidden") === "false") {
        applyTheme("light"); // otwarte białe menu
      } else {
        const sec = el?.closest<HTMLElement>("[data-header-theme]");
        if (sec) applyTheme((sec.dataset.headerTheme as Theme) ?? "dark");
        // nad fixed-headerem (brak sekcji) → zostaw ostatni motyw
      }
      applyState(el?.closest(INTERACTIVE) ? "hover" : "idle");
    };

    // ── pętla rAF (jedyna; pisze TYLKO transform pozycji, cel = mysz) ──
    let raf = 0;
    let running = false;
    let last = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const frame = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 16.667, 3); // normalizacja Hz + clamp po stallu
      last = now;
      const fd = 1 - Math.pow(1 - DOT_LERP, dt);
      const fr = 1 - Math.pow(1 - RING_LERP, dt);

      dpos.x = lerp(dpos.x, px.x, fd);
      dpos.y = lerp(dpos.y, px.y, fd);
      rpos.x = lerp(rpos.x, px.x, fr);
      rpos.y = lerp(rpos.y, px.y, fr);

      // warstwa-pozycji ringu i kropka — TYLKO translate (scale ringu robi CSS)
      ring.style.transform = `translate3d(${rpos.x}px, ${rpos.y}px, 0)`;
      dot.style.transform = `translate3d(${dpos.x}px, ${dpos.y}px, 0) translate(-50%, -50%)`;

      const settled =
        Math.abs(px.x - dpos.x) < 0.1 &&
        Math.abs(px.y - dpos.y) < 0.1 &&
        Math.abs(px.x - rpos.x) < 0.1 &&
        Math.abs(px.y - rpos.y) < 0.1;
      if (settled) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (running || document.hidden) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const park = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };

    // ── eventy ──
    const onMove = (e: MouseEvent) => {
      px.x = e.clientX;
      px.y = e.clientY;
      if (!primed) {
        primed = true;
        dpos.x = rpos.x = px.x;
        dpos.y = rpos.y = px.y;
        root.style.opacity = "1";
      }
      kick();
    };
    const onOver = (e: MouseEvent) => resolveFrom(e.target as Element | null);

    // Lenis: czysty scroll (mysz nieruchoma) nie odpala mouseover → re-sample
    // motyw/hover raz na klatkę z elementFromPoint.
    let scrollScheduled = false;
    const onScroll = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      requestAnimationFrame(() => {
        scrollScheduled = false;
        resolveFrom(document.elementFromPoint(px.x, px.y));
      });
    };

    const onDown = () => root.setAttribute("data-cursor-press", "1");
    const onUp = () => root.removeAttribute("data-cursor-press");
    const onEnter = () => kick();
    const onLeave = () => {
      root.style.opacity = "0";
      root.removeAttribute("data-cursor-press"); // mouseup mógł paść poza oknem → odepnij „press"
      primed = false;
      park();
    };
    const onVis = () => (document.hidden ? park() : kick());

    // Menu otwiera/zamyka się BEZ ruchu myszy (sama zmiana aria-hidden), co nie
    // odpala mousemove/over/scroll → bez tego motyw zostałby „dark" nad białym
    // menu (ring/kropka prawie niewidoczne). Obserwuj aria-hidden i prze-sampluj.
    const menuEl = document.querySelector("[data-menu]");
    const menuObs = menuEl
      ? new MutationObserver(() => {
          // Otwarte menu = białe tło → wymuś light WPROST z atrybutu (nie przez
          // elementFromPoint, bo pointer-events menu mogą się jeszcze nie ustawić).
          // Zamknięte → prze-sampluj sekcję pod kursorem.
          if (menuEl.getAttribute("aria-hidden") === "false") applyTheme("light");
          else resolveFrom(document.elementFromPoint(px.x, px.y));
        })
      : null;
    if (menuEl && menuObs) {
      menuObs.observe(menuEl, { attributes: true, attributeFilter: ["aria-hidden"] });
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseenter", onEnter);
    document.addEventListener("visibilitychange", onVis);

    return () => {
      park();
      menuObs?.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("scroll", onScroll);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseenter", onEnter);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  // Warstwa-pozycji ringu (rAF translate) → wewnątrz `__ring` (CSS scale = wypełnienie
  // od środka). Kropka osobno (stały rozmiar). Natywny kursor NIE jest chowany.
  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      data-cursor-state="idle"
      data-cursor-theme="dark"
      className="koda-cursor pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] hidden lg:block"
      style={{ opacity: 0 }}
    >
      <div ref={ringRef} className="koda-cursor__ring-pos">
        <div className="koda-cursor__ring" />
      </div>
      <div ref={dotRef} className="koda-cursor__dot" />
    </div>
  );
}
