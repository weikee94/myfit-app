export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ── Row types ────────────────────────────────────────────────────────────────

export interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  ftp_watts: number | null;
  css_sec_100m: number | null;
  lthr: number | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseRow {
  id: string;
  name: string;
  category: "swim" | "bike" | "run" | "strength";
  muscle_groups: string[];
  equipment: string | null;
  triathlon_benefit: string | null;
  instructions: string | null;
  demo_url: string | null;
  demo_type: "youtube" | "gif" | "image" | null;
  is_public: boolean;
  created_by: string | null;
  created_at: string;
}

export interface WorkoutRow {
  id: string;
  user_id: string;
  type: "swim" | "bike" | "run" | "strength";
  name: string | null;
  date: string;
  duration_minutes: number | null;
  distance_km: number | null;
  avg_heart_rate: number | null;
  avg_pace_sec_per_km: number | null;
  avg_power_watts: number | null;
  session_rpe: number | null;
  notes: string | null;
  completed: boolean;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExerciseRow {
  id: string;
  workout_id: string;
  exercise_id: string;
  order_index: number;
  notes: string | null;
  created_at: string;
}

export interface WorkoutSetRow {
  id: string;
  workout_exercise_id: string;
  set_number: number;
  target_reps: number | null;
  actual_reps: number | null;
  weight_kg: number | null;
  rpe: number | null;
  rir: number | null;
  completed: boolean;
  rest_seconds: number | null;
  created_at: string;
}

export interface ProgressionRuleRow {
  id: string;
  user_id: string;
  exercise_id: string;
  strategy: "double_progression" | "linear" | "wave_loading" | "custom";
  rep_range_min: number;
  rep_range_max: number;
  target_sets: number;
  rpe_threshold: number;
  weight_increment_kg: number;
  sessions_between_incr: number;
  current_weight_kg: number | null;
  last_incremented_at: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

// ── Insert types (nullable = optional) ───────────────────────────────────────

export interface ProfileInsert {
  id: string;
  email: string;
  full_name?: string | null;
  avatar_url?: string | null;
  weight_kg?: number | null;
  height_cm?: number | null;
  ftp_watts?: number | null;
  css_sec_100m?: number | null;
  lthr?: number | null;
}

export interface ExerciseInsert {
  name: string;
  category: "swim" | "bike" | "run" | "strength";
  muscle_groups?: string[];
  equipment?: string | null;
  triathlon_benefit?: string | null;
  instructions?: string | null;
  demo_url?: string | null;
  demo_type?: "youtube" | "gif" | "image" | null;
  is_public?: boolean;
  created_by?: string | null;
}

export interface WorkoutInsert {
  user_id: string;
  type: "swim" | "bike" | "run" | "strength";
  date: string;
  name?: string | null;
  duration_minutes?: number | null;
  distance_km?: number | null;
  avg_heart_rate?: number | null;
  avg_pace_sec_per_km?: number | null;
  avg_power_watts?: number | null;
  session_rpe?: number | null;
  notes?: string | null;
  completed?: boolean;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface WorkoutExerciseInsert {
  workout_id: string;
  exercise_id: string;
  order_index?: number;
  notes?: string | null;
}

export interface WorkoutSetInsert {
  workout_exercise_id: string;
  set_number: number;
  target_reps?: number | null;
  actual_reps?: number | null;
  weight_kg?: number | null;
  rpe?: number | null;
  rir?: number | null;
  completed?: boolean;
  rest_seconds?: number | null;
}

export interface ProgressionRuleInsert {
  user_id: string;
  exercise_id: string;
  strategy?: "double_progression" | "linear" | "wave_loading" | "custom";
  rep_range_min?: number;
  rep_range_max?: number;
  target_sets?: number;
  rpe_threshold?: number;
  weight_increment_kg?: number;
  sessions_between_incr?: number;
  current_weight_kg?: number | null;
  last_incremented_at?: string | null;
  active?: boolean;
}

// ── Supabase Database type ────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: ProfileInsert;
        Update: Partial<ProfileInsert>;
      };
      exercises: {
        Row: ExerciseRow;
        Insert: ExerciseInsert;
        Update: Partial<ExerciseInsert>;
      };
      workouts: {
        Row: WorkoutRow;
        Insert: WorkoutInsert;
        Update: Partial<WorkoutInsert>;
      };
      workout_exercises: {
        Row: WorkoutExerciseRow;
        Insert: WorkoutExerciseInsert;
        Update: Partial<WorkoutExerciseInsert>;
      };
      workout_sets: {
        Row: WorkoutSetRow;
        Insert: WorkoutSetInsert;
        Update: Partial<WorkoutSetInsert>;
      };
      progression_rules: {
        Row: ProgressionRuleRow;
        Insert: ProgressionRuleInsert;
        Update: Partial<ProgressionRuleInsert>;
      };
    };
  };
}
