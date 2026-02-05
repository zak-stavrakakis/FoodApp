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
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    console.log(err);

    return res.status(403).json({ error: 'Invalid token' });
  }
}

// --- Get cart ---
app.get('/cart', authMiddleware, async (req, res) => {
  const userId = req.userId;
  try {
    const cartResult = await pool.query(
      `SELECT c.id AS cart_id, ci.*
       FROM carts c
       LEFT JOIN cart_items ci ON c.id = ci.cart_id
       WHERE c.user_id = $1`,
      [userId],
    );

    const cart = cartResult.rows.map((row) => ({
      id: row.product_id,
      name: row.name,
      price: row.price,
      quantity: row.quantity,
    }));

    res.json({ cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/cart', authMiddleware, async (req, res) => {
  const userId = req.userId;
  const { cart } = req.body;
  if (!cart) return res.status(400).json({ error: 'Cart is required' });

  try {
    // Get or create cart
    let cartResult = await pool.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId],
    );
    let cartId;
    if (cartResult.rows.length === 0) {
      const newCart = await pool.query(
        'INSERT INTO carts (user_id) VALUES ($1) RETURNING id',
        [userId],
      );
      cartId = newCart.rows[0].id;
    } else {
      cartId = cartResult.rows[0].id;
      await pool.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
    }

    // Insert new items
    for (let item of cart) {
      await pool.query(
        'INSERT INTO cart_items (cart_id, product_id, name, price, quantity) VALUES ($1,$2,$3,$4,$5)',
        [cartId, item.id, item.name, item.price, item.quantity],
      );
    }

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
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
