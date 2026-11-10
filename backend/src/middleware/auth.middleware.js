import { verifyToken } from '../utils/auth.js';
import { AppError } from './error.middleware.js';

// Authentication middleware to verify JWT tokens and attach user info to the request object
const authenticate = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return next(new AppError('Authentication required', 401));
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyToken(token);

        req.user = {
            id: decoded.sub
        };

        next();

    } catch (error) {
        console.error('JWT verification error:', error.message);

        return next(new AppError('Invalid or expired token', 401));
    }
};

export default authenticate;