# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Niigata AI Academy LMS — a Learning Management System built with Next.js 15 App Router. Currently uses mock data (no backend/database). Japanese UI with English headings. Originally exported from Google AI Studio.

## Commands

- `npm run dev` — Start dev server on port 3000
- `npm run build` — Production build
- `npm run lint` — Run Next.js linting

No test framework is configured.

## Architecture

### Routing (App Router with Route Groups)

Two role-based sections (student, admin) using route groups to separate login pages from dashboard layouts:

- `/` and `/admin` — Login pages (no sidebar, use `components/LoginForm.tsx`)
- `/student/(panel)/*` — Student dashboard pages wrapped in `DashboardLayout` with student nav
- `/admin/(panel)/*` — Admin dashboard pages wrapped in `DashboardLayout` with admin nav
- `/student/lesson` — Lesson view, intentionally **outside** the `(panel)` group (has its own full-screen header, no sidebar)

The `(panel)` route groups apply `components/DashboardLayout.tsx` which provides the sidebar, topbar, and mobile bottom nav. The layout receives a `User` object to determine which navigation items to show.

### Styling

- Tailwind CSS v4 via `@tailwindcss/postcss`
- Design tokens defined in `app/globals.css` `@theme` block (Material Design 3-inspired color naming: `primary`, `on-surface`, `surface-low`, etc.)
- Custom utilities: `primary-gradient`, `glass-panel`, `hairline-t`, `hairline-b`, `hide-scrollbar`
- Fonts loaded via `next/font/google` in `app/layout.tsx`, exposed as CSS variables (`--font-inter`, `--font-noto-sans-jp`, `--font-plus-jakarta-sans`, `--font-noto-serif-jp`) and mapped to Tailwind tokens (`font-headline`, `font-body`, `font-serif`)

### Data Layer

All data is mock (`lib/mockData.ts`). Types in `lib/types.ts`. No API routes, no database. The `@google/genai` dependency is declared but not yet used.

### Path Alias

`@/*` maps to the project root (e.g., `@/lib/types`, `@/components/DashboardLayout`).
