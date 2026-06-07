import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Workout } from "@/types/workout";
import { formatDate, formatDuration, sportLabel } from "@/lib/utils";
import type { ExerciseCategory } from "@/types/exercise";

export default function WorkoutCard({ workout }: { workout: Workout }) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/workouts/${workout.id}`)} className="cursor-pointer hover:bg-accent/50 transition-colors">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div className="flex flex-col gap-1">
          <p className="font-medium">{workout.name ?? sportLabel(workout.type)}</p>
          <p className="text-xs text-muted-foreground">{formatDate(workout.date)}</p>
          {workout.duration_minutes && (
            <p className="text-sm text-muted-foreground">{formatDuration(workout.duration_minutes)}</p>
          )}
          {workout.distance_km && (
            <p className="text-sm text-muted-foreground">{workout.distance_km} km</p>
          )}
        </div>
        <Badge variant={workout.type as ExerciseCategory} className="shrink-0 capitalize">
          {sportLabel(workout.type)}
        </Badge>
      </CardContent>
    </Card>
  );
}
