# Memoria ejecutiva — ExpoJuy 2026

> Documento vivo. Es la base de la memoria descriptiva que se presenta al Desafío Digital ExpoJuy 2026, y el material fuente para el Demo Day (14/9) y la entrega final (30/9). Se actualiza en el mismo PR que introduce el cambio que documenta — no al final.

## 1. El problema

ExpoJuy dejó de ser una feria de dos semanas para pasar a un formato de 4 días con el doble de intensidad de actividad (rondas de negocios a la mañana, expo a la tarde), con foco declarado en minería/litio y en el Corredor Bioceánico de Capricornio. Ese cambio de formato exige un sitio que sostenga procesos que antes no necesitaba resolver bien: coordinar rondas de negocios entre expositores y compradores internacionales, dar información en tiempo real durante un evento corto y compacto, y llegar a delegaciones que no hablan español.

## 2. La propuesta

Un sitio construido como infraestructura de evento, no como landing institucional, con cuatro decisiones de diseño que lo sostienen:

1. **Nada queda hardcodeado.** Cada módulo se puede prender o apagar sin deploy, y ningún proveedor externo (pagos, IA, CMS) está escrito a mano en la lógica de negocio — se puede reemplazar sin reescribir pantallas.
2. **Nada queda acoplado.** Cada capacidad de negocio vive aislada en su propio módulo, con límites que se hacen cumplir en el proceso de build, no por acuerdo verbal del equipo.
3. **Un contenido, cinco idiomas.** Priorizado por la audiencia real del evento (español, inglés, portugués, mandarín — foco Corredor Bioceánico e inversión minera), no por una lista genérica.
4. **IA usada con responsabilidad declarada.** El asistente conversacional responde solo con contenido real del sitio, deriva a un humano fuera de su alcance, y no retiene datos de las conversaciones.

Detalle técnico completo en [`docs/architecture.md`](architecture.md).

## 3. Por qué es distinto a "una página web"

- El módulo de expositores no es un directorio: sugiere reuniones de rondas de negocios por rubro/país, con agenda de slots — ataca directamente el objetivo comercial del evento (Corredor Bioceánico), no solo su difusión.
- El mapa interactivo es un dato, no una imagen: sabe qué sala está en ronda de negocios ahora mismo.
- El acceso (gratuito o pago, según se confirme) es un interruptor de configuración, no una decisión enterrada en el código — se puede ajustar sin volver a programar nada.

## 4. Equipo

| Integrante | Rol |
|---|---|
| Delestal94 | _(completar)_ |
| Maximiliano Lezano | _(completar)_ |

## 5. Bitácora de avance

> Una fila por cada hito relevante (PR mergeado, decisión tomada, entrega parcial). Esto es lo que se convierte en slides para el Demo Day — mantenerlo actualizado es más rápido que reconstruirlo a último momento.

| Fecha | Módulo/área | Qué se hizo | Referencia |
|---|---|---|---|
| 2026-08-31 | Arquitectura | Definición de stack base y arquitectura general | [ADR-0001](adr/0001-stack-base.md) |
| 2026-08-31 | Arquitectura | Diseño de feature flags + puertos/adaptadores | [ADR-0002](adr/0002-configurabilidad-adaptadores.md) |
| 2026-09-01 | Repositorio | Estructura de repo, estándares de branching/commits/PR, ADRs iniciales | Este commit |
| 2026-09-01 | Repositorio | Modelo de dos ramas (`develop` integración / `main` estable) con protección aplicada en ambas | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| 2026-09-01 | Repositorio | Scaffold de Next.js: módulos, puertos/adaptadores, env tipado, flags, tests, CI, commitlint/husky, CODEOWNERS, Dependabot | PR `chore/scaffold-and-tooling` |
| 2026-09-01 | Repositorio | CI verificado en verde en GitHub; activado como *required status check* en `main` y `develop` | [Actions](https://github.com/Delestal94/Expo2026/actions) |
| 2026-09-01 | Repositorio | 4 milestones (Fase 0-3), 8 issues fundacionales y board de tareas | [Project ExpoJuy 2026](https://github.com/users/Delestal94/projects/1) |
| 2026-09-01 | Repositorio | Repositorio confirmado público sin licencia (copyright reservado por defecto) | [ADR-0004](adr/0004-visibilidad-repositorio.md) |
| 2026-09-01 | Repositorio | Excepción temporal: 0 aprobaciones requeridas hasta sumar al segundo integrante | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| 2026-09-01 | Repositorio | Scaffold mergeado a `develop`; primeros PRs de Dependabot: 4 mergeados (actions, @types/node, jsdom), 2 cerrados por incompatibilidad río arriba (TypeScript 7 y ESLint 10 todavía no soportados por `eslint-config-next`/`typescript-eslint`) | [Actions](https://github.com/Delestal94/Expo2026/actions) |
| 2026-09-01 | Landing | Hero + identidad visual "Estratos": bandas minerales del Cerro de los Siete Colores animadas en canvas, cuenta regresiva real, secciones Qué es/Ejes/Registro. Verificado con Playwright (desktop + mobile, sin errores de consola) | [PR #18](https://github.com/Delestal94/Expo2026/pull/18) |
| 2026-09-01 | Repositorio | Memoria descriptiva redactada (repo + versión presentable); equipo confirmado (Delestal94 + Maximiliano Lezano) | [docs/memoria-descriptiva.md](memoria-descriptiva.md) |
| 2026-09-01 | Decisión | Acceso gratuito adoptado como supuesto de trabajo, sin esperar confirmación de la Cámara — evita bloquear el desarrollo | [ADR-0003](adr/0003-modo-de-acceso.md) |
| 2026-09-01 | Mapa interactivo | Plano esquemático de Ciudad Cultural: 4 pabellones por eje, 3 salas con estado de ejemplo, interacción por click/hover/teclado. Verificado con Playwright — se encontró y corrigió un bug real de superposición de etiquetas | [PR #22](https://github.com/Delestal94/Expo2026/pull/22) |

## 6. Próximos pasos

- [ ] Seguir esperando confirmación formal de la Cámara sobre el modo de acceso, aunque ya no bloquea nada ([issue](https://github.com/Delestal94/Expo2026/issues/3)).
- [ ] Definir el quinto idioma ([issue](https://github.com/Delestal94/Expo2026/issues/4)).
- [ ] Portal de expositores (o su propuesta visual) para completar el mockup navegable antes del 8/9 ([issue](https://github.com/Delestal94/Expo2026/issues/5)).
- [ ] **En cuanto el segundo integrante acepte la invitación:** volver `required_approving_review_count` a 1 en `main` y `develop` (comando en `CONTRIBUTING.md`), y completar su usuario en `.github/CODEOWNERS`, `README.md` y este documento.
