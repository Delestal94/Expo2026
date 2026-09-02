import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { SectionNav } from "./section-nav";

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}

function renderSectionNav() {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <SectionNav />
    </NextIntlClientProvider>,
  );
}

describe("SectionNav", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("enlaza cada sección núcleo con su ancla", () => {
    renderSectionNav();

    expect(screen.getByRole("link", { name: "Ejes" })).toHaveAttribute(
      "href",
      "#ejes",
    );
    expect(screen.getByRole("link", { name: "Mapa" })).toHaveAttribute(
      "href",
      "#mapa",
    );
    expect(screen.getByRole("link", { name: "Cómo llegar" })).toHaveAttribute(
      "href",
      "#llegar",
    );
    expect(screen.getByRole("link", { name: "Rondas" })).toHaveAttribute(
      "href",
      "#rondas",
    );
    expect(screen.getByRole("link", { name: "Acceso" })).toHaveAttribute(
      "href",
      "#acceso",
    );
  });

  it("se mantiene oculta hasta que el hero deja de estar a la vista", () => {
    renderSectionNav();

    expect(screen.getByRole("navigation")).toHaveClass("opacity-0");
  });
});
