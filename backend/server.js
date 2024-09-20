import cors from 'cors';
import express from 'express';
import next from 'next';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // CORS setup
  server.use(cors());

  // Swagger API documentation
  /**
   * @swagger
   * openapi: 3.0.0
   * info:
   *   title: Treatment Program API
   *   version: 1.0.0
   *   description: API for managing treatment programs and activities
   * servers:
   *   - url: http://localhost:4000/api
   * apis:
   *   - ./pages/api/*.js
   */
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Treatment Program API',
        version: '1.0.0',
        description: 'API for managing treatment programs and activities',
      },
      servers: [
        {
          url: 'http://localhost:4000/api',
        },
      ],
    },
    apis: ['./pages/api/*.js'],  // Adjust if necessary
  });

  // Swagger UI route
  server.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Handle API routes (Next.js API routes are auto-handled)
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Server listens on port 4000
  server.listen(4000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:4000');
  });
});
