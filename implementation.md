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

## Authentication Validation Layer

Implemented centralized validation schemas for:

- user registration
- user login

### Why centralized validation?

Validation schemas provide:

- consistent request validation
- reusable business constraints
- safer API boundaries
- cleaner route handlers

### Validation Strategy

Input validation occurs before business logic execution to ensure invalid requests are rejected early.

## User Repository Layer

Implemented repository abstractions for user persistence operations.

### Repository Responsibilities

The repository layer is responsible only for:

- database reads
- database writes
- persistence concerns

### Important Architectural Constraint

Business rules and authentication workflows are intentionally excluded from the repository layer.

This separation prevents persistence logic from becoming tightly coupled to application behavior.


## Authentication Service Layer

Implemented authentication business workflows within the user service layer.

### Responsibilities

The authentication service manages:

- registration workflows
- login workflows
- duplicate-account prevention
- password verification
- JWT generation

### Security Decisions

#### Password Verification

Passwords are verified using bcrypt hash comparison.

#### Duplicate Account Prevention

Email uniqueness is enforced both:

- at the database layer
- at the service layer

#### Enumeration Protection

Authentication failures intentionally return generic error messages to avoid leaking account existence information.

## Registration API

Implemented authenticated registration endpoint.

### Registration Workflow

The endpoint performs:

1. request validation
2. duplicate account checks
3. password hashing
4. user creation
5. JWT issuance
6. secure session cookie creation

### Session Storage Strategy

Authentication tokens are stored using HTTP-only cookies.

This prevents client-side JavaScript access to authentication tokens and improves session security.

## Authentication APIs

Implemented:

- login endpoint
- logout endpoint

### Login Flow

The login endpoint performs:

- credential validation
- password verification
- JWT issuance
- session cookie creation

### Logout Flow

Logout invalidates the active session by removing the authentication cookie.

## Authentication Middleware

Implemented centralized authentication middleware.

### Protected Areas

The middleware protects:

- article pages
- article APIs

### Middleware Responsibilities

The middleware performs:

- JWT verification
- route access enforcement
- unauthenticated redirects
- authenticated-user redirect handling

### Architectural Benefit

Centralized middleware prevents duplicated authentication checks across individual routes and reduces the risk of authorization inconsistencies.


## Shared Authentication Form Component

Implemented a reusable authentication form component supporting both:

- login
- registration

### Design Goals

The form component prioritizes:

- simplicity
- low duplication
- maintainability
- fast iteration

### Client-Side Responsibilities

The form manages:

- loading states
- API submission
- error display
- navigation after authentication


## Authentication Pages

Implemented:

- login page
- registration page

### UI Goals

The authentication pages prioritize:

- clarity
- simplicity
- fast onboarding
- low visual complexity

Authentication flows are intentionally minimal to keep focus on the core wiki functionality.


## Current User Helper

Implemented a reusable current-user utility.

### Purpose

The helper centralizes:

- session extraction
- authenticated user lookup
- JWT decoding integration

This avoids duplicated authentication lookup logic across pages and services.


## End-to-End Authentication Verification

Verified complete authentication flow including:

- registration
- login
- session persistence
- middleware protection
- authenticated page access
- logout behavior

### Security Verification

Confirmed that unauthenticated users cannot access protected article routes.


---

# Phase 4 — Draft Article System

## Article Module Structure

Created a dedicated article module to encapsulate:

- article persistence
- business workflows
- validation
- permissions
- querying
- lifecycle management

### Architectural Goal

The article module centralizes all article-domain logic to prevent business rules from leaking into route handlers or UI components.


## Article Input Types

Implemented explicit article input types for service-layer boundaries.

### Architectural Benefit

Strongly typed service inputs improve:

- maintainability
- refactor safety
- service isolation
- validation consistency


## Article Validation

Implemented centralized article validation schemas.

### Validation Rules

The system validates:

- non-empty titles
- non-empty bodies
- valid categories
- whitespace-only rejection

### Category Validation

Categories are validated against strict enum values to prevent invalid or arbitrary category submissions.


## Centralized Permission Layer

Implemented centralized article permission utilities.

### Current Permission Rules

#### Draft Visibility

Draft articles are visible only to their creator.

#### Draft Editing

Only the creator may edit a draft article.

#### Deletion Rules

- editors may delete any article
- contributors may delete only their own drafts

### Architectural Benefit

Permission rules are centralized to prevent authorization logic duplication and reduce security inconsistencies.

## Article Repository Layer

Implemented repository abstractions for article persistence.

### Repository Responsibilities

The repository layer handles only:

- article reads
- article writes
- database persistence operations

Business rules, authorization, and validation remain outside the persistence layer.


## Article Service Layer

Implemented centralized article business workflows.

### Current Responsibilities

The article service currently manages:

- draft creation
- draft updates
- article visibility checks
- draft deletion
- authorization enforcement

### Architectural Principle

The service layer orchestrates:

- repository access
- permission validation
- lifecycle rules
- workflow integrity

Persistence concerns remain isolated within repositories.


## Draft Creation API

Implemented draft article creation endpoint.

### Workflow

The endpoint performs:

1. authenticated-user lookup
2. request validation
3. draft creation workflow execution
4. article persistence

### Architectural Goal

Route handlers remain intentionally lightweight and delegate business logic to service-layer workflows.

## Article Visibility Enforcement

Implemented secure article retrieval workflows.

### Draft Privacy Enforcement

Draft articles are accessible only to their creator.

This rule is enforced server-side within the service layer rather than relying on UI visibility controls.

## Draft Editing & Deletion APIs

Implemented:

- draft update endpoint
- draft deletion endpoint

### Permission Enforcement

Draft editing and deletion permissions are enforced within the service layer before persistence operations execute.

### Security Model

Authorization checks are performed server-side regardless of UI visibility behavior.

## Draft Creation Page

Implemented the draft article creation page.

### UX Goals

The page prioritizes:

- fast article authoring
- minimal friction
- clear editing workflow

## Article Detail Page

Implemented secure article detail rendering.

### Security Model

Article visibility rules are enforced through the centralized service layer before rendering occurs.

### UI Goals

The detail page prioritizes:

- readability
- minimal distraction
- quick access to editing workflows

## Draft Editing Page

Implemented the draft editing interface.

### Workflow

The edit page preloads the current article state and reuses the shared article form component.

### Architectural Benefit

Shared create/edit UI components reduce duplication and maintain consistent editing behavior.

## Initial Dashboard UI

Implemented the initial authenticated dashboard experience.

### Current Responsibilities

The dashboard currently provides:

- authenticated landing experience
- navigation entrypoint
- draft creation access

Article listing functionality will be added in a later phase.

---

# Phase 5 — Publishing & Version History

## Version Repository Layer

Implemented persistence abstractions for immutable article version storage.

### Responsibilities

The version repository manages:

- snapshot creation
- version retrieval
- historical version listing

### Ordering Strategy

Version history is returned in descending version order to prioritize recent revisions.

## Read-Time Diff Generation

Implemented dynamic diff generation using jsdiff.

### Important Architectural Decision

The system stores immutable snapshots rather than delta patches.

Diffs are generated dynamically during read operations.

### Why this approach was chosen

This strategy provides:

- simpler persistence
- easier integrity guarantees
- simpler rollback support
- reduced replay complexity

Storage duplication was considered an acceptable tradeoff for significantly simpler version-management logic.

## Published Article Collaboration Rules

Extended the permission system to support collaborative editing for published articles.

### Collaboration Model

Published articles may be edited by any authenticated user.

This follows the wiki-style collaborative editing requirement.

### Draft Isolation

Drafts remain private and editable only by their creator until publication occurs.


## Publish Workflow

Implemented the article publication workflow.

### Publication Responsibilities

Publishing performs:

- immutable version snapshot creation
- article status transition
- version-number initialization
- publication timestamp assignment

### Transactional Integrity

Publishing executes within a database transaction to prevent partial state corruption.

This guarantees that:

- versions cannot exist without publication
- publication cannot occur without initial version creation


## Published Edit Workflow

Implemented collaborative published-article editing workflows.

### Workflow Behavior

Published edits perform:

- immutable snapshot creation
- version-number incrementation
- latest projection updates

### Dual-Model Architecture

The system maintains:

#### Article Table

Stores the latest/current article projection optimized for reads and search.

#### ArticleVersion Table

Stores immutable historical snapshots optimized for audit history and version browsing.


## Version Service Layer

Implemented centralized version-history workflows.

### Current Responsibilities

The version service manages:

- version-history retrieval
- historical snapshot loading
- diff generation
- historical visibility enforcement

### Security Model

Historical access permissions reuse the centralized article visibility rules to ensure draft privacy remains enforced across version history.

## Version APIs

Implemented:

- version history retrieval
- historical snapshot retrieval
- dynamic diff retrieval

### Diff Strategy

Diffs are computed dynamically during read operations rather than being persisted directly.

## Publish UI

Implemented article publication UI controls.

### Workflow

Publication requests execute through dedicated publication APIs rather than generic update operations.

This preserves explicit lifecycle-transition semantics.

## Version History UI

Implemented visible article version-history browsing.

### Current Capabilities

Users may now:

- browse historical versions
- inspect edit chronology
- view editor attribution
- navigate historical snapshots

---

# Phase 6 — Search, Listing & Pagination

## Centralized Query Composition

Implemented reusable article query utilities for:

- filtering
- search
- sorting
- pagination

### Architectural Benefit

Centralized query composition prevents duplicated filtering logic and keeps listing behavior consistent across APIs and UI pages.

## Article Listing Repository Support

Extended the repository layer to support:

- paginated listing
- filtered retrieval
- total-count queries

### Pagination Strategy

Separate count queries are used to calculate pagination metadata accurately.

## Published Article Listing Workflow

Implemented paginated published-article listing workflows.

### Visibility Enforcement

Only published articles are included in global listing and search operations.

Draft visibility restrictions remain enforced.

### Performance Optimization

Pagination count queries and article retrieval queries execute concurrently to reduce total request latency.

## Published Article Listing API

Implemented searchable and paginated published-article retrieval APIs.

### Supported Features

The listing API currently supports:

- search
- category filtering
- pagination
- sorting

### Search Scope

Search operates only on the latest published article projection and excludes historical versions.

## Shared Article Card Component

Implemented reusable article-card rendering for article listings.

### Design Goals

The card component standardizes:

- article preview rendering
- metadata display
- navigation behavior
- version visibility


## Search & Filter Controls

Implemented URL-driven article search and filtering controls.

### Architectural Benefit

Search state is persisted within URL query parameters rather than local component state.

This enables:

- shareable URLs
- browser history integration
- refresh persistence
- server-side rendering compatibility

## Production Article Dashboard

Implemented the primary article-discovery experience.

### Current Features

The dashboard now supports:

- published article browsing
- full-text search
- category filtering
- pagination
- article navigation

### Visibility Model

Only published articles appear within global listings and search results.

## Visual Diff Rendering

Implemented visual historical diff rendering for article versions.

### Diff Behavior

Version diffs are generated dynamically from immutable snapshots.

### Rendering Semantics

The diff viewer visually distinguishes:

- added content
- removed content
- unchanged content