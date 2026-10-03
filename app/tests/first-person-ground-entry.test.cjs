const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {APP,load}=require('./campus338-model-helper.cjs');
const {Y}=load(),source=fs.readFileSync(path.join(APP,'src/app-v29.js'),'utf8');
// Run the maintained navigation and walker factory, without starting the UI.
const nav=vm.createContext({YY:{}});
vm.runInContext(fs.readFileSync(path.join(APP,'src/network.js'),'utf8'),nav);
vm.runInContext(source.split('/* Campus viewer */')[0],nav);
const factoryStart=source.indexOf('function makeWalker(){'),factoryEnd=source.indexOf('function enterFirstPerson(');
assert(factoryStart>0&&factoryEnd>factoryStart,'maintained makeWalker boundary exists');
function setup(roads,features=Y.CAMPUS.features){
 const graph=nav.YY.Network.build(roads),ctx=vm.createContext({Y:{...Y,FirstPerson:nav.YY.FirstPerson},D:{features},F:Y.Footprints,campus:{network:graph}});
 vm.runInContext(source.slice(factoryStart,factoryEnd),ctx);
 return {walk:ctx.makeWalker(),graph};
}
const cutModules=[['008',Y.Building008],['080',Y.Building080],['195',Y.StudentCenterSouth46]];
function cutFixture(model){
 const ring=model.groundCut.excavationRing||model.groundCut.ring;
 const inside=ring.slice(0,-1).reduce((p,q)=>[p[0]+q[0]/(ring.length-1),p[1]+q[1]/(ring.length-1)],[0,0]);
 assert(Y.Footprints.inside(inside,{type:'Polygon',coordinates:[ring]}),'fixture seed lies in actual registered excavation');
 const outside=[Math.max(...ring.map(p=>p[0]))+4,inside[1]],far=[outside[0]+15,outside[1]];
 return {inside,outside,roads:[{points:[inside,outside,far],w:4}]};
}
for(const [id,model]of cutModules){
 test(`free entry excludes actual ${id} excavation; ordinary ground remains usable`,()=>{
  const {inside,outside,roads}=cutFixture(model),{walk}=setup(roads,[]);
  // Empty building fixtures isolate the real excavation registration as the obstacle.
  assert.equal(walk.groundClear(inside),false);assert(walk.enter(inside));const component=walk.component;
  assert(walk.enterNearby(inside,Math.PI/2));assert.equal(walk.component,component);
  assert(walk.groundClear(walk.position,1.2));assert(walk.allowed(walk.position));
  assert(walk.enterNearby(outside,Math.PI/2));const before=walk.position.slice();
  for(let i=0;i<20;i++)walk.move(1,0,.05);
  assert(Math.abs(Math.hypot(walk.position[0]-before[0],walk.position[1]-before[1])-2.1)<1e-7);
 });
 test(`manual walking stops at ${id} excavation; route planning is retained`,()=>{
  const {inside,outside,roads}=cutFixture(model),{walk,graph}=setup(roads,[]);
  const before=JSON.stringify(graph),route=nav.YY.Network.route(graph,outside,inside);assert(route,'source road through excavation remains routable');
  assert(walk.enter(outside,-Math.PI/2));
  for(let i=0;i<400;i++)walk.move(1,0,.05);
  assert(walk.groundClear(walk.position,.3),'manual movement stops outside unsupported ground');
  assert(walk.position[0]<outside[0]-1,'movement reached the boundary rather than being disabled');
  const held=walk.position.slice();assert.equal(walk.follow(route,route.length),false);
  assert.deepEqual(walk.position,held,'rejected route progress holds the last valid view');
  assert.equal(JSON.stringify(graph),before,'entry and movement never modify the road graph');
  assert.equal(JSON.stringify(nav.YY.Network.route(graph,outside,inside)),JSON.stringify(route),'planner result remains identical');
 });
}
test('195 platform entry moves to its real connected ordinary road',()=>{
 const ids=new Set(['way/33455720','way/1100981979','way/1159305417']);
 const roads=Y.CAMPUS.features.filter(f=>ids.has(f.properties.id));assert.equal(roads.length,3);
 const {walk,graph}=setup(roads.map(f=>({points:f.geometry.coordinates,w:f.properties.width,source:f.properties.id})));
 const selected=Y.CAMPUS.features.find(f=>f.properties.pickId===195),before=JSON.stringify(graph);
 assert(walk.enter(selected.properties.centre));const component=walk.component;
 assert.equal(walk.groundClear(walk.position),false,'mapped entrance starts in the raised bridge/court registration');
 assert(walk.enterNearby(selected.properties.centre,-1.627));assert.equal(walk.component,component);
 const street=roads.find(f=>f.properties.id==='way/33455720').geometry.coordinates;
 assert(street.slice(1).some((b,i)=>Y.Footprints.distSegment(walk.position,street[i],b)<1e-6),'free view lands on the actual eastern street centerline');
 assert(walk.groundClear(walk.position,1.2));assert(walk.allowed(walk.position));
 for(let i=0;i<22;i++)walk.move(1,0,.05);
 assert(walk.groundClear(walk.position,.3),'1.1 seconds toward the entrance remains on ordinary ground');
 assert.equal(JSON.stringify(graph),before);
});
