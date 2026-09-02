import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Directory } from "./directory";
import { EJE_FILTERS, EXHIBITORS } from "./exhibitors-data";

describe("Directory", () => {
  it("muestra todos los expositores por defecto con 'Todos' activo", () => {
    render(<Directory />);

    expect(screen.getAllByRole("article")).toHaveLength(EXHIBITORS.length);
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
  });

  it("filtra los expositores por eje al hacer click en un filtro", async () => {
    const user = userEvent.setup();
    render(<Directory />);

    const mineria = EJE_FILTERS.find((eje) => eje.id === "mineria")!;
    const expected = EXHIBITORS.filter((e) => e.eje === "mineria");

    await user.click(screen.getByRole("button", { name: mineria.label }));

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(expected.length);
    for (const exhibitor of expected) {
      expect(screen.getByText(exhibitor.name)).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: mineria.label })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "false");
  });

  it("restaura la lista completa al volver a 'Todos' tras filtrar", async () => {
    const user = userEvent.setup();
    render(<Directory />);

    const comercio = EJE_FILTERS.find((eje) => eje.id === "comercio")!;
    await user.click(screen.getByRole("button", { name: comercio.label }));
    await user.click(screen.getByRole("button", { name: "Todos" }));

    expect(screen.getAllByRole("article")).toHaveLength(EXHIBITORS.length);
  });

  it("cada filtro de eje muestra únicamente los expositores de ese eje", async () => {
    const user = userEvent.setup();

    for (const eje of EJE_FILTERS) {
      const { unmount } = render(<Directory />);
      const expectedCount = EXHIBITORS.filter((e) => e.eje === eje.id).length;

      await user.click(screen.getByRole("button", { name: eje.label }));

      expect(screen.getAllByRole("article")).toHaveLength(expectedCount);
      unmount();
    }
  });
});
