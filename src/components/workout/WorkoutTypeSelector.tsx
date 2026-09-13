import { Waves, Bike, FootprintsIcon, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkoutType } from "@/types/workout";

const TYPES: { value: WorkoutType; label: string; icon: React.ElementType; color: string }[] = [
  { value: "swim",     label: "Swim",     icon: Waves,          color: "text-swim border-swim/40 hover:bg-swim/10 data-[active=true]:bg-swim/15 data-[active=true]:border-swim" },
  { value: "bike",     label: "Bike",     icon: Bike,           color: "text-bike border-bike/40 hover:bg-bike/10 data-[active=true]:bg-bike/15 data-[active=true]:border-bike" },
  { value: "run",      label: "Run",      icon: FootprintsIcon, color: "text-run border-run/40 hover:bg-run/10 data-[active=true]:bg-run/15 data-[active=true]:border-run" },
  { value: "strength", label: "Strength", icon: Dumbbell,       color: "text-strength border-strength/40 hover:bg-strength/10 data-[active=true]:bg-strength/15 data-[active=true]:border-strength" },
];

interface Props {
  value: WorkoutType;
  onChange: (type: WorkoutType) => void;
}

export default function WorkoutTypeSelector({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-4 gap-2">
      {TYPES.map(({ value: v, label, icon: Icon, color }) => (
        <button
          key={v}
          data-active={value === v}
          onClick={() => onChange(v)}
          className={cn(
            "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
            color
          )}
        >
          <Icon className="h-5 w-5" />
          {label}
        </button>
      ))}
    </div>
  );
}
