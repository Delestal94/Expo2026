# ADR-0003: Modo de acceso (gratuito o pago) configurable

**Estado:** Propuesta — pendiente de confirmación con la Cámara de Comercio Exterior de Jujuy
**Fecha:** 2026-09-01

## Contexto

La edición 2024 de ExpoJuy cobraba entrada ($4.000 menores/jubilados, $6.000 adultos, gratis menores de 5 — fuente: Somos Jujuy). No hay confirmación pública de que la edición 2026 mantenga ese esquema, y el equipo tiene información contradictoria al respecto. Definir esto tarde no debería obligar a rediseñar el módulo de acceso.

## Decisión (propuesta)

El módulo de registro de acceso no asume ni gratuidad ni cobro: expone `ADMISSION_MODE: "free" | "paid"`. En modo `paid`, el flujo corre el checkout de Mercado Pago antes de emitir el QR; en modo `free`, el QR se emite al completar el formulario de registro. El resto del módulo (validación, aforo, PWA de escaneo) es idéntico en ambos casos.

## Alternativas consideradas

- Asumir gratuito y agregar cobro después si hace falta — riesgo: retrofit de un flujo de pago en un módulo no pensado para eso, bajo presión de tiempo.
- Asumir pago y quitarlo si resulta gratuito — riesgo menor, pero obliga a exponer un checkout que quizás nunca se use en el mockup del concurso.

## Consecuencias

Ninguna de las dos alternativas se descarta en código: la decisión real queda pendiente de un dato externo (respuesta de la Cámara) y no bloquea el desarrollo del resto del módulo. Actualizar esta ADR a "Aceptada" apenas se confirme el dato, antes del 8/9.
