# Design: Roadmap & Presentation Views

## Visual & Component Architecture

### 1. Design System Tokens (Consistent "Estratos" Theme)
- **Background**: Deep Obsidian `#08090C` / Dark Slate `#0F1117`.
- **Mineral Strata Accents**:
  - Lithium Cyan: `#00F5D4` (Primary actions, status badges, active states)
  - Andean Terracotta: `#D96B43` (Highlights, mining focus, secondary borders)
  - Golden Ochre: `#E5A93C` (Timelines, warning states, statistics)
  - Plateau Violet: `#7B2CBF` (Corridor badges, AI indicators)
- **Surfaces**: Frosted glass panels (`backdrop-blur-xl`, `border border-white/10`, `shadow-2xl`).
- **Typography**:
  - Display / Headlines: `Unbounded` / `Sora` (Bold, structural)
  - Body & Content: `Manrope` (Clean, warm, highly legible)
  - Data, Dates & Badges: `JetBrains Mono` (High-precision monospace)

---

## Route & Module Mapping

```
src/
├── app/
│   ├── layout.tsx             # Root layout with unified fonts & metadata
│   ├── page.tsx               # Home landing (Hero, Ejes, Venue, Directory, Footer)
│   ├── roadmap/page.tsx       # Timeline, Milestones, and Technical Feasibility
│   ├── acceso/page.tsx        # Visitor Ticketing, QR Pass Preview & Turnstile Scanner
│   ├── rondas-b2b/page.tsx    # Bioceanic Matchmaking & Meeting Slot Scheduler
│   ├── asistente/page.tsx     # Multilingual RAG AI Concierge
│   └── mapa/page.tsx          # Fullscreen Ciudad Cultural Venue Navigation
```

---

## Stitch / Figma Prompting Guide for Presentation Views

To generate auxiliary views or slides in Stitch/v0/Figma using our deployed test environment (`https://expojuy2026.vercel.app`):

### Prompt Template for Screen Generation:
```text
Context: ExpoJuy 2026 Official Digital Platform (Jujuy, Argentina - Oct 9-12, 2026).
Aesthetic: Dark Luxury Obsidian (#08090C), Lithium Cyan (#00F5D4) glowing borders, frosted glassmorphism, Unbounded titles, JetBrains Mono data pills.
Screen Target: [Insert Screen Name: e.g. B2B Business Rounds Matchmaking / Digital QR Pass / Interactive Roadmap]
Rules: Mobile-first responsiveness, pure CSS vectors, NO blurry raster photos, rich interactive mock components.
```
