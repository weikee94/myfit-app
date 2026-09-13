import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface DataPoint {
  date:         string;
  weight_kg:    number;
  total_volume: number;
}

interface Props {
  data:         DataPoint[];
  exerciseName: string;
}

export default function OverloadHistoryChart({ data, exerciseName }: Props) {
  if (data.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center rounded-xl border border-dashed">
        <p className="text-sm text-muted-foreground">No data yet. Log sets to see your progress.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium">{exerciseName} — Progress</p>
      <ResponsiveContainer width="100%" height={220}>
        <ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
          <CartesianGrid strokeDasharray="3 3" className="text-border" stroke="currentColor" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" stroke="currentColor" />
          <YAxis yAxisId="left"  tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" stroke="currentColor" />
          <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: "currentColor" }} className="text-muted-foreground" stroke="currentColor" />
          <Tooltip
            contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar    yAxisId="right" dataKey="total_volume" name="Volume (kg)" fill="#a855f7" opacity={0.4} radius={[4,4,0,0]} />
          <Line   yAxisId="left"  dataKey="weight_kg"   name="Weight (kg)" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
