import { useState } from "react";
import { useExercises } from "@/hooks/useExercises";
import { useProgressionSuggestion } from "@/hooks/useProgression";
import { useAuth } from "@/hooks/useAuth";
import ProgressionSuggestionCard from "@/components/progression/ProgressionSuggestionCard";
import OverloadHistoryChart from "@/components/progression/OverloadHistoryChart";
import { Card, CardContent } from "@/components/ui/card";

export default function ProgressPage() {
  const { user } = useAuth();
  const { data: exercises = [] } = useExercises("strength");
  const [selectedId, setSelectedId] = useState<string>("");
  const exerciseId = selectedId || exercises[0]?.id || "";
  const { data: progData } = useProgressionSuggestion(user?.id ?? "", exerciseId);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Progress</h2>

      <select
        value={selectedId || exerciseId}
        onChange={(e) => setSelectedId(e.target.value)}
        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {exercises.map((ex) => (
          <option key={ex.id} value={ex.id}>{ex.name}</option>
        ))}
      </select>

      {progData ? (
        <>
          <ProgressionSuggestionCard
            exerciseName={exercises.find((e) => e.id === exerciseId)?.name ?? ""}
            suggestion={progData.suggestion}
          />
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><p className="text-xs text-muted-foreground">Strategy</p><p className="font-medium capitalize">{progData.rule.strategy.replace(/_/g, " ")}</p></div>
                <div><p className="text-xs text-muted-foreground">Rep Range</p><p className="font-medium">{progData.rule.rep_range_min}–{progData.rule.rep_range_max}</p></div>
                <div><p className="text-xs text-muted-foreground">Sets</p><p className="font-medium">{progData.rule.target_sets}</p></div>
                <div><p className="text-xs text-muted-foreground">Increment</p><p className="font-medium">{progData.rule.weight_increment_kg} kg</p></div>
              </div>
            </CardContent>
          </Card>
          <OverloadHistoryChart exerciseName={exercises.find((e) => e.id === exerciseId)?.name ?? ""} data={[]} />
        </>
      ) : (
        <div className="py-12 text-center text-sm text-muted-foreground">
          <p>No progression data yet.</p>
          <p className="mt-1">Log a strength session and set up a progression rule to start tracking.</p>
        </div>
      )}
    </div>
  );
}
