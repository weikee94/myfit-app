import { Card, CardContent } from "@/components/ui/card";
import { HANSONS_SCHEDULE_RULES, HANSONS_TERMS, HANSONS_WORKOUT_NOTES } from "@/data/plans/hansonsNotes";

const SECTION_LABEL = "mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground";

export function BulletList({ points }: { points: string[] }) {
  return (
    <ul className="flex list-disc flex-col gap-1 pl-5 text-sm text-muted-foreground marker:text-strength">
      {points.map((p) => <li key={p}>{p}</li>)}
    </ul>
  );
}

export default function HansonsNotes() {
  return (
    <>
      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>课表重点</p>
          <div className="flex flex-col gap-4">
            {HANSONS_WORKOUT_NOTES.map((w) => (
              <div key={w.title}>
                <p className="mb-1 text-sm font-medium">{w.title}</p>
                <BulletList points={w.points} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>术语解说</p>
          <code className="mb-3 block break-words rounded-md bg-muted px-2.5 py-2 font-mono text-sm">{HANSONS_TERMS.example}</code>
          <dl className="flex flex-col gap-2 text-sm">
            {HANSONS_TERMS.terms.map((t) => (
              <div key={t.term}>
                <dt className="break-words font-mono text-sm font-semibold">{t.term}</dt>
                <dd className="text-muted-foreground">{t.meaning}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className={SECTION_LABEL}>训练日调换原则</p>
          <p className="mb-2 text-sm">{HANSONS_SCHEDULE_RULES.intro}</p>
          <BulletList points={HANSONS_SCHEDULE_RULES.points} />
        </CardContent>
      </Card>
    </>
  );
}
