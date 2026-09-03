import { getTranslations } from "next-intl/server";
import { VenueMap } from "./venue-map";

export async function MapSection() {
  const t = await getTranslations("InteractiveMap");

  return (
    <section id="mapa" className="border-t border-line px-6 py-20 sm:px-10 lg:px-16">
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
        {t("eyebrow")}
      </span>
      <h2 className="mt-4 max-w-2xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mt-4 max-w-2xl text-paper-dim">{t("description")}</p>
      <div className="mt-10">
        <VenueMap />
      </div>
    </section>
  );
}
