import { getTranslations } from "next-intl/server";
import { getFeatureFlags } from "@/lib/config/flags";
import { CtaLink } from "./cta-link";

const PROVIDERS_FORM_URL = "https://forms.gle/ChErBuBgp3QfuxRr7";
const WHATSAPP_URL = "https://wa.me/5493884212955";

const REFERENCE_PRICING = [
  { key: "kids", price: "$4.000" },
  { key: "adults", price: "$6.000" },
  { key: "under5", price: "Sin cargo" },
] as const;

export async function AccessInfo() {
  const [flags, t] = await Promise.all([
    getFeatureFlags(),
    getTranslations("Landing.AccessInfo"),
  ]);

  return (
    <section
      id="acceso"
      className="border-y border-line px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          {t("eyebrow")}
        </span>
        <h2 className="mx-auto mt-6 text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-paper-dim">
          {t.rich("description", {
            code: (chunks) => <span className="font-mono">{chunks}</span>,
          })}
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
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

      <div className="mx-auto mt-6 max-w-xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
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

      <div className="mx-auto mt-14 max-w-md rounded-2xl border border-line bg-[#121022] p-6 text-left">
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
    </section>
  );
}
