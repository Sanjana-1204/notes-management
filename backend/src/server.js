import connectDB from './config/db.js';
import { connectRedis } from './config/redis-db.js';

const startServer = async () => {
    try {
        // Establish database connections first
        await connectDB();
        await connectRedis();

        // Initialize Express after Redis connects
        // otherwise we might run into issues where the app tries to use Redis before it's ready
        const App = (await import('../src/app.js')).default;

        const appInstance = new App();

        appInstance.app.listen(appInstance.port, () => {
            console.log(
                `Server running in ${appInstance.env} mode on port ${appInstance.port}`
            );
        });

    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();