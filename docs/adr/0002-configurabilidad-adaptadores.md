# ADR-0002: Feature flags editoriales + arquitectura de puertos y adaptadores

**Estado:** Aceptada
**Fecha:** 2026-08-31

## Contexto

El sitio necesita poder activar/desactivar módulos sin depender de un deploy (lo administra personal no técnico de la Cámara/Ministerio), y no atarse de por vida a un proveedor externo puntual (pagos, CMS, IA, email, storage, auth, realtime), ya sea por costo, por caída de servicio, o porque el organismo público decida cambiar de proveedor más adelante.

## Decisión

Dos mecanismos separados, para no mezclar una decisión de negocio con una de ingeniería:

1. **Feature flags** en un documento único de Sanity ("Configuración del sitio"), chequeadas del lado del servidor (no solo ocultando UI), con invalidación de cache vía webhook y un kill-switch por variable de entorno para emergencias.
2. **Puertos y adaptadores**: el código de negocio depende de una interfaz propia (`PaymentProvider`, `AIAssistant`, `ContentSource`, etc.), nunca de un SDK externo directamente. Cada proveedor real es un adaptador intercambiable seleccionado por variable de entorno, validada con `@t3-oss/env-nextjs` + Zod al arrancar la app.

Detalle completo en [`docs/architecture.md`](../architecture.md#configurabilidad).

## Alternativas consideradas

- **Todo hardcodeado y ajustado por deploy** — descartado: cada cambio de contenido/alcance requeriría un desarrollador y un deploy, inviable para el ritmo de un evento de 4 días.
- **Feature flags con un servicio externo dedicado** (LaunchDarkly, etc.) — descartado por costo y complejidad innecesaria para 5-6 flags; Sanity ya es parte del stack.

## Consecuencias

Cambiar de proveedor o prender/apagar un módulo es un cambio de configuración, no de código. A cambio, cada nueva integración externa exige escribir su interfaz de puerto antes que el adaptador concreto — una disciplina que hay que sostener a propósito, no es gratis.
