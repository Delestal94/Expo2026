# ADR-0005: Expositores/proveedores se postulan por canales externos al sitio

**Estado:** Aceptada
**Fecha:** 2026-09-01

> Esta ADR se planteó originalmente como "acceso libre para todos, sin registro" — el equipo encontró después evidencia sólida (cobertura del programa completo de la edición 2024) de que el ingreso general **sí fue pago con venta online**, contradiciendo esa primera versión. Esa parte quedó revertida — ver [ADR-0003](0003-modo-de-acceso.md), que sigue vigente con su modelo configurable `ADMISSION_MODE`. Lo que sí se confirmó y se mantiene acá es la parte de expositores/proveedores.

## Contexto

Los expositores/proveedores de ExpoJuy no se dan de alta a través del sitio web: se postulan por un formulario oficial de Google ("Convocatoria proveedores", `forms.gle/ChErBuBgp3QfuxRr7`) y por contacto directo de WhatsApp con la Cámara de Comercio Exterior (3884212955). Esto es independiente de si el ingreso del público general es pago o gratuito — son dos flujos distintos.

## Decisión

El sitio **no construye un formulario propio de alta de expositores**. En su lugar, deriva a los canales oficiales existentes:

- CTA principal ("Sumar mi empresa como proveedora") → formulario oficial de Google Forms.
- Contacto directo → WhatsApp de la Cámara.

El adaptador de `AuthProvider`/Supabase construido en `src/lib/adapters` (ver PR previo) queda como capacidad técnica disponible pero no se conecta a una pantalla de alta de expositores — no aplica a este flujo, que es externo al sitio.

## Alternativas consideradas

- Replicar el formulario de proveedores dentro del sitio (formulario propio + base de datos) — descartada: el canal oficial ya funciona y está establecido entre la Cámara y las empresas; duplicarlo agrega complejidad sin necesidad real para el mockup del concurso.

## Consecuencias

- El módulo `exhibitors` (portal + matching) sigue teniendo sentido como **directorio y propuesta de valor** para el jurado, pero el alta real de una empresa nueva pasa por fuera del sitio — el portal muestra expositores ya confirmados por la Cámara, no un flujo de autoregistro.
- Esto no afecta al público general: el modo de acceso (gratis o pago) se resuelve en [ADR-0003](0003-modo-de-acceso.md), sin relación con esta decisión.
