# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Niigata AI Academy LMS — Next.js 15 App Router の学習管理システム。バックエンドは Laravel で実装予定。現在は `lib/mockData.ts` のダミーデータで動作。日本語UIに英語ヘッディングを混在させるエディトリアルデザイン。

## Commands

- `npm run dev` — 開発サーバー起動（ポート3000）
- `npm run build` — 本番ビルド（型チェック含む）

テストフレームワークは未設定。ESLint も未設定（Next.js 16 で `next lint` 廃止のため）。

## Architecture

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
lib/types.ts    → 型定義（User, Course, Student, etc.）
lib/mockData.ts → ダミーデータ（全て型付き）
lib/api.ts      → データ取得抽象化レイヤー（Laravel 移行時はここだけ変更）
```

ページからは `lib/api.ts` 経由でデータ取得。`mockData.ts` を直接 import しない。

### Components

```
DashboardLayout.tsx → サイドバー + トップバー + モバイルナビ + アバターメニュー ('use client')
LoginForm.tsx       → ログインフォーム ('use client')
KPICard.tsx         → KPI カード（Server Component）
ProgressBar.tsx     → プログレスバー（Server Component）
```

### Server / Client Component 方針

- ページは原則 Server Component（metadata export 可能）
- `'use client'` は状態が必要なページのみ: `admin/users`（検索）、`student/lesson`（プレイリスト開閉）、`student/lesson/quiz`（回答管理）

### Styling

- Tailwind CSS v4（`@tailwindcss/postcss`）
- デザイントークン: `app/globals.css` の `@theme` ブロック（MD3 準拠）
- カスタムユーティリティ: `primary-gradient`, `glass-panel`, `hairline-t`, `hairline-b`, `hide-scrollbar`
- フォント: `next/font/google` → CSS変数 → Tailwind トークン（`font-headline`, `font-body`, `font-serif`）
- 画像: `next/image` 使用。外部画像（placehold.co）は `next.config.ts` の `remotePatterns` + `dangerouslyAllowSVG` で許可

### Path Alias

`@/*` → プロジェクトルート（例: `@/lib/types`, `@/components/KPICard`）

## Conventions

- ダミーデータ追加時は `lib/types.ts` に型定義 → `lib/mockData.ts` にデータ → `lib/api.ts` に取得関数
- ナビ項目追加時は `lib/navigation.ts` を編集
- アイコンのみのボタンには `aria-label` を付与
- モバイルでタッチ不可の `hover:opacity` パターンは使わない（`opacity-100 lg:opacity-0 lg:group-hover:opacity-100` で対応）
