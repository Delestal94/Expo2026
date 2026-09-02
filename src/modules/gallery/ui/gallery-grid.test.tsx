import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { GalleryGrid } from "./gallery-grid";

describe("GalleryGrid", () => {
  it("mueve el foco al botón de cerrar al abrir el lightbox", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" }));

    expect(screen.getByRole("button", { name: "Cerrar" })).toHaveFocus();
  });

  it("cierra el lightbox con Escape y devuelve el foco a la miniatura", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);
    const thumbnail = screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" });

    await user.click(thumbnail);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(thumbnail).toHaveFocus();
  });

  it("no deja escapar el foco del diálogo al tabular", async () => {
    const user = userEvent.setup();
    render(<GalleryGrid />);

    await user.click(screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" }));
    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    expect(closeButton).toHaveFocus();

    await user.tab();

    expect(closeButton).toHaveFocus();
  });
});
