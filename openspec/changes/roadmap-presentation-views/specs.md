# Specifications: Roadmap & Future Presentation Views

## 1. Interactive Roadmap View (`/roadmap`)
- **Visual Milestones**: Must visually depict the 4 core phases:
  - *Phase 0 (Sept 1–8)*: Conceptual design, visual identity "Estratos", architecture & ADRs, navigable mockup.
  - *Phase 1 (Sept 9–30)*: Production backend (Supabase PostgreSQL + Auth, Sanity CMS, Resend mailer, Mercado Pago checkout adapter).
  - *Phase 2 (Oct 1–8)*: Pre-event load testing, Cloudflare CDN/WAF caching, turnstile PWA offline test.
  - *Phase 3 (Oct 9–12)*: Live event execution (real-time agenda, B2B round tracking, AI concierge, entrance telemetry).
- **Interactive Metrics**: Displays real-time countdowns, deliverable checklists, and status badges (Completed, In Progress, Planned).

## 2. Visitor Access & QR Pass View (`/acceso`)
- **Admission Mode Handling**: Follows ADR-0003 (`free` vs `paid`).
- **Interactive Pass Preview**: Shows a digital badge with encrypted QR code, visitor metadata (Name, Company, Role, Country), and offline pass download option.
- **Scanner Simulator**: Interactive tab simulating the entrance turnstile camera scanner with instant green/red validation feedback.

## 3. B2B Business Rounds Matchmaking View (`/rondas-b2b`)
- **Bioceanic Corridor Filter**: Filter matchmaking opportunities by Country (Argentina, Chile, Paraguay, Brazil) and Sector (Minería/Litio, Logística, Servicios Basados en Conocimiento, Agro).
- **Meeting Scheduler**: Interactive calendar showing 20-minute meeting slots across Oct 9–12 morning sessions (09:00 - 13:00).
- **Synergy Score**: Visual compatibility badge (e.g. 94% Match based on supply-chain needs).

## 4. Multilingual AI Assistant View (`/asistente`)
- **Chat Interface**: Dark glassmorphic conversational widget with preset question chips (e.g., "¿Dónde queda el stand de Exar?", "What time are the lithium panels?", "Como agendar rodada de negócios?").
- **Domain Guardrails**: Demonstrates strictly grounded answers based on event agenda and polite human handoff for out-of-scope inquiries.
- **Language Switcher**: Native support for ES, EN, PT, and ZH.

## 5. Detailed Fairgrounds Map View (`/mapa`)
- **Vector Blueprint**: High-resolution interactive SVG of Ciudad Cultural.
- **Live Stage Status**: Badges showing current live conferences and upcoming panels with room capacity telemetry.
