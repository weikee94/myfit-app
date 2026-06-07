import { useState } from "react";
import { useNavigate } from "react-router-dom";
import WorkoutTypeSelector from "@/components/workout/WorkoutTypeSelector";
import EnduranceWorkoutForm from "@/components/workout/EnduranceWorkoutForm";
import ActiveWorkoutPanel from "@/components/workout/ActiveWorkoutPanel";
import { useCreateWorkout } from "@/hooks/useWorkouts";
import { useWorkoutSession } from "@/store/workoutSessionStore";
import { useAuth } from "@/hooks/useAuth";
import type { WorkoutInsert } from "@/types/database";
import type { WorkoutType } from "@/types/workout";

export default function NewWorkoutPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [type, setType] = useState<WorkoutType>("strength");
  const createWorkout   = useCreateWorkout();
  const session         = useWorkoutSession();

  const handleStartStrength = async () => {
    if (!user) return;
    const workout = await createWorkout.mutateAsync({
      user_id:    user.id,
      type:       "strength",
      date:       new Date().toISOString().split("T")[0],
      completed:  false,
      started_at: new Date().toISOString(),
    });
    session.startSession(workout.id, "strength");
  };

  const handleEnduranceSubmit = async (data: WorkoutInsert) => {
    if (!user) return;
    await createWorkout.mutateAsync({
      ...data,
      user_id:      user.id,
      completed:    true,
      completed_at: new Date().toISOString(),
    });
    navigate("/workouts");
  };

  if (session.isActive) {
    return (
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Active Session</h2>
        <ActiveWorkoutPanel />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="mb-1 text-xl font-bold">New Workout</h2>
        <p className="text-sm text-muted-foreground">Select a type to get started.</p>
      </div>

      <WorkoutTypeSelector value={type} onChange={setType} />

      {type === "strength" ? (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-muted-foreground">
            Start a live session and log sets as you train.
          </p>
          <button
            onClick={handleStartStrength}
            disabled={createWorkout.isPending}
            className="flex h-32 w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#a855f7]/40 text-[#a855f7] transition-colors hover:bg-[#a855f7]/10"
          >
            <span className="text-3xl">🏋️</span>
            <span className="font-medium">{createWorkout.isPending ? "Starting…" : "Start Strength Session"}</span>
          </button>
        </div>
      ) : (
        <EnduranceWorkoutForm
          type={type as "swim" | "bike" | "run"}
          onSubmit={handleEnduranceSubmit}
          isLoading={createWorkout.isPending}
        />
      )}
    </div>
  );
}
