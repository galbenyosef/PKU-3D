const assert=require('node:assert/strict'),test=require('node:test');
const {load,capture}=require('./campus338-model-helper.cjs');
const MODULE='src/resource-hotel338.js',ID='way/240825484';
test('resource hotel is registered before scene construction with its real label and unique pick',()=>{
 const base=load({skip:[MODULE]}),current=load(),{Y}=current;
 assert.equal(current.scripts.filter(s=>s===MODULE).length,1);assert.ok(current.loaded.includes(MODULE));
 assert.ok(current.loaded.indexOf(MODULE)>current.loaded.indexOf('src/architecture-v30.js'));
 const added=Y.CAMPUS.features.filter(f=>f.properties.id===ID);assert.equal(added.length,1);
 const f=added[0];assert.equal(f.properties.pickId,1338);assert.equal(f.properties.label,'资源宾馆');
 assert.equal(Y.CAMPUS.features.filter(f=>f.properties.pickId===1338).length,1);
 assert.equal(JSON.stringify(Y.CAMPUS.features),JSON.stringify(base.Y.CAMPUS.features),'renderer loading preserves all public source records');
 assert.equal(Y.CAMPUS.features.length,base.Y.CAMPUS.features.length);
 assert.ok(base.Y.CAMPUS.features.some(q=>q.properties.id===ID&&q.properties.pickId===1338),'hotel source exists without its renderer wrapper');
 assert.equal(Y.ResourceHotel338.feature,f);assert.equal(f.properties.kind,'building');
 assert.ok(f.properties.aliases.includes('Resource Hotel'));assert.equal(f.geometry.type,'Polygon');
});
test('hotel renderer emits finite selectable geometry and preserves other renderer delegation',()=>{
 const base=load({skip:[MODULE]}),current=load(),hotel=capture(current,1338);
 assert.equal(hotel.result.sourceOutlinePreserved,true);assert.ok(hotel.out.length>500);
 assert.ok(hotel.out.some(r=>r.k.endsWith('flat-roof')));
 for(const r of hotel.out){assert.equal(r.p[1],1338);assert.ok(r.v.every(Number.isFinite));assert.ok(r.m.every(Number.isFinite));}
 // The similarly named campus resources group and an unrelated building must
 // still reach their own existing dispatchers; no mocked replacement dispatcher.
 for(const pick of[137,139]){
  const a=capture(base,pick),b=capture(current,pick);assert.deepEqual(b.out,a.out);
  assert.equal(JSON.stringify(b.result),JSON.stringify(a.result));
 }
});
// Append to resource-hotel338.test.cjs; uses its existing load/capture/MODULE.
function hotelOpaqueBoxContains(point,r){
 if(!r.k.endsWith('-box')||r.p[0]===5)return false;
 const d=point.map((v,i)=>v-r.m[12+i]);
 for(let j=0;j<3;j++){
  const v=r.m.slice(j*4,j*4+3),sq=v.reduce((s,x)=>s+x*x,0);
  const u=v.reduce((s,x,i)=>s+x*d[i],0)/sq;
  if(Math.abs(u)>.5-1e-5)return false;
 }
 return true;
}
function assertHotelOpenings(state){
 const {out}=capture(state,1338);
 for(const [x,y,z,label]of[
  [-.17,1.2,67.7,'door below former window sill'],
  [-.17,.30,67.7,'waist band at door'],
  [1.13,22.15,10.8,'small west tower window'],
  [1.83,22.1,85.1,'lower lantern window'],
  [1.83,25.0,85.1,'upper lantern window']
 ]){
  const q=state.Y.ResourceHotel338.world(x,z),point=[q[0],y,q[1]];
  assert.equal(out.filter(r=>hotelOpaqueBoxContains(point,r)).length,0,label+' remains an actual opening');
 }
}
function assertHotelFrameDepth(state){
 const {out}=capture(state,1338),panes=out.filter(r=>r.k.endsWith('-box')&&r.p[0]===5),frames=out.filter(r=>r.k.endsWith('-box')&&r.p[0]===29);
 assert.ok(panes.length>200,'checks the full emitted hotel, including door and towers');
 for(const pane of panes){
  const axes=[0,1,2].map(j=>pane.m.slice(j*4,j*4+3));
  const size=axes.map(v=>Math.hypot(...v)),basis=axes.map((v,j)=>v.map(x=>x/size[j]));
  // The pane's local +Z axis is the outward wall normal. Require the central
  // mullion to overlap the pane centre and have a visible face ahead of glass.
  const bars=frames.filter(frame=>{
   const delta=[0,1,2].map(i=>frame.m[12+i]-pane.m[12+i]);
   const along=basis.map(v=>v.reduce((s,x,i)=>s+x*delta[i],0));
   if(Math.abs(along[0])>.035||Math.abs(along[1])>.035)return false;
   const normalRadius=[0,1,2].reduce((s,j)=>s+Math.abs(basis[2].reduce((a,x,i)=>a+x*frame.m[j*4+i],0))*.5,0);
   return along[2]+normalRadius>size[2]/2+.015&&along[2]+normalRadius<.18;
  });
  assert.ok(bars.length>0,`pane at ${pane.m.slice(12,15).join(',')} retains a visible front mullion`);
 }
 // The north/south lantern elevations retain their seven inner subdivisions.
 // The photographed west face must carry the same dense visible subdivision.
 const world=state.Y.ResourceHotel338.world;
 for(const side of[-1,1])for(const y of[22.1,25])for(let j=-3;j<=3;j++){
  const q=world(7+j*1.2,84.8+side*(5.5+.28));
  assert.ok(frames.some(r=>Math.hypot(r.m[12]-q[0],r.m[13]-y,r.m[14]-q[1])<.025),`lantern mullion ${side}/${y}/${j} retained`);
 }
 for(const y of[22.1,25])for(let j=-3;j<=3;j++){
  const q=world(7-5-.28,84.8+j*1.2);
  assert.ok(frames.some(r=>Math.hypot(r.m[12]-q[0],r.m[13]-y,r.m[14]-q[1])<.025),`west lantern mullion ${y}/${j} retained in front of glazing`);
 }
}
test('hotel doors and roof tower windows remain true openings',()=>assertHotelOpenings(load()));
test('hotel window frames remain in front of glazing and retain lantern subdivisions',()=>assertHotelFrameDepth(load()));
test('hotel geometry checks reject a filled entry and frames moved behind glass',()=>{
 const blocked=load({transform(file,code){return file===MODULE?code.replace('if(i===0)holes.push({x:68.5','if(false)holes.push({x:68.5'):code;}});
 assert.throws(()=>assertHotelOpenings(blocked),/door below former window sill/);
 const hidden=load({transform(file,code){return file===MODULE?code.replaceAll('(h.lo+h.hi)/2,.28,.06','(h.lo+h.hi)/2,.02,.06').replaceAll('h.x,yy,.28,h.w','h.x,yy,.02,h.w').replaceAll('width/2+j*1.2,y,.28,.065','width/2+j*1.2,y,.02,.065'):code;}});
 assert.throws(()=>assertHotelFrameDepth(hidden),/visible front mullion/);
});
