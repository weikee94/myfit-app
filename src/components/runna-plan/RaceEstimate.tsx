import { ChevronDown } from "lucide-react";
import MedalBadge from "@/components/progress/MedalBadge";
import { RUNNA_PLAN_META } from "@/data/plans/runnaMain";
import { estimatedRaceRange, formatHms, weeksUntilRace } from "@/lib/runnaPlan";

// Marathon estimate from the race times entered in the plan (Riegel), expandable to show its inputs.
export default function RaceEstimate({ title = "Estimated Race Time" }: { title?: string }) {
  const { low, high } = estimatedRaceRange();
  const weeks = weeksUntilRace();
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none flex-col gap-3 [&::-webkit-details-marker]:hidden">
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">{title}</p>
          <ChevronDown className="h-6 w-6 transition-transform group-open:rotate-180" />
        </div>
        <div className="flex items-center gap-4">
          <MedalBadge size={52}><span className="text-sm">42.2</span></MedalBadge>
          <div>
            <p className="text-sm text-muted-foreground">{weeks === 0 ? "Race week" : `In ${weeks} week${weeks === 1 ? "" : "s"}`}</p>
            <p className="text-3xl font-bold tabular-nums">{formatHms(low)} - {formatHms(high)}</p>
          </div>
        </div>
      </summary>
      <div className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
        <p>Riegel prediction from your current race times:</p>
        {RUNNA_PLAN_META.raceTimes.map((r) => (
          <p key={r.badge}><span className="font-medium text-foreground">{r.badge}</span> {r.time}</p>
        ))}
        <p>These come from the race times listed under Manage Plan.</p>
      </div>
    </details>
  );
}
