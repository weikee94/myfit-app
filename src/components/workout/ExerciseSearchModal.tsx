import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import ExerciseFilterBar from "@/components/exercise/ExerciseFilterBar";
import ExerciseCard from "@/components/exercise/ExerciseCard";
import { useExercises } from "@/hooks/useExercises";
import type { Exercise, ExerciseCategory } from "@/types/exercise";

interface Props {
  open:     boolean;
  onClose:  () => void;
  onSelect: (exercise: Exercise) => void;
}

export default function ExerciseSearchModal({ open, onClose, onSelect }: Props) {
  const [category, setCategory] = useState<ExerciseCategory | "all">("all");
  const [search, setSearch]     = useState("");
  const { data: exercises = [], isLoading } = useExercises(category === "all" ? undefined : category);

  const filtered = exercises.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="flex max-h-[85dvh] flex-col gap-4 sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Exercise</DialogTitle>
        </DialogHeader>
        <ExerciseFilterBar category={category} onCategory={setCategory} search={search} onSearch={setSearch} />
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">Loading…</p>
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No exercises found.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((ex) => (
                <ExerciseCard
                  key={ex.id}
                  exercise={ex}
                  compact
                  onClick={() => { onSelect(ex); onClose(); }}
                />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
