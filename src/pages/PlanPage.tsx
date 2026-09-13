import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import HansonsPaceChart from "@/components/plan/HansonsPaceChart";
import { cn } from "@/lib/utils";
import { RUNNA_MARATHON_PLAN as plan } from "@/data/plans/runnaMarathon";

const SECTION_LABEL = "mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground";

function WeekList() {
  const weekNumbers = Array.from({ length: plan.totalWeeks }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm text-muted-foreground">{plan.scheduleNote}</p>
      {weekNumbers.map((n) => {
        const week = plan.weeks.find((w) => w.week === n);

        if (!week) {
          return (
            <div key={n} className="flex items-center gap-3 rounded-xl border border-dashed px-4 py-3 text-muted-foreground">
              <span className="w-8 text-sm font-semibold">W{n}</span>
              <span className="text-sm">待补充 · {plan.placeholderNote}</span>
            </div>
          );
        }

        return (
          <Link key={n} to={`/plan/${n}`}>
            <Card className="transition-colors hover:bg-accent">
              <CardContent className="flex items-center gap-3 p-4">
                <span className="w-8 text-sm font-semibold">W{n}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{week.sessions.map((s) => s.title).join(" · ")}</p>
                  <p className="text-xs text-muted-foreground">{week.subtitle} · <span className="text-strength">{week.focus}</span></p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

function RulesReference() {
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>判断标准</p>
          <ol className="flex list-decimal flex-col gap-1 pl-5 text-sm">
            {plan.criteria.map((c) => (
              <li key={c.title}>
                <span className="font-medium">{c.title}</span>
                {c.text && <span className="text-muted-foreground"> —— {c.text}</span>}
              </li>
            ))}
          </ol>
          <p className="mt-3 text-sm text-muted-foreground">{plan.principle}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>统一替换规则</p>
          <p className="mb-3 whitespace-pre-line text-sm text-muted-foreground">{plan.rulesNote}</p>
          <div className="divide-y rounded-lg border">
            {plan.rules.map((r) => (
              <div key={r.from} className="flex flex-col gap-0.5 px-3 py-2 text-sm">
                <p>
                  <span className="font-medium">{r.from}</span>
                  <span className="text-muted-foreground"> · {r.count}</span>
                </p>
                <p className="font-medium text-strength">→ {r.to}</p>
                <p className="text-xs text-muted-foreground">{r.why}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <p className={cn(SECTION_LABEL, "mb-0")}>两条系统性缺口</p>
          {plan.gaps.map((g) => (
            <div key={g.title}>
              <p className="text-sm font-medium">{g.title}</p>
              <p className="whitespace-pre-line text-sm text-muted-foreground">{g.text}</p>
            </div>
          ))}
          <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-lg border px-3 py-2 text-sm">
            {plan.pushPull.map((p) => (
              <div key={p.session} className={cn("contents", p.best && "font-semibold text-run")}>
                <span>{p.session}</span>
                <span className="text-right tabular-nums">{p.ratio}{p.best && " ← 最平衡"}</span>
              </div>
            ))}
          </div>
          <p className="text-sm">{plan.pushPullRule}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>Runna 做得好的地方（一个都不要动）</p>
          <div className="flex flex-col gap-2">
            {plan.strengths.map((s) => (
              <div key={s.area} className="text-sm">
                <p className="font-medium">{s.area}</p>
                <p className="text-muted-foreground">{s.exercises}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-sm">{plan.strengthsNote}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>趋势观察</p>
          <p className="whitespace-pre-line text-sm text-muted-foreground">{plan.trend.text}</p>
          <ol className="mt-2 list-decimal pl-5 text-sm">
            {plan.trend.items.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}

export default function PlanPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">{plan.name}</h2>
        <p className="text-sm text-muted-foreground">{plan.summary}</p>
      </div>

      <Tabs defaultValue="weeks">
        <TabsList className="w-full">
          <TabsTrigger value="weeks" className="flex-1">Weeks</TabsTrigger>
          <TabsTrigger value="rules" className="flex-1">Rules</TabsTrigger>
          <TabsTrigger value="paces" className="flex-1">Paces</TabsTrigger>
        </TabsList>
        <TabsContent value="weeks" className="mt-4"><WeekList /></TabsContent>
        <TabsContent value="rules" className="mt-4"><RulesReference /></TabsContent>
        <TabsContent value="paces" className="mt-4"><HansonsPaceChart /></TabsContent>
      </Tabs>
    </div>
  );
}
