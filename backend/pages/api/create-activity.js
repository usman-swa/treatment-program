// pages/api/create-activity.js

import cors, { runMiddleware } from '../../lib/cors';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  await runMiddleware(req, res, cors);

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
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
          completed: completed || false
        }
      });

      res.status(201).json(newActivity);
    } catch (error) {
      res.status(500).json({ error: 'Failed to create activity' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
