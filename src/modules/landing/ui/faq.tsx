import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";

const FAQ_KEYS = [
  "dates",
  "tickets",
  "exhibitors",
  "businessRounds",
  "accessibility",
  "parking",
  "languages",
  "updates",
] as const;

export function Faq() {
  const t = useTranslations("Landing.Faq");

  return (
    <section id="faq" className="relative border-t border-line px-6 py-20 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-lavender)" />
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
        {t("eyebrow")}
      </span>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        {t("title")}
      </h2>

      <div className="mt-10 flex max-w-3xl flex-col gap-3">
        {FAQ_KEYS.map((key) => (
          <details
            key={key}
            className="group rounded-2xl border border-line open:bg-[#121022]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-display text-paper marker:content-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
              {t(`items.${key}.question`)}
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                className="shrink-0 text-paper-dim transition-transform duration-200 group-open:rotate-180 motion-reduce:transition-none"
              >
                <path
                  d="M3 6l5 5 5-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <p className="px-6 pb-6 text-paper-dim">{t(`items.${key}.answer`)}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
