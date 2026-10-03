const assert=require('node:assert/strict'),test=require('node:test');
const {load,capture}=require('./campus338-model-helper.cjs');
function legacyRoofOnly(file,code){
 if(file!=='src/legacy/districts-v16.js')return code;
 // Replace the current roof-coordinate helpers with the old radial sweep.
 // Keep all current non-roof code and wrappers. The tested contract is emitted
 // geometry; this counterfactual does not pin a particular current fit formula.
 const method=code.indexOf('P.qiuGymnasium=function'),start=code.indexOf(' const a0=',method),end=code.indexOf(' const pointCache=',start);
 assert.ok(method>=0&&start>method&&end>start,'roof-coordinate helper boundary exists');
 return code.slice(0,start)+' const a0=Math.atan2(-B,A),twist=t=>2.15*Math.pow(1-t,1.4),fraction=t=>t,inverseFraction=u=>u;\n'+code.slice(end);
}
function direct(state){
 const {Y}=state,f=Y.CAMPUS.features.find(f=>f.properties.pickId===40),out=[];
 const b=new Y.Builder({add(k,g,m,c,p){out.push({k,v:Array.from(g.v),m:Array.from(m),c,p:Array.from(p)});}});b.id=40;
 const source=Y.ARCHIVE.legacy[String(f.properties.legacyId)],w=source.modelSize?.[0]||source.w*2.5,d=source.modelSize?.[1]||source.d*2.5;
 b.qiuGymnasium(source,w,d);return{out,w,d};
}
test('Qiu two leaves retain full tessellation and have finite upward normals and triangle winding',()=>{
 const current=load();assert.ok(current.loaded.includes('src/legacy/districts-v16.js'));
 const {out}=direct(current),roofs=out.filter(r=>/^qiu26-roof-/.test(r.k)&&!/-crest|-seams/.test(r.k));assert.equal(roofs.length,2);
 let triangles=0;
 for(const r of roofs){
  assert.equal(r.v.length,96*48*6*8);assert.ok(r.v.every(Number.isFinite));
  for(let i=0;i<r.v.length;i+=8){assert.ok(Math.abs(Math.hypot(...r.v.slice(i+3,i+6))-1)<1e-5);assert.ok(r.v[i+4]>0);}
  for(let i=0;i<r.v.length;i+=24){const a=r.v.slice(i,i+3),b=r.v.slice(i+8,i+11),c=r.v.slice(i+16,i+19);assert.ok((b[2]-a[2])*(c[0]-a[0])-(b[0]-a[0])*(c[2]-a[2])>0,'upward face winding');triangles++;}
 }
 assert.equal(triangles,18432);
});
test('Qiu crest curls across the north side to the east edge with a half-turn opposing leaf',()=>{
 const {out,w,d}=direct(load()),crests=[0,1].map(i=>out.find(r=>r.k.startsWith(`qiu26-roof-${i}-`)&&r.k.endsWith('-crest')));
 assert.ok(crests.every(Boolean));
 const points=r=>{const p=[];for(let i=0;i<r.v.length;i+=48)p.push(r.v.slice(i,i+3));p.push(r.v.slice(r.v.length-48+8,r.v.length-48+11));return p;};
 const a=points(crests[0]),b=points(crests[1]);assert.equal(a.length,97);
 assert.ok(a[0][0]<-14&&Math.abs(a[0][2])<1,'inner crest joins west rim');
 assert.ok(Math.abs(a.at(-1)[0]-w/2)<1e-6,'outer crest ends on east side');
 assert.ok(a.at(-1)[2]<-d*.26&&a.at(-1)[2]>-d*.36,'side endpoint stays away from northeast corner');
 const first=[a[1][0]-a[0][0],a[1][2]-a[0][2]],last=[a.at(-1)[0]-a.at(-2)[0],a.at(-1)[2]-a.at(-2)[2]];
 assert.ok(Math.abs(first[0]/first[1])<.02,'inner tangent follows central rim');
 assert.ok(Math.abs(last[1]/last[0])<.02,'outer tangent reaches side horizontally');
 let maxTurn=0,previousFraction=-1;
 for(let i=0;i<a.length;i++){
  const x=a[i][0],z=a[i][2],angle=Math.atan2(z,x),radius=Math.hypot(x,z),outer=Math.min(w/2/Math.max(1e-9,Math.abs(Math.cos(angle))),d/2/Math.max(1e-9,Math.abs(Math.sin(angle)))),fraction=(radius-16)/(outer-16);
  assert.ok(fraction>previousFraction,'generated normalized radius never folds back');previousFraction=fraction;
  if(i){assert.ok(x>a[i-1][0],'northern crest advances continuously east');assert.ok(z<a[i-1][2],'northern crest advances north without reversal');}
  if(i>0&&i<a.length-1){const u=[x-a[i-1][0],z-a[i-1][2]],v=[a[i+1][0]-x,a[i+1][2]-z],cos=(u[0]*v[0]+u[1]*v[1])/Math.hypot(...u)/Math.hypot(...v);maxTurn=Math.max(maxTurn,Math.acos(Math.min(1,Math.max(-1,cos)))*180/Math.PI);}
 }
 assert.ok(maxTurn<2,'actual crest has continuous curvature, no rectangle-radius corner kink');
 assert.ok(Math.abs(previousFraction-1)<1e-6);
 let sweep=0;
 for(let i=1;i<a.length;i++){let delta=Math.atan2(a[i][2],a[i][0])-Math.atan2(a[i-1][2],a[i-1][0]);while(delta>Math.PI)delta-=2*Math.PI;while(delta< -Math.PI)delta+=2*Math.PI;assert.ok(delta>0,'same handed turn throughout crest');sweep+=delta;}
 assert.ok(sweep>2.3&&sweep<2.7,'reference-supported northern curl rather than old opposite-handed roof');
 for(let i=0;i<a.length;i++){assert.ok(Math.abs(a[i][0]+b[i][0])<1e-5);assert.ok(Math.abs(a[i][2]+b[i][2])<1e-5);assert.ok(Math.abs(a[i][1]-b[i][1])<1e-5);}
});
test('roof parameter change preserves non-roof model records and integrated dome corrections',()=>{
 const base=load({transform:legacyRoofOnly}),current=load(),a=direct(base),b=direct(current);
 const nonRoof=r=>!r.k.startsWith('qiu26-roof-')&&r.p[3]!==2.1;
 assert.deepEqual(b.out.filter(nonRoof),a.out.filter(nonRoof),'body, windows, entry and glazed dome are not roof leaf geometry');
 const ra=capture(base,40),rb=capture(current,40),dome=out=>out.filter(r=>r.k.includes('dome-normal194'));
 assert.equal(dome(rb.out).length,864);assert.deepEqual(dome(rb.out),dome(ra.out));
 assert.equal(JSON.stringify(ra.f.geometry),JSON.stringify(rb.f.geometry));
 for(const r of rb.out){assert.ok(r.v.every(Number.isFinite));assert.ok(r.m.every(Number.isFinite));}
});
