import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import mealsRoutes from './routes/meals.js';
import { setupDatabase } from './db/runner.js';

import type { Request, Response } from 'express';

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/cart', cartRoutes);
app.use('/orders', ordersRoutes);
app.use('/meals', mealsRoutes);

app.options('*', cors());

app.use((_req: Request, res: Response) => {
  res.status(404).json({ message: 'Not found' });
});

setupDatabase()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err: unknown) => {
    console.error('[db] Database setup failed:', err);
    process.exit(1);
  });
