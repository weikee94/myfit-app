import { Bike, Dumbbell, Footprints, Waves } from "lucide-react";
import MedalBadge from "./MedalBadge";
import SectionHeader from "./SectionHeader";
import { formatDate } from "@/lib/utils";
import type { Achievement } from "@/lib/progressStats";
import type { WorkoutType } from "@/types/workout";

const ICON: Record<WorkoutType, typeof Bike> = { strength: Dumbbell, run: Footprints, bike: Bike, swim: Waves };

export default function Achievements({ items }: { items: Achievement[] }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeader title="Achievements" />
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Log your first workouts to start earning badges.</p>
      ) : (
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {items.map((a) => {
            const Icon   = ICON[a.icon];
            const earned = a.date !== null;
            const milestone = a.tone !== "gold";
            return (
              <div key={a.id} className="flex w-[31%] min-w-[104px] shrink-0 flex-col items-center gap-1 text-center">
                <MedalBadge shape={milestone && earned ? "shield" : "hex"} tone={a.tone} earned={earned} size={84}>
                  {milestone && earned ? (
                    <>
                      <span className="text-2xl leading-none">{a.badge}</span>
                      <Icon className="mt-1 h-7 w-7" strokeWidth={2.5} />
                    </>
                  ) : (
                    <span className="text-2xl leading-none">{a.badge}</span>
                  )}
                </MedalBadge>
                <p className={earned ? "mt-2 font-bold" : "mt-2 font-bold text-muted-foreground"}>{a.title}</p>
                {earned && <p className="text-sm text-muted-foreground">{formatDate(a.date!)}</p>}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
