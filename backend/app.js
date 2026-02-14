import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import mealsRoutes from './routes/meals.js';
import { setupDatabase } from './db/runner.js';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.use(
  cors({
    origin: 'http://localhost:5173',
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

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

setupDatabase()
  .then(() => {
    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch((err) => {
    console.error('[db] Database setup failed:', err);
    process.exit(1);
  });
