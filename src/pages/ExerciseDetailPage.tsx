import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ExerciseDemo from "@/components/exercise/ExerciseDemo";
import ProgressionSuggestionCard from "@/components/progression/ProgressionSuggestionCard";
import { useExercise } from "@/hooks/useExercises";
import { useAuth } from "@/hooks/useAuth";
import { useProgressionSuggestion } from "@/hooks/useProgression";
import type { ExerciseCategory } from "@/types/exercise";

export default function ExerciseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: exercise, isLoading } = useExercise(id!);
  const { data: progData } = useProgressionSuggestion(user?.id ?? "", id ?? "");

  if (isLoading) return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  if (!exercise) return <p className="py-12 text-center text-muted-foreground">Exercise not found.</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h2 className="flex-1 text-xl font-bold">{exercise.name}</h2>
        <Badge variant={exercise.category as ExerciseCategory} className="capitalize">{exercise.category}</Badge>
      </div>

      {exercise.demo_url && (
        <ExerciseDemo demoUrl={exercise.demo_url} demoType={exercise.demo_type} title={exercise.name} />
      )}

      {exercise.muscle_groups.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {exercise.muscle_groups.map((m) => (
            <span key={m} className="rounded-full bg-muted px-3 py-1 text-xs font-medium capitalize">{m}</span>
          ))}
        </div>
      )}

      {exercise.triathlon_benefit && (
        <Card>
          <CardContent className="p-4">
            <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Triathlon Benefit</p>
            <p className="text-sm">{exercise.triathlon_benefit}</p>
          </CardContent>
        </Card>
      )}

      {exercise.instructions && (
        <Card>
          <CardContent className="p-4">
            <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">How to Perform</p>
            <p className="text-sm leading-relaxed">{exercise.instructions}</p>
          </CardContent>
        </Card>
      )}

      {progData && (
        <ProgressionSuggestionCard
          exerciseName={exercise.name}
          suggestion={progData.suggestion}
        />
      )}
    </div>
  );
}
