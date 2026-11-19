import { format, isAfter, isBefore, parseISO, startOfDay } from "date-fns";
import {
  RUNNA_DAY_KEYS, RUNNA_EARLY_WEEKS, RUNNA_MAIN, RUNNA_PLAN_META, findRunnaToday, runnaDayDate,
  type RunnaDay, type RunnaRun,
} from "@/data/plans/runnaMain";
import type { Workout } from "@/types/workout";

// View model for the Runna-style plan pages: sessions per week, their run type and colour,
// and which ones are done (matched against completed MyFit workouts).

export const TOTAL_WEEKS = 17;

export type RunType = "easy" | "intervals" | "tempo" | "hills" | "long" | "race" | "strength";

export const RUN_TYPES: Record<RunType, { label: string; gradient: string; color: string; about: string }> = {
  easy:      { label: "Easy Run",  color: "#84cc16", gradient: "linear-gradient(135deg,#65a30d,#facc15)", about: "Conversational pace (E 6:45–7:10/km). Builds the aerobic base and recovers between hard days. Most of the weekly volume." },
  intervals: { label: "Intervals", color: "#ef4444", gradient: "linear-gradient(135deg,#dc2626,#f97316)", about: "Short, fast repeats with recoveries (mile, 1km, on/off, fartlek). Raise VO₂max and running economy." },
  tempo:     { label: "Tempo",     color: "#f59e0b", gradient: "linear-gradient(135deg,#f97316,#facc15)", about: "Comfortably hard, sustained efforts (T 5:20–5:30/km), including progressive and over/under runs. Lift the lactate threshold." },
  hills:     { label: "Hills",     color: "#15803d", gradient: "linear-gradient(135deg,#14532d,#4ade80)", about: "Uphill repeats for leg strength and power with low impact. On flat ground, use the no-hill alternative in the session details." },
  long:      { label: "Long Run",  color: "#8b5cf6", gradient: "linear-gradient(135deg,#a855f7,#6d28d9)", about: "The key marathon session (L 6:30–7:00/km). Builds endurance and is where fueling and race pace get rehearsed." },
  race:      { label: "Race",      color: "#dc2626", gradient: "linear-gradient(135deg,#7f1d1d,#ef4444)", about: "Race day." },
  strength:  { label: "Strength",  color: "#2563eb", gradient: "linear-gradient(135deg,#3b82f6,#1e3a8a)", about: "Runner-specific strength to stay robust under the mileage." },
};

export function runType(run: RunnaRun): RunType {
  if (run.kind === "race") return "race";
  if (run.kind === "long") return "long";
  if (run.kind === "easy") return "easy";
  if (/hill/i.test(run.name)) return "hills";
  if (/repeat|on off|fartlek|interval/i.test(run.name) && !/tempo/i.test(run.name)) return "intervals";
  return "tempo";
}

export interface PlanSession {
  id:    string;
  week:  number;
  date:  Date;
  day:   RunnaDay;
  type:  RunType;
  title: string;
  km?:   number;
  done:  boolean;
}

export interface PlanWeek {
  week:        number;
  start:       Date;            // first plan day of the week (W1 starts mid-week)
  end:         Date;
  plannedKm:   number;
  doneKm:      number;
  sessions:    PlanSession[];
  sessionCount: number;         // may exceed sessions.length when the day schedule isn't known
  doneCount:   number;
  cutback?:    boolean;
  peak?:       boolean;
  hasSchedule: boolean;
}

function sessionsFor(week: number, days: RunnaDay[]): Omit<PlanSession, "done">[] {
  const out: Omit<PlanSession, "done">[] = [];
  const ordered = [...days].sort((a, b) => RUNNA_DAY_KEYS.indexOf(a.day) - RUNNA_DAY_KEYS.indexOf(b.day));
  for (const day of ordered) {
    const date = runnaDayDate(week, day.day);
    if (day.run) {
      const type = runType(day.run);
      const title = day.run.kind === "easy" ? "Easy Run" : day.run.name;
      out.push({ id: `${week}-${day.day}-run`, week, date, day, type, title, km: day.run.km });
    }
    if (day.strength) out.push({ id: `${week}-${day.day}-strength`, week, date, day, type: "strength", title: day.strength });
  }
  return out;
}

const dayKey = (d: Date) => format(d, "yyyy-MM-dd");

/** Builds all 17 weeks and marks sessions done from completed workouts (same day first, then anywhere in the week). */
export function buildPlanWeeks(workouts: Workout[]): PlanWeek[] {
  const firstDay = parseISO(RUNNA_PLAN_META.firstDay);
  const weeks: PlanWeek[] = [];

  for (let n = 1; n <= TOTAL_WEEKS; n++) {
    const monday = runnaDayDate(n, "mon");
    const start  = isBefore(monday, firstDay) ? firstDay : monday;
    const end    = runnaDayDate(n, "sun");
    const early  = RUNNA_EARLY_WEEKS.find((w) => w.week === n);
    const full   = RUNNA_MAIN.weeks.find((w) => w.week === n);
    const days   = full?.days ?? early?.days ?? [];
    const raw    = sessionsFor(n, days);

    const inWeek = workouts.filter((w) => {
      const d = parseISO(w.date);
      return !isBefore(d, startOfDay(monday)) && !isAfter(d, end);
    });

    // Match each session to one workout of its kind.
    const used = new Set<string>();
    const kind = (s: Omit<PlanSession, "done">) => (s.type === "strength" ? "strength" : "run");
    const take = (s: Omit<PlanSession, "done">, sameDay: boolean) => {
      const hit = inWeek.find((w) => !used.has(w.id) && w.type === kind(s) && (!sameDay || w.date === dayKey(s.date)));
      if (hit) used.add(hit.id);
      return Boolean(hit);
    };
    const done = new Map<string, boolean>();
    for (const s of raw) done.set(s.id, take(s, true));
    for (const s of raw) if (!done.get(s.id)) done.set(s.id, take(s, false));

    const sessions = raw.map((s) => ({ ...s, done: done.get(s.id)! }));
    const sessionCount = Math.max(early?.sessions ?? 0, sessions.length);
    const doneCount = sessions.length === sessionCount
      ? sessions.filter((s) => s.done).length
      // Schedule unknown: count logged workouts, capped at the planned number.
      : Math.min(sessionCount, inWeek.filter((w) => w.type === "run" || w.type === "strength").length);

    weeks.push({
      week: n, start, end,
      plannedKm:   full?.km ?? early?.km ?? 0,
      doneKm:      inWeek.filter((w) => w.type === "run").reduce((t, w) => t + (w.distance_km ?? 0), 0),
      sessions, sessionCount, doneCount,
      cutback: full?.cutback, peak: full?.peak,
      hasSchedule: sessions.length === sessionCount && sessions.length > 0,
    });
  }
  return weeks;
}

export function currentWeekNumber(now = new Date()): number {
  const t = findRunnaToday(now);
  return t.status === "in-plan" ? t.week : t.status === "before" ? 1 : TOTAL_WEEKS;
}

export function isToday(d: Date, now = new Date()): boolean {
  return dayKey(d) === dayKey(now);
}

export function weekRangeLabel(w: PlanWeek): string {
  return `${format(w.start, "d MMM")} - ${format(w.end, "d MMM")}`;
}

/** Rough duration from the plan's pace bands; quality sessions vary too much to estimate. */
export function durationRange(s: PlanSession): string | null {
  const band: Partial<Record<RunType, [number, number]>> = { easy: [405, 430], long: [390, 420] };
  const b = band[s.type];
  if (!b || !s.km) return null;
  const m = (sec: number, round: (x: number) => number) => {
    const total = round((sec * s.km!) / 60 / 5) * 5;
    return total >= 60 ? `${Math.floor(total / 60)}h ${total % 60}m` : `${total}m`;
  };
  return `${m(b[0], Math.floor)} - ${m(b[1], Math.ceil)}`;
}

// ── Race-time estimate ───────────────────────────────────────────────────────

function parseTime(t: string): number {
  return t.split(":").map(Number).reduce((acc, n) => acc * 60 + n, 0);
}

export function formatHms(sec: number): string {
  const s = Math.round(sec);
  return `${Math.floor(s / 3600)}:${String(Math.floor((s % 3600) / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

/** Riegel (T2 = T1 × (D2/D1)^1.06) from each entered race time; the range spans the predictions. */
export function estimatedRaceRange(targetKm = RUNNA_PLAN_META.raceKm): { low: number; high: number } {
  const predictions = RUNNA_PLAN_META.raceTimes.map((r) => parseTime(r.time) * Math.pow(targetKm / r.km, 1.06));
  return { low: Math.min(...predictions), high: Math.max(...predictions) };
}

export function weeksUntilRace(now = new Date()): number {
  const race = parseISO(RUNNA_PLAN_META.raceDate);
  return Math.max(0, Math.ceil((race.getTime() - startOfDay(now).getTime()) / (7 * 86_400_000)));
}
