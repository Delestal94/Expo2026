<div align="center">

# ExpoJuy 2026 — Sitio oficial

**Propuesta para el Desafío Digital ExpoJuy 2026**

Ministerio de Desarrollo Económico y Producción de Jujuy · Dirección Provincial de Servicios Basados en el Conocimiento · Cámara de Comercio Exterior de Jujuy · ClusteAR

[![CI](https://github.com/Delestal94/Expo2026/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/Delestal94/Expo2026/actions/workflows/ci.yml)
![Tests](https://img.shields.io/badge/tests-102%20passing-3bcdbf)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6)
![Idiomas](https://img.shields.io/badge/idiomas-5-7c5a9e)
![Etapa](https://img.shields.io/badge/etapa%201-entregada-2e8f86)

### ▶ **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)** — prototipo funcional navegable

</div>

---

## 🎓 Si sos jurado, empezá acá

Tres puertas de entrada, según cuánto tiempo tengas. **No hace falta clonar ni instalar nada.**

| ⏱️ | Qué mirar | Link |
|---|---|---|
| **5 min** | El sitio funcionando, en vivo | **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)** |
| **15 min** | La memoria descriptiva (entregable formal, PDF) | **[`docs/memoria-descriptiva.pdf`](docs/memoria-descriptiva.pdf)** |
| **45 min** | Recorrido guiado por todo: qué mirar, en qué orden y por qué | **[📖 Guía del jurado](docs/GUIA-DEL-JURADO.md)** |

> **[📋 Matriz de cumplimiento](docs/matriz-consignas-desafio.md)** — cada consigna de las Bases y de las Consignas Técnicas, contrastada una por una contra el código real, con lo que **no** está al 100% declarado abiertamente.

---

## 📦 Entregables de la Etapa 1 (Bases · Anexo III)

Los siete ítems que exige el Anexo III, cada uno con su ubicación exacta:

| # | Entregable exigido | Dónde está | Estado |
|---|---|---|:---:|
| 1 | Formulario de inscripción | Enviado a la organización por el formulario oficial | ✅ |
| 2 | Integrantes del equipo | [Equipo](#-equipo) · [`docs/entregables-etapa-1.md`](docs/entregables-etapa-1.md) | ✅ |
| 3 | **Link al mockup / prototipo navegable** | **[Sitio en vivo](https://expojuy2026.vercel.app)** · [suite de mockups estáticos](https://expojuy2026.vercel.app/mockups/) | ✅ |
| 4 | **Memoria descriptiva** | **[`docs/memoria-descriptiva.pdf`](docs/memoria-descriptiva.pdf)** ([versión Markdown](docs/memoria-descriptiva.md)) | ✅ |
| 5 | Tecnologías propuestas | [`docs/tecnologias-propuestas.md`](docs/tecnologias-propuestas.md) · [arquitectura completa](docs/architecture.md) | ✅ |
| 6 | Declaración de uso de Inteligencia Artificial | [`docs/declaracion-uso-ia.md`](docs/declaracion-uso-ia.md) | ✅ |
| 7 | Explicación conceptual de la propuesta | [Concepto "Estratos"](docs/memoria-descriptiva.md#3-la-propuesta-concepto-estratos) · [`ux-ui/DESIGN.md`](ux-ui/DESIGN.md) | ✅ |

Índice completo con contexto de cada uno: **[`docs/entregables-etapa-1.md`](docs/entregables-etapa-1.md)**

---

## 💡 La propuesta en 60 segundos

ExpoJuy cambió de naturaleza: de dos semanas de exposición pasa a **cuatro días de altísima intensidad** (9–12 de octubre, Ciudad Cultural), con rondas de negocios internacionales por la mañana y expo por la tarde, foco declarado en minería del litio y comercio exterior, y ambición explícita de integrar el Corredor Bioceánico de Capricornio.

**Un sitio que solo informe fechas y sponsors no le sirve a esa versión del evento.** Por eso presentamos infraestructura digital de evento, no una landing institucional. Tres decisiones atraviesan todo el proyecto:

<table>
<tr>
<td width="33%" valign="top">

### 🎨 Identidad propia
**"Estratos"** — un lenguaje visual de bandas de color en capas, tomado de la Quebrada de Humahuaca y del litio bajo tierra, con los colores exactos de la marca oficial de ExpoJuy. No una plantilla.

</td>
<td width="33%" valign="top">

### 🔌 Configurable de punta a punta
Cada módulo se prende o apaga **sin deploy**. Ningún proveedor externo (pagos, IA, CMS) escrito a mano en la lógica de negocio: se cambia escribiendo un adaptador, no reescribiendo el sitio.

</td>
<td width="33%" valign="top">

### ⚙️ Prototipo real, no maqueta
Código funcionando, con CI que corre lint, tipos, **102 tests** y build en cada cambio. El repositorio es, en sí mismo, la evidencia de factibilidad técnica.

</td>
</tr>
</table>

---

## ✅ Qué se construyó

### Las 10 secciones mínimas (Consignas §5) — todas presentes

`Inicio` · `Sobre ExpoJuy 2026` · `Expositores` · `Agenda` · `Noticias` · `Mapa del predio` · `Sponsors` · `Contacto` · `Preguntas frecuentes` · `Redes sociales`

### Funcionalidades sugeridas (Consignas §6) y valor agregado

| Módulo | Qué hace | Estado |
|---|---|---|
| 🏔️ **Landing** | Identidad "Estratos", cuenta regresiva real, 4 ejes productivos, noticias, contacto, FAQ | ✅ Construido |
| 🎫 **Registro de acceso** | Alta de cuenta, login y **credencial QR firmada**; gratuito o pago según un interruptor de configuración | ✅ Construido *(cobro pendiente por decisión, [ADR-0003](docs/adr/0003-modo-de-acceso.md))* |
| 🤝 **Expositores + rondas B2B** | Directorio con buscador y filtro por eje, **matching por rubro/país**, agenda de slots bilaterales | ✅ Construido |
| 🗺️ **Mapa interactivo** | Plano **calcado del CAD real** de Ciudad Cultural: +200 zonas filtrables y consultables stand por stand | ✅ Construido |
| 📅 **Agenda de actividades** | Estructura diaria confirmada (rondas AM / expo PM) para los 4 días, con selector interactivo | ✅ Construido |
| 🤖 **Asistente con IA** | Responde con el contenido real del sitio (RAG), en los 5 idiomas; degrada a respuestas guiadas sin credencial | ✅ Construido |
| 📸 **Galería 2024** | Memoria visual de la edición anterior con lightbox accesible por teclado | ✅ Construido |
| 🌐 **Multiidioma** | **Español · Inglés · Portugués · Mandarín · Francés** — priorizados por la audiencia real del evento | ✅ Construido |

Lo que **no** está al 100%, y por qué, está declarado sin maquillaje en la [matriz de cumplimiento §6](docs/matriz-consignas-desafio.md).

---

## 🛠️ Cómo trabajamos

Somos dos personas. El repositorio muestra el método completo, no solo el resultado.

<div align="center">

| | | | | |
|:---:|:---:|:---:|:---:|:---:|
| **153** | **102** | **6** | **5** | **0** |
| Pull Requests<br>mergeados | tests<br>automatizados | decisiones de<br>arquitectura (ADR) | idiomas<br>completos | commits directos<br>a `main`/`develop` |

</div>

- **Nadie commitea directo.** Todo pasa por rama de trabajo → Pull Request → CI en verde → review → squash merge. Sin excepción, ni para un typo.
- **CI que bloquea.** Cada PR corre lint (incluida la regla que hace cumplir los límites entre módulos), type-check, tests y build de producción. Rojo = no entra.
- **Decisiones registradas.** Seis [ADRs](docs/adr/) con fecha y fundamento — incluidas las que **revertimos** cuando encontramos evidencia en contra ([ADR-0005](docs/adr/0005-acceso-libre-sin-registro.md) es el ejemplo honesto).
- **Auditorías críticas.** Rondas dedicadas de diseño, UX por recorridos, accesibilidad, performance y visibilidad en buscadores, cada una cerrada con su PR de correcciones.
- **Bitácora viva.** Cada hito quedó registrado el mismo día en la [memoria ejecutiva](docs/memoria-ejecutiva.md).

📖 **El método completo, paso a paso: [`docs/proceso-de-trabajo.md`](docs/proceso-de-trabajo.md)**

---

## 🗂️ Mapa del repositorio

```
├── docs/                        📚 Toda la documentación
│   ├── GUIA-DEL-JURADO.md          ← recorrido guiado (empezá acá)
│   ├── entregables-etapa-1.md      ← los 7 ítems del Anexo III
│   ├── memoria-descriptiva.pdf     ← entregable formal del concurso
│   ├── matriz-consignas-desafio.md ← cumplimiento consigna por consigna
│   ├── proceso-de-trabajo.md       ← cómo trabajamos
│   ├── tecnologias-propuestas.md   ← stack y por qué cada pieza
│   ├── declaracion-uso-ia.md       ← uso responsable de IA
│   ├── architecture.md             ← arquitectura técnica completa
│   ├── memoria-ejecutiva.md        ← bitácora de avance día por día
│   ├── adr/                        ← decisiones de arquitectura fechadas
│   └── concurso/                   ← Bases, Consignas y fuentes de investigación
│
├── src/
│   ├── app/[locale]/            🌐 Rutas (App Router, una por idioma)
│   ├── modules/                 🧩 Un módulo por capacidad de negocio
│   │   ├── landing/  exhibitors/  business-rounds/  interactive-map/
│   │   └── visitor-access/  chatbot/  gallery/  news/
│   └── lib/
│       ├── ports/               🔌 Interfaces (pagos, auth, presencia)
│       ├── adapters/            🔧 Implementaciones intercambiables
│       ├── config/              🎛️ Feature flags + env tipado
│       └── i18n/messages/       🗣️ es-AR · en · pt · zh · fr
│
├── ux-ui/                       🎨 Sistema de diseño y kit oficial
│   ├── DESIGN.md                   ← especificación de diseño
│   ├── mockups/                    ← maquetas estáticas navegables
│   ├── EXPOJUY_Logo2026/           ← logotipos oficiales (kit de la organización)
│   └── Fuentes_Oficiales/          ← tipografía Ambit
│
└── public/mockups/              ▶ mockups servidos en vivo, sin clonar nada
```

---

## 💻 Correr el proyecto

```bash
npm install
cp .env.example .env.local   # completar valores si se quiere probar auth/IA
npm run dev                  # http://localhost:3000
```

El sitio arranca y es totalmente navegable **sin configurar ninguna credencial**: los módulos que dependen de servicios externos degradan a un modo de demostración en vez de fallar.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run lint` | ESLint, incluida la regla de límites entre módulos |
| `npm run type-check` | TypeScript sin emitir archivos |
| `npm test` | 102 tests con Vitest |
| `npm run memoria:pdf` | Regenera la memoria descriptiva en PDF |

## 🌐 Entornos

| Entorno | Rama | URL | Acceso |
|---|---|---|---|
| **Producción** | `main` | **[expojuy2026.vercel.app](https://expojuy2026.vercel.app)** | 🌐 **Público** — es el link para evaluar la propuesta |
| Staging | `develop` | preview interno de `develop` | 🔒 Restringido al equipo (requiere login de Vercel) |
| Preview por PR | `feature/*`, `fix/*`… | uno automático por cada Pull Request | 🔒 Restringido al equipo |

> Los entornos de staging y preview están protegidos con autenticación de Vercel a propósito: son ambientes de trabajo interno, no versiones para mostrar. **Todo lo que hay que ver para evaluar la propuesta está en el entorno de producción**, que es público y no pide ninguna credencial.

## 👥 Equipo

| Integrante | GitHub | Rol |
|---|---|---|
| Miguel Ignacio Delestal | [@Delestal94](https://github.com/Delestal94) | Representante del equipo · Arquitectura y desarrollo |
| Maximiliano Lezano | [@MaxLezano](https://github.com/MaxLezano) | Desarrollo · Diseño UX/UI |

## 📄 Licencia y propiedad intelectual

Repositorio público sin licencia declarada — el copyright queda reservado para el equipo por defecto ([ADR-0004](docs/adr/0004-visibilidad-repositorio.md)). De resultar ganadora, la propuesta cede a la Cámara de Comercio Exterior de Jujuy los derechos de uso, adaptación, mantenimiento y publicación, conforme al Art. 22 de las Bases.

Recursos gráficos: logotipos y tipografías del **Kit de Diseño oficial** provisto por la organización. Fotografías de la edición 2024 del mismo organizador. Código propio, sin dependencias de licencia restrictiva.

---

<div align="center">

**Desafío Digital ExpoJuy 2026** · Primera Edición del Programa Provincial de Desafíos Tecnológicos

*De Jujuy al mundo.*

</div>
