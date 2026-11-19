import { Activity, Clock, Route } from "lucide-react";
import MedalBadge from "./MedalBadge";
import SectionHeader from "./SectionHeader";
import { formatKm, type Totals } from "@/lib/progressStats";

function formatTotalTime(minutes: number) {
  const total = Math.round(minutes * 60);
  return `${Math.floor(total / 3600).toLocaleString()}h ${Math.floor((total % 3600) / 60)}m ${total % 60}s`;
}

export default function AllTimeStats({ totals }: { totals: Totals }) {
  const items = [
    { icon: Activity, value: totals.count.toLocaleString(), label: "Total Activities" },
    { icon: Route,    value: formatKm(totals.distanceKm),   label: "Total Distance"   },
    { icon: Clock,    value: formatTotalTime(totals.minutes), label: "Total Time"     },
  ];
  return (
    <section className="flex flex-col gap-5">
      <SectionHeader title="All Time Stats" to="/workouts" />
      <div className="grid grid-cols-3 gap-2">
        {items.map(({ icon: Icon, value, label }) => (
          <div key={label} className="flex flex-col items-center gap-1 text-center">
            <MedalBadge earned={false} size={84}>
              <Icon className="h-9 w-9 text-foreground" strokeWidth={2.25} />
            </MedalBadge>
            <p className="mt-2 font-bold tabular-nums">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
