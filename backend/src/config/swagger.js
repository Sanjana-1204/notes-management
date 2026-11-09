
import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options = {
    definition: {
        openapi: '3.0.0',

        info: {
            title: 'Notes Management Application',
            version: '1.0.0',
            description: 'API documentation for the Multi-User Notes Management Application.',
        },

        servers: [
            {
                url: 'http://localhost:4900/api',
                description: 'Development server',
            },
        ],

        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },

    apis: [
        path.resolve(process.cwd(), 'src/routes/**/*.js'),
        path.resolve(process.cwd(), 'src/docs/**/*.js'),
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
