# MyFit - Development Context for Claude / AI Agents

## Project Overview
MyFit is a modern, triathlon-oriented strength & conditioning tracking app built with:
- React + TypeScript + Vite
- Tailwind + shadcn/ui (Radix primitives)
- Supabase (auth + Postgres)
- TanStack Query + Zustand (active workout session)
- Strong focus on real progressive overload for endurance athletes (swim/bike/run + strength)

Key strengths of MyFit (per user):
- **非常强的 progressive overload 逻辑和计算方式** (see `src/algorithms/progressiveOverload.ts`, `useProgression`, `ProgressionSuggestionCard`, progression rules table).
- Clean active workout UX with quick set logging, RPE/RIR, suggested weights.
- Exercise library + detail with triathlon-specific benefit explanations.
- Full workout history, dashboard analytics.

## Important References (as specified)

- **wger**：优秀的 Exercise Wiki、自动 progression 规则、完整训练日志系统。
  - https://github.com/wger-project/wger
  - Public demo: https://wger.de
  - Excellent structured exercise data, images, muscles, and built-in progression/periodization features. Can be self-hosted or used via API for inspiration / data seeding.

- **MyFit**：非常强的 progressive overload 逻辑和计算方式。
  - This project already excels here. Do not weaken the overload calculations when adding features.

- **Exercise Database**：
  - https://github.com/exercisedb/exercisedb-api (large, 11k+ exercises, rich media, videos/GIFs/images)
  - https://github.com/yuhonas/free-exercise-db (recommended for immediate use: **public domain**, 800+ exercises + photos, JSON dataset, browsable frontend at https://yuhonas.github.io/free-exercise-db/)
  - Note: free-exercise-db images are served via GitHub raw under `/exercises/{Exercise_Name}/0.jpg` and `/1.jpg` (public domain — safe for use). For production, copy the needed images locally into `public/exercises/` or Supabase Storage to avoid rate limits.

- **Other / UI Inspiration**：
  - workout.cool project — clean, visual, minimal workout UI. Use as inspiration for exercise cards, active session layout, prominent form visuals, fast interactions.

## Current Exercise Image Situation & How to Add Fitness Action Images

### Problem (as of now)
- All workouts / exercise lists lacked visible images showing the actual exercise.
- `src/data/exercisesSeed.ts` had `demo_url` pointing to dead `https://v2.exercisedb.io/image/...` endpoints → 404s.
- `ExerciseCard` (used in library + search modal + add-to-workout) was purely textual.
- `ActiveWorkoutPanel` (the core "doing a workout" screen) showed only exercise name + set table. No form reference while training.
- `ExerciseDetailPage` already used `ExerciseDemo` correctly (good).

`ExerciseRow` / DB already supports `demo_url` + `demo_type` ("gif" | "image" | "youtube").

### Recommended Image Strategy (think-through + decisions)

1. **Primary source going forward**: yuhonas/free-exercise-db (public domain + images ready to use).
   - Stable raw URLs: `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/{Dir_Name}/0.jpg`
   - Two images per exercise (usually different angles or start/end position) — great for static form reference.
   - For motion: consider supplementing later with open-tier GIFs from exercisedb free dataset or wger when available.

2. **Self-hosting for production** (strongly recommended):
   - Add a small script (e.g. `scripts/sync-exercise-images.ts`) that downloads only the images for the exercises you actually use.
   - Store in `public/exercises/<slug>/0.jpg` (or Supabase public bucket).
   - Update `demo_url` to relative `/exercises/...` paths.
   - This makes the app fully offline-capable for demos and removes external dependencies / rate limits.

3. **Alternative / richer sources**:
   - wger: richer wiki-style descriptions + official images + muscles. Good for future "exercise browser" expansion or seeding more triathlon-relevant moves.
   - exercisedb open source tier: better GIFs/animations for teaching form (motion is superior for learning exercises).

4. **UI placement priorities** (implemented):
   - **ExerciseCard** (library list + search modal): small thumbnail on the left (or top in non-compact). Makes browsing and picking during workout fast and visual.
   - **ActiveWorkoutPanel** (during live strength session): small square thumbnail in the exercise card header. User can see the movement while logging sets — critical for form.
   - **ExerciseDetailPage**: already good (large demo + instructions + progression).
   - Future: hover/click thumbnail in active panel could open a quick demo modal without leaving the session.

5. **Fallbacks & resilience**:
   - Always provide nice degraded state (lucide icon + muscle group badges + first letter).
   - `onError` hide broken images.
   - Support both static image and GIF via the existing `ExerciseDemo` component.

6. **Data model notes**:
   - Keep using `demo_url` + `demo_type`.
   - Consider adding optional `thumbnail_url` (smaller optimized) in future if you have multiple sizes.
   - When importing from free-exercise-db or wger, map `name`, `muscle_groups` (primary + secondary), `equipment`, `instructions`, and pick the best image.

7. **workout.cool inspiration applied**:
   - Prominent but not overwhelming visuals.
   - Clear hierarchy in active view (exercise visual > name > controls).
   - Fast, low-friction adding and logging.

### How the images were added in this update
- Updated seed data with working public-domain image URLs from free-exercise-db where good matches exist (Dead Bug, Hip Thrust, Squat, Shoulder Press, Lat Pulldown variants, etc.).
- Enhanced `ExerciseCard.tsx` with thumbnail support.
- Enhanced `ActiveWorkoutPanel.tsx` to render exercise visuals during the workout.
- `ExerciseDemo` and detail page continue to work unchanged.
- All images gracefully fall back.

### Future work ideas (from the references)
- Pull full exercise catalog + auto-generated progression rules from wger patterns.
- One-click "import from wger routine".
- Better GIF support for teaching (motion > static).
- Muscle diagram + form cues overlay on images (inspired by high-quality DBs).

## Other Notes
- Do not regress the progressive overload engine — it is a core differentiator.
- Keep triathlon-specific benefit text when editing exercises.
- Seed is intentionally small and focused (20 key moves for triathletes). Expand carefully using the DB references above.
- Test both library browsing and live active workout flows when touching exercise visuals.

Happy building 💪
