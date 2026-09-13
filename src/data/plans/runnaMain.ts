// Runna main running plan for the 12/6 BYD Marathon (in progress), transcribed from runna-main-plan.md.
// Schedule from the Runna app plus three overlays Runna doesn't provide: ★ gates · 🍫 fueling · ⛰ no-hill alternatives.
// Wed / Sun are rest days and aren't stored; W1–W4 are completed actuals, W5–W17 the schedule.

export type RunnaDayKey  = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";
export type RunnaRunKind = "quality" | "easy" | "long" | "race";
export type RunnaMark    = "gate" | "fuel" | "hill";
export type RunnaGateKey = "preview" | "main" | "review";

export interface RunnaRun { name: string; km: number; kind: RunnaRunKind }

export interface RunnaDay {
  day:          RunnaDayKey;
  run?:         RunnaRun;
  strength?:    string;
  marks?:       RunnaMark[];
  change?:      { from: string; to: string; duration: string; purpose: string };
  alternative?: { treadmill: string; flat: string };
  gate?:        RunnaGateKey;
  notes?:       string[];
}

export interface RunnaWeek {
  week:      number;
  start:     string;
  km:        number;
  cutback?:  boolean;
  peak?:     boolean;
  longRun:   string;
  quality:   string;
  days:      RunnaDay[];
}

export const RUNNA_DAY_KEYS: RunnaDayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
export const RUNNA_WEEKDAY_LABELS: Record<RunnaDayKey, string> = {
  mon: "周一", tue: "周二", wed: "周三", thu: "周四", fri: "周五", sat: "周六", sun: "周日",
};
export const RUNNA_MARK_LABELS: Record<RunnaMark, string> = { gate: "★ 判定关卡", fuel: "🍫 补给演练", hill: "⛰ 需要坡" };

const PLAN_START  = "2026-08-10";   // W1 Monday
const TOTAL_WEEKS = 17;

const E = (day: RunnaDayKey, km: number, strength?: string): RunnaDay => ({ day, run: { name: "E", km, kind: "easy" }, strength });
const Q = (day: RunnaDayKey, name: string, km: number, strength?: string): RunnaDay => ({ day, run: { name, km, kind: "quality" }, strength });
const L = (day: RunnaDayKey, name: string, km: number): RunnaDay => ({ day, run: { name, km, kind: "long" } });

const ADJUSTMENTS = [
  { title: "第 14 周周一是全周最重的一天", text: "Legs & Core Endurance + Hill Repeats 7km 叠在一起，而且离周五的 33km 只隔三天。建议把腿部力量挪到周二，跟上肢换一下。" },
  { title: "长课后一天（周六）还有 5–6.5km。", text: "不是大问题，但如果那天腿沉，直接跳过比硬跑好 —— 周六那堂对整轮的贡献最小。" },
  { title: "晚上游泳可以，但只在 E 日。", text: "质量课日（周一）和长课日（周五）不游。轻松有氧 30–45 分钟，不做冲刺组。周三周日全休日游 30 分钟当主动恢复，是最好的位置。\n如果 10 月感觉吃力或静息心率上升，第一个砍的是游泳，不是跑量。" },
];

const RACE_WEEK = [
  { date: "11/30 周一", plan: "Ticking Over（仅力量）",   point: "轻负荷，不要练到力竭。这周力量只是维持，不追求刺激" },
  { date: "12/1 周二",  plan: "Race Pace Fartlek 5.5km", point: "唯一一堂带强度的课。MP 段跑 5:35–5:41，总量很小，目的是唤醒神经不是训练" },
  { date: "12/2 周三",  plan: "休息",                    point: "—" },
  { date: "12/3 周四",  plan: "6km Easy",                point: "最后一堂跑步。6:45–7:10，穿比赛鞋跑，确认没问题" },
  { date: "12/4–12/5",  plan: "完全休息",                point: "赛前 3 天开始肝糖超补。腿会觉得沉、发痒想跑，这是正常的，忍住" },
  { date: "12/6 周日",  plan: "BYD Marathon 42.2km",     point: "按 11/13 关卡的结果定出发配速。前 10km 一定要比感觉慢" },
];

const ESCAPE_VALVE = "逃生阀：如果 11/6 那堂跑得很吃力，直接把 11/13 砍到 26km 或按 3 小时封顶。连着两周硬扛超长课，是这轮最容易受伤的地方，而伤了就什么目标都没有了。";

export const RUNNA_MAIN = {
  title: "Runna 主线 · 12/6 全马",
  intro: [
    "正在执行的课表，由 Runna App 排定，17 周制，第 5–17 周为完整已确认排程。",
    "每周 5 跑 + 3 次力量，周三与周日全休。峰值 59km/周，最长课 33km —— 标准的 Sub-4 准备度。",
    "本文件在 Runna 原排程之上叠加三层它不提供的东西：判定关卡 · 补给演练 · 无坡替代。",
  ],

  pacesTitle: "配速 · 目标 Sub-4 · 5:41/km",
  paces: [
    { key: "E",  label: "E 轻松跑",     pace: "6:45–7:10" },
    { key: "L",  label: "L 长课",       pace: "6:30–7:00" },
    { key: "T",  label: "T 节奏",       pace: "5:20–5:30" },
    { key: "MP", label: "MP 马拉松配速", pace: "5:35–5:41" },
  ],
  disciplinesTitle: "三条纪律（违反任何一条都可能报废整轮）",
  disciplines: [
    "任何一周不超过前一周 10%。已做过两次 +60% 然后必须撤（4 月 +59%、8 月 +66%），不能有第三次。",
    "长课 3 小时封顶。到点就停，不必跑够公里。",
    "E 就是 E。感觉好时把轻松跑跑到 6:20，是最可能的死法。",
  ],
  restDayTip: "周三周日全休日游 30 分钟当主动恢复，是最好的位置。",

  mileage: {
    structure: "结构判断：合格。标准的三上一下，两个降量周（第 8、12 周）都在该在的位置，爬升幅度合理。",
    monthly: "月跑量 9 月 145k → 10 月 177k → 11 月 198k。",
    longRunProgression: "长课进程：14 → 16 → 18 → 10↓ → 20 → 23 → 26 → 13↓ → 29 → 33 → 24 → 15 → 比赛",
    earlyWeeks: "第 1–4 周为已完成的实际跑量：14.6 / 20.6 / 34.2 / 22.4（降量）。",
  },

  twoNumbers: {
    title: "⚠️ 读懂 Runna 的两个数字 · 以及一条纪律",
    intro: "已完成周次显示为「A km / B km」，两个数含义不同：",
    points: [
      "B（斜杠后）= Runna 排的课的距离",
      "A（斜杠前）= 你实际跑的 + Runna 排的课，也就是把计划量重复计了一次",
    ],
    formula: "真正跑的量 = A − B\n第 3 周显示的 57.2 不是你跑了 57，实际是 34.2。",
    average: "四周平均超出计划约 40%。",
    good: "好消息：第 5 周 Runna 排 36km，对比第 3 周实际跑过的 34.2km 只涨 5%，没有跳跃，完全在承受范围内。之前担心的「从 23 跳到 36」是误读。",
    bad: "坏消息，也是整份计划最关键的一条纪律：那个 +49% 是自己加出来的 —— Runna 第 3 周只排了 23km。如果继续按这个习惯往上叠，第 13 周会跑到约 78km、第 14 周约 82km，而第 14 周还含一堂 33km 长课。",
    discipline: "82km/周 + 33km 长课，对现在的基础是必伤的组合。\n→ 从第 5 周起，把 Runna 排的量当上限，不是当起点。\n它已经算好了爬坡曲线（36 → 39.5 → 42.5 → 27↓ → 45.5 → 49 → 52 → 30.5↓ → 57 → 59），额外加的每一公里都是在这条已经到边缘的曲线上再叠一层。\n想多动就加游泳，不加跑量。",
  },

  actualsSummary: "实际合计 91.7km · 周均 22.9km",
  actuals: [
    { week: 1, start: "8/10", display: "22.7 / 8.0",  planned: 8,  actual: 14.6, over: "+83%", records: "二 6.6km 41:23 (6:16) · 四 8.0km 50:16 (6:17) · 二另排 Stronger Upper Body" },
    { week: 2, start: "8/17", display: "39.6 / 19.0", planned: 19, actual: 20.5, over: "+8%",  records: "一 5.3km 34:30 (6:31) + Legs & Core Strength · 二 1.0km · 四 5.3km 36:20 (6:51) · 六 8.9km 1:00:52 (6:50)",
      warning: "逐日实录合计 20.5（5.3 + 1.0 + 5.3 + 8.9），实际 vs 计划表也写 20.5；但实录表「实际」一栏和跑量曲线处写 20.6（39.6 − 19.0 = 20.6）。91.7 总量按 20.5 计。" },
    { week: 3, start: "8/24", display: "57.2 / 23.0", planned: 23, actual: 34.2, over: "+49%", records: "一 7.0km 47:00 (6:43) · 四 10.0km 1:12:05 (7:13) · 五 6.0km 40:47 (6:48) · 六 10.6+0.6km 1:17:56 (7:21，本轮最长)" },
    { week: 4, start: "8/31", display: "39.4 / 17.0", planned: 17, actual: 22.4, over: "+32%", records: "一 5.0km 31:47 (6:21)，力量未完成 · 四 5.0km 34:21 (6:52) + Full Body Strength ✓ · 六 12.4km 1:24:13 (6:47，长课挪到周六)" },
  ] as { week: number; start: string; display: string; planned: number; actual: number; over: string; records: string; warning?: string }[],
  readings: [
    { title: "① 配速在往正确方向走。", text: "第 1 周两堂都跑到 6:16–6:17 —— 对轻松跑来说偏快；第 3–4 周落到 6:47–7:21，已经进 E 区间了。保持住，别退回去。" },
    { title: "② 周训练天数只有 2–5 天，且集中在周一到周六。", text: "第 1 周只跑了两天。第 5 周起 Runna 要求 5 跑，频率本身就是新的负荷，前两周留意胫骨和跟腱。" },
    { title: "③ 已经出现「长课挪到周六」的模式", text: "（第 4 周：周五计划 7km 勾选、实际周六跑 12.4km）。这没问题，但周五排长课、周六还有 easy 的周次（第 5 周起每周都是），挪动会让长课和 easy 挤在一起，记得整体后移。" },
  ],

  weeks: [
    {
      week: 5, start: "2026-09-07", km: 36, longRun: "14km", quality: "Shorter Hill Repeats 5km",
      days: [
        { ...Q("mon", "Shorter Hill Repeats", 5, "Lower Body Strength"), marks: ["hill"],
          alternative: { treadmill: "坡度 6%，8×1′，组间平坡慢走 2′", flat: "热身 2km → 8×1′ @4:50–5:00，组间慢跑 2′ → 缓和 1km" },
          notes: ["⚠ 原文替代表写这堂是 9/8（W5 一），但第 5 周周一是 9/7；这里按周一 9/7 显示。"] },
        E("tue", 7, "Upper Body Lift"),
        E("thu", 5, "Going Heavy"),
        { ...L("fri", "Hilly Progressive LR", 14), marks: ["hill"],
          alternative: { treadmill: "坡度 1–2% 模拟起伏，后段提速", flat: "只跑渐进：前 9km 6:45–7:00，后 5km 6:15–6:20" } },
        E("sat", 5),
      ],
    },
    {
      week: 6, start: "2026-09-14", km: 39.5, longRun: "16km", quality: "Tempo 2km",
      days: [
        Q("mon", "Tempo 2km", 5.5, "Loading Up"),
        E("tue", 7.5, "Upper Body Strength"),
        E("thu", 5.5, "Full Body Strength"),
        { ...L("fri", "Hilly Long Run", 16), marks: ["hill"],
          alternative: { treadmill: "坡度 1–2%，全程 easy", flat: "当普通长课跑：全程 6:30–7:00，不需要额外处理" } },
        E("sat", 5),
      ],
    },
    {
      week: 7, start: "2026-09-21", km: 42.5, longRun: "18km", quality: "Progressive Run 6km",
      days: [
        Q("mon", "Progressive Run", 6, "Legs & Core Strength"),
        E("tue", 8, "Stronger Upper Body"),
        E("thu", 5.5, "Strength Supersets"),
        L("fri", "Race Practice LR", 18),
        E("sat", 5),
      ],
    },
    {
      week: 8, start: "2026-09-28", km: 27, cutback: true, longRun: "10km", quality: "Mile Repeats 5km",
      days: [
        Q("mon", "Mile Repeats", 5, "Strong Foundation"),
        E("tue", 7, "Upper Body Lift"),
        E("thu", 5, "Building Strength"),
        L("fri", "Long Run", 10),
      ],
    },
    {
      week: 9, start: "2026-10-05", km: 45.5, longRun: "20km", quality: "Tempo 2km Repeats 6.5km",
      days: [
        Q("mon", "Tempo 2km Repeats", 6.5, "Lower Body Strength"),
        E("tue", 8, "Upper Body Strength"),
        E("thu", 6, "Full Body Strength"),
        L("fri", "Race Practice LR", 20),
        E("sat", 5),
      ],
    },
    {
      week: 10, start: "2026-10-12", km: 49, longRun: "23km", quality: "Over and Unders 1km",
      days: [
        Q("mon", "Over and Unders 1km", 6, "Lower Body Strength"),
        E("tue", 7.5, "Stronger Upper Body"),
        E("thu", 6.5, "Going Heavy"),
        L("fri", "Long Run", 23),
        E("sat", 6),
      ],
    },
    {
      week: 11, start: "2026-10-19", km: 52, longRun: "26km", quality: "1km Repeats 7km",
      days: [
        Q("mon", "1km Repeats", 7, "Loading Up"),
        E("tue", 7.5, "Upper Body Lift"),
        E("thu", 6.5, "Full Body Strength"),
        { ...L("fri", "Hilly Progressive LR", 26), marks: ["hill"],
          alternative: { treadmill: "坡度 1–2%，后段提速", flat: "只跑渐进：前 18km 6:45–7:00，后 8km 6:15–6:20" } },
        E("sat", 5),
      ],
    },
    {
      week: 12, start: "2026-10-26", km: 30.5, cutback: true, longRun: "13km", quality: "Tempo 2-1 5km",
      days: [
        Q("mon", "Tempo 2-1", 5, "Lower Body Endurance"),
        E("tue", 7, "Upper Body Endurance"),
        E("thu", 5.5, "Full Body Endurance"),
        L("fri", "Long Run", 13),
      ],
    },
    {
      week: 13, start: "2026-11-02", km: 57, longRun: "29km", quality: "On Off Ks 7km",
      days: [
        Q("mon", "On Off Ks", 7, "Lower Body Endurance"),
        E("tue", 9, "Upper Body Supersets"),
        E("thu", 6, "Full Body Supersets"),
        { ...L("fri", "Race Practice LR", 29), marks: ["gate", "fuel"], gate: "preview",
          change: { from: "29km 全 easy", to: "29km = 24E + 5MP", duration: "3:11", purpose: "首次 MP 收尾 · 补给全流程演练" },
          notes: [ESCAPE_VALVE] },
        E("sat", 6),
      ],
    },
    {
      week: 14, start: "2026-11-09", km: 59, peak: true, longRun: "33km", quality: "Hill Repeats 7km",
      days: [
        { ...Q("mon", "Hill Repeats", 7, "Legs & Core Endurance"), marks: ["hill"],
          alternative: { treadmill: "坡度 6–7%，10×1′，组间平坡慢走 2′", flat: "热身 2km → 10×1′ @4:50–5:00，组间慢跑 2′ → 缓和 2km" },
          notes: [`${ADJUSTMENTS[0].title}：${ADJUSTMENTS[0].text}`] },
        E("tue", 8, "Upper Endurance"),
        E("thu", 6, "Total Endurance"),
        { ...L("fri", "Hilly Long Run", 33), marks: ["gate", "fuel", "hill"], gate: "main",
          change: { from: "33km 全 easy", to: "30km = 20E + 10MP", duration: "3:13", purpose: "★ 主判定关卡" },
          alternative: { treadmill: "不建议上跑步机（时长过久）", flat: "按前述改法：30km = 20E + 10MP，平地跑，坡度忽略" } },
        E("sat", 5),
      ],
    },
    {
      week: 15, start: "2026-11-16", km: 49, longRun: "24km", quality: "Tempo 3km",
      days: [
        E("mon", 7.5, "Lower Body Supersets"),
        Q("tue", "Tempo 3km", 6, "Upper Body Endurance"),
        E("thu", 5, "Full Body Endurance"),
        { ...L("fri", "Block Long Run", 24), marks: ["gate", "fuel"], gate: "review",
          change: { from: "24km 全 easy", to: "22km = 14E + 8MP", duration: "2:22", purpose: "★ 疲劳下的复核" } },
        E("sat", 6.5),
      ],
    },
    {
      week: 16, start: "2026-11-23", km: 32.5, longRun: "15km", quality: "Half Steady, Half Tempo 5km",
      days: [
        Q("mon", "Half Steady, Half Tempo", 5, "Race Day Focus"),
        E("tue", 7.5, "Easing Down"),
        E("thu", 5, "Hard Work Is Done"),
        { ...L("fri", "Long Run", 15),
          change: { from: "15km 全 easy", to: "15km = 11E + 4MP", duration: "1:37", purpose: "保留 MP 感觉" } },
      ],
    },
    {
      week: 17, start: "2026-11-30", km: 53.7, longRun: "比赛 42.2km", quality: "Race Pace Fartlek 5.5km",
      days: [
        { day: "mon", strength: "Ticking Over", notes: [RACE_WEEK[0].point] },
        { ...Q("tue", "Race Pace Fartlek", 5.5, "Counting Down"), notes: [RACE_WEEK[1].point] },
        { ...E("thu", 6), notes: [RACE_WEEK[3].point] },
        { day: "fri", notes: [RACE_WEEK[4].point] },
        { day: "sat", notes: [RACE_WEEK[4].point] },
        { day: "sun", run: { name: "BYD Marathon", km: 42.2, kind: "race" }, notes: [RACE_WEEK[5].point] },
      ],
    },
  ] as RunnaWeek[],

  risk: {
    title: "⚠️ 最大风险点：11/6 的 29km + 11/13 的 33km",
    text: "连续两周的超长课，中间没有降量周。\n第 13 周 57k（含 29km）、第 14 周 59k（含 33km），接着第 15 周还有 24km —— 三周内三堂 ≥24km。这是整轮里受伤概率最高的一段。\n而且 33km 按 E 配速要跑 3:45–3:51，比目标完赛时间还长；33 / 59 = 长课占周跑量 56%（一般上限 40%）。",
    changeTitle: "建议改法：降距离 + 加 MP 段",
    changeIntro: "时长压下来的同时把 MP 演练梯度做出来。MP 量 5 → 10 → 8 → 4。",
    after: "MP 段跑 5:41，比 easy 快得多，所以距离降一点、时间反而压下来了。改完之后 MP 累计梯度是 5 → 10 → 8 → 4，正好是一条完整的专项化曲线。",
    escape: ESCAPE_VALVE,
    rest: "其余各周一个字都不用改。Runna 的质量课密度和类型已经够了：Hill Repeats · Tempo · Progressive · Mile Repeats · Over and Unders · 1km Repeats · On Off Ks · Race Pace Fartlek · Race Practice Long Run，MP/阈值刺激不缺。",
  },

  gates: {
    title: "★ 叠加层一 · 判定关卡",
    intro: "11/6 是预演，11/13 是判定，11/20 是复核。三堂课决定比赛日的出发配速。",
    items: {
      preview: {
        title: "预演 · 11/6 的 29km",
        desc: "最后 5km 跑 MP · 全程按比赛日补给 · 不判定，只找感觉",
        columns: ["看什么", "怎么处理"],
        rows: [
          ["MP 5km 轻松，胃没问题", "按计划进 11/13 的主关卡"],
          ["MP 段吃力，或胃不适", "补给方案要调整；11/13 的 MP 段减到 8km"],
          ["跑完腿明显受损、酸痛超过两天", "11/13 砍到 26km 或按 3 小时封顶，别硬扛"],
        ],
      },
      main: {
        title: "★ 主关卡 · 11/13 长课",
        desc: "最后 10km 跑 MP（5:35–5:41）· 这一堂决定比赛日出发配速",
        columns: ["表现", "结论", "比赛日出发配速"],
        rows: [
          ["全程稳在 5:35–5:41，末段不掉速", "Sub-4 确认", "5:38"],
          ["能跑完，但最后 3km 掉到 5:50+", "目标改 4:05", "5:50"],
          ["5km 之后就明显崩", "目标 4:15，别犹豫", "6:00"],
        ],
      },
      review: {
        title: "复核 · 11/20 长课",
        desc: "后 8km 跑 MP，带着前一周的疲劳做 · 检查适应是否正常",
        columns: ["表现", "处理"],
        rows: [
          ["比 11/13 那次感觉更好", "适应正常，按 Runna 走到底"],
          ["比 11/13 明显更差", "前面挖太深，第 16 周比 Runna 排的再减 20%"],
        ],
      },
    } as Record<RunnaGateKey, { title: string; desc: string; columns: string[]; rows: string[][] }>,
  },

  fueling: {
    title: "🍫 叠加层二 · 补给演练",
    intro: "Runna 完全不管这个，但它可能比多跑 100 公里更重要。",
    why: "半马 1:55 不补给也能过，全马 4 小时不行。每小时 60–90g 碳水，全程 240–360g。这个量胃必须练过。",
    opportunities: "演练机会：第 9（20km）、10（23km）、11（26km）、13（29km）、14（33km）、15（24km）六次长课。第 16 周的 15km 太靠近比赛，不适合试新东西。",
    callout: "11/6 那堂 29km 是最好的全流程彩排 —— 距离接近、时长超过 3 小时，把比赛日要吃的东西完整跑一遍。",
    rows: [
      { item: "节奏",     plan: "每 40–45 分钟一个胶，配水",                note: "从开跑后 45 分钟就吃第一个，不要等到饿。饿了才吃已经晚了。" },
      { item: "剂量",     plan: "11/6 和 11/13 那两次各至少吃到 4–5 个",    note: "按 3 小时 10 分左右算，45′/90′/135′/180′ 各一个。比赛日 4 小时需要 5–6 个。两次都用同一套方案，别换。" },
      { item: "胃不适",   plan: "换品牌或减浓度，不要减总量",               note: "可试换牌子、多配水、或改用液体碳水。总量不能降。" },
      { item: "赛前三天", plan: "肝糖超补",                               note: "第 16 周周一之后不再有质量课，正好配合。" },
    ],
  },

  hills: {
    title: "⛰ 叠加层三 · 没有坡的替代方案",
    intro: "Runna 排了 6 堂需要坡的课，下面是逐堂替代方案。原课名保留不改（方便和 App 对照），执行时按替代栏做。",
    principle: "原理：上坡安全（向心收缩为主，冲击小），下坡才是伤人的那一半 —— 离心负荷，胫骨和股四头首当其冲。所以替代的目标是保留上坡刺激、彻底避开下坡。",
    distinction: "Hilly Long Run 和 Hilly Progressive 的区别要分清：\n带 Progressive 的（9/11、10/23）主要刺激是渐进提速，坡度只是附加，所以平地版照跑渐进就等价了。\n不带 Progressive 的（9/18）坡度就是全部刺激，平地版当普通 easy 长课跑即可，不要为了补偿而加速 —— 那会把一堂 easy 课变成质量课。",
    methods: [
      { rank: "① 最优",   method: "跑步机爬坡",             how: "坡度 5–7%，按课表的组数时长跑",                          note: "唯一能完整复制上坡刺激又完全避开下坡损伤的方式" },
      { rank: "② 次选",   method: "停车场坡道 / 天桥",       how: "找 100–200m 有持续坡度的一段",                           note: "上坡跑，走或慢跑下来。下坡一定要慢，别顺势跑下去" },
      { rank: "③ 次选",   method: "楼梯 / 体育场看台",       how: "上楼跑，走下来",                                        note: "刺激更强、冲击更小，但踝关节要求高。第一次做减半量" },
      { rank: "④ 无坡时", method: "平地替代 Hill Repeats",   how: "热身 2km → 8×1 分钟 @ 4:50–5:00，组间慢跑 2 分钟 → 缓和 2km", note: "换掉的是坡的特异性力量，保留了神经募集和有氧刺激。不完全等价，但够用" },
      { rank: "⑤ 无坡时", method: "平地替代 Hilly Long Run", how: "只跑 progressive 部分",                                  note: "前 2/3 用 6:45–7:00，最后 1/3 降到 6:15–6:20" },
    ],
  },

  raceWeek: {
    title: "比赛周 · 11/30 – 12/6",
    intro: "BYD Marathon · 12/6（周日） · 赛前跑量仅 11.5km，是标准的减量 · 周量 53.7km（含比赛 42.2）",
    rows: RACE_WEEK,
  },

  adjustments: ADJUSTMENTS,

  footnote: {
    source: "数据来源：Runna App 训练日历截图（2026/9/6 导出），第 5–16 周为已确认排程，第 13 周与第 17 周部分未截图。第 1–4 周为实际完成量。本文件的判定关卡、补给方案、无坡替代均为叠加内容，Runna 不提供。",
    relations: [
      "「★ 13 周实战版」是独立推导的备用方案，结构更保守（峰值 56k、最长 26k），两份并存但不可同时执行。",
      "「汉森系统」为完整体系存档 —— 汉森入门需 40–48k/周稳定基础，是明年的课表，现在用不了。",
    ],
    strength: "力量课的改法见 Strength tab（逐周原课与改法）。",
  },
};

// Local-time date of a plan day (week is 1-based).
export function runnaDayDate(week: number, day: RunnaDayKey): Date {
  const [y, m, d] = PLAN_START.split("-").map(Number);
  return new Date(y, m - 1, d + (week - 1) * 7 + RUNNA_DAY_KEYS.indexOf(day));
}

export type RunnaToday =
  | { status: "before" | "after" }
  | { status: "in-plan"; week: number; day: RunnaDayKey };

export function findRunnaToday(now: Date): RunnaToday {
  const [y, m, d] = PLAN_START.split("-").map(Number);
  const start = new Date(y, m - 1, d);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days  = Math.round((today.getTime() - start.getTime()) / 86_400_000);
  if (days < 0) return { status: "before" };
  if (days >= TOTAL_WEEKS * 7) return { status: "after" };
  return { status: "in-plan", week: Math.floor(days / 7) + 1, day: RUNNA_DAY_KEYS[days % 7] };
}

export function runnaRunLabel(run: RunnaRun): string {
  return run.kind === "easy" ? `E ${run.km}km` : `${run.name} · ${run.km}km`;
}

export function runnaDayHasExtras(day: RunnaDay): boolean {
  return Boolean(day.alternative || day.gate || day.marks?.includes("fuel") || day.notes?.length);
}
