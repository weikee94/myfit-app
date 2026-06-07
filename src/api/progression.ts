import { supabase } from "@/lib/supabase";
import type { ProgressionRuleRow, ProgressionRuleInsert } from "@/types/database";

export async function fetchProgressionRule(userId: string, exerciseId: string): Promise<ProgressionRuleRow | null> {
  const { data, error } = await supabase
    .from("progression_rules")
    .select("*")
    .eq("user_id", userId)
    .eq("exercise_id", exerciseId)
    .maybeSingle();
  if (error) throw error;
  return data as ProgressionRuleRow | null;
}

export async function upsertProgressionRule(rule: ProgressionRuleInsert): Promise<ProgressionRuleRow> {
  const { data, error } = await supabase
    .from("progression_rules")
    .upsert(rule as object, { onConflict: "user_id,exercise_id" })
    .select()
    .single();
  if (error) throw error;
  return data as ProgressionRuleRow;
}

export async function updateCurrentWeight(ruleId: string, weightKg: number): Promise<void> {
  const { error } = await supabase
    .from("progression_rules")
    .update({ current_weight_kg: weightKg, last_incremented_at: new Date().toISOString() } as object)
    .eq("id", ruleId);
  if (error) throw error;
}
