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

router.post('/update', async (req, res) => {
  const { id, name, price, description } = req.body;
  console.log(id, name, price, description);

  try {
    const result = await pool.query(
      `UPDATE meals 
       SET name = $1, price = $2, description = $3
       WHERE id = $4
       RETURNING *`,
      [name, price, description, id],
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Meal not found' });
    }

    res.json({
      message: 'Update ok',
      meal: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update meal' });
  }
});

export default router;
