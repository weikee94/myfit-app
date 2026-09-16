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
  editing?: boolean;
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
        "h-11 min-w-0 w-full rounded-md border border-input bg-transparent px-2 py-1 text-center text-base tabular-nums md:text-sm",
        "focus:outline-none focus:ring-1 focus:ring-ring",
        className
      )}
    />
  );
}

export default function SetRow({ setNumber, set, suggestedWeight, targetReps, onChange, onDelete, editing = false }: Props) {

  return (
    <div className={cn(
      "grid grid-cols-[24px_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_44px] items-center gap-1.5 rounded-lg px-1 py-1.5 transition-colors",
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
        value={set.rpe}
        placeholder="RPE"
        onChange={(v) => onChange({ rpe: v })}
        className="cursor-pointer"
      />

      <Button
        size="icon"
        variant="ghost"
        className="h-11 w-11" aria-label={`切换第 ${setNumber} 组完成状态`} aria-pressed={set.completed}
        onClick={() => onChange({ completed: !set.completed })}
      >
        <Check className={cn("h-4 w-4", set.completed ? "text-green-500" : "text-muted-foreground")} />
      </Button>
      {editing && (
        <Button size="sm" variant="ghost" className="col-span-full h-11 justify-start text-destructive" onClick={onDelete} aria-label={`删除第 ${setNumber} 组`}>
          <Trash2 className="mr-2 h-4 w-4" /> 删除第 {setNumber} 组
        </Button>
      )}
    </div>
  );
}
