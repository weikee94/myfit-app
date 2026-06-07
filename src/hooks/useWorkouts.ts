import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWorkouts, fetchWorkoutById, createWorkout, deleteWorkout,
         finalizeStrengthWorkout, fetchWeekWorkouts } from "@/api/workouts";
import type { WorkoutInsert } from "@/types/database";
import type { ActiveExercise } from "@/store/workoutSessionStore";

export function useWorkouts() {
  return useQuery({ queryKey: ["workouts"], queryFn: () => fetchWorkouts() });
}

export function useWorkout(id: string) {
  return useQuery({ queryKey: ["workouts", id], queryFn: () => fetchWorkoutById(id), enabled: !!id });
}

export function useWeekWorkouts() {
  return useQuery({ queryKey: ["workouts", "week"], queryFn: fetchWeekWorkouts });
}

export function useCreateWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (workout: WorkoutInsert) => createWorkout(workout),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });
}

export function useDeleteWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteWorkout(id),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });
}

export function useFinalizeStrengthWorkout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ workoutId, exercises }: { workoutId: string; exercises: ActiveExercise[] }) =>
      finalizeStrengthWorkout(workoutId, exercises),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["workouts"] }),
  });
}
