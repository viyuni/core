import 'dotenv/config';
import { fileURLToPath } from 'bun';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

import { db } from './index';

export async function startMigrate() {
  console.log('Running migrations...');

  try {
    await migrate(db, {
      migrationsFolder: fileURLToPath(new URL('../../drizzle', import.meta.url)),
    });

    console.log('Migrations completed!');
  } catch (err) {
    console.error('Migration failed!', err);
    process.exit(1);
  }
}
