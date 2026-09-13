import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import HansonsSchedule from "@/components/plan/HansonsSchedule";
import { RUNNA_MAIN } from "@/data/plans/runnaMain";

export default function HansonsSchedulePage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4" /></Button>
        <h2 className="flex-1 text-xl font-bold">汉森 · 2026 Tokyo</h2>
        <Badge variant="secondary">参考</Badge>
      </div>
      <p className="-mt-2 text-sm text-muted-foreground">{RUNNA_MAIN.footnote.relations[1]}</p>
      <HansonsSchedule />
    </div>
  );
}
