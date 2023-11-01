import { connect } from '@planetscale/database';
import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { migrate } from 'drizzle-orm/planetscale-serverless/migrator';

import { env } from '@/lib/env.mjs';
import logger from '@/lib/logger';

const runMigrate = async () => {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const connection = connect({ url: env.DATABASE_URL });

  const db = drizzle(connection);

  logger('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: 'src/lib/db/migrations' });

  const end = Date.now();

  logger('✅ Migrations completed in ' + (end - start).toString() + ' ms');

  process.exit(0);
};

runMigrate().catch((err) => {
  logger('❌ Migration failed');
  logger(err);
  process.exit(1);
});
