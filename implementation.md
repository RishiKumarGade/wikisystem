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