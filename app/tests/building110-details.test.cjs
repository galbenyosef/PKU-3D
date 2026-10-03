const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
function render(source){const ctx=vm.createContext({console});vm.runInContext('var YY={ARCHIVE:{legacy:{}}};',ctx);for(const name of ['math','geometry','footprints'])vm.runInContext(fs.readFileSync(root+'/src/'+name+'.js','utf8'),ctx);ctx.document={createElement:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})};for(const name of['models','legacy/landmarks','architecture-adapter','architecture-v30','engine'])vm.runInContext(fs.readFileSync(root+'/src/'+name+'.js','utf8'),ctx);vm.runInContext(source,ctx);const Y=ctx.YY,out=[],feature=JSON.parse(fs.readFileSync(root+'/data/campus.json')).features.find(f=>f.properties.id==='way/1009052003'),engine=Object.create(Y.Engine.prototype);engine.buckets=new Map();engine.stats={instances:0};const b=new Y.Builder({add(k,g,m,c,p,uv){out.push({k,v:Array.from(g.v),m:Array.from(m),c,p,uv});Y.Engine.prototype.add.call(engine,k,g,m,c,p,uv);}});const result=Y.Architecture30.render(b,feature,(k,g,c,mat,id)=>b.e.add(k,g,Y.M.identity(),c,[mat,id,0,0]));return{Y,out,feature,engine,result};}
const current=render(fs.readFileSync(root+'/src/building110-v46.js','utf8')),added=r=>r.k.includes('south-window-inner-frames'),hash=rows=>crypto.createHash('sha256').update(JSON.stringify(rows)).digest('hex');
test('south nested frames remain inside tall glass lights and close all four corners',()=>{
 const {Y,out,feature}=current,rows=out.filter(added);assert.equal(rows.length,48);
 const p=feature.geometry.coordinates[0],a=p[1],c=p[2],width=Math.hypot(c[0]-a[0],c[1]-a[1]),u=[(c[0]-a[0])/width,(c[1]-a[1])/width],n=[-u[1],u[0]],eps=5e-5;
 const bounds=r=>{const ps=[];for(let i=0;i<r.v.length;i+=8){const q=Y.M.apply(r.m,[...r.v.slice(i,i+3),1]);ps.push([(q[0]-a[0])*u[0]+(q[2]-a[1])*u[1],q[1],(q[0]-a[0])*n[0]+(q[2]-a[1])*n[1]]);}return [0,1,2].map(j=>[Math.min(...ps.map(p=>p[j])),Math.max(...ps.map(p=>p[j]))]);};
 const glass=out.filter(r=>r.k.includes('south-photo-windows')&&r.p[0]===5).map(bounds);assert.equal(glass.length,4);
 for(let group=0;group<12;group++){
  const floor=Math.floor(group/6),bay=Math.floor(group/3)%2,pane=group%3,lo=floor?4.2:1.05,hi=floor?6.5:3.08,h=hi-lo,x=width*(bay?.75:.25)-1.26+.84*(pane+.5),b=rows.slice(group*4,group*4+4).map(bounds);
  for(const v of b){assert.ok(v[0][0]>x-.42+.0375&&v[0][1]<x+.42-.0375,'inner frame must not intersect primary stiles');assert.ok(v[1][0]>lo+h*.25+.0375&&v[1][1]<hi-.0375,'must not cover transom or head');assert.ok(Math.abs(v[2][0]+.0495)<eps&&Math.abs(v[2][1]+.0045)<eps);}
  for(const v of b)assert.ok(glass.some(g=>[0,1].every(j=>v[j][0]>=g[j][0]-eps&&v[j][1]<=g[j][1]+eps)&&Math.min(v[2][1],g[2][1])-Math.max(v[2][0],g[2][0])>.0019),'beading must physically overlap its original glass');
  for(const v of b.slice(0,2))for(const h of b.slice(2)){for(let j=0;j<3;j++)assert.ok(Math.min(v[j][1],h[j][1])-Math.max(v[j][0],h[j][0])>0,'corner joint must overlap');}
 }
});
const retained=rows=>{const doors=rows.filter(r=>r.k==='110-east-photo-doors-box');return rows.filter(r=>!added(r)&&!r.k.includes('east-threshold')&&(r.k!=='110-east-photo-doors-box'||r===doors[5]));};
// Five door records intentionally change in entry116; its separate tests cover
// the sill, while this frozen digest retains the original door head and body.
test('real first-key Engine.add and unaffected original records are preserved',()=>{
 const {out,engine}=current;assert.equal(engine.stats.instances,out.length);for(const r of out)assert.deepEqual(Array.from(engine.buckets.get(r.k).geometry.v),Array.from(new Float32Array(r.v)));
 // The later ground-contact repair extends only bottom stone pieces. Keep the
 // historical digest on a control with that one extension disabled, then
 // compare every current record to it with only those two matrix slots allowed.
 const source=fs.readFileSync(root+'/src/building110-v46.js','utf8');
 const marker='const bottom=Math.abs(lo-H.base)<1e-8?-.01:lo;';assert.ok(source.includes(marker));
 const control=retained(render(source.replace(marker,'const bottom=lo;')).out),actual=retained(out);
 assert.equal(control.length,243);assert.equal(hash(control),'df5df18773ffdf8827bd90c5b64fd92c620fd2916e2ae4bb52365d7f4f55b5bb');
 let grounded=0;assert.equal(actual.length,control.length);
 const host=r=>({...r,p:Array.from(r.p),uv:r.uv&&Array.from(r.uv)});
 for(let i=0;i<actual.length;i++){const a=host(actual[i]),c=host(control[i]);
  if(a.k.endsWith('-wall-box')&&Math.abs(c.m[13]-c.m[5]/2-.12)<1e-7){
   grounded++;assert.ok(Math.abs(a.m[13]-a.m[5]/2+.01)<1e-7);assert.ok(Math.abs(a.m[13]+a.m[5]/2-c.m[13]-c.m[5]/2)<1e-7);
   const m=a.m.slice();m[5]=c.m[5];m[13]=c.m[13];assert.deepEqual({...a,m},c);
  }else assert.deepEqual(a,c);
 }assert.ok(grounded>0);
 assert.ok(out.every(r=>r.p[1]===current.feature.properties.pickId));
});
if(process.env.B110_BASELINE){const before=render(fs.readFileSync(process.env.B110_BASELINE,'utf8')).out;assert.equal(hash(retained(before)),hash(retained(current.out)));const count=rows=>({records:rows.length,vertices:rows.reduce((n,r)=>n+r.v.length/8,0)});console.log(JSON.stringify({old:count(before),new:count(current.out),hash:hash(before)}));if(process.env.B110_SAVE_OUTPUT)fs.writeFileSync(process.env.B110_SAVE_OUTPUT,JSON.stringify(before));}
