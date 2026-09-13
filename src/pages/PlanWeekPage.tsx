import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PlanSessionCard, { PlanNoteBlock } from "@/components/plan/PlanSessionCard";
import { RUNNA_MARATHON_PLAN } from "@/data/plans/runnaMarathon";

export default function PlanWeekPage() {
  const { week } = useParams<{ week: string }>();
  const navigate = useNavigate();
  const data = RUNNA_MARATHON_PLAN.weeks.find((w) => w.week === Number(week));

  if (!data) return <p className="py-12 text-center text-muted-foreground">Week not found.</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h2 className="flex-1 text-xl font-bold">Week {data.week}</h2>
        <Badge variant="strength">{data.week} / {RUNNA_MARATHON_PLAN.totalWeeks}</Badge>
      </div>

      <p className="-mt-2 text-sm text-muted-foreground">{data.subtitle}</p>

      {data.notes?.map((note, i) => <PlanNoteBlock key={i} note={note} />)}

      {data.sessions.map((session) => (
        <PlanSessionCard key={session.day} session={session} />
      ))}
    </div>
  );
}
