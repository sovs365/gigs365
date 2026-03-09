#!/bin/bash
# Automatic database migration script
# This runs during Render deployment to sync the Prisma schema

set -e

echo "🔄 Starting database migration..."

# Run Prisma db push with no interaction
npx prisma db push --skip-generate --skip-validate <<EOF
y
EOF

echo "✅ Database migration completed successfully!"
echo "📊 All tables and relationships have been created."
