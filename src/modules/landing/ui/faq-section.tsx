import { getTranslations } from "next-intl/server";
import type { Locale } from "@/lib/i18n/routing";

const QUESTION_KEYS = [
  "dates",
  "tickets",
  "exhibitors",
  "businessRounds",
  "accessibility",
  "parking",
  "languages",
  "updates",
] as const;

/**
 * Las mismas 8 preguntas del chatbot, pero como texto plano server-rendered
 * en vez de contenido que solo aparece dentro del widget tras dos clics.
 *
 * Es una de las 10 secciones mínimas que piden las consignas del Desafío
 * (§5) y, aparte, un motor que extrae texto de la página —sea Google o un
 * LLM— no abre chats ni hace hover: si la respuesta no está en un `<dl>` o
 * similar, no existe para él aunque un visitante la vea perfecto en el
 * chatbot. `<details>` es semántico y funciona sin JS ni CSS.
 *
 * El chatbot sigue ofreciendo las mismas preguntas como atajo — esto no lo
 * reemplaza, le da al mismo contenido un lugar donde siempre está presente.
 */
export async function FaqSection({ locale }: { locale: Locale }) {
  const t = await getTranslations({ locale, namespace: "Landing.Faq" });

  return (
    <section
      id="faq"
      className="scroll-mt-24 border-t border-line px-6 py-16 sm:px-10 lg:px-16"
    >
      <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
        {t("eyebrow")}
      </span>
      <h2 className="mt-3 max-w-2xl font-display text-2xl font-medium text-paper sm:text-3xl">
        {t("title")}
      </h2>

      {/* `<dl>` no admite `<details>` como hijo directo — un `<div>` con
          role="list" implícito por CSS grid alcanza, cada `<details>` ya es
          semántico por sí solo. */}
      <div className="mt-8 grid gap-3 lg:grid-cols-2 lg:gap-4">
        {QUESTION_KEYS.map((key) => (
          <details
            key={key}
            className="group rounded-2xl border border-line bg-surface px-5 py-4 open:border-paper-dim/40"
          >
            <summary className="cursor-pointer list-none font-display text-base font-medium text-paper marker:content-none">
              <span className="flex items-center justify-between gap-3">
                <span>{t(`items.${key}.question`)}</span>
                <span
                  aria-hidden="true"
                  className="shrink-0 text-paper-dim transition-transform duration-300 group-open:rotate-45"
                >
                  +
                </span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-paper-dim">
              {t(`items.${key}.answer`)}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
