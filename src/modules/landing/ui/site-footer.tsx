import Image from "next/image";
import { useTranslations } from "next-intl";
import { INSTITUTIONAL_PARTNERS, SPONSORS, type Logo } from "./partners-data";

function LogoGrid({
  logos,
  logoSizes,
  tone = "light",
}: {
  logos: Logo[];
  logoSizes?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {logos.map((logo) => (
        <div
          key={logo.src}
          className={
            tone === "dark"
              ? "flex h-40 w-72 items-center justify-center rounded-xl border border-line bg-[#121022] p-6"
              : "flex h-40 w-72 items-center justify-center rounded-xl bg-paper p-6 shadow-sm"
          }
        >
          <div className="relative h-full w-full">
            <Image
              src={logo.src}
              alt={logo.alt}
              fill
              sizes={logoSizes ?? "288px"}
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
  const organizer: Logo = {
    src: "/images/logos/camara-comercio-exterior.png",
    alt: t("organizerAlt"),
  };

  return (
    <footer className="border-t border-line px-6 py-16 sm:px-10 lg:px-16">
      {/* Organiza, acompañan y sponsors — cada grupo a todo el ancho, en fila horizontal. */}
      <div className="mx-auto flex max-w-5xl flex-col gap-10 border-b border-line pb-12">
        <div className="text-center">
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-accent uppercase">
            {t("organizes")}
          </span>
          <LogoGrid logos={[organizer]} tone="dark" />
        </div>
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

      <div className="mt-10 flex flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="inline-flex items-center self-center rounded-xl bg-paper p-3 sm:self-auto">
          <Image
            src="/images/logos/expojuy-lockup.svg"
            alt={t("brand")}
            width={198}
            height={114}
            className="h-14 w-auto"
          />
        </div>
        <p className="max-w-md text-sm text-paper-dim">{t("institutions")}</p>
        <span className="font-mono text-xs text-paper-dim">{t("badge")}</span>
      </div>
    </footer>
  );
}
