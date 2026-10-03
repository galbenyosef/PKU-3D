const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const app=path.resolve(__dirname,'..');
function capture(fixed,instrument=true,pick=200){
 const ctx=vm.createContext({console}),out=[];ctx.document={createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*30})},{get:(o,k)=>o[k]||(()=>{})})})};
 vm.runInContext('var YY={};',ctx);
 const load=n=>vm.runInContext(fs.readFileSync(path.join(app,'src',n+'.js'),'utf8'),ctx,{filename:n});
 for(const n of ['math','geometry','footprints','engine','models','network','fences-v35','vegetation-v33','scan1119-resources315','architecture-data'])load(n);
 const names=[...fs.readFileSync(path.join(app,'index.html'),'utf8').matchAll(/script src="src\/(.*?)\.js"/g)].map(m=>m[1]);
 for(const n of names.filter(n=>n.startsWith('legacy/')||n==='westgate-details'))load(n);
 let root;ctx.captureRoot=r=>{root=Array.from(r)};
 let code=fs.readFileSync(path.join(app,'src/architecture-adapter.js'),'utf8');
 if(instrument)code=code.replace('const edges=boundary(g),shape=', 'captureRoot(root);const edges=boundary(g),shape=');
 vm.runInContext(code,ctx);load('architecture-v30');
 if(fixed&&fs.existsSync(path.join(app,'src/jianzhai200-details.js')))load('jianzhai200-details');
 const Y=ctx.YY,engine=Object.create(Y.Engine.prototype);engine.buckets=new Map();engine.stats={instances:0};
 const b=new Y.Builder({add(k,g,m,c,p,uv){Y.Engine.prototype.add.call(engine,k,g,m,c,p,uv);const actual=engine.buckets.get(k).geometry;assert.deepEqual(Array.from(actual.v),Array.from(new Float32Array(g.v)),`Engine first-key collision ${k}`);out.push({k,v:Array.from(actual.v),m:Array.from(m),c,p:Array.from(p),uv:uv&&Array.from(uv)});}});
 const f=JSON.parse(fs.readFileSync(path.join(app,'data/campus.json'))).features.find(f=>f.properties.pickId===pick);
 const result=Y.Architecture30.render(b,f,(k,g,c,mat,id)=>b.e.add(k,g,Y.M.identity(),c,[mat,id,0,0]));
 return {out,result,root,Y};
}


const before=capture(false),after=capture(true);
function triangles(c){const inv=c.Y.M.inverse(c.root),ts=[];for(const r of c.out){const m=c.Y.M.multiply(inv,r.m);for(let i=0;i<r.v.length;i+=24)ts.push([0,8,16].map(k=>Array.from(c.Y.M.apply(m,[...r.v.slice(i+k,i+k+3),1])).slice(0,3)));}return ts;}
function intersections(ts,x,y,lo,hi,side=false){let n=0;for(let t of ts){if(side)t=t.map(p=>[p[2],p[1],p[0]]);const [a,b,c]=t,det=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1]);if(Math.abs(det)<1e-9)continue;const u=((b[1]-c[1])*(x-c[0])+(c[0]-b[0])*(y-c[1]))/det,v=((c[1]-a[1])*(x-c[0])+(a[0]-c[0])*(y-c[1]))/det;if(u>=-1e-5&&v>=-1e-5&&u+v<=1.00001){const z=u*a[2]+v*b[2]+(1-u-v)*c[2];if(z>lo&&z<hi)n++;}}return n;}
test('actual clipped wall has a gap before and meets the plinth after',()=>{
 const old=triangles(before),next=triangles(after);
 for(const x of [-20,0,20]){assert.equal(intersections(old,x,.765,-9.04,-8.96),0);assert.ok(intersections(next,x,.765,-9.04,-8.96)>0);}
});
test('only the original clipped plaster bucket and label translation change',()=>{
 assert.equal(after.out.length,before.out.length);let changes=0;
 for(let i=0;i<before.out.length;i++){const a=before.out[i],b=after.out[i];if(JSON.stringify(a)===JSON.stringify(b))continue;changes++;
  if(a.k==='v30-plane'){
   assert.deepEqual({...b,m:a.m},a);for(let j=0;j<12;j++)assert.equal(a.m[j],b.m[j]);assert.equal(a.m[13],b.m[13]);
   const inv=after.Y.M.inverse(after.root),ma=after.Y.M.multiply(inv,a.m),mb=after.Y.M.multiply(inv,b.m);
   assert.ok(Math.abs(mb[14]-ma[14]-.08)<1e-4);continue;
  }
  assert.equal(a.k,'v30-clipped-200-jian-#d9d7c9|24|0');assert.deepEqual({...b,v:a.v},a);assert.equal(a.v.length,b.v.length);for(let j=0;j<a.v.length;j++)if(j%8!==1)assert.equal(a.v[j],b.v[j]);}
 assert.equal(changes,2);
});
test('other halls and uninstrumented actual Engine output remain exact',()=>{
 for(const pick of [108,189,201])assert.deepEqual(capture(true,true,pick).out,capture(false,true,pick).out);
 assert.deepEqual(capture(true,false).out,after.out);
});
const sub=(a,b)=>a.map((v,i)=>v-b[i]),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
function hit(t,o,d,max){const[a,b,c]=t,e1=sub(b,a),e2=sub(c,a),h=cross(d,e2),det=dot(e1,h);if(Math.abs(det)<1e-9)return false;const s=sub(o,a),u=dot(s,h)/det,q=cross(s,e1),v=dot(d,q)/det,dist=dot(e2,q)/det;return u>=0&&v>=0&&u+v<=1&&dist>1e-6&&dist<max-1e-6;}
function occluded(state){
 const sign=state.out.find(r=>r.k==='v30-plane'),m=sign.m,n=m.slice(8,11),nl=Math.hypot(...n),normal=n.map(v=>v/nl),tangent=m.slice(0,3),tl=Math.hypot(...tangent);
 const ts=state.out.filter(r=>r!==sign&&r.p[0]!==5&&r.p[0]!==8).flatMap(r=>{const out=[];for(let i=0;i<r.v.length;i+=24)out.push([0,8,16].map(k=>Array.from(state.Y.M.apply(r.m,[...r.v.slice(i+k,i+k+3),1])).slice(0,3)));return out;});
 let count=0;for(const angle of[0,-.66,.66])for(const x of[-.49,-.3,-.1,0,.1,.3,.49])for(const y of[-.49,0,.49]){
  const q=Array.from(state.Y.M.apply(m,[x,y,0,1])).slice(0,3),direction=normal.map((v,i)=>v*Math.cos(angle)+tangent[i]/tl*Math.sin(angle)),origin=q.map((v,i)=>v+direction[i]*8);
  if(ts.some(t=>hit(t,origin,direction.map(v=>-v),8)))count++;
 }return count;
}
test('retained opaque geometry clears front and oblique label sightlines after the old centre-column intersection',()=>{
 assert.ok(occluded(before)>0);assert.equal(occluded(after),0);
});
