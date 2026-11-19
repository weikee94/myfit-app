import { Link } from "react-router-dom";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { Bike, Dumbbell, Footprints, Waves } from "lucide-react";
import SectionHeader from "./SectionHeader";
import { sportColor, sportLabel } from "@/lib/utils";
import { avgPace, formatClock, formatPaceShort } from "@/lib/progressStats";
import type { Workout, WorkoutType } from "@/types/workout";

const ICON: Record<WorkoutType, typeof Bike> = { strength: Dumbbell, run: Footprints, bike: Bike, swim: Waves };

function when(w: Workout) {
  const d   = parseISO(w.date);
  const day = isToday(d) ? "Today" : isYesterday(d) ? "Yesterday" : format(d, "EEE, MMM d");
  const at  = w.started_at ?? w.completed_at;
  return at ? `${day} · ${format(new Date(at), "h:mm a")}` : day;
}

export default function LatestActivity({ workout }: { workout: Workout | undefined }) {
  const Icon = workout ? ICON[workout.type] : Footprints;
  const pace = workout && workout.type === "run" ? avgPace(workout) : null;

  return (
    <section className="flex flex-col gap-5">
      <SectionHeader title="Your Activities" to="/workouts" />
      {!workout ? (
        <p className="text-sm text-muted-foreground">No completed activities yet.</p>
      ) : (
        <Link
          to={`/workouts/${workout.id}`}
          className="flex overflow-hidden rounded-2xl border-2 border-border transition-colors hover:bg-accent/40"
        >
          <div className="w-2.5 shrink-0" style={{ background: sportColor(workout.type) }} />
          <div className="flex flex-1 flex-col gap-4 p-5">
            <div className="flex items-center gap-4">
              <Icon className="h-8 w-8 shrink-0" strokeWidth={2.25} />
              <div className="min-w-0">
                <p className="truncate text-xl font-bold">{workout.name ?? sportLabel(workout.type)}</p>
                <p className="text-muted-foreground">{when(workout)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {workout.distance_km ? <Metric label="Distance" value={`${workout.distance_km.toFixed(2)} km`} /> : null}
              {workout.duration_minutes ? <Metric label="Time" value={formatClock(workout.duration_minutes)} /> : null}
              {pace ? <Metric label="Avg pace" value={formatPaceShort(pace)} /> : null}
            </div>
          </div>
        </Link>
      )}
    </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-xl font-medium tabular-nums">{value}</p>
    </div>
  );
}
