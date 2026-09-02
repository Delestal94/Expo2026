import Link from "next/link";
import type { ReactNode } from "react";

type CtaVariant = "solid" | "outline";
type CtaSize = "md" | "sm";

interface CtaLinkProps {
  href: string;
  variant?: CtaVariant;
  size?: CtaSize;
  /** El destino abandona el sitio (formulario externo, WhatsApp, etc). */
  external?: boolean;
  children: ReactNode;
}

const VARIANT_CLASSES: Record<CtaVariant, string> = {
  solid: "bg-accent text-ink hover:brightness-110",
  outline: "border border-line text-paper hover:border-paper-dim",
};

const SIZE_CLASSES: Record<CtaSize, string> = {
  md: "px-6 py-3",
  sm: "px-5 py-2.5",
};

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink";

/**
 * Dos lenguajes de interacción distintos según a dónde lleva el link:
 * quedarse en el sitio "entra" (barrido mineral, como abrir una veta),
 * salir del sitio "sale" (flecha que se despega más allá del borde).
 * No es el mismo botón con distinto color — reacciona según lo que hace.
 */
export function CtaLink({
  href,
  variant = "solid",
  size = "md",
  external = false,
  children,
}: CtaLinkProps) {
  const className = [
    "group relative inline-flex items-center gap-2 overflow-hidden rounded-full font-body text-sm font-semibold",
    "transition-[filter,border-color,transform] duration-200 active:scale-[0.97] motion-reduce:active:scale-100 motion-reduce:transition-none",
    SIZE_CLASSES[size],
    VARIANT_CLASSES[variant],
    FOCUS_RING,
    !external &&
      "before:absolute before:inset-y-0 before:-left-1/4 before:w-1/4 before:-skew-x-[20deg] before:bg-current/15 before:content-[''] before:-translate-x-[420%] before:transition-transform before:duration-500 before:ease-out hover:before:translate-x-[420%] focus-visible:before:translate-x-[420%] motion-reduce:before:hidden",
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      <span className="relative z-10">{children}</span>
      {external && (
        <span
          aria-hidden="true"
          className="relative z-10 inline-block text-[0.85em] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0"
        >
          ↗
        </span>
      )}
    </>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}
