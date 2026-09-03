import Image from "next/image";
import { useTranslations } from "next-intl";
import { INSTITUTIONAL_PARTNERS, SPONSORS, type Logo } from "./partners-data";

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

      <div className="mt-10 flex flex-col gap-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
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
        <span className="font-mono text-xs text-paper-dim">{t("badge")}</span>
      </div>
    </footer>
  );
}
