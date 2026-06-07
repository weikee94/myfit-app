import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Flag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SetRow from "./SetRow";
import ExerciseSearchModal from "./ExerciseSearchModal";
import { useWorkoutSession } from "@/store/workoutSessionStore";
import { useFinalizeStrengthWorkout } from "@/hooks/useWorkouts";
import type { Exercise } from "@/types/exercise";

function useElapsedTime(startedAt: string | null) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    if (!startedAt) return;
    const update = () => setElapsed(Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [startedAt]);
  const m = Math.floor(elapsed / 60);
  const s = elapsed % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function ActiveWorkoutPanel() {
  const navigate     = useNavigate();
  const session      = useWorkoutSession();
  const finalize     = useFinalizeStrengthWorkout();
  const [showSearch, setShowSearch] = useState(false);
  const timer        = useElapsedTime(session.startedAt);

  const handleAddExercise = (ex: Exercise) => {
    session.addExercise({ id: ex.id, name: ex.name });
  };

  const handleFinish = async () => {
    if (!session.workoutId) return;
    await finalize.mutateAsync({ workoutId: session.workoutId, exercises: session.exercises });
    session.clearSession();
    navigate("/workouts");
  };

  if (!session.isActive) return null;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Strength Session</p>
          <p className="font-mono text-2xl font-semibold tabular-nums">{timer}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSearch(true)}>
            <Plus className="mr-1 h-4 w-4" /> Add Exercise
          </Button>
          <Button
            size="sm"
            onClick={handleFinish}
            disabled={finalize.isPending}
          >
            <Flag className="mr-1 h-4 w-4" />
            {finalize.isPending ? "Saving…" : "Finish"}
          </Button>
        </div>
      </div>

      {session.exercises.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Add your first exercise to get started.
        </p>
      )}

      {session.exercises.map((ex) => (
        <Card key={ex.exercise_id}>
          <CardHeader className="flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-base">{ex.exercise_name}</CardTitle>
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => session.removeExercise(ex.exercise_id)}>
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="grid grid-cols-[32px_1fr_1fr_1fr_36px_36px] gap-1.5 pb-1">
              <span className="text-center text-xs text-muted-foreground">#</span>
              <span className="text-center text-xs text-muted-foreground">kg</span>
              <span className="text-center text-xs text-muted-foreground">Reps</span>
              <span className="text-center text-xs text-muted-foreground">RPE</span>
              <span />
              <span />
            </div>
            <Separator className="mb-2" />
            <div className="flex flex-col gap-1">
              {ex.sets.map((s) => (
                <SetRow
                  key={s.set_number}
                  setNumber={s.set_number}
                  set={s}
                  onChange={(data) => session.updateSet(ex.exercise_id, s.set_number, data)}
                  onDelete={() => {
                    const remaining = ex.sets.filter((x) => x.set_number !== s.set_number);
                    session.removeExercise(ex.exercise_id);
                    session.addExercise({ id: ex.exercise_id, name: ex.exercise_name });
                    remaining.forEach(() => session.addSet(ex.exercise_id));
                  }}
                />
              ))}
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full text-muted-foreground"
              onClick={() => session.addSet(ex.exercise_id)}
            >
              <Plus className="mr-1 h-3.5 w-3.5" /> Add Set
            </Button>
          </CardContent>
        </Card>
      ))}

      <ExerciseSearchModal open={showSearch} onClose={() => setShowSearch(false)} onSelect={handleAddExercise} />
    </div>
  );
}
