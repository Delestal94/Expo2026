# ADR-0003: Modo de acceso (gratuito o pago) configurable

**Estado:** Aceptada — `ADMISSION_MODE=free` como default provisorio
**Fecha:** 2026-09-01 · actualizada 2026-09-01

## Contexto

La edición 2024 de ExpoJuy cobraba entrada ($4.000 menores/jubilados, $6.000 adultos, gratis menores de 5 — fuente: Somos Jujuy). No hay confirmación pública de que la edición 2026 mantenga ese esquema. Ante la falta de esa confirmación, el equipo decidió avanzar con acceso gratuito como supuesto de trabajo, sin esperar la respuesta de la Cámara para seguir construyendo.

## Decisión

El módulo de registro de acceso no asume ni gratuidad ni cobro de forma permanente: expone `ADMISSION_MODE: "free" | "paid"`, con **`free` como valor por defecto** mientras no haya confirmación oficial. En modo `paid`, el flujo corre el checkout de Mercado Pago antes de emitir el QR; en modo `free` (el actual), el QR se emite al completar el formulario de registro. El resto del módulo (validación, aforo, PWA de escaneo) es idéntico en ambos casos — cambiar de modo es una variable de entorno, no un rediseño.

## Alternativas consideradas

- Esperar la confirmación de la Cámara antes de avanzar — descartada: bloquearía el desarrollo del módulo sin necesidad, dado que el cambio de modo no requiere retrabajo.
- Asumir pago por defecto — descartada: expondría un flujo de checkout que probablemente no se usa en el mockup del concurso, sin beneficio real.

## Consecuencias

El sitio se construye y se muestra como acceso gratuito hasta nuevo aviso. Si la Cámara confirma que 2026 es pago, el cambio es `ADMISSION_MODE=paid` + activar el adaptador de Mercado Pago — no una reescritura del módulo. Esta ADR se actualiza si ese dato cambia.
