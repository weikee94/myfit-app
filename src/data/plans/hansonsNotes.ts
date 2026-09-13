// Hansons plan notes (课表重点 / 术语解说 / 训练日调换原则), transcribed from the user's sheet.
// Converted from Traditional to Simplified Chinese; wording and numbers unchanged.

export const HANSONS_WORKOUT_NOTES: { title: string; points: string[] }[] = [
  {
    title: "速度跑",
    points: [
      "以5公里及10公里跑步表现作为依据，配速介于80~95%的最大摄氧量间",
      "课表原则是逐步增加，本周400m一组，下周800m，达到1600m后再逐步下修",
      "组间可以使用轻松跑作为动态恢复或是停下来休息都可，研究显示差别不大",
      "休息时间大约是每组的50~100%，比如400m跑80秒，则组间休40~80秒皆可",
    ],
  },
  {
    title: "轻松跑",
    points: [
      "跑步持续时间介于20分钟~2.5小时",
      "强度维持在最大摄氧量55~75%，或约等于相较比赛配速每公里慢37.5~75秒",
      "轻松跑可以分为(B)快速(每公里慢37.5秒)或(A)慢速(每公里慢75秒)",
      "课表中的暖身或收操可以慢速轻松跑进行，也适合安排在强度训练的隔天",
      "更进阶的跑者在强度训练的前一天也可进行快速轻松跑",
      "轻松跑是汉森课表的主要训练元素，如果想要提升课表整体强度，可以先从增加轻松跑跑量开始",
    ],
  },
  {
    title: "长跑",
    points: [
      "速度必须比轻松跑更快，跑起来的体感不能与轻松跑一样轻松",
      "训练目的是：马拉松最后的16公里的疲劳程度。故不会在长跑前一天全休",
      "长跑不超过每周跑量的25~30%，时间应控制在2.5~3小时",
      "若恢复不佳，可以减少训练长度，但不要降低训练速度",
    ],
  },
  {
    title: "节奏跑",
    points: [
      "就是马拉松配速跑",
      "全程稳定配速是关键，特别是绝对不要前段快后段慢(positive split)",
      "不要停下来",
    ],
  },
];

export const HANSONS_TERMS = {
  example: "2k WU+12x(400m@5-10k pace+400m jog rest)+2k CD",
  terms: [
    { term: "2k WU", meaning: "代表2公里暖身(Warm up, WU)，速度参照配速表中的恢复跑即可" },
    { term: "12x(400m@5-10k pace+400m jog rest)", meaning: "代表每组400m，以5-10k目标配速的速度跑，组间用400m的轻松跑作为动态恢复" },
    { term: "2k CD", meaning: "代表以2公里缓和(Cool down, CD)作为收操" },
    { term: "MP", meaning: "Marathon Pace 马拉松比赛配速" },
    { term: "MP-10", meaning: "每公里比Marathon Pace再快10s" },
  ],
};

export const HANSONS_SCHEDULE_RULES = {
  intro: "如果跑步课表需要配合日常行程变动，则依据以下原则",
  points: [
    "不要连续两天安排素质练习(速度跑、节奏跑)",
    "每周两次的素质训练可以间隔天数拉长，中间以轻松跑代替",
    "若一周要休两次，尽量休在两个素质训练的中间",
    "长跑前一天不要全休",
  ],
};
