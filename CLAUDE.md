# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Run Commands

```bash
# Development
npm run dev                         # Vite HMR at http://localhost:5173

# Production build
npm run build                       # vite build + tsc 类型检查 → dist/
```

> 2026-10-14 移除了 Electron 桌面壳（electron/、electron-builder、sql.js 等），现在只保留浏览器模式。如需恢复桌面版，见 git 历史里的初始提交。

## zhixing-heyi/ (知行合一 PWA — separate sub-project)

A standalone phone PWA in `zhixing-heyi/` (own package.json and its own git repo at github.com/sun-10355/zhixing-heyi, don't mix with the main build): React 18 + Vite 5 + Tailwind 3, **no backend**, data in localStorage (`zhixing_data_v1`). Jobs: custom habit check-ins (add/remove/icon/color/frequency 1-7 d/wk/order, migrated ids `readEn|readScript|meditate|nap|diet|sport`), streak + 30-day completion-rate card, never-miss-twice recovery, make-up check-in (last 7 days), records page with week view + GitHub-style year heatmap (vermilion outline = hangover day) + per-week review notes, JSON/CSV export-import backup, Sunday weekly planning + risk-day pre-marking, hangover-day interception (armed → 8am binary choice → recovery plan with 回笼觉 countdown + 3 task buckets + 欧路 5min-word backstop). v0.2 shipped 2026-09-27. Requirements doc: `plans/止损app-需求说明.md`. Run: `cd zhixing-heyi && npm run dev`. Deployed on Cloudflare Pages at **https://zhixing-heyi.pages.dev** (with hyphen — verified 2026-09-10; note `zhixingheyi.pages.dev` without hyphen is an UNRELATED company's site, do not use). DNS record takes a few minutes to appear after project creation. Update flow: `npm run build` then re-upload `dist/` via Pages web UI (existing project → 创建新部署 → 上传资产; do NOT create a new project — that would change the URL). Known limits: no push backend (no scheduled 8am notification while browser is closed — interception fires when the app is opened); no home-screen widget (PWAs on Android don't support it).

## Architecture Overview

This is a **React + TypeScript** Pomodoro timer running in the browser. Data lives in localStorage — there is no server and no desktop shell.

```
┌─ Browser (Vite dev server / static page) ──────────────────────┐
│  React Renderer (src/)                                          │
│  HashRouter · Zustand stores · Tailwind CSS                     │
└──────────────┬──────────────────────────────────────────────────┘
               │ db 模块 (src/db/database.ts) — 所有组件用同一个 db 对象
┌──────────────▼──────────────────────────────────────────────────┐
│  localStorage (browserDB.ts, key 'pomodoro_data')               │
└─────────────────────────────────────────────────────────────────┘
```

### Database Abstraction (`src/db/database.ts`)

The `db` export resolves to `browserDB.ts` (localStorage key `'pomodoro_data'`). The file still contains a legacy Electron branch (checks for `window.api`), which is dead code now — `window.api` no longer exists.

**Tables:** `sessions` (timer history), `tasks` (todo items), `settings` (key-value).

### Timer State Machine

The timer core lives in `src/hooks/useTimer.ts`. States: `idle → running → paused` or `idle → running → finished`. On finish:
1. Records session to DB
2. Fires notification + alarm sound
3. Auto-transitions to next phase (work→break→work) per settings
4. Handles the long-break-every-N-pomodoros rule

Settings flow: `useTimer` reads `useSettingsStore` for durations and auto-start preferences.

### Build Pipeline

- **Renderer**: Vite compiles `src/` → `dist/` (relative base path `./` so the app can be served from any static host). `tsc` (renderer `tsconfig.json`, `noEmit`) runs as a type check in `npm run build`.

### Theming

Colors are defined as both Tailwind tokens and CSS custom properties on `:root` (in `tailwind.config.js` and `src/index.css`). Components use `var(--color-*)` for inline styles and Tailwind classes for everything else. The palette: `espresso` (near-black bg), `caramel` (dark brown surfaces), `terracotta` (red-orange accent), `crema` (off-white text), `oliva` (green accent), `latte` (muted text).

## Known Gaps

- **Task pomodoro counter**: When a work session finishes, the associated task's `completed_pomodoros` is NOT incremented. The comment in `useTimer.ts` notes this is planned but not implemented.
- **browserDB `getRange`**: Ignores date range and returns all sessions — affects `StatsExport.tsx` (exporting a date range exports everything).
- **Circular dependency workaround**: `settingsStore.ts` uses `await import('@/db/database')` (dynamic import) to avoid a circular dependency with `database.ts` which imports `browserDB.ts`.

## 教学原则（AI 时代 · /teach skill）

本项目同时是教学场所：`.teach/` 是教学工作区，`/teach` skill 本体在 `.agents/skills/teach/SKILL.md`（经 `.claude/skills/teach` 注册）。用户信奉 AI 时代原则：**what（概念）与 why（判断）要教深，how（执行/语法）交给 AI**。执行时：

- 教概念地图（名词/心智模型）与判断取舍，不练命令、语法的肌肉记忆
- how 只教两件事：如何指挥 AI 执行（提示词配方）、如何验证 AI 输出（读报错、判对错、纠错）
- 三种练习：识别（场景→概念）、决策（目标→方案+理由）、验证（AI 输出→判断）
- 每课结尾布置「学生指挥 AI 完成任务 + 学生验收」
- 方法论迭代史见 `.teach/NOTES.md`（v1 自测题 → v2 对话练习 → v3 本原则）
