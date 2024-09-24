import Cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const cors = Cors({
  methods: ['POST'],
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
 * /api/create-activity:
 *   post:
 *     summary: Create a new activity
 *     description: Adds a new activity to the treatment program.
 *     requestBody:
 *       description: The activity to be created
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               week:
 *                 type: string
 *               weekday:
 *                 type: string
 *               title:
 *                 type: string
 *               completed:
 *                 type: boolean
 *             required:
 *               - week
 *               - weekday
 *               - title
 *     responses:
 *       201:
 *         description: Successfully created activity
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 week:
 *                   type: string
 *                 weekday:
 *                   type: string
 *                 title:
 *                   type: string
 *                 completed:
 *                   type: boolean
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
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

  if (req.method === 'POST') {
    const { week, weekday, title, completed } = req.body;

    // Validate the request body
    if (!week || !weekday || !title) {
      console.error('Validation error: Missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
      // Create a new activity in the database
      const newActivity = await prisma.treatmentProgram.create({
        data: {
          week,
          weekday,
          title,
          completed: completed || false,
        },
      });

      // Respond with the created activity
      console.log('Activity created:', newActivity);
      return res.status(201).json(newActivity);
    } catch (error) {
      console.error('Error creating activity:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }
}