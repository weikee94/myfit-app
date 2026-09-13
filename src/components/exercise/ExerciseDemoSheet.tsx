import { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { findDemo, youtubeSearchUrl } from "@/data/exerciseDemos";

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

// free-exercise-db ships two photos per exercise (start / end position); alternating them reads like a GIF.
function DemoFrames({ dbId, label }: { dbId: string; label: string }) {
  const reduced = usePrefersReducedMotion();
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const timer = window.setInterval(() => setFrame((f) => 1 - f), 1000);
    return () => window.clearInterval(timer);
  }, [reduced]);

  const src = (i: number) => `/exercises/${dbId}/${i}.jpg`;
  const alt = (i: number) => `${label} · ${i === 0 ? "起始姿势" : "结束姿势"}`;

  if (reduced) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {[0, 1].map((i) => (
          <img key={i} src={src(i)} alt={alt(i)} className="aspect-[4/3] w-full rounded-lg bg-white object-contain" />
        ))}
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-white">
      {[0, 1].map((i) => (
        <img
          key={i}
          src={src(i)}
          alt={alt(i)}
          className={cn("absolute inset-0 h-full w-full object-contain transition-opacity duration-300", frame === i ? "opacity-100" : "opacity-0")}
        />
      ))}
    </div>
  );
}

interface Props {
  name:         string;
  original?:    string;   // for replaced exercises: the Runna original, viewable from the sheet
  open:         boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ExerciseDemoSheet({ name, original, open, onOpenChange }: Props) {
  const [showing, setShowing] = useState(name);

  useEffect(() => {
    if (open) setShowing(name);
  }, [open, name]);

  const demo = findDemo(showing);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Bottom sheet on phones, centered dialog from md up */}
      <DialogContent className="bottom-0 top-auto max-h-[90dvh] translate-y-0 gap-3 overflow-y-auto rounded-t-xl pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:bottom-auto md:top-[50%] md:translate-y-[-50%] md:rounded-lg md:pb-6">
        <DialogTitle className="pr-10 text-base leading-snug">{showing}</DialogTitle>

        {original && (
          <p className="text-sm text-muted-foreground">
            {showing === name ? (
              <>替换了原动作 <button type="button" onClick={() => setShowing(original)} className="text-strength underline underline-offset-2">{original}</button></>
            ) : (
              <>这是 Runna 原动作 · <button type="button" onClick={() => setShowing(name)} className="text-strength underline underline-offset-2">看替换后的 {name}</button></>
            )}
          </p>
        )}

        {demo.dbId ? (
          <DemoFrames dbId={demo.dbId} label={showing} />
        ) : (
          <p className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">暂无免费示范图，点下方看 YouTube 示范。</p>
        )}

        <a
          href={youtubeSearchUrl(demo.query)}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: demo.dbId ? "outline" : "default" }), "w-full gap-2")}
        >
          <Play className="h-4 w-4" />
          YouTube 示范
        </a>

        {demo.dbId && demo.instructions && demo.instructions.length > 0 && (
          <details>
            <summary className="cursor-pointer text-sm font-medium">动作说明（英文 · {demo.dbName}）</summary>
            <ol className="mt-2 flex list-decimal flex-col gap-1 pl-5 text-sm text-muted-foreground">
              {demo.instructions.map((step) => <li key={step}>{step}</li>)}
            </ol>
          </details>
        )}

        {demo.dbId && <p className="text-xs text-muted-foreground">照片：free-exercise-db（public domain）· {demo.dbName}</p>}
      </DialogContent>
    </Dialog>
  );
}
