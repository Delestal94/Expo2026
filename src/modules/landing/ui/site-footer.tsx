import Image from "next/image";
import { useTranslations } from "next-intl";
import { INSTITUTIONAL_PARTNERS, SPONSORS, type Logo } from "./partners-data";

function LogoGrid({ logos }: { logos: Logo[] }) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {logos.map((logo) => (
        <div
          key={logo.src}
          className="flex h-16 w-28 items-center justify-center rounded-xl bg-paper p-3 grayscale transition duration-300 hover:grayscale-0"
        >
          <div className="relative h-full w-full">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes="112px"
              className="object-contain"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SiteFooter() {
  const t = useTranslations("Landing.SiteFooter");

  return (
    <footer className="border-t border-line px-6 py-16 sm:px-10 lg:px-16">
      {/* Partners y sponsors — información de cierre, igual que el resto de este bloque. */}
      <div className="mx-auto flex max-w-4xl flex-col gap-10 border-b border-line pb-12 sm:flex-row sm:justify-around">
        <div className="text-center">
          <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
            Acompañan
          </span>
          <LogoGrid logos={INSTITUTIONAL_PARTNERS} />
        </div>
        <div className="text-center">
          <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
            Nuestros sponsors
          </span>
          <LogoGrid logos={SPONSORS} />
        </div>
      </div>

      <div className="mt-10 flex flex-col gap-10 sm:flex-row sm:items-center sm:justify-between">
        <div className="font-display text-lg font-semibold text-paper">
          {t("brand")}
        </div>

        <div className="flex flex-col items-center gap-3">
          <span className="font-mono text-xs tracking-[0.2em] text-paper-dim uppercase">
            {t("organizes")}
          </span>
          <div className="relative h-12 w-32">
            <Image
              src="/images/logos/camara-comercio-exterior.png"
              alt={t("organizerAlt")}
              fill
              sizes="128px"
              className="object-contain"
            />
          </div>
        </div>

        <p className="max-w-md text-sm text-paper-dim">{t("institutions")}</p>
        <span className="font-mono text-xs text-paper-dim">{t("badge")}</span>
      </div>
    </footer>
  );
}
