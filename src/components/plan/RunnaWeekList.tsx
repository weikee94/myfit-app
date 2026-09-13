import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChangeLine, DayExtras, MarkBadges } from "@/components/plan/RunnaDayDetail";
import { cn } from "@/lib/utils";
import { RUNNA_MARATHON_PLAN } from "@/data/plans/runnaMarathon";
import {
  RUNNA_DAY_KEYS,
  RUNNA_MAIN,
  RUNNA_WEEKDAY_LABELS,
  findRunnaToday,
  runnaDayDate,
  runnaDayHasExtras,
  type RunnaDayKey,
  type RunnaWeek,
} from "@/data/plans/runnaMain";

const monthDay = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

function DayRow({ week, dayKey, isToday }: { week: RunnaWeek; dayKey: RunnaDayKey; isToday: boolean }) {
  const date = runnaDayDate(week.week, dayKey);
  const day = week.days.find((d) => d.day === dayKey);
  const hasStrengthFixes = RUNNA_MARATHON_PLAN.weeks.some((w) => w.week === week.week);
  const label = day?.run ? null : day?.strength ? "仅力量" : dayKey === "wed" || dayKey === "sun" ? "全休" : "—";

  return (
    <div className={cn("px-4 py-2", label && !day?.strength && "text-muted-foreground", isToday && "bg-strength/10")}>
      <div className="flex items-start gap-3">
        <span className="w-16 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">
          {monthDay(date)} {RUNNA_WEEKDAY_LABELS[dayKey]}
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="text-sm font-medium">
            {day?.run ? (day.run.kind === "easy" ? "E" : day.run.name) : label}
            {isToday && <Badge variant="strength" className="ml-2 align-middle">今天</Badge>}
          </div>
          {day?.strength && (
            <p className="text-sm text-muted-foreground">
              力量 ·{" "}
              {hasStrengthFixes ? (
                <Link to={`/plan/${week.week}`} className="text-strength underline-offset-2 hover:underline">{day.strength}</Link>
              ) : day.strength}
            </p>
          )}
          {day && <MarkBadges marks={day.marks} />}
          {day && <ChangeLine day={day} />}
          {day && runnaDayHasExtras(day) && (
            <details className="mt-1">
              <summary className="cursor-pointer text-sm text-strength">详情</summary>
              <div className="mt-2"><DayExtras day={day} /></div>
            </details>
          )}
        </div>
        {day?.run && <span className="shrink-0 text-sm tabular-nums">{day.run.km}</span>}
      </div>
    </div>
  );
}

export default function RunnaWeekList() {
  const today = findRunnaToday(new Date());
  const currentWeek = today.status === "in-plan" ? today.week : undefined;

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 17 }, (_, i) => i + 1).map((n) => {
        const actual = RUNNA_MAIN.actuals.find((a) => a.week === n);
        const week = RUNNA_MAIN.weeks.find((w) => w.week === n);
        const km = actual ? actual.actual : week!.km;
        const isCurrent = n === currentWeek;
        const isPast = today.status === "after" || (currentWeek !== undefined && n < currentWeek);

        return (
          <details key={n} open={isCurrent} className={cn("group rounded-xl border bg-card", isPast && "opacity-70", isCurrent && "border-strength/60")}>
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="w-10 text-sm font-semibold">W{n}</span>
              <span className="flex-1 text-sm text-muted-foreground">
                {monthDay(runnaDayDate(n, "mon"))}–{monthDay(runnaDayDate(n, "sun"))}
              </span>
              {isCurrent && <Badge variant="strength">本周</Badge>}
              {week?.cutback && <Badge variant="secondary">降量</Badge>}
              {week?.peak && <Badge variant="strength">★ 峰值</Badge>}
              <span className="text-sm font-medium tabular-nums">{km} km</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>

            {actual ? (
              <div className="flex flex-col gap-1.5 border-t px-4 py-3 text-sm">
                <p>
                  App 显示 <span className="tabular-nums">{actual.display}</span> · Runna 排 {actual.planned} · 实际 {actual.actual}
                  <span className="text-destructive"> · 超出 {actual.over}</span>
                </p>
                <p className="text-muted-foreground">{actual.records}</p>
                {actual.warning && <p className="text-destructive">⚠ {actual.warning}</p>}
              </div>
            ) : (
              <div className="divide-y border-t">
                {RUNNA_DAY_KEYS.map((key) => (
                  <DayRow
                    key={key}
                    week={week!}
                    dayKey={key}
                    isToday={today.status === "in-plan" && today.week === n && today.day === key}
                  />
                ))}
              </div>
            )}
          </details>
        );
      })}
    </div>
  );
}
