"use client";

import { useEffect, useState, type FormEvent } from "react";
import { createAuthProvider } from "@/lib/adapters/auth";
import type { AuthSession } from "@/lib/ports";
import { AdmissionTicket } from "./admission-ticket";

type Mode = "signup" | "signin";

function errorMessageOf(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

/**
 * Formulario de registro/login de visitantes. Corre client-side (no como
 * server action) porque el adaptador de Supabase persiste la sesión en el
 * storage del browser — moverlo al servidor perdería esa persistencia.
 */
export function AccessForm({ admissionMode }: { admissionMode: "free" | "paid" }) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    createAuthProvider()
      .getSession()
      .then((existing) => {
        if (!cancelled) setSession(existing);
      })
      .catch(() => {
        // Sin sesión activa (o sin credenciales de Supabase configuradas):
        // se trata igual que "todavía no inició sesión".
      })
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const provider = createAuthProvider();
      const result =
        mode === "signup"
          ? await provider.signUp(email, password)
          : await provider.signIn(email, password);
      setSession(result);
      setPassword("");
    } catch (error) {
      setErrorMessage(errorMessageOf(error, "No se pudo completar la operación. Probá de nuevo."));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await createAuthProvider().signOut();
      setSession(null);
    } catch (error) {
      setErrorMessage(errorMessageOf(error, "No se pudo cerrar la sesión. Probá de nuevo."));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkingSession) {
    return null;
  }

  if (session) {
    return (
      <div className="rounded-2xl border border-line bg-[#121022] p-6">
        <p className="text-paper">
          Sesión iniciada como{" "}
          <strong className="font-mono font-semibold">{session.user.email}</strong>.
        </p>
        <AdmissionTicket session={session} admissionMode={admissionMode} />
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSubmitting}
          className="mt-5 rounded-full border border-line px-5 py-2.5 font-body text-sm font-semibold text-paper transition hover:border-paper-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          Cerrar sesión
        </button>
        {errorMessage && (
          <p role="alert" className="mt-3 text-sm text-terracotta">
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-line bg-[#121022] p-6">
      <div className="flex gap-2 rounded-full border border-line p-1" role="tablist">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signup"}
          onClick={() => setMode("signup")}
          className={`flex-1 rounded-full px-4 py-2 font-body text-sm font-semibold transition ${
            mode === "signup" ? "bg-accent text-ink" : "text-paper-dim hover:text-paper"
          }`}
        >
          Crear cuenta
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "signin"}
          onClick={() => setMode("signin")}
          className={`flex-1 rounded-full px-4 py-2 font-body text-sm font-semibold transition ${
            mode === "signin" ? "bg-accent text-ink" : "text-paper-dim hover:text-paper"
          }`}
        >
          Ya tengo cuenta
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="visitor-email" className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
            Email
          </label>
          <input
            id="visitor-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-xl border border-line bg-ink px-4 py-2.5 text-paper outline-none focus-visible:border-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="visitor-password" className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
            Contraseña
          </label>
          <input
            id="visitor-password"
            type="password"
            required
            minLength={8}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-xl border border-line bg-ink px-4 py-2.5 text-paper outline-none focus-visible:border-accent"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-accent px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Un momento..."
            : mode === "signup"
              ? "Crear cuenta"
              : "Iniciar sesión"}
        </button>

        <p role="status" aria-live="polite" className="min-h-5 text-sm text-terracotta">
          {errorMessage}
        </p>
      </form>

      <p className="text-sm text-paper-dim">
        Esto crea tu cuenta de visitante. La compra de la entrada todavía no
        está disponible — se habilita en la próxima etapa.
      </p>
    </div>
  );
}
