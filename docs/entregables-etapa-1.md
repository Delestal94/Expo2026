# Entregables — Etapa 1

**Desafío Digital ExpoJuy 2026** · Equipo Delestal94 + MaxLezano
Cierre de presentación: **8 de septiembre de 2026, 23:59 hs** (hora oficial de la República Argentina)

Este documento es el índice formal de todo lo que presentamos, mapeado uno a uno contra lo que exigen las Bases y las Consignas Técnicas. Nada de lo que se pide está escondido en un subdirectorio.

---

## Los 7 ítems del Anexo III

### 1 · Formulario de inscripción

✅ **Enviado** por el formulario oficial habilitado por la organización, dentro del plazo del Art. 6 de las Bases. La inscripción implica la aceptación plena de las Bases y Condiciones (Art. 26).

### 2 · Integrantes del equipo

✅ Equipo de **2 integrantes**, dentro del mínimo de 2 y máximo de 4 que exige el Art. 5 de las Bases. Ninguno integra otro equipo.

| Integrante | GitHub | Rol |
|---|---|---|
| **Miguel Ignacio Delestal** | [@Delestal94](https://github.com/Delestal94) | **Representante del equipo** e interlocutor oficial · Arquitectura y desarrollo |
| **Maximiliano Lezano** | [@MaxLezano](https://github.com/MaxLezano) | Desarrollo · Diseño UX/UI |

Ambos cumplen los requisitos de elegibilidad del Art. 4 (mayores de 18 años, residentes en la provincia de Jujuy, perfil de desarrollo web y diseño UX/UI).

### 3 · Link al mockup / prototipo navegable

✅ Las Consignas §4.1 admiten mockup, prototipo o maqueta navegable, y permiten opcionalmente un desarrollo funcional en GitHub. **Presentamos las dos cosas:**

| Formato | Link | Qué es |
|---|---|---|
| 🌐 **Prototipo funcional navegable** | **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)** | El sitio real, funcionando. No hace falta instalar nada. |
| 🎨 **Suite de mockups estáticos** | **[expojuy2026.vercel.app/mockups/](https://expojuy2026.vercel.app/mockups/)** | Las maquetas de diseño de 6 pantallas: el paso previo a la construcción. [Índice comentado](../ux-ui/mockups/README.md) |
| 💻 **Repositorio público** | [github.com/Delestal94/Expo2026](https://github.com/Delestal94/Expo2026) | Código fuente completo, con instrucciones de ejecución en el [README](../README.md#-correr-el-proyecto) |

> Entendemos que, conforme a las Consignas §4.1, presentar un desarrollo funcional **no otorga ventaja** sobre un mockup. Lo presentamos porque era nuestro camino más rápido a una propuesta verificable, y porque sirve como evidencia directa del criterio de **factibilidad técnica** que evalúa el jurado.

### 4 · Memoria descriptiva

✅ **[`memoria-descriptiva.pdf`](memoria-descriptiva.pdf)** — documento en PDF, como exigen las Consignas §4.2.
*(También disponible como [Markdown versionado](memoria-descriptiva.md), para ver su historial de cambios.)*

Las **8 secciones obligatorias** de las Consignas §4.2, todas presentes:

| Sección exigida | Ubicación |
|---|---|
| Concepto general del proyecto | §1 Resumen · §3 La propuesta: concepto "Estratos" |
| Objetivos perseguidos | §2 El contexto que motiva el diseño |
| Organización del contenido | §4 Organización del contenido |
| Criterios de diseño | §5 Identidad visual |
| Tecnologías previstas para el desarrollo | §6 Arquitectura y factibilidad técnica |
| Estrategia de accesibilidad | §10 Accesibilidad |
| Estrategia responsive | §11 Estrategia responsive |
| Uso previsto de Inteligencia Artificial | §9 Uso responsable de IA |

### 5 · Tecnologías propuestas

✅ **[`tecnologias-propuestas.md`](tecnologias-propuestas.md)** — el stack completo, con la justificación de cada elección.

Documentación técnica de respaldo: **[`architecture.md`](architecture.md)** (arquitectura general, módulos, puertos y adaptadores, entornos, seguridad) y las **[6 ADRs](adr/)** con las decisiones fechadas.

### 6 · Declaración de uso de Inteligencia Artificial

✅ **[`declaracion-uso-ia.md`](declaracion-uso-ia.md)** — qué herramientas usamos, con qué finalidad, **qué no hizo la IA**, y las reglas de uso responsable del asistente que incorpora el sitio.

Cubre lo que exigen el Art. 11 de las Bases ("informar brevemente qué herramientas utilizó y con qué finalidad") y las Consignas §8.

### 7 · Explicación conceptual de la propuesta

✅ El concepto **"Estratos"** y su fundamento:

| Documento | Qué aporta |
|---|---|
| [Memoria §3](memoria-descriptiva.md#3-la-propuesta-concepto-estratos) | El concepto, de dónde sale y por qué |
| [`ux-ui/DESIGN.md`](../ux-ui/DESIGN.md) | La especificación de diseño: tokens de color, tipografías, componentes, reglas de motion, pantalla por pantalla |
| [Memoria §4](memoria-descriptiva.md#4-organización-del-contenido) | La arquitectura de información, con el porqué de cada sección y de su orden |
| [Guía del jurado §2](GUIA-DEL-JURADO.md#2-recorrido-guiado-por-el-sitio-15-min) | El recorrido guiado por el sitio, parada por parada |

---

## Documentación complementaria

No la exigen las Bases, pero sostiene la evaluación:

| Documento | Para qué sirve |
|---|---|
| **[📖 Guía del jurado](GUIA-DEL-JURADO.md)** | Recorrido guiado: qué mirar, en qué orden y cómo verificar cada criterio de evaluación |
| **[📋 Matriz de cumplimiento](matriz-consignas-desafio.md)** | Cada consigna de las Bases y las Consignas contrastada contra el código real, incluido lo que **no** está al 100% |
| **[🛠️ Proceso de trabajo](proceso-de-trabajo.md)** | Cómo trabajamos: flujo, barreras de calidad, auditorías críticas |
| **[📓 Memoria ejecutiva](memoria-ejecutiva.md)** | Bitácora de avance, día por día, escrita mientras se trabajaba |
| **[🏗️ Arquitectura](architecture.md)** | El sistema completo: módulos, integraciones, entornos, seguridad |
| **[📐 ADRs](adr/)** | Las 6 decisiones de arquitectura con fecha, contexto y consecuencias |

---

## Alcance funcional (Bases · Anexo II)

Las once funcionalidades mínimas del Anexo II, y dónde verlas:

| Funcionalidad exigida | Estado | Dónde |
|---|:---:|---|
| Inicio institucional | ✅ | Home del sitio |
| Información general de ExpoJuy | ✅ | Sección "Sobre ExpoJuy 2026" |
| Agenda de actividades | ✅ | Sección "Agenda", con selector por día |
| Expositores | ✅ | Directorio con buscador y filtro por eje |
| Noticias | ✅ | Sección "Noticias", con enlace a las notas originales |
| Mapa interactivo | ✅ | Plano calcado del CAD, +200 zonas |
| Compra de entradas | 🟡 | Registro y credencial QR construidos; cobro detrás de un interruptor de configuración ([ADR-0003](adr/0003-modo-de-acceso.md)) |
| Formularios de contacto | ✅ | Sección "Contacto" + derivación a los canales reales de la Cámara |
| Diseño responsive | ✅ | [Memoria §11](memoria-descriptiva.md#11-estrategia-responsive) |
| Accesibilidad | ✅ | [Memoria §10](memoria-descriptiva.md#10-accesibilidad), con tests automatizados |
| Integración con redes sociales | ✅ | Pie de página, sección Contacto y datos estructurados (`sameAs`) |

**Valor agregado** (Consignas §6, *"será considerado un valor agregado"*): asistente con IA multilingüe con RAG, matching B2B con score de compatibilidad, credencial QR firmada, galería de la edición 2024 con lightbox accesible, sitio completo en 5 idiomas, editor visual interno de zonas del plano.

---

## Declaraciones formales

- **Originalidad** (Art. 21): la propuesta es original. No se reproducen, total ni parcialmente, diseños, contenidos, estructuras ni recursos gráficos de los sitios de referencia listados en las Consignas §10.
- **Licencias** (Art. 24): logotipos y tipografías provienen del **Kit de Diseño oficial** provisto por la organización. Las fotografías son de la edición 2024 del mismo organizador. El código es propio; las dependencias son de código abierto con licencias permisivas.
- **Cesión de derechos** (Art. 22): de resultar ganadores, cedemos a la Cámara de Comercio Exterior de Jujuy los derechos de uso, adaptación, mantenimiento y publicación del sitio, junto con el código fuente completo, archivos de diseño y documentación técnica, sin restricciones que impidan su modificación o actualización futura.
- **Confidencialidad** (Art. 23): mantenemos reserva sobre toda información técnica o institucional no pública que se nos suministre.
- **Infraestructura** (Art. 18): el prototipo está desplegado sin costos de infraestructura para los participantes ni para la organización.

---

<div align="center">

[← Volver al README](../README.md) · [Guía del jurado](GUIA-DEL-JURADO.md) · [Sitio en vivo](https://expojuy2026.vercel.app)

</div>
