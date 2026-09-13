// keep:    exercise unchanged
// replace: original exercise swapped for `to`
// modify:  same exercise, adjusted parameter described by `note` (e.g. "降 60–70%")
export type PlanChange = "keep" | "replace" | "modify";

export type PlanDay = "mon" | "tue" | "sat";

export type PlanNoteKind = "reason" | "keep" | "callout" | "warning";

export interface PlanExercise {
  name:       string;
  change:     PlanChange;
  to?:        string;
  note?:      string;
  highlight?: boolean;
}

export interface PlanBlock {
  sets:      number;
  exercises: PlanExercise[];
}

export interface PlanNote {
  kind:   PlanNoteKind;
  title?: string;
  text:   string;   // may contain line breaks
}

export interface PlanSession {
  day:         PlanDay;
  movedFrom?:  "thu";
  title:       string;
  alsoUsedIn?: number[];
  summary:     string;
  blocks:      PlanBlock[];
  notes:       PlanNote[];
}

export interface PlanWeek {
  week:     number;
  subtitle: string;
  focus:    string;
  notes?:   PlanNote[];
  sessions: PlanSession[];
}

export interface ReplacementRule {
  from:  string;
  count: string;
  to:    string;
  why:   string;
}

export interface TrainingPlan {
  name:            string;
  summary:         string;
  totalWeeks:      number;
  scheduleNote:    string;
  placeholderNote: string;
  criteria:        { title: string; text: string }[];
  principle:       string;
  rulesNote:       string;
  rules:           ReplacementRule[];
  gaps:            { title: string; text: string }[];
  pushPull:        { session: string; ratio: string; best?: boolean }[];
  pushPullRule:    string;
  strengths:       { area: string; exercises: string }[];
  strengthsNote:   string;
  trend:           { text: string; items: string[] };
  weeks:           PlanWeek[];
}
