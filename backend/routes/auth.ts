import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../data/test-db.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { registerBodySchema, loginBodySchema } from '../schemas.js';
import type { RegisterBody, LoginBody } from '../schemas.js';
import type { UserRow } from '../types/index.js';

import type { Request, Response } from 'express';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post(
  '/register',
  validate(registerBodySchema),
  async (req: Request<object, object, RegisterBody>, res: Response) => {
    const { email, password } = req.body;

    try {
      const hash = await bcrypt.hash(password, 10);

      const result = await pool.query<Pick<UserRow, 'id' | 'email' | 'role'>>(
        `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, role`,
        [email, hash],
      );

      res.json(result.rows[0]);
    } catch {
      res.status(400).json({ error: 'User already exists' });
    }
  },
);

router.post(
  '/login',
  validate(loginBodySchema),
  async (req: Request<object, object, LoginBody>, res: Response) => {
    const { email, password } = req.body;

    const result = await pool.query<UserRow>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );

    if (result.rows.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET as string,
      { expiresIn: '1h' },
    );

    res.json({ token });
  },
);

router.post('/logout', (_req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
});

router.get('/user', authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const result = await pool.query<Pick<UserRow, 'id' | 'email' | 'role'>>(
    'SELECT id, email, role FROM users WHERE id = $1',
    [req.user.userId],
  );

  if (result.rows.length === 0) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  res.json(result.rows[0]);
});

export default router;
