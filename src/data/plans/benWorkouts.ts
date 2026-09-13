// Ben's two follow-along video workouts, transcribed from ben-workouts.md.
// Originals keep the video timestamps; each has a race-prep version.
// Video links not provided yet — fill videoUrl and timestamps become links.

export type BenMoveStatus = "keep" | "core" | "optional" | "skip";

export interface BenMove {
  time?:      string;
  name:       string;
  duration?:  string;
  trains?:    string;
  status?:    BenMoveStatus;
  highlight?: boolean;
}

export const BEN_WORKOUTS = {
  subtitle: "BYD Marathon 12/6 备赛期用",
  intro: "Ben 的两套跟练课，原版全部原样保留（含时间戳，方便对着视频跟做），各附一版备赛期改法。",
  overview: [
    { name: "① 力量循环", fatigue: "硬课", hard: true,  slot: "占「硬日」名额", frequency: "每周 1 次，替代周一下肢" },
    { name: "② 核心跟练", fatigue: "很低", hard: false, slot: "不占硬日",       frequency: "每周 2–3 次都行" },
  ],
  overviewNote: "两套的疲劳完全不同，不要混为一谈。详见文末。",

  circuit: {
    title: "① 力量循环 · Strength Circuit",
    videoUrl: "",
    original: {
      format: "1 分钟 on / 30 秒 off · 重复 4 轮 · 约 30 分钟 · 他本人每周 1 次",
      moves: [
        { time: "4:22", name: "Squat onto one leg 单腿蹲",       duration: "1 min",   trains: "单腿力量 + 离心控制" },
        { time: "5:40", name: "Single leg RDL with kettlebell",  duration: "30 秒/侧", trains: "后链 + 单腿稳定 + 抗旋转" },
        { time: "6:58", name: "Step backs 后撤步",               duration: "1 min",   trains: "单腿力量 · 臀中肌" },
        { time: "8:32", name: "Kettlebell swings 壶铃摆动",      duration: "1 min",   trains: "伸髋爆发 + 心肺" },
        { time: "9:47", name: "Ski Jumps 滑雪跳",                duration: "1 min",   trains: "⚠️ 跳跃 · 爬量期禁忌", highlight: true },
      ] as BenMove[],
    },
    changes: [
      { title: "Ski Jumps → 侧向跨步", text: "跑量爬升期叠加跳跃，是小腿和跟腱出问题最常见的组合。跑量本身已提供足够冲击。侧向跨步保留侧向髋刺激，无腾空。12/6 之后想加回来随时可以。" },
      { title: "4 轮 → 3 轮", text: "他一周只做 1 次，说明他也知道这个量不轻。适应两周后再考虑加到 4 轮。" },
    ],
    modified: {
      duration: "约 23 分钟",
      intro: "可直接替代「周一下肢」槽位。",
      moves: [
        { name: "单腿蹲",          duration: "1 min" },
        { name: "单腿 RDL（壶铃）", duration: "30 秒/侧" },
        { name: "后撤步弓步",      duration: "1 min" },
        { name: "壶铃摆动",        duration: "1 min" },
        { name: "侧向跨步",        duration: "1 min", highlight: true },
      ] as BenMove[],
      format: "每个动作后休 30 秒 · 共 3 轮 · 结束后补单腿提踵 3×15/侧。",
    },
  },

  core: {
    title: "② 核心跟练 · Core Workout（31 分钟）",
    videoUrl: "",
    structure: "结构是 4 组 × 6 个动作，每个动作间隔约 70–80 秒（约 60 秒动作 + 转换）。整套疲劳很低，除 B 组外都适合备赛期。",
    groups: [
      {
        name: "A 组 · 支撑组",
        moves: [
          { time: "0:58", name: "Plank",            trains: "基础抗伸展",               status: "keep" },
          { time: "2:45", name: "Side plank（左）", trains: "抗侧屈 · 对应后半程躯干晃", status: "core" },
          { time: "3:52", name: "Side plank（右）", trains: "同上",                     status: "core" },
          { time: "5:09", name: "Back plank",       trains: "前链拉开 + 后链激活",       status: "keep" },
          { time: "6:27", name: "Plank dive（左）", trains: "动态平板",                 status: "optional" },
          { time: "7:38", name: "Plank dive（右）", trains: "同上",                     status: "optional" },
        ] as BenMove[],
      },
      {
        name: "B 组 · 屈曲组",
        moves: [
          { time: "8:56",  name: "Russian twist",         trains: "负重腰椎旋转",               status: "skip" },
          { time: "10:10", name: "Air cycling",           trains: "屈曲 + 旋转",                status: "skip" },
          { time: "11:25", name: "Row crunches",          trains: "腰椎屈曲",                   status: "skip" },
          { time: "12:42", name: "Row crunch single leg", trains: "腰椎屈曲",                   status: "skip" },
          { time: "14:06", name: "Side to side",          trains: "屈曲 + 旋转",                status: "skip" },
          { time: "15:15", name: "Hollow body",           trains: "抗伸展 · 这一组里唯一要留的", status: "keep", highlight: true },
        ] as BenMove[],
      },
      {
        name: "C 组 · 仰卧组",
        moves: [
          { time: "16:30", name: "Bridges（双腿）",          trains: "被单腿版完全覆盖",   status: "skip" },
          { time: "17:40", name: "Single leg bridge（左）",  trains: "单侧臀大肌",         status: "keep" },
          { time: "18:50", name: "Single leg bridge（右）",  trains: "同上",               status: "keep" },
          { time: "20:09", name: "Leg kicks",                trains: "刺激太低",           status: "skip" },
          { time: "21:27", name: "Leg lowers",               trains: "抗伸展 + 骨盆控制", status: "keep", highlight: true },
          { time: "22:41", name: "Leg circles",              trains: "刺激太低",           status: "skip" },
        ] as BenMove[],
      },
      {
        name: "D 组 · 侧卧髋组",
        moves: [
          { time: "24:03", name: "Clam shell（左）",     trains: "臀中肌 · 防膝内扣",         status: "keep" },
          { time: "25:16", name: "Leg lift（左）",       trains: "臀中肌",                   status: "keep" },
          { time: "26:40", name: "Leg lift hold（左）",  trains: "臀中肌耐力 · 你最缺的一块", status: "core" },
          { time: "27:36", name: "Clam shell（右）",     trains: "臀中肌",                   status: "keep" },
          { time: "28:56", name: "Leg lift（右）",       trains: "臀中肌",                   status: "keep" },
          { time: "30:11", name: "Leg lift hold（右）",  trains: "臀中肌耐力",               status: "core" },
        ] as BenMove[],
      },
    ],
    whySkipB: {
      title: "为什么整个 B 组几乎全跳",
      text: "8:56 – 14:06 这 5 个全是腰椎屈曲或屈曲加旋转。跑步时腰椎的任务是抵抗变形，不是主动屈曲，迁移很低；而腰椎的疲劳预算现在该留给跑步。抗旋转要练的话用 Pallof Press，收益更好、风险更低。",
    },
    dGroupNote: "D 组（侧卧髋）反而是整套里对跑者最值钱的一段 —— 臀中肌耐力直接决定累的时候膝盖会不会内扣。",
    tip: "时间不够就砍 A 组的 Plank dive，别砍 D 组。",
    followAlong: {
      title: "跟练版 · 16 个动作 · 约 20 分钟",
      intro: "可直接作为「周六核心」槽位。",
      rows: [
        { order: "A1–A4", text: "Plank · Side plank 左右 · Back plank" },
        { order: "A5–A6", text: "Plank dive 左右（时间紧可略）" },
        { order: "B",     text: "直接跳到 15:15 · Hollow body" },
        { order: "C",     text: "Single leg bridge 左右 · Leg lowers" },
        { order: "D",     text: "整组照做 · Clam shell / Leg lift / Leg lift hold 各左右" },
      ],
      supplement: "补充：结束后加 Pallof Press 3×10/侧，补上被跳过的抗旋转刺激。",
    },
  },

  usage: [
    { situation: "W7–W12 周一", which: "力量循环改版 或 主线周一槽位，二选一",        why: "两者覆盖的肌群基本一致，Ben 版心肺刺激更大、时间更紧凑" },
    { situation: "W7–W12 周六", which: "核心跟练版",                                 why: "疲劳低，长课第二天做完全没问题，还能促进恢复" },
    { situation: "质量课当天",   which: "主线周一槽位，不用力量循环",                  why: "循环训练叠在质量课上心肺负荷过高，低疲劳的力量型更合适" },
    { situation: "W13–W14",     which: "力量循环停 · 核心跟练只做 D 组",               why: "29km / 33km 背靠背，另加单腿提踵" },
    { situation: "W15–W16",     which: "力量循环停 · 核心跟练可保留 1 次",             why: "减量期，循环训练的疲劳成本不划算；核心无所谓" },
    { situation: "W17 赛周",    which: "都停",                                       why: "—" },
    { situation: "12/6 之后",   which: "力量循环恢复 4 轮 + Ski Jumps 原版 · 核心可跑完整 24 个", why: "非备赛期可以完整跟，跳跃和屈曲类都能加回来" },
  ],

  fatigueHeading: "两套课的疲劳完全不同，别混为一谈",
  fatigue: [
    { title: "力量循环是硬课。", text: "有现成节奏、跟着做很爽、不知不觉就做满了——这正是最容易诱发超量的形式。当下不觉得累，第二天跑才知道。做完的第二天如果是长课或质量课，直接跳过。" },
    { title: "核心跟练不是硬课。", text: "疲劳很低，不占硬日名额，可以每周 2–3 次，甚至长课当天晚上做都行。这是整个备赛期唯一可以放心加量的一套。" },
  ],
};

// "4:22" → video link starting at 262s; undefined while no video link is set.
export function timestampUrl(videoUrl: string, time: string): string | undefined {
  if (!videoUrl) return undefined;
  const seconds = time.split(":").map(Number).reduce((total, n) => total * 60 + n, 0);
  return `${videoUrl}${videoUrl.includes("?") ? "&" : "?"}t=${seconds}`;
}
