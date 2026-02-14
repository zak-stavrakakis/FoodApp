import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtUserPayload } from '../types/index.js';

const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'No token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET as string, (err, user) => {
    if (err) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = user as JwtUserPayload;
    next();
  });
}

export function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  if (req.user.role !== 'admin') {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }
  next();
}
