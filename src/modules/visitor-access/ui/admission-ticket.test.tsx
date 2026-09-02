import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, it } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { AdmissionTicket } from "./admission-ticket";
import { admissionTicketCode } from "../ticket-code";

const session = {
  user: { id: "8f14e45f-ceea-467e-a2b0-1e3f2c9d7a11", email: "visitante@expojuy.test" },
  accessToken: "token",
};

function renderAdmissionTicket(props: Parameters<typeof AdmissionTicket>[0]) {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <AdmissionTicket {...props} />
    </NextIntlClientProvider>,
  );
}

describe("AdmissionTicket", () => {
  it("en modo pago no emite el QR y avisa que el ingreso todavía no está disponible", () => {
    renderAdmissionTicket({ session, admissionMode: "paid" });

    expect(screen.queryByText(/ingreso gratuito/i)).not.toBeInTheDocument();
    expect(screen.getByText(/el ingreso de esta edición es\s*pago/i)).toBeInTheDocument();
  });

  it("en modo gratuito emite el QR con el código de admisión del visitante", () => {
    renderAdmissionTicket({ session, admissionMode: "free" });

    const expectedCode = admissionTicketCode(session.user.id);
    expect(screen.getByText(expectedCode)).toBeInTheDocument();
    expect(screen.getByText(/ingreso gratuito/i)).toBeInTheDocument();
  });

  it("genera un código distinto para cada visitante", () => {
    const otherSession = {
      user: { id: "aa11bb22-cc33-dd44-ee55-ff6600112233", email: "otro@expojuy.test" },
      accessToken: "token",
    };

    const { unmount } = renderAdmissionTicket({ session, admissionMode: "free" });
    unmount();
    renderAdmissionTicket({ session: otherSession, admissionMode: "free" });

    expect(screen.getByText(admissionTicketCode(otherSession.user.id))).toBeInTheDocument();
    expect(admissionTicketCode(session.user.id)).not.toBe(admissionTicketCode(otherSession.user.id));
  });
});
