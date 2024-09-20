// lib/cors.js

import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'HEAD', 'PUT', 'DELETE'],
  origin: '*', // You can restrict this to specific origins
});

// Helper function to run middleware
/**
 * Runs the given middleware function and returns a promise.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} fn - The middleware function to run.
 * @returns {Promise} - A promise that resolves with the result of the middleware function or rejects with an error.
 */
export function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default cors;
