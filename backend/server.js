import { authenticate, authorize } from './middleware/auth.js'; // Adjust the import path as necessary

import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import express from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app = express();
const prisma = new PrismaClient();

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

// Apply the authenticate middleware to all routes that require authentication
app.use('/api/treatment-program', authenticate, authorize);

// Example route with token validation
app.get('/api/treatment-program', async (req, res) => {
  console.log(req.headers); // Log all headers
  try {
    const programs = await prisma.treatmentProgram.findMany({
      orderBy: { week: 'asc' }
    });
    const organizedData = programs.reduce((acc, program) => {
      if (!acc[program.week]) {
        acc[program.week] = [];
      }
      acc[program.week].push({
        weekday: program.weekday,
        title: program.title,
        completed: program.completed
      });
      return acc;
    }, {});

    res.status(200).json(organizedData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});