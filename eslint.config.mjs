import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // React Three Fiber (silnik 3D hero — components/scene3d) — DWA odstępstwa:
  // 1. react/no-unknown-property: JSX scen (<mesh position/>, args, intensity)
  //    to propy reconcilera three, nie DOM-u — reguła ich nie zna.
  // 2. react-hooks/immutability: kanoniczny idiom R3F to mutowanie uniformów
  //    i obiektów three wewnątrz useFrame (pętla rAF POZA renderem Reacta —
  //    dokładnie ten sam wzorzec co MotionValue w PageCanvas), oraz mutowanie
  //    busa scena↔strona. Reguła widzi domknięcie nad wartością z render-scope
  //    i zgłasza fałszywy alarm dla tego imperatywnego pomostu WebGL.
  {
    files: ["src/components/scene3d/**/*.{ts,tsx}"],
    rules: {
      "react/no-unknown-property": "off",
      "react-hooks/immutability": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
