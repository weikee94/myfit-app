import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { BulletList } from "@/components/plan/HansonsNotes";
import { PlanNoteBlock } from "@/components/plan/PlanSessionCard";
import RunnaMileageChart from "@/components/plan/RunnaMileageChart";
import RunnaToday from "@/components/plan/RunnaToday";
import RunnaWeekList from "@/components/plan/RunnaWeekList";
import { GateTable, StackedRows } from "@/components/plan/RunnaDayDetail";
import { cn } from "@/lib/utils";
import { RUNNA_MAIN as plan, runnaDayDate, type RunnaGateKey } from "@/data/plans/runnaMain";

const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const monthDay = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`;

// Days carrying a suggested change or a no-hill alternative, in schedule order.
const scheduledDays = plan.weeks.flatMap((w) => w.days.map((d) => ({ week: w.week, day: d })));
const changedDays = scheduledDays.filter((x) => x.day.change);
const hillDays = scheduledDays.filter((x) => x.day.alternative);

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="group rounded-xl border bg-card">
      <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 [&::-webkit-details-marker]:hidden">
        <span className="flex-1 text-sm font-semibold">{title}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-3 border-t p-4">{children}</div>
    </details>
  );
}

export default function RunnaMainPlan() {
  return (
    <div className="flex flex-col gap-4">
      <RunnaToday />

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <h2 className="text-xl font-bold">{plan.title}</h2>
          <div className="flex flex-col gap-1 text-sm text-muted-foreground">
            {plan.intro.map((line) => <p key={line}>{line}</p>)}
          </div>

          <div>
            <p className={cn(SECTION_LABEL, "mb-1.5")}>{plan.pacesTitle}</p>
            <div className="grid grid-cols-2 gap-2">
              {plan.paces.map((p) => (
                <div key={p.key} className="rounded-lg bg-muted/60 px-2.5 py-2">
                  <p className="text-xs text-muted-foreground">{p.label}</p>
                  <p className="text-sm font-semibold tabular-nums">{p.pace}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className={cn(SECTION_LABEL, "mb-1.5")}>{plan.disciplinesTitle}</p>
            <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm marker:text-strength">
              {plan.disciplines.map((d) => <li key={d}>{d}</li>)}
            </ol>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <p className={SECTION_LABEL}>跑量曲线 · 第 1–17 周</p>
          <RunnaMileageChart />
          <div className="flex flex-col gap-1 text-sm">
            <p>{plan.mileage.structure}</p>
            <p className="text-muted-foreground">{plan.mileage.monthly}</p>
            <p className="text-muted-foreground">{plan.mileage.longRunProgression}</p>
            <p className="text-muted-foreground">{plan.mileage.earlyWeeks}</p>
          </div>
          <details>
            <summary className="cursor-pointer text-sm text-strength">周表（第 5–17 周）</summary>
            <div className="mt-2">
              <StackedRows
                columns={["周", "周跑量", "长课", "质量课"]}
                rows={plan.weeks.map((w) => [
                  `第${w.week}周 · ${w.start.slice(5).replace("-", "/").replace(/^0/, "")}`,
                  `${w.km}${w.cutback ? " ↓" : ""}${w.peak ? " ★" : ""}`,
                  w.longRun,
                  w.quality,
                ])}
              />
            </div>
          </details>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <p className={SECTION_LABEL}>完整排程 · 每日明细</p>
        <p className="text-sm text-muted-foreground">标记：★ 判定关卡 · 🍫 补给演练 · ⛰ 需要坡。周三 / 周日全休。</p>
        <RunnaWeekList />
      </div>

      <p className={cn(SECTION_LABEL, "mt-2")}>参考</p>

      <Section title={plan.twoNumbers.title}>
        <p className="text-sm">{plan.twoNumbers.intro}</p>
        <BulletList points={plan.twoNumbers.points} />
        <PlanNoteBlock note={{ kind: "callout", text: plan.twoNumbers.formula }} />
        <StackedRows
          columns={["周", "App 显示", "Runna 排 (B)", "实际跑 (A−B)", "超出"]}
          rows={plan.actuals.map((a) => [`${a.week}（${a.start}）`, a.display, String(a.planned), String(a.actual), a.over])}
        />
        <p className="text-sm font-medium">{plan.twoNumbers.average}</p>
        <PlanNoteBlock note={{ kind: "keep", text: plan.twoNumbers.good }} />
        <PlanNoteBlock note={{ kind: "warning", text: plan.twoNumbers.bad }} />
        <PlanNoteBlock note={{ kind: "warning", text: plan.twoNumbers.discipline }} />
      </Section>

      <Section title="第 1–4 周 · 三个从实录里读出来的东西">
        <p className="text-sm text-muted-foreground">{plan.actualsSummary}</p>
        {plan.readings.map((r) => <PlanNoteBlock key={r.title} note={{ kind: "reason", ...r }} />)}
      </Section>

      <Section title={plan.risk.title}>
        <PlanNoteBlock note={{ kind: "warning", text: plan.risk.text }} />
        <p className="text-sm font-medium">{plan.risk.changeTitle}</p>
        <p className="text-sm text-muted-foreground">{plan.risk.changeIntro}</p>
        <StackedRows
          columns={["日期", "建议改成", "预估时长", "作用"]}
          rows={changedDays.map(({ week, day }) => [
            `${monthDay(runnaDayDate(week, day.day))}（W${week}） · Runna 原排 ${day.change!.from}`,
            day.change!.to,
            day.change!.duration,
            day.change!.purpose,
          ])}
        />
        <p className="text-sm text-muted-foreground">{plan.risk.after}</p>
        <PlanNoteBlock note={{ kind: "callout", text: plan.risk.escape }} />
        <PlanNoteBlock note={{ kind: "keep", text: plan.risk.rest }} />
      </Section>

      <Section title={plan.gates.title}>
        <p className="text-sm font-medium">{plan.gates.intro}</p>
        {(["preview", "main", "review"] as RunnaGateKey[]).map((k) => <GateTable key={k} gateKey={k} />)}
      </Section>

      <Section title={plan.fueling.title}>
        <p className="text-sm">{plan.fueling.intro}</p>
        <p className="text-sm text-muted-foreground">{plan.fueling.why}</p>
        <p className="text-sm text-muted-foreground">{plan.fueling.opportunities}</p>
        <PlanNoteBlock note={{ kind: "callout", text: plan.fueling.callout }} />
        <StackedRows columns={["项", "方案", "说明"]} rows={plan.fueling.rows.map((r) => [r.item, r.plan, r.note])} />
      </Section>

      <Section title={plan.hills.title}>
        <p className="text-sm">{plan.hills.intro}</p>
        <PlanNoteBlock note={{ kind: "callout", text: plan.hills.principle }} />
        <StackedRows
          columns={["日期", "跑步机方案", "平地方案"]}
          rows={hillDays.map(({ week, day }) => [
            `${monthDay(runnaDayDate(week, day.day))}（W${week} ${day.day === "mon" ? "一" : "五"}） · ${day.run!.name} ${day.run!.km}km`,
            day.alternative!.treadmill,
            day.alternative!.flat,
          ])}
        />
        <PlanNoteBlock note={{ kind: "reason", text: plan.hills.distinction }} />
        <p className="text-sm font-medium">五种替代方式（按优先级）</p>
        <StackedRows columns={["方式", "做法", "说明"]} rows={plan.hills.methods.map((m) => [`${m.rank} · ${m.method}`, m.how, m.note])} />
      </Section>

      <Section title={plan.raceWeek.title}>
        <p className="text-sm text-muted-foreground">{plan.raceWeek.intro}</p>
        <StackedRows columns={["日期", "安排", "要点"]} rows={plan.raceWeek.rows.map((r) => [r.date, r.plan, r.point])} />
      </Section>

      <Section title="两个小调整 · 游泳">
        {plan.adjustments.map((a) => <PlanNoteBlock key={a.title} note={{ kind: "reason", ...a }} />)}
      </Section>

      <Section title="附注">
        <p className="text-sm text-muted-foreground">{plan.footnote.source}</p>
        <BulletList points={plan.footnote.relations} />
        <p className="text-sm">{plan.footnote.strength}</p>
      </Section>

      <Link to="/plan/hansons">
        <Card className="transition-colors hover:bg-accent active:bg-accent">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">汉森 · 2026 Tokyo 参考课表</p>
              <p className="text-sm text-muted-foreground">18 周完整体系存档，现在不执行</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
