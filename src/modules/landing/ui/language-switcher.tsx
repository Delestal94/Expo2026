"use client";

import { useLocale } from "next-intl";
import { useTransition } from "react";
import { routing } from "@/lib/i18n/routing";
import { usePathname, useRouter } from "@/lib/i18n/navigation";

const LOCALE_LABEL: Record<(typeof routing.locales)[number], string> = {
  "es-AR": "ES",
  en: "EN",
  pt: "PT",
  zh: "中文",
};

/**
 * Cambia de idioma sin perder la página en la que está el visitante —
 * `usePathname` de next-intl ya devuelve la ruta sin el prefijo de
 * idioma, así que solo hace falta pedirle al router que la re-resuelva
 * con el locale nuevo.
 */
export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  return (
    <div
      role="group"
      aria-label="Elegir idioma"
      className="flex items-center gap-1 rounded-full border border-line p-0.5"
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
            className={`rounded-full px-2 py-1 font-mono text-[0.65rem] tracking-[0.08em] uppercase transition-colors disabled:cursor-default ${
              isActive ? "bg-paper text-ink" : "text-paper-dim hover:text-paper"
            }`}
          >
            {LOCALE_LABEL[code]}
          </button>
        );
      })}
    </div>
  );
}
