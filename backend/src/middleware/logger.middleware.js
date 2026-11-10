import { getIndianTime } from '../utils/date.js';

const loggerMiddleware = (req, res, next) => {
    // Record the time when the request arrives
    const startTime = Date.now();
    res.on('finish', () => {
        const timestamp = getIndianTime();
        const duration = Date.now() - startTime;
        // skip logging for health check endpoint
        // as it is called frequently and can clutter the logs
        if (req.path === '/health' && res.statusCode === 200) {
            return;
        }
        console.log(
            `[${timestamp}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`
        );
    });
    next();
};

export default loggerMiddleware;