import type { PlanExercise, TrainingPlan } from "@/types/plan";

// Transcribed from runna-strength-fixes.md (W1–W6, 16 sessions).
// W7–W17 are intentionally absent — add a week here once its fixes are written.

const keep = (name: string, highlight = false): PlanExercise => ({ name, change: "keep", highlight });
const replace = (name: string, to: string): PlanExercise => ({ name, change: "replace", to });
const modify = (name: string, note: string): PlanExercise => ({ name, change: "modify", note });

export const RUNNA_MARATHON_PLAN: TrainingPlan = {
  name: "Runna 力量课 · 原课与改法",
  summary: "BYD Marathon 12/6 · 17 周计划 · 已处理 W1–W6 共 16 堂",
  totalWeeks: 17,
  scheduleNote: "每周固定三堂：周一下肢 · 周二上肢 · 周四全身（一律挪到周六）。W1 是例外，只排了一堂。",
  placeholderNote: "模板会重复，但同名不一定同内容 · 按统一规则匹配",

  criteria: [
    { title: "推拉比例是否失衡", text: "游泳的推进力和跑步后半程姿态都靠「拉」" },
    { title: "有没有混进腿部复合动作", text: "腿的负荷预算已被跑量占满" },
    { title: "有没有肩袖 / 抗变形动作", text: "" },
  ],
  principle: "改动原则：能只换动作就不整堂重排。Runna 的结构通常没问题，问题在个别选择和排期。",

  rulesNote:
    "Runna 的问题是重复性的，不是随机的。看到左栏就换成右栏，不用逐堂重新判断。\n" +
    "模板名不等于内容：W1 和 W4 的 Stronger Upper Body 同名但动作几乎完全不同。所以不能按课名预判，这张表按动作匹配。",
  rules: [
    { from: "Thruster · Lunge and Press · Clean and Press（「下肢动作 + 推举」复合类）", count: "11 次", to: "单臂划船 或 Face Pull", why: "Runna 最固执的模板偏好。把腿部负荷塞进上肢课，同时造成推拉失衡" },
    { from: "Single / Double Arm Clean（翻铃类）", count: "6 次", to: "壶铃摆动", why: "爆发 + 技术，疲劳成本高、学习曲线陡" },
    { from: "Russian Twist", count: "2 次", to: "Pallof Press", why: "负重腰椎屈曲+旋转 → 抗旋转" },
    { from: "Standing Side Bend", count: "3 次", to: "手提箱行走", why: "主动侧屈 → 抗侧屈" },
    { from: "Straight Leg Raise · Hanging Knee Raise", count: "3 次", to: "Leg Lowers", why: "髋屈肌主导，腰椎易代偿" },
    { from: "Hurdle Hops", count: "2 次", to: "快节奏单腿提踵", why: "单次冲击最大的跳跃" },
    { from: "Double Leg Skipping · Pogo Jumps（低幅弹跳类）", count: "3 次", to: "保留，20–30 秒", why: "冲击远低于栏架跳，练的跟腱刚度对跑步经济性有价值" },
    { from: "Barbell Deadlift · Sumo Deadlift · Barbell Squat（大重量双腿复合）", count: "5 次", to: "降到 60–70%；同堂出现两个 → 只留一个", why: "恢复成本高。深蹲硬拉二选一时留深蹲" },
  ],

  gaps: [
    {
      title: "肩袖极少",
      text:
        "16 堂里只出现过 2 次外旋动作（W5 Going Heavy、W6 Upper Body Strength 的 Banded Face Pulls）。库里有，但排课时几乎不用。\n" +
        "→ 每堂上肢/全身课固定加 Face Pull 3×12–15（本来就有的那堂不用重复加）。",
    },
    { title: "推拉失衡", text: "逐堂统计：" },
  ],
  pushPull: [
    { session: "Stronger UB (W1)", ratio: "5:1" },
    { session: "UB Lift (W2)", ratio: "5:2" },
    { session: "UB Strength (W3)", ratio: "3:1" },
    { session: "Building Strength", ratio: "4:0" },
    { session: "Stronger UB (W4)", ratio: "3:1" },
    { session: "Full Body Strength (W4)", ratio: "2:0" },
    { session: "UB Lift (W5)", ratio: "3:2", best: true },
    { session: "UB Strength (W6)", ratio: "3:0" },
    { session: "Full Body (W6)", ratio: "3:1" },
  ],
  pushPullRule: "→ 任何一堂课如果拉的动作 ≤ 1 个，就把最靠后的推举换成划船。",

  strengths: [
    { area: "跟腱 / 小腿", exercises: "Floating Heel Drop · Single Leg Calf Raise · Loaded Walking Calf Raises · Squat to Calf Raise · Lunge Hold Calf Raise · Double Leg Calf Raise on Step · Bent Knee / Seated Calf Raise（比目鱼肌）" },
    { area: "脚 / 胫前肌", exercises: "Heel Walks · Banded Toe Raise（胫前肌，防胫骨痛）· Toe Walks · Toe Scrunches（小腿三头肌与足内在肌，防足底筋膜炎）" },
    { area: "臀中肌", exercises: "Fire Hydrants · Clam Shells · Lateral Walk · Hip Drop" },
    { area: "单腿 / 离心", exercises: "Step Down / Step Up（离心+向心互补）· Staggered Stance RDL · B-Stance Hip Thrust · Single Leg SLDL with Knee Drive · Single Leg Isometric Hamstring Holds · Side Lunge" },
    { area: "抗变形核心", exercises: "Walk Out 系列 · Diagonal Toe Tap · Bear Crawl · Side Plank（含 Hip Flexion / Leg Raise 版）· Copenhagen Plank · Deadbug · Farmer's Carry · Plank Pull Through · Press-Up Position Single Arm Extensions" },
  ],
  strengthsNote: "这份清单比壶铃方案覆盖得更全。Runna 的动作库本身是好的，问题只在个别选择和排期。",

  trend: {
    text:
      "W6 的课比前几周明显好：W2 的 Legs & Core Strength 要改 5 处，W6 的 Loading Up 只需降个重量。看起来 Runna 在跑量爬升后减少了跳跃和高风险动作的排布。\n" +
      "如果这个趋势持续，后面几周需要改的会越来越少 —— 可能只剩两件固定动作：",
    items: ["换掉「Lunge and Press」那一类", "周四挪周六"],
  },

  weeks: [
    // ── Week 1 ──────────────────────────────────────────────────────────────
    {
      week: 1,
      subtitle: "8/10 起 · 已完成 · 只排了一堂力量课",
      focus: "推拉 5:1 · 换掉 Thruster",
      sessions: [
        {
          day: "tue",
          title: "Stronger Upper Body",
          alsoUsedIn: [7, 10],
          summary: "推拉 5:1，方向是反的。",
          blocks: [
            { sets: 3, exercises: [keep("Press Up"), keep("Fire Hydrants"), keep("Mountain Climber"), keep("Press Up Position Walk Out")] },
            { sets: 2, exercises: [keep("Pull Up"), replace("Thruster", "单臂划船")] },
            { sets: 2, exercises: [keep("Standing Barbell Press"), replace("Incline Barbell Bench Press", "Face Pull")] },
            { sets: 2, exercises: [keep("Standing Single Arm Shoulder Press"), replace("Standing Side Bend", "手提箱行走")] },
            { sets: 3, exercises: [keep("Deadbug"), keep("Hip Drop")] },
          ],
          notes: [
            {
              kind: "reason",
              title: "为什么",
              text:
                "Thruster → 单臂划船：前蹲+推举，腿部参与大、心率高。出现在「上肢课」里实际是给腿加负荷。\n" +
                "Incline Bench → Face Pull：两个杠铃推举留一个够。全课原本没有任何肩袖动作。\n" +
                "Standing Side Bend → 手提箱行走：主动侧屈 vs 抗侧屈，同一块肌肉方向相反。",
            },
            { kind: "keep", title: "不要动", text: "Fire Hydrants（臀中肌）· Hip Drop（整堂最对路，练跑步单腿支撑时的骨盆稳定）· Deadbug · Press Up Position Walk Out。" },
          ],
        },
      ],
    },

    // ── Week 2 ──────────────────────────────────────────────────────────────
    {
      week: 2,
      subtitle: "8/17 起 · 已完成",
      focus: "周一 5 处要改",
      sessions: [
        {
          day: "mon",
          title: "Legs & Core Strength",
          alsoUsedIn: [7],
          summary: "全程问题最多的一堂，5 处要改。一堂课里两个跳跃 + 大重量硬拉 + 两个屈曲核心。",
          blocks: [
            { sets: 2, exercises: [keep("Walking Lunge"), keep("Press Up Position Diagonal Toe Tap"), keep("Standing March"), keep("Glute Bridge into Hamstring Walkout")] },
            { sets: 3, exercises: [modify("Barbell Deadlift", "降 60–70%"), replace("Hurdle Hops", "单腿提踵（快节奏）")] },
            { sets: 3, exercises: [keep("Single Leg Isometric Hamstring Holds"), keep("Single Leg Calf Raise")] },
            { sets: 2, exercises: [keep("Lateral Walk"), modify("Double Leg Skipping", "30 秒")] },
            { sets: 2, exercises: [replace("Russian Twist", "Pallof Press"), replace("Standing Side Bend", "手提箱行走")] },
          ],
          notes: [
            { kind: "keep", title: "不要动", text: "Single Leg Isometric Hamstring Holds（腘绳等长，低疲劳高收益）· Single Leg Calf Raise · Lateral Walk · Glute Bridge into Hamstring Walkout · Diagonal Toe Tap。" },
          ],
        },
        {
          day: "tue",
          title: "Upper Body Lift（W2 版）",
          summary: "推拉 5:2，比 W1 好一些。仍有腿部复合 + 无肩袖。",
          blocks: [
            { sets: 3, exercises: [keep("Press Up"), keep("Press Up Position Walk Out"), keep("Travelling Press Up Walk Out"), keep("Mountain Climber")] },
            { sets: 2, exercises: [keep("Barbell Bench Press"), keep("Standing Single Arm Shoulder Press")] },
            { sets: 2, exercises: [keep("Bent Over Row"), keep("Side Plank")] },
            { sets: 2, exercises: [keep("Single Arm Row"), replace("Lunge and Press", "Face Pull")] },
            { sets: 3, exercises: [keep("Hip Drop"), replace("Crunch and Press", "Deadbug")] },
          ],
          notes: [
            { kind: "callout", text: "Side Plank 出现在上肢课是好信号 —— Runna 开始有抗变形内容了。" },
          ],
        },
        {
          day: "sat",
          movedFrom: "thu",
          title: "Strength Supersets",
          alsoUsedIn: [7],
          summary: "这一批最好的一堂，只改 1 处。有两个极有价值的动作。",
          blocks: [
            { sets: 2, exercises: [keep("Side Leg Swings"), keep("Diagonal Toe Tap"), keep("Floating Heel Drop", true), keep("Bear Crawl")] },
            { sets: 2, exercises: [keep("Single Leg SLDL with Knee Drive"), keep("Tricep Dip")] },
            { sets: 2, exercises: [keep("Loaded Walking Calf Raises"), keep("Standing Side Raise")] },
            { sets: 2, exercises: [keep("Lopsided Squat"), replace("Double Arm Clean", "壶铃摆动")] },
            { sets: 2, exercises: [keep("Single Arm Bench Press"), keep("Raised Leg Hip Thrust")] },
            { sets: 2, exercises: [keep("Plank Twist"), keep("Short Lever Copenhagen Plank", true)] },
          ],
          notes: [
            {
              kind: "reason",
              title: "最值钱的四个动作",
              text:
                "Floating Heel Drop：防跟腱病证据最强的动作类型。跟腱是适应最慢的组织之一，爬量期价值被严重低估\n" +
                "Short Lever Copenhagen Plank：内收肌等长。跑者最常忽略、拉伤后最难好的一块\n" +
                "Single Leg SLDL with Knee Drive：比普通单腿 RDL 多了抬膝，更接近跑步的摆动腿模式\n" +
                "Loaded Walking Calf Raises：负重行走提踵，更接近跑步的连续负荷",
            },
            { kind: "callout", text: "Plank Twist 没砍。它是平板支撑位下的控制性旋转，核心全程绷紧，和仰卧位的 Russian Twist 完全不是一回事。" },
            { kind: "keep", title: "其他", text: "单边负重（Lopsided Squat、Single Arm Bench Press）重量取双边版的一半以下起步。Tricep Dip 和 Standing Side Raise 贡献低但疲劳也低，时间紧时优先砍这两个。" },
          ],
        },
      ],
    },

    // ── Week 3 ──────────────────────────────────────────────────────────────
    {
      week: 3,
      subtitle: "8/24 起 · 已完成",
      focus: "周二 4 处；周四拉 = 0",
      sessions: [
        {
          day: "mon",
          title: "Strong Foundation",
          alsoUsedIn: [8],
          summary: "最好的下肢课之一，只改 1 处。没跳跃、没大重量双腿复合、没屈曲核心。",
          blocks: [
            { sets: 2, exercises: [keep("Squat to Calf Raise"), keep("Bear Crawl"), keep("Toe Walks", true), keep("Clam Shells")] },
            { sets: 4, exercises: [keep("Banded Quad Extension")] },
            { sets: 2, exercises: [keep("B-Stance Hip Thrusts")] },
            { sets: 2, exercises: [keep("Straight Leg Deadlift"), replace("Single Arm Clean", "壶铃摆动")] },
            { sets: 2, exercises: [keep("Reverse Lunge"), keep("Standing March")] },
            { sets: 2, exercises: [keep("Side Plank"), keep("Loaded Walking Calf Raises")] },
          ],
          notes: [
            { kind: "keep", title: "覆盖度", text: "小腿两个变式 · 臀中肌 · 单侧后链三个 · 抗变形核心三个。Banded Quad Extension 给 4 组偏多，时间紧时减到 2 组。" },
          ],
        },
        {
          day: "tue",
          title: "Upper Body Strength（W3 版）",
          summary: "周二线里最弱的一堂，4 处要改。推拉 3:1。",
          blocks: [
            { sets: 3, exercises: [keep("Press Up Position Walk Out"), keep("Fire Hydrants"), keep("Press Up Position Diagonal Toe Tap"), keep("Travelling Press Up Walk Out")] },
            { sets: 2, exercises: [replace("Lunge and Press", "Face Pull")] },
            { sets: 2, exercises: [keep("Single Arm Bench Press")] },
            { sets: 2, exercises: [keep("Bent Over Row"), replace("Double Arm Clean", "单臂划船")] },
            { sets: 2, exercises: [keep("Tricep Dip"), replace("Russian Twist", "Pallof Press")] },
            { sets: 3, exercises: [replace("Straight Leg Raise", "Leg Lowers"), keep("Diagonal Toe Tap")] },
          ],
          notes: [
            { kind: "callout", text: "前 3 组是整个周二线里最好的一段：四个动作全是抗变形加臀中肌，没有一个多余。" },
          ],
        },
        {
          day: "sat",
          movedFrom: "thu",
          title: "Building Strength",
          alsoUsedIn: [8],
          summary: "整堂 4 个推、0 个拉，是唯一完全没有拉的一堂。",
          blocks: [
            { sets: 2, exercises: [keep("Bodyweight Squat"), keep("Press Up"), keep("Glute Bridge into Hamstring Walkout"), keep("Mountain Climber")] },
            { sets: 3, exercises: [keep("Staggered Stance RDLs")] },
            { sets: 3, exercises: [keep("Standing Single Arm Shoulder Press")] },
            { sets: 2, exercises: [keep("Step Down", true), replace("Incline Dumbbell Bench Press", "Face Pull")] },
            { sets: 2, exercises: [keep("Lateral Walk"), replace("Single Arm Clean and Press", "单臂划船")] },
            { sets: 2, exercises: [keep("Side Plank with Hip Flexion"), modify("Double Leg Skipping", "30 秒")] },
          ],
          notes: [
            { kind: "callout", text: "Step Down 是这堂的亮点。站台阶上单腿慢慢下放，纯离心负荷，直接对应跑步落地时股四头和臀中肌的工作方式，对跑者膝的预防价值很高。遇到就好好做，不要图快。" },
          ],
        },
      ],
    },

    // ── Week 4 ──────────────────────────────────────────────────────────────
    {
      week: 4,
      subtitle: "8/31 起 · 已完成 · 减量周",
      focus: "周四 3 处",
      notes: [
        { kind: "warning", text: "首次出现「同名不同内容」：这周的 Stronger Upper Body 与 W1 版几乎无重合。" },
      ],
      sessions: [
        {
          day: "mon",
          title: "Lower Body Strength（W4 版）",
          summary: "只改 1 处 + 1 处可选优化。Runna 自己排了 KB Swings。",
          blocks: [
            { sets: 3, exercises: [keep("Walking Lunge"), keep("Press Up"), keep("Side Lunge", true), keep("Lunge Hold Calf Raise", true)] },
            { sets: 3, exercises: [modify("Sumo Deadlift", "降 60–70%"), keep("KB Swings", true)] },
            { sets: 3, exercises: [modify("Farmer's Carry", "改单边（可选）"), keep("Bent Knee Calf Raise", true)] },
            { sets: 2, exercises: [keep("B-Stance Hip Thrusts"), keep("Standing March")] },
            { sets: 2, exercises: [keep("Banded Toe Raise", true), keep("Figure of 8s")] },
          ],
          notes: [
            {
              kind: "reason",
              title: "为什么",
              text:
                "Sumo Deadlift 不用换动作，降重量就行 —— 相扑硬拉的髋主导成分更多，对跑者比传统硬拉更合适。\n" +
                "Farmer's Carry → 单边（可选）：这不是错误是优化。双边练握力和躯干抗压，单手提（手提箱式）才练抗侧屈。",
            },
            {
              kind: "callout",
              text:
                "小腿覆盖是全程最完整的之一：Lunge Hold Calf Raise（弓步位）· Bent Knee Calf Raise（屈膝 = 比目鱼肌）· Banded Toe Raise（胫前肌）。比目鱼肌在长距离跑里承担比例更高却更常被漏掉。\n" +
                "Side Lunge 是全程唯一的侧向负重动作。",
            },
          ],
        },
        {
          day: "tue",
          title: "Stronger Upper Body（W4 版）",
          summary: "推拉 3:1。Lunge and Press 第四次，Single Arm Clean 第三次。",
          blocks: [
            { sets: 3, exercises: [keep("Mountain Climber"), keep("Step Up", true), keep("Press Up Position Walk Out"), keep("Press Up Position Diagonal Toe Tap")] },
            { sets: 2, exercises: [keep("Single Arm Row"), replace("Single Arm Clean", "Face Pull")] },
            { sets: 2, exercises: [keep("Seated Barbell Press"), keep("Single Arm Bench Press")] },
            { sets: 2, exercises: [replace("Lunge and Press", "引体 / 高位下拉"), keep("Plank")] },
            { sets: 3, exercises: [keep("Side Plank"), keep("Side Plank Leg Raise", true)] },
          ],
          notes: [
            { kind: "keep", title: "做得好", text: "Step Up（和 Step Down 互补，一个向心一个离心）· Side Plank Leg Raise（抗侧屈叠加臀中肌，比普通侧板更值钱）。" },
          ],
        },
        {
          day: "sat",
          movedFrom: "thu",
          title: "Full Body Strength（W4 版）",
          summary: "3 处要改，又是拉 = 0。",
          blocks: [
            { sets: 3, exercises: [keep("Side Leg Swings"), keep("Travelling Press Up Walk Out"), keep("Clam Shells"), keep("Bear Crawl")] },
            { sets: 2, exercises: [keep("Single Leg Squat"), replace("Hurdle Hops", "侧向跨步")] },
            { sets: 2, exercises: [keep("Single Leg SLDL with Knee Drive"), keep("Barbell Bench Press")] },
            { sets: 2, exercises: [replace("Thruster", "单臂划船"), keep("Single Leg Calf Raise")] },
            { sets: 2, exercises: [keep("Diagonal Toe Tap"), replace("Hanging Knee Raise", "Leg Lowers")] },
          ],
          notes: [
            {
              kind: "callout",
              text:
                "这里没有照搬统一规则。规则说 Hurdle Hops 换成快节奏单腿提踵，但这堂已经有 Single Leg Calf Raise 了，再加一个是重复。换成侧向跨步既避开腾空，又补上这堂缺的侧向髋。\n" +
                "规则是默认值，遇到重复时按实际内容调整。",
            },
          ],
        },
      ],
    },

    // ── Week 5 ──────────────────────────────────────────────────────────────
    {
      week: 5,
      subtitle: "9/7 起 · 36km / 长课 14km",
      focus: "周四最要紧",
      sessions: [
        {
          day: "mon",
          title: "Lower Body Strength Workout（W5 版 · 与 W4 版不同）",
          summary: "4 处要改。一堂标着「下肢」的课里塞了 Thruster 和 Lunge and Press 两个上肢推举复合。",
          blocks: [
            { sets: 2, exercises: [keep("Lunge Hold Calf Raise"), keep("Press Up"), keep("Toe Scrunches", true), keep("Fire Hydrants")] },
            { sets: 2, exercises: [keep("Lateral Walk"), modify("Pogo Jumps", "20–30 秒，落地要轻")] },
            { sets: 2, exercises: [keep("Banded Quad Extension"), keep("Standing March")] },
            { sets: 2, exercises: [keep("Raised Leg Hip Thrust"), replace("Thruster", "单腿 RDL")] },
            { sets: 2, exercises: [replace("Standing Side Bend", "手提箱行走"), replace("Lunge and Press", "单腿提踵")] },
          ],
          notes: [
            {
              kind: "callout",
              text:
                "这次不换成划船。这是下肢课，缺的不是拉，是真正的单腿后链内容——原课里下肢的实质负荷其实很少（大多是激活和辅助）。\n" +
                "Pogo Jumps 不砍。原地小幅弹跳的落地冲击远低于栏架跳，练的跟腱刚度对跑步经济性有直接价值。落地要轻、脚踝主导、不要蹲下去。",
            },
            { kind: "keep", text: "Toe Scrunches 是新面孔，值得认真做。脚趾抓地练足内在肌，直接关系足弓支撑和足底筋膜炎预防。" },
          ],
        },
        {
          day: "tue",
          title: "Upper Body Lift（W5 版）",
          summary: "周二线里最好的一堂，只改 1 处。推拉 3:2 是最平衡的。",
          blocks: [
            { sets: 3, exercises: [keep("Mountain Climber"), keep("Press Up Position Walk Out"), keep("Press Up Position Diagonal Toe Tap"), keep("Travelling Press Up Walk Out")] },
            { sets: 2, exercises: [keep("Dumbbell Chest Fly"), keep("Standing Single Arm Shoulder Press")] },
            { sets: 2, exercises: [keep("Bent Over Row"), keep("Side Plank")] },
            { sets: 2, exercises: [keep("Single Arm Row"), replace("Single Arm Clean and Press", "Face Pull")] },
            { sets: 3, exercises: [keep("Short Lever Copenhagen Plank", true), keep("Plank Twist")] },
          ],
          notes: [
            { kind: "keep", text: "Copenhagen Plank 一定要做。Dumbbell Chest Fly 和 Mountain Climber 是时间紧时最该先砍的两个。" },
          ],
        },
        {
          day: "sat",
          movedFrom: "thu",
          title: "Going Heavy",
          summary: "风险最高的一堂：两个大重量双腿复合，且排在长课前一天。",
          blocks: [
            { sets: 3, exercises: [keep("Bodyweight Squat"), keep("Diagonal Toe Tap"), keep("Squat to Calf Raise"), keep("Bear Crawl")] },
            { sets: 2, exercises: [modify("Barbell Squat", "降 60–70%"), keep("Banded Face Pulls", true)] },
            { sets: 2, exercises: [keep("KB Swings"), keep("Seated Calf Raise")] },
            { sets: 2, exercises: [keep("Standing Front Raise"), replace("Sumo Deadlift", "单腿 RDL")] },
            { sets: 2, exercises: [replace("Straight Leg Raise", "Leg Lowers"), keep("Side Plank Leg Raise")] },
          ],
          notes: [
            { kind: "warning", title: "改期是最要紧的一处", text: "杠铃深蹲 + 相扑硬拉的下肢疲劳会直接带进第二天长课。W5 长课 14km 后果有限，但同名模板若出现在 W11（26km）或 W13（29km）前，就是实打实的风险。" },
            { kind: "reason", text: "一堂课里两个大重量双腿复合对爬量期是过量，保留一个就够。二选一时留深蹲——硬拉的后链负荷和周一在做的重合更多。" },
            { kind: "callout", text: "Banded Face Pulls 是 16 堂里第一次出现外旋动作。肩袖不是完全没有，是极少。" },
          ],
        },
      ],
    },

    // ── Week 6 ──────────────────────────────────────────────────────────────
    {
      week: 6,
      subtitle: "9/14 起 · 39.5km / 长课 16km",
      focus: "质量最好的一周",
      notes: [
        { kind: "callout", text: "质量最好的一周。" },
      ],
      sessions: [
        {
          day: "mon",
          title: "Loading Up",
          summary: "十六堂里最好的一堂，只需降一个重量，不用换任何动作。",
          blocks: [
            { sets: 3, exercises: [keep("Bodyweight Squat"), keep("Press Up"), keep("Side Leg Swings"), keep("Floating Heel Drop", true)] },
            { sets: 3, exercises: [keep("Raised Leg Hip Thrust"), keep("Hip Drop")] },
            { sets: 3, exercises: [keep("Step Down", true), keep("Bent Knee Calf Raise", true)] },
            { sets: 2, exercises: [modify("Barbell Squat", "降 60–70%"), keep("Double Leg Calf Raise on Step")] },
            { sets: 2, exercises: [keep("Side Plank with Hip Flexion"), keep("Plank")] },
          ],
          notes: [
            { kind: "keep", text: "小腿与跟腱覆盖是全程最完整的：Floating Heel Drop（离心）+ Bent Knee Calf Raise（比目鱼肌）+ Double Leg Calf Raise on Step（全幅度），再加 Step Down 的离心控制。" },
            { kind: "callout", text: "Step Down 慢做。这堂给了 3 组，是全程最多的一次。下放全程 3 秒以上，膝盖不要内扣。做快了就没意义。Floating Heel Drop 同理，重点在放下去那一段。" },
          ],
        },
        {
          day: "tue",
          title: "Upper Body Strength（W6 版 · 与 W3 版不同）",
          summary: "Lunge and Press 第六次、Double Arm Clean 第四次。换掉之前这堂拉 = 0。",
          blocks: [
            { sets: 3, exercises: [keep("Mountain Climber"), keep("Lunge Hold Calf Raise"), keep("Press Up Position Walk Out"), keep("Press Up Position Diagonal Toe Tap")] },
            { sets: 2, exercises: [replace("Lunge and Press", "单臂划船")] },
            { sets: 2, exercises: [keep("Single Arm Bench Press")] },
            { sets: 2, exercises: [keep("Banded Face Pulls", true), replace("Double Arm Clean", "引体 / 高位下拉")] },
            { sets: 2, exercises: [keep("Incline Barbell Bench Press"), keep("Side Plank")] },
            { sets: 3, exercises: [keep("Diagonal Toe Tap"), keep("Plank Pull Through", true)] },
          ],
          notes: [
            { kind: "reason", text: "这堂不用额外加 Face Pull —— Banded Face Pulls 已经在里面了（第二次出现）。" },
            { kind: "keep", text: "Plank Pull Through 是新面孔：平板支撑位下单手把重物拖到另一侧，抗旋转强度比 Diagonal Toe Tap 高一档。Lunge Hold Calf Raise 在上肢课里是低负荷填充，不算「腿部复合混入」。" },
          ],
        },
        {
          day: "sat",
          movedFrom: "thu",
          title: "Full Body Strength Workout（W6 版）",
          summary: "只改 1 处 + 改期。",
          blocks: [
            { sets: 2, exercises: [keep("Squat to Calf Raise"), keep("Travelling Press Up Walk Out"), keep("Heel Walks", true), keep("Bear Crawl")] },
            { sets: 3, exercises: [keep("Reverse Lunge")] },
            { sets: 3, exercises: [keep("Dumbbell Bench Press")] },
            { sets: 2, exercises: [keep("KB Straight Leg Deadlift"), keep("Single Arm Row")] },
            { sets: 2, exercises: [keep("Single Leg SLDL with Knee Drive"), keep("Standing Double Arm Shoulder Press")] },
            { sets: 2, exercises: [keep("Press-Up Position with Single Arm Extensions", true), replace("Single Arm Clean and Press", "Face Pull")] },
          ],
          notes: [
            {
              kind: "warning",
              title: "更正：Toe Walks 和 Heel Walks 练的不是同一块肌肉",
              text:
                "Heel Walks（脚跟着地走、脚尖抬起）才是胫前肌，对应胫骨痛预防。\n" +
                "Toe Walks（踮脚走）练的是小腿三头肌和足内在肌。\n" +
                "两个都值得做，但作用不同。",
            },
          ],
        },
      ],
    },
  ],
};
