// pages/api/create-activity.js

import Cors from 'cors';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
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
 * @openapi
 * /api/create-activity:
 *   post:
 *     summary: Create a new activity
 *     description: Adds a new activity to the treatment program.
 *     requestBody:
 *       description: The activity to be created
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
 *       '201':
 *         description: Successfully created activity
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

/**
 * API handler for creating a new activity in the treatment program.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method of the request.
 * @param {Object} req.body - The body of the request.
 * @param {number} req.body.week - The week number of the activity.
 * @param {number} req.body.weekday - The weekday number of the activity.
 * @param {string} req.body.title - The title of the activity.
 * @param {boolean} [req.body.completed] - The completion status of the activity.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} - A promise that resolves when the handler is complete.
 */
export default async function handler(req, res) {
  try {
    await runMiddleware(req, res, cors);
    console.log('CORS middleware executed'); // Debugging line

    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', 'POST');
      res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
      res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
      res.status(200).end();
      return;
    }

    if (req.method === 'POST') {
      const { week, weekday, title, completed } = req.body;

      if (!week || !weekday || !title) {
        return res.status(400).json({ error: 'Week, weekday, and title are required' });
      }

      try {
        const newActivity = await prisma.treatmentProgram.create({
          data: {
            week,
            weekday,
            title,
            completed: completed || false,
          },
        });

        res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
        res.status(201).json(newActivity);
      } catch (error) {
        console.error('Error creating activity:', error); // Debugging line
        res.setHeader('Access-Control-Allow-Origin', '*'); // Allow any origin
        res.status(500).json({ error: 'Failed to create activity' });
      }
    } else {
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in handler:', error); // Debugging line
    res.status(500).json({ error: 'Internal server error' });
  }
}
