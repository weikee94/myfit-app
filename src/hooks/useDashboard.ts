import { useWeekWorkouts } from "./useWorkouts";
import type { WeekSummary } from "@/types/workout";

export function useDashboard() {
  const { data: weekWorkouts = [], isLoading } = useWeekWorkouts();

  const summary: WeekSummary = weekWorkouts.reduce(
    (acc, w) => {
      if (w.type === "swim")     acc.swimMinutes     += w.duration_minutes ?? 0;
      if (w.type === "bike")     acc.bikeMinutes     += w.duration_minutes ?? 0;
      if (w.type === "run")      acc.runMinutes      += w.duration_minutes ?? 0;
      if (w.type === "strength") acc.strengthSessions += 1;
      acc.totalSessions += 1;
      return acc;
    },
    { swimMinutes: 0, bikeMinutes: 0, runMinutes: 0, strengthSessions: 0, totalSessions: 0 }
  );

  const recentWorkouts = weekWorkouts.slice(0, 5);

  return { summary, recentWorkouts, isLoading };
}
