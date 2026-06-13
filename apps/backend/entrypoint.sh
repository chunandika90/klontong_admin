#!/bin/sh
set -e

echo "Waiting for database..."
until pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" 2>/dev/null; do
  sleep 1
done
echo "Database ready."

echo "Running seeder..."
node -e "
const { AppDataSource } = require('./dist/database/data-source');
AppDataSource.initialize().then(async () => {
  console.log('DB connected for seed check');
  const count = await AppDataSource.query('SELECT COUNT(*) FROM products LIMIT 1').catch(() => null);
  if (count && parseInt(count[0].count) > 0) {
    console.log('Data already seeded, skipping.');
  } else {
    console.log('No data found, seeding...');
    require('./dist/database/seeds/seed');
  }
  process.exit(0);
}).catch((e) => { console.log('Seed check skipped:', e.message); process.exit(0); });
" 2>/dev/null || true

echo "Starting application..."
exec node dist/main
