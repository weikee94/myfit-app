import {
  addMonths, addWeeks, addYears, differenceInCalendarMonths, eachDayOfInterval, eachMonthOfInterval,
  endOfMonth, endOfWeek, endOfYear, format, isAfter, isBefore, parseISO, startOfDay, startOfMonth, startOfWeek,
  startOfYear,
} from "date-fns";
import type { Workout, WorkoutType } from "@/types/workout";

// Pure helpers behind the Progress page (period totals, trend chart, records, achievements).
// `date` is a plain yyyy-MM-dd column, so it's parsed with parseISO to stay in local time.

export type RangeKind   = "week" | "month" | "year" | "all";
export type SportFilter = WorkoutType | "all";

const WEEK = { weekStartsOn: 1 as const };

export function workoutDate(w: Workout): Date {
  return parseISO(w.date);
}

export function filterBySport(workouts: Workout[], sport: SportFilter): Workout[] {
  return sport === "all" ? workouts : workouts.filter((w) => w.type === sport);
}

export interface Totals { distanceKm: number; minutes: number; count: number }

export function totals(workouts: Workout[]): Totals {
  return workouts.reduce<Totals>(
    (t, w) => ({
      distanceKm: t.distanceKm + (w.distance_km ?? 0),
      minutes:    t.minutes + (w.duration_minutes ?? 0),
      count:      t.count + 1,
    }),
    { distanceKm: 0, minutes: 0, count: 0 },
  );
}

// ── Periods ────────────────────────────────────────────────────────────────

export interface Period { start: Date; end: Date; label: string }

function periodAt(kind: Exclude<RangeKind, "all">, offset: number, now: Date): Period {
  if (kind === "week") {
    const start = startOfWeek(addWeeks(now, -offset), WEEK);
    const end   = endOfWeek(start, WEEK);
    const label = offset === 0 ? "This Week" : offset === 1 ? "Last Week" : `${format(start, "MMM d")} – ${format(end, "MMM d")}`;
    return { start, end, label };
  }
  if (kind === "month") {
    const start = startOfMonth(addMonths(now, -offset));
    const label = offset === 0 ? "This Month" : offset === 1 ? "Last Month" : format(start, "MMMM yyyy");
    return { start, end: endOfMonth(start), label };
  }
  const start = startOfYear(addYears(now, -offset));
  const label = offset === 0 ? "This Year" : offset === 1 ? "Last Year" : format(start, "yyyy");
  return { start, end: endOfYear(start), label };
}

/** Selectable periods, newest first, going back to the first workout (at least one). */
export function periodOptions(kind: Exclude<RangeKind, "all">, first: Date | null, now = new Date()): Period[] {
  const options: Period[] = [];
  for (let offset = 0; offset < 60; offset++) {
    const p = periodAt(kind, offset, now);
    if (offset > 0 && (!first || isBefore(p.end, first))) break;
    options.push(p);
  }
  return options;
}

export function inPeriod(workouts: Workout[], start: Date, end: Date): Workout[] {
  return workouts.filter((w) => {
    const d = workoutDate(w);
    return !isBefore(d, startOfDay(start)) && !isAfter(d, end);
  });
}

// ── Trend chart buckets ──────────────────────────────────────────────────────

export interface TrendPoint { key: string; label: string; tooltip: string; value: number }

/**
 * One point per day (week / month) or per month (year / all). Buckets after today are
 * dropped so the line stops at today, like the current-week view in the reference design.
 */
export function trendBuckets(
  workouts: Workout[], kind: RangeKind, start: Date, end: Date, metric: (w: Workout) => number, now = new Date(),
): TrendPoint[] {
  const last = isAfter(end, now) ? now : end;
  const daily = kind === "week" || kind === "month";

  const slots = daily
    ? eachDayOfInterval({ start, end: last })
    : eachMonthOfInterval({ start, end: last });

  const points: TrendPoint[] = slots.map((d) => ({
    key:     format(d, daily ? "yyyy-MM-dd" : "yyyy-MM"),
    label:   kind === "week" ? format(d, "EEEEE") : kind === "month" ? format(d, "d") : kind === "year" ? format(d, "MMMMM") : format(d, "MMM"),
    tooltip: format(d, daily ? "EEE, MMM d" : "MMMM yyyy"),
    value:   0,
  }));
  const index = new Map(points.map((p, i) => [p.key, i]));

  for (const w of workouts) {
    const i = index.get(format(workoutDate(w), daily ? "yyyy-MM-dd" : "yyyy-MM"));
    if (i !== undefined) points[i].value += metric(w);
  }
  return points;
}

/** Start of the "All" range: the first workout's month (or this month with no data). */
export function allTimeStart(first: Date | null, now = new Date()): Date {
  if (!first) return startOfMonth(now);
  // Keep at least two points so a line can be drawn.
  return differenceInCalendarMonths(now, first) < 1 ? startOfMonth(addMonths(now, -1)) : startOfMonth(first);
}

/** Round an axis max up to 1, 2 or 5 × 10^n so the mid gridline is a clean number. */
export function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp  = Math.pow(10, Math.floor(Math.log10(value)));
  const step = [1, 2, 5, 10].find((m) => m * exp >= value)!;
  return step * exp;
}

// ── Personal records ─────────────────────────────────────────────────────────

export const RECORD_DISTANCES = [
  { id: "1mi",  short: "MI",   label: "1MI",      km: 1.609344 },
  { id: "2mi",  short: "2MI",  label: "2MI",      km: 3.218688 },
  { id: "5k",   short: "5K",   label: "5K",       km: 5 },
  { id: "10k",  short: "10K",  label: "10K",      km: 10 },
  { id: "half", short: "HM",   label: "Half",     km: 21.0975 },
  { id: "full", short: "M",    label: "Marathon", km: 42.195 },
] as const;

export interface PersonalRecord {
  id:      string;
  short:   string;
  label:   string;
  seconds: number | null;
  date:    string | null;
}

function paceSecPerKm(w: Workout): number | null {
  if (w.avg_pace_sec_per_km) return w.avg_pace_sec_per_km;
  if (w.duration_minutes && w.distance_km) return (w.duration_minutes * 60) / w.distance_km;
  return null;
}

/**
 * MyFit stores one distance + duration per run (no GPS splits), so a record is estimated as
 * the fastest average pace among runs at least that long, projected onto the distance.
 * 2% slack lets a GPS-measured 4.95 km count as a 5K.
 */
export function personalRecords(runs: Workout[]): PersonalRecord[] {
  return RECORD_DISTANCES.map((d) => {
    let best: { seconds: number; date: string } | null = null;
    for (const w of runs) {
      const pace = paceSecPerKm(w);
      if (!pace || (w.distance_km ?? 0) < d.km * 0.98) continue;
      const seconds = Math.round(pace * d.km);
      if (!best || seconds < best.seconds) best = { seconds, date: w.date };
    }
    return { id: d.id, short: d.short, label: d.label, seconds: best?.seconds ?? null, date: best?.date ?? null };
  });
}

// ── Achievements ─────────────────────────────────────────────────────────────

export type AchievementTone = "strength" | "run" | "bike" | "swim" | "gold";

export interface Achievement {
  id:     string;
  title:  string;
  badge:  string;
  tone:   AchievementTone;
  icon:   WorkoutType;
  date:   string | null;   // null = not yet earned
}

interface Series {
  id: string; tone: AchievementTone; icon: WorkoutType; noun: string;
  tiers: number[]; workouts: Workout[];
}

/**
 * For each series: the highest tier earned, plus the next one to chase (shown locked).
 * Single-run distance milestones work the same way, ending with an ultra (50K).
 */
export function achievements(all: Workout[]): Achievement[] {
  const asc = [...all].sort((a, b) => a.date.localeCompare(b.date));
  const byType = (t: WorkoutType) => asc.filter((w) => w.type === t);

  const series: Series[] = [
    { id: "strength", tone: "strength", icon: "strength", noun: "sessions", tiers: [10, 25, 50, 100, 250], workouts: byType("strength") },
    { id: "run",      tone: "run",      icon: "run",      noun: "runs",     tiers: [10, 50, 100, 250, 500], workouts: byType("run") },
    { id: "bike",     tone: "bike",     icon: "bike",     noun: "rides",    tiers: [10, 50, 100, 250],      workouts: byType("bike") },
    { id: "swim",     tone: "swim",     icon: "swim",     noun: "swims",    tiers: [10, 50, 100, 250],      workouts: byType("swim") },
  ];

  const out: Achievement[] = [];
  for (const s of series) {
    const earned = s.tiers.filter((n) => s.workouts.length >= n);
    const top    = earned[earned.length - 1];
    const next   = s.tiers.find((n) => s.workouts.length < n);
    if (top) out.push({ id: `${s.id}-${top}`, title: `${top} ${s.noun}`, badge: String(top), tone: s.tone, icon: s.icon, date: s.workouts[top - 1].date });
    // Only tease the next tier for sports the user actually does.
    if (next && s.workouts.length > 0) out.push({ id: `${s.id}-${next}`, title: `${next} ${s.noun}`, badge: String(next), tone: s.tone, icon: s.icon, date: null });
  }

  const longRuns = [
    { km: 21.0975, badge: "HM",  title: "Half Marathon" },
    { km: 42.195,  badge: "M",   title: "Marathon" },
    { km: 50,      badge: "50K", title: "Ultra Marathon" },
  ];
  const runs = byType("run");
  let lockedShown = false;
  for (const r of longRuns) {
    const first = runs.find((w) => (w.distance_km ?? 0) >= r.km * 0.98);
    if (!first && lockedShown) continue;
    if (!first) lockedShown = true;
    out.push({ id: `long-${r.badge}`, title: r.title, badge: r.badge, tone: "gold", icon: "run", date: first?.date ?? null });
  }

  // Earned first (newest first), then locked.
  return out.sort((a, b) => (a.date && b.date ? b.date.localeCompare(a.date) : a.date ? -1 : b.date ? 1 : 0));
}

// ── Formatting ───────────────────────────────────────────────────────────────

export function formatKm(km: number): string {
  if (km === 0) return "0km";
  return km >= 100 ? `${Math.round(km).toLocaleString()}km` : `${Number(km.toFixed(km >= 10 ? 1 : 2))}km`;
}

export function formatHoursMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return h === 0 ? `${m}m` : `${h.toLocaleString()}h ${m}m`;
}

export function formatRecord(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return h > 0 ? `${h}h ${m}m ${s}s` : `${m}m ${s}s`;
}

export function formatClock(minutes: number): string {
  const total = Math.round(minutes * 60);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`;
}

export function formatPaceShort(secPerKm: number): string {
  const s = Math.round(secPerKm);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")} /km`;
}

export function avgPace(w: Workout): number | null {
  return paceSecPerKm(w);
}
