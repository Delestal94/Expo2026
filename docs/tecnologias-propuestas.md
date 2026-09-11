# Tecnologías propuestas

**Desafío Digital ExpoJuy 2026** · Equipo Delestal94 + MaxLezano
Entregable del **Anexo III, ítem 5** de las Bases · exigido por las **Consignas Técnicas §4.2 y §7**

> Las Consignas §7 aclaran que *"la tecnología elegida no será un criterio de evaluación por sí misma"*. De acuerdo. Por eso este documento no defiende un stack: explica **qué problema resuelve cada pieza** y qué pasa si hay que cambiarla.
>
> Lo que sí evalúan las Bases (Art. 10) es escalabilidad, seguridad, accesibilidad, buenas prácticas, rendimiento y mantenimiento. Cada elección está justificada contra eso.

---

## 1. El criterio de selección

Tres restricciones reales condicionaron todo:

1. **Un equipo de dos personas.** Nada que requiera un especialista dedicado por capa.
2. **Quince días de desarrollo en la Etapa 2** (15 → 30 de septiembre). Nada que haya que aprender sobre la marcha.
3. **La Cámara mantiene el sitio después.** Nada que solo nosotros podamos operar, y nada que la ate a un proveedor del que no pueda salir.

De ahí sale la regla que atraviesa la arquitectura: **todo lo que no es lógica propia del evento se delega a un servicio administrado, y todo servicio administrado está detrás de una interfaz propia.**

---

## 2. El stack

### Núcleo (lo que ya está construido y corriendo)

| Capa | Tecnología | Por qué esta |
|---|---|---|
| **Framework** | **Next.js 16** (App Router) | Renderizado en servidor para SEO y performance, rutas de API en el mismo proyecto, previews automáticos por Pull Request. Está en la lista de tecnologías sugeridas por las Consignas §7. |
| **Lenguaje** | **TypeScript** (modo estricto) | Tipado de punta a punta: el error se ve al escribir, no en producción durante los cuatro días del evento. |
| **UI** | **React 19** | Ecosistema más grande y con más gente disponible en la provincia — importa para que la Cámara pueda contratar mantenimiento después. |
| **Estilos** | **Tailwind CSS 4** + design tokens propios | Los colores y tipografías de la marca viven en variables CSS, no repartidos por el código. Cambiar la paleta es cambiar un archivo. |
| **Internacionalización** | **next-intl** | Ruteo por idioma (`/es-AR`, `/en`, `/pt`, `/zh`, `/fr`) y diccionarios versionados, con un test que falla si a un idioma le falta una clave. |
| **Tests** | **Vitest** + Testing Library | 102 tests corriendo en cada Pull Request. |
| **Calidad** | **ESLint** + `eslint-plugin-boundaries` + **Zod** | Los límites entre módulos y la validación de datos externos se hacen cumplir **en el build**, no por acuerdo verbal. |
| **Hosting** | **Vercel** | Nativo con Next.js, deploy automático por rama, un preview por PR. Sin costo de infraestructura para el proyecto (Bases Art. 18). |

### Plataforma de datos y servicios (integrados o con adaptador escrito)

| Servicio | Para qué | Estado |
|---|---|---|
| **Supabase** (PostgreSQL) | Base de datos relacional, autenticación, storage, tiempo real y `pgvector` en un solo proveedor | Adaptador de auth y de presencia implementados y testeados |
| **Mercado Pago** | Cobro de entradas — estándar de facto en Argentina, y mantiene los datos de tarjeta fuera de nuestro servidor | Adaptador escrito y testeado; a la espera de la definición de la Cámara ([ADR-0003](adr/0003-modo-de-acceso.md)) |
| **Proveedor de IA** (vía OpenRouter) | Asistente conversacional con RAG sobre el contenido del sitio | Implementado, con degradación segura si no hay credencial |
| **Sanity** (o alternativa) | CMS para que la Cámara publique agenda, noticias y sponsors sin pedirle nada al equipo | Diseñado; primer entregable de la Fase 1 |
| **Resend** | Emails transaccionales: credenciales, recordatorios | Diseñado |
| **Cloudflare R2** | Almacenamiento de imágenes y recursos | Diseñado |
| **Cloudflare** (DNS/CDN) | WAF y mitigación de picos de tráfico en la apertura de inscripciones y durante el evento | Diseñado |
| **Sentry** + **Better Stack** | Errores y disponibilidad en tiempo real durante los 4 días críticos | Diseñado |

---

## 3. La decisión que más importa: nada queda atado

Ninguna de las elecciones de la tabla anterior es irreversible, **y eso es a propósito**.

### Puertos y adaptadores

Toda integración externa está detrás de una interfaz propia. El código del sitio importa `PaymentProvider`, nunca el SDK de Mercado Pago:

```
src/lib/ports/       ← la interfaz: qué necesita el sitio
src/lib/adapters/    ← la implementación: cómo lo resuelve este proveedor
```

Cambiar de proveedor de pagos, de autenticación, de CMS o de IA es **escribir un adaptador nuevo**, no reescribir pantallas ni lógica de negocio. El proveedor activo se elige por variable de entorno ([`.env.example`](../.env.example)).

Esto no es teoría arquitectónica: es una garantía concreta para un organismo público que no puede quedar rehén de un servicio que sube de precio, cambia de términos o cierra.

### Feature flags

Cada capacidad de negocio (`visitorAccess`, `exhibitorPortal`, `businessRounds`, `aiAssistant`, `interactiveMap`) se prende o apaga **sin deploy**, con kill-switch de emergencia por variable de entorno.

Si el asistente de IA empieza a costar de más un martes a la tarde, o si el registro de acceso tiene un problema en plena apertura de inscripciones, se apaga esa pieza sin tocar el resto del sitio.

### Módulos aislados

Cada capacidad vive en `src/modules/<nombre>` con un único `index.ts` como puerta de entrada. Una regla de lint **rompe el build** si un módulo importa un archivo interno de otro.

Es la razón por la que sumar las secciones de Noticias y Agenda no requirió tocar los módulos existentes — y la razón por la que la organización va a poder sumar secciones nuevas después sin romper lo anterior (Consignas §5: *"la organización podrá incorporar nuevas secciones durante el desarrollo"*).

---

## 4. Cómo responde cada criterio del Art. 10 de las Bases

| Criterio | Cómo lo resuelve este stack |
|---|---|
| **Escalabilidad** | Renderizado en servidor con caché en CDN: el contenido estático no toca la base de datos. Módulos independientes que crecen sin interferir. Postgres administrado que escala sin intervención nuestra. |
| **Seguridad** | Los datos de tarjeta nunca tocan nuestro servidor (checkout externo). Autenticación delegada a un proveedor especializado. Validación de todo dato externo con Zod. Rate limiting en los endpoints sensibles. Secretos por variable de entorno, nunca en el repositorio. Cumplimiento de la Ley 25.326. |
| **Accesibilidad** | Renderizado en servidor = HTML semántico real antes de que corra JavaScript. Navegación completa por teclado, roles ARIA, foco visible y `prefers-reduced-motion` respetado — **con tests automatizados que lo custodian**, no solo buena intención. |
| **Buenas prácticas** | TypeScript estricto, Conventional Commits validados, todo por Pull Request con CI obligatorio, decisiones registradas en ADRs. Ver [proceso de trabajo](proceso-de-trabajo.md). |
| **Rendimiento** | Componentes de servidor, code-splitting por ruta, imágenes optimizadas, animaciones en canvas sin librería pesada. Auditado con Lighthouse sobre builds reales. |
| **Mantenimiento** | CMS para que la Cámara edite contenido sin el equipo. Proveedores intercambiables. Documentación y ADRs al día. Stack popular = hay gente que lo sabe mantener. |

---

## 5. Decisiones todavía abiertas

Las declaramos en vez de simular que está todo cerrado:

- **CMS: Sanity o una alternativa auto-hospedada (Payload).** Es una discusión de soberanía de datos que le corresponde a un organismo público, no a nosotros solos. Ambas opciones encajan detrás de la misma interfaz.
- **Esquema de cobro de entradas 2026.** Depende de la definición de la Cámara ([ADR-0003](adr/0003-modo-de-acceso.md)). El sitio ya soporta ambos escenarios.

---

## 6. Para leer más

| Documento | Qué contiene |
|---|---|
| **[`architecture.md`](architecture.md)** | Diagrama del sistema, stack por capa, módulos, entornos, seguridad, roadmap |
| **[`adr/`](adr/)** | Las 6 decisiones con fecha, contexto, alternativas evaluadas y consecuencias |
| **[`proceso-de-trabajo.md`](proceso-de-trabajo.md)** | Las barreras de calidad que hacen cumplir todo esto |
| **[`.env.example`](../.env.example)** | Los puntos de configuración reales del sistema |

---

<div align="center">

[← Volver al README](../README.md) · [Guía del jurado](GUIA-DEL-JURADO.md) · [Arquitectura completa](architecture.md)

</div>
