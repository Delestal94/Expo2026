import { useTranslations } from "next-intl";

export function SiteFooter() {
  const t = useTranslations("Landing.SiteFooter");

  return (
    <footer className="flex flex-col gap-6 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-16">
      <div className="font-display text-lg font-semibold text-paper">
        {t("brand")}
      </div>
      <p className="max-w-md text-sm text-paper-dim">{t("institutions")}</p>
      <span className="font-mono text-xs text-paper-dim">{t("badge")}</span>
    </footer>
  );
}
