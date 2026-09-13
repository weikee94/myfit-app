import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { ExerciseCategory } from "@/types/exercise";

const CATEGORIES: { value: ExerciseCategory | "all"; label: string }[] = [
  { value: "all",      label: "All"      },
  { value: "strength", label: "Strength" },
  { value: "swim",     label: "Swim"     },
  { value: "bike",     label: "Bike"     },
  { value: "run",      label: "Run"      },
];

interface Props {
  category: ExerciseCategory | "all";
  onCategory: (cat: ExerciseCategory | "all") => void;
  search: string;
  onSearch: (q: string) => void;
}

export default function ExerciseFilterBar({ category, onCategory, search, onSearch }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search exercises…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          className="pl-9"
        />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => onCategory(value)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-2 text-xs font-medium transition-colors min-h-11 md:min-h-0 md:py-1",
              category === value
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
