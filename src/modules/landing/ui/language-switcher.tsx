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
      className="relative flex items-center gap-1 rounded-full border border-line bg-ink/70 p-0.5 backdrop-blur-sm"
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
            className={`group relative rounded-full px-2.5 py-1 font-mono text-[0.68rem] tracking-[0.08em] uppercase transition-all duration-300 ease-out ${
              isActive
                ? "bg-paper font-bold text-ink shadow-sm"
                : "cursor-pointer text-paper-dim hover:bg-paper/10 hover:text-paper active:scale-95"
            }`}
          >
            {!isActive && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full bg-[linear-gradient(90deg,var(--color-cyan),var(--color-violet))] opacity-0 transition-opacity duration-300 group-hover:opacity-25"
              />
            )}
            <span className="relative z-10">{LOCALE_LABEL[code]}</span>
          </button>
        );
      })}
    </div>
  );
}
