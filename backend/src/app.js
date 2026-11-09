import express from 'express'
import DOT_ENV from './config-env.js';
import cors from 'cors';
import helmet from 'helmet';
import loggerMiddleware from './middleware/logger.middleware.js';
import { globalErrorHandler, AppError } from './middleware/error.middleware.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import router from './routes/index.js';
class App {

    constructor() {
        // Create Express application
        this.app = express();
        // for now we only have development environment, but we can add more environments like production, testing, etc. in the future
        this.env = DOT_ENV.NODE_ENV || 'development';
        this.port = DOT_ENV.PORT || 3000;
        // Initialize middlewares
        this.initializeMiddlewares();
        this.initializeSwagger();
        // Initialize routes
        this.initializeRoutes();
        // Initialize error handling
        this.initializeErrorHandling();
    }

    initializeMiddlewares() {
        this.app.use(
            cors({
                origin: 'http://localhost:5173',
                credentials: true,
                methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Allow specific HTTP methods
                allowedHeaders: '*',
            })
        );
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(loggerMiddleware);

    }

    initializeSwagger() {
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    }

    initializeRoutes() {
        this.app.use('/api/v1', router);
    }

    initializeErrorHandling() {
        this.app.use((req, res, next) => {
            next(new AppError(`Route not found: ${req.originalUrl}`, 404));
        });

        this.app.use(globalErrorHandler);
    }
}

export default App;