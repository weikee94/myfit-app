export interface SetRecord {
  set_number:  number;
  actual_reps: number | null;
  weight_kg:   number | null;
  rpe:         number | null;
  rir:         number | null;
  completed:   boolean;
}

export interface ProgressionRuleInput {
  strategy:              "double_progression" | "linear" | "wave_loading" | "custom";
  rep_range_min:         number;
  rep_range_max:         number;
  target_sets:           number;
  rpe_threshold:         number;
  weight_increment_kg:   number;
  sessions_between_incr: number;
}

export type ProgressionDecision = "increase" | "maintain" | "decrease" | "insufficient_data";

export interface ProgressionSuggestion {
  decision:            ProgressionDecision;
  suggested_weight_kg: number;
  reason:              string;
  confidence:          "high" | "medium" | "low";
}

// Double progression: promote only when all target sets hit top of rep range at acceptable RPE.
export function calculateDoubleProgression(
  lastSessionSets: SetRecord[],
  rule: ProgressionRuleInput,
  currentWeight: number
): ProgressionSuggestion {
  const completed = lastSessionSets.filter((s) => s.completed && s.actual_reps !== null);

  if (completed.length === 0) {
    return {
      decision: "insufficient_data",
      suggested_weight_kg: currentWeight,
      reason: "No completed sets found. Log a session to unlock progression suggestions.",
      confidence: "low",
    };
  }

  if (completed.length < rule.target_sets) {
    return {
      decision: "maintain",
      suggested_weight_kg: currentWeight,
      reason: `Only ${completed.length}/${rule.target_sets} sets completed. Keep ${currentWeight} kg and aim to finish all sets.`,
      confidence: "medium",
    };
  }

  // Any set below rep range minimum → reduce weight
  const anyUndershoot = completed.some((s) => (s.actual_reps ?? 0) < rule.rep_range_min);
  if (anyUndershoot) {
    const newWeight = Math.max(0, +(currentWeight - rule.weight_increment_kg).toFixed(2));
    return {
      decision: "decrease",
      suggested_weight_kg: newWeight,
      reason: `At least one set fell below ${rule.rep_range_min} reps. Reduce by ${rule.weight_increment_kg} kg and rebuild.`,
      confidence: "high",
    };
  }

  const allHitMax = completed.every((s) => (s.actual_reps ?? 0) >= rule.rep_range_max);

  // RPE / RIR cross-check — missing data defaults to allowing progression
  const allAcceptableEffort = completed.every((s) => {
    if (s.rpe !== null) return s.rpe <= rule.rpe_threshold;
    // RIR 0 = RPE 10, RIR 2 = RPE 8 → infer equivalent RPE
    if (s.rir !== null) return s.rir >= Math.round(10 - rule.rpe_threshold);
    return true;
  });

  if (allHitMax && allAcceptableEffort) {
    const newWeight = +(currentWeight + rule.weight_increment_kg).toFixed(2);
    return {
      decision: "increase",
      suggested_weight_kg: newWeight,
      reason: `All ${completed.length} sets hit ${rule.rep_range_max}+ reps at RPE ≤ ${rule.rpe_threshold}. Ready to add ${rule.weight_increment_kg} kg.`,
      confidence: "high",
    };
  }

  return {
    decision: "maintain",
    suggested_weight_kg: currentWeight,
    reason: `Reps are in the ${rule.rep_range_min}–${rule.rep_range_max} range. Aim to complete all sets at ${rule.rep_range_max} before increasing.`,
    confidence: "high",
  };
}

// Linear: add increment every N sessions, regardless of reps.
export function calculateLinearProgression(
  sessionsSinceLastIncrement: number,
  rule: ProgressionRuleInput,
  currentWeight: number
): ProgressionSuggestion {
  if (sessionsSinceLastIncrement >= rule.sessions_between_incr) {
    const newWeight = +(currentWeight + rule.weight_increment_kg).toFixed(2);
    return {
      decision: "increase",
      suggested_weight_kg: newWeight,
      reason: `${sessionsSinceLastIncrement} session(s) since last increment. Add ${rule.weight_increment_kg} kg.`,
      confidence: "high",
    };
  }
  const remaining = rule.sessions_between_incr - sessionsSinceLastIncrement;
  return {
    decision: "maintain",
    suggested_weight_kg: currentWeight,
    reason: `${remaining} more session(s) before next increment.`,
    confidence: "high",
  };
}

// Public entry point — routes to the correct strategy.
export function suggestNextWeight(
  lastSessionSets: SetRecord[],
  rule: ProgressionRuleInput,
  currentWeight: number,
  sessionsSinceLastIncrement = 0
): ProgressionSuggestion {
  switch (rule.strategy) {
    case "double_progression":
      return calculateDoubleProgression(lastSessionSets, rule, currentWeight);
    case "linear":
      return calculateLinearProgression(sessionsSinceLastIncrement, rule, currentWeight);
    default:
      return calculateDoubleProgression(lastSessionSets, rule, currentWeight);
  }
}
