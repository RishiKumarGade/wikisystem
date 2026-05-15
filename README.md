# WikiSystem

Collaborative knowledge-management platform with immutable version history, draft workflows, publishing lifecycle management, and full article audit tracking.

---

# Features

## Authentication

- JWT authentication
- HTTP-only cookie sessions
- protected routes
- contributor/editor roles

## Draft Workflow

- private drafts
- creator-only draft visibility
- draft editing
- draft deletion

## Publishing System

- immutable version snapshots
- collaborative published editing
- version history browsing
- visual diff rendering

## Search & Discovery

- full-text article search
- category filtering
- pagination
- published article listing

## Collaboration Safety

- optimistic concurrency control
- stale-write prevention
- transactional publishing workflows

## Lifecycle Management

- article publication
- archival workflows
- editor moderation controls

---

# Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- SQLite
- TailwindCSS
- Zod
- jose (JWT)
- bcryptjs
- jsdiff

---

# Architecture

The system follows a layered architecture:

## Repository Layer

Responsible only for persistence operations.

## Service Layer

Responsible for:

- business workflows
- lifecycle transitions
- authorization
- versioning logic

## Validation Layer

Centralized Zod-based validation schemas.

## Permission Layer

Centralized authorization rules.

---

# Versioning Strategy

The system stores immutable full snapshots instead of delta patches.

## Why snapshots?

This simplifies:

- rollback support
- integrity guarantees
- historical rendering
- debugging

Diffs are generated dynamically during read operations using jsdiff.

---

# Concurrency Strategy

The system implements optimistic concurrency control.

Clients submit the version they edited against.

The server rejects stale updates when newer versions already exist.

This prevents silent collaborative overwrites.

---

# Local Setup

## Install dependencies

```bash
npm install

















Excellent.

Now we finish the system professionally.

# PHASE 9 — Submission Readiness & Final Stabilization

This phase is about:
- operational clarity
- reviewer experience
- deployment readiness
- maintainability
- cleanup

A huge percentage of engineering evaluation happens here.

Bad README + unclear setup can destroy perception of even a strong system.

---

# 9.1 Create Proper README

Goal:

```text id="’winiipaa"
make reviewer onboarding frictionless
```

A reviewer should be running system within:
```text id="’winiipad"
2–3 minutes
```

---

# Step 1 — Create README.md

Replace existing README with:

```md id="’winiipag"
# WikiSystem

Collaborative knowledge-management platform with immutable version history, draft workflows, publishing lifecycle management, and full article audit tracking.

---

# Features

## Authentication

- JWT authentication
- HTTP-only cookie sessions
- protected routes
- contributor/editor roles

## Draft Workflow

- private drafts
- creator-only draft visibility
- draft editing
- draft deletion

## Publishing System

- immutable version snapshots
- collaborative published editing
- version history browsing
- visual diff rendering

## Search & Discovery

- full-text article search
- category filtering
- pagination
- published article listing

## Collaboration Safety

- optimistic concurrency control
- stale-write prevention
- transactional publishing workflows

## Lifecycle Management

- article publication
- archival workflows
- editor moderation controls

---

# Tech Stack

- Next.js App Router
- TypeScript
- Prisma ORM
- SQLite
- TailwindCSS
- Zod
- jose (JWT)
- bcryptjs
- jsdiff

---

# Architecture

The system follows a layered architecture:

## Repository Layer

Responsible only for persistence operations.

## Service Layer

Responsible for:

- business workflows
- lifecycle transitions
- authorization
- versioning logic

## Validation Layer

Centralized Zod-based validation schemas.

## Permission Layer

Centralized authorization rules.

---

# Versioning Strategy

The system stores immutable full snapshots instead of delta patches.

## Why snapshots?

This simplifies:

- rollback support
- integrity guarantees
- historical rendering
- debugging

Diffs are generated dynamically during read operations using jsdiff.

---

# Concurrency Strategy

The system implements optimistic concurrency control.

Clients submit the version they edited against.

The server rejects stale updates when newer versions already exist.

This prevents silent collaborative overwrites.

---

# Local Setup

## Install dependencies

```bash
npm install
```

## Environment variables

Create `.env`:

```env
DATABASE_URL="file:./dev.db"

JWT_SECRET="super-secret-key"
```

## Run migrations

```bash
npx prisma migrate dev
```

## Seed database

```bash
npx prisma db seed
```

## Start development server

```bash
npm run dev
```
