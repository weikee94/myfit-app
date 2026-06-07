import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Workout } from "@/types/workout";
import { format, subWeeks, startOfWeek } from "date-fns";

interface Props { workouts: Workout[] }

function buildWeeklyData(workouts: Workout[]) {
  const weeks: Record<string, { week: string; swim: number; bike: number; run: number; strength: number }> = {};
  for (let i = 7; i >= 0; i--) {
    const d = startOfWeek(subWeeks(new Date(), i));
    const key = format(d, "MMM d");
    weeks[key] = { week: key, swim: 0, bike: 0, run: 0, strength: 0 };
  }
  for (const w of workouts) {
    const key = format(startOfWeek(new Date(w.date)), "MMM d");
    if (weeks[key]) {
      if (w.type === "strength") weeks[key].strength += 1;
      else weeks[key][w.type as "swim" | "bike" | "run"] += w.duration_minutes ?? 0;
    }
  }
  return Object.values(weeks);
}

export default function TrainingLoadChart({ workouts }: Props) {
  const data = buildWeeklyData(workouts);
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Training Load (8 weeks)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: -28 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <YAxis tick={{ fontSize: 10 }} stroke="hsl(var(--muted-foreground))" />
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
            />
            <Bar dataKey="swim"     name="Swim (min)"  stackId="a" fill="#0ea5e9" radius={[0,0,0,0]} />
            <Bar dataKey="bike"     name="Bike (min)"  stackId="a" fill="#f59e0b" />
            <Bar dataKey="run"      name="Run (min)"   stackId="a" fill="#22c55e" />
            <Bar dataKey="strength" name="Strength (x)"stackId="a" fill="#a855f7" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
