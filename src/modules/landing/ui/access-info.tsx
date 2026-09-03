import { getTranslations } from "next-intl/server";
import { getFeatureFlags } from "@/lib/config/flags";
import { CtaLink } from "./cta-link";

const PROVIDERS_FORM_URL = "https://forms.gle/ChErBuBgp3QfuxRr7";
const WHATSAPP_URL = "https://wa.me/5493884212955";

const MAPS_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3639.6668824201447!2d-65.33387282359566!3d-24.18341278474179!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x941b0ee2033f07f3%3A0xc77a811c6a4b0561!2sCiudad%20Cultural!5e0!3m2!1ses-419!2sar!4v1726026179941!5m2!1ses-419!2sar&zoom=14&maptype=roadmap&disableDefaultUI=true&zoomControl=false&streetViewControl=false&fullscreenControl=false";

const MAPS_LINK = "https://maps.app.goo.gl/nqbHeuuaThDJd9b5A";

const REFERENCE_PRICING = [
  { key: "kids", price: "$4.000" },
  { key: "adults", price: "$6.000" },
  { key: "under5", price: "Sin cargo" },
] as const;

/** Fondo con la paleta de marca, apagado — evita que la sección se sienta vacía sin competir con el texto. */
const BRAND_WASH = {
  background: [
    "radial-gradient(ellipse 900px 560px at 8% -5%, color-mix(in srgb, var(--color-cyan) 14%, transparent), transparent 60%)",
    "radial-gradient(ellipse 800px 560px at 100% 8%, color-mix(in srgb, var(--color-violet) 12%, transparent), transparent 60%)",
    "radial-gradient(ellipse 800px 600px at 92% 100%, color-mix(in srgb, var(--color-magenta) 12%, transparent), transparent 62%)",
    "radial-gradient(ellipse 700px 500px at 0% 100%, color-mix(in srgb, var(--color-lavender) 10%, transparent), transparent 58%)",
  ].join(", "),
};

export async function AccessInfo() {
  const [flags, t, tDirections] = await Promise.all([
    getFeatureFlags(),
    getTranslations("Landing.AccessInfo"),
    getTranslations("Landing.Directions"),
  ]);

  return (
    <section className="relative overflow-hidden border-y border-line px-6 py-24 sm:px-10 lg:px-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={BRAND_WASH} />

      {/* Mismo ritmo de grilla que About/Ejes: 12 columnas a todo el ancho de la sección, sin
          tarjetas angostas flotando en el centro. */}
      <div className="relative grid gap-y-16 lg:grid-cols-12 lg:gap-x-12">
        <div className="lg:col-span-7">
          <div id="llegar" className="scroll-mt-24">
            <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
              {tDirections("eyebrow")}
            </span>
            <h3 className="mt-2 text-balance font-display text-2xl font-medium text-paper sm:text-3xl">
              {tDirections("title")}
            </h3>
            <p className="mt-4 max-w-lg text-balance text-sm text-paper-dim">
              {tDirections.rich("description", {
                strong: (chunks) => <strong className="text-paper">{chunks}</strong>,
              })}
            </p>
            <a
              href={MAPS_LINK}
              target="_blank"
              rel="noopener"
              className="mt-5 inline-block rounded-full border border-line px-5 py-2.5 font-body text-sm font-semibold text-paper transition hover:border-paper-dim"
            >
              {tDirections("cta")}
            </a>
          </div>

          <div id="acceso" className="mt-16 scroll-mt-24">
            <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
              {t("eyebrow")}
            </span>
            <h2 className="mt-6 text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-lg text-paper-dim">
              {t.rich("description", {
                code: (chunks) => <span className="font-mono">{chunks}</span>,
              })}
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {REFERENCE_PRICING.map((tier) => (
                <div
                  key={tier.key}
                  className="rounded-2xl border border-line bg-[#121022] p-5 text-center"
                >
                  <div className="font-mono text-2xl font-semibold text-paper tabular-nums">
                    {tier.price}
                  </div>
                  <div className="mt-2 text-xs text-paper-dim">{t(`pricing.${tier.key}`)}</div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-line px-5 py-2.5 font-body text-sm font-semibold text-paper-dim">
                  {t("buyDisabled")}
                </span>
                {flags.visitorAccess && (
                  <CtaLink href="/cuenta" size="sm">
                    {t("createAccount")}
                  </CtaLink>
                )}
              </div>
              <p className="mt-2 font-mono text-xs text-paper-dim">
                {flags.visitorAccess && t("accountNote")}
                {t("pricingNote")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col overflow-hidden rounded-2xl border border-line lg:col-span-5 lg:col-start-8">
          <div className="h-64 w-full sm:h-72 lg:h-80">
            <iframe
              src={MAPS_EMBED_URL}
              title={tDirections("mapLabel")}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>

          <div className="flex flex-1 flex-col justify-center border-t border-line bg-[#121022] p-6 text-left">
            <h3 className="font-display text-lg font-medium text-paper">
              {t("providersTitle")}
            </h3>
            <p className="mt-2 text-sm text-paper-dim">{t("providersDescription")}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <CtaLink href={PROVIDERS_FORM_URL} size="sm" external>
                {t("providersFormCta")}
              </CtaLink>
              <CtaLink href={WHATSAPP_URL} variant="outline" size="sm" external>
                {t("whatsappCta")}
              </CtaLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
