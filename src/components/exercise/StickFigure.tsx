import { useMemo } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { stickFigureSvg, type StickFigureSpec } from "@/lib/stickFigure";

// The SVG markup is built from our own static pose data (never user input) by the same function the
// offline review page uses, so innerHTML here is safe and what was reviewed is what renders.
export default function StickFigure({ spec, label }: { spec: StickFigureSpec; label: string }) {
  const reduced = usePrefersReducedMotion();
  const animated = useMemo(() => stickFigureSvg(spec), [spec]);
  const stills = useMemo(() => [0, 1].map((i) => stickFigureSvg(spec, { keyframe: i })), [spec]);

  if (reduced) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {stills.map((svg, i) => (
          <div
            key={i}
            role="img"
            aria-label={`${label} · 姿势 ${i + 1}`}
            className="aspect-square rounded-lg bg-muted/50 p-1 text-foreground"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`${label} · 示意动画`}
      className="mx-auto aspect-square w-full max-w-[280px] rounded-lg bg-muted/50 p-1 text-foreground"
      dangerouslySetInnerHTML={{ __html: animated }}
    />
  );
}
