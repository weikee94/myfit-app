import { ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { BulletList } from "@/components/plan/HansonsNotes";
import { cn } from "@/lib/utils";
import { usePaceGoal } from "@/store/paceGoalStore";
import { DEFAULT_PACE_GOAL, HANSONS_PACE_ROWS } from "@/data/plans/hansonsPaces";
import { HANSONS_SCHEDULE as schedule, hansonsDayDate, type HansonsRunType } from "@/data/plans/hansonsSchedule";

const WEEKDAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const BADGE_VARIANT: Record<HansonsRunType, React.ComponentProps<typeof Badge>["variant"]> = {
  easy:     "secondary",
  speed:    "run",
  strength: "run",
  tempo:    "run",
  long:     "bike",
  rest:     "outline",
  race:     "strength",
};

const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const monthDay = (date: Date) => `${date.getMonth() + 1}/${date.getDate()}`;
const toSeconds = (t: string) => t.split(":").map(Number).reduce((total, n) => total * 60 + n, 0);
const stripLeadingZero = (t: string) => t.replace(/^0/, "");   // sheet shows 6:50, pace table 06:50

export default function HansonsSchedule() {
  const goal = usePaceGoal((s) => s.goal);
  const paces =
    HANSONS_PACE_ROWS.find((r) => r.goal === goal) ??
    HANSONS_PACE_ROWS.find((r) => r.goal === DEFAULT_PACE_GOAL)!;

  // Same row as the sheet header: easy range, long, tempo, strength, speed as 400m lap seconds.
  const paceItems = [
    { label: "轻松有氧", value: `${stripLeadingZero(paces.easyA)}~${stripLeadingZero(paces.easyB)}` },
    { label: "长跑",     value: stripLeadingZero(paces.long) },
    { label: "节奏跑",   value: stripLeadingZero(paces.tempo) },
    { label: "强化跑",   value: stripLeadingZero(paces.strength) },
    { label: "速度跑",   value: `${toSeconds(paces.m400)}s/lap` },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <div>
            <h3 className="font-semibold">{schedule.name}</h3>
            <p className="text-sm text-muted-foreground">
              Race {schedule.raceDate} · {schedule.weeks.length} 周 · 原表目标 {schedule.goal}
            </p>
          </div>

          <div>
            <p className={cn(SECTION_LABEL, "mb-1.5")}>配速 · 按 Paces 目标 {paces.goal}</p>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {paceItems.map((p) => (
                <div key={p.label} className="rounded-lg bg-muted/60 px-2.5 py-2">
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                  <p className="text-sm font-semibold tabular-nums">{p.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className={cn(SECTION_LABEL, "mb-1.5")}>注意事项</p>
            <BulletList points={schedule.notes} />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        {schedule.weeks.map((w) => (
          <details key={w.week} className="group rounded-xl border bg-card">
            <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 [&::-webkit-details-marker]:hidden">
              <span className="w-9 text-sm font-semibold">W{w.week}</span>
              <span className="flex-1 text-sm text-muted-foreground">
                {monthDay(hansonsDayDate(w.week, 0))}–{monthDay(hansonsDayDate(w.week, 6))}
              </span>
              <span className="text-sm font-medium tabular-nums">{w.weeklyKm} km</span>
              <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
            </summary>

            <div className="divide-y border-t">
              {w.days.map((day, i) => {
                const date = hansonsDayDate(w.week, i);
                return (
                  <div key={i} className={cn("px-4 py-2", day.type === "rest" && "text-muted-foreground")}>
                    <div className="flex items-start gap-3">
                      <span className="w-16 shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">
                        {monthDay(date)} {WEEKDAYS[date.getDay()]}
                      </span>
                      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
                        {day.label && <Badge variant={BADGE_VARIANT[day.type]}>{day.label}</Badge>}
                        {day.workout && <span className="break-words text-sm">{day.workout}</span>}
                      </div>
                      {day.km !== undefined && <span className="shrink-0 text-sm tabular-nums">{day.km}</span>}
                    </div>
                    {day.warning && <p className="ml-[4.75rem] mt-1 text-sm text-destructive">⚠ {day.warning}</p>}
                  </div>
                );
              })}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
