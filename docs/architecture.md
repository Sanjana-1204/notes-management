
# Application Architecture

## 1. Overview

The Multi-User Notes Management Application follows a layered client-server architecture.

The React frontend communicates with a Node.js and Express backend through REST APIs. MongoDB is the primary persistent database, while Redis is used for caching frequently accessed notes and enforcing API rate limits.

The application is designed to provide secure user-specific note management, maintain clear separation of responsibilities, and reduce unnecessary database reads.

## 2. High-Level Architecture

```text
                    USER
                     |
                     v
             React Frontend
             (React + Vite)
                     |
              HTTP / REST API
                     |
                     v
             Express Backend
                     |
              Authentication
                Middleware
                     |
                     v
                  Routes
                     |
                     v
                Controllers
                     |
                     v
                  Services
                     |
                     v
                Repositories
                  /       \
                 v         v
             MongoDB      Redis
           (Persistent   (Cache and
              Data)     Rate Limiting)
```

## 3. Frontend Architecture

The frontend is built using React and Vite.

Its responsibilities include:

- User registration and login.
- Managing authentication state and JWT tokens.
- Displaying the user's notes.
- Creating, editing, searching, and deleting notes.
- Providing rich-text editing through TipTap.
- Automatically saving note changes using a debounced update operation.

The frontend communicates with the backend through an Axios API client. The client attaches the JWT bearer token to authenticated requests.

The rich-text editor stores content as a TipTap JSON document, allowing formatting information to be preserved when notes are saved and retrieved.

## 4. Backend Architecture

The backend uses Node.js and Express.js and follows a layered architecture.

### Routes

Routes define the API endpoints and connect incoming requests to their respective controllers.

Authentication middleware is applied to all note routes to ensure that only authenticated users can access note operations.

### Middleware

Middleware handles cross-cutting responsibilities, including:

- JWT authentication.
- Request logging.
- Rate limiting.
- Error handling.

### Controllers

Controllers handle HTTP requests and responses.

They extract request parameters and data, invoke the appropriate service methods, and return structured responses.

Business logic is kept outside the controllers.

### Services

Services contain the application's business logic.

Responsibilities include:

- Validating note operations.
- Processing note content.
- Coordinating repository operations.
- Managing Redis cache reads, writes, and invalidation.
- Enforcing application-level rules.

### Repositories

Repositories handle database access through Mongoose.

They isolate MongoDB queries from the business logic and ensure that note operations are scoped to the authenticated user's ID.

### Models

Mongoose models define the structure of documents stored in MongoDB, including validation rules and indexes.

## 5. Database Design

The application uses MongoDB as its primary database.

### User Model

The User model stores account information.

Important fields include:

- `name`
- `email`
- `password`

Passwords are hashed using bcrypt before being stored. The password field is excluded from normal query results by default.

### Note Model

The Note model stores user-created notes.

Important fields include:

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique note identifier |
| `title` | String | Note title |
| `userId` | ObjectId | Reference to the owning user |
| `content` | Object | TipTap JSON document |
| `contentText` | String | Plain-text representation of note content |
| `createdAt` | Date | Creation timestamp |
| `updatedAt` | Date | Last update timestamp |

The `userId` field establishes ownership of each note.

### Indexes

The Note model uses indexes to improve query performance:

- `{ userId: 1, updatedAt: -1 }` supports retrieving a user's notes ordered by their most recent update.
- A text index on `title` and `contentText` supports text-based searching.

## 6. Authentication and Authorization Flow

The application uses JSON Web Tokens (JWT) for authentication.

1. A user registers with a name, email, and password.
2. The password is hashed using bcrypt before being saved.
3. During login, the submitted password is compared with the stored hash.
4. If the credentials are valid, the backend generates a JWT.
5. The frontend stores the token and includes it in subsequent authenticated API requests.
6. Authentication middleware verifies the token and identifies the requesting user.
7. Note operations use the authenticated user's ID to enforce ownership.

Every note query is scoped to the authenticated user. A user cannot retrieve, update, or delete another user's notes by supplying their note ID.

## 7. Note Request Lifecycle

A typical note request follows this sequence:

1. The frontend sends an HTTP request to the backend.
2. Authentication middleware verifies the JWT.
3. The route forwards the request to the relevant controller.
4. The controller invokes the appropriate service.
5. The service applies business logic and interacts with Redis or the repository.
6. The repository accesses MongoDB when required.
7. The service returns the result to the controller.
8. The controller sends the HTTP response to the frontend.

## 8. Redis Integration

Redis is used for two separate purposes.

### Caching

Frequently accessed note data is cached to reduce repeated MongoDB reads.

The application caches:

- A user's notes list.
- Individual notes belonging to a user.

Cache entries have a configurable expiration time controlled by the `CACHE_TTL` environment variable.

When a note is created, updated, or deleted, the relevant cache entries are invalidated to prevent stale data from being returned.

### Rate Limiting

Redis also stores rate-limiting information for selected API endpoints.

The configured limits are:

- Login: 5 requests per minute per IP.
- Note creation: 30 requests per minute per authenticated user.
- Note update: 60 requests per minute per authenticated user.

Further implementation details are documented in [REDIS.md](REDIS.md).

## 9. Error Handling

The backend uses centralized error-handling middleware to provide consistent API error responses.

Errors raised during request processing are passed to the global error handler, rather than duplicating error-response logic across controllers.

Authentication failures, validation errors, missing resources, and unexpected server errors are handled through this mechanism.

## 10. Configuration and Environment Variables

Environment-specific configuration is managed through environment variables.

The backend uses `src/config-env.js` to load and expose configuration values.

Important variables include:

- `PORT`
- `DATABASE_CONNECTION_STRING`
- `JWT_SECRET_KEY`
- `JWT_EXPIRES_IN`
- `REDIS_URL`
- `CACHE_TTL`
- `TEST_DATABASE_CONNECTION_STRING`

The frontend uses `VITE_API_URL` to configure the backend API base URL.

Actual credentials and secrets are stored in local `.env` files and excluded from version control. Example environment files are provided for setup.

## 11. Architectural Considerations

The architecture aims to provide:

- **Separation of concerns:** Each backend layer has a clearly defined responsibility.
- **Security:** JWT authentication and user-scoped database queries protect user data.
- **Performance:** Redis caching reduces repeated database reads.
- **Maintainability:** Repository and service layers isolate business logic and data access.
- **Consistency:** Cache invalidation keeps cached data aligned with database changes.
- **Configurability:** Environment variables allow configuration without changing application code.
