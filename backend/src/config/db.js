import DOT_ENV from '../config-env.js';
import mongoose from 'mongoose'

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(DOT_ENV.DATABASE_CONNECTION_STRING);
        console.log(`MongoDB Connected: ${connect.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;