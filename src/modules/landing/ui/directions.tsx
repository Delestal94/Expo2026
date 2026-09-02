import { useTranslations } from "next-intl";

const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3639.6668824201447!2d-65.33387282359566!3d-24.18341278474179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941b0ee2033f07f3%3A0xc77a811c6a4b0561!2sCiudad%20Cultural!5e0!3m2!1ses-419!2sar!4v1726026179941!5m2!1ses-419!2sar&zoom=14&maptype=roadmap&disableDefaultUI=true&zoomControl=false&streetViewControl=false&fullscreenControl=false";

const MAPS_LINK = "https://maps.app.goo.gl/nqbHeuuaThDJd9b5A";

export function Directions() {
  const t = useTranslations("Landing.Directions");

  return (
    <section className="border-t border-line px-6 py-24 sm:px-10 lg:px-16">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-10 rounded-3xl border border-line bg-gradient-to-br from-accent/5 to-accent/15 px-6 py-10 sm:px-12 lg:flex-row lg:justify-between">
        <div className="flex max-w-md flex-col items-start gap-6">
          <div>
            <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
              {t("eyebrow")}
            </span>
            <h2 className="mt-2 text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
              {t("title")}
            </h2>
          </div>
          <p className="text-balance text-paper-dim">
            {t.rich("description", {
              strong: (chunks) => (
                <strong className="text-paper">{chunks}</strong>
              ),
            })}
          </p>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener"
            className="rounded-full bg-accent px-6 py-3 font-body text-sm font-semibold text-ink transition hover:brightness-110"
          >
            {t("cta")}
          </a>
        </div>

        <div className="h-72 w-full overflow-hidden rounded-2xl lg:h-80 lg:w-96">
          <iframe
            src={MAPS_EMBED_URL}
            title={t("mapLabel")}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
