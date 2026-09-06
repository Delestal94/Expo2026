import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { env } from "@/lib/config/env";
import { getFeatureFlags } from "@/lib/config/flags";
import { Link } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { AccessForm } from "@/modules/visitor-access";

type Locale = (typeof routing.locales)[number];
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Cuenta" });
  return { title: t("metaTitle") };
}

export default async function CuentaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const flags = await getFeatureFlags();
  if (!flags.visitorAccess) notFound();

  const t = await getTranslations("Pages.Cuenta");

  return (
    <main className="mx-auto min-h-screen max-w-md px-6 py-24 sm:px-10">
      <Link href="/" className="font-mono text-xs tracking-[0.2em] text-accent uppercase">
        {t("backLink")}
      </Link>
      <h1 className="mt-6 text-balance font-display text-3xl font-medium text-paper">
        {t("heading")}
      </h1>
      <p className="mt-3 text-paper-dim">{t("description")}</p>
      <div className="mt-10">
        <AccessForm admissionMode={env.ADMISSION_MODE} />
      </div>
    </main>
  );
}
