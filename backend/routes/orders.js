import express from 'express';
import { pool } from '../data/test-db.js';
import { authMiddleware } from '../controllers/auth.middleware.js';

const router = express.Router();
const JWT_SECRET = 'dev_secret'; 

router.get('', authMiddleware, async (req, res) => {
  const userId = req.user.userId;

  try {
    const ordersResult = await pool.query(
      `
      SELECT
        o.id,
        o.created_at,
        o.total_quantity,
        o.total_price,
        o.customer_name,
        o.city,
        o.street,
        o.postal_code,
        json_agg(
          json_build_object(
            'mealId', oi.meal_id,
            'name', oi.name,
            'price', oi.price,
            'quantity', oi.quantity,
            'totalPrice', oi.total_price
          )
        ) AS items
      FROM orders o
      JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id
      ORDER BY o.created_at DESC
      `,
      [userId],
    );

    res.json(ordersResult.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

router.post('', authMiddleware, async (req, res) => {
  const userId = req.user.userId;
  const orderData = req.body.order;

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  try {
    
    const cartResult = await pool.query(
      'SELECT id, total_quantity FROM carts WHERE user_id = $1',
      [userId],
    );

    if (cartResult.rows.length === 0) {
      throw new Error('Cart not found');
    }

    const cartId = cartResult.rows[0].id;
    const totalQuantity = cartResult.rows[0].total_quantity;

    
    const totalPriceResult = await pool.query(
      `
      SELECT COALESCE(SUM(total_price), 0) AS total
      FROM cart_items
      WHERE cart_id = $1
      `,
      [cartId],
    );

    const totalPrice = totalPriceResult.rows[0].total;

    
    const orderResult = await pool.query(
      `
      INSERT INTO orders (
        user_id,
        customer_name,
        city,
        street,
        postal_code,
        total_quantity,
        total_price
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id
      `,
      [
        userId,
        orderData.customer.name,
        orderData.customer.city,
        orderData.customer.street,
        orderData.customer.postalCode,
        totalQuantity,
        totalPrice,
      ],
    );

    const orderId = orderResult.rows[0].id;

    
    await pool.query(
      `
      INSERT INTO order_items (order_id, meal_id, name, price, quantity, total_price)
      SELECT
        $1,
        meal_id,
        name,
        price,
        quantity,
        total_price
      FROM cart_items
      WHERE cart_id = $2
      `,
      [orderId, cartId],
    );

    
    await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);

    await pool.query('UPDATE carts SET total_quantity = 0 WHERE id = $1', [
      cartId,
    ]);

    await pool.query('COMMIT');

    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ message: 'Order failed' });
  }
});

export default router;
