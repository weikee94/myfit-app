export interface BadmintonPractice {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  handedness: string;
  stages: [string, string];
  cues: { stage: string; text: string }[];
  athleteKey: string;
}

export const BADMINTON_PRACTICES: BadmintonPractice[] = [
  {
    id: "forehand-overhead-ready",
    number: "01",
    title: "正手头顶球",
    subtitle: "准备 → 架拍",
    handedness: "右手持拍",
    stages: ["准备", "架拍"],
    athleteKey: "badminton forehand overhead ready",
    cues: [
      { stage: "准备", text: "双脚打开、屈膝，球拍放在身体前方。" },
      { stage: "转侧", text: "右脚后撤，肩髋转侧，重心加载右腿。" },
      { stage: "架拍", text: "右肘抬起、球拍位于头后上方，左臂抬起帮助定位和保持平衡。" },
    ],
  },
];
