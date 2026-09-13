import { Waves, Bike, FootprintsIcon, Dumbbell } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDuration } from "@/lib/utils";
import type { WeekSummary } from "@/types/workout";

interface Props { data: WeekSummary }

const SPORTS = [
  { key: "swimMinutes"     as const, icon: Waves,          label: "Swim",     color: "text-swim",     isMin: true  },
  { key: "bikeMinutes"     as const, icon: Bike,           label: "Bike",     color: "text-bike",     isMin: true  },
  { key: "runMinutes"      as const, icon: FootprintsIcon, label: "Run",      color: "text-run",      isMin: true  },
  { key: "strengthSessions"as const, icon: Dumbbell,       label: "Strength", color: "text-strength", isMin: false },
];

export default function WeekSummaryCard({ data }: Props) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-4 gap-3">
        {SPORTS.map(({ key, icon: Icon, label, color, isMin }) => (
          <div key={key} className="flex flex-col items-center gap-1.5">
            <Icon className={`h-5 w-5 ${color}`} />
            <p className="text-lg font-bold tabular-nums">
              {isMin
                ? data[key] > 0 ? formatDuration(data[key] as number) : "—"
                : data[key] > 0 ? `${data[key]}x` : "—"
              }
            </p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
