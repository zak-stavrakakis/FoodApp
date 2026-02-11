import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../data/test-db.js';
import { authMiddleware } from '../controllers/auth.middleware.js';

const router = express.Router();
const JWT_SECRET = 'dev_secret'; // move to env later

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash)
       VALUES ($1, $2)
       RETURNING id, email, role`,
      [email, hash],
    );

    res.json(result.rows[0]);
  } catch {
    res.status(400).json({ error: 'User already exists' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const result = await pool.query('SELECT * FROM users WHERE email = $1', [
    email,
  ]);

  if (result.rows.length === 0) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const user = result.rows[0];
  const valid = await bcrypt.compare(password, user.password_hash);

  if (!valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
    expiresIn: '1h',
  });

  res.json({ token });
});

router.post('/logout', (req, res) => {
  return res.json({ message: 'Logged out successfully' });
});

router.get('/user', authMiddleware, async (req, res) => {
  const result = await pool.query(
    'SELECT id, email, role FROM users WHERE id = $1',
    [req.user.userId],
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(result.rows[0]);
});

export default router;
