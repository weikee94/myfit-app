import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { usePaceGoal } from "@/store/paceGoalStore";
import {
  DEFAULT_PACE_GOAL,
  HANSONS_PACE_KEYS,
  HANSONS_PACE_LABELS,
  HANSONS_PACE_ROWS,
  type HansonsPaceKey,
} from "@/data/plans/hansonsPaces";

const GROUPS: { title: string; unit: string; keys: HansonsPaceKey[] }[] = [
  { title: "轻松跑",            unit: "每公里",   keys: ["recovery", "easyA", "easyB"] },
  { title: "长跑 · 节奏 · 强化", unit: "每公里",   keys: ["long", "tempo", "strength"] },
  { title: "比赛配速",          unit: "每公里",   keys: ["pace10k", "pace5k"] },
  { title: "预估 PB",           unit: "完赛时间", keys: ["pb10k", "pb5k"] },
  { title: "间歇",              unit: "每趟用时", keys: ["m1600", "m1200", "m1000", "m800", "m600", "m400"] },
];

const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export default function HansonsPaceChart() {
  const goal    = usePaceGoal((s) => s.goal);
  const setGoal = usePaceGoal((s) => s.setGoal);

  // A stored goal that is no longer in the table falls back to the default.
  const selected =
    HANSONS_PACE_ROWS.find((r) => r.goal === goal) ??
    HANSONS_PACE_ROWS.find((r) => r.goal === DEFAULT_PACE_GOAL)!;

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="flex flex-col gap-4 p-4">
          <div>
            <p className={SECTION_LABEL}>汉森课表配速表</p>
            <p className="mt-1 text-sm text-muted-foreground">选择全马目标时间，下方配速随之更新。</p>
          </div>

          <label className="flex items-center gap-3 text-sm font-medium">
            <span className="shrink-0">全马目标</span>
            <select
              value={selected.goal}
              onChange={(e) => setGoal(e.target.value)}
              className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm tabular-nums shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {HANSONS_PACE_ROWS.map((r) => (
                <option key={r.goal} value={r.goal}>{r.goal}</option>
              ))}
            </select>
          </label>

          {GROUPS.map((group) => (
            <div key={group.title}>
              <p className="mb-1.5 text-sm font-medium">
                {group.title} <span className="text-xs font-normal text-muted-foreground">· {group.unit}</span>
              </p>
              <div className="grid grid-cols-3 gap-2">
                {group.keys.map((key) => (
                  <div key={key} className="rounded-lg bg-muted/60 px-2.5 py-2">
                    <p className="text-xs text-muted-foreground">{HANSONS_PACE_LABELS[key]}</p>
                    <p className="font-semibold tabular-nums">{selected[key]}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className={cn(SECTION_LABEL, "mb-2")}>全部目标</p>
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm tabular-nums">
              <thead>
                <tr>
                  {HANSONS_PACE_KEYS.map((key, i) => (
                    <th
                      key={key}
                      className={cn(
                        "whitespace-nowrap px-2.5 py-2 text-left text-xs font-medium text-muted-foreground",
                        i === 0 && "sticky left-0 bg-card"
                      )}
                    >
                      {HANSONS_PACE_LABELS[key]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HANSONS_PACE_ROWS.map((r) => {
                  const isSelected = r.goal === selected.goal;
                  return (
                    <tr key={r.goal} className={cn("border-t", isSelected && "bg-strength/10 font-semibold text-strength")}>
                      {HANSONS_PACE_KEYS.map((key, i) => (
                        <td
                          key={key}
                          className={cn("whitespace-nowrap px-2.5 py-1.5", i === 0 && "sticky left-0 bg-card")}
                        >
                          {i === 0 && isSelected ? `▶ ${r[key]}` : r[key]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
