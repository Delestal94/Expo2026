import { describe, expect, it } from "vitest";
import { AGENDA_SLOTS } from "./agenda-data";

describe("AGENDA_SLOTS", () => {
  it("tiene ids únicos", () => {
    const ids = AGENDA_SLOTS.map((slot) => slot.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("cada horario empieza antes de terminar", () => {
    for (const slot of AGENDA_SLOTS) {
      expect(slot.startTime < slot.endTime).toBe(true);
    }
  });

  it("solo los slots sugeridos o confirmados tienen un segundo participante", () => {
    for (const slot of AGENDA_SLOTS) {
      if (slot.status === "disponible") {
        expect(slot.participantB).toBeUndefined();
      } else {
        expect(slot.participantB).toBeTruthy();
      }
    }
  });
});
