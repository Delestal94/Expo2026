import { describe, expect, it } from "vitest";
import { admissionTicketCode } from "./ticket-code";

describe("admissionTicketCode", () => {
  it("arma un código legible con prefijo del evento", () => {
    expect(admissionTicketCode("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toBe("EXPOJUY26-A1B2C3D4");
  });

  it("es determinístico para el mismo id de usuario", () => {
    const userId = "11111111-2222-3333-4444-555555555555";
    expect(admissionTicketCode(userId)).toBe(admissionTicketCode(userId));
  });

  it("da códigos distintos para usuarios distintos", () => {
    expect(admissionTicketCode("aaaaaaaa-0000-0000-0000-000000000000")).not.toBe(
      admissionTicketCode("bbbbbbbb-0000-0000-0000-000000000000"),
    );
  });
});
