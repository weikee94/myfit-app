import { TrendingUp, Minus, TrendingDown, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProgressionSuggestion } from "@/algorithms/progressiveOverload";
import { cn } from "@/lib/utils";

const CONFIG = {
  increase: {
    icon: TrendingUp,
    label: "Increase",
    color: "text-green-500",
    bg:    "bg-green-500/10 border-green-500/30",
  },
  maintain: {
    icon: Minus,
    label: "Maintain",
    color: "text-yellow-500",
    bg:    "bg-yellow-500/10 border-yellow-500/30",
  },
  decrease: {
    icon: TrendingDown,
    label: "Reduce",
    color: "text-red-500",
    bg:    "bg-red-500/10 border-red-500/30",
  },
  insufficient_data: {
    icon: HelpCircle,
    label: "Log a session",
    color: "text-muted-foreground",
    bg:    "bg-muted border-border",
  },
};

interface Props {
  exerciseName: string;
  suggestion:   ProgressionSuggestion;
  onAccept?:    (weight: number) => void;
}

export default function ProgressionSuggestionCard({ exerciseName, suggestion, onAccept }: Props) {
  const cfg = CONFIG[suggestion.decision];
  const Icon = cfg.icon;

  return (
    <Card className={cn("border", cfg.bg)}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <Icon className={cn("h-5 w-5", cfg.color)} />
          <div>
            <p className="text-sm font-semibold">{exerciseName}</p>
            <p className={cn("text-xs font-medium", cfg.color)}>{cfg.label}</p>
          </div>
          {suggestion.decision !== "insufficient_data" && (
            <span className="ml-auto font-mono text-lg font-bold tabular-nums">
              {suggestion.suggested_weight_kg} kg
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
        {onAccept && suggestion.decision !== "insufficient_data" && (
          <Button size="sm" variant="outline" onClick={() => onAccept(suggestion.suggested_weight_kg)}>
            Use {suggestion.suggested_weight_kg} kg
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
