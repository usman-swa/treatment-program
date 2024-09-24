import { authenticate, authorize } from './middleware/auth.js'; // Adjust the import path as necessary

import cors from 'cors';
import createActivityHandler from './pages/api/create-activity.js'; // Adjust the path as necessary
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import treatmentProgramHandler from './pages/api/treatment-program.js'; // Adjust the path as necessary

const app = express();

app.use(cors({
  origin: true, // Allow requests from any origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

// Log incoming requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

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
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Authentication routes
app.post('/api/auth/register', (req, res) => import('./pages/api/auth.js').then(module => module.register(req, res)));
app.post('/api/auth/login', (req, res) => import('./pages/api/auth.js').then(module => module.login(req, res)));


// Authentication routes
// (Your existing authentication routes here)
// Apply the authenticate middleware to all routes that require authentication
app.use('/api/treatment-program', authenticate, authorize);

// Example route with token validation
app.get('/api/treatment-program', treatmentProgramHandler);

// Create activity route
app.post('/api/create-activity', createActivityHandler);

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});