import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import WeekSummaryCard from "@/components/dashboard/WeekSummaryCard";
import RecentWorkoutsWidget from "@/components/dashboard/RecentWorkoutsWidget";
import TrainingLoadChart from "@/components/dashboard/TrainingLoadChart";
import { useDashboard } from "@/hooks/useDashboard";
import { useWorkouts } from "@/hooks/useWorkouts";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { summary, recentWorkouts, isLoading } = useDashboard();
  const { data: allWorkouts = [] } = useWorkouts();

  if (isLoading) {
    return <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Good work 💪</h2>
        <Button size="sm" onClick={() => navigate("/workouts/new")}>
          <Plus className="mr-1 h-4 w-4" /> Log Workout
        </Button>
      </div>

      <WeekSummaryCard data={summary} />
      <RecentWorkoutsWidget workouts={recentWorkouts} />
      <TrainingLoadChart workouts={allWorkouts} />
    </div>
  );
}
