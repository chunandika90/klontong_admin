#!/bin/sh
set -e

echo "==> Klontong Backend Starting..."

# Wait for PostgreSQL (busybox nc available in alpine)
echo "==> Waiting for database at ${DB_HOST}:${DB_PORT}..."
for i in $(seq 1 30); do
  nc -z "$DB_HOST" "$DB_PORT" 2>/dev/null && break
  echo "    attempt $i/30..."
  sleep 2
done
echo "==> Database is reachable."

# Extra wait for Postgres to fully accept connections after port is open
sleep 3

# Run seeder — idempotent, safe to run on every startup
echo "==> Running seeder..."
node dist/database/seeds/run-seed.js && echo "==> Seeder done." || echo "==> Seeder skipped (already seeded or error)."

echo "==> Starting NestJS..."
exec node dist/main
