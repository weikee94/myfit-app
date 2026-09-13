# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Light / Dark / System theme switcher (`ThemeToggle`) in the top bar and on the login page, persisted to `localStorage` via a Zustand `themeStore`.
- Inline pre-paint script in `index.html` that applies the stored theme before first render, avoiding a flash of the wrong mode; `theme-color` meta follows the active theme.
- `--swim`, `--bike`, `--run`, `--strength` CSS variables with separate light and dark values.

### Changed
- App no longer forces dark mode; it follows the system preference by default.
- Sport colors (`swim`/`bike`/`run`/`strength`) are now theme-aware Tailwind tokens; hardcoded hex classes in badges, workout type selector, week summary card and new workout page replaced with the tokens.
- Light palette tuned for contrast (background, foreground, muted, destructive).
- Recharts grid and axis colors in `TrainingLoadChart` and `OverloadHistoryChart` now use `currentColor`, so they update on theme change.
