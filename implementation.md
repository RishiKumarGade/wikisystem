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