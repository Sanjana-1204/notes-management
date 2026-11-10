import User from '../models/user.models.js';

const findByEmail = async (email) => {
    return User.findOne({
        email: email.trim().toLowerCase()
    });
};

const findByEmailWithPassword = async (email) => {
    return User.findOne({
        email: email.trim().toLowerCase()
    }).select('+password');
};

const createUser = async (userData) => {
    const user = new User(userData);
    return user.save();
};

const authRepository = {
    findByEmail,
    findByEmailWithPassword,
    createUser
};

export default authRepository;