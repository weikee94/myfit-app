// Stick-figure demos for exercises that have no free photo. Poses are illustrations designed from each
// exercise's definition, not traced from real footage — the UI always labels them 示意.
// Keys match demoKey() in exerciseDemos.ts. Cues are quoted from runnaMarathon.ts / benWorkouts.ts only.
// Not drawn on purpose (sideways / rotational movements a flat 2D figure would misrepresent):
// fire hydrant, plank pull through, plank twist.

import type { Pose, StickFigureSpec, StickProp } from "@/lib/stickFigure";
import { demoKey } from "@/data/exerciseDemos";

const FLOOR_88: StickProp = { kind: "floor", y: 88 };
const FLOOR_86: StickProp = { kind: "floor", y: 86 };
const FLOOR_90: StickProp = { kind: "floor", y: 90 };
const STAND: Pose = { hip: [50, 57], torso: 180, head: 180, armNear: [5, 5], armFar: [-5, -5], legNear: [0, 0, 90], legFar: [0, 0, 90] };

// ── Calves, feet, shins ──────────────────────────────────────────────────────

// Standing on the step edge on one leg; the heel sinks below the step, slowly, then rises.
const floatingHeelDrop: StickFigureSpec = (() => {
  const up: Pose = { hip: [48.5, 43.5], torso: 180, head: 180, armNear: [20, 60], armFar: [25, 65], legNear: [0, 0, 45], legFar: [10, -70, 20] };
  const down: Pose = { ...up, hip: [47.7, 49.5], legNear: [0, 0, 120] };
  return {
    view: "side", duration: 4, keyframes: [up, down], weights: [3, 1], anchor: { leg: "near", joint: "toe" },
    props: [FLOOR_90, { kind: "rect", x: 50, y: 78, w: 30, h: 12 }],
    cue: "重点在放下去那一段 · 离心",
  };
})();

// Both feet on the step edge: heels drop below the step, then rise onto the toes.
const doubleLegCalfRaiseOnStep: StickFigureSpec = (() => {
  const up: Pose = { hip: [48.5, 43.5], torso: 180, head: 180, armNear: [20, 60], armFar: [25, 65], legNear: [0, 0, 45], legFar: [0, 0, 50] };
  const down: Pose = { ...up, hip: [47.7, 49.5], legNear: [0, 0, 120], legFar: [0, 0, 125] };
  return {
    view: "side", duration: 3, keyframes: [down, up], weights: [1, 1.2], anchor: { leg: "near", joint: "toe" },
    props: [FLOOR_90, { kind: "rect", x: 50, y: 78, w: 30, h: 12 }],
    cue: "全幅度",
  };
})();

// One leg: rise onto the toes and lower; the free foot is tucked behind.
const singleLegCalfRaise: StickFigureSpec = (() => {
  const flat: Pose = { hip: [50, 57], torso: 180, head: 180, armNear: [20, 40], armFar: [25, 45], legNear: [0, 0, 90], legFar: [10, -70, 20] };
  const up: Pose = { ...flat, hip: [52.5, 52.7], legNear: [0, 0, 30] };
  return { view: "side", duration: 3.2, keyframes: [flat, up, up, flat], weights: [1, 0.5, 1.2, 0.5], props: [FLOOR_88], anchor: { leg: "near", joint: "toe" } };
})();

// Squat down, stand, rise onto the toes.
const squatToCalfRaise: StickFigureSpec = {
  view: "side", duration: 4, weights: [1.2, 1.2, 0.8, 0.8], anchor: { leg: "near", joint: "toe" },
  keyframes: [
    STAND,
    { hip: [43.1, 71.6], torso: 150, head: 155, armNear: [80, 85], armFar: [75, 80], legNear: [75, -35, 90], legFar: [73, -33, 90] },
    STAND,
    { hip: [52.5, 52.7], torso: 180, head: 180, armNear: [170, 175], armFar: [165, 170], legNear: [0, 0, 30], legFar: [0, 0, 30] },
  ],
  props: [FLOOR_88],
};

// Hold a lunge; the front foot rises onto its toes and lowers.
const lungeHoldCalfRaise: StickFigureSpec = (() => {
  const down: Pose = { hip: [45, 67.8], torso: 180, head: 180, armNear: [20, -60], armFar: [-20, 60], legNear: [70, -10, 90], legFar: [-20, -85, 39] };
  const up: Pose = { ...down, hip: [47.5, 63.4], legNear: [70, -10, 30], legFar: [-15, -60, 71] };
  return { view: "side", duration: 3.2, keyframes: [down, up, up, down], weights: [1, 0.6, 1, 0.6], props: [FLOOR_88], anchor: { leg: "near", joint: "toe" }, cue: "弓步位" };
})();

// Walking on the balls of the feet.
const toeWalkPoses = (() => {
  const a: Pose = { hip: [50, 53.3], torso: 180, head: 180, armNear: [-25, -15], armFar: [25, 45], legNear: [15, 5, 30], legFar: [-15, -20, 20] };
  const b: Pose = { ...a, armNear: [25, 45], armFar: [-25, -15], legNear: [-15, -20, 20], legFar: [15, 5, 30] };
  return [a, b];
})();

const toeWalk: StickFigureSpec = { view: "side", duration: 1.2, keyframes: toeWalkPoses, props: [FLOOR_88], cue: "踮脚走 · 小腿三头肌和足内在肌" };

const loadedWalkingCalfRaise: StickFigureSpec = {
  view: "side", duration: 1.4, hold: ["near", "far"], props: [FLOOR_88],
  keyframes: toeWalkPoses.map((p) => ({ ...p, armNear: [3, 3] as [number, number], armFar: [-3, -3] as [number, number] })),
  cue: "负重行走提踵",
};

// Walking in place on the heels, toes pointing up.
const heelWalk: StickFigureSpec = (() => {
  const a: Pose = { hip: [50, 58.3], torso: 180, head: 180, armNear: [-25, -15], armFar: [25, 45], legNear: [25, 12, 140], legFar: [-20, -12, 130] };
  const b: Pose = { ...a, armNear: [25, 45], armFar: [-25, -15], legNear: [-20, -12, 130], legFar: [25, 12, 140] };
  return { view: "side", duration: 1.2, keyframes: [a, b], props: [FLOOR_88], cue: "脚跟着地走、脚尖抬起 · 胫前肌，对应胫骨痛预防" };
})();

// Long sit: pull the toes up toward the shin and let them go back down.
const bandedToeRaise: StickFigureSpec = (() => {
  const down: Pose = { hip: [40, 83], torso: 170, head: 170, armNear: [45, 20], armFar: [40, 15], legNear: [90, 90, 115], legFar: [90, 90, 112] };
  const up: Pose = { ...down, legNear: [90, 90, 190], legFar: [90, 90, 187] };
  return { view: "side", duration: 2, keyframes: [down, up], props: [FLOOR_86], cue: "胫前肌，防胫骨痛" };
})();

// Small bounces driven by the ankles, knees nearly straight.
const pogoJump: StickFigureSpec = (() => {
  const ground: Pose = { hip: [50, 53.3], torso: 180, head: 180, armNear: [-15, 50], armFar: [-10, 55], legNear: [5, -5, 40], legFar: [3, -3, 42] };
  const air: Pose = { ...ground, hip: [50, 49.3], legNear: [3, -3, 30], legFar: [2, -2, 32] };
  return { view: "side", duration: 0.8, keyframes: [ground, air], props: [FLOOR_88], cue: "落地要轻、脚踝主导、不要蹲下去" };
})();

// ── Walking, carries, standing drills ────────────────────────────────────────

const standingMarch: StickFigureSpec = {
  view: "side", duration: 2.4, props: [FLOOR_88],
  keyframes: [
    STAND,
    { ...STAND, armNear: [-30, -20], armFar: [35, 80], legNear: [80, -5, 90] },
    STAND,
    { ...STAND, armNear: [35, 80], armFar: [-30, -20], legFar: [80, -5, 90] },
  ],
};

// One weight in one hand, walking tall.
const suitcaseCarry: StickFigureSpec = (() => {
  const a: Pose = { hip: [50, 58], torso: 180, head: 180, armNear: [0, 0], armFar: [25, 45], legNear: [20, 5, 90], legFar: [-15, -15, 90] };
  const b: Pose = { ...a, armFar: [-20, -10], legNear: [-15, -15, 90], legFar: [20, 5, 90] };
  return { view: "side", duration: 1.4, hold: ["near"], keyframes: [a, b], props: [FLOOR_88], cue: "单手提（手提箱式）才练抗侧屈" };
})();

// Front view, half squat: step the feet apart and back together.
const lateralWalk: StickFigureSpec = (() => {
  const wide: Pose = { hip: [50, 58.6], pelvis: 90, torso: 180, head: 180, armNear: [35, -35], armFar: [-35, 35], legNear: [25, 5, 90], legFar: [-25, -5, -90] };
  const narrow: Pose = { ...wide, legNear: [18, -5, 90] };
  return { view: "front", duration: 1.6, keyframes: [wide, narrow], props: [FLOOR_88] };
})();

// Front view: from a wide stance, sit the hips toward one bent knee with the other leg straight.
const sideLunge: StickFigureSpec = (() => {
  const stand: Pose = { hip: [50, 59.3], pelvis: 90, torso: 180, head: 180, armNear: [15, 10], armFar: [-15, -10], legNear: [22, 22, 90], legFar: [-22, -22, -90] };
  const lunge: Pose = { ...stand, hip: [59, 65], legNear: [46.8, -37.2, 90], legFar: [-41.9, -41.9, -90] };
  return { view: "front", duration: 3, keyframes: [stand, lunge, lunge, stand], weights: [1, 0.5, 1, 0.4], props: [FLOOR_88], anchor: { leg: "near", joint: "ankle" }, cue: "侧向负重" };
})();

// Front view: standing on one leg, swing the other leg out to the side and across.
const sideLegSwing: StickFigureSpec = (() => {
  const out: Pose = { hip: [50, 57], pelvis: 90, torso: 180, head: 180, armNear: [30, -30], armFar: [-30, 30], legNear: [35, 35, 90], legFar: [0, 0, -90] };
  const across: Pose = { ...out, legNear: [-20, -20, 90] };
  return { view: "front", duration: 1.8, keyframes: [out, across], props: [FLOOR_88] };
})();

// Front view on a step: the free side of the pelvis drops below level, then lifts above it.
const hipDrop: StickFigureSpec = (() => {
  const drop: Pose = { hip: [51, 50.75], pelvis: 120, torso: 180, head: 180, armNear: [30, -30], armFar: [-30, 30], legNear: [0, 0, 90], legFar: [0, 0, -90] };
  const hike: Pose = { ...drop, hip: [51, 47.25], pelvis: 60 };
  return {
    view: "front", duration: 2.4, keyframes: [drop, hike],
    props: [FLOOR_90, { kind: "rect", x: 51, y: 80, w: 22, h: 10 }],
    cue: "练跑步单腿支撑时的骨盆稳定",
  };
})();

// ── Hinges, squats, single-leg strength ──────────────────────────────────────

// Hinge forward on the standing leg with the free leg reaching back; come up driving that knee forward.
const singleLegSldlKneeDrive: StickFigureSpec = (() => {
  const drive: Pose = { hip: [45, 57], torso: 180, head: 180, armNear: [-30, -80], armFar: [40, 120], legNear: [0, 0, 90], legFar: [90, 0, 90] };
  const mid: Pose = { hip: [45, 57], torso: 180, head: 180, armNear: [5, 5], armFar: [-5, -5], legNear: [0, 0, 90], legFar: [0, 0, 90] };
  const hinge: Pose = { hip: [43.5, 57.3], torso: 90, head: 95, armNear: [5, 5], armFar: [3, 3], legNear: [10, -5, 90], legFar: [-95, -95, 0] };
  return {
    view: "side", duration: 4.4, keyframes: [drive, mid, hinge, mid], weights: [1, 1, 1.4, 1], props: [FLOOR_88], anchor: { leg: "near", joint: "ankle" },
    cue: "比普通单腿 RDL 多了抬膝，更接近跑步的摆动腿模式",
  };
})();

// Split stance with the back foot on its toes; hinge on the front leg with a weight in each hand.
const staggeredStanceRdl: StickFigureSpec = {
  view: "side", duration: 3.2, weights: [1.5, 1], hold: ["near", "far"], props: [FLOOR_88], anchor: { leg: "near", joint: "ankle" },
  keyframes: [
    { hip: [45, 57], torso: 180, head: 180, armNear: [0, 0], armFar: [2, 2], legNear: [0, 0, 90], legFar: [-20, -20, 60] },
    { hip: [40, 58.5], torso: 95, head: 100, armNear: [0, 0], armFar: [2, 2], legNear: [24.4, -6.1, 90], legFar: [-15, -25, 80] },
  ],
};

const singleLegSquatPoses: Pose[] = [
  { hip: [50, 57], torso: 175, head: 175, armNear: [90, 90], armFar: [88, 88], legNear: [0, 0, 90], legFar: [45, 45, 100] },
  { hip: [43.1, 71.6], torso: 155, head: 160, armNear: [95, 95], armFar: [93, 93], legNear: [75, -35, 90], legFar: [85, 85, 110] },
];

const singleLegSquat: StickFigureSpec = { view: "side", duration: 3.2, keyframes: singleLegSquatPoses, weights: [2, 1.2], props: [FLOOR_88], anchor: { leg: "near", joint: "ankle" } };

// Same single-leg squat, lowering slowly onto a box behind.
const squatOntoOneLeg: StickFigureSpec = {
  view: "side", duration: 3.7, keyframes: singleLegSquatPoses, weights: [2.5, 1.2], anchor: { leg: "near", joint: "ankle" },
  props: [FLOOR_88, { kind: "rect", x: 22, y: 70, w: 20, h: 18 }],
  cue: "单腿力量 + 离心控制",
};

// ── Bridges and hip thrusts ──────────────────────────────────────────────────

const HIP_THRUST_BENCH: StickProp = { kind: "rect", x: 8, y: 70, w: 26, h: 15 };

// Upper back on a bench, one foot forward as a kickstand; drive the hips up.
const bStanceHipThrust: StickFigureSpec = (() => {
  const bottom: Pose = { hip: [52, 79.5], torso: -115.4, head: -115.4, armNear: [-60, -90], armFar: [-58, -90], legNear: [123.3, 17.8, 90], legFar: [107.5, 42.3, 150] };
  const top: Pose = { hip: [54, 70], torso: -90, head: -90, armNear: [-60, -90], armFar: [-58, -90], legNear: [90, 0, 90], legFar: [80, 30, 150] };
  return { view: "side", duration: 3.1, keyframes: [bottom, top, top, bottom], weights: [1, 0.6, 1, 0.5], props: [{ kind: "floor", y: 85 }, HIP_THRUST_BENCH] };
})();

// Same thrust on one leg, the other leg held out straight.
const raisedLegHipThrust: StickFigureSpec = (() => {
  const bottom: Pose = { hip: [52, 79.5], torso: -115.4, head: -115.4, armNear: [-60, -90], armFar: [-58, -90], legNear: [123.3, 17.8, 90], legFar: [115, 115, 190] };
  const top: Pose = { hip: [54, 70], torso: -90, head: -90, armNear: [-60, -90], armFar: [-58, -90], legNear: [90, 0, 90], legFar: [100, 100, 180] };
  return { view: "side", duration: 3.1, keyframes: [bottom, top, top, bottom], weights: [1, 0.6, 1, 0.5], props: [{ kind: "floor", y: 85 }, HIP_THRUST_BENCH] };
})();

const BRIDGE_DOWN: Pose = { hip: [50, 83], torso: -90, head: -90, armNear: [95, 90], armFar: [93, 90], legNear: [138.3, 5.2, 90], legFar: [136, 6, 90] };
const BRIDGE_UP: Pose = { hip: [48, 74], torso: -65.8, head: -70, armNear: [95, 90], armFar: [93, 90], legNear: [100.6, -6.7, 90], legFar: [99, -5, 90] };

// Bridge up, walk the feet out and back in, lower.
const gluteBridgeHamstringWalkout: StickFigureSpec = {
  view: "side", duration: 4.4, weights: [1, 1.2, 1.2, 1], props: [FLOOR_86],
  keyframes: [
    BRIDGE_DOWN,
    BRIDGE_UP,
    { hip: [49.5, 77.6], torso: -75.9, head: -78, armNear: [95, 90], armFar: [93, 90], legNear: [89.6, 56.4, 90], legFar: [89, 55, 90] },
    BRIDGE_UP,
  ],
};

// Single-leg bridge held at the top, the free leg pointing up.
const singleLegIsometricHamstringHold: StickFigureSpec = {
  view: "side", duration: 5.6, weights: [1, 3, 1, 0.6], props: [FLOOR_86],
  keyframes: [
    { ...BRIDGE_DOWN, legFar: [150, 150, 180] },
    { ...BRIDGE_UP, legFar: [140, 140, 180] },
    { ...BRIDGE_UP, legFar: [140, 140, 180] },
    { ...BRIDGE_DOWN, legFar: [150, 150, 180] },
  ],
  cue: "腘绳等长，低疲劳高收益",
};

// ── Core on the floor ────────────────────────────────────────────────────────

// Lying on the back: lift shoulders, arms and legs into a shallow banana shape and hold.
const hollowBody: StickFigureSpec = (() => {
  const flat: Pose = { hip: [50, 83], torso: -90, head: -90, armNear: [-90, -90], armFar: [-90, -90], legNear: [90, 90, 180], legFar: [90, 90, 180] };
  const hollow: Pose = { hip: [50, 83], torso: -110, head: -115, armNear: [-115, -115], armFar: [-112, -112], legNear: [110, 110, 180], legFar: [108, 108, 180] };
  return { view: "side", duration: 4.6, keyframes: [flat, hollow, hollow, flat], weights: [1, 2, 1, 0.6], props: [FLOOR_86], cue: "抗伸展" };
})();

// Lying on the back, legs straight up; lower them slowly toward the floor.
const legLower: StickFigureSpec = (() => {
  const up: Pose = { hip: [50, 83], torso: -90, head: -90, armNear: [90, 90], armFar: [88, 88], legNear: [180, 180, 90], legFar: [178, 178, 90] };
  const down: Pose = { ...up, legNear: [105, 105, 180], legFar: [103, 103, 180] };
  return { view: "side", duration: 4, keyframes: [up, down], weights: [3, 1], props: [FLOOR_86], cue: "抗伸展 + 骨盆控制" };
})();

// Seated with hands behind: lift the hips until the body is a straight line from shoulders to heels.
const backPlank: StickFigureSpec = (() => {
  const sit: Pose = { hip: [45, 83], torso: -130, head: -130, armNear: [-42, -42], armFar: [-40, -40], legNear: [90, 90, 170], legFar: [90, 90, 165] };
  const up: Pose = { hip: [47.9, 72.75], torso: -115.3, head: -115.3, armNear: [-10, -10], armFar: [-8, -8], legNear: [64.7, 64.7, 150], legFar: [64.7, 64.7, 145] };
  return { view: "side", duration: 4, keyframes: [sit, up, up, sit], weights: [1, 1.5, 1, 0.6], props: [FLOOR_86], cue: "前链拉开 + 后链激活" };
})();

// On hands and toes with knees hovering; crawl in place with opposite hand and foot.
const bearCrawl: StickFigureSpec = (() => {
  const base: Pose = { hip: [35, 66], torso: 92.6, head: 100, armNear: [0, 0], armFar: [2, 2], legNear: [10, -80, 44], legFar: [12, -78, 46] };
  return {
    view: "side", duration: 2.4, props: [FLOOR_88],
    keyframes: [base, { ...base, legNear: [35, -60, 60], armFar: [12, 12] }, base, { ...base, legFar: [35, -60, 60], armNear: [12, 12] }],
  };
})();

// Side-lying, seen from the front.
const SIDE_LYING: Pose = { hip: [50, 71], torso: -90, head: -90, armNear: [95, 80], armFar: [-90, -90], legNear: [88, 88, 178], legFar: [90, 90, 180] };
const MAT: StickProp = { kind: "rect", x: 3, y: 66, w: 94, h: 24 };

// Feet stay together while the top knee opens up and back down.
const clamShell: StickFigureSpec = (() => {
  const closed: Pose = { ...SIDE_LYING, legNear: [58, 122, 90], legFar: [60, 120, 90] };
  const open: Pose = { ...closed, legNear: [120, 57, 90] };
  return {
    view: "front", duration: 3.4, keyframes: [closed, open, open, closed], weights: [1, 0.8, 1, 0.6],
    props: [{ kind: "rect", x: 3, y: 66, w: 91, h: 24 }],
    cue: "臀中肌 · 防膝内扣",
  };
})();

// Top leg lifts straight up and lowers.
const legLiftPoses: Pose[] = [SIDE_LYING, { ...SIDE_LYING, legNear: [115, 115, 205] }];
const legLift: StickFigureSpec = {
  view: "front", duration: 3, keyframes: [legLiftPoses[0], legLiftPoses[1], legLiftPoses[1], legLiftPoses[0]], weights: [1, 0.5, 1, 0.5],
  props: [MAT], cue: "臀中肌",
};
const legLiftHold: StickFigureSpec = {
  view: "front", duration: 5.5, keyframes: [legLiftPoses[0], legLiftPoses[1], legLiftPoses[1], legLiftPoses[0]], weights: [1, 3, 1, 0.5],
  props: [MAT], cue: "臀中肌耐力 · 你最缺的一块",
};

// ── Side planks ──────────────────────────────────────────────────────────────

// Side plank on the elbow, seen from the front, body in a straight line.
const SIDE_PLANK: Pose = { hip: [43.6, 81.9], torso: -100.1, head: -100.1, armNear: [110, 100], armFar: [0, 90], legNear: [79.9, 79.9, 160], legFar: [79.9, 79.9, 160] };

const sidePlankLegRaise: StickFigureSpec = {
  view: "front", duration: 2.4, keyframes: [SIDE_PLANK, { ...SIDE_PLANK, legNear: [110, 110, 180] }], props: [FLOOR_90],
  cue: "抗侧屈叠加臀中肌",
};

const sidePlankHipFlexion: StickFigureSpec = {
  view: "front", duration: 2.4, keyframes: [SIDE_PLANK, { ...SIDE_PLANK, legNear: [205, 60, 90] }], props: [FLOOR_90],
};

// Side plank on the elbow with the top knee on a bench: lift the hips into a straight line and hold.
const copenhagenShortLever: StickFigureSpec = (() => {
  const down: Pose = { hip: [52.9, 86], torso: -99.5, head: -99.5, armNear: [80, 85], armFar: [-50.7, 90], legNear: [156, 0, 90], legFar: [90, 90, 90] };
  const up: Pose = { hip: [43.7, 74.2], torso: -80.1, head: -80.1, armNear: [110, 95], armFar: [0, 90], legNear: [100.1, 0, 90], legFar: [45, 90, 90] };
  return {
    view: "front", duration: 5.7, keyframes: [down, up, up, down], weights: [1.2, 2.5, 1.2, 0.8], anchor: { leg: "near", joint: "knee" },
    props: [
      FLOOR_90,
      { kind: "rect", x: 54, y: 72, w: 28, h: 3 },   // bench top
      { kind: "rect", x: 56, y: 75, w: 2, h: 15 },   // bench legs
      { kind: "rect", x: 78, y: 75, w: 2, h: 15 },
    ],
    cue: "内收肌等长",
  };
})();

// ── Plank walk-outs ──────────────────────────────────────────────────────────

const WALK_STAND: Pose = { hip: [22, 57], torso: 180, head: 180, armNear: [5, 5], armFar: [-5, -3], legNear: [0, 0, 90], legFar: [0, 0, 90] };
const WALK_FOLD: Pose = { hip: [18.2, 63.7], torso: 60, head: 65, armNear: [55, 55], armFar: [53, 53], legNear: [45, -30, 90], legFar: [45, -30, 90] };
const PLANK: Pose = { hip: [50.7, 73.3], torso: 112.2, head: 112.2, armNear: [0, 0], armFar: [2, 2], legNear: [-67.8, -67.8, 45], legFar: [-67.8, -67.8, 40] };
const PUSH_UP_BOTTOM: Pose = { hip: [52.4, 79.1], torso: 100.9, head: 100.9, armNear: [-64.2, 45], armFar: [-62, 44], legNear: [-79.1, -79.1, 45], legFar: [-79.1, -79.1, 40] };

// Hinge down, walk the hands out to a press-up position, walk back and stand.
const pressUpPositionWalkOut: StickFigureSpec = {
  view: "side", duration: 5, keyframes: [WALK_STAND, WALK_FOLD, PLANK, WALK_FOLD], weights: [1, 1.5, 1.5, 1], props: [FLOOR_88], anchor: { leg: "near", joint: "toe" },
};

// Walk out, one press-up, walk back.
const travellingPressUpWalkOut: StickFigureSpec = {
  view: "side", duration: 6, keyframes: [WALK_STAND, WALK_FOLD, PLANK, PUSH_UP_BOTTOM, PLANK, WALK_FOLD], weights: [1, 1.5, 1, 1, 1.5, 1], anchor: { leg: "near", joint: "toe" },
  props: [FLOOR_88],
};

// Press-up position: reach one arm straight forward and back.
const pressUpSingleArmExtension: StickFigureSpec = {
  view: "side", duration: 3.4, props: [FLOOR_88], weights: [1, 0.8, 1, 0.6],
  keyframes: [PLANK, { ...PLANK, armNear: [95, 95] }, { ...PLANK, armNear: [95, 95] }, PLANK],
};

export const STICK_FIGURES: Record<string, StickFigureSpec> = {
  // calves, feet, shins
  "floating heel drop":                           floatingHeelDrop,
  "double leg calf raise on step":                doubleLegCalfRaiseOnStep,
  "single leg calf raise":                        singleLegCalfRaise,
  "单腿提踵":                                      singleLegCalfRaise,
  "squat to calf raise":                          squatToCalfRaise,
  "lunge hold calf raise":                        lungeHoldCalfRaise,
  "toe walk":                                     toeWalk,
  "loaded walking calf raise":                    loadedWalkingCalfRaise,
  "heel walk":                                    heelWalk,
  "banded toe raise":                             bandedToeRaise,
  "pogo jump":                                    pogoJump,
  // walking, carries, standing drills
  "standing march":                               standingMarch,
  "手提箱行走":                                    suitcaseCarry,
  "lateral walk":                                 lateralWalk,
  "side lunge":                                   sideLunge,
  "side leg swing":                               sideLegSwing,
  "hip drop":                                     hipDrop,
  "step down":                                    stepDown(),
  // hinges, squats, single-leg strength
  "single leg sldl with knee drive":              singleLegSldlKneeDrive,
  "staggered stance rdl":                         staggeredStanceRdl,
  "single leg squat":                             singleLegSquat,
  "单腿蹲":                                        singleLegSquat,
  "squat onto one leg":                           squatOntoOneLeg,
  // bridges and hip thrusts
  "b-stance hip thrust":                          bStanceHipThrust,
  "raised leg hip thrust":                        raisedLegHipThrust,
  "glute bridge into hamstring walkout":          gluteBridgeHamstringWalkout,
  "single leg isometric hamstring hold":          singleLegIsometricHamstringHold,
  // core on the floor
  "hollow body":                                  hollowBody,
  "leg lower":                                    legLower,
  "back plank":                                   backPlank,
  "bear crawl":                                   bearCrawl,
  "clam shell":                                   clamShell,
  "leg lift":                                     legLift,
  "leg lift hold":                                legLiftHold,
  // side planks
  "side plank leg raise":                         sidePlankLegRaise,
  "side plank with hip flexion":                  sidePlankHipFlexion,
  "short lever copenhagen plank":                 copenhagenShortLever,
  // plank walk-outs
  "press up position walk out":                   pressUpPositionWalkOut,
  "travelling press up walk out":                 travellingPressUpWalkOut,
  "press-up position with single arm extension":  pressUpSingleArmExtension,
};

// Standing leg on the step bends slowly while the free foot lowers to the floor in front, then back up.
function stepDown(): StickFigureSpec {
  return {
    view: "side", duration: 4.5, weights: [3, 1.5], anchor: { leg: "near", joint: "ankle" },
    keyframes: [
      { hip: [50, 51], torso: 175, head: 175, armNear: [20, 30], armFar: [15, 25], legNear: [0, 0, 90], legFar: [25, 15, 90] },
      { hip: [43, 62.2], torso: 165, head: 165, armNear: [60, 80], armFar: [55, 75], legNear: [65, -30, 90], legFar: [39.6, 39.6, 60] },
    ],
    props: [FLOOR_90, { kind: "rect", x: 28, y: 82, w: 30, h: 8 }],
    cue: "站台阶上单腿慢慢下放，纯离心负荷 · 下放全程 3 秒以上，膝盖不要内扣",
  };
}

export function findStickFigure(name: string): StickFigureSpec | undefined {
  return STICK_FIGURES[demoKey(name)];
}
