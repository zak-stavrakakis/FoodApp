import express from 'express';
import { authMiddleware, isAdmin } from '../controllers/auth.middleware.js';

import { pool } from '../data/test-db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meals order by name asc');

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
});

router.patch('/:id', authMiddleware, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;
  const userRole = req.user.role;
  if (userRole !== 'admin') {
    return res.status(500).json({ message: 'Failed to update meal' });
  }
  try {
    const result = await pool.query(
      `UPDATE meals 
       SET name = $1, price = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [name, +price, description, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.json({
      meal: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update meal' });
  }
});

export default router;
