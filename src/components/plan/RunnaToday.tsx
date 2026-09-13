import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { ChangeLine, DayExtras, MarkBadges } from "@/components/plan/RunnaDayDetail";
import { RUNNA_MARATHON_PLAN } from "@/data/plans/runnaMarathon";
import {
  RUNNA_MAIN,
  RUNNA_WEEKDAY_LABELS,
  findRunnaToday,
  runnaDayDate,
  runnaRunLabel,
  type RunnaRunKind,
} from "@/data/plans/runnaMain";

const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const pace = (key: string) => RUNNA_MAIN.paces.find((p) => p.key === key)!;
const PACES_FOR: Record<RunnaRunKind, string[]> = { easy: ["E"], long: ["L"], quality: ["T", "MP"], race: ["MP"] };

export default function RunnaToday() {
  const today = findRunnaToday(new Date());

  if (today.status !== "in-plan") {
    return (
      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>今天</p>
          <p className="mt-1 text-sm">{today.status === "before" ? "计划从 8/10（第 1 周）开始。" : "BYD Marathon（12/6）已经结束。"}</p>
        </CardContent>
      </Card>
    );
  }

  const { week, day } = today;
  const date = runnaDayDate(week, day);
  const actual = RUNNA_MAIN.actuals.find((a) => a.week === week);
  const data = RUNNA_MAIN.weeks.find((w) => w.week === week)?.days.find((d) => d.day === day);
  const hasStrengthFixes = RUNNA_MARATHON_PLAN.weeks.some((w) => w.week === week);

  return (
    <Card className="border-strength/40">
      <CardContent className="flex flex-col gap-3 p-4">
        <p className={SECTION_LABEL}>
          今天 · {date.getMonth() + 1}/{date.getDate()} {RUNNA_WEEKDAY_LABELS[day]} · 第 {week} 周
        </p>

        {actual ? (
          <p className="text-sm">第 1–4 周为已完成实录：{actual.records}</p>
        ) : !data ? (
          <div>
            <p className="text-lg font-semibold">{day === "wed" || day === "sun" ? "全休" : "今天没有排课"}</p>
            <p className="text-sm text-muted-foreground">{RUNNA_MAIN.restDayTip}</p>
          </div>
        ) : (
          <>
            {data.run ? (
              <div>
                <p className="text-lg font-semibold">{runnaRunLabel(data.run)}</p>
                <div className="mt-1 flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                  {PACES_FOR[data.run.kind].map((k) => (
                    <span key={k}>{pace(k).label} <span className="tabular-nums text-foreground">{pace(k).pace}</span></span>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-lg font-semibold">{data.strength ? "仅力量" : "休息"}</p>
            )}

            {data.strength && (
              <p className="text-sm">
                力量 ·{" "}
                {hasStrengthFixes ? (
                  <Link to={`/plan/${week}`} className="font-medium text-strength underline-offset-2 hover:underline">{data.strength}</Link>
                ) : (
                  <span className="font-medium">{data.strength}</span>
                )}
              </p>
            )}

            <MarkBadges marks={data.marks} />
            <ChangeLine day={data} />
            <DayExtras day={data} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
