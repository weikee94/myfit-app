import { cn } from "@/lib/utils";

// Runna-style progress: one pill per unit, the first `filled` highlighted.
export default function SegmentBar({ total, filled, tone = "run", className }: {
  total: number; filled: number; tone?: "run" | "foreground"; className?: string;
}) {
  return (
    <div className={cn("flex gap-1.5", className)} role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={filled}>
      {Array.from({ length: Math.max(total, 1) }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1.5 flex-1 rounded-full",
            i < filled
              ? tone === "run" ? "bg-run" : "bg-foreground"
              : tone === "run" ? "bg-run/15" : "bg-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}
