import { useTranslations } from "next-intl";
import { EntranceVein } from "@/lib/ui/entrance-vein";
import { WHATSAPP_URL } from "./access-info";
import { CtaLink } from "./cta-link";
import { SocialLinks } from "./social-links";

/**
 * Datos reales de la Cámara de Comercio Exterior de Jujuy, quien organiza
 * ExpoJuy y no tiene una vía de contacto separada por edición.
 */
const EMAIL = "camaradecomercioexterior@gmail.com";
const PHONE_DISPLAY = "+54 388 423-3539";
const PHONE_HREF = "tel:+543884233539";
const ADDRESS = "Belgrano 860, 2º piso — San Salvador de Jujuy";

export function Contact() {
  const t = useTranslations("Landing.Contact");

  const rows = [
    { label: t("emailLabel"), value: EMAIL, href: `mailto:${EMAIL}` },
    { label: t("phoneLabel"), value: PHONE_DISPLAY, href: PHONE_HREF },
    { label: t("addressLabel"), value: ADDRESS, href: undefined },
  ];

  return (
    <section id="contacto" className="relative border-t border-line px-6 py-20 sm:px-10 lg:px-16">
      <EntranceVein color="var(--color-magenta)" />
      <div className="grid gap-y-12 lg:grid-cols-12 lg:gap-x-10">
        <div className="lg:col-span-7">
          <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
            {t("eyebrow")}
          </span>
          <h2 className="mt-4 max-w-xl text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 max-w-xl text-paper-dim">{t("description")}</p>

          <dl className="mt-8 flex flex-col gap-4">
            {rows.map((row) => (
              <div key={row.label} className="flex flex-col gap-0.5">
                <dt className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
                  {row.label}
                </dt>
                <dd className="font-display text-lg text-paper">
                  {row.href ? (
                    <a href={row.href} className="hover:text-accent">
                      {row.value}
                    </a>
                  ) : (
                    row.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-8">
            <CtaLink href={WHATSAPP_URL} variant="outline" external>
              {t("whatsappCta")}
            </CtaLink>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4 rounded-2xl border border-line bg-[#121022] p-8 lg:col-span-5 lg:col-start-8">
          <h3 className="font-display text-lg font-medium text-paper">{t("socialTitle")}</h3>
          <p className="text-sm text-paper-dim">{t("socialDescription")}</p>
          <SocialLinks />
        </div>
      </div>
    </section>
  );
}
