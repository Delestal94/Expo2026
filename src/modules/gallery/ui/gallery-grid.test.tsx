import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { GalleryGrid } from "./gallery-grid";

function renderGalleryGrid() {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <GalleryGrid />
    </NextIntlClientProvider>,
  );
}

describe("GalleryGrid", () => {
  it("mueve el foco al botón de cerrar al abrir el lightbox", async () => {
    const user = userEvent.setup();
    renderGalleryGrid();

    await user.click(screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" }));

    expect(screen.getByRole("button", { name: "Cerrar" })).toHaveFocus();
  });

  it("cierra el lightbox con Escape y devuelve el foco a la miniatura", async () => {
    const user = userEvent.setup();
    renderGalleryGrid();
    const thumbnail = screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" });

    await user.click(thumbnail);
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(thumbnail).toHaveFocus();
  });

  it("recorre los controles del diálogo con Tab y no deja escapar el foco", async () => {
    const user = userEvent.setup();
    renderGalleryGrid();

    await user.click(screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" }));
    const closeButton = screen.getByRole("button", { name: "Cerrar" });
    const prevButton = screen.getByRole("button", { name: "Foto anterior" });
    const nextButton = screen.getByRole("button", { name: "Foto siguiente" });
    expect(closeButton).toHaveFocus();

    await user.tab();
    expect(prevButton).toHaveFocus();

    await user.tab();
    expect(nextButton).toHaveFocus();

    await user.tab();
    expect(closeButton).toHaveFocus();

    await user.tab({ shift: true });
    expect(nextButton).toHaveFocus();
  });

  it("navega a la foto siguiente y anterior con las flechas del teclado", async () => {
    const user = userEvent.setup();
    renderGalleryGrid();

    await user.click(screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" }));
    expect(screen.getByRole("dialog", { name: "ExpoJuy 2024 — foto 1" })).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("dialog", { name: "ExpoJuy 2024 — foto 2" })).toBeInTheDocument();

    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("dialog", { name: "ExpoJuy 2024 — foto 1" })).toBeInTheDocument();

    // Da toda la vuelta hacia atrás: de la primera foto pasa a la última.
    await user.keyboard("{ArrowLeft}");
    expect(screen.getByRole("dialog", { name: "ExpoJuy 2024 — foto 30" })).toBeInTheDocument();
  });

  it("navega con los botones anterior/siguiente sin cerrar el diálogo", async () => {
    const user = userEvent.setup();
    renderGalleryGrid();

    await user.click(screen.getByRole("button", { name: "ExpoJuy 2024 — foto 1" }));

    await user.click(screen.getByRole("button", { name: "Foto siguiente" }));
    expect(screen.getByRole("dialog", { name: "ExpoJuy 2024 — foto 2" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Foto anterior" }));
    expect(screen.getByRole("dialog", { name: "ExpoJuy 2024 — foto 1" })).toBeInTheDocument();
  });
});
