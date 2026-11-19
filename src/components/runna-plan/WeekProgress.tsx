import SegmentBar from "./SegmentBar";
import type { PlanWeek } from "@/lib/runnaPlan";

export default function WeekProgress({ week }: { week: PlanWeek }) {
  return (
    <div className="flex flex-col gap-3">
      <SegmentBar total={week.sessionCount} filled={week.doneCount} />
      <div className="flex justify-between gap-2 text-sm">
        <p className="text-muted-foreground">Workouts: <span className="font-bold text-foreground tabular-nums">{week.doneCount}/{week.sessionCount}</span></p>
        <p className="text-muted-foreground">Distance: <span className="font-bold text-foreground tabular-nums">{week.doneKm.toFixed(2)}/{week.plannedKm.toFixed(2)}km</span></p>
      </div>
    </div>
  );
}
