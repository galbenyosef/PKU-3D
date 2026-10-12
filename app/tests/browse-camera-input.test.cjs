const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const test = require('node:test');
const assert = require('node:assert/strict');
const source = fs.readFileSync(path.join(__dirname, '../src/app-v29.js'), 'utf8');
const start = source.indexOf('/* Time-based orbit transitions.');
const end = source.indexOf('/* Campus viewer */', start);
assert(start >= 0 && end > start, 'production camera helper boundaries');

function fixture() {
  let now = 0, reduced = false;
  const ctx = { YY: {}, performance: { now: () => now } };
  vm.createContext(ctx);
  vm.runInContext(source.slice(start, end), ctx);
  const orbit = { target: [1, 2, 3], distance: 1000, yaw: .2, elevation: .6 };
  const camera = new ctx.YY.BrowseCamera(orbit, { clock: () => now, immediate: () => reduced });
  return {
    orbit, camera,
    zoom(t, factor) { now = t; camera.zoom(factor); },
    step(t) { now = t; camera.step(t); },
    focus(t, pose) { now = t; camera.focus(() => Object.assign(orbit, structuredClone(pose))); },
    reduced(value) { reduced = value; }
  };
}
const snapshot = value => JSON.stringify(value);
const near = (actual, expected) => assert(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
function sequence(events, renders) {
  const h = fixture();
  const schedule = [...events.map(([t, factor]) => ({ t, factor })), ...renders.map(t => ({ t }))];
  // Input precedes a render with the same timestamp.
  schedule.sort((a, b) => a.t - b.t || Number(a.factor === undefined) - Number(b.factor === undefined));
  for (const event of schedule) {
    if (event.factor === undefined) h.step(event.t);
    else h.zoom(event.t, event.factor);
  }
  return h;
}

test('same-direction input is independent of accepted-render cadence', () => {
  for (const sign of [-1, 1]) for (let seed = 1; seed <= 50; seed++) {
    const events = Array.from({ length: 20 }, (_, i) => [i * (10 + seed), Math.exp(sign * (.001 + (i % 7) * .004))]);
    const end = events.at(-1)[0] + 30;
    const dense = Array.from({ length: Math.floor(end / 7) }, (_, i) => (i + 1) * 7).concat(end);
    const a = sequence(events, dense), b = sequence(events, [end]);
    near(a.orbit.distance, b.orbit.distance);
    near(a.camera.goal.distance, b.camera.goal.distance);
  }
});

test('new wheel goal affects only time after its input event', () => {
  const h = sequence([[0, Math.exp(.1)], [50, Math.exp(.1)]], [100]);
  // Independent closed-form step response: each log-distance increment begins at its own event.
  const expected = 1000 * Math.exp(.1 * (1 - Math.exp(-100 / 65)) + .1 * (1 - Math.exp(-50 / 65)));
  near(h.orbit.distance, expected);
});

test('reversal immediately moves from the last displayed pose in the new direction', () => {
  const h = sequence([[0, Math.exp(.2)], [50, Math.exp(-.03)]], [100]);
  near(h.orbit.distance, 1000 * Math.exp(-.03 * (1 - Math.exp(-50 / 65))));
  assert(h.orbit.distance < 1000);
});

test('unrendered input leaves orbit untouched and cancel preserves the visible pose', () => {
  const h = fixture();
  h.zoom(0, 1.1); h.step(10);
  const displayed = snapshot(h.orbit);
  h.zoom(30, 1.1); h.zoom(50, 1.1);
  assert.equal(snapshot(h.orbit), displayed);
  h.camera.cancel(); h.step(1000);
  assert.equal(snapshot(h.orbit), displayed);
  assert.equal(h.camera.goal, null);
});

test('reversal discards accumulated invisible interpolation', () => {
  const h = fixture();
  h.zoom(0, 1.2); h.zoom(30, 1.2); h.zoom(50, .97);
  near(h.camera.goal.distance, 970);
  near(h.orbit.distance, 1000);
  h.step(100);
  assert(h.orbit.distance < 1000);
  h.step(3000);
  near(h.orbit.distance, 970);
});

test('isolated zoom retains its 65ms time constant, clamps and exact endpoint', () => {
  for (const [factor, goal] of [[.0001, 3], [.97, 970], [1, 1000], [1.03, 1030], [100, 10000]]) {
    const h = fixture(), original = structuredClone(h.orbit);
    h.zoom(0, factor);
    for (const t of [0, 1, 16, 50, 100, 300]) {
      h.step(t);
      near(h.orbit.distance, 1000 * (goal / 1000) ** (1 - Math.exp(-t / 65)));
      assert.deepEqual(h.orbit.target, original.target);
      assert.equal(h.orbit.yaw, original.yaw);
      assert.equal(h.orbit.elevation, original.elevation);
    }
    h.step(3000);
    assert.equal(h.orbit.distance, goal);
    assert.equal(h.camera.goal, null);
  }
});

test('focus retains its time constant and retargets from the visible pose', () => {
  const h = fixture(), pose = { target: [30, 20, 10], distance: 30, yaw: .8, elevation: .2 };
  h.focus(0, pose); h.step(95);
  near(h.orbit.target[0], 30 - 29 / Math.E);
  near(h.orbit.distance, 1000 * (.03 ** (1 - 1 / Math.E)));
  h.zoom(110, .97); h.zoom(150, .97);
  const visible = snapshot(h.orbit);
  h.focus(180, pose);
  assert.equal(snapshot(h.orbit), visible);
  h.step(3000);
  assert.equal(snapshot(h.orbit), snapshot(pose));
});

test('wheel during focus integrates the old focus time constant before switching', () => {
  const h = fixture();
  h.focus(0, { target: [30, 20, 10], distance: 2000, yaw: 1, elevation: .2 });
  const visible = snapshot(h.orbit);
  h.zoom(50, 1.1);
  assert.equal(snapshot(h.orbit), visible);
  h.step(100);
  near(h.orbit.target[0], 30 - 29 * Math.exp(-50 / 95 - 50 / 65));
  h.step(3000);
  near(h.orbit.distance, 2200);
});

test('reduced motion applies wheel and focus immediately; finish cancellation reaches goal', () => {
  const h = fixture();
  h.zoom(0, 1.1); h.zoom(30, 1.1); h.reduced(true); h.zoom(40, 1.1);
  near(h.orbit.distance, 1331);
  assert.equal(h.camera.goal, null);
  const pose = { target: [3, 4, 5], distance: 500, yaw: 1, elevation: .3 };
  h.focus(45, pose);
  assert.equal(snapshot(h.orbit), snapshot(pose));
  h.reduced(false); h.zoom(50, 1.1); h.zoom(70, 1.1);
  h.camera.cancel(true);
  near(h.orbit.distance, 605);
  assert.equal(h.camera.goal, null);
});

test('RAF timestamps preceding the latest input do not replay elapsed time', () => {
  const h = fixture();
  h.zoom(0, 1.1); h.zoom(50, 1.1); h.step(48);
  near(h.orbit.distance, 1000 * 1.1 ** (1 - Math.exp(-50 / 65)));
  h.step(60);
  near(h.orbit.distance, 1000 * 1.1 ** (2 - Math.exp(-60 / 65) - Math.exp(-10 / 65)));
});

test('invalid factors leave input state unchanged and queued interpolation storage stays bounded', () => {
  const h = fixture();
  h.zoom(0, 1.1);
  const before = snapshot(h.camera);
  for (const factor of [0, -1, NaN, Infinity]) h.zoom(50, factor);
  assert.equal(snapshot(h.camera), before);
  for (let i = 1; i <= 10000; i++) h.zoom(i, 1.00001);
  // A single pose is retained, never a history of wheel events.
  assert.equal(h.camera.pending.target.length, 3);
  assert.equal(Object.keys(h.camera.pending).length, 4);
  assert(!Object.values(h.camera).some(value => Array.isArray(value)));
  near(h.orbit.distance, 1000);
});
