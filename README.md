# CodeAscend

> **A full-stack competitive programming platform — solve algorithmic problems, get AI-assisted hints, climb an Elo-based leaderboard, and track your progress with detailed analytics.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)
[![Java 21](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://jdk.java.net/21/)
[![Spring Boot 3.2](https://img.shields.io/badge/Spring_Boot-3.2.6-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis 7.2](https://img.shields.io/badge/Redis-7.2-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

---

## Table of Contents

- [Overview](#overview)
- [Screenshots](#screenshots)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [How the Judge Works](#how-the-judge-works)
- [Design Notes & Known Limitations](#design-notes--known-limitations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

**CodeAscend** is an open-source competitive programming platform, similar in spirit to LeetCode or Codeforces. Users solve algorithmic problems in Java, Python, C++, or JavaScript, get instant feedback from an in-browser judge, receive optional AI-generated hints, and compete on a global Elo-based leaderboard.

The project is built as a **modular monolith**: a single Spring Boot backend organized into clean, feature-based packages (`auth`, `problem`, `submission`, `rating`, `leaderboard`, `analytics`, `ai`), paired with a feature-sliced React + TypeScript frontend. It's designed to demonstrate real backend engineering patterns — event-driven processing, cache-backed leaderboards, resilient degradation when infrastructure is unavailable — without the operational overhead of actual microservices.

**Highlights:**
- Async, Kafka-driven code evaluation pipeline (submit → queue → judge → verdict)
- Custom judge engine supporting Java, Python, C++, and JavaScript
- Elo rating system with anti-farming protection
- Redis-backed leaderboard with automatic PostgreSQL fallback
- Optional AI Coach (hints, complexity analysis, plagiarism scoring, code review) — fully functional even without an API key, via graceful fallbacks
- 365-day activity heatmap, topic-mastery breakdown, and rating history charts
- Every external dependency (Kafka, Redis, OpenAI) is optional at runtime — the app degrades gracefully instead of crashing

---

## Screenshots
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164433" src="https://github.com/user-attachments/assets/cf362b7e-4cb8-49e7-8920-01d06d3d3d12" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164446" src="https://github.com/user-attachments/assets/eb8abb12-5aeb-4ea2-ac10-38468c8fac01" />

<img width="1920" height="1200" alt="Screenshot 2026-09-19 164451" src="https://github.com/user-attachments/assets/79f3fc1d-c5b6-4f13-a6be-92709aa00149" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164455" src="https://github.com/user-attachments/assets/ca95b53f-7568-4132-8163-60ef9cc11d9a" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164510" src="https://github.com/user-attachments/assets/1b0602dd-308a-4c91-93ab-55de5c757839" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164515" src="https://github.com/user-attachments/assets/173a49f1-c9b9-4a32-9877-1180a94ea623" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164538" src="https://github.com/user-attachments/assets/95fcd315-7854-41b0-b687-9e1e10fb97a5" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164653" src="https://github.com/user-attachments/assets/f84cf912-a673-47b5-976c-68d9418cbef9" />

<img width="1920" height="1200" alt="Screenshot 2026-09-19 164519" src="https://github.com/user-attachments/assets/4e479048-c1e2-44ac-9ea6-ee3a4030f363" />

<img width="1920" height="1200" alt="Screenshot 2026-09-19 164702" src="https://github.com/user-attachments/assets/5c773f42-3dff-413b-ae25-b93859d0120d" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164711" src="https://github.com/user-attachments/assets/c06085a1-296f-4ea1-894f-6c8204b3575b" />
<img width="1920" height="1200" alt="Screenshot 2026-09-19 164726" src="https://github.com/user-attachments/assets/43955449-176d-4762-907c-2b0814a2a421" />


---

## Features

### Authentication
- Stateless JWT authentication (HS256) with BCrypt password hashing
- Role-based access (`USER` / `ADMIN`) via Spring Security
- Public problem browsing without login; protected write/user-scoped endpoints

### Coding Workspace
- Monaco Editor (the engine behind VS Code) embedded in-browser
- Multi-language support: Java, Python, C++, JavaScript
- **Run mode** — quick, synchronous execution against custom stdin for debugging
- **Submit mode** — official, asynchronous evaluation against hidden test cases, feeding into your rating
- Execution telemetry: runtime (ms) per submission

### Judge Engine
- Kafka-based async pipeline (`submission-events` topic) so the API never blocks on code execution
- Per-language compile/run strategy (`javac`/`java`, `g++`/binary, `python3`, `node`)
- Timeout enforcement with forced process termination
- Verdicts: `ACCEPTED`, `WRONG_ANSWER`, `TIME_LIMIT_EXCEEDED`, `RUNTIME_ERROR`, `COMPILATION_ERROR`
- Self-healing background job recovers submissions stuck in `PENDING`/`RUNNING` (e.g. after a worker crash)

### Competitive Programming
- Elo-style rating algorithm (K-factor 32), scaled to each problem's difficulty tier
- Anti-farming: re-solving an already-accepted problem awards zero rating
- Deterministic daily challenge (rotates automatically, no manual scheduling needed)
- Bookmarks, submission history, and per-problem submission log
- Global leaderboard backed by a Redis Sorted Set, with rank tiers (Newbie → Grandmaster)

### Analytics & Profile
- Rating history chart (every rating change is logged with a reason)
- 365-day submission heatmap
- Difficulty breakdown and topic-mastery radar ("Code DNA")
- Achievement badges computed from live stats (streaks, solve counts, ratings)
- Personalized "next problem" recommendation based on your weakest topic

### AI Coach (optional, OpenAI-compatible)
- Non-spoiler hints based on your current code and the problem statement
- Time/space complexity analysis (LLM-generated, returned as structured JSON)
- Two-tier plagiarism detection: free local Jaccard-similarity heuristic + optional deeper LLM semantic check
- Short code-quality feedback
- **Works without an API key** — every AI feature has a sensible hardcoded fallback, so the platform is fully usable out of the box

---

## System Architecture

```mermaid
flowchart TD
    subgraph Client ["Frontend (React 18 + Vite)"]
        UI["Monaco Workspace / UI"]
        TQ["TanStack Query + Zustand"]
        UI <--> TQ
    end

    subgraph API ["Backend (Spring Boot 3.2)"]
        Sec["Spring Security + JwtFilter"]
        Ctrl["REST Controllers"]
        Svc["Service Layer"]
        Sec --> Ctrl --> Svc
    end

    subgraph Stream ["Apache Kafka"]
        Topic["submission-events"]
        Producer["SubmissionProducer"]
        Consumer["EvaluationConsumer"]
        Producer --> Topic --> Consumer
    end

    subgraph Data ["Data Layer"]
        PG[("PostgreSQL 16")]
        Redis[("Redis 7.2")]
    end

    AI["OpenAI-compatible LLM API"]

    TQ -- "REST API" --> Sec
    Svc -- "publish" --> Producer
    Consumer -- "compile + execute + verdict" --> Svc
    Svc <--> PG
    Svc <--> Redis
    Svc -- "hints / complexity / plagiarism" --> AI
```

### Submission Lifecycle

```mermaid
sequenceDiagram
    autonumber
    participant User as Browser
    participant API as Spring Boot API
    participant Kafka as Kafka Topic
    participant Worker as Evaluation Consumer
    participant DB as PostgreSQL
    participant Cache as Redis

    User->>API: POST /api/submissions
    API->>DB: Save Submission (PENDING)
    API->>Kafka: Publish SubmissionEvent
    API-->>User: submissionId + PENDING
    Kafka->>Worker: Consume event
    Worker->>Worker: Compile & run against hidden test cases
    Worker->>DB: Update status, runtime
    alt First-time ACCEPTED
        Worker->>DB: Update Elo rating + rating_history
        Worker->>Cache: ZADD leaderboard:global
    end
    User->>API: Poll GET /api/submissions/{id}
    API-->>User: Final verdict
```

If Kafka or Redis is unreachable, the corresponding service falls back automatically (see [Design Notes](#design-notes--known-limitations)) rather than failing the request.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion |
| **Editor** | Monaco Editor |
| **Charts** | Recharts |
| **State** | TanStack Query (server state) + Zustand (client state) |
| **Backend** | Java 21, Spring Boot 3.2, Spring Security, Spring Data JPA |
| **Auth** | JJWT (JWT, HS256), BCrypt |
| **Database** | PostgreSQL 16, Flyway migrations |
| **Cache / Leaderboard** | Redis 7.2 (Sorted Sets) |
| **Messaging** | Apache Kafka 3.7 (KRaft mode, no Zookeeper) |
| **AI** | Any OpenAI-compatible Chat Completions API |
| **Infra (dev)** | Docker Compose |

---

## Project Structure

```
CodeAscend/
├── backend/
│   └── src/main/
│       ├── java/com/codearenaai/
│       │   ├── auth/            # Register/login, JWT issuing
│       │   ├── user/            # User entity, public profile aggregation
│       │   ├── problem/         # Problem catalog, test cases, tags, bookmarks
│       │   ├── submission/      # Run/submit, Kafka pipeline, judge engine
│       │   ├── rating/          # Elo rating calculation + history
│       │   ├── leaderboard/     # Redis-backed ranking
│       │   ├── analytics/       # User & platform analytics
│       │   ├── dashboard/       # Home dashboard summary
│       │   ├── ai/              # OpenAI-integrated AI coach
│       │   ├── security/        # JwtFilter, SecurityConfig
│       │   └── config/          # Redis, Jwt, MapStruct configuration
│       └── resources/
│           ├── db/migration/    # Flyway SQL migrations (V1–V7)
│           └── application.yml
├── frontend/
│   └── src/
│       ├── features/            # auth, problems, submissions, dashboard,
│       │                        # leaderboard, analytics, profile, landing
│       ├── components/          # Shared UI + layout components
│       ├── lib/api/             # Axios clients per domain
│       ├── stores/              # Zustand stores
│       ├── providers/           # TanStack Query provider
│       └── router/               # React Router routes
├── docker-compose.yml            # PostgreSQL, Redis, Kafka (infra only)
└── README.md
```

---

## Getting Started

### Prerequisites
- **JDK 21**
- **Node.js 18+** and npm
- **Docker** (for PostgreSQL, Redis, Kafka)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/CodeAscend.git
cd CodeAscend
```

### 2. Start infrastructure

```bash
docker-compose up -d
docker-compose ps   # confirm all services report healthy
```

This brings up PostgreSQL (`5432`), Redis (`6379`), and Kafka (`9092`). Flyway will run migrations automatically on backend startup.

### 3. Run the backend

```bash
cd backend
./mvnw spring-boot:run       # macOS/Linux
mvnw.cmd spring-boot:run     # Windows
```

API will be available at `http://localhost:8080/api`.

### 4. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

App will be available at `http://localhost:5173`.

> **Note:** Kafka, Redis, and the AI service are all optional at runtime — the app will boot and serve requests even if one of them is unavailable, with reduced functionality (see [Design Notes](#design-notes--known-limitations)).

---

## Environment Variables

### Backend (`backend/src/main/resources/application.yml` or environment)

| Variable | Required | Default | Description |
|---|---|---|---|
| `SPRING_DATASOURCE_URL` | Yes | `jdbc:postgresql://localhost:5432/codearena_ai` | PostgreSQL connection string |
| `SPRING_DATASOURCE_USERNAME` | Yes | `codearena` | Database username |
| `SPRING_DATASOURCE_PASSWORD` | Yes | `codearena` | Database password |
| `SPRING_DATA_REDIS_HOST` | No | `localhost` | Redis host (optional — app degrades gracefully) |
| `SPRING_DATA_REDIS_PORT` | No | `6379` | Redis port |
| `SPRING_KAFKA_BOOTSTRAP_SERVERS` | No | `localhost:9092` | Kafka bootstrap servers (optional — see fallback behavior) |
| `JWT_SECRET` | Yes | — | Secret key used to sign JWTs (32+ chars recommended) |
| `JWT_ISSUER` | No | `codearena-ai` | JWT `iss` claim |
| `OPENAI_API_KEY` | No | *(empty)* | Enables live AI features; omit to use fallback responses |
| `APPLICATION_AI_OPENAI_MODEL` | No | `gpt-4o-mini` | Model used for AI Coach calls |

### Frontend (`frontend/.env`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | Yes | `http://localhost:8080/api` | Backend API base URL |

---

## API Reference

All routes are prefixed with `/api` (Spring's `server.servlet.context-path`).

### Auth (`/auth`)
| Method | Path | Description |
|---|---|---|
| POST | `/auth/register` | Create a new account |
| POST | `/auth/login` | Authenticate and receive a JWT |
| GET | `/auth/me` | Get the current authenticated user |

### Problems (`/problems`)
| Method | Path | Description |
|---|---|---|
| GET | `/problems` | Paginated list with search, difficulty, and tag filters |
| GET | `/problems/{slug}` | Problem detail (description, visible test cases) |
| GET | `/problems/daily-challenge` | Today's featured problem |
| GET | `/problems/tags` | All available problem tags |
| GET | `/problems/bookmarked` | Current user's bookmarked problems |
| POST | `/problems/{slug}/bookmark` | Toggle bookmark on a problem |
| GET | `/problems/{slug}/estimated-elo` | Preview rating gain before submitting |

### Submissions (`/submissions`)
| Method | Path | Description |
|---|---|---|
| POST | `/submissions` | Submit code for official (async) evaluation |
| POST | `/submissions/run` | Run code synchronously against custom input |
| GET | `/submissions/my` | Current user's submission history |
| GET | `/submissions/{id}` | Submission detail / poll for verdict |
| GET | `/submissions/problem/{slug}` | Submissions for a given problem |
| POST | `/submissions/{id}/hint` | Request an AI hint for a submission |

### Leaderboard (`/leaderboard`)
| Method | Path | Description |
|---|---|---|
| GET | `/leaderboard` | Paginated global leaderboard |
| GET | `/leaderboard/me` | Current user's rank |

### Analytics & Dashboard
| Method | Path | Description |
|---|---|---|
| GET | `/dashboard` | Home dashboard summary |
| GET | `/analytics/dashboard` | Platform-wide analytics |
| GET | `/analytics/user/{userId}` | Per-user analytics (heatmap, topic mastery, rating history) |

### Users (`/users`)
| Method | Path | Description |
|---|---|---|
| GET | `/users/profile/me` | Current user's full profile |
| GET | `/users/profile/{username}` | Public profile by username |

---

## Database Schema

Schema is managed with **Flyway** (`V1__init.sql` through `V7__add_rating_history.sql`), applied automatically on backend startup.

```mermaid
erDiagram
    USERS ||--o{ SUBMISSIONS : makes
    USERS ||--o{ PROBLEM_BOOKMARKS : bookmarks
    USERS ||--o{ RATING_HISTORY : has
    PROBLEMS ||--o{ TEST_CASES : contains
    PROBLEMS ||--o{ PROBLEM_TAGS : tagged_with
    PROBLEMS ||--o{ SUBMISSIONS : receives
    PROBLEMS ||--o{ PROBLEM_BOOKMARKS : bookmarked_in
    SUBMISSIONS ||--o| RATING_HISTORY : causes

    USERS {
        uuid id PK
        varchar username UK
        varchar email UK
        varchar password_hash
        varchar role
        int rating
        timestamptz created_at
    }
    PROBLEMS {
        uuid id PK
        varchar slug UK
        varchar title
        varchar difficulty
        text description
        jsonb examples_json
        numeric acceptance_rate
        int time_limit_ms
        int memory_limit_mb
    }
    TEST_CASES {
        uuid id PK
        uuid problem_id FK
        text input_data
        text expected_output
        boolean is_visible
    }
    SUBMISSIONS {
        uuid id PK
        uuid evaluation_id UK
        uuid user_id FK
        uuid problem_id FK
        varchar language
        text source_code
        varchar status
        int runtime_ms
        text ai_hint
        text ai_complexity_json
        int ai_plagiarism_score
    }
    PROBLEM_TAGS {
        uuid problem_id FK
        varchar tag
    }
    PROBLEM_BOOKMARKS {
        uuid id PK
        uuid user_id FK
        uuid problem_id FK
    }
    RATING_HISTORY {
        uuid id PK
        uuid user_id FK
        int previous_rating
        int new_rating
        int rating_delta
        varchar reason
    }
```

Notable design choices:
- **UUID primary keys** everywhere (non-enumerable, distributed-system-friendly)
- **`CHECK` constraints** at the database level in addition to application validation (e.g. `rating >= 0`, valid `role` values)
- **`examples_json` as JSONB** rather than a normalized table — the data is small, bounded, and always fetched as a unit
- **`rating_history`** stores `previous_rating`/`new_rating` explicitly (not just the delta) as an immutable audit trail

---

## How the Judge Works

1. **Submit** → a `Submission` row is created with status `PENDING`, and an event is published to the Kafka topic `submission-events`. The API responds immediately — it never blocks on code execution.
2. **Consume** → `EvaluationConsumer` (consumer group `codearena-evaluator`) picks up the event and hands it to the evaluator.
3. **Compile & run** → depending on language, source code is compiled (Java/C++) and executed in a temporary directory via `ProcessBuilder`, piping in each test case's input and comparing normalized stdout against the expected output. Execution stops at the first failing test case.
4. **Timeout handling** → each run is bounded by the problem's time limit; timed-out processes are forcibly terminated and marked `TIME_LIMIT_EXCEEDED`.
5. **Verdict & rating** → on the first-ever `ACCEPTED` verdict for a problem, `RatingService` applies an Elo-style update and logs it to `rating_history`; the leaderboard's Redis Sorted Set is updated in the same step.
6. **AI pass (best-effort)** → hint generation, complexity analysis, and plagiarism scoring run afterward and are never allowed to affect the core verdict — if the AI call fails or no API key is configured, static fallback content is used instead.
7. **Self-healing** → a scheduled job checks every minute for submissions stuck in `PENDING`/`RUNNING` for more than 5 minutes (e.g. after a worker crash) and marks them `RUNTIME_ERROR` so they never hang indefinitely.

---

## Design Notes & Known Limitations

This project favors resilience and clarity over exhaustive production-hardening. A few things worth knowing if you plan to deploy it or extend it:

- **No container-level sandboxing.** Code executes via `ProcessBuilder` on the host, not inside Docker/gVisor/Firecracker. This is fine for local/demo use but is **not safe for an untrusted, internet-facing deployment** — running arbitrary user code without isolation is a real code-execution risk. Adding a proper sandbox (isolated containers, no network, resource limits, non-root user) is the top priority before exposing this publicly.
- **Memory limits are not enforced**, only requested — `memory_limit_mb` is accepted but the reported memory usage is a placeholder rather than a real measurement.
- **Graceful degradation is a deliberate, consistent pattern**: if Kafka is unreachable, submissions are marked `RUNNING` and later recovered by the stale-submission job; if Redis is unreachable, leaderboard rank falls back to a PostgreSQL count query; if no OpenAI key is set, every AI feature returns a sensible static fallback. The app is designed to never hard-fail because of an optional dependency.
- **No refresh tokens** — JWTs are short-lived with no rotation/blacklist mechanism; expired tokens require a fresh login.
- **Leaderboard reads are hybrid**: individual rank lookups use Redis (`ZREVRANK`, O(log N)), but the full paginated listing is served from PostgreSQL (since it needs joined data like solve counts) — Redis's range-query strength (`ZRANGE`) isn't used for the listing itself.
- **Streak and heatmap calculations are computed on demand** from full submission history rather than incrementally maintained, which won't scale indefinitely for very active users.

Contributions that address any of the above are very welcome — see [Contributing](#contributing).

---

## Roadmap

- [ ] Container-based sandboxing for code execution (security hardening)
- [ ] Scheduled/live contests with real-time scoreboards
- [ ] WebSocket-based live judging (replace client polling)
- [ ] Discussion forums and community editorials
- [ ] Team contests and a social/friends system
- [ ] Refresh-token based auth with revocation support

---

## Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Commit your changes with clear messages
4. Push and open a Pull Request

Please keep PRs focused and include a short description of what changed and why.

---

## License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for details.
