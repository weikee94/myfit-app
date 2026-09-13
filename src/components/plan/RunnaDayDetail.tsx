import { Badge } from "@/components/ui/badge";
import { PlanNoteBlock } from "@/components/plan/PlanSessionCard";
import { RUNNA_MAIN, RUNNA_MARK_LABELS, type RunnaDay, type RunnaGateKey, type RunnaMark } from "@/data/plans/runnaMain";

const MARK_VARIANT: Record<RunnaMark, React.ComponentProps<typeof Badge>["variant"]> = {
  gate: "strength",
  fuel: "bike",
  hill: "outline",
};

export function MarkBadges({ marks }: { marks?: RunnaMark[] }) {
  if (!marks?.length) return null;
  return (
    <div className="flex flex-wrap gap-1">
      {marks.map((m) => <Badge key={m} variant={MARK_VARIANT[m]}>{RUNNA_MARK_LABELS[m]}</Badge>)}
    </div>
  );
}

export function ChangeLine({ day }: { day: RunnaDay }) {
  if (!day.change) return null;
  return (
    <p className="flex flex-wrap items-center gap-x-1.5 text-sm">
      <span className="text-muted-foreground line-through">{day.change.from}</span>
      <span aria-label="建议改成">→</span>
      <span className="font-medium text-strength">{day.change.to}</span>
      <span className="text-muted-foreground">· 预估 {day.change.duration} · {day.change.purpose}</span>
    </p>
  );
}

// Table rows stacked as label/value lines so they fit a phone screen.
export function StackedRows({ columns, rows }: { columns: string[]; rows: string[][] }) {
  return (
    <div className="divide-y rounded-lg border">
      {rows.map((row, i) => (
        <div key={i} className="flex flex-col gap-0.5 px-3 py-2 text-sm">
          {row.map((cell, j) => (
            <p key={j} className={j === 0 ? "font-medium" : "text-muted-foreground"}>
              {j > 0 && <span className="text-xs">{columns[j]}：</span>}
              {cell}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}

export function GateTable({ gateKey }: { gateKey: RunnaGateKey }) {
  const gate = RUNNA_MAIN.gates.items[gateKey];
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-sm font-medium">{gate.title}</p>
      <p className="text-sm text-muted-foreground">{gate.desc}</p>
      <StackedRows columns={gate.columns} rows={gate.rows} />
    </div>
  );
}

// Everything attached to a day besides the run itself: ⛰ alternative, ★ gate, 🍫 fueling, notes.
export function DayExtras({ day }: { day: RunnaDay }) {
  return (
    <div className="flex flex-col gap-3">
      {day.alternative && (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">⛰ 无坡替代</p>
          <StackedRows
            columns={["", "方案"]}
            rows={[["跑步机", day.alternative.treadmill], ["平地", day.alternative.flat]]}
          />
        </div>
      )}
      {day.gate && <GateTable gateKey={day.gate} />}
      {day.marks?.includes("fuel") && (
        <div className="flex flex-col gap-1.5">
          <p className="text-sm font-medium">🍫 补给</p>
          {RUNNA_MAIN.fueling.rows.slice(0, 2).map((r) => (
            <p key={r.item} className="text-sm">
              <span className="font-medium">{r.item}：{r.plan}</span>
              <span className="text-muted-foreground"> · {r.note}</span>
            </p>
          ))}
        </div>
      )}
      {day.notes?.map((n) => <PlanNoteBlock key={n} note={{ kind: "callout", text: n }} />)}
    </div>
  );
}
