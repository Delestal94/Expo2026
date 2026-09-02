import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { VenueMap } from "./venue-map";

beforeEach(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
});

describe("VenueMap", () => {
  it("activa el primer pabellón por defecto", () => {
    render(<VenueMap />);

    expect(screen.getByRole("heading", { level: 3, name: "Pabellón Minería y Litio" })).toBeInTheDocument();
  });

  it("cambia el panel de detalle al hacer click en otra zona", async () => {
    const user = userEvent.setup();
    render(<VenueMap />);

    await user.click(screen.getByRole("button", { name: "Sala de Ronda de Negocios A" }));

    expect(screen.getByRole("heading", { level: 3, name: "Sala de Ronda de Negocios A" })).toBeInTheDocument();
    expect(screen.getByText(/en ronda de negocios ahora/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sala de Ronda de Negocios A" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("ignora teclas que no son Enter o espacio", () => {
    render(<VenueMap />);
    const otherZone = screen.getByRole("button", { name: "Sala de Ronda de Negocios B" });

    fireEvent.keyDown(otherZone, { key: "a" });

    expect(screen.getByRole("heading", { level: 3, name: "Pabellón Minería y Litio" })).toBeInTheDocument();
  });

  it("activa una zona con Enter desde el teclado", () => {
    render(<VenueMap />);
    const otherZone = screen.getByRole("button", { name: "Sala de Ronda de Negocios B" });

    fireEvent.keyDown(otherZone, { key: "Enter" });

    expect(screen.getByRole("heading", { level: 3, name: "Sala de Ronda de Negocios B" })).toBeInTheDocument();
    expect(screen.getByText(/disponible\./)).toBeInTheDocument();
  });
});
