CREATE TABLE workout_sets (
  id                   UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_exercise_id  UUID REFERENCES workout_exercises(id) ON DELETE CASCADE NOT NULL,
  set_number           INTEGER NOT NULL,
  target_reps          INTEGER,
  actual_reps          INTEGER,
  weight_kg            NUMERIC(6,2),
  rpe                  NUMERIC(3,1) CHECK (rpe  BETWEEN 1 AND 10),
  rir                  INTEGER      CHECK (rir  BETWEEN 0 AND 10),
  completed            BOOLEAN DEFAULT false,
  rest_seconds         INTEGER,
  created_at           TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_ws_workout_exercise_id ON workout_sets(workout_exercise_id);
