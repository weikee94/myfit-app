CREATE TYPE progression_strategy AS ENUM ('double_progression','linear','wave_loading','custom');

CREATE TABLE progression_rules (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_id           UUID REFERENCES exercises(id) NOT NULL,
  strategy              progression_strategy NOT NULL DEFAULT 'double_progression',
  rep_range_min         INTEGER  NOT NULL DEFAULT 8,
  rep_range_max         INTEGER  NOT NULL DEFAULT 12,
  target_sets           INTEGER  NOT NULL DEFAULT 3,
  rpe_threshold         NUMERIC(3,1) DEFAULT 8.0,
  weight_increment_kg   NUMERIC(4,2) DEFAULT 2.5,
  sessions_between_incr INTEGER  DEFAULT 1,
  current_weight_kg     NUMERIC(6,2),
  last_incremented_at   TIMESTAMPTZ,
  active                BOOLEAN  DEFAULT true,
  created_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at            TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, exercise_id)
);

CREATE INDEX idx_pr_user_id     ON progression_rules(user_id);
CREATE INDEX idx_pr_exercise_id ON progression_rules(exercise_id);
