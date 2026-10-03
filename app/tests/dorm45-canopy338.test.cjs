const assert=require('node:assert/strict'),test=require('node:test');
const {load,capture}=require('./campus338-model-helper.cjs');
const MODULE='src/dorm45-canopy338.js';
test('45 south shelter loads in the real chain, is grounded, open and covered by picking bounds',()=>{
 const base=load({skip:[MODULE]}),current=load();assert.ok(current.loaded.includes(MODULE));
 const a=capture(base,141),b=capture(current,141),added=b.out.filter(q=>q.k.startsWith('d45-338'));
 // Compare render records, not feature metadata: 141 legitimately gains renderBounds46.
 assert.deepEqual(b.out.filter(q=>!q.k.startsWith('d45-338')),a.out);
 assert.equal(added.length,29);
 for(const q of added){assert.equal(q.p[1],141);assert.ok(q.v.every(Number.isFinite));assert.ok(q.m.every(Number.isFinite));}
 const bounds=b.f.properties.renderBounds46;assert.ok(bounds&&bounds.length===4);
 for(const p of added.filter(q=>q.k.includes('support'))){
  assert.ok(Math.abs(p.m[13]-p.m[5]/2)<1e-6);assert.ok(p.m[5]>2.6);assert.ok(p.m[14]>482);
  assert.ok(!current.Y.CAMPUS.features.some(f=>f.properties.kind==='building'&&current.Y.Footprints.inside([p.m[12],p.m[14]],f.geometry)));
 }
 for(const u of[0,.5,1])for(const v of[0,.5,1]){const p=current.Y.Dorm45Canopy338.point(u,v);assert.ok(p[1]>482);assert.ok(p[0]>=bounds[0]&&p[0]<=bounds[2]&&p[1]>=bounds[1]&&p[1]<=bounds[3],'shelter inside picking bounds');}
});
test('45A, 45B and existing double shelter geometry remain unchanged',()=>{
 const base=load({skip:[MODULE]}),current=load();
 for(const pick of[139,140,489])assert.deepEqual(capture(current,pick).out,capture(base,pick).out);
});
