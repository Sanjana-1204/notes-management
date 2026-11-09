import App from '../src/app.js';
import connectDB from './config/db.js';
import { connectRedis } from './config/redis-db.js';

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        // Connect to Redis
        // here we are making sure that the redis server is connected before starting the server
        // meaning if connection is failed , the server will not start and we will get an error message in the console
        // here , the requirement states it is mandotory to connect to redis server before starting the server
        await connectRedis();
        const appInstance = new App();
        appInstance.app.listen(appInstance.port, () => {
            console.log(`Server running in ${appInstance.env} mode on port ${appInstance.port}`);
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();