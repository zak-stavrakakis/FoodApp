import express from 'express';

import { pool } from '../data/test-db.js';

const router = express.Router();
const JWT_SECRET = 'dev_secret'; // move to env later

router.get('', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meals');

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
});

export default router;
