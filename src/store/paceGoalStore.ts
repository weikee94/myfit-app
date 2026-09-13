import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_PACE_GOAL } from "@/data/plans/hansonsPaces";

interface PaceGoalState {
  goal: string;
  setGoal: (goal: string) => void;
}

// Remembers the marathon goal picked on the Paces tab, per browser.
export const usePaceGoal = create<PaceGoalState>()(
  persist(
    (set) => ({
      goal: DEFAULT_PACE_GOAL,
      setGoal: (goal) => set({ goal }),
    }),
    { name: "myfit-pace-goal" }
  )
);
