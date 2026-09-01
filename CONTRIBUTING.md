# Cómo trabajamos en este repositorio

Somos 2 personas en el equipo. Estas reglas existen para que ninguno de los dos tenga que adivinar en qué estado dejó el otro el código, y para que `main` esté siempre en un estado que se pueda mostrar o desplegar.

## Regla de oro

**Nadie commitea directo a `main`.** Ni un typo. Todo pasa por una rama y un Pull Request, sin excepción — es lo único que garantiza que el código en `main` fue visto por otro par de ojos antes de quedar ahí.

## Flujo (GitHub Flow)

1. Actualizar `main` local: `git checkout main && git pull`.
2. Crear una rama nueva desde `main` (ver convención de nombres abajo).
3. Trabajar en commits chicos y frecuentes (ver convención de commits abajo).
4. Pushear la rama y abrir un Pull Request contra `main` usando la plantilla.
5. El otro integrante revisa y aprueba (o pide cambios).
6. Cuando el PR está aprobado y el CI está en verde: **squash merge** a `main`.
7. Borrar la rama (local y remota) apenas se mergea.

`main` tiene protección activada: no acepta push directo, exige al menos 1 aprobación y que los checks pasen. Ver la sección final para la configuración exacta.

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

- Un PR chico se revisa rápido y se mergea rápido. Si un módulo es grande, partirlo en PRs incrementales detrás de su feature flag apagada (ver arquitectura, sección 04) en vez de un PR gigante al final.
- Usar la plantilla (`.github/PULL_REQUEST_TEMPLATE.md`): qué cambia, cómo probarlo, checklist.
- El autor no aprueba su propio PR. Con 2 personas, cada PR lo revisa el otro.
- Preferir **squash merge**: el historial de `main` queda como una lista de cambios completos, no como el detalle de cada commit intermedio de una rama.

## "Terminado" para poder mergear a `main`

Un PR está listo para mergear cuando:

- [ ] CI en verde: lint (incluye límites entre módulos), type-check, tests, build.
- [ ] Al menos 1 aprobación del otro integrante.
- [ ] Si el módulo no está 100% completo, el código vive detrás de una feature flag apagada — nunca a medio camino visible en producción.
- [ ] Probado manualmente en el preview deployment del PR (no solo "corre en mi máquina").
- [ ] Documentación tocada si el cambio lo amerita: `docs/architecture.md`, un ADR nuevo en `docs/adr/`, o `docs/memoria-ejecutiva.md`.

## Configuración de `main` en GitHub (una sola vez, vía Settings → Branches)

1. Add branch protection rule → branch name pattern: `main`.
2. ✅ Require a pull request before merging → Require approvals: **1**.
3. ✅ Require status checks to pass before merging (una vez que exista el workflow de CI).
4. ✅ Require branches to be up to date before merging.
5. ✅ Do not allow bypassing the above settings (incluye a los administradores).
6. ❌ Dejar desmarcado "Allow force pushes" y "Allow deletions".
