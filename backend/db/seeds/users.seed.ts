import bcrypt from 'bcrypt';
import { pool } from '../../data/test-db.js';

interface SeedUser {
  email: string;
  password: string;
  role: 'user' | 'admin';
}

export async function seedUsers(): Promise<void> {
  const users: SeedUser[] = [
    { email: 'test@user.com', password: 'password123', role: 'user' },
    { email: 'test@admin.com', password: 'password123', role: 'admin' },
  ];

  for (const user of users) {
    const existing = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [user.email],
    );

    if (existing.rows.length === 0) {
      const hash = await bcrypt.hash(user.password, 10);
      await pool.query(
        'INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3)',
        [user.email, hash, user.role],
      );
      console.log(`  Seeded user: ${user.email}`);
    } else {
      console.log(`  User already exists: ${user.email} (skipped)`);
    }
  }
}
