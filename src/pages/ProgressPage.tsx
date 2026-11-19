import { Fragment, useMemo } from "react";
import ActivityTrend from "@/components/progress/ActivityTrend";
import PersonalRecords from "@/components/progress/PersonalRecords";
import AllTimeStats from "@/components/progress/AllTimeStats";
import Achievements from "@/components/progress/Achievements";
import LatestActivity from "@/components/progress/LatestActivity";
import StrengthProgression from "@/components/progress/StrengthProgression";
import { useAllCompletedWorkouts } from "@/hooks/useWorkouts";
import { achievements, personalRecords, totals } from "@/lib/progressStats";

export default function ProgressPage() {
  const { data: workouts = [], isLoading } = useAllCompletedWorkouts();

  const records = useMemo(() => personalRecords(workouts.filter((w) => w.type === "run")), [workouts]);
  const badges  = useMemo(() => achievements(workouts), [workouts]);
  const allTime = useMemo(() => totals(workouts), [workouts]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12" role="status" aria-label="Loading progress">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  const sections = [
    <ActivityTrend key="trend" workouts={workouts} />,
    <PersonalRecords key="records" records={records} />,
    <AllTimeStats key="all-time" totals={allTime} />,
    <Achievements key="achievements" items={badges} />,
    <LatestActivity key="latest" workout={workouts[0]} />,
    <StrengthProgression key="strength" />,
  ];

  return (
    <div className="flex flex-col">
      <h2 className="mb-5 text-xl font-bold">Progress</h2>
      {sections.map((section, i) => (
        <Fragment key={i}>
          {i > 0 && <div className="-mx-4 my-8 h-2 bg-muted" aria-hidden />}
          {section}
        </Fragment>
      ))}
    </div>
  );
}
