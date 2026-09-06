import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { applyTheme, getStoredTheme, setTheme } from "./theme";
import { useTheme } from "./use-theme";

function mockMatchMedia(matchesLight: boolean) {
  const listeners: Array<(e: MediaQueryListEvent) => void> = [];
  const mql = {
    matches: matchesLight,
    media: "(prefers-color-scheme: light)",
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.push(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => {
      const i = listeners.indexOf(cb);
      if (i >= 0) listeners.splice(i, 1);
    },
  };
  window.matchMedia = () => mql as unknown as MediaQueryList;
  return {
    fireChange(nextMatches: boolean) {
      mql.matches = nextMatches;
      listeners.forEach((cb) => cb({ matches: nextMatches } as MediaQueryListEvent));
    },
  };
}

describe("useTheme", () => {
  afterEach(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.clear();
  });

  it("refleja setTheme() en vivo", () => {
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("dark");

    act(() => setTheme("light"));
    expect(result.current).toBe("light");
  });

  it("sin preferencia guardada, sigue un cambio de tema del SO en vivo", () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());
    expect(result.current).toBe("dark");

    act(() => media.fireChange(true));
    expect(result.current).toBe("light");
    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
  });

  it("con una preferencia guardada, IGNORA cambios del SO (gana la elección manual)", () => {
    const media = mockMatchMedia(false);
    applyTheme("dark");
    setTheme("dark"); // deja una preferencia explícita guardada
    expect(getStoredTheme()).toBe("dark");

    const { result } = renderHook(() => useTheme());
    act(() => media.fireChange(true));

    expect(result.current).toBe("dark");
  });
});
