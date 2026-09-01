# ADR-0004: Repositorio público, sin licencia declarada

**Estado:** Aceptada
**Fecha:** 2026-09-01

## Contexto

El repositorio se creó público y sin archivo `LICENSE`. Como este proyecto podría terminar siendo el sitio oficial de un organismo provincial (Ministerio de Desarrollo Económico y Producción de Jujuy), vale la pena decidir esto a propósito y no dejarlo como default accidental.

## Decisión

Mantener el repositorio **público, sin licencia**. Sin un archivo `LICENSE`, el copyright por defecto queda reservado para los autores (el equipo) — nadie puede legalmente reusar, copiar o redistribuir el código más allá de verlo, aunque el repo sea visible.

## Alternativas consideradas

- **Público con licencia MIT/permisiva** — descartada: cedería derechos de reuso comercial a terceros, algo que no tiene sentido si el código puede terminar siendo propiedad de un organismo público que paga por su desarrollo.
- **Privado hasta la entrega** — descartada por ahora: el jurado del Desafío Digital puede querer revisar el código real (no solo el mockup) como parte de "factibilidad técnica", y un repo privado se lo impediría salvo invitación manual caso por caso.

## Consecuencias

El código es visible (bueno para transparencia y para el jurado), pero legalmente sigue siendo propiedad exclusiva del equipo hasta que se decida lo contrario explícitamente — por ejemplo, si el Ministerio exige una cesión de derechos al ganar el desafío, momento en el que esta ADR debería actualizarse o reemplazarse.
