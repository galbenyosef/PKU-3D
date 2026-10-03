const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const APP=path.resolve(__dirname,'..'),plain=v=>JSON.parse(JSON.stringify(v));
function setup(candidate){
 const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>({scale(){}})})}});vm.runInContext('var YY={}',ctx);
 ctx.YY.CAMPUS=JSON.parse(fs.readFileSync(APP+'/data/campus.json','utf8'));
 for(const name of['math','geometry','footprints','models','eastgate-lions'])vm.runInContext(fs.readFileSync(APP+'/src/'+name+'.js','utf8'),ctx,{filename:name});
 const initial=plain(ctx.YY.CAMPUS.features.map(f=>({id:f.properties.id,pickId:f.properties.pickId,geometry:f.geometry}))),loaded=[];
 let inserted=false;
 for(const [,file]of fs.readFileSync(APP+'/index.html','utf8').matchAll(/script src="(src\/[^"]+\.js)"/g)){
  if(file==='src/perimeter337-qiu.js'){if(!candidate)continue;inserted=true;}
  const code=fs.readFileSync(APP+'/'+file,'utf8');
  if(file==='src/gates-v33.js'||/Y\.Gates33\.render/.test(code)){vm.runInContext(code,ctx,{filename:file});loaded.push(file);}
 }
 if(candidate)assert.ok(inserted,'candidate insertion point exists in actual page');
 return {Y:ctx.YY,initial,loaded};
}
function capture(Y,pick){const records=[],b=new Y.Builder({add:(key,g,m,col,meta)=>records.push({key,g,m,col,meta})}),f=Y.CAMPUS.features.find(f=>f.properties.pickId===pick);b.origin=[7,4,9];b.rotation=.3;b.id=55;b.anim=6;const old=[b.origin,b.rotation,b.id,b.anim],result=Y.Gates33.render(b,f);assert.deepEqual([b.origin,b.rotation,b.id,b.anim],old);return {records,b,f,result};}
const base=setup(false),current=setup(true),now=capture(current.Y,761);
function vertices(r){const out=[];for(let i=0;i<r.g.v.length;i+=8)out.push(current.Y.M.apply(r.m,[...r.g.v.slice(i,i+3),1]));return out;}
test('candidate remains active through every actual index gate wrapper and preserves map geometry',()=>{
 assert.equal(now.result.profile,'north-qiu-silver-scissor-extended-photo2023');
 assert.ok(current.loaded.includes('src/gate765-details.js'));assert.ok(current.loaded.includes('src/perimeter336-east.js'));
 assert.deepEqual(plain(current.Y.CAMPUS.features.map(f=>({id:f.properties.id,pickId:f.properties.pickId,geometry:f.geometry}))),plain(base.Y.CAMPUS.features.map(f=>({id:f.properties.id,pickId:f.properties.pickId,geometry:f.geometry}))));
 assert.equal(now.result.fullWidthVerified,false);assert.equal(now.result.currentAccessVerified,false);
 assert.match(now.f.properties.scopeNote,/机头位置和两端回墙未确认/);
});
test('all other gates retain exact rendered geometry and metadata',()=>{
 for(const pick of[763,765,766,767]){
  const a=capture(base.Y,pick),b=capture(current.Y,pick);
  assert.deepEqual(plain(a.records),plain(b.records));assert.deepEqual(plain(a.result),plain(b.result));assert.deepEqual(plain(a.f),plain(b.f));
 }
});
test('extended display joins existing fence ends and spans the mapped road without shifting source',()=>{
 const [x,z]=now.f.geometry.coordinates,vs=now.records.flatMap(vertices),fit=current.Y.Perimeter337Qiu.fit;
 assert.deepEqual(plain(now.f.geometry.coordinates),[470.028,452.521]);
 assert.ok(vs.every(p=>p.every(Number.isFinite)));
 assert.ok(vs.every(p=>p[0]>x+1&&p[0]<x+2.1),'mesh fits streetward existing ring, no extra west setback');
 for(const end of [fit.south,fit.north])assert.ok(vs.some(p=>Math.hypot(p[0]-end[0],p[2]-end[1])<.20),'paired metalwork straddles fitted fence endpoint');
 assert.ok(vs.some(p=>Math.abs(p[2]-z)<.2&&p[1]>.4),'extended photo pose intentionally crosses the road');
 assert.ok(Math.abs(Math.min(...vs.map(p=>p[1]))-.02)<1e-5);
 assert.ok(Math.max(...vs.map(p=>p[1]))<1.85,'no invented tall gatepost or arch');
 const wheels=vertices(now.records.find(r=>r.key.endsWith('wheels'))),onRoad=wheels.filter(p=>Math.abs(p[2]-(z-.09))<1.8);
 assert.ok(onRoad.length>0);assert.ok(Math.abs(Math.min(...onRoad.map(p=>p[1]))-.12)<1e-5,'road-supported wheels contact road surface');
 assert.equal(now.result.widthSource,'existing-fence-opening-fit');
});
test('display endpoints equal the adjacent actual fence-plan endpoints',()=>{
 for(const name of ['footprints','fences-v35']){
  const source=fs.readFileSync(APP+'/src/'+name+'.js','utf8');
  // Use the same namespace and loaded gate/boundary wrappers as real page order.
  vm.runInNewContext(source,{YY:current.Y});
 }
 const fit=current.Y.Perimeter337Qiu.fit,ends=current.Y.Fences35.plan(current.Y.CAMPUS).filter(r=>r.campus).flatMap(r=>[r.a,r.c]);
 for(const endpoint of[fit.south,fit.north])assert.ok(ends.some(p=>Math.hypot(p[0]-endpoint[0],p[1]-endpoint[1])<1e-6));
});
test('merged silver mesh and wheels keep finite unit normals, 761 picks and cached detailed geometry',()=>{
 assert.equal(now.records.length,2,'two material meshes instead of many uploaded tiny pieces');
 for(const r of now.records){assert.equal(r.meta[1],761);assert.ok(r.g.v.length>1000);for(let i=0;i<r.g.v.length;i+=8){assert.ok(r.g.v.slice(i,i+8).every(Number.isFinite));assert.ok(Math.abs(Math.hypot(...r.g.v.slice(i+3,i+6))-1)<1e-6);}}
 const original=now.records.map(r=>r.g);current.Y.Gates33.render(now.b,now.f);assert.equal(now.records[2].g,original[0]);assert.equal(now.records[3].g,original[1]);
});
test('failed emission restores caller transforms and IDs',()=>{
 const b=new current.Y.Builder({add(){throw Error('capture failed')}});b.origin=[3,7,11];b.rotation=.9;b.id=71;b.anim=4;const old=[b.origin,b.rotation,b.id,b.anim];assert.throws(()=>current.Y.Gates33.render(b,now.f),/capture failed/);assert.deepEqual([b.origin,b.rotation,b.id,b.anim],old);
});
