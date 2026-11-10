import jwt from 'jsonwebtoken';
import DOT_ENV from '../config-env.js';

// Generate a JWT token for the given user ID with a specified expiration time
export const generateToken = (userId) => {
    return jwt.sign(
        { sub: userId.toString() },
        DOT_ENV.JWT_SECRET_KEY,
        {
            expiresIn: DOT_ENV.JWT_EXPIRES_IN
        }
    );
};

// Verify the JWT token and return the decoded payload
export const verifyToken = (token) => {
    return jwt.verify(token, DOT_ENV.JWT_SECRET_KEY);
};