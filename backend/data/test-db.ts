import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test-yourself',
  password: process.env.DB_PASSWORD || '',
  port: 5432,
});
