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
| 2026-09-01 | Decisión | `ADMISSION_MODE=free` como default técnico provisorio (para no exponer un checkout sin terminar), sin esperar confirmación de la Cámara — evita bloquear el desarrollo. Corregido más tarde el mismo día: el antecedente real (2024) fue pago, ver fila siguiente | [ADR-0003](adr/0003-modo-de-acceso.md) |
| 2026-09-01 | Mapa interactivo | Plano esquemático de Ciudad Cultural: 4 pabellones por eje, 3 salas con estado de ejemplo, interacción por click/hover/teclado. Verificado con Playwright — se encontró y corrigió un bug real de superposición de etiquetas | [PR #22](https://github.com/Delestal94/Expo2026/pull/22) |
| 2026-09-01 | Portal de expositores | Directorio filtrable por eje + preview de matching de rondas de negocios (score de compatibilidad, tags compartidos). Verificado con Playwright | [PR #24](https://github.com/Delestal94/Expo2026/pull/24) |
| 2026-09-01 | Repositorio | **Mockup navegable completo** (landing + mapa + portal, identidad Estratos consistente) — issue #5 cerrado, board actualizado | [Project ExpoJuy 2026](https://github.com/users/Delestal94/projects/1) |
| 2026-09-01 | Repositorio | 4 agentes horarios en la nube (QA/regresión, accesibilidad, consistencia de diseño, sync de documentación) — abren PR o Issue, nunca deciden negocio, corren hasta el 30/9 | Routines en claude.ai/code/routines |
| 2026-09-01 | Infraestructura | **Sitio conectado a Vercel y en vivo**: producción seguía `main` (que todavía no tenía el scaffold) — se promovió `develop → main` por primera vez (PR #26) para destrabarlo | **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)** |
| 2026-09-01 | Repositorio | Se detectó y corrigió una contradicción propia: "historial lineal obligatorio" en `main` bloqueaba el merge commit que el mismo `CONTRIBUTING.md` reserva para `develop → main`. Se desactivó historial lineal solo en `main` | [CONTRIBUTING.md](../CONTRIBUTING.md) |
| 2026-09-01 | Registro de acceso | Puerto `AuthProvider` + adaptador real de Supabase Auth (signUp/signIn/signOut/getSession), con tests sobre el SDK mockeado. Corrige de paso un bug propio en `eslint.config.mjs` que bloqueaba imports cruzados dentro de `lib/` | [PR #28](https://github.com/Delestal94/Expo2026/pull/28) |
| 2026-09-01 | Decisión | Confirmado con evidencia sólida (cobertura completa del programa 2024): el ingreso general **fue pago con venta online**, no gratuito — se revierte la suposición de "acceso libre" evaluada brevemente antes. Se confirma además que expositores/proveedores se postulan por canales externos (formulario de Google + WhatsApp de la Cámara), no por el sitio | [ADR-0003](adr/0003-modo-de-acceso.md), [ADR-0005](adr/0005-acceso-libre-sin-registro.md) |
| 2026-09-01 | Landing | Sección de acceso rehecha con precios de referencia 2024 reales, CTA de "comprar entrada" honesto (deshabilitado, próxima etapa) y links reales a la convocatoria de proveedores (Google Form) y WhatsApp de la Cámara | [PR #29](https://github.com/Delestal94/Expo2026/pull/29) |
| 2026-09-01 | Accesibilidad | Auditoría empírica con Playwright sobre landing, mapa interactivo y portal de expositores: corregido foco de teclado invisible en el plano interactivo (WCAG 2.4.7) y animaciones que ignoraban `prefers-reduced-motion` en el indicador "en ronda" del mapa y en el preview de matching de expositores. Contraste insuficiente de `text-terracotta`/`text-violet` detectado pero no corregido (decisión de paleta fuera de mandato) — [issue #35](https://github.com/Delestal94/Expo2026/issues/35) | [PR #34](https://github.com/Delestal94/Expo2026/pull/34) |
| 2026-09-01 | Portal de expositores | Corrección de consistencia con el sistema de diseño: color hardcodeado (`#0b0a12`) reemplazado por el token `var(--color-ink)` en los chips de filtro del directorio | [PR #37](https://github.com/Delestal94/Expo2026/pull/37) |
| 2026-09-01 | Landing | Tests para `getTimeLeft` (cuenta regresiva): descomposición de tiempo restante, instante exacto de inicio, clamp a cero tras pasado el evento y no desborde entre unidades | [PR #39](https://github.com/Delestal94/Expo2026/pull/39) |
| 2026-09-01 | Configuración | Metadata completa de compartibilidad: Open Graph, Twitter Card, favicon e imagen de Open Graph generados con `ImageResponse`, `metadataBase` apuntando a la URL real de producción | [PR #41](https://github.com/Delestal94/Expo2026/pull/41) |
| 2026-09-01 | Configuración | `sitemap.xml` y `robots.txt` (convenciones App Router), sin rutas inventadas — solo la única ruta real del sitio en ese momento | [PR #42](https://github.com/Delestal94/Expo2026/pull/42) |
| 2026-09-01 | Landing | Datos estructurados JSON-LD (schema.org `Event`) en la landing, con datos ya confirmados en el repo (fechas, ubicación, organizador) — sin inventar información nueva | [PR #43](https://github.com/Delestal94/Expo2026/pull/43) |
| 2026-09-01 | Repositorio | Segundo integrante (`@MaxLezano`) sumado a `.github/CODEOWNERS`; GitHub le pide review automáticamente en cada PR nuevo | [PR #38](https://github.com/Delestal94/Expo2026/pull/38) |
| 2026-09-01 | Landing | Módulo `gallery`: preview de 6 fotos en la landing + ruta nueva `/galeria` con grilla de 30 fotos y lightbox — fotos reales de ExpoJuy 2024 (mismo organizador, Cámara de Comercio Exterior de Jujuy) | [PR #45](https://github.com/Delestal94/Expo2026/pull/45) |
| 2026-09-01 | Registro de acceso | Tests de la fábrica `createAuthProvider`: caso feliz (`supabase`) y adaptadores todavía no implementados (`clerk`, `nextauth`) que deben fallar con error claro — sin cambios de comportamiento | [PR #48](https://github.com/Delestal94/Expo2026/pull/48) |
| 2026-09-01 | Registro de acceso | Primer paso real del módulo (antes vacío): `AccessForm` (crear cuenta / iniciar sesión) sobre el `AuthProvider` existente, nueva ruta `/cuenta` que respeta el flag `visitorAccess`, link desde la landing. No incluye QR de ingreso ni cobro (ver ADR-0003) | [PR #47](https://github.com/Delestal94/Expo2026/pull/47) |
| 2026-09-01 | Repositorio | 4 agentes horarios más: seguridad/dependencias, performance, SEO/metadata, y desarrollo de funcionalidades (registro de acceso, i18n, rondas de negocios reales — todo lo desbloqueado de la Fase 2). Total: 8 agentes corriendo | Routines en claude.ai/code/routines |
| 2026-09-01 | Repositorio | Limpieza de PRs: cerrados 5 sin mergear (2 vacíos/redundantes, 1 con un bug real de CODEOWNERS — dos líneas `*` en vez de una se pisan entre sí en vez de sumarse —, 2 con conflictos de bitácora ya cubiertos por filas nuevas) | PRs #30, #31, #33, #44, #46 |
| 2026-09-01 | Registro de acceso | QR de ingreso (`EXPOJUY26-XXXXXXXX`, derivado del id de Supabase) emitido al completar el registro en modo de acceso gratuito, sin pasar por checkout; en modo pago se avisa que el QR se habilita recién tras pagar (Mercado Pago sigue bloqueado) | [PR #50](https://github.com/Delestal94/Expo2026/pull/50) |
| 2026-09-01 | Accesibilidad | Auditoría empírica con Playwright sobre la UI nueva desde la última corrida (`visitor-access`, galería, `/cuenta`): corregido el lightbox de la galería (`/galeria`), que no atrapaba el foco de teclado, dejaba `Tab` escapar a miniaturas ocultas detrás del overlay y no cerraba con `Escape` (WCAG 2.4.3 y 2.1.1) | [PR #51](https://github.com/Delestal94/Expo2026/pull/51) |
| 2026-09-01 | Registro de acceso | Auditoría de performance (Lighthouse sobre build de producción): el SDK de Supabase (143 KB, 89.8% código sin usar en `/cuenta`) pasa de import estático a `import()` dinámico en `AccessForm`, sacándolo del bundle inicial de la página | [PR #52](https://github.com/Delestal94/Expo2026/pull/52) |
| 2026-09-01 | Portal de expositores | Tests de `Directory` (filtrado por eje: estado por defecto, click en cada filtro, vuelta a "Todos", `aria-pressed`), lógica que no tenía cobertura directa ni indirecta — sin cambios de comportamiento | [PR #54](https://github.com/Delestal94/Expo2026/pull/54) |
| 2026-09-01 | Configuración | `sitemap.xml` actualizado con las rutas nuevas `/galeria` y `/cuenta` (se habían agregado sin tocar el sitemap) | [PR #56](https://github.com/Delestal94/Expo2026/pull/56) |

## 6. Próximos pasos

- [ ] Seguir esperando confirmación formal de la Cámara sobre si 2026 mantiene el esquema pago de 2024, aunque ya no bloquea nada ([issue](https://github.com/Delestal94/Expo2026/issues/3)).
- [ ] Definir el quinto idioma ([issue](https://github.com/Delestal94/Expo2026/issues/4)).
- [ ] Repasar la memoria descriptiva una vez más antes del 8/9 y confirmar que las capturas/links estén al día.
- [ ] Corregir contraste insuficiente de terracotta/violet sobre fondo oscuro ([issue #35](https://github.com/Delestal94/Expo2026/issues/35)).
- [ ] Optimizar la animación del hero (`StrataCanvas`), satura el hilo principal (TBT 940ms) ([issue #36](https://github.com/Delestal94/Expo2026/issues/36)).
- [ ] Recordar desactivar los 8 agentes horarios cerca del 30/9 (la API no soporta auto-apagado) — [claude.ai/code/routines](https://claude.ai/code/routines).
