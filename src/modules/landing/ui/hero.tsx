import Image from "next/image";
import { useTranslations } from "next-intl";
import { Countdown } from "./countdown";
import { CtaLink } from "./cta-link";
import { StrataCanvas } from "./strata-canvas";

export function Hero() {
  const t = useTranslations("Landing.Hero");

  return (
    <section
      id="inicio"
      className="relative flex min-h-svh flex-col justify-between overflow-hidden border-b border-line px-6 pt-8 pb-10 sm:px-10 lg:px-16"
    >
      <StrataCanvas />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/10 via-transparent to-ink"
      />

      <nav className="relative z-10 flex items-center justify-between font-mono text-xs tracking-[0.2em] text-paper-dim uppercase motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_backwards]">
        <div className="flex items-center gap-3">
          <Image
            src="/images/logos/expojuy-mark.svg"
            alt=""
            width={20}
            height={28}
            className="h-7 w-auto"
          />
          <span>{t("eyebrow")}</span>
        </div>
        <span>{t("edition")}</span>
      </nav>

      <div className="relative z-10 flex flex-col gap-8">
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.08s_backwards]">
          {t("tagline")}
        </span>
        {/* Lockup oficial real (EXPOJUY · De Jujuy al mundo), recortado sin el
            isotipo — ya está en la esquina de arriba — y recoloreado del gris
            oscuro original a paper para leerse sobre el fondo navy del Hero.
            El "2026" del título tipográfico anterior no forma parte del
            lockup real; sigue presente en "17ª EDICIÓN" y en el countdown. */}
        <h1 className="motion-safe:animate-[strata-settle_0.7s_cubic-bezier(0.16,1,0.3,1)_0.16s_backwards]">
          <Image
            src="/images/logos/expojuy-wordmark-dark.svg"
            alt={t("titleAlt")}
            width={1000}
            height={305}
            priority
            className="h-auto w-full max-w-205"
          />
        </h1>
        <p className="max-w-xl text-balance font-body text-lg text-paper-dim sm:text-xl motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.38s_backwards]">
          {t("description")}
        </p>
      </div>

      <div className="relative z-10 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between motion-safe:animate-[strata-settle_0.6s_cubic-bezier(0.16,1,0.3,1)_0.48s_backwards]">
        <Countdown />
        <div className="flex flex-wrap gap-3">
          <a
            href="#acceso"
            className="group relative isolate inline-flex rounded-full transition-transform duration-300 motion-reduce:transition-none motion-safe:hover:scale-[1.03] motion-safe:focus-visible:scale-[1.03]"
          >
            <span
              aria-hidden="true"
              className="absolute -inset-2 -z-10 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet),var(--color-magenta),var(--color-lavender))] opacity-0 blur-lg transition-opacity duration-500 motion-reduce:transition-none group-hover:opacity-70 group-focus-visible:opacity-70"
            />
            <span className="relative inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-ink">
              {t("ctaAttend")}
              <span
                aria-hidden="true"
                className="inline-block transition-transform duration-300 motion-reduce:transition-none group-hover:translate-x-1 group-focus-visible:translate-x-1"
              >
                →
              </span>
            </span>
          </a>
          <CtaLink
            href="https://forms.gle/ChErBuBgp3QfuxRr7"
            variant="outline"
            external
          >
            {t("ctaProviders")}
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
