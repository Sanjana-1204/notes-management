import bcrypt from 'bcrypt';
import authRepository from '../repositories/auth.repositories.js';
import { generateToken } from '../utils/auth.js';
import { AppError } from '../middleware/error.middleware.js';

const register = async ({ name, email, password }) => {
    // input validation
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
    // if the user exists, throw an error with a 409 status code to prevent duplication
    // if not , proceed to create the user and generate a token
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
        // Handle simultaneous registrations with the same email
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

    // check if the provided password matches the hashed password stored in the database
    // if not, throw an error with a 401 status code to indicate unauthorized access
    // if the password is valid, generate a JWT token for the user and return it along with user details
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