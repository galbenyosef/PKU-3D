const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {APP,load}=require('./campus338-model-helper.cjs');
const plain=x=>JSON.parse(JSON.stringify(x)),MODULE='src/eastfield338.js';
// Candidate uses the real maintained index; baseline skips only this wrapper.
const base=load({skip:[MODULE]}),now=load();
now.before=plain(now.Y.CAMPUS);
assert.equal(now.scripts.filter(s=>s===MODULE).length,1);
assert.ok(now.loaded.includes(MODULE));
assert.ok(now.loaded.indexOf(MODULE)>now.loaded.indexOf('src/outdoor768-details.js'));
function capture(ctx,id){const records=[],b=new ctx.Y.Builder({add:(key,g,m,col,meta)=>records.push({key,g,m,col,meta})}),f=ctx.Y.CAMPUS.features.find(f=>f.properties.pickId===id);const result=ctx.Y.Sports32.render(b,f);return {records,result,f};}
const pitches=capture(now,49);
test('actual index sport wrappers preserve source geometry and unrelated sport records',()=>{assert.deepEqual(plain(now.Y.CAMPUS.features.map(f=>[f.properties.id,f.geometry])),plain(base.Y.CAMPUS.features.map(f=>[f.properties.id,f.geometry])));assert.ok(now.loaded.includes('src/outdoor768-details.js'));assert.deepEqual(plain(now.Y.CAMPUS),now.before);for(const id of[50,198])assert.deepEqual(plain(capture(now,id)),plain(capture(base,id)));});
test('two independent east-west pitches each have complete circle boundary and north-south midline',()=>{const fit=now.Y.EastField338.fit;assert.equal(fit.pitches.length,2);assert.ok(fit.pitches[0].z+30<fit.pitches[1].z-30);assert.ok(Math.abs(Math.cos(fit.rotation))>.95);const lines=pitches.records.filter(r=>r.key.startsWith('eastfield338-pitch-'));assert.equal(lines.length,2);
for(const r of lines){const v=r.g.v;assert.ok(v.length>5000);const ps=[];for(let j=0;j<v.length;j+=8)ps.push(v.slice(j,j+3));assert.ok(ps.some(p=>Math.abs(p[0])<.07&&p[2]>29));assert.ok(ps.some(p=>Math.abs(p[0])<.07&&p[2]<-29));assert.ok(ps.some(p=>Math.abs(p[0]-9.15)<.07&&Math.abs(p[2])<.1));assert.ok(ps.some(p=>Math.abs(p[0]+9.15)<.07&&Math.abs(p[2])<.1));}
});
test('fitted outdoor surface adjoins north field without overlap and preserves source',()=>{assert.match(fs.readFileSync(path.join(APP,'src/scene-v29.js'),'utf8'),/F\.surface\(Y\.EastField338\?\.surfaceGeometry\(f\)\|\|g,/,'actual scene consumes the display-only surface hook');const f=now.Y.CAMPUS.features.find(f=>f.properties.pickId===768),g=now.Y.EastField338.surfaceGeometry(f),fit=now.Y.EastField338.fit;assert.notDeepEqual(plain(g),plain(f.geometry));for(const p of g.coordinates[0]){const dx=p[0]-fit.centre[0],dz=p[1]-fit.centre[1],z=dx*Math.sin(fit.rotation)+dz*Math.cos(fit.rotation);assert.ok(z<-67);}const ps=g.coordinates[0].slice(0,-1).map(p=>{const dx=p[0]-fit.centre[0],dz=p[1]-fit.centre[1];return dx*Math.sin(fit.rotation)+dz*Math.cos(fit.rotation)});assert.ok(-65-Math.max(...ps)<7);assert.deepEqual(plain(now.Y.CAMPUS),now.before);});
test('all generated vertices and normals are finite with unit normals and stable pick identities',()=>{for(const id of[49,177,768])for(const r of capture(now,id).records){assert.equal(r.meta[1],id);assert.ok([...r.m].every(Number.isFinite));for(let i=0;i<r.g.v.length;i+=8){assert.ok(r.g.v.slice(i,i+8).every(Number.isFinite));assert.ok(Math.abs(Math.hypot(...r.g.v.slice(i+3,i+6))-1)<1e-5);}}});
test('failed emission restores builder transform and identity',()=>{const b=new now.Y.Builder({add(){throw Error('stop')}});b.origin=[3,4,5];b.rotation=.3;b.id=89;const old=[b.origin,b.rotation,b.id,b.anim];assert.throws(()=>now.Y.Sports32.render(b,pitches.f),/stop/);assert.deepEqual([b.origin,b.rotation,b.id,b.anim],old);});

test('2025 wall has one long north-south canopy group within source177 envelope',()=>{const cap=capture(now,177),pts=cap.records.flatMap(r=>{const a=[];for(let i=0;i<r.g.v.length;i+=8)a.push(now.Y.M.apply(r.m,[...r.g.v.slice(i,i+3),1]));return a});assert.ok(now.Y.EastField338.fit.wallCanopySameObject);assert.equal(now.Y.EastField338.fit.wallReferenceYear,2025);assert.ok(cap.records.some(r=>r.key==='eastfield338-rock-dark'));assert.ok(pts.every(p=>p[0]>89&&p[0]<124&&p[2]>-311&&p[2]<-263),JSON.stringify([pts.reduce((a,p)=>Math.min(a,p[0]),Infinity),pts.reduce((a,p)=>Math.max(a,p[0]),-Infinity),pts.reduce((a,p)=>Math.min(a,p[2]),Infinity),pts.reduce((a,p)=>Math.max(a,p[2]),-Infinity)]));assert.ok(pts.reduce((a,p)=>Math.max(a,p[1]),-Infinity)>15);});
test('concave color bands stay inside their contours and sit on actual panels behind holds and ropes',()=>{
 const contours={
 'eastfield338-rock-dark':[[.3,-3.2],[6,-2.4],[10,0],[14.8,-1.7],[14.8,-.5],[10,1.2],[6,-1],[.3,-1.8]],
 'eastfield338-rock-red':[[.3,-3.7],[6,-2.9],[10,-.5],[14.8,-2.2],[14.8,-1.7],[10,0],[6,-2.4],[.3,-3.2]]};
 const records=capture(now,177).records;
 for(const r of records.filter(r=>contours[r.key])){const ring=[...contours[r.key],contours[r.key][0]],g={type:'Polygon',coordinates:[ring]};let sum=0;
  for(let i=0;i<r.g.v.length;i+=24){const ps=[0,8,16].map(k=>r.g.v.slice(i+k,i+k+3)),[a,b,c]=ps,cross=(b[1]-a[1])*(c[2]-a[2])-(b[2]-a[2])*(c[1]-a[1]);assert.ok(cross>0);sum+=cross/2;
   const y=(a[1]+b[1]+c[1])/3,z=(a[2]+b[2]+c[2])/3;assert.ok(now.Y.Footprints.inside([y,z],g));const row=Math.floor((y-.2)/2),central=Math.abs(z)<5/3;const surface=(central&&row>2?.54:.12);assert.ok(ps.every(p=>Math.abs(p[0]-surface-.002)<1e-8));assert.ok(surface+.08>a[0],'hold centres remain in front');if(Math.abs(z)>5/3)assert.ok(.3-.008>a[0],'rope rear remains in front of outer-panel stripe');
  }
  const area=Math.abs(now.Y.Footprints.area(ring));assert.ok(sum<=area+1e-8);assert.ok(sum>area*.97,'only actual narrow panel joints may remove color');
 }
});
