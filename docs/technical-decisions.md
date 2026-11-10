
# Technical Decisions

## 1. Overview

This document describes the key implementation and architectural decisions made while developing the Multi-User Notes Management Application.

The implementation follows the requirements of the QuickTap Services technical assessment.

## 2. Backend Framework — Node.js and Express.js

Node.js and Express.js are used to implement the backend REST API.

Express provides routing and middleware support, allowing the application to organize request handling into separate modules.

The backend separates routing, request handling, business logic, and database operations to improve maintainability.

## 3. Database — MongoDB and Mongoose

MongoDB is used as the primary database in accordance with the technical assessment requirements.

Mongoose is used for:

- Defining user and note schemas.
- Applying field validation.
- Managing document relationships.
- Performing database queries and updates.
- Defining indexes for frequently accessed fields.

Note content is stored as a TipTap JSON document to preserve rich-text formatting. A separate plain-text representation is maintained to support content searching.

## 4. Authentication — JWT and bcrypt

JWT is used for stateless authentication.

After successful login, the backend generates a signed token that the frontend includes in subsequent protected API requests.

bcrypt is used to hash user passwords before storing them in MongoDB.

This avoids storing plaintext passwords and allows password verification without retrieving the original password.

## 5. Layered Backend Architecture

The backend follows a layered architecture consisting of:

- Routes
- Middleware
- Controllers
- Services
- Repositories
- Models

Each layer has a defined responsibility.

This separation helps keep HTTP handling, business logic, and database operations independent, making the application easier to maintain and extend.

## 6. Redis — Caching and Rate Limiting

Redis is used alongside MongoDB for caching and rate limiting.

The cache-aside approach is used for note lists and individual notes.

Relevant cache entries are invalidated after create, update, and delete operations.

Redis-backed rate limiting is applied to login, note creation, and note update endpoints.

MongoDB remains the source of truth.

Further details are available in [REDIS.md](REDIS.md).

## 7. Frontend — React and Vite

React is used to build the user interface.

Vite provides the frontend development server and production build tooling.

The frontend is organized into reusable components, pages, and service modules.

Axios is used for communication with the backend API.

## 8. Rich-Text Editing — TipTap

TipTap is used to provide rich-text editing capabilities.

It supports structured document content and formatting features required by the assessment.

The editor stores content in JSON format, allowing the backend to persist and retrieve formatted notes.

The frontend uses a debounced autosave mechanism to avoid sending an API request on every individual editor change.

The editor evaluation and licensing considerations are documented in [EDITOR_SELECTION.md](EDITOR_SELECTION.md).

## 9. JavaScript and ES Modules

JavaScript with ES modules is used across the frontend and backend.

This keeps the implementation consistent and avoids introducing an additional compilation step for the backend.

The project uses explicit module imports and exports to organize application code.

## 10. API Documentation — Swagger / OpenAPI

Swagger is integrated to document the REST API.

It provides an interactive interface for inspecting endpoints, request parameters, authentication requirements, and responses.

This makes the API easier to understand and test.

## 11. Automated Testing

The backend uses the Node.js built-in test runner and Supertest.

Supertest is used to send HTTP requests to the Express application and verify API behaviour.

The tests cover authentication, note creation and retrieval, and user-specific access restrictions.

A separate test database is configured to avoid running tests against the development database.

## 12. Summary

The implementation focuses on clear separation of responsibilities, secure user-specific access, rich-text persistence, caching, rate limiting, and API testability.

The technical decisions support the functional and non-functional requirements of the assessment while keeping the application maintainable.
