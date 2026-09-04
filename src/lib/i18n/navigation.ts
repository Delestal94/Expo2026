import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * `Link`/`useRouter` que ya saben anteponer el prefijo de idioma
 * correcto — el resto del código nunca arma `/en/...` a mano.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
