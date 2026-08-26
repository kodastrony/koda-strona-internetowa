"use client";

import { useEffect, useRef, useState } from "react";

/** Live prefers-reduced-motion read via matchMedia (reliable, no hook-timing
 *  quirks). SSR-safe: false on first render (server matches), true after mount. */
function usePrefersReduced(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(m.matches);
    update();
    m.addEventListener("change", update);
    return () => m.removeEventListener("change", update);
  }, []);
  return reduced;
}

/* ── VideoShowcase — looping clip of a project's signature animation ────────
   The strongest proof of motion craft. Plays muted + looping ONLY while in
   view (IntersectionObserver) and pauses off-view → no wasted bandwidth or
   battery. Lazy: the mp4 src is attached only once the block nears the
   viewport. Reduced-motion: never autoplays — shows the poster with native
   controls so the user can opt in. Poster + explicit width/height = no CLS. */
export function VideoShowcase({
  src,
  poster,
  rgb,
  label,
}: {
  src: string;
  poster: string;
  rgb: string;
  label: string;
}) {
  const reduce = usePrefersReduced();
  // Autoodtwarzanie wyłącza TYLKO reduced-motion (redesign 2026-06-21). Wcześniej
  // gate'owane też tierem (!smoothScroll) → na KAŻDYM telefonie (low) zamiast pętli
  // wideo był statyczny poster — a ta sekcja krzyczy „Bo statyczny obraz tego nie
  // odda". To było dokładnie sprzężenie tier→wygląd, które redesign usuwa. Klip jest
  // wyciszony, lazy (src dopiero przy zbliżeniu), pauzowany poza ekranem (IO) i w
  // pętli → autoplay w kadrze jest tani; bateria/transfer chronione pauzą off-view.
  const noAutoplay = reduce;
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [load, setLoad] = useState(false);
  const [visible, setVisible] = useState(false);
  // WCAG 2.2.2 (poziom A): auto-odtwarzana, zapętlona animacja >5 s MUSI mieć
  // mechanizm pauzy. userPaused = jawna decyzja użytkownika (przycisk niżej) —
  // wygrywa z auto-play przy scrollu, dopóki użytkownik sam nie wznowi.
  const [userPaused, setUserPaused] = useState(false);

  // Observe viewport: attach src on first approach, track visibility.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setLoad(true);
        setVisible(e.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Play only when loaded + visible + motion allowed + not user-paused.
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !load) return;
    if (visible && !noAutoplay && !userPaused) v.play().catch(() => {});
    else v.pause();
  }, [load, visible, noAutoplay, userPaused]);

  return (
    <div
      ref={wrapRef}
      className="relative overflow-hidden rounded-[20px]"
      style={{
        border: `1px solid rgba(${rgb},0.25)`,
        boxShadow: `0 50px 110px -42px rgba(0,0,0,0.7), 0 0 110px -46px rgba(${rgb},0.45)`,
      }}
    >
      <video
        ref={videoRef}
        src={load ? src : undefined}
        poster={poster}
        width={1200}
        height={750}
        muted
        loop
        playsInline
        preload="none"
        controls={noAutoplay}
        aria-label={label}
        className="block h-auto w-full"
      />
      {/* "in motion" badge — signals it's a live screen recording */}
      <span
        className="pointer-events-none absolute top-0 left-0 z-[2] m-4 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-heading text-[10px] font-bold tracking-[0.16em] uppercase"
        style={{ background: "rgba(0,0,0,0.55)", color: "#fff", backdropFilter: "blur(6px)" }}
      >
        <span
          className="inline-block h-1.5 w-1.5 rounded-full"
          style={{ background: `rgb(${rgb})`, boxShadow: `0 0 8px rgb(${rgb})` }}
        />
        Nagranie na żywo
      </span>
      {/* Pauza/wznowienie pętli (WCAG 2.2.2 A). Ukryty, gdy reduced-motion
          pokazuje natywne kontrolki (wtedy pauza już jest). Styl = ciemne szkło
          jak badge wyżej; ≥44px pola dotyku. */}
      {!noAutoplay && (
        <button
          type="button"
          onClick={() => setUserPaused((p) => !p)}
          aria-pressed={userPaused}
          aria-label={userPaused ? "Wznów animację" : "Zatrzymaj animację"}
          className="absolute right-0 bottom-0 z-[2] m-3 flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
        >
          {userPaused ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <path d="M3 1.5 12 7 3 12.5z" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
              <rect x="2.5" y="1.5" width="3.4" height="11" rx="1" />
              <rect x="8.1" y="1.5" width="3.4" height="11" rx="1" />
            </svg>
          )}
        </button>
      )}
    </div>
  );
}
