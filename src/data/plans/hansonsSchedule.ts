// Hansons 18-week schedule for the 2026 Tokyo Marathon, transcribed from the user's sheet
// as a reference (original dates kept). Labels converted from Traditional to Simplified.
// Dates are not stored per day: the sheet's 126 days are consecutive from startDate.

export type HansonsRunType = "easy" | "speed" | "strength" | "tempo" | "long" | "rest" | "race";

export interface HansonsDay {
  type:     HansonsRunType;
  label:    string;
  workout?: string;
  km?:      number;
  warning?: string;   // sheet value kept as-is, but it doesn't add up
}

export interface HansonsWeek {
  week:     number;
  weeklyKm: number;   // copied from the sheet, not summed here
  days:     HansonsDay[];   // Monday → Sunday
}

const easy     = (km: number): HansonsDay => ({ type: "easy", label: "轻松有氧", workout: `${km}k Easy`, km });
const long     = (km: number): HansonsDay => ({ type: "long", label: "长跑", workout: `${km}k Long run`, km });
const speed    = (workout: string, km: number): HansonsDay => ({ type: "speed", label: "速度跑", workout, km });
const strength = (workout: string, km: number): HansonsDay => ({ type: "strength", label: "强化跑", workout, km });
const tempo    = (workout: string, km: number): HansonsDay => ({ type: "tempo", label: "节奏跑", workout, km });
const rest: HansonsDay = { type: "rest", label: "休息日" };

const SPEED_12x400  = "2k WU+12x(400m@5-10k pace+400m jog rest)+2k CD";
const SPEED_8x600   = "2k WU+8x(600m@5-10k pace+400m jog rest)+2k CD";
const SPEED_5x1000  = "2k WU+5x(1000m@5-10k pace+400m jog rest)+2k CD";
const SPEED_3x2000  = "2k WU+3x(2000m@5-10k pace+800m jog rest)+2k CD";
const SPEED_4x1200  = "2k WU+4x(1200m@5-10k pace+400m jog rest)+2k CD";
const SPEED_6x800   = "2k WU+6x(800m@5-10k pace+400m jog rest)+2k CD";
const STR_6x2000    = "2k WU+6x(2000m@MP-10s pace+400m jog rest)+2k CD";
const STR_4x2000    = "2k WU+4x(2000m@MP-10s pace+800m jog rest)+2k CD";
const STR_3x3000    = "2k WU+3x(3000m@MP-10s pace+800m jog rest)+2k CD";
const STR_2x5000    = "2k WU+2x(5000m@MP-10s pace+2k jog rest)+2k CD";
const TEMPO = (k: number) => `2k WU+${k}k Tempo@MP + 2k CD`;

export const HANSONS_SCHEDULE = {
  name:      "2026 Tokyo Marathon",
  raceDate:  "2026-03-01",
  startDate: "2025-10-27",
  goal:      "4:00",
  notes: [
    "参照训练配速表可以知道各个课表的速度",
    "如果跑量无法这么高，可以等比例降低每个课表的长度",
  ],
  weeks: [
    { week: 1,  weeklyKm: 60,    days: [easy(10), easy(10), rest, easy(10), easy(10), easy(10), easy(10)] },
    { week: 2,  weeklyKm: 66.6,  days: [easy(10), speed(SPEED_12x400, 13.6), rest, easy(10), easy(10), easy(10), easy(13)] },
    { week: 3,  weeklyKm: 73,    days: [easy(10), speed(SPEED_8x600, 12), rest, tempo(TEMPO(10), 14), easy(11), easy(10), long(16)] },
    { week: 4,  weeklyKm: 74,    days: [easy(10), speed(SPEED_5x1000, 11), rest, tempo(TEMPO(10), 14), easy(10), easy(13), long(16)] },
    { week: 5,  weeklyKm: 78,    days: [easy(10), speed(SPEED_5x1000, 11), rest, tempo(TEMPO(10), 14), easy(11), easy(13), long(19)] },
    { week: 6,  weeklyKm: 76.4,  days: [easy(10), speed(SPEED_3x2000, 12.4), rest, tempo(TEMPO(11), 15), easy(10), easy(13), easy(16)] },
    { week: 7,  weeklyKm: 84.4,  days: [easy(10), speed(SPEED_3x2000, 12.4), rest, tempo(TEMPO(11), 15), easy(11), easy(13), long(23)] },
    { week: 8,  weeklyKm: 84.4,  days: [easy(10), speed(SPEED_4x1200, 10.4), rest, tempo(TEMPO(11), 15), easy(10), easy(16), long(23)] },
    { week: 9,  weeklyKm: 89,    days: [easy(13), speed(SPEED_5x1000, 11), rest, tempo(TEMPO(13), 17), easy(11), easy(13), long(24)] },
    { week: 10, weeklyKm: 80.2,  days: [easy(10), speed(SPEED_6x800, 11.2), rest, tempo(TEMPO(13), 17), easy(10), easy(16), long(16)] },
    { week: 11, weeklyKm: 98.4,  days: [easy(13), strength(STR_6x2000, 18.4), rest, tempo(TEMPO(13), 17), easy(11), easy(13), long(26)] },
    { week: 12, weeklyKm: 85.2,  days: [easy(10), strength(STR_4x2000, 15.2), rest, tempo(TEMPO(14), 18), easy(10), easy(16), long(16)] },
    {
      week: 13, weeklyKm: 100.2,
      days: [
        easy(13),
        { ...strength(STR_3x3000, 19.2), warning: "按课表文字 3x(3000m+800m) 算应为 15.4 km，表中写 19.2（W15 同一课表为 15.4；4x 才是 19.2）" },
        rest, tempo(TEMPO(14), 18), easy(11), easy(13), long(26),
      ],
    },
    { week: 14, weeklyKm: 88,    days: [easy(10), strength(STR_2x5000, 18), rest, tempo(TEMPO(14), 18), easy(10), easy(16), long(16)] },
    { week: 15, weeklyKm: 98.4,  days: [easy(13), strength(STR_3x3000, 15.4), rest, tempo(TEMPO(16), 20), easy(11), easy(13), long(26)] },
    { week: 16, weeklyKm: 87.2,  days: [easy(10), strength(STR_4x2000, 15.2), rest, tempo(TEMPO(16), 20), easy(10), easy(16), long(16)] },
    { week: 17, weeklyKm: 88.4,  days: [easy(13), strength(STR_6x2000, 18.4), rest, tempo(TEMPO(16), 20), easy(11), easy(13), easy(13)] },
    {
      week: 18, weeklyKm: 90.2,
      days: [
        easy(10), easy(8), rest, easy(10), easy(10),
        { ...easy(5), km: 10, warning: "课表写 5k Easy，公里数栏却是 10；本周跑量 90.2 按 10 计" },
        { type: "race", label: "", workout: "Race Day!", km: 42.2 },
      ],
    },
  ] as HansonsWeek[],
};

// Local-time date for a day in the schedule (week is 1-based, dayIndex 0 = Monday).
export function hansonsDayDate(week: number, dayIndex: number): Date {
  const [y, m, d] = HANSONS_SCHEDULE.startDate.split("-").map(Number);
  return new Date(y, m - 1, d + (week - 1) * 7 + dayIndex);
}
