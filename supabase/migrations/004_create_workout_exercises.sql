CREATE TABLE workout_exercises (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_id  UUID REFERENCES workouts(id)  ON DELETE CASCADE NOT NULL,
  exercise_id UUID REFERENCES exercises(id) NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_we_workout_id ON workout_exercises(workout_id);
