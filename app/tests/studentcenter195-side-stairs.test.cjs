const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const app=path.resolve(__dirname,'..'),names=[...fs.readFileSync(app+'/index.html','utf8').matchAll(/script src="src\/(.*?)\.js"/g)].map(m=>m[1]);
const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});vm.runInContext('var YY={}',ctx);
const load=n=>vm.runInContext(fs.readFileSync(app+'/src/'+n+'.js','utf8'),ctx,{filename:n});for(const n of names){if(n==='scene-v29')break;if(n!=='studentcenter195-side-stairs')load(n);}
const Y=ctx.YY,e=Object.create(Y.Engine.prototype);e.buckets=new Map();e.stats={instances:0};let rows=[];
const builder=new Y.Builder({add(k,g,m,c,p,uv){Y.Engine.prototype.add.call(e,k,g,m,c,p,uv);const v=e.buckets.get(k).geometry.v;assert.equal(v.length,g.v.length);for(let i=0;i<v.length;i++)assert.equal(v[i],Math.fround(g.v[i]));rows.push({k,v:Array.from(v),m:Array.from(m),c,p:Array.from(p),uv:uv&&Array.from(uv)});}});
function render(id){rows=[];const f=Y.CAMPUS.features.find(f=>f.properties.pickId===id);Y.Landscape42.withElevation(builder,f,()=>Y.Architecture30.render(builder,f,(k,g,c,mat,id)=>builder.e.add(k,g,Y.M.identity(),c,[mat,id,0,0])));return rows.slice();}
const before=render(195),neighbor=render(15);load('studentcenter195-side-stairs');const after=render(195),neighborAfter=render(15),spec=Y.StudentCenter195SideStairs;
const fresh=r=>r.k.startsWith('studentcenter195-side-stairs-');
function bb(r){const p=[];for(let i=0;i<r.v.length;i+=8){const w=Y.M.apply(r.m,[...r.v.slice(i,i+3),1]),q=Y.StudentCenterSouth46.local([w[0],w[2]]);p.push([q[0],w[1],q[1]]);}return[0,1,2].map(k=>[Math.min(...p.map(q=>q[k])),Math.max(...p.map(q=>q[k]))]);}
function retained(r){if(r.k==='studentcenter46-court-railings-box')return false;if(r.k==='studentcenter46-court-stone-walls-box'){const p=Y.StudentCenterSouth46.local([r.m[12],r.m[14]]);if(Math.abs(p[0]-61.07)<.001||Math.abs(p[0]-61.16)<.001)return false;}return !fresh(r);}
test('main bridge, doors, upper architecture and neighboring feature remain byte-identical',()=>{assert.deepEqual(after.filter(retained),before.filter(retained));assert.deepEqual(neighborAfter,neighbor);assert.deepEqual(render(195),after);});
test('both stairs descend monotonically and connect fitted top landings to the existing court floor',()=>{
 for(const p of spec.plans){const side=p.side<0?'north':'south',rr=after.filter(r=>r.k===`studentcenter195-side-stairs-${side}-box`&&r.p[0]===24),treads=rr.map(bb).filter(q=>Math.abs(q[2][1]-q[2][0]-spec.tread)<.0001).sort((a,b)=>p.side*((a[2][0]+a[2][1])-(b[2][0]+b[2][1])));assert.equal(treads.length,spec.steps);
  let y=spec.top;for(const q of treads){assert(q[1][1]<y+.00001);assert(Math.abs(y-q[1][1]-(spec.top-spec.floor)/spec.steps)<.00005);y=q[1][1];}assert(Math.abs(y-spec.floor)<.00001);
  const landing=rr.map(bb).find(q=>Math.abs(q[2][1]-q[2][0]-spec.landing)<.0001);assert(landing);assert(Math.abs(landing[1][1]-spec.top)<.00001);assert(Math.abs((p.side<0?landing[2][0]:landing[2][1])-p.start)<.00005);
 }
});
test('street wall, coping and guards leave both top approaches open',()=>{
 const boundary=after.filter(r=>r.k.startsWith('studentcenter195-side-stairs-boundary-')||r.k.startsWith('studentcenter195-side-stairs-street-guard-')).map(bb);
 for(const p of spec.plans){const v=(p.opening[0]+p.opening[1])/2;assert(!boundary.some(q=>q[2][0]<v&&q[2][1]>v),'no wall or rail through entrance');
  const outerRails=after.filter(r=>r.k.startsWith('studentcenter195-side-stairs-'+(p.side<0?'north':'south'))&&r.p[0]===9).map(bb);assert(!outerRails.some(q=>q[0][0]>spec.u&&q[2][0]<v&&q[2][1]>v&&q[1][1]>.5),'outer landing is not fenced shut');
 }
});
test('stairs remain inside the excavated court, with finite meshes and tread-supported posts',()=>{
 for(const r of after.filter(fresh)){assert(r.v.every(Number.isFinite));assert(r.m.every(Number.isFinite));if(r.p[0]!==9||!/^studentcenter195-side-stairs-(north|south)-/.test(r.k))continue;if(!r.k.endsWith('-box'))continue;const q=bb(r),u=(q[0][0]+q[0][1])/2,v=(q[2][0]+q[2][1])/2;assert(u>41.43&&u<61.18);assert(v>7.894&&v<49.532);const bases=after.filter(t=>fresh(t)&&t.p[0]===24).map(bb).filter(t=>u>=t[0][0]-.001&&u<=t[0][1]+.001&&v>=t[2][0]-.001&&v<=t[2][1]+.001);assert(bases.some(t=>Math.abs(t[1][1]-q[1][0])<.001),'post meets stair/landing');}
});
