# Spec Delta: Roadmap & Presentation Views

## ADDED Requirements

### Requirement: Interactive Roadmap Page
The web application SHALL provide an interactive roadmap view at `/roadmap` detailing project milestones from Phase 0 to Phase 3.

#### Scenario: Viewing the contest roadmap
- **GIVEN** a user navigating to `/roadmap`
- **WHEN** the page loads
- **THEN** the timeline displays Phase 0 (Mockup & Spec, Sept 8), Phase 1 (Production Site, Sept 30), Phase 2 (Pre-event Tuning, Oct 8), and Phase 3 (Live Event, Oct 9–12) with status indicators and deliverable cards.

---

### Requirement: Visitor Access & Digital QR Pass View
The web application SHALL provide a visitor accreditation and digital pass view at `/acceso`.

#### Scenario: Previewing digital credential
- **GIVEN** a user on `/acceso`
- **WHEN** viewing the ticket section
- **THEN** an interactive digital badge with encrypted QR code, visitor metadata, and admission mode status is rendered.

#### Scenario: Turnstile scanner simulation
- **GIVEN** an operator on `/acceso`
- **WHEN** toggling the scanner simulator tab
- **THEN** a camera viewport with simulated QR validation feedback is displayed.

---

### Requirement: B2B Business Rounds & Matchmaking View
The web application SHALL provide a dedicated B2B business rounds portal at `/rondas-b2b`.

#### Scenario: Filtering matchmaking slots along the Bioceanic Corridor
- **GIVEN** an accredited business representative on `/rondas-b2b`
- **WHEN** selecting a country filter (Argentina, Chile, Paraguay, Brazil)
- **THEN** matching counterpart profiles, synergy scores, and 20-minute meeting slots are shown.

---

### Requirement: Multilingual AI Concierge View
The web application SHALL provide an interactive AI assistant demo at `/asistente`.

#### Scenario: Conversing with the event concierge
- **GIVEN** a visitor on `/asistente`
- **WHEN** sending a query or clicking a topic pill in ES, EN, PT, or ZH
- **THEN** a domain-grounded response is returned with human escalation options for out-of-domain queries.

---

### Requirement: Detailed Fairgrounds Map View
The web application SHALL provide an interactive Ciudad Cultural fairgrounds navigation view at `/mapa`.

#### Scenario: Exploring pavilions and stages
- **GIVEN** a visitor on `/mapa`
- **WHEN** selecting a pavilion or auditorium
- **THEN** stand listings and live session telemetry are updated in real-time.
