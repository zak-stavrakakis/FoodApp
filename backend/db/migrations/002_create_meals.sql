CREATE TABLE IF NOT EXISTS meals (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC(5,2) NOT NULL,
  description TEXT,
  image TEXT
);
