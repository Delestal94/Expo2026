import createMiddleware from "next-intl/middleware";
import { routing } from "@/lib/i18n/routing";

/**
 * Next.js 16 renombró `middleware.ts` a `proxy.ts` (ver
 * node_modules/next/dist/docs/.../file-conventions/proxy.md) — el export
 * que genera next-intl mantiene la misma firma, solo cambia el nombre
 * del archivo y de la función.
 */
export default createMiddleware(routing);

export const config = {
  // Corre en toda la app salvo assets estáticos y API routes. El editor
  // interno del mapa vive bajo [locale] igual que el resto (así hay un
  // único layout raíz con <html>/<body>, ver ADR-0007) pero no usa
  // traducciones — el locale que le toque es irrelevante para su UI.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
