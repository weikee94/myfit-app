import { useState } from "react";
import { Button } from "@/components/ui/button";
import ExerciseCard from "@/components/exercise/ExerciseCard";
import ExerciseFilterBar from "@/components/exercise/ExerciseFilterBar";
import { useExercises } from "@/hooks/useExercises";
import type { ExerciseCategory } from "@/types/exercise";

const PAGE_SIZE = 50;

export default function ExerciseLibraryPage() {
  const [category, setCategory] = useState<ExerciseCategory | "all">("all");
  const [search, setSearch]     = useState("");
  const [limit, setLimit]       = useState(PAGE_SIZE);
  const { data: exercises = [], isLoading } = useExercises(category === "all" ? undefined : category);

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.muscle_groups.some((m) => m.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Exercise Library</h2>
      <ExerciseFilterBar
        category={category}
        onCategory={(c) => { setCategory(c); setLimit(PAGE_SIZE); }}
        search={search}
        onSearch={(q) => { setSearch(q); setLimit(PAGE_SIZE); }}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">No exercises found.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.slice(0, limit).map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} showBenefit />
          ))}
          {filtered.length > limit && (
            <Button variant="outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
              Show more ({filtered.length - limit} left)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
