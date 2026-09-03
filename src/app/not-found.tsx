import { getTranslations } from "next-intl/server";
import { CtaLink } from "@/modules/landing";

const STRATA_COLORS = [
  "var(--color-cyan)",
  "var(--color-violet)",
  "var(--color-magenta)",
  "var(--color-lavender)",
];

/**
 * La franja replica el lenguaje de las bandas de About (afloramiento), pero
 * a un estrato le falta el color: un corte dashed en el lugar del bloque
 * que "se erosionó", en vez de un ícono o una ilustración genérica de 404.
 */
function StrataGap() {
  return (
    <div
      aria-hidden="true"
      className="flex h-16 w-full overflow-hidden rounded-xl border border-line sm:h-20"
    >
      {STRATA_COLORS.map((color, i) =>
        i === 2 ? (
          <div
            key="gap"
            className="flex-[1.3] border-x border-dashed border-paper-dim/40 bg-[repeating-linear-gradient(135deg,transparent,transparent_6px,var(--color-line)_6px,var(--color-line)_7px)]"
          />
        ) : (
          <div key={color} className="flex-1" style={{ backgroundColor: color }} />
        ),
      )}
    </div>
  );
}

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <main className="flex min-h-svh flex-col items-center justify-center gap-10 px-6 py-24 text-center sm:px-10">
      <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
        {t("eyebrow")}
      </span>

      <h1 className="flex flex-col items-center text-balance font-display leading-[0.95] font-medium text-paper">
        <span className="text-3xl sm:text-4xl">{t("introLine")}</span>
        <span className="my-1 text-[clamp(3.5rem,14vw,8rem)] leading-[0.85] font-black tracking-tight text-accent sm:my-2">
          {t("emphasisLine")}
        </span>
        <span className="text-3xl sm:text-4xl">{t("outroLine")}</span>
      </h1>

      <p className="max-w-md text-balance text-paper-dim">{t("description")}</p>

      <div className="w-full max-w-sm">
        <StrataGap />
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <CtaLink href="/">{t("ctaHome")}</CtaLink>
        <CtaLink href="/#acceso" variant="outline">
          {t("ctaAccess")}
        </CtaLink>
      </div>
    </main>
  );
}
