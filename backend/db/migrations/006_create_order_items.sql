CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER NOT NULL REFERENCES orders(id),
  meal_id TEXT NOT NULL REFERENCES meals(id),
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  quantity INTEGER NOT NULL,
  total_price NUMERIC(10,2) NOT NULL
);
