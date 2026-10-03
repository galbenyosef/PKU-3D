const test=require('node:test'),assert=require('node:assert/strict'),crypto=require('node:crypto');
const {load,capture}=require('./campus338-model-helper.cjs');
const target='src/research1-details.js';
function disableEntrance(file,code){
 if(file!==target)return code;
 // A counterfactual of the maintained source, at its real index position.
 // Disable only the new entry and restore the one window/two pier bases it occupies.
 const replacements=[
  ['courtyardEntry(b);const old=b.e.add;','const old=b.e.add;'],
  ["key.startsWith('v30-walls-4-')?cutEntry(g):g",'g'],
  ['north&&Math.abs(t-ENTRY.u)<ENTRY.w/2+.18?ENTRY.top:.30','.30'],
  ['if(north&&floor===0&&Math.abs(t-ENTRY.u)<ENTRY.w/2+ww/2)continue;','']
 ];
 for(const [from,to]of replacements){assert.ok(code.includes(from),`counterfactual anchor exists: ${from}`);code=code.replace(from,to);}
 return code;
}
const state=load(),baseState=load({transform:disableEntrance}),current=capture(state,4),base=capture(baseState,4);
const hash=x=>crypto.createHash('sha256').update(JSON.stringify(x)).digest('hex');
function triContains(p,a,b,c){
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 if(Math.abs(cross(a,b,c))<1e-10)return false;
 const q=[cross(a,b,p),cross(b,c,p),cross(c,a,p)];return q.every(x=>x>=-1e-7)||q.every(x=>x<=1e-7);
}
function wallHits(record,E,u,y){
 for(let i=0;i<record.v.length;i+=24){const tri=[0,8,16].map(k=>Array.from(E.entryCoord(record.v.slice(i+k,i+k+3))));
  if(tri.some(p=>Math.abs(p[2])>.01))continue;
  if(triContains([u,y],...tri.map(p=>p.slice(0,2))))return true;
 }return false;
}
test('research entrance runs through maintained index order and retains fit limits',()=>{
 assert.deepEqual(state.loaded,baseState.loaded);
 assert.equal(state.loaded.filter(x=>x===target).length,1);
 assert.ok(current.out.some(r=>r.k.startsWith('research1-main-entry338-')));
 assert.equal(current.result.mainEntrancesVerified,false);
 assert.equal(current.result.mainEntrance338.wallBasis,'user-located-courtyard-face');
 assert.equal(current.result.mainEntrance338.axis,'display-fit');
 assert.equal(current.result.mainEntrance338.dimensionsMeasured,false);
});
test('counterfactual preserves all low-wing and rooftop records, and the independent No. 2 building',()=>{
 for(const prefix of ['research1-north-','v30-roof-','v30-roof-ends-']){
  const a=current.out.filter(r=>r.k.startsWith(prefix)),b=base.out.filter(r=>r.k.startsWith(prefix));assert.ok(b.length,prefix);assert.equal(hash(a),hash(b),prefix);
 }
 assert.equal(hash(capture(state,253).out),hash(capture(baseState,253).out));
 const windows=x=>x.out.filter(r=>r.k.startsWith('research1-main-courtyard-')&&r.p[0]===5);
 assert.equal(windows(current).length,windows(base).length-1,'only the entrance bay window is removed');
});
test('real main-wall triangles are cut across the door, not covered by decorative glass',()=>{
 const E=state.Y.Research1Details,a=current.out.find(r=>r.k.startsWith('v30-walls-4-')),b=base.out.find(r=>r.k.startsWith('v30-walls-4-'));assert.ok(a&&b);
 for(const offset of [-2.9,-2,-1,0,1,2,2.9])for(const y of [.6,1.5,2.7,3.6]){
  const u=E.ENTRY.u+offset;assert.ok(wallHits(b,E,u,y),'counterfactual proves previous solid wall');assert.ok(!wallHits(a,E,u,y),'new aperture must be genuinely clear');
 }
 assert.equal(current.out.filter(r=>r.k.startsWith('research1-main-entry338-')&&r.p[0]===5).length,12,'six lower panels and six transoms');
});
test('complete model is finite, changed geometry has unit normals, and first-key reuse is consistent',()=>{
 const keys=new Map();
 for(const r of current.out){
  assert.equal(r.p[1],4);assert.ok(r.m.every(Number.isFinite));assert.equal(r.v.length%24,0);
  assert.ok(r.v.every(Number.isFinite));
  // The unchanged generic roof-end mesh includes pre-existing zero-area caps.
  // Keep its exact-record preservation check above; enforce unit normals on this change.
  if(r.k.startsWith('research1-main-entry338-')||r.k.startsWith('v30-walls-4-'))for(let i=0;i<r.v.length;i+=8)assert.ok(Math.abs(Math.hypot(...r.v.slice(i+3,i+6))-1)<2e-5,`unit normal in ${r.k}`);
  const h=hash(r.v.map(Math.fround));if(keys.has(r.k))assert.equal(h,keys.get(r.k),`same geometry key cannot carry a different mesh: ${r.k}`);else keys.set(r.k,h);
 }
});
