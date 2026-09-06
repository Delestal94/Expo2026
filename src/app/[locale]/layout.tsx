import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { ChatBot } from "@/modules/chatbot";
import { routing } from "@/lib/i18n/routing";
import "@/app/globals.css";

/** Formato Open Graph (guion bajo) por idioma — no es el mismo string que el locale de next-intl. */
const OG_LOCALE: Record<(typeof routing.locales)[number], string> = {
  "es-AR": "es_AR",
  en: "en_US",
  pt: "pt_BR",
  zh: "zh_CN",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  const t = await getTranslations({ locale, namespace: "Metadata" });
  const title = t("title");
  const description = t("description");

  return {
    metadataBase: new URL("https://expojuy2026.vercel.app"),
    title,
    description,
    openGraph: {
      title,
      description,
      url: "/",
      siteName: title,
      locale: OG_LOCALE[locale],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Habilita el render estático por idioma (ver next-intl `setRequestLocale`)
  // — sin esto, cada página cae a render dinámico apenas usa `t()`.
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
    >
      <body className="font-body antialiased">
        <NextIntlClientProvider>
          {children}
          <ChatBot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
