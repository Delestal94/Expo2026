import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AgendaPreview } from "./agenda-preview";
import { AGENDA_SLOTS } from "./agenda-data";

describe("AgendaPreview", () => {
  it("muestra un slot por cada entrada de la agenda de ejemplo", () => {
    render(<AgendaPreview />);

    expect(screen.getAllByRole("article")).toHaveLength(AGENDA_SLOTS.length);
    for (const name of new Set(AGENDA_SLOTS.map((slot) => slot.participantA))) {
      expect(screen.getAllByText(name, { exact: false }).length).toBeGreaterThan(0);
    }
  });

  it("marca el estado de cada slot", () => {
    render(<AgendaPreview />);

    expect(screen.getAllByText("Confirmado").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Sugerido").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Disponible").length).toBeGreaterThan(0);
  });
});
