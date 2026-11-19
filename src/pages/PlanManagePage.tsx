import { format, parseISO } from "date-fns";
import MedalBadge from "@/components/progress/MedalBadge";
import { RUNNA_PLAN_META as meta } from "@/data/plans/runnaMain";

function Row({ label, value, badge }: { label: string; value: string; badge?: string }) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4">
      {badge && <MedalBadge size={44}><span className="text-xs">{badge}</span></MedalBadge>}
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-lg">{value}</p>
      </div>
    </div>
  );
}

function Section({ title, intro, children }: { title: string; intro?: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        {intro && <p className="text-muted-foreground">{intro}</p>}
      </div>
      {children}
    </section>
  );
}

// Read-only mirror of the plan's Runna settings; they're changed in Runna and copied into runnaMain.ts.
export default function PlanManagePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-4">
        <MedalBadge shape="shield" tone="race" size={72}><span className="text-lg">42.2</span></MedalBadge>
        <div>
          <h2 className="text-2xl font-bold">{meta.name}</h2>
          <p className="text-muted-foreground">Race: {format(parseISO(meta.raceDate), "MMM d, yyyy")}</p>
        </div>
      </div>

      <Section title="Training Preferences" intro="How much training ramps up, and how hard the hard runs feel.">
        {meta.preferences.map((p) => <Row key={p.label} {...p} />)}
      </Section>

      <Section title="Current race times" intro="A shorter and a longer race time; the race-time estimate is based on these.">
        {meta.raceTimes.map((r) => <Row key={r.label} label={r.label} value={`${r.time} - ${r.km === 10 ? "10km" : "Half Marathon"}`} badge={r.badge} />)}
      </Section>

      <Section title="Running schedule">
        {meta.schedule.map((p) => <Row key={p.label} {...p} />)}
      </Section>

      <Section title="Recovery">
        <Row label="After race day" value={meta.recovery} />
      </Section>

      <p className="text-sm text-muted-foreground">These settings mirror the plan in the Runna app. Change them there, then update them here.</p>
    </div>
  );
}
