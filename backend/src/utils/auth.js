import jwt from 'jsonwebtoken';
import DOT_ENV from '../config-env.js';

export const generateToken = (userId) => {
    return jwt.sign(
        { sub: userId.toString() },
        DOT_ENV.JWT_SECRET_KEY,
        {
            expiresIn: DOT_ENV.JWT_EXPIRES_IN
        }
    );
};

export const verifyToken = (token) => {
    return jwt.verify(token, DOT_ENV.JWT_SECRET_KEY);
};