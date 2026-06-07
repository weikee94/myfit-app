import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatDuration, sportLabel } from "@/lib/utils";
import type { Workout } from "@/types/workout";
import type { ExerciseCategory } from "@/types/exercise";

export default function RecentWorkoutsWidget({ workouts }: { workouts: Workout[] }) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Recent Workouts</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-0">
        {workouts.length === 0 && (
          <p className="py-4 text-center text-sm text-muted-foreground">No workouts yet this week.</p>
        )}
        {workouts.map((w) => (
          <button
            key={w.id}
            onClick={() => navigate(`/workouts/${w.id}`)}
            className="flex items-center justify-between py-2.5 text-left hover:bg-accent/30 rounded-lg px-1 transition-colors"
          >
            <div>
              <p className="text-sm font-medium">{w.name ?? sportLabel(w.type)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDate(w.date)}{w.duration_minutes ? ` · ${formatDuration(w.duration_minutes)}` : ""}
              </p>
            </div>
            <Badge variant={w.type as ExerciseCategory} className="capitalize">{sportLabel(w.type)}</Badge>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
