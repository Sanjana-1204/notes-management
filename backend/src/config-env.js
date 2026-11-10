import { config } from 'dotenv';
config({ path: '.env' });

const DOT_ENV = {
    NODE_ENV: process.env.NODE_ENV,
    PORT: Number(process.env.PORT),
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
    DATABASE_CONNECTION_STRING: process.env.DATABASE_CONNECTION_STRING,
    REDIS_URL: process.env.REDIS_URL,
    CACHE_TTL: Number(process.env.CACHE_TTL),
    TEST_DATABASE_CONNECTION_STRING: process.env.TEST_DATABASE_CONNECTION_STRING
};

export default DOT_ENV;