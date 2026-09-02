"use client";

import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import type { AuthSession } from "@/lib/ports";
import { admissionTicketCode } from "../ticket-code";

/**
 * ADR-0003: en modo `free` el QR de ingreso se emite al completar el
 * registro, sin checkout. En modo `paid` todavía no hay adaptador de
 * pago conectado (Mercado Pago sigue bloqueado — ver AGENTS.md), así
 * que esta pantalla se limita a avisarlo, igual que el botón
 * deshabilitado de "Comprar entrada" en la landing.
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
    return <p className="mt-5 text-sm text-paper-dim">{t("paidNotice")}</p>;
  }

  const code = admissionTicketCode(session.user.id);

  return (
    <div className="mt-5 flex flex-col items-center gap-4 rounded-xl border border-line bg-ink p-5 text-center">
      <p className="text-sm text-paper-dim">{t("freeNotice")}</p>
      <div className="rounded-lg bg-paper p-3">
        <QRCodeSVG value={code} size={160} />
      </div>
      <p className="font-mono text-xs tracking-[0.1em] text-paper-dim">{code}</p>
    </div>
  );
}
