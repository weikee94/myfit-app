import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft, Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import WeekProgress from "@/components/runna-plan/WeekProgress";
import { ChangeLine, DayExtras, MarkBadges } from "@/components/plan/RunnaDayDetail";
import { useAllCompletedWorkouts } from "@/hooks/useWorkouts";
import { RUNNA_MAIN, runnaDayHasExtras } from "@/data/plans/runnaMain";
import { RUNNA_MARATHON_PLAN } from "@/data/plans/runnaMarathon";
import { cn } from "@/lib/utils";
import {
  RUN_TYPES, TOTAL_WEEKS, buildPlanWeeks, currentWeekNumber, durationRange, type PlanSession,
} from "@/lib/runnaPlan";

function SessionCard({ s, open }: { s: PlanSession; open: boolean }) {
  const meta = RUN_TYPES[s.type];
  const duration = durationRange(s);
  const strengthFix = s.type === "strength" && RUNNA_MARATHON_PLAN.weeks.some((w) => w.week === s.week);
  const extras = s.type !== "strength" && (runnaDayHasExtras(s.day) || s.day.change || s.day.marks?.length);

  return (
    <details id={s.id} open={open} className="group scroll-mt-20 overflow-hidden rounded-3xl border bg-card shadow-sm">
      <summary className="flex cursor-pointer list-none [&::-webkit-details-marker]:hidden">
        <span className="w-2.5 shrink-0" style={{ background: meta.gradient }} />
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-2xl font-bold leading-tight">{s.km && s.type !== "easy" ? `${s.km}km ` : ""}{s.title}</p>
              <p className="text-muted-foreground">{format(s.date, "EEEE, MMM d")}{duration && ` · ${duration}`}</p>
            </div>
            <span className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2",
              s.done ? "border-foreground bg-foreground text-background" : "border-muted-foreground/40",
            )} aria-label={s.done ? "Done" : "Not done"}>
              {s.done && <Check className="h-5 w-5" strokeWidth={3} />}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <p className="font-medium">{meta.label}{s.km !== undefined && ` · ${s.km}km`}</p>
            {(extras || strengthFix) && <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />}
          </div>
        </div>
      </summary>
      {(extras || strengthFix) && (
        <div className="flex flex-col gap-3 border-t p-5">
          {strengthFix && (
            <Link to={`/plan/${s.week}`} className="font-medium text-strength underline-offset-2 hover:underline">
              See this week's strength changes →
            </Link>
          )}
          {s.type !== "strength" && <MarkBadges marks={s.day.marks} />}
          {s.type !== "strength" && <ChangeLine day={s.day} />}
          {s.type !== "strength" && <DayExtras day={s.day} />}
        </div>
      )}
    </details>
  );
}

export default function PlanWeekDetailPage() {
  const params   = useParams<{ week: string }>();
  const navigate = useNavigate();
  const { hash } = useLocation();
  const { data: workouts = [] } = useAllCompletedWorkouts();
  const weeks    = useMemo(() => buildPlanWeeks(workouts), [workouts]);
  const current  = currentWeekNumber();
  const n        = Math.min(Math.max(Number(params.week) || current, 1), TOTAL_WEEKS);
  const week     = weeks[n - 1];
  const [openId] = useState(hash.slice(1));

  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash]);

  const go = (to: number) => navigate(`/plan/week/${to}`, { replace: true });
  const actual = RUNNA_MAIN.actuals.find((a) => a.week === n);

  return (
    <div className="flex flex-col gap-5 pb-20">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => navigate("/plan")} aria-label="Back to plan"><ArrowLeft className="h-5 w-5" /></Button>
        <Button variant="ghost" size="icon" disabled={n === 1} onClick={() => go(n - 1)} aria-label="Previous week"><ChevronLeft className="h-5 w-5" /></Button>
        <label className="relative flex-1 text-center">
          <span className="sr-only">Week</span>
          <select
            value={n}
            onChange={(e) => go(Number(e.target.value))}
            className="appearance-none bg-transparent pr-6 text-center text-2xl font-bold focus:outline-none"
          >
            {weeks.map((w) => <option key={w.week} value={w.week}>Week {w.week}</option>)}
          </select>
          <ChevronDown className="pointer-events-none absolute right-[calc(50%-4.5rem)] top-1/2 h-5 w-5 -translate-y-1/2" />
        </label>
        <Button variant="ghost" size="icon" disabled={n === TOTAL_WEEKS} onClick={() => go(n + 1)} aria-label="Next week"><ChevronRight className="h-5 w-5" /></Button>
      </div>

      <WeekProgress week={week} />

      {!week.hasSchedule && (
        <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
          <p>The day-by-day schedule for this week wasn't transcribed{week.sessions.length > 0 ? " in full" : ""}.</p>
          {actual && <p className="mt-1">Logged: {actual.records}</p>}
        </div>
      )}

      {week.sessions.map((s) => <SessionCard key={s.id} s={s} open={s.id === openId} />)}

      {n !== current && (
        <div className="fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-20 mx-auto max-w-2xl px-4 md:bottom-6">
          <Button className="h-14 w-full rounded-full text-lg" onClick={() => go(current)}>Go to current week</Button>
        </div>
      )}
    </div>
  );
}
