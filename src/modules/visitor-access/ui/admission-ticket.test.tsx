import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AdmissionTicket } from "./admission-ticket";
import { admissionTicketCode } from "../ticket-code";

const session = {
  user: { id: "8f14e45f-ceea-467e-a2b0-1e3f2c9d7a11", email: "visitante@expojuy.test" },
  accessToken: "token",
};

describe("AdmissionTicket", () => {
  it("en modo pago no emite el QR y avisa que el ingreso todavía no está disponible", () => {
    render(<AdmissionTicket session={session} admissionMode="paid" />);

    expect(screen.queryByText(/ingreso gratuito/i)).not.toBeInTheDocument();
    expect(screen.getByText(/el ingreso de esta edición es\s*pago/i)).toBeInTheDocument();
  });

  it("en modo gratuito emite el QR con el código de admisión del visitante", () => {
    render(<AdmissionTicket session={session} admissionMode="free" />);

    const expectedCode = admissionTicketCode(session.user.id);
    expect(screen.getByText(expectedCode)).toBeInTheDocument();
    expect(screen.getByText(/ingreso gratuito/i)).toBeInTheDocument();
  });

  it("genera un código distinto para cada visitante", () => {
    const otherSession = {
      user: { id: "aa11bb22-cc33-dd44-ee55-ff6600112233", email: "otro@expojuy.test" },
      accessToken: "token",
    };

    const { unmount } = render(<AdmissionTicket session={session} admissionMode="free" />);
    unmount();
    render(<AdmissionTicket session={otherSession} admissionMode="free" />);

    expect(screen.getByText(admissionTicketCode(otherSession.user.id))).toBeInTheDocument();
    expect(admissionTicketCode(session.user.id)).not.toBe(admissionTicketCode(otherSession.user.id));
  });
});
