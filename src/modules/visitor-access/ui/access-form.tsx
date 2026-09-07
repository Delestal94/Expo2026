"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState, type FormEvent } from "react";
import type { AuthSession } from "@/lib/ports";
import { AdmissionTicket } from "./admission-ticket";

/**
 * Import dinámico: el SDK de Supabase (~140 KB) no debe formar parte del
 * bundle inicial de /cuenta — solo hace falta una vez que este componente
 * efectivamente verifica la sesión o el usuario envía el formulario.
 */
function loadAuthProvider() {
  return import("@/lib/adapters/auth").then((mod) => mod.createAuthProvider());
}

type Mode = "signup" | "signin" | "forgot";

/**
 * Traduce lo que devuelve el proveedor de autenticación a algo que el
 * visitante pueda accionar.
 *
 * Antes esto era `error.message` directo, así que en pantalla aparecía el
 * texto crudo del SDK: en inglés ("User already registered") o, peor, la
 * excepción interna del adaptador nombrando a Supabase. Un mensaje así no
 * dice qué hacer, y el caso más común —Supabase pide confirmar el email,
 * que es su valor por defecto— caía justo ahí.
 *
 * Se compara sobre el texto del proveedor porque no expone códigos
 * estables; por eso el fallback genérico sigue existiendo.
 */
type ErrorKey =
  | "errorEmailTaken"
  | "errorBadCredentials"
  | "errorConfirmEmail"
  | "errorTooMany"
  | "errorNetwork"
  | "errorWeakPassword";

const ERROR_PATTERNS: Array<[RegExp, ErrorKey]> = [
  [/already registered|already exists|ya tiene una cuenta|user already/i, "errorEmailTaken"],
  [/confirmación de email|confirm|not confirmed|no devolvió una sesión/i, "errorConfirmEmail"],
  [/invalid login|invalid credentials|credenciales/i, "errorBadCredentials"],
  [/rate limit|too many|demasiados/i, "errorTooMany"],
  [/fetch failed|network|networkerror|failed to fetch|timeout/i, "errorNetwork"],
  [/password.*(short|least|weak)|contraseña.*(corta|caracteres)/i, "errorWeakPassword"],
];

function errorKeyOf(error: unknown): ErrorKey | null {
  const raw = error instanceof Error ? error.message : String(error ?? "");
  return ERROR_PATTERNS.find(([patron]) => patron.test(raw))?.[1] ?? null;
}

/**
 * Antes esto era un `return null` mientras se resolvía el import dinámico
 * del SDK de auth: la tarjeta desaparecía y volvía a aparecer un instante
 * después, como si el formulario "temblara". Este placeholder ocupa el
 * mismo alto que el formulario real para no correr el layout, y usa el
 * mismo barrido mineral que el glow del CTA del Hero en vez de un gris
 * genérico de skeleton.
 */
function AccessFormSkeleton({ label }: { label: string }) {
  return (
    <div role="status" className="rounded-2xl border border-line bg-surface p-6">
      <span className="sr-only">{label}</span>
      <div className="flex gap-2 rounded-full border border-line p-1" aria-hidden="true">
        <div className="skeleton-strata h-9 flex-1 rounded-full" />
        <div className="skeleton-strata h-9 flex-1 rounded-full" />
      </div>
      <div className="mt-6 flex flex-col gap-4" aria-hidden="true">
        <div className="flex flex-col gap-1.5">
          <div className="skeleton-strata h-3 w-16 rounded-full" />
          <div className="skeleton-strata h-11 w-full rounded-xl" />
        </div>
        <div className="flex flex-col gap-1.5">
          <div className="skeleton-strata h-3 w-24 rounded-full" />
          <div className="skeleton-strata h-11 w-full rounded-xl" />
        </div>
        <div className="skeleton-strata mt-2 h-11 w-full rounded-full" />
      </div>
    </div>
  );
}

/**
 * Formulario de registro/login de visitantes. Corre client-side (no como
 * server action) porque el adaptador de Supabase persiste la sesión en el
 * storage del browser — moverlo al servidor perdería esa persistencia.
 */
export function AccessForm({ admissionMode }: { admissionMode: "free" | "paid" }) {
  const t = useTranslations("VisitorAccess.AccessForm");
  const [checkingSession, setCheckingSession] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [mode, setMode] = useState<Mode>("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadAuthProvider()
      .then((provider) => provider.getSession())
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
    setSuccessMessage(null);
    try {
      const provider = await loadAuthProvider();
      if (mode === "forgot") {
        await provider.resetPassword(email);
        setSuccessMessage(t("recoverySuccess"));
        return;
      }

      const result =
        mode === "signup"
          ? await provider.signUp(email, password)
          : await provider.signIn(email, password);
      setSession(result);
      setPassword("");
    } catch (error) {
      const clave = errorKeyOf(error);
      setErrorMessage(clave ? t(clave) : t("genericError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSignOut() {
    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await (await loadAuthProvider()).signOut();
      setSession(null);
    } catch (error) {
      const clave = errorKeyOf(error);
      setErrorMessage(clave ? t(clave) : t("signOutError"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (checkingSession) {
    return <AccessFormSkeleton label={t("checkingSession")} />;
  }

  if (session) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6">
        <p className="text-paper">
          {t.rich("sessionActive", {
            email: session.user.email,
            strong: (chunks) => <strong className="font-mono font-semibold">{chunks}</strong>,
          })}
        </p>
        <AdmissionTicket session={session} admissionMode={admissionMode} />
        <button
          type="button"
          onClick={handleSignOut}
          disabled={isSubmitting}
          className="mt-5 rounded-full border border-line px-5 py-2.5 font-body text-sm font-semibold text-paper transition hover:border-paper-dim disabled:cursor-not-allowed disabled:opacity-60"
        >
          {t("signOut")}
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
    <div className="rounded-2xl border border-line bg-surface p-6">
      {mode !== "forgot" ? (
        <div className="flex gap-2 rounded-full border border-line p-1" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signup"}
            onClick={() => {
              setMode("signup");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 rounded-full px-4 py-2 font-body text-sm font-semibold transition ${
              mode === "signup" ? "bg-accent text-ink" : "text-paper-dim hover:text-paper"
            }`}
          >
            {t("tabSignup")}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mode === "signin"}
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 rounded-full px-4 py-2 font-body text-sm font-semibold transition ${
              mode === "signin" ? "bg-accent text-ink" : "text-paper-dim hover:text-paper"
            }`}
          >
            {t("tabSignin")}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between border-b border-line/60 pb-3">
          <span className="font-mono text-xs tracking-wider text-accent uppercase">
            {t("tabForgot")}
          </span>
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setErrorMessage(null);
              setSuccessMessage(null);
            }}
            className="font-mono text-xs text-paper-dim transition hover:text-paper"
          >
            ← {t("backToSignin")}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        {mode === "forgot" && (
          <p className="text-xs text-paper-dim leading-relaxed">
            {t("forgotDescription")}
          </p>
        )}

        <div className="flex flex-col gap-1.5">
          <label htmlFor="visitor-email" className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
            {t("emailLabel")}
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

        {mode !== "forgot" && (
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="visitor-password" className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
                {t("passwordLabel")}
              </label>
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setErrorMessage(null);
                    setSuccessMessage(null);
                  }}
                  className="font-mono text-[0.68rem] text-accent transition hover:underline"
                >
                  {t("forgotPassword")}
                </button>
              )}
            </div>
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
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 rounded-full bg-accent px-5 py-2.5 font-body text-sm font-semibold text-ink transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? t("submitLoading")
            : mode === "signup"
              ? t("tabSignup")
              : mode === "signin"
                ? t("submitSignin")
                : t("sendRecoveryEmail")}
        </button>

        {successMessage && (
          <div role="status" className="rounded-xl border border-accent/40 bg-accent/15 p-3 text-xs text-accent">
            {successMessage}
          </div>
        )}

        <p role="status" aria-live="polite" className="min-h-5 text-sm text-terracotta">
          {errorMessage}
        </p>
      </form>

      {/* La nota depende del modo: en gratuito el registro entrega un QR
          real, así que avisar que "la compra no está disponible" sería
          falso. `ADMISSION_MODE` se cambia por variable de entorno
          (ADR-0003), sin pasar por acá. */}
      <p className="text-sm text-paper-dim">
        {admissionMode === "free" ? t("footerNoteFree") : t("footerNote")}
      </p>
    </div>
  );
}
