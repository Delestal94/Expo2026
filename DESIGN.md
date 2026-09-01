# Design System & UI/UX Specification — ExpoJuy 2026

## 1. Product Overview & Vision
- **Product**: Official digital platform and PWA for **ExpoJuy 2026** (17ª Edición).
- **Venue & Dates**: October 9–12, 2026, Ciudad Cultural, San Salvador de Jujuy, Argentina.
- **Key Focus**: International lithium mining trade summit, Bioceanic Corridor logistics integration (Argentina, Chile, Paraguay, Brazil), knowledge economy, and high-intensity B2B business rounds.
- **Live Reference**: [https://expojuy2026.vercel.app](https://expojuy2026.vercel.app)
- **Repository**: [https://github.com/Delestal94/Expo2026.git](https://github.com/Delestal94/Expo2026.git)

---

## 2. Visual Identity & Metaphor: "Estratos"
The visual language is rooted in the geological strata of the Quebrada de Humahuaca (Cerro de los Siete Colores) and the underground lithium brine deposits of Jujuy:
- **Concept**: Fluid, organic geological ribbons flowing with ambient light across deep high-altitude night sky.
- **Aesthetic**: Dark Luxury Tech / Awwwards-grade glassmorphism with high-contrast glowing neon accents.

---

## 3. Design Tokens & Color Palette

| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| `bg-obsidian` | `#08090C` | Root page background, deep night sky |
| `bg-slate-card` | `#0E1017` | Card and bento panel background |
| `accent-lithium` | `#00F5D4` | Primary brand accent, glowing CTAs, live status dots |
| `accent-terracotta` | `#D96B43` | Mining focus, warm geological strata, badges |
| `accent-ochre` | `#E5A93C` | International trade, timeline milestones, warning chips |
| `accent-violet` | `#7B2CBF` | Bioceanic Corridor, AI assistant badges |
| `text-paper` | `#FFFFFF` | Primary headlines and high-contrast titles |
| `text-paper-dim` | `#94A3B8` | Subtitles, body copy, descriptions |
| `border-glass` | `rgba(255, 255, 255, 0.08)` | 1px border highlights on frosted cards |

---

## 4. Typography Rules
- **Display & Headlines**: `Unbounded` / `Sora` (Bold 800/900, geometric, wide tracking for high impact).
- **Body & Explanations**: `Manrope` (Regular 400, Semi-Bold 600, clean, ergonomic).
- **Data, Badges & Timers**: `JetBrains Mono` (Monospace 500/700, dates, coordinates, slot times, counters).

---

## 5. UI Architecture & Core Components

### A. Floating Navigation Header
- Frosted glass floating pill with `backdrop-blur-xl` and 1px border highlight.
- Brand logo "EXPOJUY 2026" with pulsating Lithium Cyan dot (`● 17ª EDICIÓN`).
- Navigation links: "Ejes", "Rondas B2B", "Expositores", "Mapa", "Galería", "Roadmap".
- Language Selector: Monospace pills `[ES | EN | PT | ZH]`.
- Action CTA: Glowing button "Acreditarse / QR".

### B. Asymmetric Hero Section
- Dynamic Canvas/SVG geological strata ribbons flowing organically in the background.
- Massive typography: "EL FUTURO SE ESTRATIFICA EN JUJUY".
- Subtitle: "4 días de máxima intensidad: Minería del litio, rondas de negocios internacionales y economía del conocimiento."
- Live Countdown Widget: Monospace glass card displaying `[DD : HH : MM : SS]` to October 9, 2026.
- Dual CTAs: Primary glowing button "Quiero Asistir (Pase QR)" + secondary glass button "Sumar mi empresa".

### C. Bento Grid Module System
1. **Ejes Estratégicos**:
   - Card 1: *Minería del Litio & RIGI* (45.000 Tn Capacidad Cauchari-Olaroz).
   - Card 2: *Corredor Bioceánico de Capricornio* (Conexión logística de 4 países).
   - Card 3: *Economía del Conocimiento* (Servicios basados en conocimiento, biotecnología).
2. **Portal de Expositores & Rondas B2B**:
   - Matchmaking simulator with buyer/supplier pairing slots (Chile, Paraguay, Brazil, Argentina) and 20-min bilateral meeting scheduler.
   - Filterable catalog (Minería, Logística, Servicios, Agro, Energía).
3. **Mapa Interactivo de Ciudad Cultural**:
   - Vector blueprint showing pavilions (Minero, Internacional, Bioceánico, Auditorio Central) with live session badges.
4. **Galería Histórica**:
   - Interactive photo reel showcasing previous successful editions.
5. **Interactive Project Roadmap**:
   - 4-phase timeline: Phase 0 (Mockup & Spec, Sept 8) → Phase 1 (Production Platform, Sept 30) → Phase 2 (Pre-event Testing, Oct 8) → Phase 3 (Live Event, Oct 9-12).

---

## 6. Responsiveness & Rendering Constraints
- **Mobile First**: Single-column vertical stack below 768px, fluid `clamp()` typography, 48px touch-friendly targets, collapsible navigation.
- **NO Raster Images for Backgrounds**: 100% of visual depth must use pure CSS gradients, SVG stroke meshes, and glassmorphism borders (no blurry/pixelated bitmap photos).
- **Motion & Dynamics**: CSS ambient shimmer, smooth card hover transitions with neon rim glow, and live countdown timers.
