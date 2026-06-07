import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkout, useDeleteWorkout } from "@/hooks/useWorkouts";
import { formatDate, formatDuration, sportLabel } from "@/lib/utils";
import type { ExerciseCategory } from "@/types/exercise";

export default function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: workout, isLoading } = useWorkout(id!);
  const deleteWorkout = useDeleteWorkout();

  if (isLoading) return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!workout)  return <p className="py-12 text-center text-muted-foreground">Workout not found.</p>;

  const handleDelete = async () => {
    if (!confirm("Delete this workout?")) return;
    await deleteWorkout.mutateAsync(workout.id);
    navigate("/workouts");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h2 className="text-xl font-bold flex-1">{workout.name ?? sportLabel(workout.type)}</h2>
        <Badge variant={workout.type as ExerciseCategory} className="capitalize">{sportLabel(workout.type)}</Badge>
      </div>

      <Card>
        <CardContent className="grid grid-cols-2 gap-3 p-4 text-sm">
          <div><p className="text-xs text-muted-foreground">Date</p><p className="font-medium">{formatDate(workout.date)}</p></div>
          {workout.duration_minutes && <div><p className="text-xs text-muted-foreground">Duration</p><p className="font-medium">{formatDuration(workout.duration_minutes)}</p></div>}
          {workout.distance_km     && <div><p className="text-xs text-muted-foreground">Distance</p><p className="font-medium">{workout.distance_km} km</p></div>}
          {workout.avg_heart_rate  && <div><p className="text-xs text-muted-foreground">Avg HR</p><p className="font-medium">{workout.avg_heart_rate} bpm</p></div>}
          {workout.avg_power_watts && <div><p className="text-xs text-muted-foreground">Avg Power</p><p className="font-medium">{workout.avg_power_watts} W</p></div>}
          {workout.session_rpe     && <div><p className="text-xs text-muted-foreground">RPE</p><p className="font-medium">{workout.session_rpe}/10</p></div>}
        </CardContent>
      </Card>

      {workout.notes && (
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{workout.notes}</p>
          </CardContent>
        </Card>
      )}

      {workout.type === "strength" && workout.workout_exercises?.length > 0 && (
        <div className="flex flex-col gap-3">
          {workout.workout_exercises.map((we) => (
            <Card key={we.id}>
              <CardHeader className="p-4 pb-2"><CardTitle className="text-sm">{we.exercise?.name}</CardTitle></CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="grid grid-cols-4 gap-1 text-xs font-medium text-muted-foreground pb-1">
                  <span>Set</span><span className="text-center">kg</span><span className="text-center">Reps</span><span className="text-center">RPE</span>
                </div>
                {we.workout_sets?.map((s) => (
                  <div key={s.id} className="grid grid-cols-4 gap-1 py-1 text-sm tabular-nums">
                    <span className="text-muted-foreground">{s.set_number}</span>
                    <span className="text-center">{s.weight_kg ?? "—"}</span>
                    <span className="text-center">{s.actual_reps ?? "—"}</span>
                    <span className="text-center">{s.rpe ?? (s.rir !== null ? `RIR ${s.rir}` : "—")}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button variant="destructive" size="sm" onClick={handleDelete} className="mt-4">
        <Trash2 className="mr-1 h-4 w-4" /> Delete Workout
      </Button>
    </div>
  );
}
