export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "expojuy-theme";
export const THEME_CHANGE_EVENT = "expojuy:themechange";

/**
 * El default sigue el tema del sistema operativo (`prefers-color-scheme`)
 * la primera vez que alguien entra; el toggle manual, una vez usado,
 * guarda una preferencia explícita en localStorage que gana por sobre el
 * SO de ahí en más — hasta que se borre esa preferencia (no hay botón
 * para eso todavía, sería "volver a automático").
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
  return stored === "light" || stored === "dark" ? stored : null;
}

export function applyTheme(theme: Theme): void {
  if (typeof document === "undefined") return;
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}

/** Avisa a quien esté escuchando (Wordmark vía useTheme, StrataCanvas) que el tema cambió. */
export function notifyThemeChange(theme: Theme): void {
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}

export function setTheme(theme: Theme): void {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage puede fallar (modo privado, cuota) — el toggle sigue
    // funcionando para la sesión actual, simplemente no persiste.
  }
  notifyThemeChange(theme);
}

export function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * Script que se inyecta inline en <head> (ver layout.tsx) para aplicar el
 * tema correcto ANTES del primer paint — sin esto, la página siempre
 * renderiza oscuro primero y "parpadea" un instante después de hidratar,
 * tanto para quien eligió claro a mano como para quien tiene el SO en
 * claro y todavía no tocó el toggle.
 */
export const THEME_INIT_SCRIPT = `
try {
  var stored = localStorage.getItem('${THEME_STORAGE_KEY}');
  var wantsLight = stored ? stored === 'light' : matchMedia('(prefers-color-scheme: light)').matches;
  if (wantsLight) document.documentElement.setAttribute('data-theme', 'light');
} catch (e) {}
`;
