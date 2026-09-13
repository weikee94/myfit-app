import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, PlayCircle } from "lucide-react";
import ExerciseDemoSheet from "@/components/exercise/ExerciseDemoSheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { PlanNoteBlock } from "@/components/plan/PlanSessionCard";
import { cn } from "@/lib/utils";
import { BEN_WORKOUTS as ben, timestampUrl, type BenMove, type BenMoveStatus } from "@/data/plans/benWorkouts";

const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wide text-muted-foreground";

const STATUS: Record<BenMoveStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  keep:     { label: "✅ 保留", variant: "secondary" },
  core:     { label: "⭐ 核心", variant: "run" },
  optional: { label: "⚠️ 可选", variant: "outline" },
  skip:     { label: "❌ 跳过", variant: "outline" },
};

function Timestamp({ videoUrl, time }: { videoUrl: string; time?: string }) {
  if (!time) return null;
  const href = timestampUrl(videoUrl, time);
  const className = "w-11 shrink-0 pt-0.5 text-xs tabular-nums";
  return href ? (
    <a href={href} target="_blank" rel="noreferrer" className={cn(className, "text-strength underline-offset-2 hover:underline")}>
      {time}
    </a>
  ) : (
    <span className={cn(className, "text-muted-foreground")}>{time}</span>
  );
}

function MoveRow({ move: m, videoUrl }: { move: BenMove; videoUrl: string }) {
  const [open, setOpen] = useState(false);
  const skipped = m.status === "skip";

  return (
    <div className={cn("flex items-start gap-3 px-3 py-2", skipped && "text-muted-foreground")}>
      <Timestamp videoUrl={videoUrl} time={m.time} />
      {/* Name block opens the demo; the timestamp link stays a separate tap target */}
      <button type="button" onClick={() => setOpen(true)} className="min-h-11 min-w-0 flex-1 rounded-md text-left transition-colors active:bg-accent md:min-h-0">
        <p className={cn("inline text-sm", m.highlight && "font-semibold", skipped && "line-through")}>{m.name}</p>
        <PlayCircle className="ml-1.5 inline h-3.5 w-3.5 align-[-2px] text-muted-foreground" aria-hidden />
        {m.trains && <p className="text-sm text-muted-foreground">{m.trains}</p>}
      </button>
      {m.duration && <span className="shrink-0 pt-0.5 text-xs tabular-nums text-muted-foreground">{m.duration}</span>}
      {m.status && <Badge variant={STATUS[m.status].variant} className="shrink-0">{STATUS[m.status].label}</Badge>}
      <ExerciseDemoSheet name={m.name} open={open} onOpenChange={setOpen} />
    </div>
  );
}

function MoveList({ moves, videoUrl = "" }: { moves: BenMove[]; videoUrl?: string }) {
  return (
    <div className="divide-y rounded-lg border">
      {moves.map((m) => <MoveRow key={`${m.time ?? ""}${m.name}`} move={m} videoUrl={videoUrl} />)}
    </div>
  );
}

export default function BenWorkoutsPage() {
  const navigate = useNavigate();
  const { circuit, core } = ben;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h2 className="flex-1 text-xl font-bold">Ben 专属 · 两套</h2>
        <Badge variant="strength">跟练</Badge>
      </div>

      <div className="-mt-2 flex flex-col gap-1">
        <p className="text-sm text-muted-foreground">{ben.subtitle}</p>
        <p className="text-sm">{ben.intro}</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {ben.overview.map((o) => (
          <Card key={o.name}>
            <CardContent className="flex flex-col gap-1 p-3 text-sm">
              <p className="font-semibold">{o.name}</p>
              <p className={cn("font-medium", o.hard ? "text-destructive" : "text-run")}>疲劳 · {o.fatigue}</p>
              <p className="text-sm text-muted-foreground">{o.slot}</p>
              <p className="text-sm text-muted-foreground">{o.frequency}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="-mt-2 text-sm font-medium">{ben.overviewNote}</p>

      {/* ① Strength circuit */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <h3 className="font-semibold">{circuit.title}</h3>

          <p className={SECTION_LABEL}>原版（照搬版本）</p>
          <p className="-mt-2 text-sm text-muted-foreground">{circuit.original.format}</p>
          <MoveList moves={circuit.original.moves} videoUrl={circuit.videoUrl} />

          <p className={SECTION_LABEL}>两处必改</p>
          {circuit.changes.map((c) => <PlanNoteBlock key={c.title} note={{ kind: "reason", ...c }} />)}

          <p className={SECTION_LABEL}>改后版本 · {circuit.modified.duration}</p>
          <p className="-mt-2 text-sm">{circuit.modified.intro}</p>
          <MoveList moves={circuit.modified.moves} />
          <p className="text-sm text-muted-foreground">{circuit.modified.format}</p>
        </CardContent>
      </Card>

      {/* ② Core workout */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <h3 className="font-semibold">{core.title}</h3>
          <p className="text-sm text-muted-foreground">{core.structure}</p>

          {core.groups.map((g) => (
            <div key={g.name} className="flex flex-col gap-1.5">
              <p className={SECTION_LABEL}>{g.name}</p>
              <MoveList moves={g.moves} videoUrl={core.videoUrl} />
            </div>
          ))}

          <PlanNoteBlock note={{ kind: "reason", ...core.whySkipB }} />
          <PlanNoteBlock note={{ kind: "keep", text: core.dGroupNote }} />
          <PlanNoteBlock note={{ kind: "callout", text: core.tip }} />

          <p className={SECTION_LABEL}>{core.followAlong.title}</p>
          <p className="-mt-2 text-sm">{core.followAlong.intro}</p>
          <div className="divide-y rounded-lg border">
            {core.followAlong.rows.map((r) => (
              <div key={r.order} className="flex gap-3 px-3 py-2 text-sm">
                <span className="w-11 shrink-0 font-semibold">{r.order}</span>
                <span>{r.text}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{core.followAlong.supplement}</p>
        </CardContent>
      </Card>

      {/* When to use which */}
      <Card>
        <CardContent className="p-4">
          <p className={cn(SECTION_LABEL, "mb-2")}>什么时候用哪套</p>
          <div className="divide-y rounded-lg border">
            {ben.usage.map((u) => (
              <div key={u.situation} className="flex flex-col gap-0.5 px-3 py-2 text-sm">
                <p className="font-medium">{u.situation}</p>
                <p className="text-strength">{u.which}</p>
                <p className="text-sm text-muted-foreground">{u.why}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fatigue */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4">
          <p className={SECTION_LABEL}>{ben.fatigueHeading}</p>
          <PlanNoteBlock note={{ kind: "warning", ...ben.fatigue[0] }} />
          <PlanNoteBlock note={{ kind: "keep", ...ben.fatigue[1] }} />
        </CardContent>
      </Card>
    </div>
  );
}
