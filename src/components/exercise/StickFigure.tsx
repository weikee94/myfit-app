import { useId, useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { muscleLabels, stickFigureSvg, type StickFigureSpec } from "@/lib/stickFigure";

// The SVG markup is built from our own static pose data (never user input) by the same function the
// offline review page uses, so innerHTML here is safe and what was reviewed is what renders.
export default function StickFigure({ spec, label }: { spec: StickFigureSpec; label: string }) {
  const id = useId();
  const muscles = muscleLabels(spec);
  const muscleDescription = muscles.length ? ` · 珊瑚色标示${muscles.join("、")}参与发力区域` : "";
  const reduced = usePrefersReducedMotion();
  const animated = useMemo(() => stickFigureSvg(spec, { idPrefix: `${id}-motion` }), [spec, id]);
  const stills = useMemo(() => [0, 1].map((i) => stickFigureSvg(spec, { keyframe: i, idPrefix: `${id}-still-${i}` })), [spec, id]);

  return (
    <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl border border-strength/10 bg-[hsl(var(--athlete-stage))]">
      <div className="flex items-center justify-between px-4 pt-3 text-xs font-medium text-muted-foreground">
        <span>动作示意</span>
        <span className="rounded-full border border-strength/10 bg-background/60 px-2 py-1">
          {spec.viewLabel ?? (spec.view === "front" ? "正面" : "侧面")}
        </span>
      </div>
      {reduced ? (
        <div className="grid grid-cols-2 gap-2 p-3">
          {stills.map((svg, i) => (
            <div key={i}>
              <div
                role="img"
                aria-label={`${label} · ${spec.keyframeLabels?.[i] ?? `姿势 ${i + 1}`}${muscleDescription}`}
                className="aspect-square"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
              <p className="pb-1 text-center text-xs text-muted-foreground">{spec.keyframeLabels?.[i] ?? `姿势 ${i + 1}`}</p>
            </div>
          ))}
        </div>
      ) : (
        <div
          role="img"
          aria-label={`${label} · 示意动画${muscleDescription}`}
          className="aspect-square w-full"
          dangerouslySetInnerHTML={{ __html: animated }}
        />
      )}
      {muscles.length > 0 && (
        <div className="mx-4 mb-4 border-t border-strength/10 pt-3">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-[#f2786c]" />
            参与发力 · {muscles.join("、")}
          </p>
          <p className="mt-1 pl-[18px] text-xs text-muted-foreground">肌肉区域示意 · 包含动作与稳定支撑</p>
        </div>
      )}
    </div>
  );
}
