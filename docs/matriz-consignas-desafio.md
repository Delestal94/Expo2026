# Matriz de Cumplimiento — Desafío Digital ExpoJuy 2026

> **Documento vivo de auditoría y control de calidad.**
> Contrastado contra las **Bases y Condiciones** y las **Consignas Técnicas del Desafío** provistas por el Ministerio de Desarrollo Económico y Producción de Jujuy (Dirección de Servicios Basados en el Conocimiento), la Cámara de Comercio Exterior de Jujuy y ClusteAR.
>
> **Última auditoría: 8 de septiembre de 2026** (fecha de presentación), contra el estado real del código en `develop` — no contra intenciones de diseño ni contra lo que dicen otros documentos del repositorio. Donde una fila anterior de este documento afirmaba algo que el código no respaldaba, se corrigió y se dejó constancia.
>
> Auditoría anterior: 3 de septiembre. Los tres gaps que dejó anotados (asistente con IA sin implementar, multiidioma declarado pero inexistente, y `main` desactualizado respecto de `develop`) **quedaron cerrados** — ver las notas de cierre en las secciones 4, 6 y 7.

---

## 📊 Estado General de Cumplimiento

```
[█████████████████████] 98% Completitud Integral
• ✅ Cumplido: 32 ítems
• 🟡 A medias por decisión o por dependencia de un tercero: 2 ítems
• 🔴 Pendiente por trabajo propio: 0 ítems
```

Los dos ítems que no están al 100% **no son trabajo pendiente nuestro**: uno es una decisión deliberada (no inventar un precio institucional) y el otro depende de información que la organización todavía no publicó. Están detallados sin maquillaje en la sección 6.

## 1. Requisitos Administrativos y de Participación (Bases y Condiciones)

| Requisito / Cláusula | Detalle Oficial | Estado Actual | Observaciones / Acción |
|---|---|:---:|---|
| **Elegibilidad de Participantes** *(Cap. II, Art. 4)* | Mayores de 18 años residentes en Jujuy; estudiantes/egresados de SBC, desarrolladores, diseñadores UX/UI. | ✅ **100%** | Ambos integrantes cumplen el perfil legal y profesional. |
| **Composición del Equipo** *(Cap. II, Art. 5)* | Entre 2 y 4 participantes. Designar un representante como interlocutor. | ✅ **100%** | Equipo de 2 integrantes: Delestal94 y Maximiliano Lezano. |
| **Inscripción Oficial al Programa** *(Cap. III, Art. 6)* | Completar formulario oficial de inscripción dentro de los plazos. | ✅ **100%** | Formulario enviado por el equipo. |
| **Plazo Límite de Entrega Etapa 1** *(Cap. III, Art. 6; Cap. IV, Art. 9)* | **8 de septiembre de 2026 a las 23:59 hs** (hora argentina). | 🟡 **En curso** | Todavía dentro del plazo. Vale la fecha/hora que registre el sistema de recepción oficial. |
| **Gratuidad de Participación** *(Cap. III, Art. 6)* | La inscripción es libre y sin costo. | ✅ **100%** | Respetado. |
| **Infraestructura y Hosting** *(Cap. IX, Art. 18)* | Cámara provee dominio y hosting; participantes no asumen costos. | ✅ **100%** | Prototipo desplegado en Vercel (tier gratuito) sin costos de infra. |
| **Premio y Compromiso Etapa 2** *(Cap. VIII y X)* | $750.000 ARS + Certificado + Desarrollo final hasta el 30/09. | ✅ **100%** | Cronograma de desarrollo previsto y documentado en Roadmap (memoria descriptiva, §13). |
| **Propiedad Intelectual y Licencias** *(Cap. XII y XIV)* | Cesión de derechos a la Cámara; autores conservan autoría. Recursos con licencia legal. | ✅ **100%** | Fotos oficiales reales (ExpoJuy 2024), código propio, sin plagio. Los enlaces a redes sociales usan las cuentas reales verificadas de @expojuy y de la Cámara, no perfiles inventados. |

## 2. Documentación Oficial a Presentar — Etapa 1 (Bases Anexo III / Consignas §4)

| Entregable Oficial Exigido | Estado | ¿Lo tenemos creado? | Ubicación / Detalle en el Proyecto |
|---|:---:|:---:|---|
| **1. Formulario de inscripción** | ✅ **Enviado** | **SÍ** | Completado y enviado a la organización. |
| **2. Integrantes del equipo** | ✅ **100%** | **SÍ** | Delestal94 y Maximiliano Lezano (con designación de interlocutor). |
| **3. Link al Mockup / Prototipo Navegable** | ✅ **100%** | **SÍ** | Tres formatos: **[sitio en vivo](https://expojuy2026.vercel.app)** (Vercel), **[suite de mockups estáticos navegables](https://expojuy2026.vercel.app/mockups/)** (6 pantallas, servidas sin necesidad de clonar) y [repositorio público](https://github.com/Delestal94/Expo2026). |
| **4. Memoria Descriptiva** | ✅ **100%** | **SÍ** | `docs/memoria-descriptiva.md`, exportada a **`docs/memoria-descriptiva.pdf`** con carátula institucional. Las 8 secciones que exige Consignas §4.2 están completas, incluidas Organización del contenido (§4) y Estrategia responsive (§11), que faltaban en la auditoría anterior. |
| **5. Explicación Conceptual de la Propuesta** | ✅ **100%** | **SÍ** | Sistema y concepto "Estratos" detallado en `ux-ui/DESIGN.md` y en la Sección 3 de la Memoria Descriptiva. |
| **6. Tecnologías Propuestas** | ✅ **100%** | **SÍ** | Detallado en `docs/architecture.md` (Next.js 16, TypeScript, arquitectura modular por puertos y adaptadores). |
| **7. Declaración de Uso de IA** | ✅ **100%** | **SÍ** | Documento formal propio: [`declaracion-uso-ia.md`](declaracion-uso-ia.md) — qué herramientas, con qué finalidad, **qué no hizo la IA**, y las reglas del asistente del sitio. Resumen en la Sección 9 de la Memoria Descriptiva. |

## 3. Secciones Mínimas Sugeridas (Consignas Técnicas §5 y Anexo II)

| Sección Sugerida | Requerimiento de Contenido | Estado en el sitio (`develop`) | Detalle |
|---|---|:---:|---|
| **Inicio (Home / Hero)** | Identidad, slogan, cuenta regresiva, llamada a la acción principal. | ✅ **100%** | Lockup oficial real, cuenta regresiva y dos CTA. |
| **Sobre ExpoJuy 2026** | Historia, contexto, cambio de formato a 4 días, impacto productivo. | ✅ **100%** | Sección "Sobre" + los 4 Ejes productivos. |
| **Expositores** | Catálogo/directorio de empresas participantes por rubro. | ✅ **100%** | Directorio con **buscador de texto libre** (nuevo) + filtro por eje. |
| **Agenda de Actividades** | Cronograma de conferencias, rondas matutinas y espectáculos vespertinos. | ✅ **100%\*** | Nueva sección **Agenda**: estructura diaria confirmada por prensa (rondas de negocios por la mañana, expo por la tarde) para los 4 días, con selector interactivo. *La grilla horaria minuto a minuto de charlas y shows nocturnos todavía no la publicó la organización para 2026 (en la edición 2024 se conoció recién la semana previa) — no es trabajo pendiente nuestro, es información que no existe todavía. |
| **Noticias** | Espacio editorial de prensa, anuncios oficiales y novedades del evento. | ✅ **100%** | Nueva sección **Noticias**: 3 coberturas de prensa reales (con enlace a la nota original) + 1 novedad propia del sitio. |
| **Plano / Mapa del Predio** | Ubicación espacial de stands, pabellones, auditorios y servicios en Ciudad Cultural. | ✅ **100%** | `venue-map.tsx` y `venue-plan.ts`: plano calcado del CAD con más de 200 zonas interactivas. |
| **Sponsors** | Espacios visuales destacados para sponsors institucionales y privados. | ✅ **100%** | Tres grupos en el pie (acompañan / sponsors / organiza) con logos reales y efecto de marca al pasar el mouse. |
| **Contacto** | Vías de comunicación institucional, formulario y soporte. | ✅ **100%** | Nueva sección **Contacto**: email, teléfono y dirección reales de la Cámara, WhatsApp y redes sociales, además del formulario de proveedores en Acceso. |
| **Preguntas Frecuentes (FAQ)** | Respuestas a dudas recurrentes de visitantes y expositores. | ✅ **100%** | Nueva sección **FAQ**: acordeón accesible con 8 preguntas reales (fechas, entradas, postulación, accesibilidad, idiomas, novedades). |
| **Redes Sociales** | Enlaces y presencia de canales oficiales (@expojuy, LinkedIn, YouTube). | ✅ **100%** | Corregido — la auditoría anterior lo daba por cumplido sin que existiera ningún enlace. Ahora: Instagram (`@expojuy`), Facebook y LinkedIn reales de la Cámara, en el pie de página, en Contacto y en el JSON-LD (`sameAs`). |

*\* Nota metodológica: en la auditoría del 3/9 a la mañana, esta fila decía "🟡 A Medias" porque la sección no existía en el código a pesar de que la matriz anterior no la mencionaba como pendiente. Se corrigió en la misma jornada.*

## 4. Funcionalidades Sugeridas y Valor Agregado (Consignas Técnicas §6)

| Funcionalidad | Descripción | Nivel de Cumplimiento | Dónde se visualiza |
|---|---|:---:|---|
| **Buscador de Expositores** | Búsqueda por texto libre de stands, empresas y rubros. | ✅ **100%** | Directorio de Expositores — antes solo estaba en los mockups estáticos, ahora también en la app real, combinable con el filtro de eje. |
| **Filtro por Rubros / Ejes** | Minería/Litio, Comercio Exterior, Corredor Bioceánico, Economía del Conocimiento. | ✅ **100%** | Directorio de expositores y Mapa. |
| **Agenda Interactiva** | Navegación de paneles, charlas y rondas de negocios. | ✅ **100%** | Selector de día (Vie 9 a Lun 12) en la nueva sección Agenda, más la vista detallada de slots de rondas de negocios en Expositores. |
| **Mapa del Predio Dinámico** | Visualización de zonificación y estado de salas en vivo. | ✅ **100%** | `venue-map.tsx`, con panel de detalle por zona. |
| **Compra o Gestión de Entradas** | Venta digital / acreditación QR según esquema de acceso. | 🟡 **Diseñado, cobro pendiente** | Alta de cuenta y QR de ingreso gratuito ya funcionan. El cobro real (Mercado Pago) queda a propósito detrás de un interruptor de configuración hasta que la Cámara confirme el esquema de precios 2026 — decisión documentada en [ADR-0003](adr/0003-modo-de-acceso.md), no una tarea sin hacer. |
| **Integración con Redes Sociales** | Acceso a perfiles oficiales y material de difusión. | ✅ **100%** | Ver sección 3. |
| **Espacios para Patrocinadores** | Banners y menciones con jerarquía. | ✅ **100%** | Grillas de logos reales en el pie, separadas por Acompañan / Sponsors / Organiza. |
| **Panel para Futuras Actualizaciones** | Arquitectura desacoplada para conectar CMS (Sanity/Strapi). | ✅ **100%** | Documentado en `architecture.md` mediante patrón de puertos y adaptadores; flags tipados en `src/lib/config/flags.ts`. |
| **✨ Valor Agregado 1: Concierge IA Multilingüe** | Asistente en varios idiomas con derivación humana. | ✅ **100%** *(corregido)* | **Cerrado desde la auditoría del 3/9, que lo daba por no implementado.** El asistente está construido (`src/modules/chatbot/`, endpoint propio en `src/app/api/chat/route.ts`): responde con el contenido real del sitio vía RAG, en los 5 idiomas, y sin credencial de API degrada a respuestas guiadas en vez de fallar. Sus reglas de uso responsable están en [`declaracion-uso-ia.md`](declaracion-uso-ia.md). *Lo único que sigue diseñado y no construido es la derivación a un operador humano (Fase 3).* |
| **✨ Valor Agregado 2: Memoria Visual 2024** | Galería histórica con fotos reales y lightbox accesible. | ✅ **100%** | Sección Galería + `/galeria`. |
| **✨ Valor Agregado 3: Matching B2B Algorítmico** | Score de compatibilidad comercial. | ✅ **100%** | `matching-preview.tsx`, dentro de Expositores. |

## 5. Criterios Técnicos de Evaluación (Bases Art. 13 / Consignas §11)

| Criterio Evaluado | Justificación de Cumplimiento Técnico |
|---|---|
| **Calidad del diseño visual** | Sistema de diseño "Estratos" propio, tipografía Unbounded/Manrope/JetBrains Mono, paleta de marca coherente con Instagram. |
| **Claridad de la arquitectura de información** | Índice de secciones (`SectionNav`) que resalta la sección activa; orden de contenido documentado y justificado en la Memoria Descriptiva §4. |
| **Experiencia de usuario** | Buscador con estado vacío explicado, filtros combinables, agenda interactiva por día, acordeones accesibles. |
| **Accesibilidad** | Roles ARIA en filtros/tabs/acordeón, navegación completa por teclado, foco visible, `prefers-reduced-motion` respetado — con tests automatizados que lo verifican. |
| **Adaptabilidad Móvil (Responsive)** | Detallada como sección propia de la Memoria Descriptiva (§11): grillas fluidas, tipografía con `clamp()`, patrones de scroll horizontal en mobile. |
| **Escalabilidad de la solución** | Arquitectura modular (`src/modules/*`) con límites verificados por lint; cada sección nueva (Noticias, Agenda) se sumó como módulo propio sin tocar los existentes. |
| **Factibilidad técnica** | Repositorio público con CI en verde: **102 tests** en 26 archivos, 0 errores de TypeScript, build de producción exitoso, 153 Pull Requests mergeados. Ver [proceso de trabajo](proceso-de-trabajo.md). |
| **Innovación** | Metáfora geológica del litio y cerro, matching B2B, credencial QR con validación offline. |
| **Uso responsable de IA** | Declaración formal en la Memoria Descriptiva §9; uso de IA en este mismo ciclo de desarrollo declarado y supervisado por el equipo. |
| **Originalidad de la propuesta** | Identidad inspirada en la Quebrada y el litio jujeño; contenido de Noticias/Contacto con datos reales verificados, no genéricos. |

## 6. Lo que no está al 100% — y por qué

Quedan exactamente dos, y ninguno es trabajo que hayamos dejado sin hacer:

1. **Cobro real de entradas (Mercado Pago)** — 🟡 **a propósito.** No hay confirmación pública del esquema de precios 2026; construir el cobro ahora significaría inventar un precio institucional y publicarlo en el sitio de un evento oficial. El adaptador de pago ya está escrito y testeado, y el interruptor (`ADMISSION_MODE`) está listo para activarlo apenas la Cámara confirme, sin rediseñar nada ([ADR-0003](adr/0003-modo-de-acceso.md)).

2. **Grilla horaria detallada de la Agenda** — 🟡 **depende de un tercero.** La organización todavía no publicó el cronograma minuto a minuto de charlas y shows para 2026 (en 2024 se conoció recién la semana previa al evento). La sección Agenda muestra la estructura confirmada por prensa (rondas de negocios AM / expo PM para los 4 días) y **avisa explícitamente qué falta**, en vez de inventar horarios.

**Un tercer ítem sigue diseñado y no construido, pero es de la Fase 3 del roadmap (después del 27/09), no de esta etapa:** la derivación a un operador humano dentro del asistente con IA. Hoy el asistente deriva a los canales de contacto reales de la Cámara cuando una pregunta sale de su dominio.

### ✅ Cierre de los gaps de la auditoría del 3/9

Los tres riesgos que dejó anotados la auditoría anterior quedaron resueltos antes de la presentación:

| Gap anotado el 3/9 | Estado al 8/9 |
|---|---|
| **Asistente con IA sin implementar** (🔴) | ✅ **Construido.** Módulo `chatbot` con RAG sobre el contenido real del sitio, en los 5 idiomas, con degradación segura sin credencial. PRs [#139](https://github.com/Delestal94/Expo2026/pull/139) a [#152](https://github.com/Delestal94/Expo2026/pull/152). |
| **Multiidioma declarado pero inexistente** (solo `es-AR.json`) | ✅ **Cerrado.** Cinco diccionarios completos — `es-AR`, `en`, `pt`, `zh`, `fr` — con ruteo por idioma y **un test de paridad que falla si a un idioma le falta una clave**. PRs [#138](https://github.com/Delestal94/Expo2026/pull/138) y [#147](https://github.com/Delestal94/Expo2026/pull/147). |
| **`main` desactualizado respecto de `develop`** — el sitio público no reflejaba Noticias, Agenda, Contacto, FAQ ni el buscador | ✅ **Cerrado.** `main` está sincronizado con `develop`: **[expojuy2026.vercel.app](https://expojuy2026.vercel.app) sirve la versión completa** que se presenta al concurso. |

## 7. Nota metodológica

Este documento se mantuvo deliberadamente como una auditoría **en contra** del proyecto, no como una lista de logros. En cada corrida se contrastó cada fila contra el código real de `develop`, y cuando una fila afirmaba algo que el código no respaldaba, se corrigió la fila — no el discurso.

Las dos correcciones más incómodas quedaron registradas a propósito, porque muestran cómo trabaja el equipo:

- **Redes sociales** (sección 3): la auditoría previa las daba por cumplidas sin que existiera un solo enlace en el código. Se detectó y se implementó.
- **Multiidioma** (sección 6): la memoria descriptiva declaraba cuatro idiomas cuando existía uno solo. Se detectó, se anotó como gap abierto en vez de taparlo, y se cerró con cinco idiomas completos y un test que lo custodia.

Un documento de cumplimiento que solo dice que todo está bien no sirve para controlar calidad. El método completo está en [`proceso-de-trabajo.md`](proceso-de-trabajo.md).

---

<div align="center">

[← Volver al README](../README.md) · [Guía del jurado](GUIA-DEL-JURADO.md) · [Entregables](entregables-etapa-1.md)

</div>
