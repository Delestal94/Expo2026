import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { NEWS_ITEMS } from "./news-data";

/** Enlace interno (ancla de la misma página) vs. nota de prensa externa. */
function isInternal(href: string) {
  return href.startsWith("#");
}

export function NewsSection() {
  const t = useTranslations("News");

  return (
    <section id="noticias" className="relative border-t border-line px-6 py-20 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-cyan)" />
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
        {t("eyebrow")}
      </span>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {NEWS_ITEMS.map((item) => (
          <article
            key={item.id}
            className="flex flex-col gap-3 rounded-2xl border border-line bg-[#121022] p-6"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[0.65rem] tracking-[0.15em] text-accent uppercase">
                {t(`items.${item.id}.tag`)}
              </span>
              <span className="font-mono text-[0.65rem] text-paper-dim">{item.date}</span>
            </div>
            <h3 className="font-display text-lg leading-snug font-medium text-paper">
              {t(`items.${item.id}.title`)}
            </h3>
            <p className="flex-1 text-sm text-paper-dim">{t(`items.${item.id}.excerpt`)}</p>
            <a
              href={item.href}
              target={isInternal(item.href) ? undefined : "_blank"}
              rel={isInternal(item.href) ? undefined : "noopener"}
              className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.08em] text-paper underline underline-offset-4 hover:text-accent"
            >
              {isInternal(item.href) ? t("readOnSite") : t("readOnSource", { source: item.source })}
              <span aria-hidden="true">{isInternal(item.href) ? "→" : "↗"}</span>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
