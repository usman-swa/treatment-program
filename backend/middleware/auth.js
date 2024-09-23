import dotenv from 'dotenv';
import { expressjwt } from 'express-jwt';

// Load environment variables from .env file
dotenv.config();

// Debugging statement to check if JWT_SECRET is loaded
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const authenticate = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  getToken: (req) => {
    console.log('Authorization Header:', req.headers.authorization); // Log the authorization header
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    }
    return null;
  },
});

const authorize = (req, res, next) => {
  if (!req.auth) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

export { authenticate, authorize };