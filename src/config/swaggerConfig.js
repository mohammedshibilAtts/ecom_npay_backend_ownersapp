import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'npaybackend API documentation',
      version: '1.0.0',
      description: 'Interactive API documentation for the npaybackend project',
    },
    servers: [
      {
        url: '{protocol}://{host}',
        variables: {
          protocol: {
            enum: ['http', 'https'],
            default: 'http',
          },
          host: {
            default: 'localhost:3011',
          },
        },
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token here',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Ensure the file path accurately resolves to where the route files are from the root directory
  apis: [
    path.join(__dirname, '../interfaces/routes/**/*.js'),
    path.join(__dirname, '../interfaces/controllers/**/*.js')
  ],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
};
