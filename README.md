# Niigata AI Academy LMS

Next.js 15 + Laravel 13 で構築された学習管理システム（LMS）。

## セットアップ

**前提条件:** Node.js 20+, Docker

```bash
# バックエンド（Docker）
cd backend
docker compose up -d
# 初回のみ: マイグレーション＋シーダーはコンテナ起動時に自動実行

# フロントエンド
cd frontend
npm install
npm run dev
```

- フロントエンド: http://localhost:3000
- バックエンド API: http://localhost:8000/api/v1
- ヘルスチェック: http://localhost:8000/api/v1/health

## テストアカウント

| 役割 | メールアドレス | パスワード |
|------|---------------|-----------|
| 受講者 | `kenta.tanaka@example.com` | `password` |
| 管理者 | `yui.sato@example.com` | `password` |

> DB をリセットした場合は `docker compose exec app php artisan migrate:fresh --seed --force` を実行してください。

## コマンド

### フロントエンド (`frontend/`)

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（ポート3000） |
| `npm run build` | 本番ビルド |
| `npx tsc --noEmit` | 型チェック |
| `npx playwright test` | E2Eテスト |

### バックエンド (`backend/`)

| コマンド | 説明 |
|---------|------|
| `docker compose up -d` | Docker環境起動 |
| `docker compose exec app php artisan test` | PHPUnitテスト（28件） |
| `docker compose exec app php artisan migrate:fresh --seed --force` | DB再構築 |

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| バックエンド | Laravel 13, PHP 8.3, Laravel Sanctum |
| データベース | MySQL 8.0 (Docker) |
| テスト | PHPUnit, Playwright |
| CI | GitHub Actions |

## ルーティング

### 受講者

| パス | ページ |
|------|--------|
| `/` | ログイン |
| `/student/dashboard` | ダッシュボード |
| `/student/courses` | マイコース一覧（カテゴリフィルタ付き） |
| `/student/lesson/{courseId}` | レッスン閲覧 |
| `/student/lesson/{courseId}/quiz` | 理解度チェック |
| `/student/settings` | 設定（プロフィール・パスワード変更） |

### 管理者

| パス | ページ |
|------|--------|
| `/admin` | 管理者ログイン |
| `/admin/dashboard` | ダッシュボード（KPI・未採点課題） |
| `/admin/users` | 受講者管理 |
| `/admin/courses` | コース管理 |
| `/admin/courses/new` | 新規コース作成 |
| `/admin/courses/{id}` | コース編集（チャプター・レッスン・クイズ CRUD） |
| `/admin/analytics` | 分析レポート |
| `/admin/settings` | 設定 |

## 本番デプロイ

```bash
# .env に APP_KEY, DB_PASSWORD, MYSQL_ROOT_PASSWORD を設定
docker compose -f docker-compose.production.yml up -d --build

# 初回のみシーダー実行
docker exec lms-app php artisan db:seed --force
```

## バックアップ

```bash
# 手動バックアップ
./scripts/backup-db.sh

# リストア
./scripts/restore-db.sh backups/lms_backup_YYYYMMDD_HHMMSS.sql.gz

# cron 設定（毎日3時に自動バックアップ）
0 3 * * * /path/to/scripts/backup-db.sh
```
