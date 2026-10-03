const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
function capture(source=fs.readFileSync(root+'/src/building111-v46.js','utf8')){
 const ctx=vm.createContext({console});vm.runInContext('var YY={Architecture30:{render(){}}};',ctx);
 for(const n of ['math','geometry','engine'])vm.runInContext(fs.readFileSync(root+'/src/'+n+'.js','utf8'),ctx);
 vm.runInContext(source,ctx);ctx.document={createElement:()=>({getContext:()=>new Proxy({},{get:()=>()=>{}})})};vm.runInContext(fs.readFileSync(root+'/src/models.js','utf8'),ctx);
 const Y=ctx.YY,B=Y.Building111,f=JSON.parse(fs.readFileSync(root+'/data/campus.json')).features.find(f=>f.properties.id===B.id),out=[],engine={buckets:new Map(),stats:{instances:0}};
 engine.add=function(k,g,m,c,p){Y.Engine.prototype.add.call(this,k,g,m,c,p);out.push({k,v:Array.from(this.buckets.get(k).geometry.v),m:Array.from(m),c,p});};
 const b=new Y.Builder(engine),result=B.render(b,f);return{B,result,out,pick:f.properties.pickId};
}
const {out,pick}=capture();
const south=out.filter(c=>c.k==='111-south-windows-box');
const branches=south.filter(c=>Math.abs(Math.hypot(c.m[0],c.m[2])-.025)<1e-6);
test('south plinth spans footprint below first windows and retained lattice joins inner rails',()=>{
 const base=out.filter(c=>c.k==='111-south-wall-box'&&c.m[13]<1);
 assert.equal(base.length,1);assert.equal(base[0].c,'#a5afa6');
 // The maintained wall-foot repair reaches below ground while retaining the top.
 assert.ok(Math.abs(base[0].m[13]-base[0].m[5]/2+.01)<1e-6);
 assert.ok(Math.abs(base[0].m[13]+base[0].m[5]/2-1.01)<1e-6);
 assert.ok(Math.abs(Math.hypot(base[0].m[0],base[0].m[2])-Math.hypot(23.785,-.089))<1e-5);
 assert.equal(branches.length,48);
 for(const c of branches){const floor=c.m[13]<4?0:1,lo=1.36+3.35*floor,hi=2.73+3.35*floor;
 assert.ok(Math.abs(c.m[13]-c.m[5]/2-lo)<1e-6);assert.ok(Math.abs(c.m[13]+c.m[5]/2-hi)<1e-6);
 const rails=south.filter(r=>r.c==='#914938'&&Math.abs(r.m[5]-.065)<1e-6);
 assert.ok(rails.some(r=>Math.abs(r.m[13]-lo)<1e-6));assert.ok(rails.some(r=>Math.abs(r.m[13]-hi)<1e-6));}
 assert.ok(out.every(c=>c.p[1]===pick));
});
test('actual Engine.add first-key box cache preserves distinct south lattice placement',()=>{
 assert.deepEqual(branches[0].v,branches.at(-1).v);
 assert.equal(new Set(branches.map(c=>JSON.stringify(c.m))).size,48);
 assert.ok(branches[0].v.every(Number.isFinite));
});
function bounds(c){const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];for(let i=0;i<c.v.length;i+=8)for(let a=0;a<3;a++){const q=c.m[a]*c.v[i]+c.m[4+a]*c.v[i+1]+c.m[8+a]*c.v[i+2]+c.m[12+a];min[a]=Math.min(min[a],q);max[a]=Math.max(max[a],q);}return{min,max};}
test('Float32 cached mesh corners embed both lattice ends in their actual transom bounds',()=>{
 const rails=south.filter(r=>r.c==='#914938'&&Math.abs(r.m[5]-.065)<1e-6).map(bounds);
 for(const c of branches){const b=bounds(c);for(const end of[b.min[1],b.max[1]])assert.ok(rails.some(r=>end>=r.min[1]&&end<=r.max[1]&&b.min[0]>=r.min[0]-1e-6&&b.max[0]<=r.max[0]+1e-6&&b.min[2]>=r.min[2]-1e-6&&b.max[2]<=r.max[2]+1e-6),'branch end must intersect a real cached rail with depth contained');}
});
module.exports={capture};
