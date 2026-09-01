# Project Context — ExpoJuy 2026

## Overview

Official web platform and PWA for **ExpoJuy 2026** (October 9–12, 2026, San Salvador de Jujuy, Argentina), developed for the **Desafío Digital ExpoJuy 2026** (Cámara de Comercio Exterior de Jujuy · Dirección Provincial de Servicios Basados en el Conocimiento · Clustear).

The platform is not a static brochure: it handles visitor access management/ticketing, international B2B business rounds (focal point: Bioceanic Corridor), exhibitor catalog, live agenda, interactive fairgrounds map, and a domain-scoped AI assistant.

---

## Architectural Principles

1. **Modular Monolith**: Business capabilities live isolated in `src/modules/<module-name>/`. Each module exposes a single public entry point via `index.ts`. Cross-module internal imports are strictly forbidden and enforced by ESLint (`eslint-plugin-boundaries`).
2. **Ports & Adapters (Hexagonal Architecture)**: Core business logic imports domain port interfaces (`src/lib/ports/*`), never external vendor SDKs directly. Concrete adapters live in `src/lib/adapters/*` and are resolved dynamically or via environment configuration.
3. **No-Deploy Configurability (Feature Flags)**: Every major module is gated server-side by feature flags (`visitorAccess`, `exhibitorPortal`, `businessRounds`, `aiAssistant`, `interactiveMap`) editable in Sanity CMS with environment variable kill-switches.
4. **Configurable Admission Mode**: Admission mode supports `ADMISSION_MODE: "free" | "paid"` (ADR-0003). Free mode issues QR passes immediately upon registration; paid mode runs Mercado Pago checkout before issuing passes.
5. **Multilingual by Design**: Supports 5 languages (Spanish base, English, Portuguese, Mandarin Chinese, +1 candidate). UI strings localized via `next-intl`; editorial content localized in Sanity CMS.

---

## Technology Stack

- **Frontend & App Framework**: Next.js 16 (App Router, React Server Components), React 19, Tailwind CSS, shadcn/ui.
- **Runtime & Language**: Node.js / TypeScript (strict mode, end-to-end typed).
- **Database & Persistence**: PostgreSQL + Drizzle ORM, hosted on Supabase (Postgres, Auth, Storage, Realtime, pgvector).
- **Caching & Rate Limiting**: Upstash Redis.
- **Payments**: Mercado Pago (Checkout Pro via `PaymentProvider` port).
- **AI & RAG Assistant**: Claude API (Anthropic) + Vercel AI SDK + pgvector semantic retrieval.
- **Headless CMS & Flags**: Sanity CMS.
- **Email Delivery**: Resend (ticket QR codes, reminders, matchmaking alerts).
- **Testing & Quality**: Vitest, `@testing-library/react`, ESLint boundaries, Zod schema validation, Commitlint (Conventional Commits).
- **Hosting & Infrastructure**: Vercel (Edge/Serverless), Cloudflare (DNS, WAF, CDN, DDoS protection).

---

## Directory & Module Structure

```
src/
├── app/                  # Next.js App Router (pages, layouts, route handlers / BFF)
├── lib/
│   ├── config/           # Environment variables (Zod validated) and feature flags
│   ├── ports/            # Port interfaces for external services (Payment, AI, Mail, etc.)
│   └── adapters/         # Concrete implementations of ports
└── modules/
    ├── landing/          # Core landing, agenda, sponsors, editorial content
    ├── visitor-access/   # Registration, ticketing, QR passes, entry scanner PWA
    ├── exhibitors/       # Exhibitor catalog, profiles, B2B business rounds matching
    ├── ai-assistant/     # Domain-scoped RAG assistant with human escalation
    └── interactive-map/  # Interactive fair map and live session status
```

---

## Architectural Decision Records (ADRs)

- **ADR-0001**: Next.js 16 + TypeScript + Supabase + Vercel base stack.
- **ADR-0002**: Editorial feature flags via Sanity CMS + Ports & Adapters architecture.
- **ADR-0003**: Configurable Admission Mode (`ADMISSION_MODE=free | paid`, default `free`).
- **ADR-0004**: Public repository with all rights reserved (no open-source license declared).
- **ADR-0005**: Exhibitors/providers application routed through established external channels (Google Forms & WhatsApp), with portal acting as directory & value proposition.


---

## Development & Contribution Standards

- **Git Workflow**: `feature/*` or `fix/*` branch -> Pull Request -> `develop` -> `main`.
- **Commit Format**: Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`). No AI attribution in commit messages.
- **CI Gates**: `npm run lint`, `npm run type-check`, `npm test`, `npm run build` must pass before merging.
