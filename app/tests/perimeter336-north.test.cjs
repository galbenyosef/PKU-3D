const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const APP=path.resolve(__dirname,'..'),file=APP+'/src/perimeter336-north.js',plain=x=>JSON.parse(JSON.stringify(x));
function load(){
 const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});
 for(const name of ['math','data','geometry','footprints','models','gates-v33','perimeter335','fences-v35'])vm.runInContext(fs.readFileSync(APP+'/src/'+name+'.js','utf8'),ctx,{filename:name});
 const Y=ctx.YY,baseline=Y.Fences35.plan(Y.CAMPUS),raw=JSON.stringify(Y.CAMPUS.rawFeatures);
 if(fs.existsSync(file))vm.runInContext(fs.readFileSync(file,'utf8'),ctx,{filename:'perimeter336-north'});
 return {Y,ctx,baseline,raw};
}
const {Y,ctx,baseline,raw}=load(),mid=s=>s.a.map((x,i)=>(x+s.c[i])/2);
function plan(){assert.ok(Y.Perimeter336North,'registered physical north boundary module is missing');return Y.Perimeter336North.replaceRuns(baseline,Y.CAMPUS);}
function near(p,s){return Y.Footprints.distSegment(p,s.a,s.c);}

// Reverting to campus-ring generation would put the east wall across the lane.
test('physical north wall follows the west side of the Langrun lane, preserving west and sports runs',()=>{
 const runs=plan(),wall=runs.filter(s=>s.source==='way/1101490170');assert.ok(wall.length>250);
 const lane=wall.filter(s=>mid(s)[0]>100&&Math.min(s.a[1],s.c[1])<=-640&&Math.max(s.a[1],s.c[1])>=-640);
 assert.equal(lane.length,1);assert.ok(mid(lane[0])[0]>163&&mid(lane[0])[0]<166,'wall is west of the road, not on the university area edge near x=178');
 assert.ok(wall.every(s=>s.style==='rubble'));
 const west=baseline.filter(s=>s.campus&&mid(s)[0]<-300&&mid(s)[1]>-427.9);
 assert.ok(west.length>300);assert.ok(west.every(s=>runs.includes(s)),'retained west and south runs keep their geometry and identity');
 assert.deepEqual(plain(runs.filter(s=>!s.campus)),plain(baseline.filter(s=>!s.campus)));
 assert.ok(!runs.some(s=>s.campus&&s.source==='way/1330709889'&&mid(s)[0]>170&&mid(s)[0]<190&&mid(s)[1]<-570));
 assert.ok(runs.filter(s=>s.north336).every(s=>Math.hypot(s.c[0]-s.a[0],s.c[1]-s.a[1])<=2.40000001&&s.pickId===0&&s.mesh===false));
 assert.deepEqual(plain(Y.Perimeter336North.replaceRuns(runs,Y.CAMPUS)),plain(runs),'replacement does not duplicate physical walls when repeated');
});

// A road-based mask or quantised gate deletion would make these gaps too wide.
test('mapped pedestrian gates get exact gaps without punching holes for unrelated roads',()=>{
 const runs=plan(),own=runs.filter(s=>s.north336);
 for(const [point,radius] of [[[182.48234537693372,-553.6401184050657],1.1],[[256.98863924520197,-422.8303988802362],3]]){
  assert.ok(own.every(s=>near(point,s)>=radius-1e-6),'source gate centre is not blocked');
  const ends=own.flatMap(s=>[s.a,s.c]).filter(p=>Math.abs(Math.hypot(p[0]-point[0],p[1]-point[1])-radius)<1e-5);
  assert.equal(ends.length,2,'the two wall endpoints meet the fitted opening exactly');
 }
 const road={type:'Feature',geometry:{type:'LineString',coordinates:[[-180,-590],[-130,-540]]},properties:{kind:'road',width:30}};
 const extra={...Y.CAMPUS,features:[...Y.CAMPUS.features,road]};
 assert.deepEqual(plain(Y.Perimeter336North.replaceRuns(baseline,extra)),plain(runs),'unverified path crossings do not sever the physical wall');
 assert.ok(own.some(s=>s.source==='way/638620294'&&near([350,-431.994],s)<.03),'hospital fence uses its independent north line');
});

// Selection must not alias the nearby gate or mutate the archived raw import.
test('two distinct selectable gate points retain source coordinates and stable pick IDs',()=>{
 plan();const ids=['node/10080038172','node/10709402503'],coords=[[256.98863924520197,-422.8303988802362],[421.7838531918162,-428.93729521693496]];
 const gates=ids.map(id=>Y.CAMPUS.features.find(f=>f.properties.id===id));
 gates.forEach((f,i)=>{assert.ok(f);assert.equal(f.properties.kind,'gate');assert.ok(Math.hypot(...f.geometry.coordinates.map((n,k)=>n-coords[i][k]))<1e-6);assert.ok(f.properties.pickId>0);assert.equal(f.properties.reviewed,false);});
 assert.notEqual(gates[0].properties.pickId,gates[1].properties.pickId);
 assert.ok(Math.abs(gates[0].properties.rotation-.258)<.001);assert.equal(gates[1].properties.rotation,Math.PI/2);
 assert.ok(Math.cos(gates[0].properties.frontObservation46.yaw)<-.9,'Small East Gate front observation is north of the gate, on the external lane');
 assert.equal(gates[1].properties.frontObservation46.yaw,Math.PI/2);
 assert.equal(JSON.stringify(Y.CAMPUS.rawFeatures),raw);
 const picks=Y.CAMPUS.features.map(f=>f.properties.pickId);assert.equal(new Set(picks).size,picks.length);
 const before=JSON.stringify(gates);vm.runInContext(fs.readFileSync(file,'utf8'),ctx);assert.equal(JSON.stringify(ids.map(id=>Y.CAMPUS.features.find(f=>f.properties.id===id))),before);
 assert.equal(Y.CAMPUS.features.filter(f=>ids.includes(f.properties.id)).length,2);
});

// Unmerged bars inflate instance costs; flattened sheets lose the observed ironwork.
test('decorative rail retains open three-dimensional ironwork in a few reusable meshes',()=>{
 plan();const rows=[],b=new Y.Builder({add:(key,g,m,c,meta)=>rows.push({key,g,m,c,meta})});b.origin=[1,2,3];b.rotation=.27;b.id=17;b.anim=4;
 const initial=plain([b.origin,b.rotation,b.id,b.anim]);Y.Perimeter336North.renderRail(b,2.4,{height:1.8});const first=rows.slice();Y.Perimeter336North.renderRail(b,2.3,{height:1.8});
 assert.ok(first.length>0&&first.length<=5,'each panel submits a small shared set');
 assert.ok(first.every(r=>rows.slice(first.length).some(s=>s.key===r.key&&s.g===r.g)),'adjacent panels reuse the identical mesh objects');
 assert.ok(first.some(r=>r.g.v.length>2000),'U-shaped and raised bars remain actual geometry');
 assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),initial);
 assert.ok(rows.every(r=>r.m.every(Number.isFinite)&&r.g.v.every(Number.isFinite)));
 assert.equal(b.nSigns,0,'boundary detail does not expand the sign atlas');
});

// A wrapper that omits finally would leak a gate transform after an upload failure.
test('gate renderers emit finite local geometry, keep source picks and restore caller state',()=>{
 plan();const ids=['node/10080038172','node/10709402503'];
 for(const id of ids){
  const gate=Y.CAMPUS.features.find(f=>f.properties.id===id),rows=[],b=new Y.Builder({add:(key,g,m,c,meta)=>rows.push({key,g,m,c,meta})});
  b.origin=[2,3,4];b.rotation=.4;b.id=123;b.anim=7;const old=plain([b.origin,b.rotation,b.id,b.anim]);const result=Y.Gates33.render(b,gate);
  assert.equal(result.currentAccessVerified,false);assert.ok(rows.length>5);assert.ok(rows.every(r=>r.meta[1]===gate.properties.pickId));
  assert.ok(rows.every(r=>r.m.every(Number.isFinite)&&r.g.v.every(Number.isFinite)));assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),old);assert.equal(b.nSigns,0);
  const bounds=rows.flatMap(r=>Array.from({length:r.g.v.length/8},(_,i)=>Y.M.apply(r.m,[...r.g.v.slice(i*8,i*8+3),1]).slice(0,3)));
  assert.ok(bounds.every(p=>Math.hypot(p[0]-gate.geometry.coordinates[0],p[2]-gate.geometry.coordinates[1])<13&&p[1]<4),'no invented monumental gate or displaced source point');
  b.e.add=()=>{throw Error('upload failure')};assert.throws(()=>Y.Gates33.render(b,gate),/upload failure/);assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),old);
 }
 const b=new Y.Builder({add:()=>{}}),west=Y.CAMPUS.features.find(f=>f.properties.id==='node/1422005424');assert.equal(Y.Gates33.render(b,west).profile,'existing-west-gate-building');
});
