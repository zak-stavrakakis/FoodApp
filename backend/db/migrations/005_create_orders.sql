CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  customer_name TEXT NOT NULL,
  city TEXT NOT NULL,
  street TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  total_quantity INTEGER NOT NULL,
  total_price NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
