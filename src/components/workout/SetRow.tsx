import { useState } from "react";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActiveSet } from "@/store/workoutSessionStore";

interface Props {
  setNumber:       number;
  set:             ActiveSet;
  suggestedWeight?: number;
  targetReps?:     number;
  onChange:        (data: Partial<ActiveSet>) => void;
  onDelete:        () => void;
}

function NumInput({ value, placeholder, onChange, className }: {
  value?: number; placeholder?: string; onChange: (v: number | undefined) => void; className?: string;
}) {
  return (
    <input
      type="number"
      inputMode="decimal"
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value === "" ? undefined : Number(e.target.value))}
      className={cn(
        "h-9 w-full rounded-md border border-input bg-transparent px-2 py-1 text-center text-sm tabular-nums",
        "focus:outline-none focus:ring-1 focus:ring-ring",
        className
      )}
    />
  );
}

export default function SetRow({ setNumber, set, suggestedWeight, targetReps, onChange, onDelete }: Props) {
  const [showRir, setShowRir] = useState(false);

  return (
    <div className={cn(
      "grid grid-cols-[32px_1fr_1fr_1fr_36px_36px] items-center gap-1.5 rounded-lg px-1 py-1.5 transition-colors",
      set.completed && "bg-muted/50"
    )}>
      <span className="text-center text-sm font-medium text-muted-foreground">{setNumber}</span>

      <NumInput
        value={set.weight_kg}
        placeholder={suggestedWeight !== undefined ? String(suggestedWeight) : "kg"}
        onChange={(v) => onChange({ weight_kg: v })}
      />
      <NumInput
        value={set.actual_reps}
        placeholder={targetReps !== undefined ? String(targetReps) : "reps"}
        onChange={(v) => onChange({ actual_reps: v })}
      />
      <NumInput
        value={showRir ? set.rir : set.rpe}
        placeholder={showRir ? "RIR" : "RPE"}
        onChange={(v) => onChange(showRir ? { rir: v } : { rpe: v })}
        className="cursor-pointer"
      />

      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={() => onChange({ completed: !set.completed })}
      >
        <Check className={cn("h-4 w-4", set.completed ? "text-green-500" : "text-muted-foreground")} />
      </Button>
      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onDelete}>
        <Trash2 className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}
