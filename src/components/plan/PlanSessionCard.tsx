import { useState } from "react";
import { ArrowRight, PlayCircle } from "lucide-react";
import ExerciseDemoSheet from "@/components/exercise/ExerciseDemoSheet";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PlanDay, PlanExercise, PlanNote, PlanNoteKind, PlanSession } from "@/types/plan";

const DAY_LABELS: Record<PlanDay, string> = {
  mon: "周一 · 下肢",
  tue: "周二 · 上肢",
  sat: "周六 · 全身",
};

const NOTE_STYLES: Record<PlanNoteKind, string> = {
  reason:  "rounded-lg bg-muted/60 p-3",
  keep:    "border-l-2 border-run pl-3",
  callout: "border-l-2 border-strength pl-3",
  warning: "border-l-2 border-destructive pl-3",
};

function ExerciseLine({ exercise }: { exercise: PlanExercise }) {
  const { name, change, to, note, highlight } = exercise;
  const [open, setOpen] = useState(false);
  const isReplace = change === "replace" && !!to;

  // The whole line is the tap target (44px on mobile); a replaced line opens the replacement's demo.
  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex min-h-11 w-full flex-wrap items-center gap-x-1.5 rounded-md text-left transition-colors active:bg-accent md:min-h-0"
      >
        {isReplace ? (
          <>
            <span className="text-muted-foreground line-through">{name}</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" aria-label="换成" />
            <span className="font-medium text-strength">{to}</span>
          </>
        ) : (
          <>
            <span className={cn(highlight && "font-semibold")}>{name}</span>
            {change === "modify" && (
              <span className="rounded bg-strength/15 px-1.5 text-xs font-medium text-strength">{note}</span>
            )}
          </>
        )}
        <PlayCircle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden />
      </button>
      <ExerciseDemoSheet
        name={isReplace ? to! : name}
        original={isReplace ? name : undefined}
        open={open}
        onOpenChange={setOpen}
      />
    </li>
  );
}

export function PlanNoteBlock({ note }: { note: PlanNote }) {
  return (
    <div className={NOTE_STYLES[note.kind]}>
      {note.title && <p className="mb-0.5 text-sm font-medium">{note.title}</p>}
      <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{note.text}</p>
    </div>
  );
}

export default function PlanSessionCard({ session }: { session: PlanSession }) {
  const dayLabel = session.movedFrom === "thu" ? "周四 → 周六 · 全身" : DAY_LABELS[session.day];

  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{dayLabel}</p>
            <h3 className="font-semibold">{session.title}</h3>
          </div>
          {session.alsoUsedIn && (
            <Badge variant="secondary" className="shrink-0">
              也用于 {session.alsoUsedIn.map((w) => `W${w}`).join(" / ")}
            </Badge>
          )}
        </div>

        <p className="text-sm">{session.summary}</p>

        <div className="divide-y rounded-lg border">
          {session.blocks.map((block, i) => (
            <div key={i} className="flex gap-3 px-3 py-2">
              <span className="w-8 shrink-0 pt-0.5 text-xs text-muted-foreground">{block.sets} 组</span>
              <ul className="flex flex-col gap-1 text-sm">
                {block.exercises.map((ex, j) => <ExerciseLine key={j} exercise={ex} />)}
              </ul>
            </div>
          ))}
        </div>

        {session.notes.map((note, i) => <PlanNoteBlock key={i} note={note} />)}
      </CardContent>
    </Card>
  );
}
