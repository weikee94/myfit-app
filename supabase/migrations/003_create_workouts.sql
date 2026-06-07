CREATE TYPE workout_type AS ENUM ('swim', 'bike', 'run', 'strength');

CREATE TABLE workouts (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type                workout_type NOT NULL,
  name                TEXT,
  date                DATE NOT NULL DEFAULT CURRENT_DATE,
  duration_minutes    INTEGER,
  distance_km         NUMERIC(7,2),
  avg_heart_rate      INTEGER,
  avg_pace_sec_per_km INTEGER,
  avg_power_watts     INTEGER,
  session_rpe         INTEGER CHECK (session_rpe BETWEEN 1 AND 10),
  notes               TEXT,
  completed           BOOLEAN DEFAULT false,
  started_at          TIMESTAMPTZ,
  completed_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_workouts_user_id ON workouts(user_id);
CREATE INDEX idx_workouts_date    ON workouts(date DESC);
CREATE INDEX idx_workouts_type    ON workouts(type);
