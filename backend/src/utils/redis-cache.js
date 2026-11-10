import { redisClient } from '../config/redis-db.js';
import DOT_ENV from '../config-env.js';

const CACHE_TTL = Number(DOT_ENV.CACHE_TTL) || 600;

// Get cached data
const getCache = async (key) => {
    try {
        const data = await redisClient.get(key);

        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Redis cache read error:', error.message);
        return null;
    }
};

// Store data in Redis with expiration
const setCache = async (key, data) => {
    try {
        await redisClient.set(
            key,
            JSON.stringify(data),
            { EX: CACHE_TTL }
        );
    } catch (error) {
        console.error('Redis cache write error:', error.message);
    }
};

// Delete a cached entry
const deleteCache = async (key) => {
    try {
        await redisClient.del(key);
    } catch (error) {
        console.error('Redis cache deletion error:', error.message);
    }
};

const cache = {
    getCache,
    setCache,
    deleteCache
};

export default cache;