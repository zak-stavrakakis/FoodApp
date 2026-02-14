import express from 'express';
import { pool } from '../data/test-db.js';
import { authMiddleware } from '../controllers/auth.middleware.js';
import { validate } from '../controllers/validate.middleware.js';
import { addToCartBodySchema, removeFromCartBodySchema } from '../schemas.js';
import type { AddToCartBody, RemoveFromCartBody } from '../schemas.js';
import type { CartRow, CartItemRow } from '../types/index.js';

import type { Request, Response } from 'express';

const router = express.Router();

router.get('', authMiddleware, async (req: Request, res: Response) => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized' });
    return;
  }

  const userId = req.user.userId;

  try {
    const cartResult = await pool.query<Pick<CartRow, 'id' | 'total_quantity'>>(
      'SELECT id, total_quantity FROM carts WHERE user_id = $1',
      [userId],
    );

    if (cartResult.rows.length === 0) {
      res.json({ totalQuantity: 0, items: [] });
      return;
    }

    const cartId = cartResult.rows[0].id;
    const totalQuantity = cartResult.rows[0].total_quantity;

    const itemsResult = await pool.query<{
      id: string;
      name: string;
      price: string;
      quantity: number;
      total_price: string;
    }>(
      'SELECT meal_id AS id, name, price, quantity, total_price FROM cart_items WHERE cart_id = $1',
      [cartId],
    );

    res.json({
      totalQuantity,
      items: itemsResult.rows.map((item) => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        totalPrice: parseFloat(item.total_price),
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post(
  '/add',
  authMiddleware,
  validate(addToCartBodySchema),
  async (req: Request<object, object, AddToCartBody>, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { mealId, name, price } = req.body;
    const userId = req.user.userId;

    try {
      const cartResult = await pool.query<Pick<CartRow, 'id'>>(
        'SELECT id FROM carts WHERE user_id = $1',
        [userId],
      );

      let cartId: number;

      if (cartResult.rows.length === 0) {
        const newCart = await pool.query<Pick<CartRow, 'id'>>(
          'INSERT INTO carts (user_id, total_quantity) VALUES ($1, 0) RETURNING id',
          [userId],
        );
        cartId = newCart.rows[0].id;
      } else {
        cartId = cartResult.rows[0].id;
      }

      const itemResult = await pool.query<
        Pick<CartItemRow, 'id' | 'quantity'>
      >(
        'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND meal_id = $2',
        [cartId, mealId],
      );

      if (itemResult.rows.length > 0) {
        await pool.query(
          `
        UPDATE cart_items
        SET
          quantity = quantity + 1,
          total_price = (quantity + 1) * price
        WHERE cart_id = $1 AND meal_id = $2
        `,
          [cartId, mealId],
        );
      } else {
        await pool.query(
          `
        INSERT INTO cart_items (cart_id, meal_id, name, price, quantity, total_price)
        VALUES ($1, $2, $3, $4, 1, $4)
        `,
          [cartId, mealId, name, price],
        );
      }

      await pool.query(
        `
      UPDATE carts
      SET total_quantity = (
        SELECT SUM(quantity)
        FROM cart_items
        WHERE cart_id = $1
      )
      WHERE id = $1
      `,
        [cartId],
      );

      res.status(200).json({ message: 'Item added to cart' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

router.post(
  '/remove',
  authMiddleware,
  validate(removeFromCartBodySchema),
  async (req: Request<object, object, RemoveFromCartBody>, res: Response) => {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userId = req.user.userId;
    const { mealId } = req.body;

    try {
      const cartResult = await pool.query<Pick<CartRow, 'id'>>(
        'SELECT id FROM carts WHERE user_id = $1',
        [userId],
      );

      if (cartResult.rows.length === 0) {
        res.status(400).json({ message: 'Cart not found' });
        return;
      }

      const cartId = cartResult.rows[0].id;

      const itemResult = await pool.query<Pick<CartItemRow, 'quantity'>>(
        'SELECT quantity FROM cart_items WHERE cart_id = $1 AND meal_id = $2',
        [cartId, mealId],
      );

      if (itemResult.rows.length === 0) {
        res.status(400).json({ message: 'Item not found in cart' });
        return;
      }

      const currentQuantity = itemResult.rows[0].quantity;

      if (currentQuantity > 1) {
        await pool.query(
          `
        UPDATE cart_items
        SET quantity = quantity - 1,
            total_price = (quantity - 1) * price
        WHERE cart_id = $1 AND meal_id = $2
        `,
          [cartId, mealId],
        );
      } else {
        await pool.query(
          'DELETE FROM cart_items WHERE cart_id = $1 AND meal_id = $2',
          [cartId, mealId],
        );
      }

      await pool.query(
        `
      UPDATE carts
      SET total_quantity = (
        SELECT COALESCE(SUM(quantity),0)
        FROM cart_items
        WHERE cart_id = $1
      )
      WHERE id = $1
      `,
        [cartId],
      );

      res.json({ message: 'Item updated/removed' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
);

export default router;
