import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";
import { ChevronRight, ClipboardList, Dumbbell, Flag, LayoutList, NotebookPen, type LucideIcon } from "lucide-react";
import MedalBadge from "@/components/progress/MedalBadge";
import SegmentBar from "@/components/runna-plan/SegmentBar";
import RaceEstimate from "@/components/runna-plan/RaceEstimate";
import WeekCard from "@/components/runna-plan/WeekCard";
import { useAllCompletedWorkouts } from "@/hooks/useWorkouts";
import { RUNNA_PLAN_META as meta } from "@/data/plans/runnaMain";
import { TOTAL_WEEKS, buildPlanWeeks, currentWeekNumber } from "@/lib/runnaPlan";

const ACTIONS: { to: string; icon: LucideIcon; label: string }[] = [
  { to: "/plan/overview",          icon: LayoutList,    label: "Plan Overview" },
  { to: "/plan/notes?tab=weeks",   icon: Dumbbell,      label: "Strength Plan" },
  { to: "/plan/notes?tab=runs",    icon: NotebookPen,   label: "Plan Notes"    },
  { to: "/plan/manage",            icon: ClipboardList, label: "Manage Plan"   },
];

export default function PlanPage() {
  const { data: workouts = [] } = useAllCompletedWorkouts();
  const weeks   = useMemo(() => buildPlanWeeks(workouts), [workouts]);
  const current = currentWeekNumber();
  const currentRef = useRef<HTMLDivElement>(null);

  // Open on the current week, like Runna; the plan summary is one scroll up.
  useEffect(() => {
    if (current > 1) currentRef.current?.scrollIntoView({ block: "start" });
  }, [current]);

  const weeksDone = weeks.filter((w) => w.week < current).length;
  const doneKm    = weeks.reduce((t, w) => t + w.doneKm, 0);
  const plannedKm = weeks.reduce((t, w) => t + w.plannedKm, 0);
  const raceDate  = parseISO(meta.raceDate);

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-5 rounded-3xl border bg-card p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold">{meta.name}</h2>
            <p className="text-muted-foreground">Your race: <span className="font-bold text-foreground">{format(raceDate, "MMM d, yyyy").toUpperCase()}</span></p>
          </div>
          <MedalBadge shape="shield" tone="race" size={64}><span className="text-base">42.2</span></MedalBadge>
        </div>
        <SegmentBar total={TOTAL_WEEKS} filled={weeksDone} tone="foreground" className="gap-1" />
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Weeks Completed</p>
            <p className="text-3xl font-bold tabular-nums">{weeksDone}/{TOTAL_WEEKS}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Distance</p>
            <p className="text-3xl font-bold tabular-nums">{doneKm.toFixed(1)}/{plannedKm.toFixed(1)} km</p>
          </div>
        </div>
        <Link to="/plan/manage" className="flex items-center gap-2 border-t border-dashed pt-4">
          <Flag className="h-5 w-5" />
          <span className="font-medium">{meta.raceName}</span>
          <span className="flex-1 font-semibold text-muted-foreground">{format(raceDate, "MMM d, yyyy")}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </Link>
      </section>

      <section className="grid grid-cols-4 gap-2 rounded-3xl border bg-card px-2 py-5 shadow-sm">
        {ACTIONS.map(({ to, icon: Icon, label }) => (
          <Link key={to} to={to} className="flex flex-col items-center gap-2 rounded-xl text-center text-sm hover:opacity-80">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-muted-foreground/60">
              <Icon className="h-6 w-6" />
            </span>
            {label}
          </Link>
        ))}
      </section>

      <section className="rounded-3xl border bg-card p-5 shadow-sm">
        <RaceEstimate title="Estimated Race Times" />
      </section>

      <div className="my-2 border-t" />

      {weeks.map((w) => (
        <WeekCard key={w.week} week={w} current={w.week === current} ref={w.week === current ? currentRef : undefined} />
      ))}
    </div>
  );
}
