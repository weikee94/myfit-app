import { Footprints } from "lucide-react";
import MedalBadge from "./MedalBadge";
import SectionHeader from "./SectionHeader";
import { formatDate } from "@/lib/utils";
import { formatRecord, type PersonalRecord } from "@/lib/progressStats";

export default function PersonalRecords({ records }: { records: PersonalRecord[] }) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeader title="Personal Records" />
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {records.map((r) => {
          const earned = r.seconds !== null;
          return (
            <div key={r.id} className="flex w-[31%] min-w-[104px] shrink-0 flex-col items-center gap-1 text-center">
              <MedalBadge earned={earned} size={84}>
                <span className="text-2xl leading-none">{r.short}</span>
                <Footprints className="mt-1 h-4 w-4" />
              </MedalBadge>
              <p className="mt-2 font-bold">{r.label}</p>
              <p className="font-bold tabular-nums">{earned ? formatRecord(r.seconds!) : "--"}</p>
              <p className="text-sm text-muted-foreground">{r.date ? formatDate(r.date) : "Not yet"}</p>
            </div>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        Estimated from the best average pace of runs at least this long.
      </p>
    </section>
  );
}
