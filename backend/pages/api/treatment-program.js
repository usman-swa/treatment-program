// pages/api/treatment-program.js

import cors, { runMiddleware } from '../../lib/cors';

import treatmentData from '../../src/app/data/treatmentProgram.json';

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

  // Handle other methods
  res.status(200).json(treatmentData);
}

