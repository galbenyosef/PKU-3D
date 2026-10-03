const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),crypto=require('node:crypto');
const app=path.resolve(process.env.PKU_APP||path.join(__dirname,'..')),candidateFile=process.env.CANDIDATE_FILE||app+'/src/yannan268-stairs201.js',names=[...fs.readFileSync(app+'/index.html','utf8').matchAll(/script src="src\/(.*?)\.js"/g)].map(m=>m[1]),vertexHashes=new WeakMap(),hash=v=>crypto.createHash('sha256').update(JSON.stringify(v,(k,a)=>{if(k==='v'&&Array.isArray(a)){let h=vertexHashes.get(a);if(!h){h=crypto.createHash('sha256').update(JSON.stringify(a)).digest('hex');vertexHashes.set(a,h);}return h;}return a;})).digest('hex');
function capture(candidate){const c=vm.createContext({console,document:{createElement:()=>({getContext:()=>new Proxy({measureText:s=>({width:s.length*20})},{get:(o,k)=>o[k]||(()=>{})})})}});vm.runInContext('var YY={}',c);const load=n=>vm.runInContext(fs.readFileSync(app+'/src/'+n+'.js','utf8'),c,{filename:n});for(const n of names){if(n==='scene-v29')break;if(n!=='yannan268-stairs201')load(n);}if(candidate)vm.runInContext(fs.readFileSync(candidateFile,'utf8'),c,{filename:candidateFile});const Y=c.YY,e=Object.create(Y.Engine.prototype);e.buckets=new Map();e.stats={instances:0};let rows=[];const sourceCache=new WeakMap(),actualCache=new WeakMap();const b=new Y.Builder({add(k,g,m,col,p,uv){Y.Engine.prototype.add.call(e,k,g,m,col,p,uv);const cv=e.buckets.get(k).geometry.v;let actual=actualCache.get(cv);if(!actual){const v=Array.from(cv);actual={v,hash:hash(v)};actualCache.set(cv,actual);}let sh=sourceCache.get(g.v);if(!sh){sh=hash(Array.from(g.v,Math.fround));sourceCache.set(g.v,sh);}assert.equal(actual.hash,sh,'first Engine cache '+k);const v=actual.v;rows.push({k,v,m:Array.from(m),c:col,p:Array.from(p),uv:uv&&Array.from(uv)});}});const render=id=>{rows=[];const f=Y.CAMPUS.features.find(f=>f.properties.pickId===id);Y.Landscape42.withElevation(b,f,()=>Y.Architecture30.render(b,f,(k,g,col,mat,id)=>b.e.add(k,g,Y.M.identity(),col,[mat,id,0,0])));return rows;};return {Y,render,rows:render(268)};}

const old=capture(false),fresh=capture(true),M=fresh.Y.M,steps=r=>r.filter(a=>a.k==='v30-yannan268-entry-step');
const before=old.rows,after=fresh.rows,bh=new Set(before.map(hash)),ah=new Set(after.map(hash)),removed=before.filter(r=>!ah.has(hash(r))),added=after.filter(r=>!bh.has(hash(r)));
const worldCache=new WeakMap(),boundsCache=new WeakMap(),world=r=>{if(worldCache.has(r))return worldCache.get(r);const p=[];for(let i=0;i<r.v.length;i+=8)p.push(M.apply(r.m,[...r.v.slice(i,i+3),1]).slice(0,3));worldCache.set(r,p);return p;};
function hit(o,d,r){const p=world(r);let bb=boundsCache.get(r);if(!bb){bb=[0,1,2].map(j=>[Math.min(...p.map(q=>q[j])),Math.max(...p.map(q=>q[j]))]);boundsCache.set(r,bb);}let near=0,far=Infinity;for(let j=0;j<3;j++){const [lo,hi]=bb[j];if(Math.abs(d[j])<1e-10){if(o[j]<lo||o[j]>hi)return Infinity;}else{const a=(lo-o[j])/d[j],b=(hi-o[j])/d[j];near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));if(far<near)return Infinity;}}let out=Infinity;for(let i=0;i<p.length;i+=3){const a=p[i],e1=M.sub(p[i+1],a),e2=M.sub(p[i+2],a),h=M.cross(d,e2),det=M.dot(e1,h);if(Math.abs(det)<1e-10)continue;const s=M.sub(o,a),u=M.dot(s,h)/det;if(u<-.000001||u>1.000001)continue;const q=M.cross(s,e1),v=M.dot(d,q)/det;if(v<-.000001||u+v>1.000001)continue;const t=M.dot(e2,q)/det;if(t>0&&t<out)out=t;}return out;}

const point=(r,p)=>M.apply(r.m,[...p,1]).slice(0,3);
function floor(x,z,rows=after){const o=[x,.6,z];let best={t:Infinity};for(const r of rows){const t=hit(o,[0,-1,0],r);if(t<best.t)best={t,r};}return {...best,y:.6-best.t};}
const slab=removed.find(r=>r.k==='v30-box'),newSlabs=added.filter(r=>r.k==='v30-box'),treads=steps(after),bounds=r=>{const p=world(r);return[0,1,2].map(k=>[Math.min(...p.map(a=>a[k])),Math.max(...p.map(a=>a[k]))]);},near=(a,b,eps=.0001)=>assert.ok(Math.abs(a-b)<eps,`${a} != ${b}`);
test('complete final Engine stream replaces only three stairs and veranda slab; all other matrices, materials, UVs, geometry and order remain identical',()=>{
 assert.equal(before.length,811);assert.equal(after.length,813);assert.equal(removed.length,4);assert.equal(added.length,6);assert.equal(treads.length,3);assert.equal(newSlabs.length,3);
 assert.equal(hash(before.filter(r=>ah.has(hash(r)))),hash(after.filter(r=>bh.has(hash(r)))));
 const keys=new Set(before.map(r=>r.k));assert.ok(after.every(r=>keys.has(r.k)));for(const r of added)assert.equal(r.p[1],268);
});
test('all three tread surfaces are exposed at 27 samples; old geometry and restoring old slab are real failing controls',()=>{
 for(const r of treads)for(const x of[-.44,0,.44])for(const z of[-.4,0,.4]){const p=point(r,[x,.5,z]);const h=floor(p[0],p[2]);assert.equal(h.r,r);near(h.y,p[1]);}
 for(const r of steps(before)){const p=point(r,[0,.5,0]),h=floor(p[0],p[2],before);assert.ok(h.y>p[1]+.001);assert.notEqual(h.r.k,r.k);}
 for(const r of treads){const p=point(r,[0,.5,0]),h=floor(p[0],p[2],after.concat(slab));assert.ok(h.y>p[1]+.001);assert.equal(h.r,slab);}
});
test('ground, three risers, preserved rear landing and threshold form a closed approach',()=>{
 const sb=bounds(slab),bb=treads.map(bounds),pb=newSlabs.map(bounds),landing=newSlabs.find(r=>r.m[10]<slab.m[10]/2),lb=bounds(landing);
 for(const b of bb)near(b[1][0],0);for(let i=1;i<3;i++){near(bb[i][2][1],bb[i-1][2][0]);near(bb[i][1][1]-bb[i-1][1][1],bb[0][1][1]);}
 near(bb[0][2][1],sb[2][1]);near(bb[2][2][0],lb[2][1]);near(lb[2][0],sb[2][0]);near(lb[1][1],sb[1][1]);assert.ok(lb[1][1]-bb[2][1][1]<.004);
 const threshold=after.find(r=>r.k==='v30-box'&&Math.abs(r.m[5]-.16*(bb[0][1][1]/.15))<.0001&&r.p[3]===.2),tb=bounds(threshold);
 near(tb[2][1],lb[2][1]);assert.ok(tb[2][0]>=lb[2][0]-.13);assert.ok(tb[1][0]<lb[1][1]&&tb[1][1]>lb[1][1]);
 // A dense centre walk checks the platform notch never becomes an empty trench.
 const x=treads[0].m[12];for(let i=0;i<90;i++){const z=tb[2][1]+(sb[2][1]-tb[2][1])*(i+.5)/90,h=floor(x,z);assert.ok(h.y>=bb[0][1][1]-.0001&&h.y<=tb[1][1]+.0001);}
 for(const side of newSlabs.filter(r=>r!==landing)){const b=bounds(side);near(b[2][0],sb[2][0]);near(b[2][1],sb[2][1]);near(b[1][1],sb[1][1]);assert.ok(b[0][1]<=bb[0][0][0]+.0001||b[0][0]>=bb[0][0][1]-.0001);}
 const post=after.filter(r=>r.k==='v30-box'&&Math.abs(r.m[5]-3.12*(bb[0][1][1]/.15))<.0001&&r.m[0]<.2&&r.m[10]<.2);assert.equal(post.length,4);for(const r of post){const b=bounds(r);assert.ok(b[0][1]<bb[0][0][0]||b[0][0]>bb[0][0][1]);}
});
test('neighbouring objects and repeat renders preserve complete final streams',()=>{for(const id of[258,259,263,264,269])assert.equal(hash(fresh.render(id)),hash(old.render(id)));assert.equal(hash(fresh.render(268)),hash(after));});
test('hooks restore exact own descriptors or inherited ownership on success, drift and upstream throw',()=>{
 for(const own of[false,true])for(const mode of['success','drift','throw']){
  const box=()=>{},heritageBox=()=>{},proto={box,heritageBox},b=Object.create(proto);b.origin=[0,0,0];b.rotation=0;b.world=p=>p.slice();
  if(own)for(const n of['box','heritageBox'])Object.defineProperty(b,n,{value:proto[n],writable:true,enumerable:false,configurable:true});
  const descriptors=['box','heritageBox'].map(n=>Object.getOwnPropertyDescriptor(b,n));
  const yy={Architecture30:{render(b){if(mode==='throw')throw Error('sentinel');b.heritageBox('yannan268-door-reveal',0,1.25,0,1.49,2.68,.22);for(let i=0;i<3;i++)b.heritageBox('yannan268-entry-step',0,0,0,1.87,.15*(i+1),.30);if(mode==='success')b.box(-1,.35,.65,10,.21,1.43,'#b3b4a9',10,.25);return 23;}}};
  vm.runInNewContext(fs.readFileSync(candidateFile,'utf8'),{YY:yy});const call=()=>yy.Architecture30.render(b,{properties:{id:'way/866277606',pickId:268}});
  if(mode==='success')assert.equal(call(),23);else assert.throws(call,mode==='throw'?/sentinel/:/registration/);
  for(const [i,n]of ['box','heritageBox'].entries()){assert.equal(b[n],proto[n]);assert.deepEqual(Object.getOwnPropertyDescriptor(b,n),descriptors[i]);}
 }
});
module.exports={old,fresh,removed,added,hash,floor,bounds};
