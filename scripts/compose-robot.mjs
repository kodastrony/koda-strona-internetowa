#!/usr/bin/env node
// ★15.10 LAUNCH — `postbuild` koda-site: po `next build` (STATIC_EXPORT=true) nakłada na `out/` robota K.O.D.A z `overlay/`.
//
// Dlaczego tak: projekt Cloudflare Pages `kodastrony` (kodastrony.pl) buduje z tego repo przez integrację Git i NIE przyjmuje
// direct upload. Zamiast przepinać domenę między projektami, robot (build prod z koda-bot: `node seo/publish-pl.mjs`) leży
// w `overlay/` tego repo i trafia pod `/` przy każdym buildzie. Strona główna = K.O.D.A, podstrony = Next.
//
// Co robi: (1) kopiuje overlay/ na out/ (index.html, assets/, fonts/, portfolio/, screen/, ikony, _headers, robots.txt);
// (2) usuwa ładunki RSC dawnej strony głównej z korzenia (index.txt, __next.*.txt) — inaczej klik w logo na podstronie
// renderowałby STARĄ stronę główną po stronie klienta; (3) raport. Bez overlay/ build przechodzi bez zmian (strona Next).
//
// Lokalnie: `npm run build` (STATIC_EXPORT=true) uruchamia to samo; `npx next build` NIE (bez lifecycle npm).

import { cpSync, existsSync, readdirSync, rmSync, statSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'out');
const OVERLAY = join(ROOT, 'overlay');

if (process.env.STATIC_EXPORT !== 'true' || !existsSync(join(OUT, 'index.html'))) {
  console.log('compose-robot: pomijam (nie static export albo brak out/)');
  process.exit(0);
}
if (!existsSync(join(OVERLAY, 'index.html'))) {
  console.log('compose-robot: brak overlay/index.html — strona główna zostaje stroną Next');
  process.exit(0);
}
const html = readFileSync(join(OVERLAY, 'index.html'), 'utf8');
if (/name="robots" content="noindex"/.test(html) || !/<!-- SEO \(prod;/.test(html)) {
  console.error('compose-robot: overlay/index.html to build PODGLĄDU (noindex) — w koda-bot: node seo/publish-pl.mjs');
  process.exit(1);
}

cpSync(OVERLAY, OUT, { recursive: true });

// Eksport Next na WINDOWS zapisuje pliki prefetch segmentów jako katalogi (`uslugi/__next.uslugi/__PAGE__.txt`), a klient
// prosi o nazwę z kropką (`__next.uslugi.__PAGE__.txt`) — tak zapisuje build linuksowy Cloudflare. Lokalnie dokładamy płaskie
// kopie, żeby `npm run build` na Windows dawał to samo co produkcja (na Linuksie takich katalogów nie ma — pętla nic nie robi).
function flattenSegments(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (!statSync(p).isDirectory()) continue;
    if (/^__next\./.test(f)) { for (const g of readdirSync(p)) { const src = join(p, g); if (statSync(src).isFile()) cpSync(src, join(dir, `${f}.${g}`)); } }
    else flattenSegments(p);
  }
}
flattenSegments(OUT);
let removed = 0;
for (const f of readdirSync(OUT)) {
  if (f === 'index.txt' || /^__next\..*\.txt$/.test(f)) { rmSync(join(OUT, f)); removed++; }
}
const stamp = (html.match(/name="koda-build" content="([^"]+)"/) || [])[1] || '?';
const n = (d) => readdirSync(d).reduce((a, f) => { const p = join(d, f); return a + (statSync(p).isDirectory() ? n(p) : 1); }, 0);
console.log(`compose-robot: / = K.O.D.A (build ${stamp}), overlay ${n(OVERLAY)} plików na out/, usunięte ładunki RSC strony głównej: ${removed}`);
