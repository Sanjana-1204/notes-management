
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
                url: 'http://localhost:4900/api/v1',
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
    apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
