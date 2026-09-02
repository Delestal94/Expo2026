# ADR-0006: Scaffolding de i18n con next-intl

**Estado:** Aceptada
**Fecha:** 2026-09-02
**Tipo:** Decisión técnica — no decide idiomas ni contenido (ver [issue #4](https://github.com/Delestal94/Expo2026/issues/4), todavía abierto, para el quinto idioma).

## Contexto

El sitio hoy es español (Argentina) hardcodeado en cada módulo. El quinto idioma del evento todavía no está confirmado por la organización, pero conviene que agregarlo más adelante sea sumar un diccionario, no reestructurar rutas ni componentes. Esta ADR decide únicamente la infraestructura técnica que deja eso listo — ningún idioma nuevo, ninguna URL con prefijo de idioma, ninguna traducción.

## Decisión

Usar [`next-intl`](https://next-intl.dev), la librería que la propia documentación de Next.js linkea como opción estándar para App Router (`node_modules/next/dist/docs/01-app/02-guides/internationalization.md`).

Con un solo locale activo, se arranca en modo **sin ruteo por idioma** (sin segmento `[locale]`, sin `middleware`/`proxy`): agregar esa capa es una decisión que sí toca URLs y SEO, y queda para cuando haya un segundo idioma real que la justifique.

Piezas agregadas:

- `src/lib/i18n/request.ts`: config de next-intl (`getRequestConfig`), hoy devuelve siempre `"es-AR"`. Es el único lugar que cambia cuando haya que resolver el locale por ruta/cookie/header.
- `src/lib/i18n/messages/es-AR.json`: diccionario es-AR. Agregar un idioma nuevo es sumar `es-AR.json` → `<locale>.json` acá, sin tocar componentes.
- `src/lib/i18n/types.d.ts`: augmenta `AppConfig` de `use-intl` para autocompletado y chequeo en build de las claves de traducción.
- `next.config.ts`: envuelto con `createNextIntlPlugin`.
- `src/app/layout.tsx`: `NextIntlClientProvider` en el root, `lang` del `<html>` resuelto por `getLocale()`, y el título/descripción de metadata migrados a `getTranslations("Metadata")` como primer caso de uso real (antes, dos constantes hardcodeadas en el archivo).

La extracción del resto de los strings hardcodeados de cada módulo (`landing`, `visitor-access`, `exhibitors`, etc.) queda para PRs siguientes, uno por módulo — no se hace de golpe acá para no mezclar módulos en un solo PR grande (ver `AGENTS.md`).

## Alternativas consideradas

- **`next-i18n-router` / `next-international`** — descartadas: `next-intl` es la que Next.js linkea primero, tiene el ecosistema más grande y ya cubre Server Components, `generateMetadata` y type-safety sin plugins adicionales.
- **Arrancar directamente con ruteo por idioma (`app/[locale]/...`)** — descartado por ahora: reestructurar todas las rutas existentes (`/`, `/cuenta`, `/galeria`) para un solo idioma activo agrega complejidad (matcher de `proxy`, `generateStaticParams`, links localizados) sin beneficio hasta que exista un segundo idioma real. `next-intl` soporta agregar el ruteo después sin cambiar cómo se llama a `useTranslations`/`getTranslations` en los componentes.
- **Diccionario plano hecho a mano (patrón `getDictionary` de la doc de Next.js, sin librería)** — descartado: pierde ICU (plurales, interpolación), type-safety y el provider para Client Components, que `next-intl` da gratis y que varios módulos (ej. `visitor-access/ui/access-form.tsx`, con estados de error dinámicos) van a necesitar.

## Consecuencias

Agregar un segundo idioma cuando se decida (issue #4) es: sumar `<locale>.json`, resolver el locale real en `request.ts` (y recién ahí decidir ruteo/URL, que es en parte una decisión de producto y queda fuera de esta ADR), y traducir. No hace falta tocar componentes ya migrados a `useTranslations`/`getTranslations`.

A cambio, cada módulo nuevo que agregue texto tiene que decidir si lo hardcodea (como hasta ahora, deuda a extraer después) o lo agrega directo al diccionario — no hay enforcement automático todavía (podría agregarse un lint de strings sueltos en JSX más adelante, fuera de alcance de esta ADR).
