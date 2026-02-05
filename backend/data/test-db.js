import pkg from 'pg';
const { Pool } = pkg;

export const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'test-yourself',
  password: 'zak1796',
  port: 5432,
});

export async function getMeals() {
  const result = await pool.query('SELECT * FROM meals');
  //console.log(result.rows);
  return result.rows;
}

// getMeals();
