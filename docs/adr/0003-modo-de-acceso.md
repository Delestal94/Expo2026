# ADR-0003: Modo de acceso (gratuito o pago) configurable

**Estado:** Aceptada — `ADMISSION_MODE=paid` como default de trabajo (revisado)
**Fecha:** 2026-09-01 · actualizada 2026-09-06

## Contexto

La edición 2024 de ExpoJuy cobraba entrada ($4.000 menores de 6 a 12 años y jubilados, $6.000 adultos, gratis menores de 5), con venta **online** — confirmado por dos fuentes independientes (Somos Jujuy y la cobertura completa del programa de actividades 2024). No hay confirmación pública de que la edición 2026 mantenga ese esquema (issue #3 del repo sigue abierto pidiéndola), pero el antecedente de cobro con venta online en al menos una edición reciente es sólido.

Actualización 2026-09-06: el equipo decidió dejar de tratar "gratis" como el default de trabajo y asumir en cambio **pago, igual que 2024** — es la hipótesis más probable dado el antecedente, y evita mostrar en la propuesta un modo que probablemente no sea el real. Esto no reemplaza la necesidad de la confirmación real de la Cámara (issue #3 sigue abierto): es la mejor asunción disponible mientras tanto.

## Decisión

El módulo de registro de acceso no asume ni gratuidad ni cobro de forma permanente: expone `ADMISSION_MODE: "free" | "paid"`, con **`paid` como valor por defecto** desde esta revisión. En modo `paid`, el flujo corre el checkout de Mercado Pago antes de emitir el QR; en modo `free`, el QR se emite al completar el formulario de registro. El resto del módulo (validación, aforo, PWA de escaneo) es idéntico en ambos casos — cambiar de modo es una variable de entorno, no un rediseño.

El adaptador de Mercado Pago (`src/lib/adapters/mercadopago-payment-provider.ts`) ya está escrito contra el puerto `PaymentProvider` y testeado con `fetch` mockeado, pero **no hay todavía una cuenta de Mercado Pago real para el proyecto** — sin `MERCADOPAGO_ACCESS_TOKEN` configurado, `charge()`/`verify()` fallan con un error explícito en vez de simular un pago. La UI de compra de entrada (`AccessInfo`) sigue mostrando "disponible en la próxima etapa" hasta que exista esa cuenta y se decida cómo persistir el estado del pago (issue #3/#7 siguen abiertos por esto).

## Alternativas consideradas

- Mantener `free` como default — descartada en esta revisión: el antecedente de 2024 hace más probable el esquema pago, y mostrar "gratis" por default es la asunción menos alineada con la evidencia disponible.
- Esperar la confirmación de la Cámara antes de tocar el default — descartada: no hay fecha cierta para esa confirmación y el cambio de modo es una variable de entorno, no un rediseño; no tiene sentido bloquear la decisión de trabajo por eso.

## Consecuencias

El sitio se construye y se muestra como acceso pago (mismo esquema que 2024) hasta nuevo aviso. Si la Cámara confirma un esquema distinto para 2026, el cambio es `ADMISSION_MODE=free` (o ajustar precios) — no una reescritura del módulo. El checkout real de Mercado Pago sigue bloqueado por la falta de una cuenta del proyecto: el adaptador está listo, falta la credencial. Esta ADR se actualiza si algún dato de estos cambia.
