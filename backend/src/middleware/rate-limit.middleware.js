import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redisClient } from '../config/redis-db.js';

const createLimiter = ({ windowMs, limit, prefix, keyGenerator }) => {
    return rateLimit({
        windowMs,
        limit,
        standardHeaders: true,
        legacyHeaders: false,

        store: new RedisStore({
            sendCommand: (...args) => redisClient.sendCommand(args),
            prefix
        }),

        ...(keyGenerator && { keyGenerator }),

        message: {
            success: false,
            message: 'Too many requests. Please try again later.'
        }
    });
};

// 5 login attempts per minute per IP
export const loginLimiter = createLimiter({
    windowMs: 60 * 1000,
    limit: 5,
    prefix: 'rl:login:'
});

// 30 note creations per minute per user
export const createNoteLimiter = createLimiter({
    windowMs: 60 * 1000,
    limit: 30,
    prefix: 'rl:create:',
    keyGenerator: (req) => req.user.id
});

// 60 note updates per minute per user
export const updateNoteLimiter = createLimiter({
    windowMs: 60 * 1000,
    limit: 60,
    prefix: 'rl:update:',
    keyGenerator: (req) => req.user.id
});