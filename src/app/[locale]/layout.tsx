import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { JetBrains_Mono, Manrope, Unbounded } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import type { ReactNode } from "react";
import { ChatBot } from "@/modules/chatbot";
import { routing } from "@/lib/i18n/routing";
import { THEME_INIT_SCRIPT } from "@/lib/ui/theme";
import { ThemeSync } from "@/lib/ui/theme-sync";
import "@/app/globals.css";

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-unbounded",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jetbrains-mono",
});

/** Formato Open Graph (guion bajo) por idioma — no es el mismo string que el locale de next-intl. */
const OG_LOCALE: Record<(typeof routing.locales)[number], string> = {
  "es-AR": "es_AR",
  en: "en_US",
  pt: "pt_BR",
  zh: "zh_CN",
  fr: "fr_FR",
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

  // `localePrefix: "as-needed"` deja es-AR sin prefijo — mismo criterio
  // que `sitemap.ts` y que el middleware de next-intl, para que hreflang
  // apunte a las URLs que el sitio realmente sirve.
  const path = (l: (typeof routing.locales)[number]) =>
    l === routing.defaultLocale ? "/" : `/${l}`;

  return {
    metadataBase: new URL("https://expojuy2026.vercel.app"),
    title,
    description,
    // Sin esto, un buscador podía indexar un solo idioma como canónico y
    // no tenía forma de ofrecer la variante correcta a cada visitante —
    // cinco idiomas configurados, cero declarados como alternativas entre
    // sí.
    alternates: {
      canonical: path(locale),
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, path(l)]),
      ),
    },
    openGraph: {
      title,
      description,
      url: path(locale),
      // Nombre corto de marca, no el título largo con fecha/lugar: es lo
      // que WhatsApp/X muestran como origen del link, separado del título
      // del preview.
      siteName: "ExpoJuy 2026",
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
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${unbounded.variable} ${manrope.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
        />
      </head>
      <body className="font-body antialiased overflow-x-clip">
        <NextIntlClientProvider>
          <ThemeSync />
          {children}
          <ChatBot />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
