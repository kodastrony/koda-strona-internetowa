/* ════════════════════════════════════════════════════════════════════════════
   tier-sim.mjs — harness trafności detekcji tierów (duża skala).
   node koda-site/scripts/tier-sim.mjs   → testy jednostkowe + accuracy CURRENT vs NEW + sweep
   ════════════════════════════════════════════════════════════════════════════ */
import fs from "fs";

const ORDER = ["static", "low", "medium", "high"];
const tierIdx = (t) => ORDER.indexOf(t);

/* ── Regexy GPU (NOWE) ── */
const SOFTWARE_RX = /swiftshader|llvmpipe|software|microsoft basic|paravirtual|virtualbox|vmware/i;
const APPLE_GPU_RX = /apple gpu|apple m\d|angle \(apple/i;
// STRONG → high: RTX, Radeon RX, GTX, Arc + AMD 680M/780M (RDNA2/3, klasa dGPU).
const STRONG_GPU_RX = /(rtx|radeon rx|geforce gtx|arc a[3-9]\d\d|quadro|titan|\brx [4-9]\d{2,3}\b|\brx \d{4}\b|radeon \d{3}m)/i;
// Dolna półka dyskretnych (GTX 9/10/16xx, RX 4xx/5xx): high ≤1080p, ale 1440p+ (w*dpr≥2400) → medium.
const ENTRY_DISCRETE_RX = /gtx (9|10|16)\d\d|\brx [45]\d\d\b/i;
// WEAK → low: Intel HD/UHD 5xx-6xx, Iris Plus/Pro/stare Iris (1.1 TFLOPS), niskie Adreno/Mali.
// UHD 7xx WYKLUCZONE (lookahead → medium). Iris Xe NIE pasuje (osobno w MID).
const WEAK_GPU_RX =
  /\b(u)?hd graphics\b(?! 7\d\d)|iris (plus|pro|graphics)|gma|ironlake|sandybridge|ivybridge|mali-(4\d\d|t[0-9]|g3\d|g5[127])|adreno \(tm\) ([234]\d\d|5[01]\d|6[0-3]\d)|adreno ([23])\d\d|powervr|videocore|tegra/i;
// MID → medium: Iris Xe, AMD APU (Radeon(TM) Graphics / Vega), Intel UHD 7xx, słabe dGPU NVIDIA (MX/GT).
const IRIS_MED_RX =
  /iris xe|radeon(\(tm\))? graphics|\bvega\b|uhd graphics 7\d\d|geforce mx\d|geforce gt[\s\d]/i;

/* ── OBECNA logika (lustro detectTier sprzed kalibracji) ── */
const OLD_WEAK_RX =
  /(intel).*(hd graphics (3000|4000|2500|4400|4600|5000|5500|530)|gma|ironlake|sandybridge|ivybridge)|mali-4|mali-t6|mali-t7|adreno \(tm\) (2|3)|adreno (2|3)\d\d|powervr (sgx|g6)|videocore|tegra/i;
function classifyCurrent(r) {
  const renderer = r.renderer || "";
  const software = r.software || SOFTWARE_RX.test(renderer);
  const weakGpu = !software && OLD_WEAK_RX.test(renderer);
  if (!r.glOk || software) return "static";
  if (r.reducedData || r.saveData) return "static";
  if (r.eff === "2g" || r.eff === "slow-2g") return "static";
  const mem = r.mem;
  if (r.cores <= 2 && (mem == null || mem <= 2)) return "static";
  let lvl = 3;
  const cap = (n) => { if (n < lvl) lvl = n; };
  if (weakGpu) cap(1);
  if (r.cores <= 4) cap(1);
  else if (r.cores <= 6) cap(2);
  if (mem != null) { if (mem <= 3) cap(1); else if (mem <= 4) cap(2); }
  if (r.eff === "3g") cap(1);
  if (r.coarse) { if (r.width < 768) cap(1); else if (r.width < 1024) cap(2); }
  if (!r.coarse && r.dpr >= 2 && r.cores <= 8) cap(2);
  if (!r.coarse && r.width * r.dpr >= 3000 && r.cores <= 8) cap(2);
  return ORDER[Math.max(1, lvl)];
}

/* ── NOWA logika (kalibrowana, platform-aware) ── */
function classifyNew(r) {
  // Strip „(R)" (znacznik ®) — realne stringi to „Intel(R) Iris(R) Xe Graphics",
  // przez co `iris xe` nie pasowało. „(TM)" zostawiamy (obsłużone jawnie w regexach).
  const renderer = (r.renderer || "").replace(/\(r\)/gi, "");
  const isIOS = r.isIPhone || r.isIPad;
  const software = r.software || SOFTWARE_RX.test(renderer);
  const isAppleGPU = APPLE_GPU_RX.test(renderer);
  const readable = renderer.trim().length > 3 && !isAppleGPU;
  const memKnown = r.mem != null;
  const coresTrusted = !r.isBrave && !isIOS && !(r.isFirefox && r.cores === 2);

  // 1. STATIC
  if (!r.glOk || software) return "static";
  if (r.reducedData || r.saveData) return "static";
  if (r.eff === "2g" || r.eff === "slow-2g") return "static";
  if (coresTrusted && r.cores <= 2 && memKnown && r.mem <= 2) return "static";

  // 2. iOS / iPadOS (cores zignorowane — clamp 2)
  if (r.isIPhone) return "low";
  if (r.isIPad) return "medium";

  // 3. Apple desktop (Mac). Apple Silicon raportuje cores=8 (M1+) → high.
  //    Stary Intel MacBook Air (Iris Plus + Retina) raportuje cores≤4 (dual-core)
  //    i też „Apple GPU" w Safari → słaby fill-rate na Retinie → low.
  if (!r.coarse && isAppleGPU) return r.cores <= 4 ? "low" : "high";

  // 4. Mocne dGPU → high NAWET przy coarse (dotykowy laptop). Dolna półka (GTX
  //    9/10/16xx, RX 4xx/5xx) na 1440p+ (w*dpr≥2400) → medium (fill-rate pada).
  if (readable && STRONG_GPU_RX.test(renderer)) {
    if (ENTRY_DISCRETE_RX.test(renderer) && r.width * r.dpr >= 2400) return "medium";
    return "high";
  }

  // 5. Brave / maskowane desktop — cores=szum, nie karać
  if (!r.coarse && !coresTrusted) {
    if (readable && WEAK_GPU_RX.test(renderer)) return "low";
    if (readable && IRIS_MED_RX.test(renderer)) return "medium";
    return "medium"; // start bezpieczny, arbiter = watchdog/override
  }

  // 6. Ogólne schodzenie (cores zaufane LUB mobile coarse)
  let lvl = 3;
  const cap = (n) => { if (n < lvl) lvl = n; };
  if (readable) {
    if (WEAK_GPU_RX.test(renderer)) cap(1);
    else if (IRIS_MED_RX.test(renderer)) cap(2);
  }
  if (coresTrusted) { if (r.cores <= 4) cap(1); else if (r.cores <= 6) cap(2); }
  if (memKnown) { if (r.mem <= 3) cap(1); else if (r.mem <= 4) cap(2); }
  if (r.eff === "3g") cap(1);
  if (r.coarse) { if (r.width < 768) cap(1); else cap(2); }
  if (!r.coarse && r.dpr >= 2 && coresTrusted && r.cores <= 4 && !isAppleGPU) cap(2);
  if (!r.coarse && r.width * r.dpr >= 3000 && coresTrusted && r.cores <= 6 && !isAppleGPU) cap(2);
  return ORDER[Math.max(1, lvl)];
}

/* ── Reading helper ── */
const R = (o) => ({
  glOk: true, software: false, reducedData: false, saveData: false, eff: "4g",
  cores: 8, mem: null, dpr: 1, width: 1366, coarse: false, renderer: "",
  isIPhone: false, isIPad: false, isBrave: false, isFirefox: false, ...o,
});

/* ── 41 PRZYPADKÓW TESTOWYCH (z krytyka kalibracji) ── */
const CASES = [
  ["T1 brak WebGL", "static", R({ glOk: false })],
  ["T2 software", "static", R({ renderer: "Google SwiftShader" })],
  ["T3 saveData", "static", R({ saveData: true })],
  ["T4 eff 2g", "static", R({ eff: "2g" })],
  ["T5 Celeron N4020 2C/2GB", "static", R({ cores: 2, mem: 2, dpr: 1, width: 1366, renderer: "ANGLE (Intel, Intel(R) UHD Graphics 600 ...)" })],
  ["T6 iPhone (cores2,mem-1)", "low", R({ cores: 2, mem: null, dpr: 2, width: 393, coarse: true, renderer: "Apple GPU", isIPhone: true })],
  ["T7 Brave strong PC farble cores2", "medium", R({ cores: 2, mem: null, dpr: 1, width: 2560, isBrave: true, renderer: "" })],
  ["T8 iPhone16Pro", "low", R({ cores: 2, mem: null, dpr: 3, width: 393, coarse: true, renderer: "Apple GPU", isIPhone: true })],
  ["T9 iPhoneSE2022", "low", R({ cores: 2, mem: null, dpr: 2, width: 375, coarse: true, renderer: "Apple GPU", isIPhone: true })],
  ["T10 iPadPro M4", "medium", R({ cores: 2, mem: null, dpr: 2, width: 1024, coarse: true, renderer: "Apple GPU", isIPad: true })],
  ["T11 iPad10 A14", "medium", R({ cores: 2, mem: null, dpr: 2, width: 820, coarse: true, renderer: "Apple GPU", isIPad: true })],
  ["T12 iPadmini A15", ["medium", "low"], R({ cores: 2, mem: null, dpr: 2, width: 744, coarse: true, renderer: "Apple GPU", isIPad: true })],
  ["T13 MBA M1 Safari", "high", R({ cores: 8, mem: null, dpr: 2, width: 1280, renderer: "Apple GPU" })],
  ["T14 MBA M2 Chrome", "high", R({ cores: 8, mem: 8, dpr: 2, width: 1470, renderer: "ANGLE (Apple, ANGLE Metal Renderer: Apple M2)" })],
  ["T15 MBP M3Pro", "high", R({ cores: 12, mem: null, dpr: 2, width: 1512, renderer: "Apple GPU" })],
  ["T16 iMac M1 4K", "high", R({ cores: 8, mem: null, dpr: 2, width: 1920, renderer: "Apple GPU" })],
  ["T17 RTX3060", "high", R({ cores: 12, mem: 8, dpr: 1, width: 1920, renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060 Direct3D11)" })],
  ["T18 i7+RTX3050", "high", R({ cores: 16, mem: 8, dpr: 1.5, width: 1280, renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3050)" })],
  ["T19 i5-8250U UHD620", "low", R({ cores: 8, mem: 8, dpr: 1, width: 1536, renderer: "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11)" })],
  ["T20 i5-6200U HD520 FF masked", "low", R({ cores: 4, mem: null, dpr: 1, width: 1366, isFirefox: true, renderer: "" })],
  ["T21 i3 HD4400", "low", R({ cores: 4, mem: 4, dpr: 1, width: 1366, renderer: "ANGLE (Intel, Intel(R) HD Graphics 4400)" })],
  ["T22 Iris Xe", "medium", R({ cores: 8, mem: 8, dpr: 1.5, width: 1280, renderer: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics)" })],
  ["T23 Vega7 5500U", ["high", "medium"], R({ cores: 12, mem: 8, dpr: 1, width: 1536, renderer: "ANGLE (AMD, AMD Radeon(TM) Graphics)" })],
  ["T24 4K GTX1650", ["medium", "high"], R({ cores: 8, mem: 8, dpr: 1, width: 3840, renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1650)" })],
  ["T25 Chromebook N4020 UHD600", "low", R({ cores: 2, mem: 4, dpr: 1, width: 1366, renderer: "ANGLE (Intel, Intel(R) UHD Graphics 600)" })],
  ["T26 Chromebook Mali-G52", "low", R({ cores: 8, mem: 4, dpr: 1.6, width: 1366, renderer: "Mali-G52" })],
  ["T27 Brave RTX4070 readable cores4", "high", R({ cores: 4, mem: null, dpr: 1, width: 2560, isBrave: true, renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4070)" })],
  ["T28 Brave RTX4070 masked cores2", "medium", R({ cores: 2, mem: null, dpr: 1, width: 2560, isBrave: true, renderer: "" })],
  // T29 override = poza classify (priorytet w readOverride)
  ["T30 GalaxyS24 Adreno750", "low", R({ cores: 8, mem: 8, dpr: 3, width: 360, coarse: true, renderer: "Adreno (TM) 750" })],
  ["T31 GalaxyA14 Mali-G52", "low", R({ cores: 8, mem: 4, dpr: 2.75, width: 360, coarse: true, renderer: "Mali-G52" })],
  ["T32 RedmiN13 Adreno610", "low", R({ cores: 8, mem: 4, dpr: 2.75, width: 393, coarse: true, renderer: "Adreno (TM) 610" })],
  ["T33 Pixel8 TensorG3", "low", R({ cores: 9, mem: 8, dpr: 2.625, width: 412, coarse: true, renderer: "Mali-G715" })],
  ["T34 Android saveData", "static", R({ cores: 8, mem: 2, dpr: 1.5, width: 360, coarse: true, saveData: true })],
  ["T35 Android Firefox", "low", R({ cores: 8, mem: null, dpr: 2.75, width: 393, coarse: true, isFirefox: true, renderer: "" })],
  ["T36 Android FF+RFP cores2", "low", R({ cores: 2, mem: null, dpr: 2.75, width: 393, coarse: true, isFirefox: true, renderer: "" })],
  ["T37 TabS9 Adreno740", "medium", R({ cores: 8, mem: 8, dpr: 2, width: 800, coarse: true, renderer: "Adreno (TM) 740" })],
  ["T38 TabA9+ Adreno619", "low", R({ cores: 8, mem: 4, dpr: 2, width: 800, coarse: true, renderer: "Adreno (TM) 619" })],
  ["T39 FireHD10 Mali-G52", "low", R({ cores: 8, mem: 4, dpr: 1.5, width: 800, coarse: true, renderer: "Mali-G52" })],
  ["T40 LenovoP12 Mali-G68", "medium", R({ cores: 8, mem: 8, dpr: 2, width: 960, coarse: true, renderer: "Mali-G68" })],
  ["T41 Surface mysz Iris Xe", "medium", R({ cores: 8, mem: 8, dpr: 1.5, width: 1368, coarse: false, renderer: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics)" })],
  // Realny przypadek (Natan): laptop DOTYKOWY z RTX w Brave → coarse=true zbijało do medium.
  ["T42 Laptop dotykowy RTX5060 Brave (coarse)", "high", R({ cores: 23, mem: null, dpr: 1.5, width: 1536, coarse: true, isBrave: true, renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 5060 Laptop GPU (0x00002D59) Direct3D11)" })],
  ["T43 Laptop dotykowy RTX Chrome (coarse)", "high", R({ cores: 16, mem: 16, dpr: 1.5, width: 1920, coarse: true, renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4060 Laptop GPU)" })],
  // Szare strefy biurowe (z detect-gpu fps): Vega APU, MX/GT, UHD 7xx, stary Intel Mac.
  ["T44 Ryzen Vega7 APU (Radeon(TM) Graphics)", "medium", R({ cores: 12, mem: 8, dpr: 1, width: 1920, renderer: "ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11)" })],
  ["T45 GeForce MX150 (słaba dGPU)", "medium", R({ cores: 8, mem: 8, dpr: 1, width: 1920, renderer: "ANGLE (NVIDIA, NVIDIA GeForce MX150 Direct3D11)" })],
  ["T46 Intel UHD 770 (nowszy biurowy)", "medium", R({ cores: 12, mem: 16, dpr: 1, width: 1920, renderer: "ANGLE (Intel, Intel(R) UHD Graphics 770 Direct3D11)" })],
  ["T47 UHD 620 (stary biurowy) NIE-medium", "low", R({ cores: 8, mem: 8, dpr: 1, width: 1920, renderer: "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11)" })],
  ["T48 Stary Intel MacBook Air Safari (cores4)", "low", R({ cores: 4, mem: null, dpr: 2, width: 1440, renderer: "Apple GPU" })],
  // Gradacja rozdzielczości dGPU + korekty (z workflow detect-gpu):
  ["T49 GTX1650 @1080p", "high", R({ cores: 8, mem: 8, dpr: 1, width: 1920, renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11)" })],
  ["T50 GTX1650 @1440p", "medium", R({ cores: 8, mem: 8, dpr: 1, width: 2560, renderer: "ANGLE (NVIDIA, NVIDIA GeForce GTX 1650 Direct3D11)" })],
  ["T51 RTX4090 @4K (zawsze high)", "high", R({ cores: 24, mem: 32, dpr: 1, width: 3840, renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 4090 Direct3D11)" })],
  ["T52 RX580 @4K (entry → medium)", "medium", R({ cores: 8, mem: 8, dpr: 1, width: 3840, renderer: "ANGLE (AMD, AMD Radeon RX 580 Direct3D11)" })],
  ["T53 RX6600 @1440p (mocna → high)", "high", R({ cores: 12, mem: 16, dpr: 1, width: 2560, renderer: "ANGLE (AMD, AMD Radeon RX 6600 Direct3D11)" })],
  ["T54 Iris Plus G7 → low", "low", R({ cores: 8, mem: 8, dpr: 1, width: 1920, renderer: "ANGLE (Intel, Intel(R) Iris(R) Plus Graphics)" })],
  ["T55 Radeon 680M → high", "high", R({ cores: 16, mem: 16, dpr: 1, width: 1920, renderer: "ANGLE (AMD, AMD Radeon 680M Direct3D11)" })],
];

function runCases(classify, label) {
  let pass = 0;
  const fails = [];
  for (const [name, exp, r] of CASES) {
    const got = classify(r);
    const ok = Array.isArray(exp) ? exp.includes(got) : got === exp;
    if (ok) pass++;
    else fails.push(`   ✗ ${name}: oczekiwany ${Array.isArray(exp) ? exp.join("|") : exp}, dostał ${got}`);
  }
  console.log(`\n=== TESTY JEDNOSTKOWE (${label}): ${pass}/${CASES.length} ===`);
  fails.forEach((f) => console.log(f));
  return { pass, total: CASES.length, fails };
}

/* ── Modele maskowania przeglądarek (z researchu) → realne READING ── */
function applyBrowser(browser, dev) {
  const t = dev.t;
  const os = t.os || dev.os || "";
  const r = R({
    cores: t.cores, mem: t.mem, dpr: t.dpr, width: t.width, coarse: t.coarse,
    eff: t.eff || "4g", glOk: true, software: !!t.software, renderer: t.gpu || "",
  });
  // iOS/iPadOS = ZAWSZE WebKit (Safari, Chrome-iOS, Brave-iOS) → te same limity:
  // cores clamp 2, brak deviceMemory/connection, renderer "Apple GPU". Niezależnie
  // od tagu przeglądarki (extract czasem myli iOS-Safari z chrome).
  const isiOS = /ios|ipad/i.test(os);
  if (isiOS) {
    r.mem = null; r.eff = null; r.cores = 2; r.renderer = "Apple GPU";
    r.isIPhone = dev.klasa === "phone";
    r.isIPad = dev.klasa === "tablet";
    return r;
  }
  if (browser === "safari") {
    // macOS Safari maskuje WSZYSTKIE Maki (Intel i Apple Silicon) do generycznego
    // „Apple GPU"; cores clamp 8. Stąd Intel Mac nieodróżnialny od M-series po GPU —
    // jedynym sygnałem słabości jest cores≤4 (stary dual-core Intel Air).
    r.mem = null; r.eff = null; r.saveData = false; r.cores = Math.min(t.cores, 8);
    r.renderer = "Apple GPU";
  } else if (browser === "firefox") {
    r.mem = null; r.eff = null; r.cores = Math.min(t.cores, 16); r.isFirefox = true; r.renderer = "";
  } else if (browser === "brave") {
    r.isBrave = true; r.cores = 4; r.mem = null; r.renderer = t.gpu || ""; // Standard: renderer realny
  }
  // chrome/edge/samsung: realne
  return r;
}

// Jawne rozstrzygnięcia krytyka kalibracji (niespójności bazy badawczej):
// iPhone=low (nie static), iPad/iPad Pro=medium (nie high/low — cel operacyjny,
// nie aspiracyjny: iOS clamp + fill-rate 2× Retina + watchdog tylko schodzi).
function adjudicate(dev) {
  const os = dev.t.os || dev.os || "";
  if (/ios|ipad/i.test(os)) return dev.klasa === "tablet" ? "medium" : "low";
  return dev.expected;
}
function evalDevices(classify, devices, label) {
  let ok = 0;
  const misses = [];
  for (const d of devices) {
    const reading = applyBrowser(d.browser, d);
    const got = classify(reading);
    const exp = adjudicate(d);
    if (got === exp) ok++;
    else misses.push({ name: d.name, browser: d.browser, expected: exp, got, diff: tierIdx(got) - tierIdx(exp) });
  }
  const pct = ((ok / devices.length) * 100).toFixed(1);
  console.log(`\n=== BAZA URZĄDZEŃ (${label}): ${ok}/${devices.length} (${pct}%) ===`);
  for (const m of misses) console.log(`   ✗ ${m.name} [${m.browser}]: oczek. ${m.expected}, dostał ${m.got} (${m.diff > 0 ? "ZA WYSOKO" : "ZA NISKO"})`);
  return { ok, total: devices.length, pct: +pct, misses };
}

function sweep(classify, label) {
  const coresA = [2, 4, 6, 8, 12, 16, 24];
  const memA = [null, 2, 3, 4, 8];
  const dprA = [1, 1.5, 2, 3];
  const widthA = [360, 414, 768, 820, 1024, 1366, 1920, 2560, 3440];
  const coarseA = [true, false];
  const dist = { static: 0, low: 0, medium: 0, high: 0 };
  let n = 0;
  for (const cores of coresA) for (const mem of memA) for (const dpr of dprA) for (const width of widthA) for (const coarse of coarseA) {
    dist[classify(R({ cores, mem, dpr, width, coarse, renderer: "ANGLE (NVIDIA, NVIDIA GeForce RTX 3060)" }))]++; n++;
  }
  console.log(`\n=== SWEEP (${label}, ${n} kombinacji, GPU=RTX/Chrome) ===`);
  for (const t of ORDER) console.log(`   ${t.padEnd(7)}: ${((dist[t] / n) * 100).toFixed(1)}%`);
}

/* ── main ── */
/* ── 20 URZĄDZEŃ BIUROWYCH/BIZNESOWYCH PL (target kodastrony.pl: właściciele
   firm na sprzęcie niższej-średniej klasy). Oczekiwane tiery skalibrowane realnymi
   fps z detect-gpu. Renderer = string ANGLE jaki realnie zwraca Chrome/Edge. ── */
const OFFICE_DEVICES = [
  // Laptopy biurowe Intel (rdzeń ruchu B2B)
  { name: "Dell Latitude 5490 i5-8250U UHD620", klasa: "laptop", os: "Windows", browser: "chrome", expected: "low", t: { cores: 8, mem: 8, dpr: 1, width: 1366, coarse: false, gpu: "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "Lenovo ThinkPad i5-10210U UHD", klasa: "laptop", os: "Windows", browser: "chrome", expected: "low", t: { cores: 8, mem: 8, dpr: 1, width: 1920, coarse: false, gpu: "ANGLE (Intel, Intel(R) UHD Graphics Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "HP ProBook i5-1135G7 Iris Xe", klasa: "laptop", os: "Windows", browser: "edge", expected: "medium", t: { cores: 8, mem: 16, dpr: 1.25, width: 1920, coarse: false, gpu: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "Dell Latitude i7-1165G7 Iris Xe", klasa: "laptop", os: "Windows", browser: "chrome", expected: "medium", t: { cores: 8, mem: 16, dpr: 1, width: 1920, coarse: false, gpu: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "HP EliteBook i5-8350U UHD620 HiDPI", klasa: "laptop", os: "Windows", browser: "chrome", expected: "low", t: { cores: 8, mem: 8, dpr: 1.5, width: 1920, coarse: false, gpu: "ANGLE (Intel, Intel(R) UHD Graphics 620 Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "ThinkPad i5-6300U HD520 (Firefox)", klasa: "laptop", os: "Windows", browser: "firefox", expected: "low", t: { cores: 4, mem: 8, dpr: 1, width: 1366, coarse: false, gpu: "ANGLE (Intel, Intel(R) HD Graphics 520)" } },
  { name: "Stary i3-7100U HD620 4GB", klasa: "laptop", os: "Windows", browser: "chrome", expected: "low", t: { cores: 4, mem: 4, dpr: 1, width: 1366, coarse: false, gpu: "ANGLE (Intel, Intel(R) HD Graphics 620 Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "Budżet Celeron N4020 UHD600 4GB", klasa: "laptop", os: "Windows", browser: "chrome", expected: "low", t: { cores: 2, mem: 4, dpr: 1, width: 1366, coarse: false, gpu: "ANGLE (Intel, Intel(R) UHD Graphics 600 Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "HP Ryzen5 5500U Vega7", klasa: "laptop", os: "Windows", browser: "chrome", expected: "medium", t: { cores: 12, mem: 8, dpr: 1, width: 1920, coarse: false, gpu: "ANGLE (AMD, AMD Radeon(TM) Graphics Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "2-in-1 dotykowy i5-1135G7 Iris Xe (coarse)", klasa: "laptop", os: "Windows", browser: "edge", expected: "medium", t: { cores: 8, mem: 8, dpr: 1.5, width: 1920, coarse: true, gpu: "ANGLE (Intel, Intel(R) Iris(R) Xe Graphics Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "Laptop i5-8250U + GeForce MX150", klasa: "laptop", os: "Windows", browser: "chrome", expected: "medium", t: { cores: 8, mem: 8, dpr: 1, width: 1920, coarse: false, gpu: "ANGLE (NVIDIA, NVIDIA GeForce MX150 Direct3D11 vs_5_0 ps_5_0)" } },
  // Desktopy biurowe (integrated)
  { name: "Desktop i5-7500 HD630", klasa: "desktop", os: "Windows", browser: "chrome", expected: "low", t: { cores: 4, mem: 8, dpr: 1, width: 1920, coarse: false, gpu: "ANGLE (Intel, Intel(R) HD Graphics 630 Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "Desktop i3-10100 UHD630", klasa: "desktop", os: "Windows", browser: "chrome", expected: "low", t: { cores: 8, mem: 8, dpr: 1, width: 1920, coarse: false, gpu: "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "Desktop i5-12400 UHD770 (nowszy biurowy)", klasa: "desktop", os: "Windows", browser: "chrome", expected: "medium", t: { cores: 12, mem: 16, dpr: 1, width: 1920, coarse: false, gpu: "ANGLE (Intel, Intel(R) UHD Graphics 770 Direct3D11 vs_5_0 ps_5_0)" } },
  { name: "Desktop i5-9500 UHD630 @1440p", klasa: "desktop", os: "Windows", browser: "edge", expected: "low", t: { cores: 6, mem: 16, dpr: 1, width: 2560, coarse: false, gpu: "ANGLE (Intel, Intel(R) UHD Graphics 630 Direct3D11 vs_5_0 ps_5_0)" } },
  // Telefony (właściciele firm)
  { name: "Samsung Galaxy S10 Mali-G76 (przegrzewa)", klasa: "phone", os: "Android", browser: "samsung", expected: "low", t: { cores: 8, mem: 8, dpr: 4, width: 360, coarse: true, gpu: "Mali-G76" } },
  { name: "Samsung Galaxy A54 Mali-G68", klasa: "phone", os: "Android", browser: "chrome", expected: "low", t: { cores: 8, mem: 8, dpr: 2.625, width: 360, coarse: true, gpu: "Mali-G68" } },
  { name: "Samsung Galaxy A14 Mali-G52 4GB", klasa: "phone", os: "Android", browser: "chrome", expected: "low", t: { cores: 8, mem: 4, dpr: 2.75, width: 360, coarse: true, gpu: "Mali-G52" } },
  { name: "iPhone 11 A13 (iOS Safari)", klasa: "phone", os: "iOS", browser: "safari", expected: "low", t: { cores: 6, mem: -1, dpr: 2, width: 414, coarse: true, gpu: "Apple GPU" } },
  { name: "iPhone SE 2020 A13 (iOS Safari)", klasa: "phone", os: "iOS", browser: "safari", expected: "low", t: { cores: 6, mem: -1, dpr: 2, width: 375, coarse: true, gpu: "Apple GPU" } },
  { name: "Stary Intel MacBook Air i5 IrisPlus (Safari)", klasa: "laptop", os: "macOS", browser: "safari", expected: "low", t: { cores: 4, mem: -1, dpr: 2, width: 1440, coarse: false, gpu: "Intel Iris Plus" } },
];

let devices = [];
try { devices = JSON.parse(fs.readFileSync("C:/Users/Natan/Desktop/Claude Coding/MAIN KODA/koda-site/scripts/devices.json", "utf8")); } catch { console.log("(brak devices.json — pomijam bazę)"); }

console.log("########## CURRENT (przed kalibracją) ##########");
runCases(classifyCurrent, "CURRENT");
if (devices.length) evalDevices(classifyCurrent, devices, "CURRENT");

console.log("\n########## NEW (po kalibracji) ##########");
runCases(classifyNew, "NEW");
if (devices.length) evalDevices(classifyNew, devices, "NEW");

console.log("\n########## OFFICE / BUSINESS PL (20 urządzeń) ##########");
evalDevices(classifyNew, OFFICE_DEVICES, "OFFICE-NEW");

sweep(classifyCurrent, "CURRENT");
sweep(classifyNew, "NEW");
