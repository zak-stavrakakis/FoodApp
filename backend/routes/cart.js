import express from 'express';

import { pool } from '../data/test-db.js';
import { authMiddleware } from '../controllers/auth.middleware.js';

const router = express.Router();
const JWT_SECRET = 'dev_secret';

router.get('', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    // find cart
    const cartResult = await pool.query(
      'SELECT id, total_quantity FROM carts WHERE user_id = $1',
      [userId],
    );

    if (cartResult.rows.length === 0) {
      return res.json({ totalQuantity: 0, items: [] });
    }

    const cartId = cartResult.rows[0].id;
    const totalQuantity = cartResult.rows[0].total_quantity;

    // get cart items
    const itemsResult = await pool.query(
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

router.post('/add', authMiddleware, async (req, res) => {
  const { mealId, name, price } = req.body;
  const userId = req.user.userId;

  try {
    let cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId],
    );

    let cartId;

    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        'INSERT INTO carts (user_id, total_quantity) VALUES ($1, 0) RETURNING id',
        [userId],
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
    }

    const itemResult = await pool.query(
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
});

router.post('/remove', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const { mealId } = req.body;

  try {
    // find cart
    const cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId],
    );

    if (cartResult.rows.length === 0) {
      return res.status(400).json({ message: 'Cart not found' });
    }

    const cartId = cartResult.rows[0].id;

    // get the cart item
    const itemResult = await pool.query(
      'SELECT quantity FROM cart_items WHERE cart_id = $1 AND meal_id = $2',
      [cartId, mealId],
    );

    if (itemResult.rows.length === 0) {
      return res.status(400).json({ message: 'Item not found in cart' });
    }

    const currentQuantity = itemResult.rows[0].quantity;

    if (currentQuantity > 1) {
      // decrease quantity
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
      // remove item completely
      await pool.query(
        'DELETE FROM cart_items WHERE cart_id = $1 AND meal_id = $2',
        [cartId, mealId],
      );
    }

    // update cart total_quantity
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
});

export default router;
