import { Waves, Bike, FootprintsIcon, Dumbbell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkoutType } from "@/types/workout";

const TYPES: { value: WorkoutType; label: string; icon: React.ElementType; color: string }[] = [
  { value: "swim",     label: "Swim",     icon: Waves,          color: "text-[#0ea5e9] border-[#0ea5e9]/40 hover:bg-[#0ea5e9]/10 data-[active=true]:bg-[#0ea5e9]/20 data-[active=true]:border-[#0ea5e9]" },
  { value: "bike",     label: "Bike",     icon: Bike,           color: "text-[#f59e0b] border-[#f59e0b]/40 hover:bg-[#f59e0b]/10 data-[active=true]:bg-[#f59e0b]/20 data-[active=true]:border-[#f59e0b]" },
  { value: "run",      label: "Run",      icon: FootprintsIcon, color: "text-[#22c55e] border-[#22c55e]/40 hover:bg-[#22c55e]/10 data-[active=true]:bg-[#22c55e]/20 data-[active=true]:border-[#22c55e]" },
  { value: "strength", label: "Strength", icon: Dumbbell,       color: "text-[#a855f7] border-[#a855f7]/40 hover:bg-[#a855f7]/10 data-[active=true]:bg-[#a855f7]/20 data-[active=true]:border-[#a855f7]" },
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
