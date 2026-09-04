import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { ProgramSection } from "./program-section";
import { PROGRAM_DAYS } from "./program-data";

function renderProgramSection() {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <ProgramSection />
    </NextIntlClientProvider>,
  );
}

function dayName(dayKey: (typeof PROGRAM_DAYS)[number]["dayKey"]) {
  return esAR.BusinessRounds.Agenda.days[dayKey];
}

describe("ProgramSection", () => {
  it("muestra el primer día activo por defecto, con apertura marcada", () => {
    renderProgramSection();

    const firstDay = PROGRAM_DAYS[0]!;
    const tabName = new RegExp(`${dayName(firstDay.dayKey)} ${firstDay.dayNumber}`);
    expect(screen.getByRole("tab", { name: tabName })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(esAR.BusinessRounds.Program.morningContent)).toBeInTheDocument();
    expect(screen.getByText(esAR.BusinessRounds.Program.afternoonContent)).toBeInTheDocument();
  });

  it("cambia el día activo al elegir otro tab", async () => {
    const user = userEvent.setup();
    renderProgramSection();

    const lastDay = PROGRAM_DAYS[PROGRAM_DAYS.length - 1]!;
    const tabName = new RegExp(`${dayName(lastDay.dayKey)} ${lastDay.dayNumber}`);
    await user.click(screen.getByRole("tab", { name: tabName }));

    expect(screen.getByRole("tab", { name: tabName })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText(new RegExp(esAR.BusinessRounds.Program.highlightNote.cierre))).toBeInTheDocument();
  });

  it("el primer día es apertura y el último es cierre", () => {
    expect(PROGRAM_DAYS[0]!.highlight).toBe("apertura");
    expect(PROGRAM_DAYS[PROGRAM_DAYS.length - 1]!.highlight).toBe("cierre");
    for (const day of PROGRAM_DAYS.slice(1, -1)) {
      expect(day.highlight).toBeUndefined();
    }
  });
});
