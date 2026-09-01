import { z } from "zod";

const featureFlagsSchema = z.object({
  visitorAccess: z.boolean(),
  exhibitorPortal: z.boolean(),
  businessRounds: z.boolean(),
  aiAssistant: z.boolean(),
  interactiveMap: z.boolean(),
});

export type FeatureFlags = z.infer<typeof featureFlagsSchema>;

const defaultFlags: FeatureFlags = {
  visitorAccess: true,
  exhibitorPortal: false,
  businessRounds: false,
  aiAssistant: false,
  interactiveMap: false,
};

/**
 * Placeholder: hoy devuelve los defaults locales.
 * Cuando exista el adaptador de Sanity (ADR-0002), esta función lee el
 * documento "Configuración del sitio" y cachea el resultado en Redis,
 * invalidado por webhook al publicar.
 */
export async function getFeatureFlags(): Promise<FeatureFlags> {
  return featureFlagsSchema.parse(defaultFlags);
}
