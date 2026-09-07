"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "@/lib/i18n/navigation";
import {
  applyTheme,
  getCurrentTheme,
  getResolvedTheme,
  notifyThemeChange,
} from "./theme";

// En Next.js 15 / React 19 en modo desarrollo, Next.js intercepta console.error
// para mostrar un modal bloqueante cuando detecta <script> durante renders de cliente
// (falso positivo al navegar entre rutas con scripts como JSON-LD o temas).
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      args[0].includes("Encountered a script tag while rendering React component")
    ) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
}

/**
  * Mantiene el tema sincronizado en el elemento <html> a través de navegaciones
  * de Next.js y cambios de idioma (locale switches).
  *
  * En Next.js App Router, cuando el usuario cambia de idioma (ej. /es-AR a /en),
  * Next.js reconcilia el elemento raíz <html> en el cliente. Dado que el Server
  * Component no incluye data-theme en su JSX estático, React elimina el atributo
  * data-theme="light" del DOM.
  *
  * ThemeSync previene esto ejecutando useLayoutEffect de forma síncrona antes del paint
  * en cada cambio de ruta, y manteniendo un MutationObserver de respaldo para restaurar
  * inmediatamente el tema activo si el DOM fue alterado.
  */
export function ThemeSync() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const active = getResolvedTheme();
    if (getCurrentTheme() !== active) {
      applyTheme(active);
      notifyThemeChange(active);
    }
  }, [pathname]);

  useLayoutEffect(() => {
    let isReconciling = false;
    const observer = new MutationObserver(() => {
      if (isReconciling) return;
      const active = getResolvedTheme();
      if (getCurrentTheme() !== active) {
        isReconciling = true;
        applyTheme(active);
        notifyThemeChange(active);
        isReconciling = false;
      }
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
