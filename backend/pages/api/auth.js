import { comparePassword, generateToken, hashPassword } from "../../utils/auth.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * API handler for authentication-related requests.
 *
 * @param {Object} req - The HTTP request object.
 * @param {string} req.method - The HTTP method (e.g., "POST", "GET").
 * @param {Object} req.body - The body of the request, containing user data.
 * @param {string} req.body.email - The email of the user.
 * @param {string} req.body.password - The password of the user.
 * @param {string} [req.body.name] - The name of the user (optional, required for registration).
 * @param {string} req.url - The URL of the request.
 * @param {Object} res - The HTTP response object.
 * @param {Function} res.status - Function to set the HTTP status code.
 * @param {Function} res.json - Function to send a JSON response.
 * @param {Function} res.setHeader - Function to set a response header.
 * @param {Function} res.end - Function to end the response.
 *
 * @returns {Promise<void>} - A promise that resolves when the request is handled.
 *
 * @throws {Error} - Throws an error if the request method is not allowed.
 */
export default async function handler(req, res) {
  if (req.method === "POST") {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    if (req.url.endsWith("/register")) {
      const hashedPassword = await hashPassword(password);
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });
      const token = generateToken(user);
      return res.status(201).json({ token });
    }

    if (req.url.endsWith("/login")) {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await comparePassword(password, user.password))) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const token = generateToken(user);
      return res.status(200).json({ token });
    }
  } else if (req.method === "GET") {
    const users = await prisma.user.findMany();
    return res.status(200).json(users);
  } else {
    res.setHeader("Allow", ["POST", "GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}