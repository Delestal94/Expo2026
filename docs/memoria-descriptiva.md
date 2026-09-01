# Memoria descriptiva — Sitio oficial ExpoJuy 2026

**Desafío Digital ExpoJuy 2026** · Cámara de Comercio Exterior de Jujuy · Dirección Provincial de Servicios Basados en el Conocimiento · Clustear
**Equipo:** [Delestal94](https://github.com/Delestal94) · Maximiliano Lezano
**Repositorio:** [github.com/Delestal94/Expo2026](https://github.com/Delestal94/Expo2026)
**🌐 Prototipo en vivo:** **https://expojuy2026.vercel.app**

---

## 1. Resumen

No presentamos una landing institucional. Presentamos la infraestructura digital de un evento que cambió de naturaleza: ExpoJuy pasa de dos semanas de exposición a cuatro días de altísima intensidad, con rondas de negocios internacionales por la mañana y expo por la tarde, foco declarado en minería del litio y comercio exterior, y ambición explícita de integrar el Corredor Bioceánico de Capricornio. Un sitio que solo informe fechas y sponsors no le sirve a esa versión del evento.

Nuestra propuesta se apoya en tres decisiones que atraviesan todo el proyecto:

1. **Una identidad visual propia**, no una plantilla — "Estratos", inspirada en las bandas minerales del Cerro de los Siete Colores.
2. **Una arquitectura configurable de punta a punta** — cada módulo se activa o desactiva sin deploy, y ningún proveedor externo queda escrito a mano en el código.
3. **Un prototipo funcional real**, no solo un mockup estático — el repositorio público, con CI corriendo en cada cambio, es en sí mismo evidencia de factibilidad técnica.

## 2. El contexto que motiva el diseño

La 17ª edición (9–12 de octubre, Ciudad Cultural) cambia de formato: de dos semanas a cuatro días "muy intensos, porque se va a duplicar la actividad" (Jorge Gurrieri, presidente de la Cámara de Comercio Exterior de Jujuy). La actividad ya no se concentra solo a la tarde — hay ronda de negocios por la mañana y expo por la tarde. El eje minero crece con el RIGI aprobado para Exar, que duplicará su producción de litio a 45.000 toneladas, y la organización ya busca extender la promoción del evento a Salta, Tucumán, Córdoba, Buenos Aires, Chile y Paraguay bajo la lógica del Corredor Bioceánico.

Ese cambio de formato exige del sitio web cosas que una landing tradicional no resuelve: coordinación real de encuentros de negocios, información confiable durante una ventana de tiempo corta, y alcance a audiencias que no hablan español.

## 3. La propuesta: concepto "Estratos"

El nombre y el lenguaje visual vienen de un hecho concreto: Jujuy es, literalmente, capas. La Quebrada de Humahuaca expone en el paisaje millones de años de estratos minerales de colores — y la provincia hoy vive otra clase de estratificación, la del litio bajo tierra que sostiene buena parte de la conversación económica de esta edición.

Elegimos que esa imagen fuera el sitio, no una ilustración de portada: el fondo del hero es un canvas animado con las bandas de color reales de esa paleta geológica, fluyendo en vez de estar quietas — porque el evento tampoco está quieto este año.

## 4. Identidad visual

| Elemento | Elección | Motivo |
|---|---|---|
| Paleta | Fondo casi negro (cielo de altura) + ocre, terracota, violeta, verde-azulado, rosa (bandas minerales) + teal digital como acento de acción | Ancla el sitio en el paisaje real de la Quebrada, no en una paleta corporativa genérica |
| Tipografía display | `Unbounded` | Geométrica, con peso y carácter propio — no una fuente "segura" de plantilla |
| Tipografía de texto | `Manrope` | Alta legibilidad sin perder calidez |
| Tipografía de datos | `JetBrains Mono` | Cifras, fechas y etiquetas con precisión técnica |
| Motion | Canvas 2D con bandas fluyendo + cuenta regresiva real al 9/10 | Refuerza el concepto sin depender de una librería pesada; respeta `prefers-reduced-motion` |

Capturas del prototipo real (no wireframes) en la sección 10.

## 5. Arquitectura y factibilidad técnica

Documento técnico completo en [`docs/architecture.md`](architecture.md) y en la [versión presentable](https://claude.ai/code/artifact/38abc151-dbcc-4fe5-9861-d5aa012d651f). Resumen de las decisiones que más pesan en la evaluación de factibilidad:

- **Stack**: Next.js 16 + TypeScript de punta a punta, PostgreSQL vía Supabase, Vercel — elegido por velocidad de ejecución real para un equipo chico en un plazo corto, no por moda.
- **Nada hardcodeado**: cada módulo funcional (registro de acceso, portal de expositores, asistente IA, mapa interactivo) es una *feature flag* editable sin deploy, con kill-switch de emergencia.
- **Nada atado a un proveedor**: pagos, CMS, IA, email, storage y realtime están detrás de una interfaz propia (arquitectura de puertos y adaptadores) — cambiar de proveedor es escribir un adaptador nuevo, no reescribir la lógica de negocio.
- **Nada acoplado entre módulos**: cada capacidad de negocio vive en su propia carpeta con un único punto de entrada público, verificado por una regla de lint que rompe el build si se viola.
- **Multiidioma real**: español, inglés, portugués y mandarín priorizados por la audiencia real del evento (Corredor Bioceánico, inversión minera), no por una lista genérica de "idiomas más hablados".

Evidencia de que esto no es solo un documento: el repositorio tiene CI corriendo lint, type-check, tests y build en cada cambio, protección de ramas real, y un historial de decisiones (ADRs) que registra cada elección con su fecha y su porqué.

## 6. Funcionalidades propuestas

| Módulo | Qué hace | Estado en este prototipo |
|---|---|---|
| Landing | Identidad, agenda, ejes del evento | **Construido** — ver sección 10 |
| Registro de acceso | QR de ingreso, gratuito o pago según `ADMISSION_MODE` (ver §7) | Diseñado, pendiente de implementación |
| Portal de expositores + rondas de negocios | Perfil de empresa, matching por rubro/país, agenda de reuniones | **Construido** (mockup con datos de ejemplo) — ver sección 10 |
| Asistente con IA | Responde sobre agenda y ubicación con el contenido real del sitio (RAG), deriva a humano fuera de su alcance | Diseñado, pendiente de implementación |
| Mapa interactivo | Plano de Ciudad Cultural como datos, con estado de sesiones en vivo | **Construido** (mockup con datos de ejemplo) — ver sección 10 |

## 7. Dos decisiones que no bloquearon el avance

**Acceso general.** La edición 2024 fue paga, con venta de entradas online ($4.000 menores/jubilados, $6.000 adultos, sin cargo menores de 5). No hay confirmación pública de que 2026 mantenga ese esquema. En vez de esperar esa respuesta para seguir construyendo, diseñamos el registro de acceso con el cobro como un interruptor de configuración (`ADMISSION_MODE: gratuita | paga`) — el sitio muestra los valores de referencia 2024 y ya está preparado para cobrar por Mercado Pago apenas se confirme el esquema 2026, sin rediseño. Detalle en [ADR-0003](adr/0003-modo-de-acceso.md).

**Alta de expositores.** Los proveedores no se registran en el sitio: se postulan por la convocatoria oficial de la Cámara (formulario de Google) y por WhatsApp. El portal de expositores deriva a esos canales reales en vez de duplicar un formulario propio. Detalle en [ADR-0005](adr/0005-acceso-libre-sin-registro.md).

## 8. Uso responsable de IA

El asistente conversacional (módulo `aiAssistant`) se diseñó con estas reglas, no como una ocurrencia tardía:

- **Transparencia**: se identifica como asistente virtual desde el primer mensaje.
- **Alcance acotado**: responde solo con contenido real del sitio (RAG), nunca inventa horarios o datos de expositores; deriva a contacto humano fuera de su dominio.
- **Privacidad**: no retiene conversaciones para entrenamiento, no pide datos personales innecesarios (Ley 25.326).
- **Control de costo/abuso**: rate limiting en el endpoint, y puede apagarse por completo (flag + kill-switch) sin afectar el resto del sitio.

También lo aplicamos hacia adentro: usamos herramientas de IA como asistencia de desarrollo para este prototipo (código, documentación, exploración de diseño), bajo criterio y revisión del equipo en cada decisión — no como reemplazo de él. Cada elección de arquitectura y diseño en este documento fue tomada y validada por el equipo, no generada sin supervisión.

## 9. Accesibilidad

- Animación del hero respeta `prefers-reduced-motion` (se congela en un cuadro estático).
- Jerarquía semántica real (`h1`–`h3`, `nav`, `footer`, `dl` para estadísticas).
- Contraste verificado entre texto y fondo en la paleta oscura.
- El asistente de IA es un atajo, no una barrera: toda la información también está disponible sin él.

## 10. Repositorio y prototipo funcional

- **Sitio en vivo: [expojuy2026.vercel.app](https://expojuy2026.vercel.app)** — no hace falta clonar nada para navegarlo.
- Repositorio público: [github.com/Delestal94/Expo2026](https://github.com/Delestal94/Expo2026) — código real, no solo mockup.
- CI en verde en cada cambio: [Actions](https://github.com/Delestal94/Expo2026/actions).
- Board de tareas mapeado al roadmap: [Project ExpoJuy 2026](https://github.com/users/Delestal94/projects/1).
- Documentación técnica completa: [`docs/architecture.md`](architecture.md), [decisiones de arquitectura](adr/).

## 11. Roadmap

| Fecha | Fase | Entregable |
|---|---|---|
| 31/08 – 08/09 | Fase 0 | Este documento + mockup navegable |
| 11/09 – 20/09 | Fase 1 | Landing completa + CMS |
| 20/09 – 27/09 | Fase 2 | Registro de acceso + portal de expositores |
| 27/09 – 30/09 | Fase 3 | Asistente IA + mapa interactivo + entrega final |

## 12. Equipo

| Integrante | Rol |
|---|---|
| Delestal94 | _(completar)_ |
| Maximiliano Lezano | _(completar)_ |
