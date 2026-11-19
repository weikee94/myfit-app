import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChevronDown } from "lucide-react";
import { cn, formatDate, sportColor } from "@/lib/utils";
import {
  allTimeStart, filterBySport, formatHoursMinutes, formatKm, inPeriod, niceMax, periodOptions, totals,
  trendBuckets, workoutDate, type RangeKind, type SportFilter,
} from "@/lib/progressStats";
import type { Workout } from "@/types/workout";

const RANGES: { value: RangeKind; label: string }[] = [
  { value: "week",  label: "W"   },
  { value: "month", label: "M"   },
  { value: "year",  label: "Y"   },
  { value: "all",   label: "All" },
];

const SPORTS: { value: SportFilter; label: string }[] = [
  { value: "run",      label: "Run"      },
  { value: "bike",     label: "Bike"     },
  { value: "swim",     label: "Swim"     },
  { value: "strength", label: "Strength" },
  { value: "all",      label: "All"      },
];

interface Props { workouts: Workout[] }

export default function ActivityTrend({ workouts }: Props) {
  const [sport, setSport]   = useState<SportFilter>("run");
  const [range, setRange]   = useState<RangeKind>("week");
  const [offset, setOffset] = useState(0);

  const sportWorkouts = useMemo(() => filterBySport(workouts, sport), [workouts, sport]);
  const first = useMemo(() => {
    const dates = sportWorkouts.map(workoutDate);
    return dates.length ? new Date(Math.min(...dates.map(Number))) : null;
  }, [sportWorkouts]);

  const options = range === "all" ? [] : periodOptions(range, first);
  const period  = range === "all"
    ? { start: allTimeStart(first), end: new Date(), label: `${first ? formatDate(first) : "Today"} – Today` }
    : options[Math.min(offset, options.length - 1)];

  const selected = inPeriod(sportWorkouts, period.start, period.end);
  const sum      = totals(selected);

  // Distance sports chart km; strength (no distance) charts minutes.
  const useDistance = sport !== "strength" && sportWorkouts.some((w) => (w.distance_km ?? 0) > 0);
  const points  = trendBuckets(selected, range, period.start, period.end, (w) => (useDistance ? w.distance_km ?? 0 : w.duration_minutes ?? 0));
  const maxY    = niceMax(Math.max(...points.map((p) => p.value), 0));
  const fmtY    = (v: number) => (useDistance ? (v === 0 ? "0m" : formatKm(v)) : formatHoursMinutes(v));
  const color   = sport === "all" ? "hsl(var(--run))" : sportColor(sport);
  const showDots = points.length <= 31;

  const changeRange = (r: RangeKind) => { setRange(r); setOffset(0); };

  return (
    <section className="flex flex-col gap-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SPORTS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => { setSport(value); setOffset(0); }}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors min-h-9",
              sport === value
                ? "border-foreground bg-foreground text-background"
                : "border-border text-muted-foreground hover:border-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {range === "all" ? (
        <p className="text-base font-semibold">{period.label}</p>
      ) : (
        <label className="relative self-start">
          <span className="sr-only">Period</span>
          <select
            value={Math.min(offset, options.length - 1)}
            onChange={(e) => setOffset(Number(e.target.value))}
            className="appearance-none rounded-full border border-border bg-background py-2 pl-5 pr-11 text-base font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {options.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </label>
      )}

      <div className="flex gap-8">
        {useDistance && <Stat value={formatKm(sum.distanceKm)} label="Distance" />}
        <Stat value={formatHoursMinutes(sum.minutes)} label="Time" />
        <Stat value={String(sum.count)} label={sum.count === 1 ? "Activity" : "Activities"} />
      </div>

      <div className="h-56 text-muted-foreground">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 0, bottom: 0, left: 8 }}>
            <defs>
              <linearGradient id="progress-trend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0"   stopColor={color} stopOpacity={0.25} />
                <stop offset="1"   stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="currentColor" strokeOpacity={0.35} />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13, fill: "currentColor" }}
              interval={range === "month" ? 6 : "preserveStartEnd"}
              minTickGap={range === "all" ? 24 : 4}
              tickMargin={10}
            />
            <YAxis
              orientation="right"
              domain={[0, maxY]}
              ticks={[0, maxY / 2, maxY]}
              tickFormatter={fmtY}
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 13, fill: "currentColor" }}
              width={58}
            />
            <Tooltip
              cursor={{ stroke: "currentColor", strokeOpacity: 0.3 }}
              formatter={(v) => [fmtY(Number(v)), useDistance ? "Distance" : "Time"]}
              labelFormatter={(_, payload) => payload?.[0]?.payload?.tooltip ?? ""}
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
            <Area
              type="linear"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fill="url(#progress-trend-fill)"
              dot={showDots ? { r: 4, strokeWidth: 2, stroke: color, fill: "hsl(var(--background))" } : false}
              activeDot={{ r: 5, strokeWidth: 2, stroke: color, fill: "hsl(var(--background))" }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-4 rounded-full bg-muted p-1">
        {RANGES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => changeRange(value)}
            className={cn(
              "rounded-full py-2 text-base font-medium transition-colors",
              range === value ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
