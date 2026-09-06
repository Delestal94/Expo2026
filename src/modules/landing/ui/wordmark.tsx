"use client";

import Image from "next/image";
import type { Theme } from "@/lib/ui/theme";
import { useTheme } from "@/lib/ui/use-theme";

const SRC: Record<Theme, string> = {
  dark: "/images/logos/expojuy-wordmark-dark.svg",
  light: "/images/logos/expojuy-wordmark-light.svg",
};

/**
 * El lockup "EXPOJUY · De Jujuy al mundo" es un SVG estático con el color
 * de las letras (no de los acentos de marca) fijo en el archivo — nada
 * que un token CSS pueda tocar. En tema claro, el archivo "-dark" (letras
 * color paper, pensadas para leerse sobre navy) queda casi invisible
 * sobre un fondo claro, así que hay un segundo archivo idéntico salvo por
 * ese único fill. `useTheme()` decide cuál servir; para quien ya tenía
 * claro guardado hay un parpadeo mínimo inevitable (el server siempre
 * renderiza "dark" — recién sabe el tema real después de hidratar), pero
 * el resto del tema (manejado por CSS puro vía tokens) no lo tiene.
 */
export function Wordmark({ alt }: { alt: string }) {
  const theme = useTheme();

  return (
    <Image
      key={theme}
      src={SRC[theme]}
      alt={alt}
      width={1000}
      height={305}
      priority
      className="h-auto w-full max-w-205"
    />
  );
}
