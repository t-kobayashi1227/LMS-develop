#!/bin/bash
# MySQL リストアスクリプト
# 使い方: ./restore-db.sh backups/lms_backup_20260327_030000.sql.gz

set -euo pipefail

if [ $# -eq 0 ]; then
  echo "Usage: $0 <backup-file.sql.gz>"
  echo "Available backups:"
  ls -la "${BACKUP_DIR:-./backups}"/lms_backup_*.sql.gz 2>/dev/null || echo "  (none)"
  exit 1
fi

BACKUP_FILE="$1"
DB_CONTAINER="${DB_CONTAINER:-lms-db}"

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Error: File not found: $BACKUP_FILE"
  exit 1
fi

echo "WARNING: This will overwrite the current database."
read -p "Continue? (y/N) " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  echo "Aborted."
  exit 0
fi

echo "[$(date)] Restoring from $BACKUP_FILE..."
gunzip -c "$BACKUP_FILE" | docker exec -i "$DB_CONTAINER" mysql -u root -p"${MYSQL_ROOT_PASSWORD:-root_password}" lms
echo "[$(date)] Restore complete."
