import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTimeLeft } from "./countdown";

const EVENT_START = new Date("2026-10-09T09:00:00-03:00");

describe("getTimeLeft", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("descompone el tiempo restante en días, horas, minutos y segundos", () => {
    vi.setSystemTime(new Date(EVENT_START.getTime() - (2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000)));

    expect(getTimeLeft()).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
  });

  it("devuelve todo en cero justo al inicio del evento", () => {
    vi.setSystemTime(EVENT_START);

    expect(getTimeLeft()).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("no devuelve valores negativos una vez pasado el inicio del evento", () => {
    vi.setSystemTime(new Date(EVENT_START.getTime() + 10 * 60_000));

    expect(getTimeLeft()).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  });

  it("no deja que las horas o minutos se desborden más allá de su unidad", () => {
    vi.setSystemTime(new Date(EVENT_START.getTime() - 90 * 60_000));

    expect(getTimeLeft()).toEqual({ days: 0, hours: 1, minutes: 30, seconds: 0 });
  });
});
