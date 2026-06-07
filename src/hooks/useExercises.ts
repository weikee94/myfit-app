import { useQuery } from "@tanstack/react-query";
import { fetchExercises, fetchExerciseById } from "@/api/exercises";
import type { ExerciseCategory } from "@/types/exercise";

export function useExercises(category?: ExerciseCategory) {
  return useQuery({
    queryKey: ["exercises", category ?? "all"],
    queryFn:  () => fetchExercises(category),
  });
}

export function useExercise(id: string) {
  return useQuery({
    queryKey: ["exercises", id],
    queryFn:  () => fetchExerciseById(id),
    enabled:  !!id,
  });
}
