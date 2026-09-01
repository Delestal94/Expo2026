# Specification: Interactive Fairgrounds Map

## Purpose & Scope
Provides an interactive 2D map of the Ciudad Cultural fairgrounds showing pavilion layouts, exhibitor stand locations, auditoriums, food courts, amenities, and live session status.

## Requirements

### 1. Fairgrounds Navigation
- Interactive SVG / Canvas map rendering pavilions, numbered stands, outdoor exhibits, stages, and emergency exits.
- Pan and zoom support across mobile, tablet, and desktop viewports.
- Stand click opens exhibitor profile card with quick actions (view catalog, schedule meeting).

### 2. Live Session & Auditorium State
- Auditoriums and stages display real-time badges indicating current and upcoming presentations according to the event agenda.

### 3. Scope Boundaries (v1)
- Indoor beacon/GPS positioning is explicitly out of scope for v1. Navigation is visual and point-and-click based on clear wayfinding landmarks.
- Gated by `interactiveMap` feature flag.
