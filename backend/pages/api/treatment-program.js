import cors, { runMiddleware } from '../../lib/cors';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /treatment-program:
 *   get:
 *     summary: Retrieve treatment programs
 *     description: Fetch a list of treatment programs organized by week and weekday.
 *     responses:
 *       200:
 *         description: A JSON object containing the treatment programs organized by week.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example: {
 *                 "1": [
 *                   {
 *                     "weekday": "Monday",
 *                     "title": "Program Title 1",
 *                     "completed": false
 *                   },
 *                   {
 *                     "weekday": "Tuesday",
 *                     "title": "Program Title 2",
 *                     "completed": true
 *                   }
 *                 ],
 *                 "2": [
 *                   {
 *                     "weekday": "Monday",
 *                     "title": "Program Title 3",
 *                     "completed": false
 *                   }
 *                 ]
 *               }
 *       500:
 *         description: Failed to fetch data from the server.
 */
export default async function handler(req, res) {
  // Run CORS middleware
  await runMiddleware(req, res, cors);

  // Handle OPTIONS method
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
    res.status(200).end();
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
