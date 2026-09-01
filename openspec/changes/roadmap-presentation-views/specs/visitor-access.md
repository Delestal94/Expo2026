# Spec Delta: Visitor Access & Digital Ticketing

## ADDED Requirements

### Requirement: Interactive QR Pass & Scanner View
The web application SHALL provide an accreditation preview at `/acceso`.

#### Scenario: User inspects digital QR pass
- **GIVEN** a visitor on `/acceso`
- **WHEN** the digital pass component loads
- **THEN** an encrypted QR badge with visitor metadata and admission mode indicator is rendered.
