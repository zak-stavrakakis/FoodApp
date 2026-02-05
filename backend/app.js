import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { getMeals } from './data/test-db.js';
import authRoutes from './routes/auth.js';
import bcrypt from 'bcrypt';

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
