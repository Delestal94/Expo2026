"use client";

import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";
import { routing } from "@/lib/i18n/routing";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

const LOCALE_LABEL: Record<(typeof routing.locales)[number], string> = {
  "es-AR": "ES",
  en: "EN",
  pt: "PT",
  zh: "中文",
  fr: "FR",
};

/**
 * Cambia de idioma sin perder la página en la que está el visitante —
 * `usePathname` de next-intl ya devuelve la ruta sin el prefijo de
 * idioma, así que solo hace falta pedirle al router que la re-resuelva
 * con el locale nuevo.
 */
export function LanguageSwitcher() {
  const t = useTranslations("Landing.LanguageSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label={t("ariaLabel")}
      className="relative flex shrink-0 items-center gap-0.5 sm:gap-1 rounded-full border border-line bg-surface/80 p-1 backdrop-blur-sm"
    >
      {routing.locales.map((code) => {
        const isActive = code === locale;
        return (
          <button
            key={code}
            type="button"
            disabled={isActive || isPending}
            aria-pressed={isActive}
            onClick={() => {
              startTransition(() => {
                router.replace(pathname, { locale: code });
              });
            }}
            className={`group flex min-h-11 items-center justify-center rounded-full font-mono text-[0.65rem] sm:text-[0.68rem] leading-none tracking-[0.05em] uppercase ${
              isActive ? "" : "cursor-pointer active:scale-95"
            }`}
          >
            {/* El área táctil mide 44px de alto, pero el fondo se pinta sobre
                esta píldora más chica y casi circular para que no roce el
                borde del contenedor. */}
            <span
              className={`relative flex h-8 min-w-8 sm:h-9 sm:min-w-9 items-center justify-center rounded-full px-2 transition-[background-color,color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
                isActive
                  ? "bg-paper font-bold text-ink shadow-sm"
                  : "text-paper-dim group-hover:bg-paper/10 group-hover:text-paper"
              }`}
            >
              {!isActive && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] opacity-0 transition-opacity duration-300 group-hover:opacity-25"
                />
              )}
              <span className="relative z-10 leading-none">{LOCALE_LABEL[code]}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
