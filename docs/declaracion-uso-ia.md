# Declaración de uso de Inteligencia Artificial

**Desafío Digital ExpoJuy 2026** · Equipo Delestal94 + MaxLezano
Entregable del **Anexo III, ítem 6** de las Bases · exigido por el **Art. 11** de las Bases y las **Consignas Técnicas §8**

> Las Bases piden "informar brevemente qué herramientas utilizó y con qué finalidad". Este documento hace eso, y agrega el criterio con el que las usamos — porque el jurado evalúa el **uso responsable**, no la cantidad.

---

## 1. Posición del equipo

La IA fue **una herramienta de trabajo, no un reemplazo del trabajo.**

Cada decisión de arquitectura, de diseño, de contenido y de alcance que hay en esta propuesta fue tomada, discutida y validada por el equipo. La IA aceleró la ejecución y nos permitió cubrir más superficie en nueve días de la que dos personas cubren a mano — pero no eligió el stack, no inventó el concepto "Estratos", no decidió qué secciones van ni en qué orden, y no definió qué dejar afuera.

Donde la IA propuso algo que no resistía nuestro criterio, se descartó. Donde encontró un error nuestro, se corrigió. El registro de esas idas y vueltas está público en los [Pull Requests](https://github.com/Delestal94/Expo2026/pulls?q=is%3Apr+is%3Amerged) y en las [ADRs](adr/) — incluida [ADR-0005](adr/0005-acceso-libre-sin-registro.md), que documenta una decisión que **revertimos** al encontrar evidencia en contra.

---

## 2. IA usada en el proceso de trabajo

### 2.1 Asistencia de desarrollo

| Herramienta | Para qué la usamos |
|---|---|
| **Claude Code** (Anthropic) | Asistente de desarrollo sobre el repositorio: implementación de componentes, refactors, escritura de tests, redacción y mantenimiento de documentación. Trabaja por Pull Request, igual que una persona del equipo: nada entra sin revisión ni sin CI en verde. |
| **Agentes especializados propios** | Cuatro revisores críticos que escribimos nosotros para auditar el trabajo desde un ángulo específico, definidos en [`.claude/agents/`](../.claude/agents): crítico de diseño, revisor de UX por recorridos, director de animación/performance y auditor de visibilidad en buscadores. Su mandato es **encontrar lo que está mal**, no confirmar que está bien. |
| **Rutinas programadas** | Agentes horarios que corrieron durante el desarrollo sobre QA y regresión, accesibilidad, consistencia de diseño, seguridad y dependencias, performance, metadata y sincronización de documentación. **Abren un PR o un Issue; nunca deciden ni mergean.** |

### 2.2 Verificación empírica

Las auditorías no fueron opiniones: se verificaron contra el sitio corriendo.

- **Playwright** — recorridos automatizados en desktop y mobile para detectar errores reales de interacción. Encontró y nos hizo corregir, entre otros, un foco de teclado invisible en el mapa (WCAG 2.4.7), un lightbox que no atrapaba el foco ni cerraba con `Escape` (WCAG 2.4.3 y 2.1.1) y animaciones que ignoraban `prefers-reduced-motion`.
- **Lighthouse** — auditorías de performance sobre builds de producción reales. De ahí salió, por ejemplo, sacar el SDK de Supabase (143 KB, 89,8% sin usar) del bundle inicial de `/cuenta`.

### 2.3 Investigación y contenido

Usamos IA para **buscar y contrastar** fuentes sobre el evento: cobertura de prensa de la edición 2024, el programa oficial, declaraciones sobre el cambio de formato 2026, el esquema de precios anterior. Todo dato que entró al sitio quedó con su fuente verificable — las noticias enlazan a la nota original, los datos de contacto son los reales de la Cámara.

**Regla que nos pusimos:** ningún dato inventado. Donde no había información confirmada (la grilla horaria 2026, el esquema de precios 2026), el sitio **dice que falta** en lugar de rellenar con algo verosímil.

### 2.4 Exploración de diseño

La IA se usó para generar variantes rápidas de layout y maquetas exploratorias — la [suite de mockups estáticos](https://expojuy2026.vercel.app/mockups/) es parte de ese proceso. La dirección de arte, la paleta (tomada de la marca oficial real), la tipografía (Ambit, del kit oficial) y el concepto "Estratos" son decisiones del equipo.

### 2.5 Lo que la IA **no** hizo

- No eligió el stack tecnológico (ver [ADR-0001](adr/0001-stack-base.md)).
- No definió el concepto de identidad visual ni la metáfora geológica.
- No decidió la arquitectura de información ni el orden de las secciones.
- No generó recursos gráficos de marca: logotipos y tipografías salen del **Kit de Diseño oficial** de la organización.
- No generó las fotografías: son de la edición 2024 del mismo organizador.
- No mergeó código. Ni un commit entró sin pasar por Pull Request y CI.

---

## 3. IA dentro del producto: el asistente del sitio

El sitio incorpora un asistente conversacional (módulo `chatbot`). No es un chatbot genérico enchufado encima: se diseñó con reglas explícitas desde el principio.

### Cómo funciona

Recupera fragmentos del **contenido real del sitio** (fechas, sede, ejes, acceso, expositores) y responde con eso — es una arquitectura de recuperación aumentada (RAG), no un modelo respondiendo de memoria. Está disponible en los cinco idiomas. Hoy corre sobre OpenRouter con un modelo de Anthropic configurable por variable de entorno; como cualquier otro proveedor del proyecto, está detrás de una interfaz propia y se cambia sin tocar la lógica del sitio.

### Las cinco reglas que le pusimos

| Regla | Cómo se implementa |
|---|---|
| **Transparencia** | Se identifica como asistente virtual desde el primer mensaje. Nunca simula ser una persona. |
| **Alcance acotado** | Responde solo con contenido real del sitio. **No inventa horarios, precios ni datos de expositores.** Fuera de su dominio, deriva a los canales de contacto humanos reales de la Cámara. |
| **Privacidad** | No retiene conversaciones para entrenamiento ni pide datos personales innecesarios. Alineado con la Ley 25.326 de Protección de Datos Personales. |
| **Control de costo y abuso** | Rate limiting en el endpoint. Puede apagarse por completo (feature flag + kill-switch por variable de entorno) sin afectar ninguna otra parte del sitio. |
| **Nunca una barrera** | Es un atajo, no un requisito. **Toda la información que da el asistente está disponible navegando el sitio sin usarlo.** Si está apagado o falla, no se pierde nada. |

### Degradación segura

Sin credencial de API cargada, el asistente **no rompe ni muestra un error**: pasa a un modo de respuestas guiadas construidas con el contenido del sitio. Es el mismo criterio que aplicamos a todos los servicios externos — un proveedor caído no puede tirar abajo el sitio de un evento durante los cuatro días en que más se usa.

---

## 4. Trazabilidad

Todo lo declarado acá es verificable en el repositorio público:

| Qué | Dónde |
|---|---|
| Definición de los agentes revisores propios | [`.claude/agents/`](../.claude/agents) |
| Implementación del asistente y su RAG | [`src/modules/chatbot/`](../src/modules/chatbot) · [`src/app/api/chat/route.ts`](../src/app/api/chat/route.ts) |
| Feature flag y kill-switch del asistente | [`src/lib/config/flags.ts`](../src/lib/config/flags.ts) |
| Selección de proveedor de IA por configuración | [`.env.example`](../.env.example) · [ADR-0002](adr/0002-configurabilidad-adaptadores.md) |
| Registro de cada auditoría y su corrección | [Memoria ejecutiva](memoria-ejecutiva.md) · [PRs mergeados](https://github.com/Delestal94/Expo2026/pulls?q=is%3Apr+is%3Amerged) |

---

## 5. Compromiso para la Etapa 2

De resultar ganadores, mantenemos el mismo criterio durante el desarrollo del sitio oficial:

1. **Toda decisión de producto, contenido institucional y diseño la toma el equipo**, con la organización, no la IA.
2. **Ningún dato institucional generado sin fuente.** Precios, horarios, expositores y comunicados salen de la Cámara.
3. **El asistente del sitio mantiene sus cinco reglas**, y se suma la derivación explícita a un humano de la organización.
4. **La documentación de qué se automatizó queda escrita**, para que la Cámara pueda mantener el sitio sabiendo cómo se construyó cada parte.

---

<div align="center">

[← Volver al README](../README.md) · [Guía del jurado](GUIA-DEL-JURADO.md) · [Memoria descriptiva](memoria-descriptiva.pdf)

</div>
