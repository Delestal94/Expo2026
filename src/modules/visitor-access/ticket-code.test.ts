import { describe, expect, it, vi } from "vitest";

// `signTicketCode` lee `env.TICKET_SIGNING_SECRET` (server-only para
// t3-env) — se mockea acá para poder llamarlo desde este test bajo jsdom,
// que t3-env detecta como entorno de cliente.
vi.mock("@/lib/config/env", () => ({
  env: { TICKET_SIGNING_SECRET: undefined },
}));

const { signTicketCode } = await import("./ticket-code");

describe("signTicketCode", () => {
  it("arma un código con el prefijo del evento y 8 hex mayúsculas", () => {
    expect(signTicketCode("a1b2c3d4-e5f6-7890-abcd-ef1234567890")).toMatch(
      /^EXPOJUY26-[0-9A-F]{8}$/,
    );
  });

  it("es determinístico para el mismo id de usuario", () => {
    const userId = "11111111-2222-3333-4444-555555555555";
    expect(signTicketCode(userId)).toBe(signTicketCode(userId));
  });

  it("da códigos distintos para usuarios distintos", () => {
    expect(signTicketCode("aaaaaaaa-0000-0000-0000-000000000000")).not.toBe(
      signTicketCode("bbbbbbbb-0000-0000-0000-000000000000"),
    );
  });

  it("no es la simple trunca del UUID (issue #57: eso era forjable sin firma)", () => {
    const userId = "a1b2c3d4-e5f6-7890-abcd-ef1234567890";
    expect(signTicketCode(userId)).not.toBe("EXPOJUY26-A1B2C3D4");
  });
});
