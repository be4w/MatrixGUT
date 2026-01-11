#!/bin/bash
# Database backup script for Neon Postgres
# Run this before applying any migrations

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL environment variable is not set"
    echo "Please set it with: export DATABASE_URL='your-neon-connection-string'"
    exit 1
fi

# Create backup filename with timestamp
BACKUP_FILE="backup_before_impact_migration_$(date +%Y%m%d_%H%M%S).sql"

echo "Starting database backup..."
echo "Backup file: $BACKUP_FILE"

# Run pg_dump
pg_dump "$DATABASE_URL" > "$BACKUP_FILE"

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "✓ Backup completed successfully!"
    echo "Backup saved to: $BACKUP_FILE"
    echo ""
    echo "File size: $(du -h "$BACKUP_FILE" | cut -f1)"
    echo ""
    echo "To restore this backup later, run:"
    echo "  psql \$DATABASE_URL < $BACKUP_FILE"
else
    echo "✗ Backup failed!"
    exit 1
fi
