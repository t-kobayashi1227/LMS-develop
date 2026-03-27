#!/bin/bash
# MySQL バックアップスクリプト
# cron 例: 0 3 * * * /path/to/backup-db.sh
#
# 環境変数:
#   DB_CONTAINER: MySQLコンテナ名 (default: lms-db)
#   BACKUP_DIR: バックアップ保存先 (default: ./backups)
#   KEEP_DAYS: 保持日数 (default: 7)

set -euo pipefail

DB_CONTAINER="${DB_CONTAINER:-lms-db}"
BACKUP_DIR="${BACKUP_DIR:-./backups}"
KEEP_DAYS="${KEEP_DAYS:-7}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
FILENAME="lms_backup_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "[$(date)] Starting backup..."
docker exec "$DB_CONTAINER" mysqldump -u root -p"${MYSQL_ROOT_PASSWORD:-root_password}" lms | gzip > "${BACKUP_DIR}/${FILENAME}"
echo "[$(date)] Backup saved: ${BACKUP_DIR}/${FILENAME}"

# 古いバックアップの削除
find "$BACKUP_DIR" -name "lms_backup_*.sql.gz" -mtime +"$KEEP_DAYS" -delete
echo "[$(date)] Cleaned backups older than ${KEEP_DAYS} days"
