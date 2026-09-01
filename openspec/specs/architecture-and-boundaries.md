# Specification: Architecture, Ports & Boundaries

## Purpose & Scope
Defines the architectural contracts, module isolation boundaries, and port abstractions for all external integrations in ExpoJuy 2026.

## Module Boundaries Contract
1. **Module Autonomy**: Each domain module in `src/modules/<name>/` manages its own internal UI components, server actions, domain entities, and data access logic.
2. **Public Interface**: A module may only be imported through its root `index.ts`. Deep imports into another module's internal files (e.g. `import { foo } from '@/modules/bar/ui/component'`) are prohibited and will trigger ESLint boundary errors in CI.
3. **Cross-Module Communication**: When Module A requires data or capabilities from Module B, it must invoke exported public functions or actions exposed through Module B's `index.ts`.

## Ports & Adapters Contract
1. **Port Interfaces (`src/lib/ports/`)**:
   - `PaymentProvider`: Methods for initializing checkout sessions, verifying payment callbacks, and handling refunds/webhooks.
   - `AIAssistant`: Methods for processing chat prompts, retrieving RAG context, and handling fallback escalation.
   - `MailProvider`: Methods for sending transactional emails (QR passes, agenda updates, matchmaking notifications).
   - `ContentSource`: Methods for querying CMS content and feature flag states.
2. **Adapter Decoupling (`src/lib/adapters/`)**:
   - Business modules MUST NOT import external vendor SDKs (e.g. `mercadopago`, `@anthropic-ai/sdk`, `resend`, `@sanity/client`) directly.
   - All external SDK interactions reside inside adapter implementations fulfilling their corresponding port interface.
3. **Environment & Provider Selection**:
   - Active adapters are resolved based on runtime configuration (`src/lib/config/env.ts`), validated with Zod at application bootstrap.

## Feature Flags Contract
- Flags are evaluated server-side.
- Flags default to fail-safe values when CMS connectivity fails.
- Environment variables provide immediate kill-switch overrides without redeployment.
