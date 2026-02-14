import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../data/test-db.js';
import { seedUsers } from './seeds/users.seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSqlFile(filePath: string): Promise<void> {
  const sql = fs.readFileSync(filePath, 'utf-8');
  await pool.query(sql);
  console.log(`  Executed: ${path.basename(filePath)}`);
}

function getSqlFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort()
    .map((f) => path.join(dir, f));
}

export async function checkTablesExist(): Promise<boolean> {
  const result = await pool.query<{ exists: boolean }>(`
    SELECT EXISTS (
      SELECT FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name = 'users'
    ) AS exists
  `);
  return result.rows[0].exists;
}

export async function runMigrations(): Promise<void> {
  console.log('[db] Running migrations...');
  const migrationsDir = path.join(__dirname, 'migrations');
  const files = getSqlFiles(migrationsDir);

  if (files.length === 0) {
    console.log('[db] No migration files found.');
    return;
  }

  for (const file of files) {
    await runSqlFile(file);
  }
  console.log('[db] Migrations complete.');
}

export async function runSeeds(): Promise<void> {
  console.log('[db] Running seeds...');

  // SEED MEALS
  const seedsDir = path.join(__dirname, 'seeds');
  const sqlFiles = getSqlFiles(seedsDir);
  for (const file of sqlFiles) {
    await runSqlFile(file);
  }

  await seedUsers();
  console.log('[db] Seeds complete.');
}

export async function resetDatabase(): Promise<void> {
  console.log('[db] Resetting database...');
  await pool.query(`
    DROP TABLE IF EXISTS order_items, cart_items, orders, carts, meals, users CASCADE
  `);
  console.log('[db] All tables dropped.');

  await runMigrations();
  await runSeeds();
  console.log('[db] Database reset complete.');
}

export async function setupDatabase(): Promise<void> {
  const tablesExist = await checkTablesExist();

  if (tablesExist) {
    console.log('[db] Tables already exist. Skipping setup.');
    return;
  }

  await runMigrations();
  await runSeeds();
  console.log('[db] Database setup complete.');
}

const command = process.argv[2];

if (command === 'migrate') {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error('[db] Migration failed:', err);
      process.exit(1);
    });
} else if (command === 'seed') {
  runSeeds()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error('[db] Seed failed:', err);
      process.exit(1);
    });
} else if (command === 'reset') {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error('[db] Reset failed:', err);
      process.exit(1);
    });
} else if (command === 'setup') {
  setupDatabase()
    .then(() => process.exit(0))
    .catch((err: unknown) => {
      console.error('[db] Setup failed:', err);
      process.exit(1);
    });
}
