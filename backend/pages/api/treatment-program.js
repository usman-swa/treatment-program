// pages/api/treatment-program.js

import cors, { runMiddleware } from '../../lib/cors';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

  try {
    if (req.method === 'GET') {
      // Fetch data from PostgreSQL
      const treatmentPrograms = await prisma.treatmentProgram.findMany();
      res.status(200).json(treatmentPrograms);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    res.status(500).json({ error: 'Error fetching data from the database' });
  }
}
