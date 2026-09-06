"use client";

import { useEffect, useState } from "react";

interface ShareLocationButtonProps {
  url: string;
  title: string;
  text: string;
  label: string;
}

/**
 * Solo se monta donde la Web Share API existe de verdad — hoy, prácticamente
 * solo navegadores móviles. En desktop nunca se renderiza: no es un botón
 * "compartir" genérico con fallback a copiar portapapeles, es un gesto que
 * únicamente tiene sentido con una hoja de share nativa a mano.
 */
export function ShareLocationButton({ url, title, text, label }: ShareLocationButtonProps) {
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Arranca en false y se pisa aca, ya recien en el cliente sabemos si el
    // navegador soporta la Web Share API — evita un mismatch de hidratacion,
    // no es un efecto en cascada real.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCanShare(typeof navigator !== "undefined" && typeof navigator.share === "function");
  }, []);

  if (!canShare) return null;

  const handleShare = () => {
    navigator.share({ title, text, url }).catch((error: unknown) => {
      if (error instanceof Error && error.name === "AbortError") return;
    });
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 font-body text-sm font-semibold text-paper transition hover:border-paper-dim focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M8.6 13.5L15.4 17.5M15.4 6.5L8.6 10.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
      {label}
    </button>
  );
}
