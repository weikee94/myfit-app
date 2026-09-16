import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Flag, X, Dumbbell } from "lucide-react";
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
  const [editingExercises, setEditingExercises] = useState<string[]>([]);
  const timer        = useElapsedTime(session.startedAt);

  const handleAddExercise = (ex: Exercise) => {
    session.addExercise({ id: ex.id, name: ex.name, demo_url: ex.demo_url, demo_type: ex.demo_type });
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col">
          <p className="text-sm text-muted-foreground">Strength Session</p>
          <p className="font-mono text-2xl font-semibold tabular-nums">{timer}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-11" onClick={() => setShowSearch(true)}>
            <Plus className="mr-1 h-4 w-4" /> Add Exercise
          </Button>
          <Button
            size="sm"
            className="h-11"
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

      {session.exercises.map((ex) => {
        const hasImage = !!ex.demo_url && (ex.demo_type === "image" || ex.demo_type === "gif");
        return (
          <Card key={ex.exercise_id}>
            <CardHeader className="flex-row items-center justify-between gap-3 p-3 pb-2">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md bg-muted relative">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  {hasImage && (
                    <img
                      src={ex.demo_url!}
                      alt={ex.exercise_name}
                      className="absolute inset-0 h-full w-full object-contain"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                  )}
                </div>
                <CardTitle className="text-base truncate">{ex.exercise_name}</CardTitle>
              </div>
              <Button variant="ghost" size="icon" className="h-11 w-11 shrink-0" aria-label={`删除动作 ${ex.exercise_name}`} onClick={() => {
                const hasData = ex.sets.some((s) => s.completed || [s.weight_kg, s.actual_reps, s.target_reps, s.rpe, s.rir].some((v) => v !== undefined));
                if (!hasData || window.confirm(`删除 ${ex.exercise_name} 及其所有组记录？`)) session.removeExercise(ex.exercise_id);
              }}>
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <Button variant="ghost" size="sm" className="mb-2 h-11" aria-pressed={editingExercises.includes(ex.exercise_id)} onClick={() => setEditingExercises((ids) => ids.includes(ex.exercise_id) ? ids.filter((id) => id !== ex.exercise_id) : [...ids, ex.exercise_id])}>
                {editingExercises.includes(ex.exercise_id) ? "完成编辑" : "编辑组"}
              </Button>
              <div className="grid grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_44px] gap-1.5 px-1 pb-1">
                <span className="text-center text-xs text-muted-foreground">#</span>
                <span className="text-center text-xs text-muted-foreground">kg</span>
                <span className="text-center text-xs text-muted-foreground">Reps</span>
                <span className="text-center text-xs text-muted-foreground">RPE</span>
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
                    editing={editingExercises.includes(ex.exercise_id)}
                    onDelete={() => session.removeSet(ex.exercise_id, s.set_number)}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 h-11 w-full text-muted-foreground"
                onClick={() => session.addSet(ex.exercise_id)}
              >
                <Plus className="mr-1 h-3.5 w-3.5" /> Add Set
              </Button>
            </CardContent>
          </Card>
        );
      })}

      <ExerciseSearchModal open={showSearch} onClose={() => setShowSearch(false)} onSelect={handleAddExercise} />
    </div>
  );
}
