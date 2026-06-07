import { supabase } from "@/lib/supabase";
import type { ExerciseRow, ExerciseInsert } from "@/types/database";
import type { ExerciseCategory } from "@/types/exercise";

export async function fetchExercises(category?: ExerciseCategory): Promise<ExerciseRow[]> {
  let query = supabase.from("exercises").select("*").order("name");
  if (category) query = query.eq("category", category);
  const { data, error } = await query;
  if (error) throw error;
  return data as ExerciseRow[];
}

export async function fetchExerciseById(id: string): Promise<ExerciseRow> {
  const { data, error } = await supabase.from("exercises").select("*").eq("id", id).single();
  if (error) throw error;
  return data as ExerciseRow;
}

export async function createExercise(exercise: ExerciseInsert): Promise<ExerciseRow> {
  const { data, error } = await supabase.from("exercises").insert(exercise as object).select().single();
  if (error) throw error;
  return data as ExerciseRow;
}
