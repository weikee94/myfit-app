import assert from 'node:assert/strict';
import path from 'node:path';
import { createServer as createHttpServer } from 'node:http';
import { createServer } from 'vite';

// An unbound HTTP server keeps Vite's SSR loader from opening a test socket.
const middlewareServer = createHttpServer();
const server = await createServer({
  configFile: false,
  resolve: { alias: { '@': path.resolve('src') } },
  server: { middlewareMode: true, hmr: { server: middlewareServer }, preTransformRequests: false },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: 'custom',
});
try {
  const { STICK_FIGURES, findStickFigure } = await server.ssrLoadModule('/src/data/stickFigures.ts');
  const { stickFigureSvg, sampleFrames, muscleLabels } = await server.ssrLoadModule('/src/lib/stickFigure.ts');
  const specs = [...new Set(Object.values(STICK_FIGURES))];
  assert.equal(specs.length, 38);
  assert.equal(findStickFigure('单腿提踵'), findStickFigure('single leg calf raise'));
  assert.equal(findStickFigure('单腿蹲'), findStickFigure('single leg squat'));
  const ids = new Set();
  let animatedPaths = 0;
  for (const [index, spec] of specs.entries()) {
    assert.ok(spec.muscleTargets.length, `Missing targets: ${index}`);
    assert.ok(muscleLabels(spec).every(Boolean));
    const sampled = sampleFrames(spec);
    assert.equal(sampled.keyTimes[0], 0);
    assert.equal(sampled.keyTimes.at(-1), 1);
    assert.ok(sampled.keyTimes.every((time, i) => i === 0 || time > sampled.keyTimes[i - 1]));
    const roundedPose = pose => JSON.stringify(pose, (_, value) => typeof value === "number" ? Number(value.toFixed(6)) : value);
    assert.equal(roundedPose(sampled.poses[0]), roundedPose(sampled.poses.at(-1)));
    const svg = stickFigureSvg(spec, { idPrefix: `check-${index}` });
    assert.ok(!/NaN|Infinity|undefined/.test(svg));
    const camera = svg.match(/viewBox="([^"]+)"/)[1];
    const [x, y, size] = camera.split(' ').map(Number);
    const withinCamera = (value) => {
      const coords = value.match(/-?\d+(?:\.\d+)?/g).map(Number);
      for (let i = 0; i < coords.length; i += 2) {
        assert.ok(coords[i] >= x && coords[i] <= x + size, `X clipping: ${index}`);
        assert.ok(coords[i + 1] >= y && coords[i + 1] <= y + size, `Y clipping: ${index}`);
      }
    };
    for (const match of svg.matchAll(/<animate attributeName="([^"]+)"[^>]*values="([^"]+)"/g)) {
      const values = match[2].split(';');
      assert.equal(values.length, sampled.poses.length);
      assert.equal(values[0], values.at(-1), `Loop seam: ${index}`);
      if (match[1] === 'd' || match[1] === 'points') {
        for (const value of values) withinCamera(value);
        animatedPaths++;
      }
    }
    // Simultaneous animated figures and reduced-motion stills must own their paint servers.
    for (const output of [svg, ...spec.keyframes.map((_, keyframe) => {
      const still = stickFigureSvg(spec, { keyframe, idPrefix: `check-${index}-still-${keyframe}` });
      assert.ok(!still.includes('<animate'));
      assert.equal(still.match(/viewBox="([^"]+)"/)[1], camera);
      assert.ok(still.includes('stop-color="#f2786c"'));
      return still;
    })]) {
      const localIds = [...output.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
      for (const id of localIds) { assert.ok(!ids.has(id)); ids.add(id); }
      for (const [, ref] of output.matchAll(/url\(#([^)]+)\)/g)) assert.ok(localIds.includes(ref));
    }
    assert.equal((svg.match(/<rect width="6"/g) ?? []).length, spec.hold?.length ?? 0, 'Missing held weights');
  }
  console.log(`PASS: ${specs.length} athletes; ${animatedPaths} animated paths checked across full loops; targets, bounds, stills, aliases, paint IDs and weights verified.`);
} finally {
  await server.close();
}
