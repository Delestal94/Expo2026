export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "expojuy-theme";
export const THEME_CHANGE_EVENT = "expojuy:themechange";

/**
 * Toggle manual, no automático por `prefers-color-scheme` (decisión
 * explícita del equipo). El oscuro es el default — no hace falta pedirle
 * nada al usuario para que el sitio se vea como siempre se vio; el claro
 * es un data-theme="light" agregado a mano en <html>.
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

export function setTheme(theme: Theme): void {
  applyTheme(theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // localStorage puede fallar (modo privado, cuota) — el toggle sigue
    // funcionando para la sesión actual, simplemente no persiste.
  }
  window.dispatchEvent(new CustomEvent<Theme>(THEME_CHANGE_EVENT, { detail: theme }));
}

export function getCurrentTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark";
}

/**
 * Script que se inyecta inline en <head> (ver layout.tsx) para aplicar el
 * tema guardado ANTES del primer paint — sin esto, la página siempre
 * renderiza oscuro primero y "parpadea" a claro un instante después de
 * hidratar, para cualquiera que haya elegido el tema claro.
 */
export const THEME_INIT_SCRIPT = `
try {
  var t = localStorage.getItem('${THEME_STORAGE_KEY}');
  if (t === 'light') document.documentElement.setAttribute('data-theme', 'light');
} catch (e) {}
`;
