import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";

// `signTicketCode` lee `env.TICKET_SIGNING_SECRET` (server-only para
// t3-env) — se mockea acá para poder llamarlo desde este test bajo jsdom,
// que t3-env detecta como entorno de cliente.
vi.mock("@/lib/config/env", () => ({
  env: { TICKET_SIGNING_SECRET: undefined },
}));

const { AdmissionTicket } = await import("./admission-ticket");
const { signTicketCode } = await import("../ticket-code");

const session = {
  user: { id: "8f14e45f-ceea-467e-a2b0-1e3f2c9d7a11", email: "visitante@expojuy.test" },
  accessToken: "token-visitante",
};

function renderAdmissionTicket(props: Parameters<typeof AdmissionTicket>[0]) {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <AdmissionTicket {...props} />
    </NextIntlClientProvider>,
  );
}

/**
 * El código ya no se calcula en el cliente (issue #57) — lo devuelve
 * `/api/ticket-code`, así que estos tests mockean `fetch` en vez de
 * llamar a `signTicketCode` directamente desde el componente.
 */
function mockTicketCodeApi(codeByToken: Record<string, string>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (_url: string, init?: RequestInit) => {
      const auth = (init?.headers as Record<string, string> | undefined)?.Authorization ?? "";
      const token = auth.replace("Bearer ", "");
      const code = codeByToken[token];
      if (!code) return new Response(null, { status: 401 });
      return new Response(JSON.stringify({ code }), { status: 200 });
    }),
  );
}

describe("AdmissionTicket", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("en modo pago no emite el QR y avisa que el ingreso todavía no está disponible", () => {
    renderAdmissionTicket({ session, admissionMode: "paid" });

    expect(screen.queryByText(/ingreso gratuito/i)).not.toBeInTheDocument();
    expect(screen.getByText(/el ingreso de esta edición es\s*pago/i)).toBeInTheDocument();
  });

  it("en modo gratuito pide el código firmado a /api/ticket-code y lo muestra", async () => {
    const code = signTicketCode(session.user.id);
    mockTicketCodeApi({ [session.accessToken]: code });

    renderAdmissionTicket({ session, admissionMode: "free" });

    expect(await screen.findByText(code)).toBeInTheDocument();
    expect(screen.getByText(/ingreso gratuito/i)).toBeInTheDocument();
  });

  it("genera un código distinto para cada visitante", async () => {
    const otherSession = {
      user: { id: "aa11bb22-cc33-dd44-ee55-ff6600112233", email: "otro@expojuy.test" },
      accessToken: "token-otro",
    };
    const codeA = signTicketCode(session.user.id);
    const codeB = signTicketCode(otherSession.user.id);
    expect(codeA).not.toBe(codeB);

    mockTicketCodeApi({ [session.accessToken]: codeA, [otherSession.accessToken]: codeB });

    const { unmount } = renderAdmissionTicket({ session, admissionMode: "free" });
    expect(await screen.findByText(codeA)).toBeInTheDocument();
    unmount();

    renderAdmissionTicket({ session: otherSession, admissionMode: "free" });
    expect(await screen.findByText(codeB)).toBeInTheDocument();
  });

  it("si /api/ticket-code falla, avisa en vez de quedarse cargando para siempre", async () => {
    // El mock responde 401 cuando el token no tiene código asociado, que es
    // el caso de sesión vencida: ahí recargar no sirve y hay que decir que
    // vuelva a iniciar sesión.
    mockTicketCodeApi({});

    renderAdmissionTicket({ session, admissionMode: "free" });

    expect(await screen.findByRole("alert")).toHaveTextContent(/tu sesión venció/i);
  });
});
