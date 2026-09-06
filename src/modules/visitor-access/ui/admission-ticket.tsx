"use client";

import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import type { AuthSession } from "@/lib/ports";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { admissionTicketCode } from "../ticket-code";

/** Mismo cuarteto que usa el índice de anclas para la "veta" de cada sección. */
const STRATUM_COLORS = [
  "var(--color-cyan)",
  "var(--color-violet)",
  "var(--color-magenta)",
  "var(--color-lavender)",
];

/**
 * Cada visitante recibe su propia veta mineral, igual que cada sección de
 * la landing tiene la suya — se deriva del código de admisión (estable
 * por usuario, no aleatorio en cada render) en vez de asignarse al azar.
 */
function stratumColorFor(code: string): string {
  let sum = 0;
  for (let index = 0; index < code.length; index += 1) sum += code.charCodeAt(index);
  return STRATUM_COLORS[sum % STRATUM_COLORS.length];
}

/**
 * Mismo tono que el contenedor donde vive este componente en
 * `access-form.tsx` (`bg-[#121022]`, no hay token para esto). Los
 * "agujeros" de la perforación pintan este color en vez de transparentar,
 * simulando el recorte sobre la tarjeta que lo envuelve.
 */
const PUNCH_COLOR = "#121022";

/**
 * Siempre apilada, sin variante en fila: este componente vive dentro del
 * formulario de `/cuenta`, que es angosto por diseño (`max-w-md`) tanto en
 * mobile como en desktop — no hay viewport en el que valga la pena una
 * fila QR-al-costado, así que la línea de corte es siempre horizontal.
 */
function TicketPerforation() {
  return (
    <div aria-hidden="true" className="relative h-px w-full shrink-0">
      <span className="absolute inset-0 border-t border-dashed border-line" />
      <span
        className="absolute top-0 left-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: PUNCH_COLOR }}
      />
      <span
        className="absolute top-0 right-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ backgroundColor: PUNCH_COLOR }}
      />
    </div>
  );
}

/**
 * ADR-0003: en modo `free` el QR de ingreso se emite al completar el
 * registro, sin checkout. En modo `paid` todavía no hay adaptador de
 * pago conectado (Mercado Pago sigue bloqueado — ver AGENTS.md), así
 * que esta pantalla se limita a avisarlo, igual que el botón
 * deshabilitado de "Comprar entrada" en la landing.
 *
 * El QR gratuito se muestra como una entrada real (talón perforado),
 * no como una tarjeta genérica con un código adentro: las fechas y el
 * código son los únicos datos que importan una vez que existís como
 * visitante registrado, así que se tratan como pieza gráfica en vez de
 * texto de trámite.
 */
export function AdmissionTicket({
  session,
  admissionMode,
}: {
  session: AuthSession;
  admissionMode: "free" | "paid";
}) {
  const t = useTranslations("VisitorAccess.AdmissionTicket");

  if (admissionMode === "paid") {
    return (
      <div className="mt-5 rounded-xl border border-dashed border-line bg-ink p-5 text-center">
        <span className="font-mono text-[0.65rem] tracking-[0.3em] text-paper-dim uppercase">
          {t("pendingLabel")}
        </span>
        <p className="mt-2 text-sm text-paper-dim">{t("paidNotice")}</p>
      </div>
    );
  }

  const code = admissionTicketCode(session.user.id);
  const color = stratumColorFor(code);

  return (
    <div className="relative mt-5 flex flex-col overflow-hidden rounded-xl border border-line bg-ink">
      <EntranceVein color={color} />

      <div className="flex flex-1 flex-col gap-3 p-5 text-left">
        <span className="font-mono text-[0.65rem] tracking-[0.3em] text-paper-dim uppercase">
          {t("admitOne")}
        </span>
        <span className="font-display text-lg font-semibold text-paper">{t("brand")}</span>
        <div className="flex items-end gap-3">
          <span className="sr-only">{t("dateRangeLabel")}</span>
          {/* Apilado a propósito ("09—" / "12") en vez de "09—12" en una
              línea: dos numerales grandes leen como capas, no como un
              rango de fechas de trámite. */}
          <div
            aria-hidden="true"
            className="flex flex-col font-display text-[2.75rem] leading-[0.85] font-black tabular-nums text-paper"
          >
            <span>09—</span>
            <span>12</span>
          </div>
          <span aria-hidden="true" className="pb-1 font-mono text-xs tracking-[0.2em] text-paper-dim uppercase">
            {t("month")} 2026
          </span>
        </div>
        <span className="text-sm text-paper-dim">{t("venue")}</span>
        <p className="mt-1 text-sm text-paper-dim">{t("freeNotice")}</p>
      </div>

      <TicketPerforation />

      <div className="flex shrink-0 flex-col items-center justify-center gap-2 p-5">
        <span className="font-mono text-[0.6rem] tracking-[0.25em] text-paper-dim uppercase">
          {t("scanLabel")}
        </span>
        <div className="rounded-lg bg-paper p-3">
          <QRCodeSVG value={code} size={128} />
        </div>
        <span className="font-mono text-[0.65rem] tracking-[0.1em] text-paper-dim">{code}</span>
      </div>
    </div>
  );
}
