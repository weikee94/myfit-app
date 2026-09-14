// Stick-figure exercise illustrations drawn from joint angles (forward kinematics) and animated with SVG SMIL.
// Angles are absolute degrees in SVG space: 0 = pointing down, 90 = right, 180 = up, -90 = left.
// Because every bone is placed by angle, bone lengths stay constant in every frame.

export type Point = [number, number];

export interface Pose {
  hip:     Point;                      // root joint (pelvis centre), in a 100×100 viewBox
  pelvis?: number;                     // front views only: direction of the pelvis line (90 = level); legs attach either side
  torso:   number;                     // hip → neck
  head:    number;                     // neck → head centre
  armNear: [number, number];           // upper arm, forearm — near side, drawn solid
  armFar:  [number, number];           // far side, drawn faded
  legNear: [number, number, number];   // thigh, shin, foot
  legFar:  [number, number, number];
}

export type StickProp =
  | { kind: "floor"; y: number }
  | { kind: "rect"; x: number; y: number; w: number; h: number };   // step, bench, box, mat

export interface StickFigureSpec {
  view:      "side" | "front";
  duration:  number;               // seconds per loop
  keyframes: Pose[];               // the loop returns to the first keyframe
  weights?:  number[];             // relative duration of segment keyframes[i] → keyframes[i + 1]; equal by default
  props?:    StickProp[];
  hold?:     ("near" | "far")[];   // hands carrying a dumbbell / kettlebell
  // A joint that stays planted between keyframes (standing foot, toe on a step, knee on a bench).
  // In-between frames shift the whole body so this joint follows a straight path between its keyframe positions.
  anchor?:   { leg: "near" | "far"; joint: "knee" | "ankle" | "toe" };
  cue?:      string;               // quoted from the plan notes only
}

export interface Joints {
  hip: Point; neck: Point; head: Point;
  armNear: Point[]; armFar: Point[]; legNear: Point[]; legFar: Point[];   // legs start at their own hip point
}

const BONE = { torso: 22, neck: 5, headR: 4.5, upperArm: 12, forearm: 11, thigh: 16, shin: 15, foot: 5, pelvisHalf: 3.5 };
const STEPS_PER_SEGMENT = 10;

const rad = (deg: number) => (deg * Math.PI) / 180;
const move = (p: Point, len: number, deg: number): Point => [p[0] + Math.sin(rad(deg)) * len, p[1] + Math.cos(rad(deg)) * len];

export function poseJoints(p: Pose): Joints {
  const neck = move(p.hip, BONE.torso, p.torso);
  const hipNear = p.pelvis === undefined ? p.hip : move(p.hip, BONE.pelvisHalf, p.pelvis);
  const hipFar = p.pelvis === undefined ? p.hip : move(p.hip, -BONE.pelvisHalf, p.pelvis);
  const arm = ([upper, fore]: [number, number]) => {
    const elbow = move(neck, BONE.upperArm, upper);
    return [neck, elbow, move(elbow, BONE.forearm, fore)];
  };
  const leg = (root: Point, [thigh, shin, foot]: [number, number, number]) => {
    const knee = move(root, BONE.thigh, thigh);
    const ankle = move(knee, BONE.shin, shin);
    return [root, knee, ankle, move(ankle, BONE.foot, foot)];
  };
  return {
    hip: p.hip, neck, head: move(neck, BONE.neck, p.head),
    armNear: arm(p.armNear), armFar: arm(p.armFar), legNear: leg(hipNear, p.legNear), legFar: leg(hipFar, p.legFar),
  };
}

// Interpolate angles along the shortest path (170° → -170° turns 20°, not 340°), with ease-in-out.
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpAngle = (a: number, b: number, t: number) => a + (((((b - a) % 360) + 540) % 360) - 180) * t;
const ease = (t: number) => t * t * (3 - 2 * t);

function blend(a: Pose, b: Pose, t: number): Pose {
  const e = ease(t);
  const angles = <T extends number[]>(x: T, y: T) => x.map((v, i) => lerpAngle(v, y[i], e)) as T;
  return {
    hip: [lerp(a.hip[0], b.hip[0], e), lerp(a.hip[1], b.hip[1], e)],
    ...(a.pelvis !== undefined && b.pelvis !== undefined ? { pelvis: lerpAngle(a.pelvis, b.pelvis, e) } : {}),
    torso: lerpAngle(a.torso, b.torso, e),
    head: lerpAngle(a.head, b.head, e),
    armNear: angles(a.armNear, b.armNear),
    armFar: angles(a.armFar, b.armFar),
    legNear: angles(a.legNear, b.legNear),
    legFar: angles(a.legFar, b.legFar),
  };
}

const ANCHOR_INDEX = { knee: 1, ankle: 2, toe: 3 } as const;

// Blend two keyframes; with an anchor, move the hip so the planted joint doesn't drift or sink mid-move.
function blendAnchored(spec: StickFigureSpec, from: Pose, to: Pose, t: number): Pose {
  const pose = blend(from, to, t);
  if (!spec.anchor) return pose;
  const { leg, joint } = spec.anchor;
  const pick = (p: Pose) => poseJoints(p)[leg === "near" ? "legNear" : "legFar"][ANCHOR_INDEX[joint]];
  const a = pick(from), b = pick(to), current = pick(pose), e = ease(t);
  const target: Point = [lerp(a[0], b[0], e), lerp(a[1], b[1], e)];
  return { ...pose, hip: [pose.hip[0] + target[0] - current[0], pose.hip[1] + target[1] - current[1]] };
}

// Frames sampled by angle between keyframes (sampling joint coordinates instead would shrink bones mid-move).
export function sampleFrames(spec: StickFigureSpec): { poses: Pose[]; keyTimes: number[] } {
  const k = spec.keyframes;
  const weights = spec.weights ?? k.map(() => 1);
  const total = weights.reduce((sum, w) => sum + w, 0);
  const poses: Pose[] = [];
  const keyTimes: number[] = [];
  let elapsed = 0;
  k.forEach((from, i) => {
    const to = k[(i + 1) % k.length];
    for (let s = 0; s < STEPS_PER_SEGMENT; s++) {
      poses.push(blendAnchored(spec, from, to, s / STEPS_PER_SEGMENT));
      keyTimes.push((elapsed + (weights[i] * s) / STEPS_PER_SEGMENT) / total);
    }
    elapsed += weights[i];
  });
  poses.push(k[0]);
  keyTimes.push(1);
  return { poses, keyTimes };
}

const fmt = (n: number) => n.toFixed(1);
const points = (ps: Point[]) => ps.map((p) => `${fmt(p[0])},${fmt(p[1])}`).join(" ");

// One SVG string used both by the app and by the offline review page, so what gets reviewed is what ships.
// Pass `keyframe` for a still image of that keyframe (reduced motion).
export function stickFigureSvg(spec: StickFigureSpec, opts: { keyframe?: number } = {}): string {
  const still = opts.keyframe !== undefined;
  const { poses, keyTimes } = still ? { poses: [spec.keyframes[opts.keyframe!]], keyTimes: [0] } : sampleFrames(spec);
  const frames = poses.map(poseJoints);
  const kt = keyTimes.map((t) => t.toFixed(3)).join(";");

  const animate = (attr: string, values: string[]) =>
    still ? "" : `<animate attributeName="${attr}" dur="${spec.duration}s" repeatCount="indefinite" calcMode="linear" keyTimes="${kt}" values="${values.join(";")}"/>`;
  const stroke = 'fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  const limb = (pick: (j: Joints) => Point[]) =>
    `<polyline ${stroke} points="${points(pick(frames[0]))}">${animate("points", frames.map((j) => points(pick(j))))}</polyline>`;
  const weight = (side: "near" | "far") => {
    if (!spec.hold?.includes(side)) return "";
    const hands = frames.map((j) => (side === "near" ? j.armNear[2] : j.armFar[2]));
    return `<rect width="6" height="3.5" rx="1" fill="currentColor" x="${fmt(hands[0][0] - 3)}" y="${fmt(hands[0][1])}">` +
      `${animate("x", hands.map((h) => fmt(h[0] - 3)))}${animate("y", hands.map((h) => fmt(h[1])))}</rect>`;
  };

  const props = (spec.props ?? []).map((p) =>
    p.kind === "floor"
      ? `<line x1="2" x2="98" y1="${p.y}" y2="${p.y}" stroke="currentColor" stroke-opacity="0.35" stroke-width="1"/>`
      : `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="1" fill="currentColor" fill-opacity="0.1" stroke="currentColor" stroke-opacity="0.3" stroke-width="0.8"/>`
  ).join("");

  const heads = frames.map((j) => j.head);
  const head =
    `<circle cx="${fmt(heads[0][0])}" cy="${fmt(heads[0][1])}" r="${BONE.headR}" fill="currentColor">` +
    `${animate("cx", heads.map((h) => fmt(h[0])))}${animate("cy", heads.map((h) => fmt(h[1])))}</circle>`;
  const pelvis = spec.keyframes[0].pelvis !== undefined ? limb((j) => [j.legFar[0], j.legNear[0]]) : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">` +
    props +
    `<g opacity="0.4">${limb((j) => j.armFar)}${limb((j) => j.legFar)}${weight("far")}</g>` +
    limb((j) => [j.hip, j.neck]) + pelvis + head +
    limb((j) => j.armNear) + limb((j) => j.legNear) + weight("near") +
    `</svg>`
  );
}
