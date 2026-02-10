//import fs from 'node:fs/promises';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import { getMeals } from './data/test-db.js';
import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import { authMiddleware } from './controllers/auth.middleware.js';
//import jwt from 'jsonwebtoken';
//import { pool } from './data/test-db.js';
//const JWT_SECRET = 'dev_secret'; // move to env later
//import bcrypt from 'bcrypt';
//import { log } from 'node:console';

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
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);

app.get('/meals', async (req, res) => {
  const meals = await getMeals();
  res.json(meals);
});

// --- Auth middleware ---
// function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res.status(401).json({ message: 'No token' });
//   }

//   const token = authHeader.split(' ')[1];

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: 'Invalid token' });
//   }
// }

////////////////////////////////////////////////

// Handle OPTIONS preflight requests
app.options('*', cors());

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
