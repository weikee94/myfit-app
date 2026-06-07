import type { WorkoutRow, WorkoutInsert, WorkoutExerciseRow, WorkoutSetRow, ExerciseRow } from "./database";

export type WorkoutType      = "swim" | "bike" | "run" | "strength";
export type Workout          = WorkoutRow;
export type { WorkoutInsert };
export type WorkoutExercise  = WorkoutExerciseRow;
export type WorkoutSet       = WorkoutSetRow;

export interface WorkoutWithExercises extends WorkoutRow {
  workout_exercises: Array<
    WorkoutExerciseRow & {
      exercise: ExerciseRow;
      workout_sets: WorkoutSetRow[];
    }
  >;
}

export interface WeekSummary {
  swimMinutes:      number;
  bikeMinutes:      number;
  runMinutes:       number;
  strengthSessions: number;
  totalSessions:    number;
}
