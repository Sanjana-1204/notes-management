import connectDB from './config/db.js';
import { connectRedis } from './config/redis-db.js';

const startServer = async () => {
    try {
        // Establish database connections first
        await connectDB();
        await connectRedis();

        // Initialize Express after Redis connects
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