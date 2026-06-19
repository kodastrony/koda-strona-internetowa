"use client";

import { useEffect } from "react";
import { startThemeAutoSync } from "@/lib/theme";

/* ══════════════════════════════════════════════════════════════════════════
   ThemeAutoSync — montowany RAZ w layout. Uruchamia automat motywu: przełącza
   na progu 07:00/20:00 i resynchronizuje po powrocie do karty (gdy zakładka
   była w tle/uśpiona przez próg). Nic nie renderuje.

   Logika żyje w lib/theme.ts (startThemeAutoSync) — tu tylko spięcie z cyklem
   życia Reacta (useEffect → cleanup). Wydzielone z theme.ts, by ten moduł nie
   mieszał eksportu komponentu z funkcjami używanymi poza drzewem Reacta.
   ══════════════════════════════════════════════════════════════════════════ */
export function ThemeAutoSync(): null {
  useEffect(() => startThemeAutoSync(), []);
  return null;
}
