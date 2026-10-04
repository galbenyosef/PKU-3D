const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

// Use real modules and their own realm's containers: native iterator guards
// must actually exercise the indexed path, not silently fall back in the test.
function fixture({idle = true} = {}) {
  let tick = 0, handle = 0;
  const callbacks = new Map();
  const context = vm.createContext({YY: {}, performance: {now: () => ++tick / 4}});
  if (idle) {
    context.requestIdleCallback = fn => { callbacks.set(++handle, fn); return handle; };
    context.cancelIdleCallback = id => callbacks.delete(id);
  }
  for (const file of ['math.js', 'visibility.js', 'engine.js']) {
    vm.runInContext(fs.readFileSync(path.resolve(__dirname, '../src', file), 'utf8'), context, {filename: file});
  }
  const C = vm.runInContext('({Array, Map, Set, Float32Array})', context);
  const V = context.YY.Visibility, P = context.YY.Engine.prototype;
  const planes = values => C.Array.from(values, p => C.Array.from(p));
  function bucket(id, x, count = 1) {
    const data = new C.Float32Array(count * 28), spatial = new C.Float32Array(count * 5);
    for (let i = 0; i < count; i++) {
      const d = i * 28, q = i * 5;
      data[d] = data[d + 5] = data[d + 10] = data[d + 15] = 1;
      data[d + 12] = x + i / 10;
      data[d + 20] = 0; data[d + 21] = id; data[d + 23] = i % 3;
      spatial.set([x + i / 10, 0, 0, .1, 1], q);
    }
    const b = {data, spatial, count, vertexCount: 3, detailWidth: 0, passes: new C.Map(), tag: id};
    V.compile(b);
    return b;
  }
  function scene() {
    const map = new C.Map();
    for (let i = 0; i < 96; i++) map.set(`bucket-${i}`, bucket(i + 1, (i - 48) / 4, i % 9 === 0 ? 3 : 1));
    return map;
  }
  const state = {selected: 0, isolate: 0, explode: 0, detailLOD: false, vegetation: true};
  function stream(entries, ps, changes = {}) {
    const scratch = {data: new C.Float32Array(28), used: 0}, order = [];
    let culled = 0;
    for (const [name, b] of entries) {
      const result = V.select(b, ps, [0, 0, 20], 900, {...state, ...changes}, scratch, false, true);
      culled += result.culled;
      if (result.count) order.push([name, result.count]);
      scratch.used += result.count * 28;
    }
    return {order, culled, bytes: Buffer.from(scratch.data.buffer, 0, scratch.used * 4)};
  }
  function engine(buckets = scene()) {
    const e = Object.create(P);
    Object.assign(e, {buckets, state: {...state}, visibilityCaches: new C.Map(), stats: {instances: 0, visibilityBuilds: 0}, gl: {
      deleteSync() {}, deleteVertexArray() {}, deleteBuffer() {}, deleteTexture() {}, deleteProgram() {}
    }});
    return e;
  }
  function runIdle(deadline = 10) {
    const [id, fn] = callbacks.entries().next().value;
    callbacks.delete(id);
    fn({timeRemaining: () => deadline});
  }
  return {C, V, P, context, callbacks, planes, bucket, scene, state, stream, engine, runIdle};
}

test('generic mutable maps never acquire implicit ownership; stale epochs are rejected', () => {
  const f = fixture(), ps = f.planes([[1, 0, 0, 0]]);
  for (const mutation of ['replace', 'coarse', 'reinsert']) {
    const map = f.scene(), epoch = Object.freeze({generation: 1}), index = f.V.buildBucketIndex(map, epoch);
    assert.equal(f.V.buildBucketIndex(map), null);
    if (mutation === 'replace') map.set('bucket-0', f.bucket(1000, 10));
    if (mutation === 'coarse') map.get('bucket-0').coarse[0] = 10;
    if (mutation === 'reinsert') { const b = map.get('bucket-70'); map.delete('bucket-70'); map.set('bucket-70', b); }
    assert.equal(f.V.indexedBuckets(index, map, ps, f.state), map);
    assert.equal(f.V.indexedBuckets(index, map, ps, f.state, {generation: 2}), map);
    assert.deepEqual(f.stream(f.V.indexedBuckets(index, map, ps, f.state), ps), f.stream(map, ps));
  }
  const e = f.engine(), oldEpoch = Object.freeze({generation: 1});
  e.bucketIndexEpoch = oldEpoch; e.bucketIndex = f.V.buildBucketIndex(e.buckets, oldEpoch);
  const stale = e.bucketIndex;
  e.invalidateBucketIndex();
  assert.equal(e.bucketIndex, null);
  assert.equal(e.bucketIndexEpoch, null);
  assert.equal(e.bucketIndexGeneration, 1);
  assert.equal(f.V.indexedBuckets(stale, e.buckets, ps, e.state, e.bucketIndexEpoch), e.buckets);
});

test('owned candidates preserve current Map insertion order and exact accepted record bytes', () => {
  const f = fixture(), map = f.scene(), epoch = Object.freeze({generation: 1});
  // Reorder before ownership begins; tree partition order must not become draw order.
  const moved = map.get('bucket-80'); map.delete('bucket-80'); map.set('bucket-80', moved);
  const index = f.V.buildBucketIndex(map, epoch);
  for (const [ps, changes] of [
    [f.planes([[1, 0, 0, 0], [-1, 0, 0, 7]]), {}],
    [f.planes([[3, 0, 0, 0], [-.2, 0, 0, 1.4]]), {explode: -2, selected: 70}],
    [f.planes([[1, 0, 0, 0]]), {isolate: 81}],
    [f.planes([[1, 0, 0, 0]]), {detailLOD: true}]
  ]) {
    const candidates = f.V.indexedBuckets(index, map, ps, {...f.state, ...changes}, epoch);
    assert.notEqual(candidates, map, 'small view must exercise BVH');
    assert.ok(candidates.length < map.size);
    assert.deepEqual(f.stream(candidates, ps, changes), f.stream(map, ps, changes));
  }
});

test('nonstandard planes, Maps and invalid numerical input conservatively use original traversal', () => {
  const f = fixture(), map = f.scene(), epoch = {}, ps = f.planes([[1, 0, 0, 0]]), index = f.V.buildBucketIndex(map, epoch);
  const customPlanes = f.planes([[1, 0, 0, 0]]);
  customPlanes[Symbol.iterator] = function* () { yield [-1, 0, 0, 0]; };
  const arrayLike = {0: [1, 0, 0, 0], length: 1};
  for (const value of [customPlanes, arrayLike, f.planes([[NaN, 0, 0, 0]]), f.planes([[Infinity, 0, 0, 0]])]) {
    assert.equal(f.V.indexedBuckets(index, map, value, f.state, epoch), map);
  }
  for (const explode of [undefined, null, '2', NaN, Infinity]) {
    assert.equal(f.V.indexedBuckets(index, map, ps, {...f.state, explode}, epoch), map);
  }
  const customMap = new f.C.Map(map);
  customMap[Symbol.iterator] = function* () { yield* map; };
  assert.equal(f.V.buildBucketIndex(customMap, epoch), null);
  assert.equal(f.V.indexedBuckets(index, customMap, ps, f.state, epoch), customMap);
  map.set('invalid-bounds', {...f.bucket(2000, 1), coarse: [NaN, 0, 0, 1]});
  const malformedIndex = f.V.buildBucketIndex(map, epoch);
  const candidates = f.V.indexedBuckets(malformedIndex, map, f.planes([[1, 0, 0, -10000]]), f.state, epoch);
  assert.ok(Array.from(candidates).some(([name]) => name === 'invalid-bounds'));
});

test('idle build yields, cancels on invalidation/disposal and cannot publish a stale callback', () => {
  const f = fixture(), e = f.engine();
  e.scheduleBucketIndex();
  assert.equal(e.bucketIndex, undefined, 'schedule must not synchronously build');
  assert.equal(f.callbacks.size, 1);
  f.runIdle(0);
  assert.equal(e.bucketIndex, undefined, 'no work when idle time is exhausted');
  assert.equal(f.callbacks.size, 1);
  const cancelled = f.callbacks.values().next().value;
  e.invalidateBucketIndex();
  assert.equal(f.callbacks.size, 0);
  cancelled({timeRemaining: () => 10});
  assert.equal(e.bucketIndex, null);
  assert.equal(f.callbacks.size, 0);
  e.scheduleBucketIndex();
  let turns = 0;
  while (f.callbacks.size) { f.runIdle(); assert.ok(++turns < 1000); }
  assert.ok(e.bucketIndex);
  e.invalidateBucketIndex(); e.scheduleBucketIndex();
  const disposedCallback = f.callbacks.values().next().value;
  e.dispose();
  assert.equal(e.disposed, true);
  assert.equal(f.callbacks.size, 0);
  assert.equal(e.bucketIndex, null);
  disposedCallback({timeRemaining: () => 10});
  assert.equal(e.bucketIndex, null);
  assert.equal(f.callbacks.size, 0);
});

test('supported scene mutation methods invalidate ownership and cancel pending construction', () => {
  const f = fixture();
  for (const mutate of [
    e => e.compileBucket(e.buckets.values().next().value),
    e => e.add('new-bucket', {v: []}, f.context.YY.M.identity(), [1, 1, 1]),
    e => e.beginPrepared({version: 2, meshes: [], buckets: [], stats: {}})
  ]) {
    const e = f.engine(); e.scheduleBucketIndex();
    const epoch = e.bucketIndexEpoch;
    mutate(e);
    assert.equal(e.bucketIndexEpoch, null);
    assert.equal(e.bucketIndexGeneration, 1);
    assert.equal(f.callbacks.size, 0);
    assert.notEqual(e.bucketIndexEpoch, epoch);
  }
});

test('without requestIdleCallback the engine keeps original traversal', () => {
  const f = fixture({idle: false}), e = f.engine();
  e.scheduleBucketIndex();
  assert.equal(e.bucketIndex, undefined);
  assert.equal(e.bucketIndexJob, undefined);
});

test('reflection extra planes and index flag invalidate cache while preserving exact draw records', () => {
  const f = fixture({idle: false}), e = f.engine(), base = f.planes([[0, 1, 0, 100], [0, -1, 0, 100]]), epoch = {};
  Object.assign(e, {bucketIndexEpoch: epoch, bucketIndex: f.V.buildBucketIndex(e.buckets, epoch), camera: {eye: [0, 0, 20], fov: .8}, canvas: {clientHeight: 1000}, waterLevel: .5,
    reflectionFootprintPlanes: f.planes([[1, 0, 0, 0]]), reflectionPlanes: () => base,
    instanceStream() { return {data: new f.C.Float32Array(28), used: 0}; },
    visibleRanges() { return null; },
    instanceCache(b, slot, count, stream) { const record = {offset: stream.used, count}; stream.used += count * 28; return record; },
    instanceVAO() { return {vao: {}}; },
    groupDraws(items) { return {drawItems: items}; },
    uploadInstances(stream) { this.bytes = Buffer.from(stream.data.buffer, 0, stream.used * 4); }
  });
  const select = f.V.select, indexed = f.V.indexedBuckets;
  let indexedCalls = 0;
  function checkPlanes(ps) {
    assert.deepEqual(Array.from(ps, p => Array.from(p)), [...Array.from(base, p => Array.from(p)), ...Array.from(e.reflectionFootprintPlanes, p => Array.from(p))]);
  }
  f.V.select = (b, ps, ...args) => { checkPlanes(ps); return select(b, ps, ...args); };
  f.V.indexedBuckets = (index, map, ps, ...args) => { checkPlanes(ps); indexedCalls++; return indexed(index, map, ps, ...args); };
  function run(enabled) {
    e.state.bucketSpatialIndex = enabled;
    const cache = e.visibleScene(f.context.YY.M.identity(), 3);
    return {cache, result: {items: Array.from(cache.items, ({b, record}) => [b.tag, record.count]), bytes: e.bytes, culled: cache.culled}};
  }
  const linear = run(false), accelerated = run(true);
  assert.notEqual(linear.cache.key, accelerated.cache.key);
  assert.deepEqual(linear.result, accelerated.result);
  assert.equal(run(true).cache, accelerated.cache);
  e.reflectionFootprintPlanes = f.planes([[-1, 0, 0, 0]]);
  const changed = run(true), reference = run(false);
  assert.notEqual(changed.cache.key, accelerated.cache.key);
  assert.notDeepEqual(changed.result.items, accelerated.result.items);
  assert.deepEqual(changed.result, reference.result);
  assert.equal(indexedCalls, 2);
});

test('index publication preserves only current-generation completed caches', () => {
  const f=fixture(),e=f.engine();
  e.bucketIndexGeneration=7;
  const current={key:'current',generation:7},old={key:'old',generation:6},unknown={key:'unknown'};
  e.visibilityCaches.set(0,current);e.visibilityCaches.set(2,old);e.visibilityCaches.set(3,unknown);
  e.scheduleBucketIndex();let turns=0;while(f.callbacks.size){f.runIdle();assert.ok(++turns<1000);}
  assert.equal(e.visibilityCaches.size,1);assert.equal(e.visibilityCaches.get(0),current);
  e.invalidateBucketIndex();assert.equal(e.bucketIndexGeneration,8);e.scheduleBucketIndex();
  while(f.callbacks.size){f.runIdle();assert.ok(++turns<2000);}
  assert.equal(e.visibilityCaches.size,0);
});
