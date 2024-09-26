import Cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const cors = Cors({
  methods: ['GET'],
  origin: '*', // Allow any origin
});

// Helper function to run middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

/**
 * @swagger
 * /api/treatment-program:
 *   get:
 *     summary: Get treatment programs
 *     description: Fetches and organizes treatment programs from the database.
 *     responses:
 *       200:
 *         description: Successfully fetched treatment programs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               additionalProperties:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     weekday:
 *                       type: string
 *                     title:
 *                       type: string
 *                     completed:
 *                       type: boolean
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

export default async function handler(req, res) {
  // Run the CORS middleware
  await runMiddleware(req, res, cors);

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
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}