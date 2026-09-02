import Image from "next/image";
import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Landing.SiteFooter");

  return (
    <footer className="flex flex-col gap-10 border-t border-line px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
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
    </footer>
  );
}
