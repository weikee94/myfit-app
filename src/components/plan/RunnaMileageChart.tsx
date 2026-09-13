import { Bar, CartesianGrid, Cell, ComposedChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { RUNNA_MAIN } from "@/data/plans/runnaMain";

type BarKind = "actual" | "planned" | "cutback" | "peak";

// Colors come from theme tokens via currentColor so light / dark both follow the palette.
const BAR_CLASS: Record<BarKind, string> = {
  actual:  "text-run/50",
  planned: "text-run",
  cutback: "text-muted-foreground",
  peak:    "text-strength",
};

const data = Array.from({ length: 17 }, (_, i) => {
  const week = i + 1;
  const actual = RUNNA_MAIN.actuals.find((a) => a.week === week);
  const planned = RUNNA_MAIN.weeks.find((w) => w.week === week);
  const longRun = planned?.days.find((d) => d.run?.kind === "long" || d.run?.kind === "race")?.run?.km;
  const kind: BarKind = actual ? "actual" : planned?.peak ? "peak" : planned?.cutback ? "cutback" : "planned";
  return {
    week,
    km:          actual ? actual.actual : planned!.km,
    runnaPlanned: actual?.planned,
    longRun,
    kind,
  };
});

const LEGEND = [
  { label: "W1–4 实际",   className: "bg-run/50" },
  { label: "计划周量",    className: "bg-run" },
  { label: "降量周",      className: "bg-muted-foreground" },
  { label: "峰值",        className: "bg-strength" },
  { label: "W1–4 Runna 排", className: "bg-bike rounded-full" },
  { label: "长课",        className: "bg-foreground h-0.5 w-3" },
];

export default function RunnaMileageChart() {
  return (
    <div className="flex flex-col gap-2">
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 8, right: 4, bottom: 0, left: -24 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} className="text-border" stroke="currentColor" />
          <XAxis dataKey="week" interval={0} tick={{ fontSize: 10, fill: "currentColor" }} className="text-muted-foreground" stroke="currentColor" />
          <YAxis tick={{ fontSize: 10, fill: "currentColor" }} className="text-muted-foreground" stroke="currentColor" />
          <Tooltip
            labelFormatter={(w) => `第 ${w} 周`}
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          />
          <Bar dataKey="km" name="周跑量 km" radius={[3, 3, 0, 0]}>
            {data.map((d) => <Cell key={d.week} fill="currentColor" className={BAR_CLASS[d.kind]} />)}
          </Bar>
          {/* Recharts puts className on the line path only, so dots carry their own color class */}
          <Line dataKey="runnaPlanned" name="Runna 排 km" stroke="none" dot={{ r: 3, fill: "currentColor", stroke: "none", className: "text-bike" }} activeDot={false} isAnimationActive={false} />
          <Line dataKey="longRun" name="长课 km" type="monotone" stroke="currentColor" strokeWidth={1.5} className="text-foreground" dot={{ r: 2, fill: "currentColor", stroke: "none", className: "text-foreground" }} isAnimationActive={false} />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
        {LEGEND.map((l) => (
          <span key={l.label} className="inline-flex items-center gap-1.5">
            <span className={`inline-block h-2 w-2 rounded-sm ${l.className}`} />
            {l.label}
          </span>
        ))}
      </div>
    </div>
  );
}
