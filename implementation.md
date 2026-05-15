# WikiSystem — Implementation Log

## Project Goal

Build a multi-user internal wiki/knowledge-base system supporting:

- authentication
- article drafting
- article publishing
- immutable version history
- collaborative editing
- lifecycle management
- search/filtering/pagination
- role-based authorization

The system is being built incrementally with a layered modular monolith architecture using Next.js, Prisma, and SQLite.

---

# Architectural Direction

## Core Principles

- Simple and reliable persistence model
- Immutable version history
- Clear business-layer boundaries
- Server-side authorization enforcement
- Read-optimized article storage
- Incremental feature delivery
- Reviewer-friendly architecture

---

# Chosen Stack

## Frontend + Backend

- Next.js App Router
- TypeScript
- TailwindCSS

## Persistence

- Prisma ORM
- SQLite

## Authentication

- JWT-based authentication
- HTTP-only cookies
- bcrypt password hashing

## Validation

- Zod

## Version Diffing

- jsdiff (read-time diff generation only)

---

# Core Data Model

## User

Represents authenticated users and authorization roles.

## Article

Represents the latest/current article projection optimized for reads, listing, filtering, and search.

## ArticleVersion

Immutable snapshot history storing all published article revisions.

---

# Architectural Style

Layered Modular Monolith

UI
→ Route Handlers
→ Service Layer
→ Repository Layer
→ Prisma ORM
→ SQLite Database

---

# Initial Project Foundation

Initialized:
- Next.js App Router project
- TypeScript
- TailwindCSS
- Modular folder structure
- Environment configuration
- Core dependencies
- Utility foundation

---

# Phase 2 — Database & Persistence Architecture

## Prisma Initialization

Initialized Prisma ORM with SQLite datasource.

### Rationale

SQLite was chosen because:

- zero infrastructure setup
- persistent local storage
- transactional guarantees
- reviewer-friendly execution
- fast development iteration

Prisma was selected to provide:

- type-safe database access
- schema-driven development
- relational modeling
- migration management
- transactional APIs


## Domain Enums

Created strongly-typed domain enums for:

- UserRole
- ArticleStatus
- ArticleCategory

### Why enums instead of free-text?

Enums guarantee:

- valid state transitions
- query consistency
- safer filtering/sorting
- prevention of invalid business states

This is especially important for:
- article lifecycle management
- role-based authorization
- category filtering



## User Model

Created the `User` model.

### Responsibilities

The user entity is responsible for:

- authentication identity
- authorization role ownership
- article ownership
- version edit attribution

### Important Design Decisions

#### Unique Email Constraint

Email addresses are globally unique to prevent duplicate accounts.

#### Role System

Two roles are supported:

- CONTRIBUTOR
- EDITOR

#### Separate Relationships

The system separately tracks:

- articles created by a user
- article versions edited by a user

This distinction becomes important for:
- audit history
- attribution
- permissions


## Article Model

Created the `Article` model.

### Architectural Role

The article table stores the latest/current article projection.

This is intentionally separate from historical version storage.

### Why store current content directly?

The application frequently needs:

- article listing
- search
- filtering
- sorting
- pagination
- latest article viewing

Storing the latest projection directly allows all of these operations to remain simple and efficient without reconstructing state from version history.

### Important Fields

#### status

Controls article lifecycle state:

- DRAFT
- PUBLISHED
- ARCHIVED

#### currentVersion

Tracks the latest version number for the article.

This avoids expensive aggregation queries when determining the newest version.

#### publishedAt

Remains null until the article is first published.

### Indexing Strategy

Indexes were added for:

- status
- category
- updatedAt
- combined status/category filtering

These indexes optimize:
- listing
- filtering
- sorting
- search constraints


## ArticleVersion Model

Created the immutable `ArticleVersion` model.

### Architectural Role

This table stores the complete historical revision ledger for published articles.

Every published edit creates a new immutable version snapshot.

### Snapshot-Based Storage

The system stores full snapshots instead of diffs.

### Why snapshots instead of delta storage?

Snapshot storage was intentionally chosen because it provides:

- O(1) historical reads
- simpler integrity guarantees
- easier debugging
- easier rollback support
- reduced replay complexity

Storage duplication is considered an acceptable tradeoff for significantly lower system complexity.

### Version Integrity Constraint

A composite uniqueness constraint was added:

(articleId, versionNumber)

This prevents duplicate version numbers during concurrent writes.

### Cascading Deletes

When an article is deleted, all associated version history is automatically deleted to prevent orphaned historical records.


## Prisma 7 Datasource Configuration

Adjusted Prisma datasource configuration to align with Prisma 7 architecture changes.

### Change

Datasource URLs are now configured in:

- prisma.config.ts

instead of directly inside schema.prisma.

### Why this matters

Prisma 7 separates:

- schema structure
- datasource configuration

This enables more flexible runtime adapters and environment-specific database configurations.


## Prisma Singleton Client

Implemented a singleton Prisma client utility for Next.js App Router compatibility.

### Why this pattern is necessary

During development, Next.js frequently reloads modules due to hot reloading.

Without a singleton pattern:

- multiple Prisma clients are created
- SQLite locks increase
- connection exhaustion may occur
- memory usage becomes unstable

The singleton approach guarantees a single shared Prisma client instance during development.

---

# Phase 3 — Authentication System

## Authentication Infrastructure

Created the foundational authentication module structure.

### Separation of Concerns

Authentication responsibilities were intentionally separated into:

- password hashing
- JWT token management
- session extraction
- auth constants

This prevents authentication logic from becoming tightly coupled or monolithic.



## Password Hashing

Implemented password hashing using bcrypt.

### Why bcrypt?

bcrypt was selected because it provides:

- salted password hashing
- adaptive computational cost
- mature ecosystem support
- battle-tested reliability

### Security Considerations

Passwords are never stored directly.

Only bcrypt hashes are persisted in the database.

## JWT Authentication

Implemented JWT-based authentication using the `jose` library.

### Why JWT?

JWTs provide:

- stateless authentication
- simple session transport
- server-side verification
- easy middleware integration

### Why `jose`?

The `jose` library was selected because it provides:

- modern cryptographic APIs
- Next.js compatibility
- edge-runtime support
- active maintenance

### Token Payload

Authentication tokens contain:

- userId
- email
- role

This allows efficient authorization checks without repeated database lookups for every request.


## Session Extraction Layer

Implemented centralized session extraction utilities.

### Architectural Goal

Authentication token parsing is centralized to avoid duplicated authorization logic across:

- routes
- pages
- services

### Session Source

Sessions are retrieved from HTTP-only cookies and verified using JWT signature validation.

## User Module Structure

Created a dedicated user module to encapsulate:

- user persistence
- authentication workflows
- validation
- business logic

### Architectural Reasoning

User-related responsibilities are isolated from UI and route handlers to maintain clean service boundaries.