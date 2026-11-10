import bcrypt from 'bcrypt';
import authRepository from '../repositories/auth.repositories.js';
import { generateToken } from '../utils/auth.js';
import { AppError } from '../middleware/error.middleware.js';

const register = async ({ name, email, password }) => {
    // Basic input validation
    if (
        typeof name !== 'string' ||
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !name.trim() ||
        !email.trim() ||
        !password
    ) {
        throw new AppError('Name, email and password are required', 400);
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check whether the user already exists
    const existingUser = await authRepository.findByEmail(normalizedEmail);

    if (existingUser) {
        throw new AppError('Email is already registered', 409);
    }

    let user;

    try {
        // Password hashing happens in the User model's pre-save hook
        user = await authRepository.createUser({
            name: name.trim(),
            email: normalizedEmail,
            password
        });
    } catch (error) {
        // Handles simultaneous registrations with the same email
        if (error.code === 11000) {
            throw new AppError('Email is already registered', 409);
        }
        throw error;
    }

    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

const login = async ({ email, password }) => {
    if (
        typeof email !== 'string' ||
        typeof password !== 'string' ||
        !email.trim() ||
        !password
    ) {
        throw new AppError('Email and password are required', 400);
    }

    const user = await authRepository.findByEmailWithPassword(email);

    // Use the same error for both cases to avoid revealing registered emails
    if (!user) {
        throw new AppError('Invalid email or password', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new AppError('Invalid email or password', 401);
    }

    const token = generateToken(user._id);

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        },
        token
    };
};

const authService = {
    register,
    login
};

export default authService;