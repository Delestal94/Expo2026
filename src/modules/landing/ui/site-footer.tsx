import Image from "next/image";
import { useTranslations } from "next-intl";
import { INSTITUTIONAL_PARTNERS, SPONSORS, type Logo } from "./partners-data";
import { WHATSAPP_URL } from "./access-info";
import { CtaLink } from "./cta-link";
import { SocialLinks } from "./social-links";

/** Mismas 4 vetas que About/Ejes/SectionNav usan para el resto del sitio. */
const VEIN_COLORS = [
  "var(--color-cyan)",
  "var(--color-violet)",
  "var(--color-magenta)",
  "var(--color-lavender)",
];

function LogoGrid({
  logos,
  logoSizes,
  tone = "light",
}: {
  logos: Logo[];
  logoSizes?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
      {logos.map((logo, i) => {
        const vein = VEIN_COLORS[i % VEIN_COLORS.length];
        return (
          <div
            key={logo.src}
            className={
              tone === "dark"
                ? "flex h-40 w-72 shrink-0 items-center justify-center rounded-xl border border-line bg-[#121022] p-6"
                : "group relative flex h-40 w-72 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-paper p-6 shadow-sm"
            }
          >
            <div className="relative h-full w-full">
              <Image
                src={logo.src}
                alt={logo.alt}
                fill
                sizes={logoSizes ?? "288px"}
                className={
                  tone === "dark"
                    ? "object-contain"
                    : // El estado "dormido" (gris, apagado) solo aplica en dispositivos con
                      // hover real — en touch nunca se dispara el hover que lo despierta, así
                      // que los logos quedarían apagados para siempre en mobile.
                      "object-contain [@media(hover:hover)]:grayscale-[85%] [@media(hover:hover)]:opacity-70 [@media(hover:hover)]:transition-[filter,opacity] [@media(hover:hover)]:duration-500 motion-reduce:[@media(hover:hover)]:transition-none [@media(hover:hover)]:group-hover:grayscale-0 [@media(hover:hover)]:group-hover:opacity-100"
                }
              />
            </div>
            {tone === "light" && (
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:scale-x-100"
                style={{ backgroundColor: vein }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function SiteFooter() {
  const t = useTranslations("Landing.SiteFooter");
  const contact = useTranslations("Landing.Contact");
  const organizer: Logo = {
    src: "/images/logos/camara-comercio-exterior.png",
    alt: t("organizerAlt"),
  };

  return (
    <footer className="border-t border-line px-6 py-16 sm:px-10 lg:px-16">
      {/* Acompañan, sponsors y organiza — cada grupo a todo el ancho, en una sola fila. */}
      <div className="mx-auto flex max-w-380 flex-col gap-10 border-b border-line pb-12">
        <div className="text-center">
          <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
            Acompañan
          </span>
          <LogoGrid logos={INSTITUTIONAL_PARTNERS} />
        </div>
        <div className="text-center">
          <span className="font-mono text-xs tracking-[0.25em] text-paper-dim uppercase">
            Nuestros sponsors
          </span>
          <LogoGrid logos={SPONSORS} />
        </div>
        <div className="text-center">
          <span className="font-mono text-xs font-semibold tracking-[0.25em] text-accent uppercase">
            {t("organizes")}
          </span>
          <LogoGrid logos={[organizer]} tone="dark" />
        </div>
      </div>

      <div className="mx-auto grid max-w-380 gap-8 border-b border-line py-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
            {contact("eyebrow")}
          </span>
          <h2 className="mt-3 font-display text-2xl font-medium text-paper sm:text-3xl">
            {contact("title")}
          </h2>
          <p className="mt-3 max-w-lg text-sm text-paper-dim">{contact("description")}</p>
          <div className="mt-6">
            <CtaLink href={WHATSAPP_URL} variant="outline" external>
              {contact("whatsappCta")}
            </CtaLink>
          </div>
        </div>

        <dl className="grid gap-5 sm:grid-cols-3 lg:col-span-7 lg:grid-cols-1">
          <div>
            <dt className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
              {contact("emailLabel")}
            </dt>
            <dd className="mt-1 text-sm text-paper">
              <a href="mailto:camaradecomercioexterior@gmail.com" className="hover:text-accent">
                camaradecomercioexterior@gmail.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
              {contact("phoneLabel")}
            </dt>
            <dd className="mt-1 text-sm text-paper">
              <a href="tel:+543884233539" className="hover:text-accent">
                +54 388 423-3539
              </a>
            </dd>
          </div>
          <div>
            <dt className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
              {contact("addressLabel")}
            </dt>
            <dd className="mt-1 text-sm text-paper">Belgrano 860, 2º piso — San Salvador de Jujuy</dd>
          </div>
        </dl>
      </div>

      <div className="mx-auto mt-10 flex max-w-380 flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <div className="inline-flex items-center self-center rounded-xl bg-paper p-3 sm:self-auto">
          <Image
            src="/images/logos/expojuy-lockup.svg"
            alt={t("brand")}
            width={198}
            height={114}
            className="h-14 w-auto"
          />
        </div>
        <p className="max-w-md text-sm text-paper-dim">{t("institutions")}</p>
        <div className="flex flex-col items-center gap-2 sm:items-end">
          <span className="font-mono text-xs tracking-[0.1em] text-paper-dim uppercase">
            {contact("socialTitle")}
          </span>
          <SocialLinks />
          <span className="font-mono text-xs text-paper-dim">{t("badge")}</span>
        </div>
      </div>
    </footer>
  );
}
