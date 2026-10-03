const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const APP=process.env.PKU_APP||path.resolve(__dirname,'..');
const candidate=fs.existsSync(path.join(__dirname,'union338.js'))?path.join(__dirname,'union338.js'):path.join(APP,'src/union338.js');
const ctx=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});
vm.runInContext('var YY={}',ctx);
let registered=false,before62,beforeIds;
for(const [,n] of fs.readFileSync(path.join(APP,'index.html'),'utf8').matchAll(/script src="src\/(.*?)\.js"/g)){
 if(n==='scene-v29')break;
 if(n==='union338'){before62=JSON.stringify(ctx.YY.CAMPUS.features.find(f=>f.properties.pickId===266));beforeIds=ctx.YY.CAMPUS.features.map(f=>f.properties.pickId);registered=true;}
 vm.runInContext(fs.readFileSync(path.join(APP,'src',n+'.js'),'utf8'),ctx,{filename:n});
}
assert.ok(registered,'union module must be loaded at its actual index position');
const Y=ctx.YY,f=Y.Union338.feature;
test('actual index dependency chain accepts unique union feature and preserves historic 62',()=>{
 assert(beforeIds.includes(1339),'source feature must exist before renderer loads');assert.equal(Y.CAMPUS.features.filter(f=>f.properties.pickId===1339).length,1);
 assert.equal(JSON.stringify(Y.CAMPUS.features.find(f=>f.properties.pickId===266)),before62);
 for(const q of ['北京大学工会','校工会','小白楼'])assert(f.properties.aliases.includes(q));
 assert(!f.properties.aliases.includes('老生物楼'));assert.equal(f.properties.union338.entranceVerified,false);
 const count=Y.CAMPUS.features.length;vm.runInContext(fs.readFileSync(candidate,'utf8'),ctx);assert.equal(Y.CAMPUS.features.length,count);
});
test('real Builder produces finite grounded pickable mass inside registered roof footprint',()=>{
 const rows=[],e={buckets:new Map(),stats:{instances:0}},b=new Y.Builder({add(k,g,m,c,p,uv){Y.Engine.prototype.add.call(e,k,g,m,c,p,uv);const v=e.buckets.get(k).geometry.v,points=[];for(let i=0;i<v.length;i+=8)points.push(Y.M.apply(m,[...v.slice(i,i+3),1]).slice(0,3));rows.push({pick:p[1],points});}});
 b.id=17;Y.Architecture30.render(b,f,()=>{throw Error('unexpected generic footprint')});assert.equal(b.id,17);assert.equal(rows.length,3);
 const bb=rows.map(r=>{assert.equal(r.pick,1339);assert(r.points.every(p=>p.every(Number.isFinite)));return [0,1,2].map(a=>[Math.min(...r.points.map(p=>p[a])),Math.max(...r.points.map(p=>p[a]))]);});
 assert(bb[0][1][0]<0);assert(bb[0][1][1]>bb[1][1][0]);assert(bb[1][1][1]>bb[2][1][0]);
 const roof=bb[2];for(const [actual,want]of [[roof[0][0],-169.05],[roof[0][1],-139.27],[roof[2][0],474.44],[roof[2][1],488.36],[roof[1][1],7]])assert(Math.abs(actual-want)<2e-5);
 const historic=Y.CAMPUS.features.find(g=>g.properties.pickId===266).properties.bounds;assert(roof[0][1]<historic[0]);
});
