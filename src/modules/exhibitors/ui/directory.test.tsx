import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { Directory, INITIAL_VISIBLE_COUNT } from "./directory";
import { EJE_FILTERS, EXHIBITORS } from "./exhibitors-data";

function renderDirectory() {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <Directory />
    </NextIntlClientProvider>,
  );
}

function ejeLabel(id: (typeof EJE_FILTERS)[number]["id"]) {
  return esAR.Exhibitors.ejes[id];
}

function exhibitorText(id: string) {
  const item = esAR.Exhibitors.items[id as keyof typeof esAR.Exhibitors.items];
  return `${item.pitch} ${item.busca}`;
}

describe("Directory", () => {
  it("muestra solo los primeros perfiles por defecto con 'Todos' activo, y un botón para ver el resto", () => {
    renderDirectory();

    expect(screen.getAllByRole("article")).toHaveLength(INITIAL_VISIBLE_COUNT);
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
    expect(
      screen.getByRole("button", { name: `Ver los ${EXHIBITORS.length} perfiles +${EXHIBITORS.length - INITIAL_VISIBLE_COUNT}` }),
    ).toBeInTheDocument();
  });

  it("revela el resto de los expositores al hacer click en 'ver perfiles'", async () => {
    const user = userEvent.setup();
    renderDirectory();

    await user.click(
      screen.getByRole("button", {
        name: `Ver los ${EXHIBITORS.length} perfiles +${EXHIBITORS.length - INITIAL_VISIBLE_COUNT}`,
      }),
    );

    expect(screen.getAllByRole("article")).toHaveLength(EXHIBITORS.length);
    expect(screen.queryByRole("button", { name: /Ver los/ })).not.toBeInTheDocument();
  });

  it("filtra los expositores por eje al hacer click en un filtro", async () => {
    const user = userEvent.setup();
    renderDirectory();

    const mineria = EJE_FILTERS.find((eje) => eje.id === "mineria")!;
    const expected = EXHIBITORS.filter((e) => e.eje === "mineria");

    await user.click(screen.getByRole("button", { name: ejeLabel(mineria.id) }));

    const articles = screen.getAllByRole("article");
    expect(articles).toHaveLength(expected.length);
    for (const exhibitor of expected) {
      expect(screen.getByText(exhibitor.name)).toBeInTheDocument();
    }
    expect(screen.getByRole("button", { name: ejeLabel(mineria.id) })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "false");
  });

  it("colapsa de nuevo al volver a 'Todos' tras expandir y filtrar", async () => {
    const user = userEvent.setup();
    renderDirectory();

    await user.click(
      screen.getByRole("button", {
        name: `Ver los ${EXHIBITORS.length} perfiles +${EXHIBITORS.length - INITIAL_VISIBLE_COUNT}`,
      }),
    );
    expect(screen.getAllByRole("article")).toHaveLength(EXHIBITORS.length);

    const comercio = EJE_FILTERS.find((eje) => eje.id === "comercio")!;
    await user.click(screen.getByRole("button", { name: ejeLabel(comercio.id) }));
    await user.click(screen.getByRole("button", { name: "Todos" }));

    expect(screen.getAllByRole("article")).toHaveLength(INITIAL_VISIBLE_COUNT);
  });

  it("filtra por texto libre buscando en nombre, rubro y descripción", async () => {
    const user = userEvent.setup();
    renderDirectory();

    await user.type(screen.getByPlaceholderText(/Buscar por empresa/), "litio");

    const articles = screen.getAllByRole("article");
    const expected = EXHIBITORS.filter((e) =>
      `${e.name} ${ejeLabel(e.eje)} ${exhibitorText(e.id)}`.toLowerCase().includes("litio"),
    );
    expect(articles).toHaveLength(expected.length);
  });

  it("combina la búsqueda de texto con el filtro de eje activo", async () => {
    const user = userEvent.setup();
    renderDirectory();

    const mineria = EJE_FILTERS.find((eje) => eje.id === "mineria")!;
    await user.click(screen.getByRole("button", { name: ejeLabel(mineria.id) }));
    await user.type(screen.getByPlaceholderText(/Buscar por empresa/), "insumos");

    expect(screen.getAllByRole("article")).toHaveLength(1);
    expect(screen.getByText("Quebrada Litio Insumos")).toBeInTheDocument();
  });

  it("muestra un mensaje cuando la búsqueda no encuentra ningún expositor, con botón para borrarla", async () => {
    const user = userEvent.setup();
    renderDirectory();

    await user.type(screen.getByPlaceholderText(/Buscar por empresa/), "zzz-inexistente");

    expect(screen.queryAllByRole("article")).toHaveLength(0);
    expect(screen.getByText(/Ninguna veta coincide/)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Borrar búsqueda" }));

    expect(screen.getByPlaceholderText(/Buscar por empresa/)).toHaveValue("");
    expect(screen.getAllByRole("article")).toHaveLength(INITIAL_VISIBLE_COUNT);
  });

  it("nombra el eje activo en el mensaje vacío cuando la búsqueda se combina con un filtro", async () => {
    const user = userEvent.setup();
    renderDirectory();

    const mineria = EJE_FILTERS.find((eje) => eje.id === "mineria")!;
    await user.click(screen.getByRole("button", { name: ejeLabel(mineria.id) }));
    await user.type(screen.getByPlaceholderText(/Buscar por empresa/), "zzz-inexistente");

    expect(
      screen.getByText((_, element) =>
        element?.tagName === "P" &&
        (element.textContent ?? "").includes(`Ninguna veta de ${ejeLabel(mineria.id)} coincide`),
      ),
    ).toBeInTheDocument();
  });

  it("cada filtro de eje muestra únicamente los expositores de ese eje", async () => {
    const user = userEvent.setup();

    for (const eje of EJE_FILTERS) {
      const { unmount } = renderDirectory();
      const expectedCount = EXHIBITORS.filter((e) => e.eje === eje.id).length;

      await user.click(screen.getByRole("button", { name: ejeLabel(eje.id) }));

      expect(screen.getAllByRole("article")).toHaveLength(expectedCount);
      unmount();
    }
  });
});
