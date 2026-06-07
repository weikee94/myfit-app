import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchProgressionRule, upsertProgressionRule, updateCurrentWeight } from "@/api/progression";
import { fetchLastSetsForExercise } from "@/api/workouts";
import { suggestNextWeight } from "@/algorithms/progressiveOverload";
import type { ProgressionRuleInsert } from "@/types/database";

export function useProgressionRule(userId: string, exerciseId: string) {
  return useQuery({
    queryKey: ["progression", userId, exerciseId],
    queryFn:  () => fetchProgressionRule(userId, exerciseId),
    enabled:  !!userId && !!exerciseId,
  });
}

export function useProgressionSuggestion(userId: string, exerciseId: string) {
  return useQuery({
    queryKey: ["progression-suggestion", userId, exerciseId],
    enabled:  !!userId && !!exerciseId,
    queryFn:  async () => {
      const rule = await fetchProgressionRule(userId, exerciseId);
      if (!rule) return null;

      const lastSets = await fetchLastSetsForExercise(exerciseId, userId);
      const suggestion = suggestNextWeight(
        lastSets.map((s) => ({ ...s, rir: s.rir ?? null })),
        {
          strategy:              rule.strategy,
          rep_range_min:         rule.rep_range_min,
          rep_range_max:         rule.rep_range_max,
          target_sets:           rule.target_sets,
          rpe_threshold:         rule.rpe_threshold,
          weight_increment_kg:   rule.weight_increment_kg,
          sessions_between_incr: rule.sessions_between_incr,
        },
        rule.current_weight_kg ?? 0
      );
      return { rule, suggestion };
    },
  });
}

export function useUpsertProgressionRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (rule: ProgressionRuleInsert) => upsertProgressionRule(rule),
    onSuccess:  (_, vars) => qc.invalidateQueries({ queryKey: ["progression", vars.user_id, vars.exercise_id] }),
  });
}

export function useUpdateCurrentWeight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ ruleId, weight }: { ruleId: string; weight: number }) =>
      updateCurrentWeight(ruleId, weight),
    onSuccess:  () => qc.invalidateQueries({ queryKey: ["progression"] }),
  });
}
