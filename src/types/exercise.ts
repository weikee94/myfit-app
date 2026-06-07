import type { ExerciseRow, ExerciseInsert, ProgressionRuleRow, ProgressionRuleInsert } from "./database";

export type Exercise           = ExerciseRow;
export type { ExerciseInsert };
export type ExerciseCategory   = "swim" | "bike" | "run" | "strength";
export type ProgressionRule    = ProgressionRuleRow;
export type { ProgressionRuleInsert };
