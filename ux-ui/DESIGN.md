# Design System & UI/UX Specification — ExpoJuy 2026

## 1. Product Overview & Vision
- **Product**: Official digital platform and PWA for **ExpoJuy 2026** (17ª Edición).
- **Venue & Dates**: October 9–12, 2026, Ciudad Cultural, San Salvador de Jujuy, Argentina.
- **Key Focus**: International lithium mining trade summit, Bioceanic Capricorn Corridor logistics integration (Argentina, Chile, Paraguay, Brazil), knowledge economy, and high-intensity B2B business rounds.
- **Production Reference**: [https://expojuy2026.vercel.app](https://expojuy2026.vercel.app)
- **Develop Preview**: [https://expojuy2026-git-develop-delestalmiguelignacio-5787s-projects.vercel.app/](https://expojuy2026-git-develop-delestalmiguelignacio-5787s-projects.vercel.app/)
- **Repository**: [https://github.com/Delestal94/Expo2026.git](https://github.com/Delestal94/Expo2026.git)

---

## 2. Visual Identity & Metaphor: "Estratos"
The visual language is rooted in the geological strata of the Quebrada de Humahuaca (Cerro de los Siete Colores) and the underground lithium brine deposits of Jujuy:
- **Concept**: Fluid, organic geological mineral wave ribbons flowing with ambient light across deep high-altitude night sky.
- **Aesthetic**: Dark Luxury Tech / Mineral Glassmorphism with high-contrast glowing Lithium Cyan accents.

---

## 3. Official Design Tokens & Color Palette

| Token | CSS Variable | Hex / RGBA Value | Usage |
| :--- | :--- | :--- | :--- |
| `bg-ink` / `obsidian-base` | `--color-ink` | `#0b0a12` | Root page background, deep night sky |
| `text-paper` | `--color-paper` | `#f5f1e8` | Primary headlines and high-contrast titles |
| `text-paper-dim` | `--color-paper-dim` | `#b3ab9c` | Subtitles, body copy, descriptions |
| `accent` / `lithium-cyan` | `--color-accent` | `#3bcdbf` | Primary brand accent, glowing CTAs, active pills, live indicators |
| `accent-ocher` | `--color-ocher` | `#d98b3f` | Minería del Litio & RIGI, Eje 01 |
| `accent-terracotta` | `--color-terracotta` | `#b4432e` | Comercio Exterior, Eje 02 |
| `accent-violet` | `--color-violet` | `#7c5a9e` | Corredor Bioceánico de Capricornio, Eje 03 |
| `accent-teal` | `--color-teal` | `#2e8f86` | Economía del Conocimiento, Eje 04 |
| `border-line` | `--color-line` | `rgba(245, 241, 232, 0.14)` | 1px border highlights on frosted cards |

---

## 4. Typography Rules

- **Display & Headlines**: `Unbounded` (`font-display`, `font-black` on Hero, `font-medium` / `font-bold` on bento cards, wide tracking).
- **Body & Explanations**: `Manrope` (`font-body`, regular 400, medium 500, clean and ergonomic).
- **Data, Badges & Timers**: `JetBrains Mono` (`font-mono`, uppercase, tracking `0.05em` to `0.25em`, for dates, codes, slot times, counters).

---

## 5. Global Shared Layout Components (Mandatory Across All Views)

### A. Shared Top Navigation Header
- **Container**: Floating pill navbar `max-w-7xl mx-auto mt-6 px-6 py-2 bg-[#0b0a12]/80 backdrop-blur-xl border border-[rgba(245,241,232,0.14)] rounded-full fixed top-0 left-0 right-0 z-50`.
- **Brand Title (Left)**: `EXPOJUY 2026` in `Unbounded` bold `#f5f1e8`.
- **Navigation Links (Center)**: `Ejes` · `Rondas B2B` · `Acreditación` · `Asistente` · `Galería` · `Mapa` · `Roadmap` (`Manrope`/`JetBrains Mono`, hover `#3bcdbf`). The active view link has an underline/badge in `#3bcdbf`.
- **Primary CTA (Right)**: Pill button `Quiero asistir` (`bg-[#3bcdbf] text-[#0b0a12] font-bold rounded-full px-6 py-2.5`).

### B. Shared Footer
- **Container**: Full-width footer with top border `border-t border-[rgba(245,241,232,0.14)] bg-[#0b0a12] py-12 px-6 sm:px-10 lg:px-16`.
- **Left**: `ExpoJuy 2026` (`Unbounded`, `#f5f1e8`).
- **Center**: Institutional partners: `Cámara de Comercio Exterior de Jujuy · Ministerio de Desarrollo Económico y Producción · Dirección Provincial de Servicios Basados en el Conocimiento · Clustear.` (`Manrope` text-sm `#b3ab9c`).
- **Right**: `Prototipo — Desafío Digital 2026` (`JetBrains Mono` text-xs `#b3ab9c` uppercase).

---

## 6. Target Views & Screen Specifications

### 1. Interactive Roadmap & Milestones Timeline (`/roadmap`)
- **Hero Countdown Widget**: Live countdown ticker to Oct 9, 2026 in `JetBrains Mono` cards `[DD : HH : MM : SS]`.
- **4-Phase Milestone Bento Grid**:
  - **Phase 00 (Sept 08)**: *Estructura & Mockup Navegable* (Estado: Completado · Badge gris).
  - **Phase 01 (Sept 14)**: *Demo Day & Feedback de Jurado* (Estado: En Progreso · Glow `#3bcdbf` y pulse animation).
  - **Phase 02 (Sept 30)**: *Plataforma de Producción & QA* (Estado: Pendiente).
  - **Phase 03 (Oct 09–12)**: *EXPOJUY 2026: El Evento en Ciudad Cultural* (Estado: Destino · Botón "Ver Detalles").

### 2. Acreditación & Pase Digital QR (`/acceso`)
- **Left Column (8 cols)**: Clean accreditation form for visitors, exhibitors, and press with instant client validation (Nombre, DNI/Pasaporte, Nacionalidad, Empresa, Cargo).
- **Right Column (4 cols)**: Holographic Digital QR Access Pass with high-contrast square QR code, attendee details (Juan Pérez, Lithium Corp S.A.), and status badge `ACCESO HABILITADO 9-12 OCT`.
- **Bottom Section**: Interactive Turnstile PWA Scanner simulator with animated cyan laser beam viewfinder and instant feedback banner `Ticket Válido - Ingreso Registrado`.

### 3. Portal Rondas de Negocios B2B (`/rondas-b2b`)
- **Corridor Country & Sector Filters**: Filter pills for Argentina (Ocre `#d98b3f`), Chile (Terracota `#b4432e`), Paraguay (Violeta `#7c5a9e`), Brasil (Cyan `#3bcdbf`).
- **Smart Matchmaking Column (7 cols)**: High-priority cards with match score % (e.g. 98% LithiumCorp International, 85% Andean Logistics), primary business interests, estimated volume, and 20-min bilateral slot action button.
- **Interactive Slots Calendar Column (5 cols)**: Real-time time slot grid (09:00 to 13:00 hs) with available slots (green/cyan glow) and occupied slots (locked).

### 4. Multilingual RAG AI Concierge (`/asistente`)
- **Header & Language Switcher**: Fast language pills `[Español | English | Português | 中文]`.
- **Interactive Chat Interface**:
  - Rich conversational responses with structured UI cards (Stand location, map deep-link, technical presentation agenda).
  - Quick query chips (*"Horarios de rondas B2B"*, *"Ubicación del Auditorio Principal"*, *"Cómo llegar a Ciudad Cultural"*).
  - Human handoff escalation button (*"Derivar a atención humana de la Cámara"*).

### 5. Galería Histórica & Memoria Visual (`/galeria`)
- **Category Filter Chips**: `Actos Oficiales`, `Stands y Tecnología`, `Rondas de Negocios`, `Público`.
- **Asymmetrical Bento Photo Grid**: Real historical photography showcasing institutional inaugurations, industrial machinery, business meetings, and nighttime venue lighting.
- **Full-Screen Lightbox Modal**: High-resolution image preview with caption, metadata, and dark blur overlay.

### 6. Plano Interactivo Ciudad Cultural (`/mapa`)
- **Split Layout (65% / 35%)**:
  - **Vector Map Viewport (65%)**: Blueprint schematic showing zoned pavilions (Minería y Litio `#3bcdbf`, Corredor Bioceánico `#7c5a9e`, Comercio Exterior `#d98b3f`, Auditorios `#b4432e`) with zoom/layer controls.
  - **Inspector & Telemetry Panel (35%)**: Real-time stand search, active stand details (Minera Exar Stand 104), and live auditorium telemetry (Sala A 85% capacity live panel, Sala B upcoming schedule).

---

## 7. Responsiveness & Rendering Constraints
- **Mobile First**: Fluid layouts (`clamp()`), 48px touch targets, responsive bento grid collapsing to single-column on small screens.
- **Vector Backgrounds**: 100% pure CSS gradients, backdrop filters, and subtle SVG strata lines. No raster background noise.
