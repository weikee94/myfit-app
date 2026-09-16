import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import StickFigure from "@/components/exercise/StickFigure";
import { BADMINTON_PRACTICES } from "@/data/plans/badmintonPractice";
import { findStickFigure } from "@/data/stickFigures";

export default function BadmintonPracticePlan() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl font-bold">羽毛球技术练习</h2>
        <p className="text-sm text-muted-foreground">先把准备和架拍连成一个稳定动作，再加入挥拍与击球。</p>
      </div>

      {BADMINTON_PRACTICES.map((practice) => {
        const spec = findStickFigure(practice.athleteKey);
        if (!spec) return null;
        return (
          <Card key={practice.id}>
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 gap-3">
                  <span className="font-mono text-sm font-semibold text-strength">{practice.number}</span>
                  <div>
                    <h3 className="font-semibold">{practice.title}</h3>
                    <p className="text-sm text-muted-foreground">{practice.subtitle}</p>
                  </div>
                </div>
                <Badge variant="secondary" className="shrink-0">{practice.handedness}</Badge>
              </div>

              <StickFigure spec={spec} label={`${practice.title} · ${practice.subtitle}`} />

              <div className="flex items-center justify-center gap-2 text-sm font-medium" aria-label={`动作阶段：${practice.stages.join("至")}`}>
                <span className="rounded-full bg-strength/15 px-3 py-1.5 text-strength">{practice.stages[0]}</span>
                <span aria-hidden className="text-muted-foreground">→</span>
                <span className="rounded-full bg-strength/15 px-3 py-1.5 text-strength">{practice.stages[1]}</span>
              </div>

              <ol className="flex flex-col gap-2">
                {practice.cues.map((cue) => (
                  <li key={cue.stage} className="grid grid-cols-[3rem_1fr] gap-2 text-sm">
                    <span className="font-medium text-strength">{cue.stage}</span>
                    <span className="text-muted-foreground">{cue.text}</span>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
