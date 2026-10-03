const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),crypto=require('node:crypto');
const APP=path.resolve(__dirname,'..'),ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});
vm.runInContext('var YY={}',ctx);
for(const m of fs.readFileSync(APP+'/index.html','utf8').matchAll(/script src="src\/(.*?)\.js"/g)){if(m[1]==='scene-v29')break;vm.runInContext(fs.readFileSync(APP+'/src/'+m[1]+'.js','utf8'),ctx,{filename:m[1]});}
const Y=ctx.YY,runs=Y.Fences35.plan(Y.CAMPUS),mid=r=>r.a.map((v,i)=>(v+r.c[i])/2),plain=v=>JSON.parse(JSON.stringify(v));
test('resource street frontage has no campus fence across the station or main-block doors',()=>{
 const extra=runs.filter(r=>r.campus&&mid(r)[0]>164.069&&mid(r)[0]<386.563&&mid(r)[1]>741);
 assert.equal(extra.length,0,'frontage belongs to the street-facing building boundary');
});
test('solid south-west wall remains continuous across internal dormitory road ends',()=>{
 for(const x of[-121.436,-41.224,37.202,80]){
  const wall=runs.filter(r=>r.campus&&r.a[1]>740&&Math.min(r.a[0],r.c[0])<=x&&Math.max(r.a[0],r.c[0])>=x);
  assert.equal(wall.length,1);assert.equal(wall[0].style,'masonry');
 }
 assert.ok(runs.filter(r=>r.style==='masonry').every(r=>Math.max(r.a[0],r.c[0])<110),'south gate opening is retained');
});
test('omitted ref-only resource checkpoint is selectable at its original map coordinate',()=>{
 const gate=Y.CAMPUS.features.find(f=>f.properties.id==='node/10076453368');assert.ok(gate);
 assert.deepEqual(plain(gate.geometry.coordinates),[389.698,742.254]);assert.equal(gate.properties.kind,'gate');
 assert.equal(gate.properties.tags.ref,'资源楼出入口');assert.ok(!gate.properties.reviewed);
 const road=Y.CAMPUS.features.find(f=>f.properties.pickId===204);assert.equal(road.geometry.coordinates.length,14,'mapped road is not deleted on an unverified no-gate assumption');
});
test('station is discoverable on its fitted west annex, without a duplicate building',()=>{
 const resource=Y.CAMPUS.features.find(f=>f.properties.pickId===137);assert.ok(resource.properties.aliases.includes('南门驿站'));
 const obs=resource.properties.frontObservation46;assert.ok(obs);assert.ok(obs.target[0]>151&&obs.target[0]<159);assert.ok(obs.target[2]>739&&obs.target[2]<745);
 assert.equal(Y.CAMPUS.features.filter(f=>f.properties.kind==='building'&&f.properties.id==='way/240832252').length,1);
});
test('west wall continues beneath the mapped elevated bridge and has its own vehicle gate',()=>{
 const bridge=runs.filter(r=>r.campus&&mid(r)[0]<-410&&mid(r)[0]>-450&&mid(r)[1]>247&&mid(r)[1]<275);
 assert.ok(bridge.length>8,'bridge crossing does not remove the ground wall');
 assert.ok(bridge.every(r=>r.style==='rubble'));
 const gate=Y.CAMPUS.features.find(f=>f.properties.id==='node/380721886');assert.ok(gate);
 assert.equal(gate.properties.tags.motor_vehicle,'yes');assert.equal(gate.properties.tags.foot,'no');
});
test('all sports fence plans remain byte-identical to the preceding scene',()=>{
 const sports=plain(runs.filter(r=>!r.campus));assert.equal(sports.length,753);
 assert.equal(crypto.createHash('sha256').update(JSON.stringify(sports)).digest('hex'),'f1d47af7dd36ba11a43e2ab7c1591460dac2b81f82912204131f3a7521c45204');
});
test('new gate and rubble emissions are finite and preserve caller transforms',()=>{
 const records=[],b=new Y.Builder({add:(key,g,m,col,meta)=>records.push({key,g,m,meta})});b.origin=[2,3,4];b.rotation=.4;b.id=123;b.anim=7;const old=plain([b.origin,b.rotation,b.id,b.anim]);
 for(const id of['node/10076453368','node/380721886'])Y.Gates33.render(b,Y.CAMPUS.features.find(f=>f.properties.id===id));
 assert.deepEqual(plain([b.origin,b.rotation,b.id,b.anim]),old);assert.ok(records.length>40);
 assert.ok(records.every(r=>r.m.every(Number.isFinite)&&r.g.v.every(Number.isFinite)));
 const ids=Y.CAMPUS.features.map(f=>f.properties.pickId);assert.equal(ids.length,new Set(ids).size,'restored gates never reuse a pick ID');
 for(let i=0;i<4;i++)for(const g of Y.Perimeter335.rubbleMeshes(i)){
  assert.ok(g.v.length>0);for(let j=0;j<g.v.length;j+=8){assert.ok(Math.abs(g.v[j])<=1.2);assert.ok(g.v[j+1]>=0&&g.v[j+1]<=2.03);assert.ok(Math.abs(g.v[j+2])<.24);}
 }
});
test('fitted gates connect to their actual boundary endpoints instead of leaving side bypasses',()=>{
 const links=Y.Perimeter335.planConnections(Y.CAMPUS,runs);assert.equal(links.length,6);
 for(const id of['south-west','resource-east','west-side-left','west-side-right']){
  const link=links.find(x=>x.name===id);assert.ok(link);
  assert.ok(runs.some(r=>[r.a,r.c].some(p=>Math.hypot(p[0]-link.a[0],p[1]-link.a[1])<1e-8)),'join starts at an actual generated endpoint');
 }
 const link=links.find(x=>x.name==='resource-building-return');assert.deepEqual(plain(link.a),[386.563,733.072]);
 assert.ok(links.every(l=>Math.hypot(l.a[0]-l.c[0],l.a[1]-l.c[1])<15));
});
