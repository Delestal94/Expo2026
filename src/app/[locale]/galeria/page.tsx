import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { routing } from "@/lib/i18n/routing";
import { GalleryGrid } from "@/modules/gallery";

type Locale = (typeof routing.locales)[number];
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pages.Galeria" });
  return { title: t("metaTitle"), description: t("metaDescription") };
}

export default async function GaleriaPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("Pages.Galeria");

  return (
    <main className="px-6 py-16 sm:px-10 lg:px-16">
      <Link
        href="/"
        className="font-mono text-xs tracking-[0.2em] text-paper-dim uppercase transition hover:text-paper"
      >
        {t("backLink")}
      </Link>

      <h1 className="mt-6 text-balance font-display text-4xl font-medium text-paper sm:text-5xl">
        {t("heading")}
      </h1>
      <p className="mt-3 max-w-xl text-paper-dim">{t("description")}</p>

      <div className="mt-12">
        <GalleryGrid />
      </div>
    </main>
  );
}
