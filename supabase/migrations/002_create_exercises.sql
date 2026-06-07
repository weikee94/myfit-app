CREATE TYPE exercise_category AS ENUM ('swim', 'bike', 'run', 'strength');
CREATE TYPE equipment_type    AS ENUM ('barbell','dumbbell','cable','machine','bodyweight','bands','kettlebell','none');
CREATE TYPE demo_type         AS ENUM ('youtube','gif','image');

CREATE TABLE exercises (
  id                UUID    DEFAULT gen_random_uuid() PRIMARY KEY,
  name              TEXT    NOT NULL,
  category          exercise_category NOT NULL,
  muscle_groups     TEXT[]  NOT NULL DEFAULT '{}',
  equipment         equipment_type,
  triathlon_benefit TEXT,
  instructions      TEXT,
  demo_url          TEXT,
  demo_type         demo_type DEFAULT 'gif',
  is_public         BOOLEAN DEFAULT true,
  created_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_exercises_category  ON exercises(category);
CREATE INDEX idx_exercises_is_public ON exercises(is_public);
