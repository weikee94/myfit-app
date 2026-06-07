-- Enable RLS on all tables
ALTER TABLE profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts          ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_sets      ENABLE ROW LEVEL SECURITY;
ALTER TABLE progression_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises         ENABLE ROW LEVEL SECURITY;

-- ── profiles: users can only access their own row ──────────────────────────
CREATE POLICY "profiles: own row" ON profiles
  FOR ALL USING (auth.uid() = id);

-- ── exercises: public exercises are readable; users CRUD their own ─────────
CREATE POLICY "exercises: read public or own" ON exercises
  FOR SELECT USING (is_public = true OR auth.uid() = created_by);

CREATE POLICY "exercises: insert own" ON exercises
  FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "exercises: modify own" ON exercises
  FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "exercises: delete own" ON exercises
  FOR DELETE USING (auth.uid() = created_by);

-- ── workouts: users own their workouts ────────────────────────────────────
CREATE POLICY "workouts: own rows" ON workouts
  FOR ALL
  USING    (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── workout_exercises: access via parent workout ownership ─────────────────
CREATE POLICY "workout_exercises: through workout" ON workout_exercises
  FOR ALL
  USING (
    EXISTS (SELECT 1 FROM workouts w WHERE w.id = workout_id AND w.user_id = auth.uid())
  )
  WITH CHECK (
    EXISTS (SELECT 1 FROM workouts w WHERE w.id = workout_id AND w.user_id = auth.uid())
  );

-- ── workout_sets: two-level join to workouts ───────────────────────────────
CREATE POLICY "workout_sets: through workout" ON workout_sets
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workout_exercises we
      JOIN workouts w ON w.id = we.workout_id
      WHERE we.id = workout_exercise_id AND w.user_id = auth.uid()
    )
  );

-- ── progression_rules: users own their rules ──────────────────────────────
CREATE POLICY "progression_rules: own rows" ON progression_rules
  FOR ALL
  USING    (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
