import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RaceEstimate from "@/components/runna-plan/RaceEstimate";
import SessionSquare from "@/components/runna-plan/SessionSquare";
import { RUNNA_MAIN } from "@/data/plans/runnaMain";
import { RUN_TYPES, type RunType } from "@/lib/runnaPlan";

const TYPES: RunType[] = ["easy", "intervals", "tempo", "hills", "long", "strength"];

const NOTE_LINKS = [
  { to: "/plan/notes?tab=runs",      label: "Running plan notes",   sub: "Gates, fueling, no-hill alternatives, race week" },
  { to: "/plan/notes?tab=weeks",     label: "Strength plan",        sub: "Week-by-week strength sessions and changes" },
  { to: "/plan/notes?tab=rules",     label: "Rules",                sub: "Replacement rules and push/pull balance" },
  { to: "/plan/notes?tab=paces",     label: "Pace chart",           sub: "Hansons pace reference" },
  { to: "/plan/notes?tab=badminton", label: "羽球",                  sub: "Badminton practice" },
];

export default function PlanOverviewPage() {
  return (
    <Tabs defaultValue="structure" className="flex flex-col gap-5">
      <TabsList className="w-full">
        <TabsTrigger value="structure" className="flex-1">Structure</TabsTrigger>
        <TabsTrigger value="methodology" className="flex-1">Methodology</TabsTrigger>
      </TabsList>

      <TabsContent value="structure" className="mt-0 flex flex-col gap-5">
        <div>
          <h2 className="text-lg font-bold">Learn more about your plan</h2>
          <p className="mt-2 text-muted-foreground">View your estimated race time and understand the different types of runs in your plan.</p>
        </div>
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <RaceEstimate title="Estimated Marathon Time" />
        </section>
        <h3 className="mt-2 text-lg font-bold">Types of run</h3>
        <div className="flex flex-col gap-3">
          {TYPES.map((t) => (
            <details key={t} className="group rounded-2xl border bg-card shadow-sm">
              <summary className="flex cursor-pointer list-none items-center gap-4 p-5 [&::-webkit-details-marker]:hidden">
                <SessionSquare type={t} />
                <span className="flex-1 text-lg">{RUN_TYPES[t].label}</span>
                <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180" />
              </summary>
              <p className="px-5 pb-5 text-muted-foreground">{RUN_TYPES[t].about}</p>
            </details>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="methodology" className="mt-0 flex flex-col gap-5">
        <section className="rounded-3xl border bg-card p-5 shadow-sm">
          <p className="mb-3 font-bold">{RUNNA_MAIN.pacesTitle}</p>
          <div className="grid grid-cols-2 gap-2">
            {RUNNA_MAIN.paces.map((p) => (
              <div key={p.key} className="rounded-xl bg-muted/60 px-3 py-2">
                <p className="text-xs text-muted-foreground">{p.label}</p>
                <p className="font-semibold tabular-nums">{p.pace}</p>
              </div>
            ))}
          </div>
        </section>
        <div className="flex flex-col gap-3">
          {NOTE_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className="flex items-center gap-3 rounded-2xl border bg-card p-5 shadow-sm hover:bg-accent/40">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{l.label}</p>
                <p className="text-sm text-muted-foreground">{l.sub}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
}
