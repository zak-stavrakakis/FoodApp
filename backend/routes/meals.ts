import express from 'express';
import { authMiddleware, isAdmin } from '../middlewares/auth.middleware.js';
import { pool } from '../data/test-db.js';

import { validate } from '../middlewares/validate.middleware.js';
import { updateMealBodySchema, mealIdParamSchema } from '../schemas.js';
import type { UpdateMealBody, MealIdParam } from '../schemas.js';
import type { MealRow } from '../types/index.js';
import type { Request, Response } from 'express';

const router = express.Router();

router.post('/', async (_req: Request, res: Response) => {
  const { limit, offset } = _req.body;
  try {
    const count = await pool.query('SELECT COUNT(*) FROM meals');

    const countNumber = parseInt(count.rows[0].count);

    const result = await pool.query<MealRow>(
      'SELECT * FROM meals ORDER BY name ASC LIMIT $1 OFFSET $2',
      [limit, offset],
    );

    res.json({
      meals: result.rows.map((row) => ({
        ...row,
        price: parseFloat(row.price),
      })),
      count: countNumber,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch meals' });
  }
});

router.patch(
  '/:id',
  authMiddleware,
  isAdmin,
  validate(mealIdParamSchema, 'params'),
  validate(updateMealBodySchema),
  async (req: Request<MealIdParam, object, UpdateMealBody>, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { id } = req.params;
    const { name, price, description } = req.body;
    const userRole = req.user.role;

    if (userRole !== 'admin') {
      res.status(500).json({ message: 'Failed to update meal' });
      return;
    }

    try {
      const result = await pool.query<MealRow>(
        `UPDATE meals
       SET name = $1, price = $2, description = $3
       WHERE id = $4
       RETURNING *`,
        [name, +price, description, id],
      );

      if (result.rowCount === 0) {
        res.status(404).json({ message: 'Meal not found' });
        return;
      }

      const row = result.rows[0];
      res.json({
        meal: { ...row, price: parseFloat(row.price) },
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Failed to update meal' });
    }
  },
);

export default router;
