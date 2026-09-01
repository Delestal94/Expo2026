# Specification: Exhibitors & B2B Business Rounds

## Purpose & Scope
Governs exhibitor company profiles, commercial catalog, and the B2B business rounds scheduling engine, with specific emphasis on integration along the Bioceanic Corridor.

## Requirements

### 1. Exhibitor Catalog & Profiles
- Exhibitor profile includes company name, logo, industry sector, description, product catalog, contact information, and stand location on the fairgrounds map.
- Profiles support localized content across supported languages (Spanish, English, Portuguese, Mandarin).
- Search and filtering by industry, origin country, and product categories.

### 2. B2B Business Rounds Matchmaking
- Registered exhibitors and accredited business buyers can express meeting interests.
- Matchmaking engine identifies bilateral synergies based on industry sector, import/export interests, and Bioceanic Corridor supply chain roles.
- Allows participants to request, accept, reschedule, or decline 20-minute meeting slots across official event days (October 9–12, 2026).
- Automated email notifications via `MailProvider` for meeting confirmations and reminders.

### 3. Feature Flag Gating
- Exhibitor portal gated by `exhibitorPortal` flag.
- Business rounds scheduling gated by `businessRounds` flag.
