import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { VenueMap } from "./venue-map";

function renderVenueMap() {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <VenueMap />
    </NextIntlClientProvider>,
  );
}

/** Un stand cubierto cualquiera del plano, con su etiqueta accesible. */
const STAND_A01 = "A01 — Cubiertos";
const STAND_D28 = "D28 — Descubiertos";

describe("VenueMap", () => {
  it("arranca sin zona seleccionada y explica cómo recorrer el plano", () => {
    renderVenueMap();

    expect(screen.getByRole("heading", { level: 3, name: "Recorré el plano" })).toBeInTheDocument();
  });

  it("muestra el detalle del stand al hacer click", async () => {
    const user = userEvent.setup();
    renderVenueMap();

    await user.click(screen.getByRole("button", { name: STAND_D28 }));

    expect(screen.getByRole("heading", { level: 3, name: "D28" })).toBeInTheDocument();
    // D28 son 120 m² según el plano.
    expect(screen.getByText("120 m² de superficie")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: STAND_D28 })).toHaveAttribute("aria-pressed", "true");
  });

  it("activa un stand con Enter desde el teclado", () => {
    renderVenueMap();

    fireEvent.keyDown(screen.getByRole("button", { name: STAND_A01 }), { key: "Enter" });

    expect(screen.getByRole("heading", { level: 3, name: "A01" })).toBeInTheDocument();
  });

  it("ignora teclas que no son Enter o espacio", () => {
    renderVenueMap();

    fireEvent.keyDown(screen.getByRole("button", { name: STAND_A01 }), { key: "a" });

    expect(screen.getByRole("heading", { level: 3, name: "Recorré el plano" })).toBeInTheDocument();
  });

  it("el contexto del predio no es seleccionable: solo los stands", () => {
    renderVenueMap();

    // El pabellón se dibuja como referencia, pero no compite con los stands
    // por el foco ni por el click.
    expect(screen.queryByRole("button", { name: /Pabellón cubierto/ })).not.toBeInTheDocument();
  });

  it("filtra el plano por categoría de stand", async () => {
    const user = userEvent.setup();
    renderVenueMap();

    const artesanos = screen.getByRole("button", { name: /^Artesanos/ });
    await user.click(artesanos);

    expect(artesanos).toHaveAttribute("aria-pressed", "true");
    // Los stands de otra categoría quedan fuera del recorrido por teclado.
    expect(screen.getByRole("button", { name: STAND_A01 })).toHaveAttribute("tabindex", "-1");
  });
});
