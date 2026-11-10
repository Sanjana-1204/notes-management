
# Redis Implementation

## 1. Overview

Redis is integrated into the application for two primary purposes:

1. Caching frequently accessed note data.
2. Enforcing API rate limits.

MongoDB remains the primary source of truth. Redis stores temporary data to improve read performance and manage request frequency.

## 2. Redis Caching Strategy

The application uses a cache-aside pattern.

When the application needs to retrieve note data:

1. It checks Redis for the requested data.
2. If the data exists in Redis, it is returned directly.
3. If the data is not cached, the application retrieves it from MongoDB.
4. The retrieved data is stored in Redis with a configurable expiration time.
5. Subsequent requests can retrieve the cached result.

This reduces repeated database queries for frequently accessed data.

### Cached Data

The application caches:

- The authenticated user's notes list.
- Individual notes belonging to the authenticated user.

### Cache Key Design

Cache keys include the user ID to ensure that cached data remains isolated between users.

| Cache Key | Purpose |
|---|---|
| `notes:list:${userId}` | Stores the notes list for a specific user |
| `notes:${userId}:${noteId}` | Stores an individual note for a specific user |

Including the user ID prevents one user's cached note data from being confused with another user's data.

## 3. Cache Expiration (TTL)

Cache expiration is configurable through the `CACHE_TTL` environment variable.

The default configured value is:

```env id="8ve17a"
CACHE_TTL=600
```

This represents 600 seconds (10 minutes).

After the TTL expires, Redis automatically removes the expired cache entry. The next request retrieves fresh data from MongoDB and repopulates the cache.

## 4. Cache Invalidation

The application uses cache invalidation to prevent outdated note data from being served after write operations.

| Operation | Cache Invalidation |
|---|---|
| Create note | Invalidate the user's notes list |
| Update note | Invalidate the user's notes list and individual note |
| Delete note | Invalidate the user's notes list and individual note |

### Why Invalidation Is Necessary

For example, when a user updates a note, the old version may still exist in Redis.

If the cache is not invalidated, subsequent requests could return outdated content instead of the updated MongoDB document.

Invalidating the relevant cache entries ensures that the next read retrieves the latest data from MongoDB.

## 5. Rate Limiting with Redis

Redis is also used as the storage backend for API rate limiting.

The application uses Redis-backed rate limiters to track request counts across requests.

This allows rate-limit information to be shared through Redis rather than being stored only in an individual Node.js process.

### Configured Limits

| Endpoint / Operation | Limit | Identifier |
|---|---|---|
| Login | 5 requests per minute | IP address |
| Create note | 30 requests per minute | Authenticated user ID |
| Update note | 60 requests per minute | Authenticated user ID |

These limits help protect the application against excessive requests and reduce the risk of abuse.

## 6. MongoDB and Redis Responsibilities

MongoDB and Redis serve different purposes.

| MongoDB | Redis |
|---|---|
| Primary persistent database | Temporary in-memory data store |
| Stores users and notes | Stores cached note data |
| Source of truth | Performance optimization |
| Data persists according to database configuration | Cache entries expire according to TTL |
| Used for durable CRUD operations | Used for caching and rate-limit tracking |

Redis does not replace MongoDB. If cached data is missing or expires, the application retrieves the required data from MongoDB.

## 7. Configuration

Redis connection details and cache expiration are configured using environment variables.

```env id="3d2dpg"
REDIS_URL=your_redis_connection_url
CACHE_TTL=600
```

The Redis client is initialized during backend startup. The server starts accepting requests after the required database and Redis connections have been established.

## 8. Design Considerations

The Redis implementation provides:

- Reduced repeated MongoDB reads.
- Faster access to frequently requested note data.
- User-specific cache keys.
- Cache invalidation after write operations.
- Configurable cache expiration.
- Shared rate-limit storage through Redis.

MongoDB remains the authoritative data store, while Redis improves application performance and helps control API request frequency.
