// src/middleware/auth.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const SECRET_KEY = 'your_secret_key';

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: '1d' });
};

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).send('Unauthorized: Invalid token format');
  }

  const token = parts[1];

  jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
    if (err) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).send('Unauthorized: Invalid token');
    }

    (req as any).userId = decoded.userId;
    next();
  });
};
