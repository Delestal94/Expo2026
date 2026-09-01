# Specification: Domain-Scoped AI Assistant

## Purpose & Scope
Provides an intelligent multilingual assistant to guide visitors and exhibitors with event agenda, exhibitor discovery, logistics, and fair navigation.

## Requirements

### 1. Domain-Scoped Retrieval Augmented Generation (RAG)
- Queries indexed embeddings in Supabase (`pgvector`) containing verified event information: agenda, exhibitors, booth locations, transport/parking, ticketing rules, and venue FAQs.
- System prompt strictly restricts responses to domain knowledge. If a user query falls outside event domain, the assistant politely declines and provides human support contact details.

### 2. Multilingual Interaction
- Natively identifies user language and converses fluently in Spanish, English, Portuguese, Mandarin Chinese, and other languages.
- Preserves accurate local terminology for Jujuy, Argentine institutions, and international trade corridors.

### 3. Rate Limiting & Safety
- Strict token and request rate limiting per IP/session via Upstash Redis to prevent abuse and manage API costs.
- Gated by `aiAssistant` feature flag.
