import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import cartRoutes from './routes/cart.js';
import ordersRoutes from './routes/orders.js';
import mealsRoutes from './routes/meals.js';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// ✅ CORS configuration
app.use(
  cors({
    origin: 'http://localhost:5173', // your React app
    credentials: true, // needed if using cookies
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], // include JWT header if needed
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

app.listen(3000, () => console.log('Server running on port 3000'));
