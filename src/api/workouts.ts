import { supabase } from "@/lib/supabase";
import type { WorkoutRow, WorkoutInsert } from "@/types/database";
import type { WorkoutWithExercises } from "@/types/workout";
import type { ActiveExercise } from "@/store/workoutSessionStore";

export async function fetchWorkouts(limit = 50): Promise<WorkoutRow[]> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .order("date", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as WorkoutRow[];
}

export async function fetchWorkoutById(id: string): Promise<WorkoutWithExercises> {
  const { data, error } = await supabase
    .from("workouts")
    .select("*, workout_exercises(*, exercise:exercises(*), workout_sets(*))")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as unknown as WorkoutWithExercises;
}

export async function createWorkout(workout: WorkoutInsert): Promise<WorkoutRow> {
  const { data, error } = await supabase.from("workouts").insert(workout as object).select().single();
  if (error) throw error;
  return data as WorkoutRow;
}

export async function updateWorkout(id: string, update: Partial<WorkoutInsert>): Promise<WorkoutRow> {
  const { data, error } = await supabase.from("workouts").update(update as object).eq("id", id).select().single();
  if (error) throw error;
  return data as WorkoutRow;
}

export async function deleteWorkout(id: string): Promise<void> {
  const { error } = await supabase.from("workouts").delete().eq("id", id);
  if (error) throw error;
}

export async function finalizeStrengthWorkout(workoutId: string, exercises: ActiveExercise[]): Promise<void> {
  for (const ex of exercises) {
    const { data: we, error: weError } = await supabase
      .from("workout_exercises")
      .insert({ workout_id: workoutId, exercise_id: ex.exercise_id, order_index: ex.order_index } as object)
      .select()
      .single();
    if (weError) throw weError;

    const setsToInsert = ex.sets.map((s) => ({
      workout_exercise_id: (we as { id: string }).id,
      set_number:  s.set_number,
      actual_reps: s.actual_reps ?? null,
      weight_kg:   s.weight_kg   ?? null,
      rpe:         s.rpe         ?? null,
      rir:         s.rir         ?? null,
      completed:   s.completed,
    }));
    if (setsToInsert.length > 0) {
      const { error: setError } = await supabase.from("workout_sets").insert(setsToInsert as object[]);
      if (setError) throw setError;
    }
  }

  const { error } = await supabase
    .from("workouts")
    .update({ completed: true, completed_at: new Date().toISOString() } as object)
    .eq("id", workoutId);
  if (error) throw error;
}

export async function fetchLastSetsForExercise(exerciseId: string, userId: string) {
  const { data, error } = await supabase
    .from("workout_exercises")
    .select("workout_sets(*), workout:workouts!inner(id, date, user_id)")
    .eq("exercise_id", exerciseId)
    .eq("workout.user_id", userId)
    .order("workout.date", { ascending: false })
    .limit(1);
  if (error) throw error;
  const raw = data?.[0] as { workout_sets: { actual_reps: number | null; weight_kg: number | null; rpe: number | null; rir: number | null; completed: boolean; set_number: number }[] } | undefined;
  return raw?.workout_sets ?? [];
}

export async function fetchWeekWorkouts(): Promise<WorkoutRow[]> {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const { data, error } = await supabase
    .from("workouts")
    .select("*")
    .gte("date", weekAgo.toISOString().split("T")[0])
    .eq("completed", true)
    .order("date", { ascending: false });
  if (error) throw error;
  return data as WorkoutRow[];
}
