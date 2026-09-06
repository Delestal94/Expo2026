"use client";

import { useSyncExternalStore } from "react";
import { applyTheme, getCurrentTheme, getStoredTheme, notifyThemeChange, THEME_CHANGE_EVENT, type Theme } from "./theme";

function subscribeToThemeChange(callback: () => void): () => void {
  window.addEventListener(THEME_CHANGE_EVENT, callback);

  // Sin preferencia explícita guardada (nadie tocó el toggle todavía), el
  // sitio sigue al SO en vivo — si cambian de oscuro a claro en los
  // ajustes del sistema con la pestaña abierta, el sitio los sigue.
  // Apenas se usa el toggle una vez, esto deja de aplicar (setTheme ya
  // dejó una preferencia guardada, que gana por sobre el SO).
  const media = window.matchMedia("(prefers-color-scheme: light)");
  function handleOSChange() {
    if (getStoredTheme() !== null) return;
    const next: Theme = media.matches ? "light" : "dark";
    applyTheme(next);
    notifyThemeChange(next);
  }
  media.addEventListener("change", handleOSChange);

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, callback);
    media.removeEventListener("change", handleOSChange);
  };
}

/**
 * Hook para leer el tema actual desde cualquier componente (Wordmark,
 * ThemeToggle) — `useSyncExternalStore` en vez de `useEffect` +
 * `setState`: el tema vive afuera de React (atributo del DOM +
 * localStorage), así que esto es exactamente el caso de uso que React
 * recomienda para "leer un store externo", no un efecto de sincronización
 * (que además dispara la regla de lint `react-hooks/set-state-in-effect`
 * al hacer setState directo en el cuerpo del efecto).
 *
 * Separado de theme.ts (que no lleva "use client") porque theme.ts lo
 * importa layout.tsx, un Server Component, solo para THEME_INIT_SCRIPT —
 * meter useSyncExternalStore ahí rompe ese import.
 */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeToThemeChange, getCurrentTheme, () => "dark");
}
