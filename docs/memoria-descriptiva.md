# Memoria descriptiva — Sitio oficial ExpoJuy 2026

**Desafío Digital ExpoJuy 2026** · Cámara de Comercio Exterior de Jujuy · Dirección Provincial de Servicios Basados en el Conocimiento · Clustear
**Equipo:** [Delestal94](https://github.com/Delestal94) · Maximiliano Lezano
**Repositorio:** [github.com/Delestal94/Expo2026](https://github.com/Delestal94/Expo2026)
**🌐 Prototipo en vivo:** **https://expojuy2026.vercel.app**

---

## 1. Resumen

No presentamos una landing institucional. Presentamos la infraestructura digital de un evento que cambió de naturaleza: ExpoJuy pasa de dos semanas de exposición a cuatro días de altísima intensidad, con rondas de negocios internacionales por la mañana y expo por la tarde, foco declarado en minería del litio y comercio exterior, y ambición explícita de integrar el Corredor Bioceánico de Capricornio. Un sitio que solo informe fechas y sponsors no le sirve a esa versión del evento.

Nuestra propuesta se apoya en tres decisiones que atraviesan todo el proyecto:

1. **Una identidad visual propia**, no una plantilla — "Estratos", un lenguaje de bandas de color en capas que ahora usa la paleta oficial de marca de ExpoJuy (coherente con Instagram), no una paleta genérica de landing corporativa.
2. **Una arquitectura configurable de punta a punta** — cada módulo se activa o desactiva sin deploy, y ningún proveedor externo queda escrito a mano en el código.
3. **Un prototipo funcional real**, no solo un mockup estático — el repositorio público, con CI corriendo en cada cambio, es en sí mismo evidencia de factibilidad técnica.

## 2. El contexto que motiva el diseño

La 17ª edición (9–12 de octubre, Ciudad Cultural) cambia de formato: de dos semanas a cuatro días "muy intensos, porque se va a duplicar la actividad" (Jorge Gurrieri, presidente de la Cámara de Comercio Exterior de Jujuy). La actividad ya no se concentra solo a la tarde — hay ronda de negocios por la mañana y expo por la tarde. El eje minero crece con el RIGI aprobado para Exar, que duplicará su producción de litio a 45.000 toneladas, y la organización ya busca extender la promoción del evento a Salta, Tucumán, Córdoba, Buenos Aires, Chile y Paraguay bajo la lógica del Corredor Bioceánico.

Ese cambio de formato exige del sitio web cosas que una landing tradicional no resuelve: coordinación real de encuentros de negocios, información confiable durante una ventana de tiempo corta, y alcance a audiencias que no hablan español.

## 3. La propuesta: concepto "Estratos"

El nombre y el lenguaje visual vienen de un hecho concreto: Jujuy es, literalmente, capas. La Quebrada de Humahuaca expone en el paisaje millones de años de estratos minerales de colores — y la provincia hoy vive otra clase de estratificación, la del litio bajo tierra que sostiene buena parte de la conversación económica de esta edición.

Elegimos que esa imagen fuera el sitio, no una ilustración de portada: el fondo del hero es un canvas animado con bandas de color fluyendo en vez de estar quietas — porque el evento tampoco está quieto este año. Los cuatro colores de esas bandas son los mismos del isotipo oficial de ExpoJuy en Instagram (@expojuy), para que la web y las redes se lean como una sola marca.

## 4. Organización del contenido

El sitio es una sola página de scroll con anclas, más dos rutas secundarias (`/galeria`, `/cuenta`). El orden de las secciones sigue un embudo deliberado: primero el motivo para venir, después la logística para venir.

| Orden | Sección | Por qué ahí |
|---|---|---|
| 1 | Inicio | Identidad, cuenta regresiva y llamada a la acción — la primera impresión. |
| 2 | Sobre ExpoJuy 2026 | El contexto que justifica todo lo demás: por qué el evento cambió de formato. |
| 3 | Ejes | Los 4 ejes productivos de esta edición, en detalle. |
| 4 | Noticias | Prueba de que el evento es real y está en marcha ahora — cobertura de prensa real más novedades del sitio. |
| 5 | Galería | Prueba social de la edición anterior. |
| 6 | Mapa | El predio, ya como algo concreto de recorrer. |
| 7 | Agenda | Qué pasa cada uno de los 4 días. |
| 8 | Expositores | El directorio y las rondas de negocios — el corazón comercial del evento. |
| 9 | Acceso y cómo llegar | Entradas, ubicación y cómo postularse como proveedor. |
| 10 | Contacto | Vías directas de comunicación institucional. |
| 11 | Preguntas frecuentes | Últimas dudas antes de irse. |
| 12 | Pie de página | Sponsors, organiza y redes sociales — presente en todo momento, no solo al final. |

El índice de secciones (`SectionNav`) navega por ancla y resalta la sección activa mientras se hace scroll, así que el orden también funciona como mapa de navegación directa, no solo como guion de lectura.

## 5. Identidad visual

| Elemento | Elección | Motivo |
|---|---|---|
| Paleta | Fondo casi negro (cielo de altura) + cian, violeta, magenta y lavanda — los 4 colores del isotipo "J" de ExpoJuy — con el cian también como acento de acción | Coherencia de marca real entre el sitio y el Instagram oficial del evento, no una paleta inventada |
| Tipografía display | `Unbounded` | Geométrica, con peso y carácter propio — no una fuente "segura" de plantilla |
| Tipografía de texto | `Manrope` | Alta legibilidad sin perder calidez |
| Tipografía de datos | `JetBrains Mono` | Cifras, fechas y etiquetas con precisión técnica |
| Motion | Canvas 2D con bandas fluyendo + cuenta regresiva real al 9/10 | Refuerza el concepto sin depender de una librería pesada; respeta `prefers-reduced-motion` |

Capturas del prototipo real (no wireframes) en la sección 12.

## 6. Arquitectura y factibilidad técnica

Documento técnico completo en [`docs/architecture.md`](architecture.md) y en la [versión presentable](https://claude.ai/code/artifact/38abc151-dbcc-4fe5-9861-d5aa012d651f). Resumen de las decisiones que más pesan en la evaluación de factibilidad:

- **Stack**: Next.js 16 + TypeScript de punta a punta, PostgreSQL vía Supabase, Vercel — elegido por velocidad de ejecución real para un equipo chico en un plazo corto, no por moda.
- **Nada hardcodeado**: cada módulo funcional (registro de acceso, portal de expositores, asistente IA, mapa interactivo) es una *feature flag* editable sin deploy, con kill-switch de emergencia.
- **Nada atado a un proveedor**: pagos, CMS, IA, email, storage y realtime están detrás de una interfaz propia (arquitectura de puertos y adaptadores) — cambiar de proveedor es escribir un adaptador nuevo, no reescribir la lógica de negocio.
- **Nada acoplado entre módulos**: cada capacidad de negocio vive en su propia carpeta con un único punto de entrada público, verificado por una regla de lint que rompe el build si se viola.
- **Multiidioma real**: español, inglés, portugués y mandarín priorizados por la audiencia real del evento (Corredor Bioceánico, inversión minera), no por una lista genérica de "idiomas más hablados".

Evidencia de que esto no es solo un documento: el repositorio tiene CI corriendo lint, type-check, tests y build en cada cambio, protección de ramas real, y un historial de decisiones (ADRs) que registra cada elección con su fecha y su porqué.

## 7. Funcionalidades propuestas

| Módulo | Qué hace | Estado en este prototipo |
|---|---|---|
| Landing | Identidad, ejes, noticias, contacto y FAQ | **Construido** — ver sección 12 |
| Registro de acceso | QR de ingreso, gratuito o pago según `ADMISSION_MODE` (ver §8) | **Construido** (alta de cuenta, login y QR de ingreso en modo gratuito); cobro en modo pago (Mercado Pago), pendiente |
| Portal de expositores + rondas de negocios | Directorio con buscador y filtro por eje, matching por rubro/país, agenda de reuniones | **Construido** (datos de ejemplo) — ver sección 12 |
| Agenda de actividades | Estructura diaria confirmada (rondas AM / expo PM) para los 4 días, con selector interactivo | **Construido** — la grilla horaria detallada de charlas y shows la publica la organización más cerca de la fecha |
| Asistente con IA | Responde sobre agenda y ubicación con el contenido real del sitio (RAG), deriva a humano fuera de su alcance | Diseñado, pendiente de implementación |
| Mapa interactivo | Plano calcado del CAD de Ciudad Cultural, con más de 200 zonas filtrables por categoría | **Construido** — ver sección 12 |

## 8. Dos decisiones que no bloquearon el avance

**Acceso general.** La edición 2024 fue paga, con venta de entradas online ($4.000 menores/jubilados, $6.000 adultos, sin cargo menores de 5). No hay confirmación pública de que 2026 mantenga ese esquema. En vez de esperar esa respuesta para seguir construyendo, diseñamos el registro de acceso con el cobro como un interruptor de configuración (`ADMISSION_MODE: gratuita | paga`) — el sitio muestra los valores de referencia 2024 y ya está preparado para cobrar por Mercado Pago apenas se confirme el esquema 2026, sin rediseño. Detalle en [ADR-0003](adr/0003-modo-de-acceso.md).

**Alta de expositores.** Los proveedores no se registran en el sitio: se postulan por la convocatoria oficial de la Cámara (formulario de Google) y por WhatsApp. El portal de expositores deriva a esos canales reales en vez de duplicar un formulario propio. Detalle en [ADR-0005](adr/0005-acceso-libre-sin-registro.md).

## 9. Uso responsable de IA

El asistente conversacional (módulo `aiAssistant`) se diseñó con estas reglas, no como una ocurrencia tardía:

- **Transparencia**: se identifica como asistente virtual desde el primer mensaje.
- **Alcance acotado**: responde solo con contenido real del sitio (RAG), nunca inventa horarios o datos de expositores; deriva a contacto humano fuera de su dominio.
- **Privacidad**: no retiene conversaciones para entrenamiento, no pide datos personales innecesarios (Ley 25.326).
- **Control de costo/abuso**: rate limiting en el endpoint, y puede apagarse por completo (flag + kill-switch) sin afectar el resto del sitio.

También lo aplicamos hacia adentro: usamos herramientas de IA como asistencia de desarrollo para este prototipo (código, documentación, exploración de diseño), bajo criterio y revisión del equipo en cada decisión — no como reemplazo de él. Cada elección de arquitectura y diseño en este documento fue tomada y validada por el equipo, no generada sin supervisión.

## 10. Accesibilidad

- Animación del hero respeta `prefers-reduced-motion` (se congela en un cuadro estático).
- Jerarquía semántica real (`h1`–`h3`, `nav`, `footer`, `dl` para estadísticas), roles ARIA en los controles interactivos (filtros, tabs de agenda, acordeón de FAQ) y foco visible en todos ellos.
- Contraste verificado entre texto y fondo en la paleta oscura.
- Todo lo interactivo funciona también por teclado: el mapa, el buscador y filtro de expositores, los tabs de la agenda y el acordeón de preguntas frecuentes.
- El asistente de IA es un atajo, no una barrera: toda la información también está disponible sin él.

## 11. Estrategia responsive

No hay un breakpoint "mobile" tratado como una versión reducida del sitio de escritorio — cada sección resuelve su propio layout en los tres anchos:

- **Grillas fluidas con Tailwind** (`sm:`/`lg:`), no un rediseño paralelo: las mismas secciones (Sobre, Ejes, Expositores, Agenda) pasan de una columna en mobile a grillas de 2 o 3 columnas en desktop.
- **Patrones de contenido largo resueltos por dispositivo, no ocultos**: la Galería y el índice de secciones (`SectionNav`) son una tira con scroll horizontal y *snap* en mobile, y una grilla o riel fijo en desktop — mismo contenido, mecánica de navegación distinta según el espacio disponible.
- **Tipografía fluida con `clamp()`** en los títulos más grandes (Hero, About), para que el texto no se desborde ni quede minúsculo en los extremos del rango de anchos.
- **Objetivos táctiles de tamaño real** en todos los controles interactivos (filtros, tabs, acordeón), sin depender de hover para funciones esenciales — el estado "dormido" de los logos del pie, por ejemplo, solo se activa en dispositivos con hover real, así nunca queda un logo apagado de forma permanente en mobile.

Verificado manualmente en 390px (mobile), 768px (tablet) y 1440px/1920px (desktop) en cada sección nueva antes de integrarla.

## 12. Repositorio y prototipo funcional

- **Sitio en vivo: [expojuy2026.vercel.app](https://expojuy2026.vercel.app)** — no hace falta clonar nada para navegarlo.
- Repositorio público: [github.com/Delestal94/Expo2026](https://github.com/Delestal94/Expo2026) — código real, no solo mockup.
- CI en verde en cada cambio: [Actions](https://github.com/Delestal94/Expo2026/actions).
- Board de tareas mapeado al roadmap: [Project ExpoJuy 2026](https://github.com/users/Delestal94/projects/1).
- Documentación técnica completa: [`docs/architecture.md`](architecture.md), [decisiones de arquitectura](adr/).

## 13. Roadmap

| Fecha | Fase | Entregable |
|---|---|---|
| 31/08 – 08/09 | Fase 0 | Este documento + mockup navegable |
| 11/09 – 20/09 | Fase 1 | Landing completa + CMS |
| 20/09 – 27/09 | Fase 2 | Registro de acceso + portal de expositores |
| 27/09 – 30/09 | Fase 3 | Asistente IA + entrega final |

## 14. Equipo

| Integrante | Rol |
|---|---|
| Delestal94 | _(completar)_ |
| Maximiliano Lezano | _(completar)_ |
