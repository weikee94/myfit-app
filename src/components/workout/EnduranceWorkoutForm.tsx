import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { WorkoutInsert } from "@/types/database";

const schema = z.object({
  name:                z.string().optional(),
  date:                z.string().min(1, "Date is required"),
  duration_minutes:    z.number().positive().optional(),
  distance_km:         z.number().positive().optional(),
  avg_heart_rate:      z.number().int().positive().optional(),
  avg_pace_sec_per_km: z.number().positive().optional(),
  avg_power_watts:     z.number().positive().optional(),
  session_rpe:         z.number().min(1).max(10).optional(),
  notes:               z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  type:      "swim" | "bike" | "run";
  onSubmit:  (data: WorkoutInsert) => Promise<void>;
  isLoading?: boolean;
}

export default function EnduranceWorkoutForm({ type, onSubmit, isLoading }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  const handleValid = (d: FormData) =>
    onSubmit({
      type,
      date:                d.date,
      name:                d.name            ?? null,
      duration_minutes:    d.duration_minutes ?? null,
      distance_km:         d.distance_km      ?? null,
      avg_heart_rate:      d.avg_heart_rate   ?? null,
      avg_pace_sec_per_km: d.avg_pace_sec_per_km ?? null,
      avg_power_watts:     d.avg_power_watts  ?? null,
      session_rpe:         d.session_rpe      ?? null,
      notes:               d.notes            ?? null,
      user_id:             "",  // caller fills this in
    });

  return (
    <form onSubmit={handleSubmit(handleValid)} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Date</Label>
          <Input type="date" {...register("date")} />
          {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Duration (min)</Label>
          <Input type="number" placeholder="60" {...register("duration_minutes", { valueAsNumber: true })} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Distance (km)</Label>
          <Input type="number" step="0.01" placeholder="10" {...register("distance_km", { valueAsNumber: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Avg HR (bpm)</Label>
          <Input type="number" placeholder="145" {...register("avg_heart_rate", { valueAsNumber: true })} />
        </div>
      </div>

      {type === "bike" && (
        <div className="flex flex-col gap-1.5">
          <Label>Avg Power (watts)</Label>
          <Input type="number" placeholder="200" {...register("avg_power_watts", { valueAsNumber: true })} />
        </div>
      )}

      {(type === "run" || type === "swim") && (
        <div className="flex flex-col gap-1.5">
          <Label>{type === "swim" ? "Pace (sec/100m)" : "Pace (sec/km)"}</Label>
          <Input type="number" placeholder="300" {...register("avg_pace_sec_per_km", { valueAsNumber: true })} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <Label>Session RPE (1–10)</Label>
          <Input type="number" min={1} max={10} placeholder="7" {...register("session_rpe", { valueAsNumber: true })} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label>Name (optional)</Label>
          <Input placeholder="Easy Z2 run" {...register("name")} />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label>Notes</Label>
        <Input placeholder="How did it feel?" {...register("notes")} />
      </div>

      <Button type="submit" disabled={isLoading} className="mt-2">
        {isLoading ? "Saving…" : "Save Workout"}
      </Button>
    </form>
  );
}
