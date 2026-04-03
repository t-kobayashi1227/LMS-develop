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

> DB をリセットした場合は `docker compose exec app php artisan migrate:fresh --seed` を実行してください。

## コマンド

### フロントエンド (`frontend/`)

| コマンド | 説明 |
|---------|------|
| `npm run dev` | 開発サーバー起動（ポート3000） |
| `npm run build` | 本番ビルド（型チェック含む） |

### バックエンド (`backend/`)

| コマンド | 説明 |
|---------|------|
| `docker compose up -d` | Docker環境起動 |
| `docker compose exec app php artisan test` | PHPUnitテスト |
| `docker compose exec app php artisan migrate:fresh --seed` | DB再構築 |
| `docker compose exec app php artisan create:admin {email}` | 管理者アカウント作成 |

## 技術スタック

| レイヤー | 技術 |
|---------|------|
| フロントエンド | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| バックエンド | Laravel 13, PHP 8.3, Laravel Sanctum |
| データベース | MySQL 8.0 (Docker) |
| テスト | PHPUnit |
| CI/CD | GitHub Actions → Xserver (backend) + Vercel (frontend) |

## 機能一覧

### 受講生

- コース閲覧・レッスン視聴（動画 + テキスト）
- 理解度チェック（選択式・記述式クイズ）
- 課題提出（テキスト + ファイルアップロード）
- 提出済み課題のフィードバック・スコア確認
- プロフィール・パスワード変更

### 管理者

- ダッシュボード（KPI・未採点課題一覧）
- コース管理（CRUD + サムネイル画像アップロード）
- チャプター・レッスン管理（CRUD + 並び順管理）
- クイズ問題管理（選択式/記述式、選択肢・正解・解説の編集）
- レッスン資料アップロード（PDF等の添付ファイル）
- 受講生管理（一覧・検索・削除）
- 受講登録管理（コース単位で受講生の追加/解除）
- 課題採点・フィードバック
- 分析レポート（月次アクティブ受講生、コース別進捗・修了率）

## ルーティング

### 受講者

| パス | ページ |
|------|--------|
| `/` | ログイン |
| `/student/dashboard` | ダッシュボード |
| `/student/courses` | マイコース一覧（カテゴリフィルタ付き） |
| `/student/lesson/{courseId}` | レッスン閲覧（動画・テキスト・課題提出） |
| `/student/lesson/{courseId}/quiz` | 理解度チェック |
| `/student/settings` | 設定（プロフィール・パスワード変更） |

### 管理者

| パス | ページ |
|------|--------|
| `/admin` | 管理者ログイン |
| `/admin/dashboard` | ダッシュボード（KPI・未採点課題） |
| `/admin/users` | 受講者管理（検索・ページネーション付き） |
| `/admin/courses` | コース管理（ステータスフィルタ・ページネーション付き） |
| `/admin/courses/new` | 新規コース作成 |
| `/admin/courses/{id}` | コース編集（チャプター・レッスン・クイズ・資料・受講生管理） |
| `/admin/submissions/{id}` | 課題採点 |
| `/admin/analytics` | 分析レポート |
| `/admin/settings` | 設定 |

## 認証・認可

- Laravel Sanctum によるトークンベース認証
- フロントエンド: `auth_token`（httpOnly cookie）+ `user_role` cookie で middleware がロール検証
- バックエンド: `EnsureAdmin` ミドルウェアで管理者ルートを保護
- 受講生は `/admin/*` にアクセス不可（`/student/dashboard` へリダイレクト）
- CORS: `config/cors.php` で `CORS_ALLOWED_ORIGINS` 環境変数から設定

## 本番環境

| 環境 | サービス |
|------|---------|
| バックエンド | Xserver（PHP 8.3 + MySQL） |
| フロントエンド | Vercel |
| CI/CD | GitHub Actions |

### 本番初期セットアップ

```bash
# Xserver で管理者アカウントを作成
ssh -p 10022 user@xserver
cd ~/stage-site.net/public_html/api.stage-site.net
/opt/php-8.3/bin/php artisan create:admin --email=admin@example.com
```

### 環境変数

**バックエンド（`.env`）:**
- `CORS_ALLOWED_ORIGINS` — 許可するフロントエンドオリジン（カンマ区切り）

**フロントエンド（Vercel環境変数）:**
- `BACKEND_URL` — バックエンドAPIのURL（例: `https://api.stage-site.net/api/v1`）

## ドキュメント

- `frontend/docs/database-schema.md` — データベース設計書
- `frontend/docs/TODO.md` — 未実装機能一覧
- `docs/deployment-guide.md` — デプロイガイド
