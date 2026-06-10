import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { WorkoutType } from "@/types/workout";

export interface ActiveSet {
  set_number: number;
  target_reps?: number;
  actual_reps?: number;
  weight_kg?: number;
  rpe?: number;
  rir?: number;
  completed: boolean;
}

export interface ActiveExercise {
  exercise_id: string;
  exercise_name: string;
  demo_url?: string | null;
  demo_type?: "youtube" | "gif" | "image" | null;
  order_index: number;
  sets: ActiveSet[];
}

interface WorkoutSessionState {
  workoutId: string | null;
  workoutType: WorkoutType | null;
  startedAt: string | null;
  exercises: ActiveExercise[];
  isActive: boolean;

  startSession: (workoutId: string, type: WorkoutType) => void;
  addExercise: (exercise: { id: string; name: string; demo_url?: string | null; demo_type?: "youtube" | "gif" | "image" | null }) => void;
  removeExercise: (exerciseId: string) => void;
  addSet: (exerciseId: string) => void;
  updateSet: (exerciseId: string, setNumber: number, data: Partial<ActiveSet>) => void;
  completeSet: (exerciseId: string, setNumber: number) => void;
  clearSession: () => void;
}

export const useWorkoutSession = create<WorkoutSessionState>()(
  persist(
    (set, get) => ({
      workoutId:   null,
      workoutType: null,
      startedAt:   null,
      exercises:   [],
      isActive:    false,

      startSession: (workoutId, type) =>
        set({ workoutId, workoutType: type, startedAt: new Date().toISOString(), exercises: [], isActive: true }),

      addExercise: (exercise) => {
        const exercises = get().exercises;
        set({
          exercises: [
            ...exercises,
            {
              exercise_id:   exercise.id,
              exercise_name: exercise.name,
              demo_url:      exercise.demo_url ?? null,
              demo_type:     exercise.demo_type ?? null,
              order_index:   exercises.length,
              sets:          [{ set_number: 1, completed: false }],
            },
          ],
        });
      },

      removeExercise: (exerciseId) =>
        set({ exercises: get().exercises.filter((e) => e.exercise_id !== exerciseId) }),

      addSet: (exerciseId) =>
        set({
          exercises: get().exercises.map((e) =>
            e.exercise_id === exerciseId
              ? { ...e, sets: [...e.sets, { set_number: e.sets.length + 1, completed: false }] }
              : e
          ),
        }),

      updateSet: (exerciseId, setNumber, data) =>
        set({
          exercises: get().exercises.map((e) =>
            e.exercise_id === exerciseId
              ? { ...e, sets: e.sets.map((s) => (s.set_number === setNumber ? { ...s, ...data } : s)) }
              : e
          ),
        }),

      completeSet: (exerciseId, setNumber) =>
        set({
          exercises: get().exercises.map((e) =>
            e.exercise_id === exerciseId
              ? { ...e, sets: e.sets.map((s) => (s.set_number === setNumber ? { ...s, completed: true } : s)) }
              : e
          ),
        }),

      clearSession: () =>
        set({ workoutId: null, workoutType: null, startedAt: null, exercises: [], isActive: false }),
    }),
    { name: "myfit-workout-session", storage: createJSONStorage(() => sessionStorage) }
  )
);
