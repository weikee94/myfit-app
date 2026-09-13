import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell } from "lucide-react";
import type { Exercise, ExerciseCategory } from "@/types/exercise";
import { cn } from "@/lib/utils";

const CATEGORY_VARIANT: Record<ExerciseCategory, "swim" | "bike" | "run" | "strength"> = {
  swim: "swim", bike: "bike", run: "run", strength: "strength",
};

interface Props {
  exercise: Exercise;
  onClick?: () => void;
  showBenefit?: boolean;
  compact?: boolean;
}

export default function ExerciseCard({ exercise, onClick, showBenefit, compact }: Props) {
  const navigate = useNavigate();
  const handleClick = onClick ?? (() => navigate(`/exercises/${exercise.id}`));

  const hasImage = !!exercise.demo_url && (exercise.demo_type === "image" || exercise.demo_type === "gif");
  const [imgError, setImgError] = useState(false);

  const showPhoto = hasImage && !imgError;

  return (
    <Card
      onClick={handleClick}
      className={cn("cursor-pointer transition-colors hover:bg-accent/50 active:bg-accent/50", compact && "shadow-none")}
    >
      <CardContent className={cn("flex gap-3", compact ? "p-3" : "p-4")}>
        <div className={cn(
          "shrink-0 overflow-hidden rounded-md bg-muted flex items-center justify-center",
          compact ? "h-14 w-14" : "h-16 w-16"
        )}>
          {showPhoto ? (
            <img
              src={exercise.demo_url!}
              alt={exercise.name}
              className="h-full w-full object-contain"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <Dumbbell className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="min-w-0 flex-1 flex flex-col gap-1.5">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("font-medium leading-snug", compact ? "text-sm" : "text-base")}>{exercise.name}</p>
            <Badge variant={CATEGORY_VARIANT[exercise.category]} className="shrink-0 capitalize">
              {exercise.category}
            </Badge>
          </div>

          {exercise.muscle_groups.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {exercise.muscle_groups.slice(0, 3).map((m) => (
                <span key={m} className="rounded bg-muted px-1.5 py-0.5 text-xs text-muted-foreground capitalize">
                  {m}
                </span>
              ))}
            </div>
          )}

          {showBenefit && exercise.triathlon_benefit && (
            <p className="text-xs text-muted-foreground line-clamp-2">{exercise.triathlon_benefit}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
