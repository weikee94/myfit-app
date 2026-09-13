# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
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

### Fixed
- Refreshing any page other than `/` on Vercel returned 404: added `vercel.json` rewriting all paths to `index.html` so client-side routes load on reload and direct links.
