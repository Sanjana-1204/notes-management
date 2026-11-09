
import mongoose from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';
import { AppError } from '../middleware/error.middleware.js';

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please enter your name'],
            trim: true,
            minlength: [2, 'Name must contain at least 2 characters'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },

        email: {
            type: String,
            required: [true, 'Please enter an email'],
            unique: true,
            lowercase: true,
            trim: true,
            validate: {
                validator: isEmail,
                message: 'Please enter a valid email'
            }
        },

        password: {
            type: String,
            required: [true, 'Please enter a password'],
            minlength: [8, 'Minimum password length is 8 characters'],
            select: false
        }
    },
    {
        timestamps: true
    }
);

// Hash password before saving
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return;
    }

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
});

// Static login method
userSchema.statics.login = async function (email, password) {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.findOne({
        email: normalizedEmail
    }).select('+password');

    const authError = new AppError(
        'Invalid email or password',
        401
    );

    if (!user) {
        throw authError;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw authError;
    }

    return user;
};

const User = mongoose.model('User', userSchema);

export default User;
