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
