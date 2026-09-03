import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProgramSection } from "./program-section";
import { PROGRAM_DAYS } from "./program-data";

describe("ProgramSection", () => {
  it("muestra el primer día activo por defecto, con apertura marcada", () => {
    render(<ProgramSection />);

    const firstDay = PROGRAM_DAYS[0]!;
    expect(screen.getByRole("tab", { name: new RegExp(firstDay.label) })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText(firstDay.morning)).toBeInTheDocument();
    expect(screen.getByText(firstDay.afternoon)).toBeInTheDocument();
  });

  it("cambia el contenido de mañana/tarde al elegir otro día", async () => {
    const user = userEvent.setup();
    render(<ProgramSection />);

    const lastDay = PROGRAM_DAYS[PROGRAM_DAYS.length - 1]!;
    await user.click(screen.getByRole("tab", { name: new RegExp(lastDay.label) }));

    expect(screen.getByRole("tab", { name: new RegExp(lastDay.label) })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByText(/día de cierre del evento/)).toBeInTheDocument();
  });

  it("cada día tiene una franja de mañana y una de tarde", () => {
    for (const day of PROGRAM_DAYS) {
      expect(day.morning.length).toBeGreaterThan(0);
      expect(day.afternoon.length).toBeGreaterThan(0);
    }
  });
});
