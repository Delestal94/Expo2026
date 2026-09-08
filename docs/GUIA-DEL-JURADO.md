# 📖 Guía del jurado

**Desafío Digital ExpoJuy 2026** · Propuesta del equipo Delestal94 + MaxLezano

Este documento existe por una razón: que nadie del jurado tenga que buscar. Acá está **qué mirar, en qué orden y por qué importa** — con el link directo a cada cosa.

> **Atajo si tenés 5 minutos:** abrí **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)**, hacé scroll hasta abajo, y volvé acá.

---

## 🧭 Índice

1. [Recorridos según tu tiempo](#1-recorridos-según-tu-tiempo)
2. [Recorrido guiado por el sitio](#2-recorrido-guiado-por-el-sitio-15-min)
3. [Dónde está cada entregable formal](#3-dónde-está-cada-entregable-formal)
4. [Cómo verificar cada criterio de evaluación](#4-cómo-verificar-cada-criterio-de-evaluación)
5. [Cómo verificar que el trabajo es real](#5-cómo-verificar-que-el-trabajo-es-real)
6. [Lo que no está terminado, dicho por nosotros](#6-lo-que-no-está-terminado-dicho-por-nosotros)
7. [Preguntas que probablemente tengas](#7-preguntas-que-probablemente-tengas)

---

## 1. Recorridos según tu tiempo

### ⏱️ 5 minutos — "quiero ver la propuesta"

1. **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)** — scroll completo de la home. Es una sola página con anclas; el índice lateral te dice dónde estás.
2. Probá el **selector de idioma** (arriba a la derecha) y el **toggle de tema** claro/oscuro.

### ⏱️ 15 minutos — "quiero evaluar la propuesta"

1. El [recorrido guiado por el sitio](#2-recorrido-guiado-por-el-sitio-15-min) de más abajo (7 paradas concretas).
2. La **[memoria descriptiva en PDF](memoria-descriptiva.pdf)** — las 8 secciones que exigen las Consignas §4.2.

### ⏱️ 45 minutos — "quiero auditar la propuesta"

1. Todo lo anterior.
2. La **[matriz de cumplimiento](matriz-consignas-desafio.md)** — consigna por consigna contra el código real.
3. El **[proceso de trabajo](proceso-de-trabajo.md)** — cómo se construyó.
4. La **[arquitectura](architecture.md)** y las **[decisiones fechadas](adr/)**.
5. El [historial de Pull Requests](https://github.com/Delestal94/Expo2026/pulls?q=is%3Apr+is%3Amerged) y [Actions](https://github.com/Delestal94/Expo2026/actions).

---

## 2. Recorrido guiado por el sitio (15 min)

Siete paradas en **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)**. En cada una decimos qué mirar y qué decisión hay detrás.

### Parada 1 · Inicio — la identidad

**Qué ves:** el lockup oficial de ExpoJuy sobre un fondo animado de bandas de color en capas, y una cuenta regresiva real al 9 de octubre.

**Qué mirar:** las bandas del fondo no son una imagen — son un canvas dibujado en tiempo real. El concepto es **"Estratos"**: Jujuy es literalmente capas (la Quebrada de Humahuaca expone millones de años de estratos minerales; el litio está bajo tierra en salmueras estratificadas). Los cuatro colores son los del isotipo oficial de ExpoJuy, para que el sitio y el Instagram del evento se lean como una sola marca.

**Probá:** si tenés activado "reducir movimiento" en tu sistema operativo, la animación se congela en un cuadro estático. Es intencional (WCAG 2.3.3).

### Parada 2 · Sobre ExpoJuy — el contexto y los ejes

**Qué ves:** por qué el evento cambió de formato, los datos duros de la edición, y los 4 ejes productivos como líneas de tipografía grande que se despliegan.

**Qué mirar:** los ejes **no tienen sección propia a propósito**. Separarlos obligaba a leer dos veces el mismo marco (el evento cambió de formato *porque* estos son los ejes) y sumaba una parada de scroll. La justificación completa del orden de secciones está en la [memoria §4](memoria-descriptiva.md#4-organización-del-contenido).

### Parada 3 · Noticias — prueba de que el evento es real

**Qué ves:** coberturas de prensa reales con enlace a la nota original, más novedades propias del sitio.

**Qué mirar:** son notas reales verificadas, no contenido de relleno. Toda la información institucional del sitio (teléfono, dirección, redes) es la real de la Cámara.

### Parada 4 · Mapa del predio — el dato duro

**Qué ves:** el plano de Ciudad Cultural con más de 200 zonas seleccionables, filtrables por categoría.

**Qué mirar:** **no es una imagen del plano**. Es el plano de 2024 calcado a partir del CAD, stand por stand — cubiertos, artesanos, descubiertos, gastronómicos y sectores de servicio — cada uno consultable. El plano vive en un único módulo de datos que comparten el mapa público y el editor interno, así no hay dos fuentes de verdad.

**Probá:** navegalo con `Tab` y `Enter`. El foco es visible y funciona sin mouse.

### Parada 5 · Expositores y rondas B2B — el corazón comercial

**Qué ves:** directorio con buscador de texto libre y filtro por eje, más el módulo de matching y la agenda de slots bilaterales.

**Qué mirar:** esto es lo que responde al cambio de formato del evento. Las rondas de negocios por la mañana son el motivo por el que ExpoJuy 2026 no puede resolverse con una landing: hay que **coordinar encuentros**, no solo anunciarlos. El matching sugiere contrapartes por rubro y país (lógica Corredor Bioceánico) con un score de compatibilidad.

**Probá:** combiná el buscador con un filtro de eje. El estado vacío explica qué pasó en vez de mostrar una lista en blanco.

### Parada 6 · Acceso — la decisión que no bloqueó el avance

**Qué ves:** los valores de referencia 2024 presentados como un ticket, y el camino de registro.

**Qué mirar:** la edición 2024 fue **paga con venta online**. No hay confirmación pública de que 2026 mantenga ese esquema. En vez de esperar esa respuesta para seguir construyendo, el cobro es **un interruptor de configuración** (`ADMISSION_MODE: gratuita | paga`): el registro y la credencial QR ya funcionan, y el cobro por Mercado Pago se activa apenas la Cámara confirme, sin rediseñar nada. Fundamento completo en [ADR-0003](adr/0003-modo-de-acceso.md).

### Parada 7 · Asistente con IA — el valor agregado

**Qué ves:** un asistente conversacional en la esquina, disponible en los 5 idiomas.

**Qué mirar:** responde **solo con el contenido real del sitio** (recuperación aumentada, RAG). No inventa horarios ni datos de expositores; fuera de su dominio deriva a contacto humano. Se identifica como asistente virtual desde el primer mensaje, y puede apagarse por completo sin afectar el resto del sitio. Las reglas están en la [declaración de uso de IA](declaracion-uso-ia.md).

### 🎁 Extra · La suite de mockups estáticos

**[expojuy2026.vercel.app/mockups/](https://expojuy2026.vercel.app/mockups/)** — las maquetas de diseño de las pantallas que exploramos antes de construir: roadmap, acreditación QR, rondas B2B, asistente, galería y plano. Útiles para ver el **paso previo** del diseño, no solo el resultado. Índice comentado en [`ux-ui/mockups/README.md`](../ux-ui/mockups/README.md).

---

## 3. Dónde está cada entregable formal

Los siete ítems del **Anexo III** de las Bases:

| # | Entregable | Link directo |
|---|---|---|
| 1 | Formulario de inscripción | Enviado por el formulario oficial de la organización |
| 2 | Integrantes del equipo | [`entregables-etapa-1.md §2`](entregables-etapa-1.md) |
| 3 | Link al mockup / prototipo navegable | **[Sitio en vivo](https://expojuy2026.vercel.app)** · [mockups estáticos](https://expojuy2026.vercel.app/mockups/) |
| 4 | Memoria descriptiva | **[`memoria-descriptiva.pdf`](memoria-descriptiva.pdf)** |
| 5 | Tecnologías propuestas | [`tecnologias-propuestas.md`](tecnologias-propuestas.md) |
| 6 | Declaración de uso de IA | [`declaracion-uso-ia.md`](declaracion-uso-ia.md) |
| 7 | Explicación conceptual | [Memoria §3](memoria-descriptiva.md#3-la-propuesta-concepto-estratos) · [`ux-ui/DESIGN.md`](../ux-ui/DESIGN.md) |

Las **8 secciones que exigen las Consignas §4.2** para la memoria descriptiva están todas, en este orden:

| Sección exigida | Dónde |
|---|---|
| Concepto general del proyecto | [Memoria §1 y §3](memoria-descriptiva.md) |
| Objetivos perseguidos | [Memoria §2](memoria-descriptiva.md) |
| Organización del contenido | [Memoria §4](memoria-descriptiva.md) |
| Criterios de diseño | [Memoria §5](memoria-descriptiva.md) · [`ux-ui/DESIGN.md`](../ux-ui/DESIGN.md) |
| Tecnologías previstas | [Memoria §6](memoria-descriptiva.md) · [`tecnologias-propuestas.md`](tecnologias-propuestas.md) |
| Estrategia de accesibilidad | [Memoria §10](memoria-descriptiva.md) |
| Estrategia responsive | [Memoria §11](memoria-descriptiva.md) |
| Uso previsto de IA | [Memoria §9](memoria-descriptiva.md) · [`declaracion-uso-ia.md`](declaracion-uso-ia.md) |

---

## 4. Cómo verificar cada criterio de evaluación

Los criterios de las **Consignas §11** y del **Art. 13 de las Bases**, con la evidencia concreta de cada uno:

| Criterio | Evidencia verificable |
|---|---|
| **Calidad del diseño visual** | Sistema "Estratos" propio y documentado en [`ux-ui/DESIGN.md`](../ux-ui/DESIGN.md): tokens de color, tipografías Unbounded/Manrope/JetBrains Mono + Ambit oficial, reglas de motion. Colores tomados de la marca real. |
| **Claridad de la arquitectura de información** | Índice de secciones que resalta la sección activa durante el scroll. El orden del contenido está **justificado sección por sección** en la [memoria §4](memoria-descriptiva.md#4-organización-del-contenido), no elegido al azar. |
| **Experiencia de usuario** | Buscador con estado vacío explicado, filtros combinables, agenda por día, acordeones accesibles. Auditado por recorridos completos de tarea — ver [PR #171](https://github.com/Delestal94/Expo2026/pull/171). |
| **Accesibilidad** | Navegación completa por teclado, foco visible, roles ARIA en filtros/tabs/acordeón, jerarquía semántica real, `prefers-reduced-motion` respetado, contraste verificado. **Con tests automatizados que lo custodian.** |
| **Adaptabilidad móvil** | Sección propia en la [memoria §11](memoria-descriptiva.md#11-estrategia-responsive): grillas fluidas, tipografía con `clamp()`, scroll horizontal con snap en mobile. Verificado a 390 / 768 / 1440 / 1920 px. |
| **Escalabilidad** | Módulos aislados en `src/modules/*` con límites **verificados por lint que rompe el build**. Cada sección nueva se sumó como módulo propio sin tocar los existentes. |
| **Factibilidad técnica** | [CI en verde](https://github.com/Delestal94/Expo2026/actions) en cada cambio: lint + tipos + 102 tests + build de producción. 153 PRs mergeados. El sitio está desplegado y funcionando. |
| **Innovación** | Matching B2B con score de compatibilidad, credencial QR firmada, plano calcado del CAD con +200 zonas, asistente RAG multilingüe, metáfora geológica propia. |
| **Uso responsable de IA** | [Declaración formal completa](declaracion-uso-ia.md) — qué herramientas, para qué, y qué reglas se le pusieron al asistente del sitio. |
| **Originalidad** | Identidad construida desde la geología jujeña, contenido con datos reales verificados. Sin reproducir diseños de los sitios de referencia (Consignas §10). |
| **Identidad institucional** | Kit de Diseño oficial respetado: logotipos, tipografía Ambit y paleta de la organización. Logos de Organiza / Acompañan / Sponsors con jerarquía diferenciada. |

---

## 5. Cómo verificar que el trabajo es real

No hace falta creernos. Todo es auditable desde GitHub:

| Qué querés verificar | Dónde mirarlo |
|---|---|
| Que el trabajo es sostenido, no de última hora | [153 Pull Requests mergeados](https://github.com/Delestal94/Expo2026/pulls?q=is%3Apr+is%3Amerged) con fecha, del 31/08 al 08/09 |
| Que el código realmente compila y pasa tests | [GitHub Actions](https://github.com/Delestal94/Expo2026/actions) — historial completo de corridas |
| Que hubo revisión, no commits directos | [Historial de `develop`](https://github.com/Delestal94/Expo2026/commits/develop) — todo entra por PR con número |
| Que las decisiones están fundamentadas | [6 ADRs fechados](adr/) — incluida una que **revertimos** al encontrar evidencia en contra |
| Que documentamos mientras trabajábamos | [Memoria ejecutiva](memoria-ejecutiva.md) — bitácora día por día, escrita en el mismo PR del cambio |
| Que auditamos nuestro propio trabajo | PRs de auditoría: [diseño #169](https://github.com/Delestal94/Expo2026/pull/169), [UX #171](https://github.com/Delestal94/Expo2026/pull/171), [visibilidad #173](https://github.com/Delestal94/Expo2026/pull/173) |
| Que las reglas de trabajo existían desde el día 1 | [`CONTRIBUTING.md`](../CONTRIBUTING.md), escrito en el primer commit del repositorio |

**Reproducirlo en tu máquina:**

```bash
git clone https://github.com/Delestal94/Expo2026.git
cd Expo2026
npm install
npm test        # 102 tests
npm run build   # build de producción
npm run dev     # http://localhost:3000
```

Arranca y es navegable **sin configurar ninguna credencial**.

---

## 6. Lo que no está terminado, dicho por nosotros

Preferimos decirlo antes de que lo encuentren. Ninguno de estos tres es trabajo pendiente por descuido:

1. **El cobro real de entradas (Mercado Pago)** — deliberadamente detrás de un interruptor. No hay confirmación pública del esquema de precios 2026; construir el cobro ahora implicaría inventar un precio institucional. El interruptor ya está listo ([ADR-0003](adr/0003-modo-de-acceso.md)).

2. **La grilla horaria minuto a minuto de la agenda** — depende de un tercero. La organización todavía no publicó el cronograma de charlas y shows para 2026 (en 2024 se conoció la semana previa). La sección Agenda muestra la estructura confirmada y **avisa explícitamente qué falta**, en vez de inventar horarios.

3. **La derivación a un humano en el asistente** — diseñada, no construida. Está en la Fase 3 del roadmap (después del 27/09). El asistente ya deriva a los canales de contacto reales cuando una pregunta sale de su dominio.

El detalle completo, con lo que sí quedó al 100%, está en la [matriz de cumplimiento](matriz-consignas-desafio.md).

---

## 7. Preguntas que probablemente tengas

**¿Por qué presentaron un desarrollo funcional si las Consignas dicen que no da ventaja sobre un mockup?**
Porque las Consignas §4.1 lo permiten explícitamente y porque para nosotros era el camino más rápido a una propuesta **verificable**. Entendemos que el jurado evalúa la calidad de la propuesta, la UX, la creatividad y la factibilidad técnica — no la cantidad de código. Por eso también presentamos la [suite de mockups](https://expojuy2026.vercel.app/mockups/) y la memoria descriptiva completa: el desarrollo es evidencia de factibilidad, no un atajo para saltearse el trabajo conceptual.

**¿Cuánto de esto lo hizo una IA?**
Está declarado sin ambigüedad en [`declaracion-uso-ia.md`](declaracion-uso-ia.md). Resumen: usamos IA como asistencia de desarrollo, documentación y exploración de diseño, bajo criterio y revisión del equipo en cada decisión. Cada elección de arquitectura, contenido y diseño fue tomada y validada por nosotros.

**¿Esto se puede mantener después, sin ustedes?**
Es una de las razones del diseño. Los módulos están aislados con límites que el build hace cumplir; los proveedores externos están detrás de interfaces intercambiables; las decisiones están registradas en ADRs; y la Fase 1 del roadmap es precisamente el gestor de contenidos, para que la Cámara publique sin depender del equipo. Detalle en [`architecture.md`](architecture.md).

**¿Respetaron el Kit de Diseño oficial?**
Sí. Logotipos, tipografía Ambit y paleta institucional salen del kit provisto. El sistema "Estratos" es la interpretación propia **alrededor** de esa identidad, no un reemplazo de ella.

**¿Y si no ganamos, esto sirve de algo?**
El repositorio queda como documentación pública de una propuesta completa para el evento. Y si la organización quiere tomar ideas de acá para el sitio ganador, nos parece bien: el objetivo declarado del desafío es que ExpoJuy 2026 tenga una buena plataforma digital.

---

<div align="center">

**Gracias por el tiempo de evaluación.**

[← Volver al README](../README.md) · [Sitio en vivo](https://expojuy2026.vercel.app) · [Memoria descriptiva](memoria-descriptiva.pdf)

</div>
