# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Tappable exercises on the Strength week pages and the Ben page: each exercise opens a bottom sheet with a "YouTube 示范" search button, and — where a visually checked free-exercise-db (public domain) match exists — alternating start/end photos plus the database's English instructions. Replaced exercises open the replacement, with a link to the Runna original. Photos are self-hosted in `public/exercises/`; mapping in `src/data/exerciseDemos.ts`.
- Runna main running plan (12/6 BYD Marathon, in progress) on the Plan page's Runs tab: a "today" card from the phone's date (run, pace, strength session, ★ gate / 🍫 fueling / ⛰ no-hill notes), header with paces and three disciplines, weekly mileage chart (W1–W4 actual vs planned, cutback and peak weeks, long-run line), W1–W17 day-by-day schedule with the current week open and overlays attached to their days (suggested W13–W16 long-run changes shown as original → suggestion), and collapsible reference sections (two numbers, W1–W4 readings, risk, gates, fueling, no-hill alternatives, race week, adjustments, footnote). Data in `src/data/plans/runnaMain.ts`.
- Installable web app: `manifest.webmanifest`, app icons (`apple-touch-icon.png`, 192/512 and maskable PNGs, 32px favicon) and iOS home-screen meta tags, so "Add to Home Screen" opens MyFit full-screen with its own icon. No service worker / offline mode.
- Ben's two follow-along workouts at `/plan/ben` (entry card on the Strength tab): strength circuit (original with video timestamps, the two required changes, modified 3-round version) and core workout (24 moves in 4 groups with keep/core/optional/skip status, reasons, 16-move follow-along version), plus when-to-use table and fatigue notes. Timestamps become links to the video once `videoUrl` is filled in `src/data/plans/benWorkouts.ts`.
- Hansons 18-week running schedule (2026 Tokyo Marathon, original dates) on a new "Runs" tab of `/plan`: collapsible W1–W18 with each day's workout type, workout and distance, weekly mileage, and a pace row that follows the goal chosen on the Paces tab. Two sheet values that don't add up (W13 Tuesday, W18 Saturday) are kept as-is with a ⚠ note. The strength tab is renamed from "Weeks" to "Strength". Data in `src/data/plans/hansonsSchedule.ts`.
- Hansons plan notes on the Paces tab: 课表重点 (speed / easy / long / tempo run guidance), 术语解说 (workout notation such as WU, CD, MP-10) and 训练日调换原则 (rules for swapping training days). Data in `src/data/plans/hansonsNotes.ts`.
- Hansons marathon pace chart on a new "Paces" tab of `/plan`: pick a marathon goal (remembered per browser, default 4:00) to see its recovery/easy/long/tempo/strength paces, race paces, predicted PBs and interval rep times, plus the full 26-goal table with the chosen row highlighted. Data in `src/data/plans/hansonsPaces.ts`.
- Runna marathon strength plan viewer: `/plan` lists W1–W17 (W7–W17 as placeholders) plus a Rules tab with the replacement rules, push:pull table and the exercises to keep; `/plan/:week` shows each session's supersets with original → replacement and the reasoning. Content is a static data file (`src/data/plans/runnaMarathon.ts`); new "Plan" tab in the bottom nav.
- Light / Dark / System theme switcher (`ThemeToggle`) in the top bar and on the login page, persisted to `localStorage` via a Zustand `themeStore`.
- Inline pre-paint script in `index.html` that applies the stored theme before first render, avoiding a flash of the wrong mode; `theme-color` meta follows the active theme.
- `--swim`, `--bike`, `--run`, `--strength` CSS variables with separate light and dark values.

### Changed
- App no longer forces dark mode; it follows the system preference by default.
- Sport colors (`swim`/`bike`/`run`/`strength`) are now theme-aware Tailwind tokens; hardcoded hex classes in badges, workout type selector, week summary card and new workout page replaced with the tokens.
- Light palette tuned for contrast (background, foreground, muted, destructive).
- Recharts grid and axis colors in `TrainingLoadChart` and `OverloadHistoryChart` now use `currentColor`, so they update on theme change.
- Desktop navigation in the top bar (icons from `md`, labels from `lg`); nav items shared with the mobile bottom nav via `navItems.ts`.

- Mobile-first layout tuned for iPhone 13 Pro (390×844): top bar, bottom nav and page padding respect the notch and home indicator (`viewport-fit=cover` + safe-area insets); buttons, back buttons, tabs, filter chips and the dialog close button have 44px touch targets on mobile; inputs and selects use 16px text on mobile (no zoom on focus) and the `maximum-scale` zoom lock is removed; tap feedback via `active:` styles and `hoverOnlyWhenSupported`. Desktop sizes unchanged.
- Theme toggle on mobile is a single 44px button that cycles light → dark → system (desktop keeps the three-button control).
- Plan pages: explanation text raised from 12px to 14px, the Runna heading now shows only on the Strength tab, and week titles wrap to two lines instead of being cut off.
- Active workout session is stored in `localStorage` instead of `sessionStorage`, so it survives iOS closing the home-screen app.

- The Hansons 2026 Tokyo schedule moved from the Runs tab to a reference page at `/plan/hansons`, linked from the bottom of the Runs tab.

### Fixed
- Missing favicon (`/favicon.ico` was referenced but never existed).
- Refreshing any page other than `/` on Vercel returned 404: added `vercel.json` rewriting all paths to `index.html` so client-side routes load on reload and direct links.
