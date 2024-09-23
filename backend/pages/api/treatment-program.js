import { authenticate, authorize } from '../../middleware/auth';

import { PrismaClient } from '@prisma/client';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

// Function to validate the token
const validateToken = (req) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    throw new Error('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

/**
 * @description
 * This handler supports the following methods:
 * - OPTIONS: Sets CORS headers and allowed methods.
 * - GET: Fetches and organizes treatment programs from the database.
 *
 * The GET method organizes the treatment programs by week and returns them in a structured format.
 * If an error occurs during data fetching, a 500 status code is returned with an error message.
 * For unsupported methods, a 405 status code is returned.
 */
async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    res.status(200).end();
    return;
  }

  // Validate token
  try {
    validateToken(req);
  } catch (error) {
    res.status(401).json({ error: error.message });
    return;
  }

  // Handle GET method
  if (req.method === 'GET') {
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
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// Apply authentication and authorization middleware
export default authenticate(authorize(handler));