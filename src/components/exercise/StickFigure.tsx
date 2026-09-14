import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { stickFigureSvg, type StickFigureSpec } from "@/lib/stickFigure";

// The SVG markup is built from our own static pose data (never user input) by the same function the
// offline review page uses, so innerHTML here is safe and what was reviewed is what renders.
export default function StickFigure({ spec, label }: { spec: StickFigureSpec; label: string }) {
  const reduced = usePrefersReducedMotion();
  const animated = useMemo(() => stickFigureSvg(spec), [spec]);
  const stills = useMemo(() => [0, 1].map((i) => stickFigureSvg(spec, { keyframe: i })), [spec]);

  return (
    <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-strength/10 bg-[hsl(var(--athlete-stage))]">
      <div className="flex items-center justify-between px-4 pt-3 text-xs font-medium text-muted-foreground">
        <span>动作示意</span>
        <span className="rounded-full border border-strength/10 bg-background/60 px-2 py-1">
          {spec.view === "front" ? "正面" : "侧面"}
        </span>
      </div>
      {reduced ? (
        <div className="grid grid-cols-2 gap-2 p-3">
          {stills.map((svg, i) => (
            <div key={i}>
              <div
                role="img"
                aria-label={`${label} · 姿势 ${i + 1}`}
                className="aspect-square"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <p className="pb-1 text-center text-xs text-muted-foreground">姿势 {i + 1}</p>
            </div>
          ))}
        </div>
      ) : (
        <div
          role="img"
          aria-label={`${label} · 示意动画`}
          className="aspect-square w-full"
          dangerouslySetInnerHTML={{ __html: animated }}
        />
      )}
    </div>
  );
}
