import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { getMeals } from './data/test-db.js';
import authRoutes from './routes/auth.js';
import jwt from 'jsonwebtoken';
import { pool } from './data/test-db.js';
const JWT_SECRET = 'dev_secret'; // move to env later
import bcrypt from 'bcrypt';
import { log } from 'node:console';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ CORS configuration
app.use(
  cors({
    origin: 'http://localhost:5173', // your React app
    credentials: true, // needed if using cookies
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // include JWT header if needed
  }),
);

app.use(express.json());
app.use('/auth', authRoutes);

app.get('/meals', async (req, res) => {
  const meals = await getMeals();
  res.json(meals);
});

// --- Auth middleware ---
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'No token' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// --- Get cart ---
app.get('/cart', authMiddleware, async (req, res) => {
  const userId = req.userId;

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

app.post('/cart/add', authMiddleware, async (req, res) => {
  const { mealId, name, price } = req.body;
  const userId = req.userId;

  console.log(mealId, name, price, userId);

  try {
    // 1️⃣ find or create cart
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

    // 2️⃣ check if item already exists
    const itemResult = await pool.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND meal_id = $2',
      [cartId, mealId],
    );

    if (itemResult.rows.length > 0) {
      // update quantity
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
      // insert new item
      await pool.query(
        `
        INSERT INTO cart_items (cart_id, meal_id, name, price, quantity, total_price)
        VALUES ($1, $2, $3, $4, 1, $4)
        `,
        [cartId, mealId, name, price],
      );
    }

    // 3️⃣ update cart total quantity
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

app.post('/cart/remove', authMiddleware, async (req, res) => {
  const userId = req.userId;
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

////////////////////////////////////////////////

app.post('/orders', async (req, res) => {
  const orderData = req.body.order;

  if (!orderData || !orderData.items || orderData.items.length === 0) {
    return res.status(400).json({ message: 'Missing data.' });
  }

  const c = orderData.customer;
  if (
    !c.email?.includes('@') ||
    !c.name?.trim() ||
    !c.street?.trim() ||
    !c['postal-code']?.trim() ||
    !c.city?.trim()
  ) {
    return res.status(400).json({
      message:
        'Missing data: Email, name, street, postal code or city is missing.',
    });
  }

  const newOrder = { ...orderData, id: (Math.random() * 1000).toString() };
  const orders = await fs.readFile('./data/orders.json', 'utf8');
  const allOrders = JSON.parse(orders);
  allOrders.push(newOrder);
  await fs.writeFile('./data/orders.json', JSON.stringify(allOrders));
  res.status(201).json({ message: 'Order created!' });
});

// Handle OPTIONS preflight requests
app.options('*', cors());

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
