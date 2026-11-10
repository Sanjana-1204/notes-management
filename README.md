
# Multi-User Notes Management Application

A full-stack notes management application that allows users to securely create, view, edit, search, and delete personal notes. It supports rich-text editing, automatic saving, JWT-based authentication, and Redis caching.

## Features

### Authentication and Security
- User registration and login.
- Password hashing using bcrypt.
- JWT-based authentication.
- Protected note routes.
- User-specific note access: users can only access and modify their own notes.

### Notes Management
- Create, view, update, and delete notes.
- Search notes by title and content.
- Rich-text editing with TipTap.
- Formatting support: bold, italic, headings, bullet lists, numbered lists, links, and code blocks.
- Automatic saving with a debounce interval.

### Performance and Reliability
- Redis caching for notes lists and individual notes.
- Cache invalidation when notes are created, updated, or deleted.
- Configurable cache expiration.
- Redis-backed rate limiting for login and note creation/update operations.
- MongoDB as the primary data store.

## Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Rich-text editor | TipTap |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Caching | Redis |
| Authentication | JWT, bcrypt |
| API documentation | Swagger / OpenAPI |
| Testing | Node.js Test Runner, Supertest |

## Project Structure

```text
notes-management/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── redis-db.js
|   |   |   └── swagger.js   
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── repositories/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── app.js
│   │   ├── config-env.js
│   │   └── server.js
│   ├── tests/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── REDIS.md
│   ├── TECHNICAL_DECISIONS.md
│   └── EDITOR_SELECTION.md
│
├── .gitignore
└── README.md
```

## Prerequisites

Ensure the following are installed and available:

- Node.js and npm
- MongoDB database
- Redis server or a Redis-compatible hosted instance
- Git

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Sanjana-1204/notes-management.git
cd notes-management
```

### 2. Backend setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file using `.env.example` as a reference.

```env
NODE_ENV=development
PORT=4900
DATABASE_CONNECTION_STRING=your_mongodb_connection_string
JWT_SECRET_KEY=your_jwt_secret
JWT_EXPIRES_IN=1d
REDIS_URL=your_redis_connection_url
CACHE_TTL=600
TEST_DATABASE_CONNECTION_STRING=your_test_database_connection_string
```

Replace the placeholder values with your own configuration. Do not commit your `.env` file or credentials.

Start the backend:

```bash
npm run dev
```

The backend runs at:

```text
http://localhost:4900
```

### 3. Frontend setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file using `.env.example`:

```env
VITE_API_URL=http://localhost:4900/api/v1
```

Start the frontend:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## API Documentation

Swagger UI is available at:

```text
http://localhost:4900/api-docs
```

### Base URL

```text
http://localhost:4900/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate an existing user |

### Notes Endpoints

All note endpoints require a valid JWT bearer token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/notes` | Create a note |
| GET | `/notes` | Retrieve the authenticated user's notes |
| GET | `/notes/search?q=keyword` | Search notes by title or content |
| GET | `/notes/:id` | Retrieve a specific note |
| PATCH | `/notes/:id` | Update a note |
| DELETE | `/notes/:id` | Delete a note |

For protected endpoints, include the following request header:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Redis Implementation

Redis is used for two purposes:

1. **Caching:** Frequently accessed notes lists and individual notes are cached to reduce repeated database reads.
2. **Rate limiting:** Redis-backed rate limiters help restrict excessive requests.

The cache uses a configurable TTL through the `CACHE_TTL` environment variable. Cache entries are invalidated when notes are created, updated, or deleted to prevent stale data from being served.

MongoDB remains the source of truth.

See [Redis Implementation](docs/redis.md) for further details.

## Running Tests

From the backend directory:

```bash
npm test
```

Tests use a separate test database configured through `TEST_DATABASE_CONNECTION_STRING`.

Ensure your test MongoDB database and Redis instance are accessible before running the tests. Do not point the test database variable at a database containing data you need to preserve.

## Design and Technical Documentation

Additional documentation is available in the `docs/` directory:

- [Architecture](docs/architecture.md) — application structure, request flow, database design, and authentication.
- [Redis Implementation](docs/redis.md) — caching strategy, invalidation, TTL, and rate limiting.
- [Technical Decisions](docs/technical-decisions.md) — technology choices and architectural decisions.
- [Editor Selection](docs/text-editor.md) — rich-text editor evaluation and licensing considerations.

## Security Considerations

- Passwords are hashed before storage.
- Protected endpoints require JWT authentication.
- Notes are queried using the authenticated user's ID to enforce ownership.
- Environment variables are used for secrets and connection strings.
- Rate limiting is applied to selected authentication and note-writing endpoints.

## Author

Developed as part of the QuickTap Services Backend Developer Technical Assessment.
