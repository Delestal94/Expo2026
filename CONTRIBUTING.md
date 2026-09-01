# Cómo trabajamos en este repositorio

Somos 2 personas en el equipo. Estas reglas existen para que ninguno de los dos tenga que adivinar en qué estado dejó el otro el código, y para que siempre haya una rama en un estado que se pueda mostrar o desplegar sin sorpresas.

## Regla de oro

**Nadie commitea directo a `main` ni a `develop`.** Ni un typo. Todo pasa por una rama de trabajo y un Pull Request, sin excepción.

## Las dos ramas largas

| Rama | Para qué sirve | Quién le mergea |
|---|---|---|
| `develop` | Rama de integración. Acá vive el trabajo diario ya revisado — es la rama por defecto del repo, de la que sale todo lo nuevo. | Cualquier PR de `feature/*`, `fix/*`, `docs/*`, `chore/*` |
| `main` | Rama estable / entregable. Solo llega código que ya se probó integrado en `develop` y funciona de punta a punta. | Un único PR `develop → main`, cuando se decide promover una versión estable |

**`develop` no es sinónimo de "roto".** Que algo esté en `develop` significa que ya pasó por PR, revisión y CI — solo que todavía no se decidió que sea la versión que se muestra o se entrega. `main` en cualquier momento tiene que poder clonarse y andar.

## Flujo del día a día

1. Actualizar `develop` local: `git checkout develop && git pull`.
2. Crear una rama de trabajo desde `develop` (ver convención de nombres abajo).
3. Commits chicos y frecuentes (ver convención de commits abajo).
4. Pushear la rama y abrir un Pull Request **contra `develop`** usando la plantilla.
5. El otro integrante revisa y aprueba (o pide cambios).
6. CI en verde + 1 aprobación → **squash merge** a `develop`. La rama se borra sola.

## Cuándo se promueve `develop` a `main`

Se abre un PR `develop → main` cuando se cumple **todo** esto:

- [ ] Los módulos planificados para esa etapa del roadmap (ver `docs/architecture.md`) están completos y funcionando en `develop`, o detrás de una feature flag apagada si no lo están.
- [ ] CI en verde en `develop`.
- [ ] Probado en el deploy de staging (que sigue a `develop` automáticamente — ver infraestructura en `docs/architecture.md`).
- [ ] Sin bugs conocidos que bloqueen una demo o entrega.

Ese PR se mergea con **merge commit** (no squash), para que `main` conserve la trazabilidad de qué conjunto de cambios entró en cada versión estable — es la única excepción a "todo squash", y es intencional.

## Convención de nombres de rama

```
<tipo>/<módulo>-<descripción-corta-en-kebab-case>
```

Tipos: `feature`, `fix`, `refactor`, `docs`, `chore`, `test`.
Módulo: el nombre del módulo funcional cuando aplica (`visitor-access`, `exhibitors`, `business-rounds`, `ai-assistant`, `interactive-map`, `landing`, `i18n`, `config`) — así la rama ya cuenta qué toca antes de abrir el PR.

Ejemplos:
- `feature/exhibitors-profile-form`
- `fix/visitor-access-qr-validation`
- `docs/memoria-ejecutiva-avance-fase-1`
- `chore/ci-lint-boundaries`

## Convención de commits — Conventional Commits

```
<tipo>(<scope>): <descripción en infinitivo o presente, sin punto final>
```

Tipos válidos: `feat` `fix` `docs` `style` `refactor` `perf` `test` `chore` `ci` `build`.
El `scope` es el módulo afectado (mismo listado que arriba).

Ejemplos:
- `feat(exhibitors): agregar formulario de alta de perfil`
- `fix(visitor-access): evitar doble validación del mismo QR`
- `docs(adr): registrar decisión de admission mode configurable`
- `chore(ci): agregar regla de lint de límites entre módulos`

Un commit = un cambio lógico. Si la descripción necesita un "y" para explicar qué hace, probablemente son dos commits.

Se valida solo al commitear: `commitlint` corre en el hook `commit-msg` (`husky`), instalado automáticamente al hacer `npm install` (script `prepare`).

## Pull Requests

- Un PR chico se revisa rápido y se mergea rápido. Si un módulo es grande, partirlo en PRs incrementales contra `develop`, detrás de su feature flag apagada (ver arquitectura, sección 04), en vez de un PR gigante al final.
- Usar la plantilla (`.github/PULL_REQUEST_TEMPLATE.md`): qué cambia, cómo probarlo, checklist.
- El autor no aprueba su propio PR. Con 2 personas, cada PR lo revisa el otro.

## "Terminado" para poder mergear un PR a `develop`

- [ ] CI en verde: lint (incluye límites entre módulos), type-check, tests, build.
- [ ] Al menos 1 aprobación del otro integrante.
- [ ] Si el módulo no está 100% completo, el código vive detrás de una feature flag apagada — nunca a medio camino visible.
- [ ] Probado manualmente en el preview deployment del PR (no solo "corre en mi máquina").
- [ ] Documentación tocada si el cambio lo amerita: `docs/architecture.md`, un ADR nuevo en `docs/adr/`, o `docs/memoria-ejecutiva.md`.

## Configuración aplicada en GitHub

Ya aplicada sobre el repositorio (2026-09-01), vía API, **igual en `main` y en `develop`**:

- Require a pull request before merging → 1 aprobación mínima, se invalida si hay commits nuevos.
- Require conversation resolution before merging.
- Enforce for administrators (nadie puede saltarla, ni el dueño del repo).
- Sin force-push, sin borrado de la rama. Historial lineal obligatorio.
- `develop` es la rama por defecto del repositorio (de ahí sale todo PR nuevo).
- Merge habilitado: **squash** (uso normal, `feature/* → develop`) y **merge commit** (reservado para `develop → main`). Rebase deshabilitado. Borrado automático de rama al mergear.

**Límite conocido:** GitHub no permite restringir por API "a `main` solo le puede llegar un PR desde `develop`" — es una convención de equipo, no algo que la plataforma bloquee técnicamente.

**Pendiente:** una vez que exista un workflow de CI (`.github/workflows/`), agregar sus checks como *required status checks* en ambas ramas — hasta entonces, la revisión humana es el único gate.
