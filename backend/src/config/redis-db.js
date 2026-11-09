import { createClient } from 'redis';
import DOT_ENV from '../config-env.js';

const redisClient = createClient({
    url: DOT_ENV.REDIS_URL
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
});

const connectRedis = async () => {
    await redisClient.connect();
    console.log('Redis Connected Successfully');
};

// we created the client and connected to the redis server, now we can export the client and connectRedis function to use in other files seperately
export { redisClient, connectRedis };