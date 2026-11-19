import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import SessionSquare from "./SessionSquare";
import WeekProgress from "./WeekProgress";
import { cn } from "@/lib/utils";
import { isToday, weekRangeLabel, type PlanSession, type PlanWeek } from "@/lib/runnaPlan";
import { format } from "date-fns";

interface Props { week: PlanWeek; current?: boolean }

// A week summary card; the current week also lists its sessions grouped by day.
const WeekCard = forwardRef<HTMLDivElement, Props>(({ week, current }, ref) => {
  const byDay = new Map<string, PlanSession[]>();
  for (const s of week.sessions) {
    const key = format(s.date, "yyyy-MM-dd");
    byDay.set(key, [...(byDay.get(key) ?? []), s]);
  }

  return (
    <div
      ref={ref}
      className={cn(
        "scroll-mt-20 rounded-3xl bg-card shadow-sm",
        current ? "border-2 border-foreground" : "border border-border",
      )}
    >
      <Link to={`/plan/week/${week.week}`} className="flex flex-col gap-4 p-5 pb-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">{weekRangeLabel(week)}</p>
            <div className="flex items-center gap-2">
              <p className="text-3xl font-bold">Week {week.week}</p>
              {week.peak && <Badge variant="run">Peak</Badge>}
              {week.cutback && <Badge variant="secondary">Cutback</Badge>}
            </div>
          </div>
          <ChevronRight className="mt-1 h-5 w-5 text-muted-foreground" />
        </div>
        <WeekProgress week={week} />
      </Link>

      {current && week.sessions.length > 0 && (
        <div className="mx-5 divide-y border-t">
          {[...byDay.entries()].map(([key, sessions]) => {
            const today = isToday(sessions[0].date);
            return (
              <div key={key} className="flex items-center gap-4 py-2">
                <span className={cn("w-10 shrink-0", today && "font-bold")}>{format(sessions[0].date, "EEE")}</span>
                <div className="flex min-w-0 flex-1 flex-col">
                  {sessions.map((s) => (
                    <Link key={s.id} to={`/plan/week/${week.week}#${s.id}`} className="flex min-h-12 items-center gap-3 rounded-md hover:bg-accent/40">
                      <SessionSquare type={s.type} done={s.done} />
                      <span className={cn("min-w-0 flex-1 truncate", today && "font-bold")}>{s.title}</span>
                      {s.km !== undefined && <span className={cn("tabular-nums", today && "font-bold")}>{s.km}km</span>}
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
      {current && <div className="h-3" />}
    </div>
  );
});
WeekCard.displayName = "WeekCard";
export default WeekCard;
