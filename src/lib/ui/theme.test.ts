import { afterEach, describe, expect, it, vi } from "vitest";
import {
  applyTheme,
  getCurrentTheme,
  getStoredTheme,
  setTheme,
  THEME_CHANGE_EVENT,
  THEME_INIT_SCRIPT,
} from "./theme";

describe("theme", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("getCurrentTheme() default es dark sin data-theme en <html>", () => {
    expect(getCurrentTheme()).toBe("dark");
  });

  it("applyTheme('light') agrega data-theme, applyTheme('dark') lo saca", () => {
    applyTheme("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(getCurrentTheme()).toBe("light");

    applyTheme("dark");
    expect(document.documentElement.hasAttribute("data-theme")).toBe(false);
    expect(getCurrentTheme()).toBe("dark");
  });

  it("setTheme() persiste en localStorage y dispara el evento de cambio", () => {
    const listener = vi.fn();
    window.addEventListener(THEME_CHANGE_EVENT, listener);

    setTheme("light");

    expect(getStoredTheme()).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(listener).toHaveBeenCalledTimes(1);
    expect((listener.mock.calls[0]![0] as CustomEvent).detail).toBe("light");

    window.removeEventListener(THEME_CHANGE_EVENT, listener);
  });

  it("getStoredTheme() devuelve null si no hay nada guardado o el valor es inválido", () => {
    expect(getStoredTheme()).toBeNull();
    localStorage.setItem("expojuy-theme", "algo-invalido");
    expect(getStoredTheme()).toBeNull();
  });

  it("THEME_INIT_SCRIPT respeta una preferencia guardada por sobre el SO", () => {
    // Regresión: el default pasó a seguir prefers-color-scheme del SO,
    // pero una preferencia explícita (localStorage) tiene que seguir
    // ganando — este test no ejecuta el script (jsdom no tiene
    // matchMedia real por default), solo verifica que el script generado
    // efectivamente chequea localStorage ANTES que matchMedia.
    const storedIndex = THEME_INIT_SCRIPT.indexOf("localStorage.getItem");
    const matchMediaIndex = THEME_INIT_SCRIPT.indexOf("matchMedia");
    expect(storedIndex).toBeGreaterThan(-1);
    expect(matchMediaIndex).toBeGreaterThan(-1);
    expect(storedIndex).toBeLessThan(matchMediaIndex);
  });
});
