import { supabase } from "@/lib/supabase";
import type { ExerciseRow, ExerciseInsert } from "@/types/database";
import type { ExerciseCategory } from "@/types/exercise";

// Supabase caps responses at 1000 rows by default, and the library holds more than that.
const PAGE_SIZE = 1000;

export async function fetchExercises(category?: ExerciseCategory): Promise<ExerciseRow[]> {
  const rows: ExerciseRow[] = [];
  for (let from = 0; ; from += PAGE_SIZE) {
    let query = supabase.from("exercises").select("*").order("name").order("id").range(from, from + PAGE_SIZE - 1);
    if (category) query = query.eq("category", category);
    const { data, error } = await query;
    if (error) throw error;
    rows.push(...(data as ExerciseRow[]));
    if (data.length < PAGE_SIZE) return rows;
  }
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
