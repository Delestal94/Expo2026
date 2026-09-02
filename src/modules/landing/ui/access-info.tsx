import { getFeatureFlags } from "@/lib/config/flags";
import { CtaLink } from "./cta-link";

const PROVIDERS_FORM_URL = "https://forms.gle/ChErBuBgp3QfuxRr7";
const WHATSAPP_URL = "https://wa.me/5493884212955";

const REFERENCE_PRICING = [
  { label: "Menores (6 a 12 años) y jubilados", price: "$4.000" },
  { label: "Adultos", price: "$6.000" },
  { label: "Menores de 5 años", price: "Sin cargo" },
];

export async function AccessInfo() {
  const flags = await getFeatureFlags();

  return (
    <section
      id="acceso"
      className="border-y border-line px-6 py-24 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-xs tracking-[0.25em] text-accent uppercase">
          Acceso e ingreso
        </span>
        <h2 className="mx-auto mt-6 text-balance font-display text-3xl font-medium text-paper sm:text-4xl">
          El ingreso general fue pago en las últimas ediciones — 2026 se
          confirma pronto.
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-paper-dim">
          En 2024 la entrada se vendía online con estos valores de
          referencia. El registro de acceso (QR + Mercado Pago) ya está
          preparado para funcionar igual, gratuito o pago, apenas la
          Cámara confirme el esquema 2026 — ver{" "}
          <span className="font-mono">ADR-0003</span>.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-xl gap-3 sm:grid-cols-3">
        {REFERENCE_PRICING.map((tier) => (
          <div
            key={tier.label}
            className="rounded-2xl border border-line bg-[#121022] p-5 text-center"
          >
            <div className="font-mono text-2xl font-semibold text-paper tabular-nums">
              {tier.price}
            </div>
            <div className="mt-2 text-xs text-paper-dim">{tier.label}</div>
          </div>
        ))}
      </div>

      <div className="mx-auto mt-6 max-w-xl text-center">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-line px-5 py-2.5 font-body text-sm font-semibold text-paper-dim">
            Comprar entrada — disponible en la próxima etapa
          </span>
          {flags.visitorAccess && (
            <CtaLink href="/cuenta" size="sm">
              Crear tu cuenta de visitante
            </CtaLink>
          )}
        </div>
        <p className="mt-2 font-mono text-xs text-paper-dim">
          {flags.visitorAccess &&
            "Podés crear tu cuenta ahora — la compra de la entrada se habilita en la próxima etapa. "}
          Precios de referencia, edición 2024. Sujeto a confirmación 2026.
        </p>
      </div>

      <div className="mx-auto mt-14 max-w-md rounded-2xl border border-line bg-[#121022] p-6 text-left">
        <h3 className="font-display text-lg font-medium text-paper">
          ¿Tu empresa quiere participar como proveedora?
        </h3>
        <p className="mt-2 text-sm text-paper-dim">
          Los expositores se postulan por la convocatoria oficial de la
          Cámara, no desde este sitio.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <CtaLink href={PROVIDERS_FORM_URL} size="sm" external>
            Formulario de proveedores
          </CtaLink>
          <CtaLink href={WHATSAPP_URL} variant="outline" size="sm" external>
            WhatsApp: 388 421-2955
          </CtaLink>
        </div>
      </div>
    </section>
  );
}
