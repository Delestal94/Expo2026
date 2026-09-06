"use client";

import { useTranslations } from "next-intl";
import { setTheme, type Theme } from "@/lib/ui/theme";
import { useTheme } from "@/lib/ui/use-theme";

/**
 * Toggle manual de tema — no sigue `prefers-color-scheme` del sistema
 * operativo (decisión explícita: el equipo quería control directo, no
 * automático). El oscuro es el default de marca; el claro se activa a
 * mano y se recuerda en localStorage. `useTheme()` (useSyncExternalStore)
 * es lo que mantiene esto sincronizado con el <html> y con el toggle
 * disparado desde cualquier otro componente (ver Wordmark).
 */
export function ThemeToggle() {
  const t = useTranslations("Landing.ThemeToggle");
  const theme = useTheme();

  function toggle() {
    const next: Theme = theme === "light" ? "dark" : "light";
    setTheme(next);
  }

  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isLight}
      aria-label={isLight ? t("switchToDark") : t("switchToLight")}
      className="flex h-6 w-6 items-center justify-center rounded-full text-paper-dim transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {isLight ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m9-9h-1.5M4.5 12H3m15.36-6.36-1.06 1.06M6.7 17.3l-1.06 1.06m0-12.72 1.06 1.06M17.3 17.3l1.06 1.06M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-4 w-4" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
        </svg>
      )}
    </button>
  );
}
