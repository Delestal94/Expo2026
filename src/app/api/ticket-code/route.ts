import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/config/env";
import { signTicketCode } from "@/modules/visitor-access";

/**
 * Devuelve el código de admisión firmado para el usuario dueño del access
 * token recibido — nunca confía en un id de usuario mandado por el
 * cliente (issue #57). El id real se obtiene consultando a Supabase con
 * el token, así que un token robado o forjado no sirve para conseguir el
 * código de otra persona, y el secreto de firma (`TICKET_SIGNING_SECRET`)
 * nunca sale del servidor.
 */
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const accessToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;

  if (!accessToken) {
    return NextResponse.json({ error: "Falta el access token." }, { status: 401 });
  }

  if (!env.NEXT_PUBLIC_SUPABASE_URL || !env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.json(
      { error: "Supabase no está configurado en este entorno." },
      { status: 503 },
    );
  }

  const userResponse = await fetch(`${env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`, {
    headers: {
      apikey: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!userResponse.ok) {
    return NextResponse.json({ error: "Token inválido o expirado." }, { status: 401 });
  }

  const user = (await userResponse.json()) as { id?: string };
  if (!user.id) {
    return NextResponse.json({ error: "Supabase no devolvió un usuario válido." }, { status: 401 });
  }

  return NextResponse.json({ code: signTicketCode(user.id) });
}
