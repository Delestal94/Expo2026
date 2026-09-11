# Cómo trabajamos

**Desafío Digital ExpoJuy 2026** · Equipo Delestal94 + MaxLezano

Las Bases evalúan "calidad general de la presentación" y "factibilidad técnica". Este documento explica **el método**, no el resultado — porque un equipo que puede sostener este proceso durante nueve días puede sostenerlo durante los quince que dura la Etapa 2.

Todo lo que se afirma acá es verificable en el repositorio público.

---

## 1. El resumen en números

| | Verificable en |
|---|---|
| **153** Pull Requests mergeados | [Historial de PRs](https://github.com/Delestal94/Expo2026/pulls?q=is%3Apr+is%3Amerged) |
| **0** commits directos a `main` o `develop` | [Historial de commits](https://github.com/Delestal94/Expo2026/commits/develop) |
| **102** tests automatizados en 26 archivos | `npm test` · [Actions](https://github.com/Delestal94/Expo2026/actions) |
| **6** decisiones de arquitectura documentadas | [`docs/adr/`](adr/) |
| **15** issues abiertos y cerrados con trazabilidad | [Issues](https://github.com/Delestal94/Expo2026/issues?q=is%3Aissue) |
| **8** módulos funcionales aislados | [`src/modules/`](../src/modules) |
| **5** idiomas completos | [`src/lib/i18n/messages/`](../src/lib/i18n/messages) |
| **9** días de trabajo (31/08 → 08/09) | Fechas de los PRs |

---

## 2. La regla de oro

> **Nadie commitea directo a `main` ni a `develop`. Ni un typo.**

Esta regla está escrita en [`CONTRIBUTING.md`](../CONTRIBUTING.md) desde el **primer commit del repositorio**, antes de que existiera una línea de código del sitio. No es una norma que adoptamos cuando el proyecto creció: es la base sobre la que se construyó.

Somos dos personas. La regla existe para que ninguno tenga que adivinar en qué estado dejó el otro el código, y para que **siempre haya una rama que se puede mostrar o desplegar sin sorpresas**.

---

## 3. El flujo de un cambio, de punta a punta

```
  develop ──┐
            │  1. rama de trabajo:  feature/exhibitors-buscador
            ├──────────────────────────────────────────────┐
            │                                              │
            │  2. commits chicos (Conventional Commits,    │
            │     validados por commitlint en cada commit) │
            │                                              │
            │  3. Pull Request con plantilla:              │
            │     qué cambia · por qué · cómo se probó     │
            │                                              │
            │  4. CI obligatorio ─── lint (+ límites entre módulos)
            │                    ├── type-check
            │                    ├── 102 tests
            │                    └── build de producción
            │                                              │
            │  5. deploy preview automático de ese PR      │
            │  6. review del otro integrante (CODEOWNERS)  │
            │                                              │
  develop ◄─┴── 7. squash merge · la rama se borra sola ───┘
     │
     │  8. cuando la etapa está completa y probada en staging:
     │     un único PR develop → main, con merge commit
     ▼
   main ──► producción: expojuy2026.vercel.app
```

**Si el CI está rojo, no entra.** No hay override, no hay "lo arreglo después".

### Las dos ramas largas

| Rama | Para qué sirve |
|---|---|
| `develop` | Rama de integración: acá vive el trabajo diario ya revisado. Es la rama por defecto del repo. |
| `main` | Rama estable/entregable: solo llega código ya probado integrado. **`main` en cualquier momento tiene que poder clonarse y andar.** |

El PR `develop → main` se mergea con **merge commit** en vez de squash — la única excepción a la regla, y es intencional: así `main` conserva la trazabilidad de qué conjunto de cambios entró en cada versión estable.

---

## 4. Las cuatro barreras de calidad

Ninguna depende de que alguien se acuerde de correrla.

### 4.1 CI en cada Pull Request

[`.github/workflows/ci.yml`](../.github/workflows/ci.yml) corre cuatro pasos, configurados como *required status checks* en `main` y `develop`:

| Paso | Qué atrapa |
|---|---|
| `lint` | Errores de estilo **y violaciones de los límites entre módulos** (ver 4.2) |
| `type-check` | Cualquier inconsistencia de tipos en TypeScript estricto |
| `test` | Las 102 pruebas automatizadas |
| `build` | Que el sitio realmente compile para producción |

### 4.2 Límites entre módulos, verificados por el build

Cada capacidad de negocio vive en `src/modules/<nombre>` con un único `index.ts` como puerta de entrada pública. Una regla de ESLint (`eslint-plugin-boundaries`) **rompe el build** si un módulo importa un archivo interno de otro.

No es una convención de equipo que se degrada con el tiempo: es una restricción que la máquina hace cumplir. Es la razón por la que sumar Noticias y Agenda como secciones nuevas no requirió tocar los módulos existentes — y la razón por la que la Cámara va a poder sumar secciones después sin romper lo anterior.

### 4.3 Tests donde importan

102 tests que cubren la lógica que puede fallar en silencio: cálculo de la cuenta regresiva, firma del código QR de admisión, filtrado y búsqueda de expositores, selección de zonas del mapa, paridad entre los cinco diccionarios de idioma, adaptadores de auth/pago/presencia, datos estructurados y accesibilidad de componentes.

La **paridad de traducciones** merece mención aparte: hay un test que falla si un idioma tiene una clave que otro no. Con cinco idiomas, es la única forma de que no se escape un texto sin traducir.

### 4.4 Hooks locales

Husky + lint-staged corren ESLint sobre lo que se está por commitear, y commitlint valida el mensaje contra Conventional Commits. El error se ve antes de pushear, no diez minutos después en el CI.

---

## 5. Cómo tomamos decisiones: los ADR

Cada decisión de arquitectura que costaba discutir quedó escrita con **fecha, contexto, alternativas y consecuencias** en [`docs/adr/`](adr/).

| ADR | Decisión |
|---|---|
| [0001](adr/0001-stack-base.md) | Next.js + TypeScript + Supabase + Vercel como stack base |
| [0002](adr/0002-configurabilidad-adaptadores.md) | Feature flags editoriales + arquitectura de puertos y adaptadores |
| [0003](adr/0003-modo-de-acceso.md) | Modo de acceso (gratuito o pago) configurable |
| [0004](adr/0004-visibilidad-repositorio.md) | Repositorio público, sin licencia declarada |
| [0005](adr/0005-acceso-libre-sin-registro.md) | Expositores se postulan por canales externos al sitio |
| [0006](adr/0006-scaffolding-i18n.md) | Scaffolding de i18n con next-intl |

### La ADR de la que estamos más orgullosos es la que nos equivocamos

[ADR-0005](adr/0005-acceso-libre-sin-registro.md) se planteó originalmente como *"acceso libre para todos, sin registro"*. Después encontramos evidencia sólida — la cobertura del programa completo de la edición 2024 — de que el ingreso general **sí fue pago con venta online**. Esa parte quedó revertida, y la reversión está escrita arriba de todo en el mismo documento.

No la borramos ni la reescribimos para que quedara bien. Un registro de decisiones que solo contiene aciertos no es un registro: es marketing.

---

## 6. Auditorías críticas: cómo buscamos nuestros propios errores

El riesgo de dos personas trabajando nueve días sobre lo mismo es dejar de ver lo que construyeron. Contra eso montamos **revisores especializados con mandato explícito de encontrar lo que está mal**, no de confirmar que está bien. Sus definiciones están versionadas en [`.claude/agents/`](../.claude/agents) — se pueden leer.

| Revisor | Qué audita | Regla que lo gobierna |
|---|---|---|
| [`design-critic`](../.claude/agents/design-critic.md) | Arquitectura de información, accesibilidad, consistencia visual, identidad institucional | *"Si tu informe dice mayormente que está bien, fallaste"* |
| [`ux-reviewer`](../.claude/agents/ux-reviewer.md) | Recorridos completos de tarea: sacar la entrada, encontrar un expositor, ubicar un stand | *"¿Puede el visitante terminar lo que vino a hacer?"* — por tarea, no por archivo |
| [`animator`](../.claude/agents/animator.md) | Calidad del movimiento **y su costo en rendimiento** | *"Una animación hermosa a 24fps es una animación rota"* |
| [`geo-critic`](../.claude/agents/geo-critic.md) | Si el sitio es encontrable en Google y citable por buscadores conversacionales | *"Buscá por qué NO te citarían, hoy, con el código tal cual está"* |

Cada auditoría se cerró con su PR de correcciones, público y revisable:

- **Diseño** → [PR #169](https://github.com/Delestal94/Expo2026/pull/169)
- **UX por recorridos** → [PR #171](https://github.com/Delestal94/Expo2026/pull/171)
- **Visibilidad y datos estructurados** → [PR #173](https://github.com/Delestal94/Expo2026/pull/173)
- **Animaciones y performance de scroll** → [PR #167](https://github.com/Delestal94/Expo2026/pull/167), [#186](https://github.com/Delestal94/Expo2026/pull/186)
- **Contraste y design tokens** → [PR #145](https://github.com/Delestal94/Expo2026/pull/145)

### Verificación empírica, no opiniones

Las auditorías se contrastaron contra el sitio corriendo, con **Playwright** (recorridos en desktop y mobile) y **Lighthouse** (performance sobre builds de producción). Ejemplos de hallazgos reales que salieron de ahí y se corrigieron:

- Foco de teclado invisible en el plano interactivo (WCAG 2.4.7).
- Lightbox de la galería que no atrapaba el foco, dejaba escapar `Tab` a miniaturas ocultas y no cerraba con `Escape` (WCAG 2.4.3 y 2.1.1).
- Animaciones que ignoraban `prefers-reduced-motion`.
- SDK de Supabase (143 KB, 89,8% sin usar) cargándose en el bundle inicial de `/cuenta`.
- Superposición de etiquetas en el plano del predio.

---

## 7. Documentar mientras se trabaja, no al final

La [memoria ejecutiva](memoria-ejecutiva.md) es una bitácora con **una fila por hito**, y la regla es que se actualiza **en el mismo Pull Request que introduce el cambio que documenta** — no en una sesión de documentación al final.

Por eso la memoria descriptiva que se presenta al concurso no hubo que reconstruirla a último momento: ya estaba escrita, día por día, con las fechas y los links reales.

La documentación del repositorio está organizada por audiencia:

| Documento | Para quién |
|---|---|
| [`README.md`](../README.md) | Cualquiera que llega por primera vez |
| [`GUIA-DEL-JURADO.md`](GUIA-DEL-JURADO.md) | El jurado: qué mirar y en qué orden |
| [`memoria-descriptiva.pdf`](memoria-descriptiva.pdf) | Entregable formal del concurso |
| [`matriz-consignas-desafio.md`](matriz-consignas-desafio.md) | Auditoría de cumplimiento consigna por consigna |
| [`architecture.md`](architecture.md) | Quien tenga que mantener o extender el sistema |
| [`adr/`](adr/) | Quien quiera saber **por qué** algo es como es |
| [`CONTRIBUTING.md`](../CONTRIBUTING.md) | Quien se sume a trabajar en el repo |
| [`ux-ui/DESIGN.md`](../ux-ui/DESIGN.md) | Quien diseñe pantallas nuevas |

---

## 8. Higiene del repositorio

Cosas chicas que muestran si un proyecto se cuida o se abandona:

- **[CODEOWNERS](../.github/CODEOWNERS)** — GitHub le pide review al otro integrante automáticamente en cada PR.
- **[Plantilla de Pull Request](../.github/PULL_REQUEST_TEMPLATE.md)** — qué cambia, por qué y cómo se probó, en cada uno.
- **[Dependabot](../.github/dependabot.yml)** — actualizaciones de dependencias revisadas por PR. Algunas se mergearon; otras se **cerraron a conciencia** por incompatibilidad río arriba (TypeScript 7 y ESLint 10 todavía no soportados por `eslint-config-next`), con el motivo anotado.
- **Ramas que se borran solas** tras el merge.
- **Board de tareas** mapeado al roadmap: [Project ExpoJuy 2026](https://github.com/users/Delestal94/projects/1).
- **Issues para lo que se difiere**, en vez de dejarlo como deuda invisible: contraste de colores, performance del hero, definición del quinto idioma.

---

## 9. Por qué esto importa para la Etapa 2

La Etapa 2 son **quince días** (15 → 30 de septiembre) para entregar el sitio oficial completo, probado y listo para publicar. Eso no se sostiene improvisando.

Lo que este repositorio ya demuestra:

1. **Ritmo sostenido y verificable** — 153 PRs en nueve días, con fechas públicas.
2. **Un proceso que no depende de la memoria de nadie** — el CI y el lint hacen cumplir las reglas, no la buena voluntad.
3. **Capacidad de encontrar y corregir errores propios** — cinco rondas de auditoría crítica, cada una con su PR de correcciones.
4. **Documentación al día desde el día uno** — la Etapa 2 exige entregar documentación técnica y manual de despliegue; acá ya existe el hábito.
5. **Una arquitectura pensada para que la Cámara la mantenga** — módulos aislados, proveedores intercambiables, decisiones registradas, y un CMS como primer entregable de la Fase 1 para que puedan publicar sin depender de nosotros.

---

<div align="center">

[← Volver al README](../README.md) · [Guía del jurado](GUIA-DEL-JURADO.md) · [Arquitectura](architecture.md)

</div>
