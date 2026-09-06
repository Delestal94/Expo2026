# ExpoJuy 2026 — Sitio oficial

Propuesta y desarrollo del sitio oficial de ExpoJuy 2026 para el **Desafío Digital ExpoJuy 2026** (Cámara de Comercio Exterior de Jujuy · Dirección Provincial de Servicios Basados en el Conocimiento · Clustear).

## 🌐 Sitio en vivo

| Entorno | Rama | URL |
|---|---|---|
| Producción | `main` | **https://expojuy2026.vercel.app** |
| Staging | `develop` | https://expojuy2026-git-develop-delestalmiguelignacio-5787s-projects.vercel.app |

Cada Pull Request genera además su propio preview automático (link en los checks del PR).

## Documentación

| Documento | Dónde |
|---|---|
| Arquitectura de software (versión presentable) | [Artifact publicado](https://claude.ai/code/artifact/38abc151-dbcc-4fe5-9861-d5aa012d651f) |
| Arquitectura de software (versión en repo) | [`docs/architecture.md`](docs/architecture.md) |
| Decisiones de arquitectura (ADR) | [`docs/adr/`](docs/adr) |
| **Memoria descriptiva (entregable del concurso)** | [`docs/memoria-descriptiva.md`](docs/memoria-descriptiva.md) |
| Bitácora ejecutiva (documento vivo de avance) | [`docs/memoria-ejecutiva.md`](docs/memoria-ejecutiva.md) |
| Cómo contribuir (branches, commits, PRs) | [`CONTRIBUTING.md`](CONTRIBUTING.md) |
| Board de tareas (roadmap → issues) | [Project ExpoJuy 2026](https://github.com/users/Delestal94/projects/1) |

## Stack

Next.js 16 (App Router) · TypeScript · PostgreSQL (Supabase) · Sanity CMS · next-intl · Vercel.
Ver el detalle y las razones de cada elección en la arquitectura.

## Cómo correr el proyecto

```bash
npm install
cp .env.example .env.local   # y completar valores si aplica
npm run dev                  # http://localhost:3000
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint, incluye la regla de límites entre módulos |
| `npm run type-check` | TypeScript sin emitir archivos |
| `npm test` | Tests con Vitest |
| `npm run test:watch` | Tests en modo watch |

Antes de mergear se corre todo esto en CI (`.github/workflows/ci.yml`) — correrlo local antes de abrir el PR ahorra una vuelta.

## Estado del proyecto

Etapa actual: **Fase 0 — mockup + memoria descriptiva para el concurso** (fecha límite 8/9/2026).

## Licencia

Público, sin licencia declarada — el copyright queda reservado para el equipo por defecto (ver [ADR-0004](docs/adr/0004-visibilidad-repositorio.md)).

## Equipo

- [Delestal94](https://github.com/Delestal94)
- [Maximiliano Lezano (MaxLezano)](https://github.com/MaxLezano)

