# Specification: Visitor Access & Ticketing

## Purpose & Scope
Governs visitor registration, ticket and digital badge generation (with encrypted dynamic QR), admission fee gating, capacity monitoring, and turnstile/entrance scanning.

## Requirements

### 1. Admission Modes (ADR-0003)
- `ADMISSION_MODE="free"` (Default): Registration form completion generates and signs the digital QR pass immediately.
- `ADMISSION_MODE="paid"`: Registration form completion initiates a checkout session via `PaymentProvider`. QR pass is only issued upon verified payment receipt/webhook.

### 2. Registration Flow
- Visitors provide name, email, document/passport number, organization/role, and country/province of origin.
- Form inputs validated with Zod on both client and server actions.
- Rate limiting applied per IP and email to prevent bulk registration exploits.

### 3. QR Code Pass Generation & Delivery
- Generates a signed, tamper-resistant QR code containing payload (ticket ID, visitor hash, issue timestamp).
- Displays pass on web UI with offline caching support (PWA).
- Sends pass to the visitor's email via `MailProvider`.

### 4. Turnstile / Entrance Scanner PWA
- Lightweight web application with camera stream QR decoder.
- Validates pass signature, checks for duplicate entry scans, and reports real-time entry logs.
- Supports offline validation queue that syncs when network connectivity is restored.
