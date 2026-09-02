import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AccessForm } from "./access-form";

const mockProvider = {
  signUp: vi.fn(),
  signIn: vi.fn(),
  signOut: vi.fn(),
  getSession: vi.fn(),
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

  it("crea una cuenta nueva con el formulario de registro por defecto", async () => {
    const user = userEvent.setup();
    mockProvider.signUp.mockResolvedValue(SESSION);
    render(<AccessForm admissionMode="free" />);

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
    render(<AccessForm admissionMode="free" />);

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
    render(<AccessForm admissionMode="free" />);

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
    render(<AccessForm admissionMode="free" />);

    expect(await screen.findByText(/Sesión iniciada como/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Cerrar sesión" }));

    await waitFor(() => expect(mockProvider.signOut).toHaveBeenCalled());
    expect(await screen.findByRole("tab", { name: "Crear cuenta" })).toBeInTheDocument();
  });

  it("emite el QR de ingreso cuando el modo de acceso es gratuito", async () => {
    mockProvider.getSession.mockResolvedValue(SESSION);
    render(<AccessForm admissionMode="free" />);

    expect(await screen.findByText("EXPOJUY26-USER1")).toBeInTheDocument();
  });

  it("avisa que el QR todavía no está disponible cuando el modo de acceso es pago", async () => {
    mockProvider.getSession.mockResolvedValue(SESSION);
    render(<AccessForm admissionMode="paid" />);

    expect(await screen.findByText(/el QR se emite después de pagar la entrada/)).toBeInTheDocument();
  });
});
