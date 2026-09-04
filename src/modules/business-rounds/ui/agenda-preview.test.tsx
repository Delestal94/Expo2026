import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { AgendaPreview } from "./agenda-preview";
import { AGENDA_SLOTS } from "./agenda-data";

function renderAgendaPreview() {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <AgendaPreview />
    </NextIntlClientProvider>,
  );
}

describe("AgendaPreview", () => {
  it("muestra un slot por cada entrada de la agenda de ejemplo", () => {
    renderAgendaPreview();

    expect(screen.getAllByRole("article")).toHaveLength(AGENDA_SLOTS.length);
    for (const name of new Set(AGENDA_SLOTS.map((slot) => slot.participantA))) {
      expect(screen.getAllByText(name, { exact: false }).length).toBeGreaterThan(0);
    }
  });

  it("marca el estado de cada slot", () => {
    renderAgendaPreview();

    const { status } = esAR.BusinessRounds.Agenda;
    expect(screen.getAllByText(status.confirmado).length).toBeGreaterThan(0);
    expect(screen.getAllByText(status.sugerido).length).toBeGreaterThan(0);
    expect(screen.getAllByText(status.disponible).length).toBeGreaterThan(0);
  });
});
