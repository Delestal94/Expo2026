import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTimeLeft } from "./countdown";

describe("getTimeLeft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("descompone el tiempo restante en días, horas, minutos y segundos", () => {
    vi.setSystemTime(new Date("2026-10-07T09:00:00-03:00")); // 2 días antes

    expect(getTimeLeft()).toEqual({ days: 2, hours: 0, minutes: 0, seconds: 0 });
  });

  it("calcula horas y minutos parciales correctamente", () => {
    vi.setSystemTime(new Date("2026-10-09T05:30:15-03:00")); // 3h29m45s antes

    expect(getTimeLeft()).toEqual({ days: 0, hours: 3, minutes: 29, seconds: 45 });
  });

  it("no devuelve valores negativos una vez que el evento ya empezó", () => {
    vi.setSystemTime(new Date("2026-10-09T12:00:00-03:00")); // 3hs después del inicio

    expect(getTimeLeft()).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });
});
