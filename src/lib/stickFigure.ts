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
  armFar:  [number, number];           // far side, drawn in a quieter solid shade
  legNear: [number, number, number];   // thigh, shin, foot
  legFar:  [number, number, number];
}

export type StickProp =
  | { kind: "floor"; y: number }
  | { kind: "rect"; x: number; y: number; w: number; h: number };   // step, bench, box, mat

export const MUSCLE_LABELS = {
  calf: "小腿", shins: "胫前肌", quads: "股四头肌", hamstrings: "腘绳肌",
  glutes: "臀大肌", outerHip: "臀中肌", adductors: "内收肌", hipFlexors: "髋屈肌",
  abs: "腹部", obliques: "侧腹", shoulders: "肩部", chest: "胸肌", triceps: "肱三头肌",
} as const;
export type MuscleRegion = keyof typeof MUSCLE_LABELS;
export interface MuscleTarget {
  region: MuscleRegion;
  side: "near" | "far" | "both";
}

export function muscleLabels(spec: StickFigureSpec): string[] {
  return [...new Set((spec.muscleTargets ?? []).map(({ region }) => MUSCLE_LABELS[region]))];
}

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
  muscleTargets?: MuscleTarget[]; // schematic targets across the exercise, not measured activation
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
      // Preserve exact authored endpoints; floating-point anchor correction at t=0
      // can otherwise round the first and last SVG paths differently.
      poses.push(s === 0 ? from : blendAnchored(spec, from, to, s / STEPS_PER_SEGMENT));
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
export function stickFigureSvg(spec: StickFigureSpec, opts: { keyframe?: number; idPrefix?: string } = {}): string {
  const still = opts.keyframe !== undefined;
  const sampled = sampleFrames(spec);
  const { poses, keyTimes } = still ? { poses: [spec.keyframes[opts.keyframe!]], keyTimes: [0] } : sampled;
  // One camera for the entire loop, including reduced-motion stills. Padding covers
  // the head, rounded strokes and held weights, as well as rounding during SMIL.
  const extent = sampled.poses.flatMap((pose) => {
    const j = poseJoints(pose);
    return [j.hip, j.neck, j.head, ...j.armNear, ...j.armFar, ...j.legNear, ...j.legFar];
  });
  for (const prop of spec.props ?? []) {
    if (prop.kind === "rect") extent.push([prop.x, prop.y], [prop.x + prop.w, prop.y + prop.h]);
  }
  const minX = Math.min(...extent.map(([x]) => x)) - 9;
  const maxX = Math.max(...extent.map(([x]) => x)) + 9;
  const minY = Math.min(...extent.map(([, y]) => y)) - 9;
  const maxY = Math.max(...extent.map(([, y]) => y), ...(spec.props ?? []).filter((p) => p.kind === "floor").map((p) => p.y)) + 9;
  const size = Math.max(maxX - minX, maxY - minY);
  const cameraX = (minX + maxX - size) / 2;
  const cameraY = (minY + maxY - size) / 2;
  const frames = poses.map(poseJoints);
  const kt = keyTimes.map((t) => t.toFixed(3)).join(";");

  const animate = (attr: string, values: string[]) =>
    still ? "" : `<animate attributeName="${attr}" dur="${spec.duration}s" repeatCount="indefinite" calcMode="linear" keyTimes="${kt}" values="${values.join(";")}"/>`;
  // React supplies a unique prefix so simultaneous animations and stills never share paint servers.
  const id = (opts.idPrefix ?? "athlete").replace(/[^a-zA-Z0-9_-]/g, "");
  const paint = (name: string) => `url(#${id}-${name})`;
  const near = paint("body");
  const definitions = `<defs>
    <linearGradient id="${id}-body" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="hsl(var(--athlete-shade))"/><stop offset="0.45" stop-color="hsl(var(--athlete-body))"/><stop offset="0.75" stop-color="hsl(var(--athlete-light))"/><stop offset="1" stop-color="hsl(var(--athlete-body))"/>
    </linearGradient>
    <radialGradient id="${id}-head" cx="68%" cy="25%" r="80%"><stop stop-color="hsl(var(--athlete-light))"/><stop offset="0.6" stop-color="hsl(var(--athlete-body))"/><stop offset="1" stop-color="hsl(var(--athlete-shade))"/></radialGradient>
    <linearGradient id="${id}-muscle"><stop stop-color="#db655e"/><stop offset="0.55" stop-color="#ff9785"/><stop offset="1" stop-color="#f2786c"/></linearGradient>
    <radialGradient id="${id}-shadow"><stop stop-color="hsl(var(--athlete-shade))" stop-opacity="0.3"/><stop offset="1" stop-color="hsl(var(--athlete-shade))" stop-opacity="0"/></radialGradient>
  </defs>`;
  const far = "hsl(var(--athlete-far, 271 22% 58%))";
  const neutral = "hsl(var(--muted-foreground, 0 0% 42%))";
  const stage = "hsl(var(--athlete-stage, 271 45% 97%))";
  const limb = (pick: (j: Joints) => Point[], color = near, width = 4.2, outline = false) => {
    const path = (stroke: string, strokeWidth: number) =>
      `<polyline fill="none" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" points="${points(pick(frames[0]))}">${animate("points", frames.map((j) => points(pick(j))))}</polyline>`;
    return (outline ? path(stage, width + 1.2) : "") + path(color, width);
  };
  // Build contours in each bone's local coordinates; every sampled pose uses the
  // same commands, allowing the existing SMIL timeline to carry shading and muscle together.
  const local = (a: Point, b: Point, t: number, offset: number): Point => {
    const dx = b[0] - a[0], dy = b[1] - a[1], length = Math.hypot(dx, dy);
    return [lerp(a[0], b[0], t) - dy / length * offset, lerp(a[1], b[1], t) + dx / length * offset];
  };
  const contour = (a: Point, b: Point, start: number, belly: number, end: number) => {
    const p = (t: number, offset: number) => points([local(a, b, t, offset)]);
    return `M ${p(0, -start)} C ${p(0.25, -belly)} ${p(0.6, -belly)} ${p(1, -end)} Q ${p(1.08, 0)} ${p(1, end)} C ${p(0.6, belly)} ${p(0.25, belly)} ${p(0, start)} Q ${p(-0.08, 0)} ${p(0, -start)} Z`;
  };
  const filled = (pick: (j: Joints) => string, fill = near) => {
    const paths = frames.map(pick);
    return `<path d="${paths[0]}" fill="${fill}">${animate("d", paths)}</path>`;
  };
  const sculptLeg = (side: "near" | "far", fill: string) => {
    const leg = (j: Joints) => side === "near" ? j.legNear : j.legFar;
    return filled((j) => contour(leg(j)[0], leg(j)[1], 2.3, 3.4, 1.9), fill) +
      filled((j) => contour(leg(j)[1], leg(j)[2], 1.8, 2.9, 1.2), fill) +
      limb((j) => leg(j).slice(2), fill === near ? "hsl(var(--athlete-body))" : fill, 2.8);
  };
  const sculptArm = (side: "near" | "far", fill: string) => {
    const arm = (j: Joints) => side === "near" ? j.armNear : j.armFar;
    return filled((j) => contour(arm(j)[0], arm(j)[1], 2.4, 2.7, 1.6), fill) +
      filled((j) => contour(arm(j)[1], arm(j)[2], 1.6, 2, 1.3), fill);
  };
  // Region geometry is expressed along the relevant bone, so it remains attached
  // through hinges, floor poses and front-view leg movements. Front-view near/far
  // legs use opposite normals to keep outer-hip and inner-thigh patches on their sides.
  const regionShape = (j: Joints, region: MuscleRegion, side: "near" | "far") => {
    const leg = side === "near" ? j.legNear : j.legFar;
    const arm = side === "near" ? j.armNear : j.armFar;
    const outer = side === "near" ? -1 : 1;
    let a = leg[0], b = leg[1], start = 0.15, end = 0.8, offset = 0, width = 1;
    switch (region) {
      case "calf": a = leg[1]; b = leg[2]; start = 0.13; end = 0.84; offset = 1.1; width = 1; break;
      case "shins": a = leg[1]; b = leg[2]; start = 0.14; end = 0.86; offset = -1.2; width = 0.7; break;
      case "quads": offset = spec.view === "side" ? -1.2 : 0; width = 1.3; break;
      case "hamstrings": offset = 1.3; width = 1.15; break;
      case "glutes": start = 0; end = 0.27; offset = spec.view === "side" ? 1.3 : outer * 1.1; width = 1.3; break;
      case "outerHip": start = 0.02; end = 0.36; offset = spec.view === "front" ? outer * 1.5 : 0.7; width = 1.1; break;
      case "adductors": start = 0.16; end = 0.7; offset = -outer * 1.3; width = 1; break;
      case "hipFlexors": start = 0; end = 0.25; offset = spec.view === "side" ? -1.2 : -outer; width = 1; break;
      case "abs": a = j.neck; b = j.hip; start = 0.43; end = 0.85; offset = spec.view === "side" ? -2 : 0; width = 1.35; break;
      case "obliques": a = j.neck; b = j.hip; start = 0.45; end = 0.87; offset = spec.view === "front" ? 2 : -2.6; width = 0.9; break;
      case "chest": a = j.neck; b = j.hip; start = 0.08; end = 0.4; offset = spec.view === "side" ? -2 : 0; width = 1.5; break;
      case "shoulders": a = arm[0]; b = arm[1]; start = 0; end = 0.3; offset = 0; width = 1.6; break;
      case "triceps": a = arm[0]; b = arm[1]; start = 0.25; end = 0.85; offset = 0.9; width = 0.9; break;
    }
    return contour(local(a, b, start, offset), local(a, b, end, offset), 0.15, width, 0.1);
  };
  const torsoRegions: MuscleRegion[] = ["abs", "obliques", "chest"];
  const armRegions: MuscleRegion[] = ["shoulders", "triceps"];
  const muscles = (layer: "leg" | "arm" | "torso", side: "near" | "far") =>
    (spec.muscleTargets ?? []).filter(({ region, side: targetSide }) => {
      const regionLayer = torsoRegions.includes(region) ? "torso" : armRegions.includes(region) ? "arm" : "leg";
      return regionLayer === layer && (layer === "torso" || targetSide === side || targetSide === "both");
    }).map(({ region }) => filled((j) => regionShape(j, region, side), paint("muscle"))).join("");

  // Keep the small calf callout from the initial design; multi-region moves use the
  // external legend so connector lines never obscure the moving silhouette.
  const calfOnly = spec.muscleTargets?.length === 1 && spec.muscleTargets[0].region === "calf" && spec.muscleTargets[0].side === "near";
  const target = (j: Joints) => local(j.legNear[1], j.legNear[2], 0.45, 1.5);
  const labelX = cameraX + size * 0.73;
  const labelY = target(frames[0])[1] - 4;
  const callout = calfOnly && !still ? limb((j) => [target(j), [labelX - 3, labelY], [labelX, labelY]], neutral, 0.35) +
    `<text x="${fmt(labelX + 1)}" y="${fmt(labelY + 1)}" fill="hsl(var(--foreground))" font-size="3.2" font-family="sans-serif">小腿</text>` : "";
  // Ground the shadow on the floor rather than on the first pose's foot: jumping
  // and raised-leg floor exercises must not leave a shadow floating in the air.
  const floor = spec.props?.find((p) => p.kind === "floor");
  const centerX = (minX + maxX) / 2;
  const shadow = floor ? `<ellipse cx="${fmt(centerX)}" cy="${fmt(floor.y + 0.5)}" rx="${fmt(Math.min(14, size * 0.18))}" ry="2" fill="${paint("shadow")}"/>` : "";
  const weight = (side: "near" | "far") => {
    if (!spec.hold?.includes(side)) return "";
    const hands = frames.map((j) => (side === "near" ? j.armNear[2] : j.armFar[2]));
    return `<rect width="6" height="3.5" rx="1.2" fill="${neutral}" x="${fmt(hands[0][0] - 3)}" y="${fmt(hands[0][1])}">` +
      `${animate("x", hands.map((h) => fmt(h[0] - 3)))}${animate("y", hands.map((h) => fmt(h[1])))}</rect>`;
  };

  const props = (spec.props ?? []).map((p) =>
    p.kind === "floor"
      ? `<line x1="${fmt(cameraX + 5)}" x2="${fmt(cameraX + size - 5)}" y1="${p.y}" y2="${p.y}" stroke="${neutral}" stroke-opacity="0.3" stroke-width="1"/>`
      : `<rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="1.2" fill="${neutral}" fill-opacity="0.1" stroke="${neutral}" stroke-opacity="0.3" stroke-width="0.8"/>`
  ).join("");

  const heads = frames.map((j) => j.head);
  const head =
    `<circle cx="${fmt(heads[0][0])}" cy="${fmt(heads[0][1])}" r="${BONE.headR}" fill="${paint("head")}" stroke="${stage}" stroke-width="0">` +
    `${animate("cx", heads.map((h) => fmt(h[0])))}${animate("cy", heads.map((h) => fmt(h[1])))}</circle>`;
  const pelvis = spec.keyframes[0].pelvis !== undefined ? limb((j) => [j.legFar[0], j.legNear[0]], "hsl(var(--athlete-body))", 6) : "";

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${fmt(cameraX)} ${fmt(cameraY)} ${fmt(size)} ${fmt(size)}" width="100%" height="100%" aria-hidden="true" focusable="false">` +
    definitions + shadow + props +
    sculptLeg("far", far) + muscles("leg", "far") +
    sculptArm("far", far) + muscles("arm", "far") + weight("far") +
    limb((j) => [j.neck, j.head], "hsl(var(--athlete-body))", 3.8) +
    filled((j) => contour(j.neck, j.hip, 3.6, 4.8, 2.7)) + pelvis + muscles("torso", "near") +
    sculptLeg("near", near) + muscles("leg", "near") +
    sculptArm("near", near) + muscles("arm", "near") + weight("near") + head + callout +
    `</svg>`
  );
}
