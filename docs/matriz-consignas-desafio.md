# Matriz de Cumplimiento — Desafío Digital ExpoJuy 2026

> **Documento vivo de auditoría y control de calidad.**  
> Contrastado contra las **Bases y Condiciones** y las **Consignas Técnicas del Desafío** provistas por el Ministerio de Desarrollo Económico y Producción de Jujuy (Dirección de Servicios Basados en el Conocimiento), la Cámara de Comercio Exterior de Jujuy y ClusteAR.

---

## 📊 Estado General de Cumplimiento

```
[█████████████████░░░] 85% Completitud Integral
• ✅ Cumplido al 100%: 23 ítems
• 🟡 A medias / En progreso: 5 ítems
• 🔴 Pendiente / Por completar: 3 ítems
```

---

## 1. Requisitos Administrativos y de Participación (Bases y Condiciones)

| Requisito / Cláusula | Detalle Oficial | Estado Actual | Observaciones / Acción |
|---|---|:---:|---|
| **Elegibilidad de Participantes** *(Cap. II, Art. 4)* | Mayores de 18 años residentes en Jujuy; estudiantes/egresados de SBC, desarrolladores, diseñadores UX/UI. | ✅ **100%** | Ambos integrantes cumplen el perfil legal y profesional. |
| **Composición del Equipo** *(Cap. II, Art. 5)* | Entre 2 y 4 participantes. Designar un representante como interlocutor. | ✅ **100%** | Equipo de 2 integrantes: Delestal94 y Maximiliano Lezano. |
| **Inscripción Oficial al Programa** *(Cap. III, Art. 6)* | Completar formulario oficial de inscripción dentro de los plazos. | ✅ **100%** | **Formulario enviado por el equipo**. En espera de confirmación formal para remitir adjuntos. |
| **Plazo Límite de Entrega Etapa 1** *(Cap. III, Art. 6; Cap. IV, Art. 9)* | **8 de septiembre de 2026 a las 23:59 hs** (hora argentina). | 🟡 **En curso** | Quedan 5 días para el cierre de recepción formal. |
| **Gratuidad de Participación** *(Cap. III, Art. 6)* | La inscripción es libre y sin costo. | ✅ **100%** | Respetado. |
| **Infraestructura y Hosting** *(Cap. IX, Art. 18)* | Cámara provee dominio y hosting; participantes no asumen costos. | ✅ **100%** | Prototipo desplegado en Vercel (tier gratuito) sin costos de infra. |
| **Premio y Compromiso Etapa 2** *(Cap. VIII y X)* | $750.000 ARS + Certificado + Desarrollo final hasta el 30/09. | ✅ **100%** | Cronograma de desarrollo previsto y documentado en Roadmap. |
| **Propiedad Intelectual y Licencias** *(Cap. XII y XIV)* | Cesión de derechos a la Cámara; autores conservan autoría. Recursos con licencia legal. | ✅ **100%** | Fotos oficiales reales (ExpoJuy 2024), código propio, sin plagio. |

---

## 2. Documentación Oficial a Presentar — Etapa 1 (Bases Anexo III / Consignas §4)

> 💡 **Guía de Documentación para el Envío Formal**: Esta es la lista taxativa exigida por el Anexo III de las Bases.

| Entregable Oficial Exigido | Estado | ¿Lo tenemos creado? | Ubicación / Detalle en el Proyecto |
|---|:---:|:---:|---|
| **1. Formulario de inscripción** | ✅ **Enviado** | **SÍ** | Completado y enviado a la organización. |
| **2. Integrantes del equipo** | ✅ **100%** | **SÍ** | Delestal94 y Maximiliano Lezano (con designación de interlocutor). |
| **3. Link al Mockup / Prototipo Navegable** | ✅ **100%** | **SÍ** | • **Web en Vivo (Vercel)**: `https://expojuy2026.vercel.app`<br>• **Suite Mockups Estática**: Carpeta `ux-ui/mockups/` autónoma.<br>• **Repositorio Público**: `https://github.com/Delestal94/Expo2026` |
| **4. Memoria Descriptiva** | 🟡 **90%** | **SÍ (Falta PDF)** | Redactada completa en `docs/memoria-descriptiva.md` y `docs/memoria-ejecutiva.md`. **Solo resta exportarla a formato PDF oficial con carátula institucional**. |
| **5. Explicación Conceptual de la Propuesta** | ✅ **100%** | **SÍ** | Sistema y concepto "Estratos" detallado en `ux-ui/DESIGN.md` y en la Sección 3 de la Memoria Descriptiva. |
| **6. Tecnologías Propuestas** | ✅ **100%** | **SÍ** | Detallado en `docs/architecture.md` (Next.js 16, TypeScript, Supabase PostgreSQL, Tailwind CSS v4, Vercel, Arquitectura Modular Hexagonal). |
| **7. Declaración de Uso de IA** | ✅ **100%** | **SÍ** | Redactada en la Sección 8 de la Memoria Descriptiva (Uso responsable, Ley 25.326, RAG sin alucinación y soporte al proceso creativo/código). |

---

## 3. Secciones Mínimas Sugeridas (Consignas Técnicas §5 y Anexo II)

| Sección Sugerida | Requerimiento de Contenido | Estado en Mockups | Estado en Proyecto Develop | Acción de Refinamiento |
|---|---|:---:|:---:|---|
| **Inicio (Home / Hero)** | Identidad, slogan, cuenta regresiva, llamada a la acción principal. | ✅ **100%** | ✅ **100%** | `index.html` (Hub) + `develop` Hero con canvas de estratos unificado y reloj dinámico. |
| **Sobre ExpoJuy 2026** | Historia, contexto, cambio de formato a 4 días, impacto productivo. | ✅ **100%** | ✅ **100%** | Incluido en la landing y en la Vista 01 (Roadmap). |
| **Expositores** | Catálogo/directorio de empresas participantes por rubro. | ✅ **100%** | ✅ **100%** | `Directory` filtrable en develop + **Vista 03 (Rondas B2B)** con matching comercial. |
| **Agenda de Actividades** | Cronograma de conferencias, rondas matutinas y espectáculos vespertinos. | 🟡 **A Medias** | 🟡 Parcial | En Vista 01 y 03 hay slots y fases; **falta agregar la grilla horaria día por día** (9 al 12 de octubre). |
| **Noticias / Novedades** | Espacio editorial de prensa, anuncios oficiales y novedades del evento. | 🔴 **Faltante** | 🔴 Pendiente | **Debe agregarse una tarjeta/sección de Noticias Oficiales** en la suite (ej. en el Home o en una vista). |
| **Plano / Mapa del Predio** | Ubicación espacial de stands, pabellones, auditorios y servicios en Ciudad Cultural. | ✅ **100%** | ✅ **100% (Actualizado)** | En develop: `venue-map.tsx` y `venue-plan.ts` actualizados con stands interactivos. En mockups: **Vista 06**. |
| **Sponsors / Patrocinadores** | Espacios visuales destacados para sponsors institucionales y privados. | 🟡 **A Medias** | 🟡 Básico | Logos presentes en footer; **falta bloque destacado de Sponsors** (Exar, Ledesma, Macro, etc.) en el Home. |
| **Contacto** | Vías de comunicación institucional, formulario y soporte. | 🟡 **A Medias** | 🟡 Links | Hay enlaces de WhatsApp y Cámara en footer; **conviene un formulario de contacto visual interactivo**. |
| **Preguntas Frecuentes (FAQ)**| Respuestas a dudas recurrentes de visitantes y expositores. | 🟡 **A Medias** | 🟡 Parcial | El Concierge IA (Vista 04) las responde, pero **falta un acordeón visual clásico de FAQ**. |
| **Redes Sociales** | Enlaces y presencia de canales oficiales (@expojuy, LinkedIn, YouTube). | ✅ **100%** | ✅ **100%** | Integrado en cabeceras y pie de página institucionales con lockup dark y marca oficial. |

---

## 4. Funcionalidades Sugeridas y Valor Agregado (Consignas Técnicas §6)

| Funcionalidad | Descripción | Nivel de Cumplimiento | Dónde se visualiza |
|---|---|:---:|---|
| **Buscador de Expositores** | Búsqueda por texto libre de stands, empresas y rubros. | ✅ **100%** | Vista 03 (`03-rondas-b2b.html`) y Vista 06 (`06-mapa.html`). |
| **Filtro por Rubros / Ejes** | Minería/Litio, Comercio Exterior, Corredor Bioceánico, Economía del Conocimiento. | ✅ **100%** | Presente en Vista 03, Vista 05 (Galería), Vista 06 y `develop`. |
| **Agenda Interactiva** | Navegación de paneles, charlas y rondas de negocios. | 🟡 **A Medias** | Vista 03 tiene agenda de slots de 20 min; falta visor diario de conferencias. |
| **Mapa del Predio Dinámico** | Visualización de zonificación y estado de salas en vivo. | ✅ **100%** | Actualizado en `develop` (`venue-map.tsx`) y en Vista 06 con salas en tiempo real ("EN RONDA / EN VIVO"). |
| **Compra o Gestión de Entradas** | Venta digital / acreditación QR según esquema de acceso. | ✅ **100%** | Vista 02 (`02-acceso.html`): simulador de molinete, QR holográfico dinámico y switch `free/paid`. |
| **Integración con Redes Sociales** | Acceso a perfiles oficiales y material de difusión. | ✅ **100%** | Enlaces y lockup de marca oficial de Instagram (`@expojuy`). |
| **Espacios para Patrocinadores** | Banners y menciones con jerarquía (Platinum, Gold, Silver). | 🟡 **A Medias** | En footer; falta bloque visual bento de sponsors de primer nivel. |
| **Panel para Futuras Actualizaciones** | Arquitectura desacoplada para conectar CMS (Sanity/Strapi). | ✅ **100%** | Documentado en `architecture.md` mediante patrón de puertos y adaptadores. |
| **✨ Valor Agregado 1: Concierge IA Multilingüe** | Asistente en 4 idiomas (ES, EN, PT, ZH) con tarjetas ricas y derivación humana. | ✅ **100% (Diferencial)** | Vista 04 (`04-asistente.html`) — no solicitado explícitamente, gran valor diferencial. |
| **✨ Valor Agregado 2: Memoria Visual 2024** | Galería histórica con 30 fotos de alta resolución y lightbox accesible. | ✅ **100% (Diferencial)** | Vista 05 (`05-galeria.html`) — refuerza respaldo institucional real. |
| **✨ Valor Agregado 3: Matching B2B Algorítmico** | Score de compatibilidad comercial para el Corredor Bioceánico. | ✅ **100% (Diferencial)** | Vista 03 (`03-rondas-b2b.html`) — responde al objetivo prioritario del evento. |

---

## 5. Criterios Técnicos de Evaluación (Bases Art. 13 / Consignas §11)

| Criterio Evaluado | Justificación de Cumplimiento Técnico | Puntuación Estimada |
|---|---|:---:|
| **1. Calidad del Diseño Visual** | Sistema de diseño "Estratos" propio, tipografía Unbounded/Manrope, paleta oficial del isotipo de ExpoJuy en Instagram, microanimaciones de lona canvas, estética sobria y moderna. | 10 / 10 |
| **2. Claridad de la Arquitectura de Información** | Estructura modular, navegación fija flotante con conmutador de vistas, breadcrumbs, navegación clara y sin ambigüedades. | 9.5 / 10 |
| **3. Experiencia de Usuario (UX)** | Tiempos de carga instantáneos (archivos estáticos puros en mockups), interactividad en cliente, simuladores de molinete y matching en vivo. | 10 / 10 |
| **4. Accesibilidad (a11y)** | Cumplimiento de WCAG 2.1 (contraste verificado, navegación por teclado con foco visible, lightbox con trampeo de foco, soporte `prefers-reduced-motion`, nuevo componente `entrance-vein`). | 9.5 / 10 |
| **5. Adaptabilidad Móvil (Responsive)** | Layout fluido con clamp(), grilla bento colapsable de 12 a 1 columna, navegación mobile amigable. | 9.5 / 10 |
| **6. Escalabilidad de la Solución** | Arquitectura modular hexagonal (`src/modules/*`), tipado estricto con TypeScript, backend escalable en Supabase PostgreSQL. | 10 / 10 |
| **7. Factibilidad Técnica** | Repositorio público real con CI en verde (58 tests unitarios pasando, 0 errores de TypeScript), no solo un diseño en Figma. | 10 / 10 |
| **8. Innovación** | Canvas con metáfora geológica del litio y cerro, matching B2B para el Corredor Bioceánico, acreditación QR offline y Concierge multilingüe. | 10 / 10 |
| **9. Uso Responsable de IA** | Declaración formal de ética (Ley 25.326), RAG sin alucinaciones, derivación a operadores humanos y control de costos por rate limit. | 10 / 10 |
| **10. Originalidad de la Propuesta** | Identidad inspirada en la Quebrada y el litio jujeño, lejos de plantillas genéricas de WordPress o bootstrap. | 10 / 10 |

---

## 6. Plan de Acción Inmediato (Hacia el 8 de Septiembre 23:59 hs)

### 🔴 Próximos Pasos Prioritarios:
1. **Generar PDF de la Memoria Descriptiva**: Compilar `docs/memoria-descriptiva.md` a un PDF formal con carátula institucional y membrete (¡único documento formal que resta exportar!).
2. **Incorporar Sección de Noticias / Prensa**: Agregar un bloque bento de novedades recientes en la propuesta.
3. **Incorporar Bloque de Sponsors & Patrocinadores Destacados**: Ubicar en el Home/Hub las marcas que apoyan la edición (Exar, Ledesma, Cámara, etc.).
4. **Incorporar Acordeón de FAQ y Formulario de Contacto**: Añadir estas dos secciones mínimas requeridas por las consignas.
5. **Agenda Diaria de Actividades**: Detallar el programa de actividades por día (Jueves 9, Viernes 10, Sábado 11, Domingo 12).
