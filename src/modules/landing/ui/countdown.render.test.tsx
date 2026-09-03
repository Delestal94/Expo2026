import { act, render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { Countdown } from "./countdown";

const EVENT_START = new Date("2026-10-09T09:00:00-03:00");

function renderCountdown() {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <Countdown />
    </NextIntlClientProvider>,
  );
}

describe("Countdown", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(
      new Date(EVENT_START.getTime() - (2 * 86_400_000 + 3 * 3_600_000 + 4 * 60_000 + 5_000)),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra los días como cifra visible y agrupa hs:min:seg en un resumen accesible", () => {
    renderCountdown();
    act(() => vi.advanceTimersByTime(0));

    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("días")).toBeInTheDocument();
    expect(screen.getByText("03 hs, 04 min y 05 seg")).toBeInTheDocument();
  });

  it("mantiene role=timer con aria-live apagado para no interrumpir al lector de pantalla cada segundo", () => {
    renderCountdown();
    act(() => vi.advanceTimersByTime(0));

    expect(screen.getByRole("timer")).toHaveAttribute("aria-live", "off");
  });
});
