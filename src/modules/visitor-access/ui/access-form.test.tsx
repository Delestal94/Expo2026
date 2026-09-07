import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { beforeEach, describe, expect, it, vi } from "vitest";
import esAR from "@/lib/i18n/messages/es-AR.json";
import { AccessForm } from "./access-form";

function renderAccessForm(admissionMode: "free" | "paid") {
  return render(
    <NextIntlClientProvider locale="es-AR" messages={esAR}>
      <AccessForm admissionMode={admissionMode} />
    </NextIntlClientProvider>,
  );
}

const mockProvider = {
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
  resetPassword: vi.fn(),
};

vi.mock("@/lib/adapters/auth", () => ({
  createAuthProvider: () => mockProvider,
}));

const SESSION = {
  user: { id: "user-1", email: "visitante@example.com" },
  accessToken: "token-123",
};

describe("AccessForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockProvider.getSession.mockResolvedValue(null);
  });

  it("muestra un placeholder en vez de una tarjeta vacía mientras verifica la sesión", async () => {
    let resolveSession: (value: null) => void = () => {};
    mockProvider.getSession.mockReturnValue(
      new Promise((resolve) => {
        resolveSession = resolve;
      }),
    );
    renderAccessForm("free");

    expect(screen.getByText("Verificando tu sesión…")).toBeInTheDocument();
    expect(screen.queryByRole("tab", { name: "Crear cuenta" })).not.toBeInTheDocument();

    resolveSession(null);
    await screen.findByRole("tab", { name: "Crear cuenta" });
  });

  it("crea una cuenta nueva con el formulario de registro por defecto", async () => {
    const user = userEvent.setup();
    mockProvider.signUp.mockResolvedValue(SESSION);
    renderAccessForm("free");

    await screen.findByRole("tab", { name: "Crear cuenta" });
    await user.type(screen.getByLabelText("Email"), "visitante@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto123");
    await user.click(screen.getByRole("button", { name: "Crear cuenta" }));

    await waitFor(() =>
      expect(mockProvider.signUp).toHaveBeenCalledWith("visitante@example.com", "secreto123"),
    );
    expect(await screen.findByText(/Sesión iniciada como/)).toBeInTheDocument();
    expect(screen.getByText("visitante@example.com")).toBeInTheDocument();
  });

  it("permite pasar a iniciar sesión con una cuenta existente", async () => {
    const user = userEvent.setup();
    mockProvider.signIn.mockResolvedValue(SESSION);
    renderAccessForm("free");

    await user.click(await screen.findByRole("tab", { name: "Ya tengo cuenta" }));
    await user.type(screen.getByLabelText("Email"), "visitante@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "secreto123");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    await waitFor(() =>
      expect(mockProvider.signIn).toHaveBeenCalledWith("visitante@example.com", "secreto123"),
    );
  });

  it("muestra el error del proveedor sin romper el formulario", async () => {
    const user = userEvent.setup();
    mockProvider.signIn.mockRejectedValue(new Error("Credenciales inválidas"));
    renderAccessForm("free");

    await user.click(await screen.findByRole("tab", { name: "Ya tengo cuenta" }));
    await user.type(screen.getByLabelText("Email"), "visitante@example.com");
    await user.type(screen.getByLabelText("Contraseña"), "mal-password");
    await user.click(screen.getByRole("button", { name: "Iniciar sesión" }));

    expect(await screen.findByText("Credenciales inválidas")).toBeInTheDocument();
  });

  it("muestra la sesión activa y permite cerrarla", async () => {
    const user = userEvent.setup();
    mockProvider.getSession.mockResolvedValue(SESSION);
    mockProvider.signOut.mockResolvedValue(undefined);
    renderAccessForm("free");

    expect(await screen.findByText(/Sesión iniciada como/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    await waitFor(() => expect(mockProvider.signOut).toHaveBeenCalled());
    expect(await screen.findByRole("tab", { name: "Crear cuenta" })).toBeInTheDocument();
  });

  it("emite el QR de ingreso cuando el modo de acceso es gratuito", async () => {
    // El código ya no se calcula en el cliente (issue #57) — lo devuelve
    // /api/ticket-code, así que acá se mockea fetch en vez de asumir un
    // valor calculado a mano a partir del id de usuario.
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ code: "EXPOJUY26-ABCDEF12" }), { status: 200 })),
    );

    mockProvider.getSession.mockResolvedValue(SESSION);
    renderAccessForm("free");

    expect(await screen.findByText("EXPOJUY26-ABCDEF12")).toBeInTheDocument();
    vi.unstubAllGlobals();
  });

  it("permite solicitar la recuperación de contraseña", async () => {
    const user = userEvent.setup();
    mockProvider.resetPassword.mockResolvedValue(undefined);
    renderAccessForm("free");

    await user.click(await screen.findByRole("tab", { name: "Ya tengo cuenta" }));
    await user.click(screen.getByRole("button", { name: "¿Olvidaste tu contraseña?" }));

    expect(screen.getByText("Recuperar contraseña")).toBeInTheDocument();
    await user.type(screen.getByLabelText("Email"), "recuperar@example.com");
    await user.click(screen.getByRole("button", { name: "Enviar enlace de recuperación" }));

    await waitFor(() =>
      expect(mockProvider.resetPassword).toHaveBeenCalledWith("recuperar@example.com"),
    );
    expect(await screen.findByText(/Te enviamos un correo/)).toBeInTheDocument();
  });
});
