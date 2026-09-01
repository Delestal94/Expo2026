# ADR-0001: Next.js + TypeScript + Supabase + Vercel como stack base

**Estado:** Aceptada
**Fecha:** 2026-08-31

## Contexto

Equipo de 2-4 personas con experiencia declarada en React/Next.js/TypeScript. Plazo de un mes para tener un sitio de producción si se gana el desafío (30/9), y 8 días para un mockup navegable + memoria descriptiva (8/9). No hay presupuesto ni tiempo para operar infraestructura propia.

## Decisión

Next.js 16 (App Router) + TypeScript de punta a punta. PostgreSQL vía Supabase (Auth + Storage + Realtime + pgvector incluidos). Hosting en Vercel. Detalle completo y justificación capa por capa en [`docs/architecture.md`](../architecture.md).

## Alternativas consideradas

- **AWS/Azure con servicios gestionados a mano** (ECS, RDS, IAM, etc.) — descartado: exige capacidad de DevOps que el equipo no tiene tiempo de construir en un mes, y no mejora la "factibilidad técnica" que evalúa el jurado.
- **Backend en otro lenguaje (Python/Node separado)** — descartado: duplica runtime y despliegue sin necesidad real dado el tamaño del proyecto.

## Consecuencias

Velocidad de ejecución alta desde el día uno. A cambio, dependencia inicial de Vercel/Supabase como proveedores — mitigado en [ADR-0002](0002-configurabilidad-adaptadores.md) con una capa de puertos y adaptadores que permite reemplazarlos sin reescribir lógica de negocio.
