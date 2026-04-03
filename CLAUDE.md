# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Niigata AI Academy LMS — モノレポ構成の学習管理システム。フロントエンドは Next.js 15 App Router、バックエンドは Laravel 13 + MySQL 8.0（Docker）。日本語UIに英語ヘッディングを混在させるエディトリアルデザイン。

## Repository Structure

```
/frontend   → Next.js 15 フロントエンド
/backend    → Laravel 13 バックエンド API
/docs       → 設計ドキュメント（database-schema.md 等）
```

## Commands

### Frontend (frontend/)
- `npm run dev` — 開発サーバー起動（ポート3000）
- `npm run build` — 本番ビルド（型チェック含む）

### Backend (backend/)
- `docker compose up -d` — Docker 環境起動（MySQL + Laravel）
- `docker compose exec app php artisan migrate` — マイグレーション実行
- `docker compose exec app php artisan db:seed` — シーダー実行
- `docker compose exec app php artisan test` — テスト実行

テストフレームワーク: バックエンドは PHPUnit。フロントエンドは未設定。ESLint も未設定（Next.js 16 で `next lint` 廃止のため）。

## Frontend Architecture

### Routing (App Router + Route Groups)

```
/              → 受講者ログイン (LoginForm)
/admin         → 管理者ログイン (LoginForm isAdmin)
/student/(panel)/* → DashboardLayout 適用（サイドバー＋ナビ）
/admin/(panel)/*   → DashboardLayout 適用（管理者ナビ）
/student/lesson    → (panel)の外。全画面レイアウト、サイドバーなし
/student/lesson/quiz → 理解度チェック専用ページ
```

`(panel)` route group が `DashboardLayout` を適用。ナビ設定は `lib/navigation.ts` に外出し。

### Data Layer

```
lib/types.ts     → 型定義（User, Course, Student, Enrollment, SubmissionDetail, etc.）
lib/api.ts       → サーバーサイドデータ取得（fetchData 経由）
lib/apiClient.ts → 認証トークン管理・API fetch ラッパー
lib/config.ts    → BACKEND_URL 環境変数
```

ページからは `lib/api.ts` 経由でデータ取得。クライアントコンポーネントは `/api/*` プロキシルート経由で fetch。

### Components

```
DashboardLayout.tsx     → サイドバー + トップバー + モバイルナビ + アバターメニュー ('use client')
LoginForm.tsx           → ログインフォーム ('use client')
KPICard.tsx             → KPI カード（Server Component）
ProgressBar.tsx         → プログレスバー（Server Component）
AdminCourseTable.tsx    → コース管理テーブル（フィルタ・ページネーション付き）
AdminUserTable.tsx      → 受講者管理テーブル（検索・ページネーション付き）
CourseEnrollments.tsx   → 受講生登録管理（追加/削除モーダル付き）
CourseStatusBadge.tsx   → コースステータスバッジ
CourseRowActions.tsx    → コーステーブルの操作ボタン
```

### Server / Client Component 方針

- ページは原則 Server Component（metadata export 可能）
- `'use client'` は状態が必要なコンポーネントのみ（テーブル、フォーム、レッスンビューア等）
- クライアントコンポーネントからのAPI呼び出しは `/api/*` プロキシルート経由（`frontend/app/api/`）

### Styling

- Tailwind CSS v4（`@tailwindcss/postcss`）
- デザイントークン: `app/globals.css` の `@theme` ブロック（MD3 準拠）
- カスタムユーティリティ: `primary-gradient`, `glass-panel`, `hairline-t`, `hairline-b`, `hide-scrollbar`
- フォント: `next/font/google` → CSS変数 → Tailwind トークン（`font-headline`, `font-body`, `font-serif`）
- 画像: `next/image` 使用。外部画像は `next.config.ts` の `remotePatterns` で許可（placehold.co, localhost:8000, api.stage-site.net）

### Path Alias

`@/*` → フロントエンドルート（例: `@/lib/types`, `@/components/KPICard`）

## Backend Architecture

### API

- RESTful JSON API（`/api/v1/` プレフィックス）
- Laravel API Resource で DTO 変換（DB → フロントエンド型）
- 認証: Laravel Sanctum（トークンベース）
- CORS: `config/cors.php`（`CORS_ALLOWED_ORIGINS` 環境変数で制御）
- ファイルアップロード: public disk（`storage/app/public/`）→ `php artisan storage:link` で公開

### Database

- MySQL 8.0（Docker コンテナ）
- 設計書: `frontend/docs/database-schema.md`
- 16テーブル構成（users, courses, chapters, lessons, enrollments 等）

## TODO

未実装機能の一覧は `frontend/docs/TODO.md` で管理。機能を実装完了したら `[x]` に変更し日付を記載すること。新たな未実装項目が見つかった場合も追記する。

## Conventions

- 新しい型は `lib/types.ts` に定義 → `lib/api.ts` に取得関数を追加
- ナビ項目追加時は `lib/navigation.ts` を編集
- アイコンのみのボタンには `aria-label` を付与
- モバイルでタッチ不可の `hover:opacity` パターンは使わない（`opacity-100 lg:opacity-0 lg:group-hover:opacity-100` で対応）
- 機能追加・データモデル変更時は `frontend/docs/database-schema.md` も必ず更新する（テーブル定義、ER図、クエリパターン、フロントエンド型対応表）
