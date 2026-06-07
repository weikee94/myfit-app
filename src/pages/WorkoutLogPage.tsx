import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import WorkoutCard from "@/components/workout/WorkoutCard";
import { useWorkouts } from "@/hooks/useWorkouts";

export default function WorkoutLogPage() {
  const navigate = useNavigate();
  const { data: workouts = [], isLoading } = useWorkouts();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Workout Log</h2>
        <Button size="sm" onClick={() => navigate("/workouts/new")}>
          <Plus className="mr-1 h-4 w-4" /> New
        </Button>
      </div>

      {isLoading && (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {!isLoading && workouts.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <p className="text-muted-foreground">No workouts yet.</p>
          <Button onClick={() => navigate("/workouts/new")}>Log your first workout</Button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {workouts.map((w) => <WorkoutCard key={w.id} workout={w} />)}
      </div>
    </div>
  );
}
