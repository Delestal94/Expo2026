import { useTranslations } from "next-intl";

/**
 * URLs reales verificadas (no inventadas): Instagram oficial del evento
 * (@expojuy) y las redes de la Cámara de Comercio Exterior de Jujuy, que
 * organiza ExpoJuy y no tiene una cuenta separada por edición.
 */
const SOCIAL_LINKS = [
  {
    key: "instagram",
    href: "https://www.instagram.com/expojuy/",
    Icon: InstagramIcon,
  },
  {
    key: "facebook",
    href: "https://www.facebook.com/camaradecomercioexteriorjujuy/",
    Icon: FacebookIcon,
  },
  {
    key: "linkedin",
    href: "https://ar.linkedin.com/company/c%C3%A1mara-de-comercio-exterior-de-jujuy",
    Icon: LinkedinIcon,
  },
] as const;

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M13.5 9.5h1.5V7.2h-1.7c-1.7 0-2.6 1-2.6 2.6v1.4H9v2.3h1.7V17h2.3v-3.5h1.7l.3-2.3h-2V10c0-.4.2-.5.5-.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="8" cy="8.3" r="1.15" fill="currentColor" />
      <rect x="7" y="10.6" width="2" height="6.4" fill="currentColor" />
      <path
        d="M11.4 10.6h2v1c.5-.7 1.2-1.2 2.3-1.2 1.7 0 2.8 1.1 2.8 3.1V17h-2v-3.1c0-.9-.4-1.5-1.2-1.5-.8 0-1.3.6-1.3 1.5V17h-2z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Fila de íconos de redes — misma implementación para el pie de página y
 * la sección de Contacto, así no hay dos lugares con URLs distintas.
 */
export function SocialLinks({ className }: { className?: string }) {
  const t = useTranslations("Landing.SocialLinks");

  return (
    <div className={className ?? "flex items-center gap-3"}>
      {SOCIAL_LINKS.map(({ key, href, Icon }) => (
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener"
          aria-label={t(key)}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line text-paper-dim transition hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
