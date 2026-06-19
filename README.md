# jya-pasa

> AI-powered customer support chat with human escalation — embeddable, event-driven, production-grade backend

![Status](https://img.shields.io/badge/status-in_development-amber?style=flat-square)
![Stack](https://img.shields.io/badge/stack-NestJS_·_Kafka_·_WebSocket_·_pgvector-1A56DB?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## What this is

A backend system that lets any site owner embed an AI chat widget on their site. Visitors ask questions, the AI answers using a configured knowledge base. When the AI cannot help, a human agent takes over in real time — with full context of the AI conversation already visible.

The live demo runs on [bkmilan.com.np](https://bkmilan.com.np) — the chat widget on that site is powered by this system.

---

## Architecture

```
Visitor message
    ↓
WebSocket Gateway        ← Socket.io, JWT-validated per role
    ↓
Kafka: chat.message.received
    ↓
AI Consumer              ← pgvector similarity search → OpenAI → Redis cache
    ↓
Kafka: ai.response.generated
    ↓
WebSocket Gateway        ← emits response to visitor room
```

When the AI is uncertain, an escalation flag is returned. The visitor can request a human agent. The agent joins the same WebSocket room with full conversation context.

---

## Tech stack

| Layer           | Technology                                            |
| --------------- | ----------------------------------------------------- |
| Framework       | NestJS + TypeScript                                   |
| Event streaming | Apache Kafka (KafkaJS)                                |
| Real-time       | Socket.io via @nestjs/websockets                      |
| AI provider     | OpenAI GPT-4o-mini (provider-agnostic — swap via env) |
| Vector search   | PostgreSQL + pgvector (cosine similarity)             |
| Cache           | Redis — AI response cache + JWT refresh store         |
| Auth            | JWT with refresh rotation + role-based guards         |
| Roles           | ADMIN · AGENT · VISITOR (session token)               |
| Database        | PostgreSQL 16                                         |
| Local infra     | Docker Compose                                        |

---

## Key patterns demonstrated

- **Event-driven architecture** — Kafka decouples the WebSocket gateway from AI processing. Gateway never blocks during the 2–8s LLM call.
- **RAG pipeline** — user message is embedded, top 5 knowledge chunks retrieved via cosine similarity, injected into the prompt before every LLM call
- **Provider-agnostic LLM layer** — `ILLMProvider` interface with OpenAI, Anthropic, and Gemini implementations. Swap via `AI_PROVIDER` env var, zero code change
- **JWT refresh token rotation** — access token 15min, refresh token 7d stored in Redis. Single-use rotation. Logout invalidates immediately.
- **Human escalation** — AI response tagged `UNCERTAIN` triggers escalation option. Agent joins the visitor's WebSocket room with full AI history as context

---

## Build progress

- [x] Foundation sprint — project infrastructure, database, Redis, Prisma, configuration, logging, health checks, and developer tooling
- [ ] Auth module — JWT refresh rotation, ADMIN and AGENT roles
- [ ] Visitor session — server-generated token, localStorage persistence
- [ ] Kafka infrastructure — topics, producer service, consumer base, DLQ
- [ ] Chat gateway — Socket.io rooms, message storage, Kafka publish
- [ ] AI module — OpenAI provider, ILLMProvider abstraction, Redis cache
- [ ] Knowledge base — CRUD, pgvector embedding, cosine retrieval
- [ ] RAG pipeline — prompt assembly, context injection, confidence tagging
- [ ] Human escalation — support request lifecycle, agent WebSocket room
- [ ] Admin panel — knowledge base UI, conversation history, live chat
- [ ] Widget — embeddable chat popup, session persistence
- [ ] Swagger docs + Postman collection
- [ ] Unit tests — AI service, idempotency, escalation logic
- [ ] README — final architecture diagram, setup guide, demo link

---

## Local setup

> Full setup guide coming after core implementation. For now:

```bash
git clone https://github.com/MysticMilan369/jya-pasa
cd jya-pasa

cp .env.example .env

docker compose up -d

pnpm install

pnpm prisma generate

pnpm prisma migrate dev

pnpm start:dev
```

Kafka UI available at `http://localhost:8080` after `docker compose up`.

---

## Current Environment variables

| Variable       | Required | Description                                                 |
| -------------- | -------- | ----------------------------------------------------------- |
| `NODE_ENV`     | Yes      | Application environment (`development`, `production`, etc.) |
| `PORT`         | Yes      | Port number for the application                             |
| `DATABASE_URL` | Yes      | PostgreSQL connection URL                                   |
| `REDIS_HOST`   | Yes      | Redis server host                                           |
| `REDIS_PORT`   | Yes      | Redis server port                                           |

Additional variables for authentication, Kafka, and AI providers will be introduced in future sprints.

Full `.env.example` in repo root.

---

## Project status

**Currently:** Sprint 2 — Authentication and user management

**Completed:** Sprint 1 — Foundation and infrastructure setup

**Target:** Working demo deployed at bkmilan.com.np

---

_Part of a two-project portfolio. See also: [kredits](https://github.com/MysticMilan369/kredits) — voucher and loyalty platform._

_Built by [Mystic Milan](https://bkmilan.com.np) · [hello.milanbk@gmail.com](mailto:hello.milanbk@gmail.com)_
