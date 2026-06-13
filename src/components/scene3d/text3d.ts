"use client";

import * as THREE from "three";
import { toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { resolveLogoFontFamily } from "./lib";

/* ══════════════════════════════════════════════════════════════════════════
   text3d — PRAWDZIWE bryły liter „KODA" (Syne 800) bez plików fontów.

   Pipeline (wszystko w przeglądarce, raz przy montażu):
   1. litera → offscreen canvas 2D (anty-aliasowana alfa),
   2. marching squares Z INTERPOLACJĄ progu na kanale alfa → gładkie,
      sub-pikselowe kontury (zamknięte pętle; AA czcionki = darmowy smoothing),
   3. RDP upraszcza pętle (kolinearne odcinki out, krzywe zostają),
   4. klasyfikacja zagnieżdżeń (parzystość) → kontur zewnętrzny vs dziura
      (O, D, A mają dziury), THREE.Shape + ExtrudeGeometry z fazą.

   Współrzędne wynikowe w EM (1.0 = rozmiar fontu, y w górę, baseline w 0,
   lewa krawędź rysowania w 0) — konsument skaluje przez fontPx→world.
   ══════════════════════════════════════════════════════════════════════════ */

const LETTERS = ["K", "O", "D", "A"] as const;

/** lineHeight kolumny KODA — identyczny z DOM-ową kolumną hero (0.9em). */
export const KODA_LINE_H = 0.9;

export interface LetterGeometry {
  letter: (typeof LETTERS)[number];
  geometry: THREE.BufferGeometry;
  /** Środek bboxa litery w EM względem (baseline, lewa krawędź rysowania). */
  center: [number, number];
  width: number;
  height: number;
}

export interface KodaLetters3D {
  letters: LetterGeometry[];
  /** Najszersza litera (em) — szerokość „kolumny". */
  columnWidth: number;
  /** Wysokość kolumny od TOPU pierwszej litery do dołu ostatniej (em). */
  columnHeight: number;
  /** Górna krawędź glifów (cap height) nad baseline (em, dodatnia). */
  capTop: number;
  dispose: () => void;
}

/* ── Marching squares (filled-on-left) ────────────────────────────────────
   Pole skalarne = alfa/255 próbkowana w środkach pikseli; próg 0.5.
   Segmenty kierunkowe tak, by WYPEŁNIENIE było po lewej stronie marszu —
   wszystkie pętle domykają się spójnie, a sklejanie idzie po id krawędzi
   (punkt przecięcia liczony RAZ per krawędź → klucze są bitowo identyczne). */

type Pt = [number, number];

const EDGE_T = 0;
const EDGE_R = 1;
const EDGE_B = 2;
const EDGE_L = 3;

// case → lista segmentów [zKrawędzi, doKrawędzi]; 5/10 = siodła (per-komórka).
const MS_CASES: ReadonlyArray<ReadonlyArray<readonly [number, number]>> = [
  [], // 0
  [[EDGE_B, EDGE_L]], // 1  BL
  [[EDGE_R, EDGE_B]], // 2  BR
  [[EDGE_R, EDGE_L]], // 3  dół
  [[EDGE_T, EDGE_R]], // 4  TR
  [], // 5  siodło — rozstrzygane środkiem
  [[EDGE_T, EDGE_B]], // 6  prawa połowa
  [[EDGE_T, EDGE_L]], // 7  ~TL
  [[EDGE_L, EDGE_T]], // 8  TL
  [[EDGE_B, EDGE_T]], // 9  lewa połowa
  [], // 10 siodło
  [[EDGE_R, EDGE_T]], // 11 ~TR
  [[EDGE_L, EDGE_R]], // 12 góra
  [[EDGE_B, EDGE_R]], // 13 ~BR
  [[EDGE_L, EDGE_B]], // 14 ~BL
  [], // 15
];

function traceContours(field: Float32Array, w: number, h: number, iso: number): Pt[][] {
  const f = (x: number, y: number) => field[y * w + x];

  // Id krawędzi: pozioma (x,y)-(x+1,y) → parzyste; pionowa (x,y)-(x,y+1) → nieparzyste.
  const hEdge = (x: number, y: number) => (y * w + x) * 2;
  const vEdge = (x: number, y: number) => (y * w + x) * 2 + 1;

  const crossings = new Map<number, Pt>();
  const lerp = (a: number, b: number) => {
    const d = b - a;
    return d === 0 ? 0.5 : (iso - a) / d;
  };
  const edgePoint = (edge: number, x: number, y: number): [number, Pt] => {
    switch (edge) {
      case EDGE_T: {
        const id = hEdge(x, y);
        let p = crossings.get(id);
        if (!p) {
          p = [x + lerp(f(x, y), f(x + 1, y)), y];
          crossings.set(id, p);
        }
        return [id, p];
      }
      case EDGE_B: {
        const id = hEdge(x, y + 1);
        let p = crossings.get(id);
        if (!p) {
          p = [x + lerp(f(x, y + 1), f(x + 1, y + 1)), y + 1];
          crossings.set(id, p);
        }
        return [id, p];
      }
      case EDGE_L: {
        const id = vEdge(x, y);
        let p = crossings.get(id);
        if (!p) {
          p = [x, y + lerp(f(x, y), f(x, y + 1))];
          crossings.set(id, p);
        }
        return [id, p];
      }
      default: {
        const id = vEdge(x + 1, y);
        let p = crossings.get(id);
        if (!p) {
          p = [x + 1, y + lerp(f(x + 1, y), f(x + 1, y + 1))];
          crossings.set(id, p);
        }
        return [id, p];
      }
    }
  };

  // fromEdgeId → [toEdgeId, fromPt] (każda krawędź jest startem ≤1 segmentu).
  const segs = new Map<number, [number, Pt]>();

  for (let y = 0; y < h - 1; y++) {
    for (let x = 0; x < w - 1; x++) {
      const v00 = f(x, y);
      const v10 = f(x + 1, y);
      const v11 = f(x + 1, y + 1);
      const v01 = f(x, y + 1);
      const idx =
        (v00 >= iso ? 8 : 0) | (v10 >= iso ? 4 : 0) | (v11 >= iso ? 2 : 0) | (v01 >= iso ? 1 : 0);
      if (idx === 0 || idx === 15) continue;

      let pairs: ReadonlyArray<readonly [number, number]>;
      if (idx === 5) {
        const centerFilled = (v00 + v10 + v11 + v01) / 4 >= iso;
        pairs = centerFilled
          ? [
              [EDGE_T, EDGE_L],
              [EDGE_B, EDGE_R],
            ]
          : [
              [EDGE_T, EDGE_R],
              [EDGE_B, EDGE_L],
            ];
      } else if (idx === 10) {
        const centerFilled = (v00 + v10 + v11 + v01) / 4 >= iso;
        pairs = centerFilled
          ? [
              [EDGE_R, EDGE_T],
              [EDGE_L, EDGE_B],
            ]
          : [
              [EDGE_L, EDGE_T],
              [EDGE_R, EDGE_B],
            ];
      } else {
        pairs = MS_CASES[idx];
      }

      for (const [fromE, toE] of pairs) {
        const [fromId, fromPt] = edgePoint(fromE, x, y);
        const [toId] = edgePoint(toE, x, y);
        segs.set(fromId, [toId, fromPt]);
      }
    }
  }

  // Sklejanie pętli: idź from→to aż wrócisz do startu.
  const loops: Pt[][] = [];
  const visited = new Set<number>();
  for (const startId of segs.keys()) {
    if (visited.has(startId)) continue;
    const loop: Pt[] = [];
    let id = startId;
    // Bezpiecznik długości — pole jest skończone, ale nie wieszamy się nigdy.
    for (let guard = segs.size + 4; guard > 0; guard--) {
      const seg = segs.get(id);
      if (!seg || visited.has(id)) break;
      visited.add(id);
      loop.push(seg[1]);
      id = seg[0];
      if (id === startId) break;
    }
    if (loop.length >= 6) loops.push(loop);
  }
  return loops;
}

/* ── Ramer–Douglas–Peucker (iteracyjnie, bez rekursji) ──────────────────── */
function simplify(points: Pt[], eps: number): Pt[] {
  const n = points.length;
  if (n < 5) return points;
  const keep = new Uint8Array(n);
  keep[0] = 1;
  keep[n - 1] = 1;
  const stack: Array<[number, number]> = [[0, n - 1]];
  const e2 = eps * eps;

  while (stack.length) {
    const [a, b] = stack.pop()!;
    if (b - a < 2) continue;
    const ax = points[a][0];
    const ay = points[a][1];
    const dx = points[b][0] - ax;
    const dy = points[b][1] - ay;
    const len2 = dx * dx + dy * dy || 1e-12;
    let maxD = -1;
    let maxI = -1;
    for (let i = a + 1; i < b; i++) {
      const px = points[i][0] - ax;
      const py = points[i][1] - ay;
      const t = Math.max(0, Math.min(1, (px * dx + py * dy) / len2));
      const ex = px - t * dx;
      const ey = py - t * dy;
      const d = ex * ex + ey * ey;
      if (d > maxD) {
        maxD = d;
        maxI = i;
      }
    }
    if (maxD > e2 && maxI > 0) {
      keep[maxI] = 1;
      stack.push([a, maxI], [maxI, b]);
    }
  }
  const out: Pt[] = [];
  for (let i = 0; i < n; i++) if (keep[i]) out.push(points[i]);
  return out;
}

function signedArea(pts: Pt[]): number {
  let a = 0;
  for (let i = 0, n = pts.length; i < n; i++) {
    const [x0, y0] = pts[i];
    const [x1, y1] = pts[(i + 1) % n];
    a += x0 * y1 - x1 * y0;
  }
  return a / 2;
}

function pointInPolygon(p: Pt, poly: Pt[]): boolean {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > p[1] !== yj > p[1] && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

/* ── Główny builder ───────────────────────────────────────────────────────
   depth/bevel w EM. quality "low" = rzadszy sampling (mniejszy canvas). */
export async function buildKodaLetters3D(opts?: {
  depth?: number;
  bevel?: number;
  quality?: "low" | "high";
}): Promise<KodaLetters3D> {
  const depth = opts?.depth ?? 0.16;
  const bevel = opts?.bevel ?? 0.012;
  const F = opts?.quality === "low" ? 220 : 330; // px rozmiaru fontu w tracerze

  const family = await resolveLogoFontFamily();

  // Canvas z zapasem na wywieszki glifów; baseline nisko, origin x z paddingiem.
  const W = Math.ceil(F * 1.5);
  const H = Math.ceil(F * 1.4);
  const PAD_X = Math.ceil(F * 0.18);
  const BASE_Y = Math.ceil(F * 1.02);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;
  ctx.font = `800 ${F}px ${family}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#fff";

  const letters: LetterGeometry[] = [];
  let columnWidth = 0;
  let capTop = 0;

  for (const letter of LETTERS) {
    ctx.clearRect(0, 0, W, H);
    ctx.fillText(letter, PAD_X, BASE_Y);
    const img = ctx.getImageData(0, 0, W, H).data;

    const field = new Float32Array(W * H);
    for (let i = 0; i < W * H; i++) field[i] = img[i * 4 + 3] / 255;

    const loops = traceContours(field, W, H, 0.5).map((loop) => simplify(loop, F * 0.0035));

    // Zagnieżdżenia (parzystość) — px, y w dół.
    const order = loops
      .map((pts, i) => ({ i, pts, area: Math.abs(signedArea(pts)) }))
      .sort((a, b) => b.area - a.area)
      .filter((l) => l.area > F * F * 0.001); // śmieci AA out

    type Node = { pts: Pt[]; area: number; holes: Pt[][] };
    const outers: Node[] = [];
    for (const l of order) {
      let parent: Node | null = null;
      let depthCount = 0;
      for (const o of order) {
        if (o.i === l.i || o.area <= l.area) continue;
        if (pointInPolygon(l.pts[0], o.pts)) depthCount++;
      }
      if (depthCount % 2 === 0) {
        outers.push({ pts: l.pts, area: l.area, holes: [] });
      } else {
        // Dziura → przypisz najmniejszemu zawierającemu konturowi zewnętrznemu.
        for (let k = outers.length - 1; k >= 0; k--) {
          if (pointInPolygon(l.pts[0], outers[k].pts)) {
            parent = outers[k];
            break;
          }
        }
        parent?.holes.push(l.pts);
      }
    }

    // px (y w dół) → EM (y w górę, baseline 0, lewa krawędź rysowania 0).
    const toEm = (p: Pt): Pt => [(p[0] - PAD_X) / F, (BASE_Y - p[1]) / F];

    const shapes: THREE.Shape[] = [];
    for (const o of outers) {
      const outerPts = o.pts.map(toEm);
      if (THREE.ShapeUtils.area(outerPts.map(([x, y]) => new THREE.Vector2(x, y))) < 0) {
        outerPts.reverse();
      }
      const shape = new THREE.Shape(outerPts.map(([x, y]) => new THREE.Vector2(x, y)));
      for (const holeRaw of o.holes) {
        const holePts = holeRaw.map(toEm);
        if (THREE.ShapeUtils.area(holePts.map(([x, y]) => new THREE.Vector2(x, y))) > 0) {
          holePts.reverse();
        }
        shape.holes.push(new THREE.Path(holePts.map(([x, y]) => new THREE.Vector2(x, y))));
      }
      shapes.push(shape);
    }

    const raw = new THREE.ExtrudeGeometry(shapes, {
      depth,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel * 0.85,
      bevelSegments: 2,
      steps: 1,
    });
    // Extrude daje PŁASKIE normalne per segment ścianki → przy głębokich
    // bryłach (strona 5) widać pionowe pasy. Próg crease MUSI być mniejszy
    // niż kąt jednego kroku fazy (~22° przy bevelSegments 2), inaczej
    // wygładzenie „przełazi" z czoła przez fazę na ścianę i bryła robi się
    // poduszką. 0.3 rad: łuki ścian gładkie, czoło/faza ostre.
    const geometry = toCreasedNormals(raw, 0.3);
    raw.dispose();
    geometry.computeBoundingBox();
    const bb = geometry.boundingBox!;
    const cx = (bb.min.x + bb.max.x) / 2;
    const cy = (bb.min.y + bb.max.y) / 2;
    const cz = (bb.min.z + bb.max.z) / 2;
    geometry.translate(-cx, -cy, -cz);

    letters.push({
      letter,
      geometry,
      center: [cx, cy],
      width: bb.max.x - bb.min.x,
      height: bb.max.y - bb.min.y,
    });
    columnWidth = Math.max(columnWidth, bb.max.x - bb.min.x);
    capTop = Math.max(capTop, bb.max.y);
  }

  // Kolumna: litera i ma baseline na y = -i·lineH; top = capTop nad baseline 0.
  const last = letters[letters.length - 1];
  const columnHeight =
    capTop + (LETTERS.length - 1) * KODA_LINE_H - (last.center[1] - last.height / 2);

  return {
    letters,
    columnWidth,
    columnHeight,
    capTop,
    dispose: () => letters.forEach((l) => l.geometry.dispose()),
  };
}

/* ── Pionowa kolumna „KODA" jako tekstura (wariant szkło×jedwab) ──────────
   Lustro DOM-owej kolumny hero (lineHeight 0.9, left-aligned, #1c1c1c) —
   żyje W SCENIE, więc szkło może ją refraktować. Zwraca metryki px,
   żeby scena mogła ją posadzić 1:1 względem układu strony. */
export interface KodaColumnTexture {
  canvas: HTMLCanvasElement;
  /** px rozmiaru fontu użytego w teksturze. */
  fontPx: number;
  /** Pozycja lewej krawędzi rysowania glifów w teksturze (px). */
  drawX: number;
  /** Baseline PIERWSZEJ litery od góry tekstury (px). */
  baseline0: number;
  width: number;
  height: number;
}

/** Poziome „KODA" w jednolitym kolorze marki (mobile za szkłem) —
    lustro kolumny: ghost #1c1c1c, czytelne i na bieli intro, i jako
    sylweta na aurze. Zwraca canvas 2:1. */
export async function makeKodaRowTexture(opts?: { color?: string }): Promise<HTMLCanvasElement> {
  const family = await resolveLogoFontFamily();
  const W = 2048;
  const H = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.font = `800 ${H * 0.52}px ${family}`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = opts?.color ?? "#1c1c1c";
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "-0.04em";
  ctx.fillText("KODA", W / 2, H / 2 + H * 0.02);
  return canvas;
}

export async function makeKodaColumnTexture(opts?: {
  color?: string;
  fontPx?: number;
}): Promise<KodaColumnTexture> {
  const family = await resolveLogoFontFamily();
  const F = opts?.fontPx ?? 420;
  const drawX = Math.ceil(F * 0.1);
  const baseline0 = Math.ceil(F * 0.8);
  const W = Math.ceil(F * 1.24);
  const H = Math.ceil(baseline0 + KODA_LINE_H * F * 3 + F * 0.28);

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  ctx.clearRect(0, 0, W, H);
  ctx.font = `800 ${F}px ${family}`;
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = opts?.color ?? "#1c1c1c";
  (ctx as CanvasRenderingContext2D & { letterSpacing?: string }).letterSpacing = "-0.04em";

  LETTERS.forEach((letter, i) => {
    ctx.fillText(letter, drawX, baseline0 + i * KODA_LINE_H * F);
  });

  return { canvas, fontPx: F, drawX, baseline0, width: W, height: H };
}
