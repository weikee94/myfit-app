import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { RUN_TYPES, type RunType } from "@/lib/runnaPlan";

export default function SessionSquare({ type, done, className }: { type: RunType; done?: boolean; className?: string }) {
  return (
    <span
      className={cn("flex h-6 w-6 shrink-0 items-center justify-center rounded-md", className)}
      style={{ background: RUN_TYPES[type].gradient }}
      aria-label={done ? `${RUN_TYPES[type].label}, done` : RUN_TYPES[type].label}
    >
      {done && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
    </span>
  );
}
